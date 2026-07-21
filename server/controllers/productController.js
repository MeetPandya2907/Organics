import Product from '../models/productModel.js';
import NodeCache from 'node-cache';
import { notifyBackInStock } from './stockAlertController.js';

const myCache = new NodeCache({ stdTTL: 300, checkperiod: 320 }); // Cache for 5 minutes

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

  const cacheKey = `products_${page}_${pageSize}_${keywordString}_${category}_${minPrice}_${maxPrice}_${sort}`;
  if (myCache.has(cacheKey)) {
    return res.json(myCache.get(cacheKey));
  }

  const query = {};

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
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [],
    category: 'SPICES',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await product.save();
  myCache.flushAll(); // Clear cache when products change
  res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const { name, price, description, image, images, category, countInStock } = req.body;

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
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

export { getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview };
