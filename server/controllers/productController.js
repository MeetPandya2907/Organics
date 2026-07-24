import Product from '../models/productModel.js';
import NodeCache from 'node-cache';
import { notifyBackInStock } from './stockAlertController.js';

const myCache = new NodeCache({ stdTTL: 300, checkperiod: 320 }); // Cache for 5 minutes

// Exposed so other controllers (e.g. orders, on stock reservation/release)
// can invalidate the product list cache without duplicating a NodeCache instance.
export const flushProductCache = () => myCache.flushAll();

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 8;
  const page = Number(req.query.pageNumber) || 1;
  const keywordString = req.query.keyword || '';
  const category = req.query.category || '';
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : 0;
  const sort = req.query.sort || 'newest'; // newest, price_asc, price_desc, toprated
  const showAll = req.query.showAll === 'true'; // admin flag to see Draft/Archived

  const cacheKey = `products_${page}_${pageSize}_${keywordString}_${category}_${minPrice}_${maxPrice}_${sort}_${showAll}`;
  if (myCache.has(cacheKey)) {
    return res.json(myCache.get(cacheKey));
  }

  const query = {};

  // Public API only shows Published products; admin can see all with ?showAll=true
  if (!showAll) {
    query.$or = [
      { status: 'Published' },
      { status: { $exists: false } },  // backwards compat: old products without status field
    ];
  }

  if (keywordString) {
    query.name = {
      $regex: keywordString,
      $options: 'i',
    };
  }

  if (category && category !== 'All' && category !== 'ALL') {
    query.category = { $regex: new RegExp(`^${category}$`, 'i') };
  }

  if (minPrice > 0 || maxPrice > 0) {
    query.price = {};
    if (minPrice > 0) query.price.$gte = minPrice;
    if (maxPrice > 0) query.price.$lte = maxPrice;
  }

  let sortOrder = {};
  if (sort === 'price_asc') {
    sortOrder = { price: 1 };
  } else if (sort === 'price_desc') {
    sortOrder = { price: -1 };
  } else if (sort === 'toprated') {
    sortOrder = { rating: -1 };
  } else {
    sortOrder = { createdAt: -1 }; // newest
  }

  const count = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sortOrder)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  const responseData = { products, page, pages: Math.ceil(count / pageSize) };
  myCache.set(cacheKey, responseData);

  res.json(responseData);
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    myCache.flushAll(); // Clear cache
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const {
    name, price, description, image, images, category, countInStock,
    sku, tagline, tags, origin, benefits, discount, baseUnit, sizes,
    mrp, status, nutrition, ingredients, storageInstructions, shelfLife,
    fssaiLicense, hsnCode, metaTitle, metaDescription,
  } = req.body;

  // Auto-compute discount from MRP vs price
  const numericMrp = Number(mrp) || 0;
  const numericPrice = Number(price) || 0;
  const autoDiscount = numericMrp > numericPrice && numericPrice > 0
    ? Math.round(((numericMrp - numericPrice) / numericMrp) * 100)
    : (Number(discount) || 0);

  const product = new Product({
    name: name || 'Sample name',
    price: numericPrice,
    mrp: numericMrp,
    user: req.user._id,
    image: image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: images || [],
    category: category || 'SPICES',
    countInStock: countInStock || 0,
    numReviews: 0,
    description: description || 'Sample description',
    sku: sku || '',
    tagline: tagline || '',
    tags: tags || '',
    origin: origin || '',
    benefits: benefits || '',
    discount: autoDiscount,
    baseUnit: baseUnit || '',
    sizes: sizes || [],
    status: status || 'Published',
    nutrition: nutrition || [],
    ingredients: ingredients || '',
    storageInstructions: storageInstructions || '',
    shelfLife: shelfLife || '',
    fssaiLicense: fssaiLicense || '',
    hsnCode: hsnCode || '',
    metaTitle: metaTitle || '',
    metaDescription: metaDescription || '',
  });

  const createdProduct = await product.save();
  myCache.flushAll(); // Clear cache when products change
  res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const {
    name, price, description, image, images, category, countInStock,
    sku, tagline, tags, origin, benefits, discount, baseUnit, sizes,
    mrp, status, nutrition, ingredients, storageInstructions, shelfLife,
    fssaiLicense, hsnCode, metaTitle, metaDescription,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const wasOutOfStock = product.countInStock === 0;

    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    if (images !== undefined) product.images = images;
    product.category = category;
    product.countInStock = countInStock;

    // Auto-compute discount from MRP vs price
    const numericMrp = Number(mrp) || 0;
    const numericPrice = Number(price) || 0;
    if (mrp !== undefined) product.mrp = numericMrp;
    if (numericMrp > numericPrice && numericPrice > 0) {
      product.discount = Math.round(((numericMrp - numericPrice) / numericMrp) * 100);
    } else if (discount !== undefined) {
      product.discount = Number(discount) || 0;
    }

    // Extended fields
    if (sku !== undefined) product.sku = sku;
    if (tagline !== undefined) product.tagline = tagline;
    if (tags !== undefined) product.tags = tags;
    if (origin !== undefined) product.origin = origin;
    if (benefits !== undefined) product.benefits = benefits;
    if (baseUnit !== undefined) product.baseUnit = baseUnit;
    if (sizes !== undefined) product.sizes = sizes;
    if (status !== undefined) product.status = status;
    if (nutrition !== undefined) product.nutrition = nutrition;
    if (ingredients !== undefined) product.ingredients = ingredients;
    if (storageInstructions !== undefined) product.storageInstructions = storageInstructions;
    if (shelfLife !== undefined) product.shelfLife = shelfLife;
    if (fssaiLicense !== undefined) product.fssaiLicense = fssaiLicense;
    if (hsnCode !== undefined) product.hsnCode = hsnCode;
    if (metaTitle !== undefined) product.metaTitle = metaTitle;
    if (metaDescription !== undefined) product.metaDescription = metaDescription;

    const updatedProduct = await product.save();

    if (wasOutOfStock && updatedProduct.countInStock > 0) {
      notifyBackInStock(updatedProduct); // fire-and-forget, never blocks the response
    }
    myCache.flushAll(); // Clear cache
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400).json({ message: 'Product already reviewed' });
      return;
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    myCache.flushAll(); // Clear cache so getProducts reflects the new review and rating
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Delete a review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private
const deleteProductReview = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    const review = product.reviews.find(r => r._id.toString() === req.params.reviewId.toString());

    if (!review) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }

    // Only allow the user who created the review or an admin to delete it
    if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401).json({ message: 'Not authorized to delete this review' });
      return;
    }

    product.reviews = product.reviews.filter(r => r._id.toString() !== req.params.reviewId.toString());
    product.numReviews = product.reviews.length;

    if (product.numReviews > 0) {
      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    } else {
      product.rating = 0;
    }

    await product.save();
    myCache.flushAll(); // Clear cache
    res.json({ message: 'Review removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

export { getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview, deleteProductReview };
