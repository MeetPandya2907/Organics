import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Minus, Plus, ShoppingCart, Star, ShieldCheck, ArrowLeft, Leaf, Truck } from 'lucide-react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';
import Meta from '../components/Meta';
import { getVariants, getRegion, getBaseUnit } from '../utils/units';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, fetchProducts, addToCart, loading, userInfo, createReview } = useStore();
  const product = products.find((p) => p._id === id);
  const variants = product ? getVariants(product) : [];

  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);

  const relatedProducts = product ? products.filter(p => p.category === product.category && p._id !== product._id).slice(0, 4) : [];

  const quickAdd = (e, p) => {
    e.preventDefault();
    addToCart({ ...p, qty: 1 }, 1);
    toast.success(`${p.name} added to cart!`, { icon: '🛍️' });
  };

  useEffect(() => {
    if (!products.length) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  useEffect(() => {
    if (product) {
      setSelectedVariant(getVariants(product).find((v) => v.isDefault) || getVariants(product)[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?._id]);

  const addToCartHandler = () => {

    const variantLabel = selectedVariant?.label;
    addToCart({
      ...product,
      name: variantLabel ? `${product.name} (${variantLabel})` : product.name,
      price: selectedVariant?.price ?? product.price,
      _id: variantLabel ? `${product._id}-${variantLabel}` : product._id,
      originalId: product._id,
    }, qty);
    toast.success('Added to cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error('Please sign in to write a review');
      return;
    }
    const res = await createReview(id, { rating, comment });
    if (res.success) {
      toast.success(res.message);
      setRating(0);
      setComment('');
      fetchProducts();
    } else {
      toast.error(res.message);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-fittree-bg flex items-center justify-center pt-24 pb-20">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-fittree-primary"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-fittree-bg flex flex-col items-center justify-center pt-24 pb-20 text-center px-4">
      <h2 className="text-3xl font-display font-semibold text-fittree-primary mb-4">Product Not Found</h2>
      <p className="text-fittree-text-light mb-8">The harvest you're looking for doesn't exist.</p>
      <Link to="/products" className="btn btn-primary">Return to Shop</Link>
    </div>
  );

  return (
    <div className="bg-fittree-bg min-h-screen font-sans pb-24 pt-[130px] selection:bg-fittree-accent selection:text-white">
      <Meta title={`FitTree Organics | ${product.name}`} />

      <div className="max-w-[1400px] mx-auto px-6">

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[12px] font-semibold tracking-wider text-fittree-text-light mb-10 overflow-x-auto whitespace-nowrap pb-2 uppercase">
          <Link to="/" className="hover:text-fittree-primary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/products" className="hover:text-fittree-primary transition-colors">Collection</Link>
          <ChevronRight size={14} />
          <Link to={`/products?category=${product.category}`} className="hover:text-fittree-primary transition-colors">{product.category}</Link>
          <ChevronRight size={14} />
          <span className="text-fittree-primary">{product.name}</span>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-fittree-border p-8 md:p-14 mb-16 shadow-fittree-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Left: Image Gallery */}
            <div className="space-y-6">
              <div className="aspect-square rounded-[2rem] overflow-hidden bg-fittree-sand relative flex items-center justify-center p-8 group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col">
              <div className="mb-4">
                <span className="inline-block px-4 py-1.5 bg-fittree-bg text-fittree-primary text-[11px] font-bold uppercase tracking-widest rounded-md border border-fittree-border shadow-sm">
                  {product.category}
                </span>
              </div>

              <h1 className="text-[32px] md:text-[44px] font-semibold text-fittree-text mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-0.5 text-fittree-accent">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} size={18} fill={product.rating >= i ? "currentColor" : "none"} strokeWidth={product.rating >= i ? 0 : 1.5} />
                  ))}
                </div>
                <span className="text-[14px] font-semibold text-fittree-text-light">{product.numReviews} Reviews</span>
              </div>

              <div className="text-[36px] font-semibold text-fittree-text mb-8">
                ₹{selectedVariant?.price ?? product.price}<span className="text-[18px] font-medium text-fittree-text-light">/{selectedVariant?.label}</span>
              </div>

              <p className="text-fittree-text-light text-[16px] leading-relaxed mb-10 font-medium">
                {product.description}
              </p>

              {/* Weight / pack size selector */}
              <div className="mb-10">
                <span className="text-[13px] font-bold uppercase tracking-widest text-fittree-text block mb-4">Select Pack Size</span>
                <div className="flex flex-wrap gap-3">
                  {variants.map((v) => (
                    <button
                      key={v.label}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-5 py-3 rounded-xl border-2 text-[14px] font-bold transition-colors ${selectedVariant?.label === v.label
                          ? 'border-fittree-primary bg-fittree-primary/5 text-fittree-primary shadow-sm'
                          : 'border-fittree-border bg-white text-fittree-text hover:border-fittree-primary-soft'
                        }`}
                    >
                      {v.label} <span className="font-medium opacity-60 ml-1">· ₹{v.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Cart Area */}
              <div className="p-8 bg-fittree-bg rounded-3xl border border-fittree-border mb-10 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[12px] font-bold uppercase tracking-widest text-fittree-text">Availability</span>
                  {product.countInStock > 0 ? (
                    <span className="text-[12px] font-bold uppercase tracking-widest text-green-600 flex items-center gap-1.5"><ShieldCheck size={16} /> In Stock</span>
                  ) : (
                    <span className="text-[12px] font-bold uppercase tracking-widest text-red-500">Out of Stock</span>
                  )}
                </div>

                {product.countInStock > 0 && (
                  <div className="flex flex-col sm:flex-row gap-4 mt-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-white border border-fittree-border rounded-xl h-[52px] w-full sm:w-36 overflow-hidden shadow-sm">
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="flex-1 h-full flex items-center justify-center text-fittree-text-light hover:bg-fittree-bg hover:text-fittree-primary transition-colors"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="font-semibold text-fittree-text w-12 text-center text-[16px]">{qty}</span>
                      <button
                        onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                        className="flex-1 h-full flex items-center justify-center text-fittree-text-light hover:bg-fittree-bg hover:text-fittree-primary transition-colors"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    <button
                      onClick={addToCartHandler}
                      className="flex-1 btn btn-primary !h-[52px] flex items-center justify-center gap-2.5 rounded-xl text-[14px] uppercase tracking-wider"
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>
                  </div>
                )}
              </div>

              {/* Trust Features */}
              <div className="grid grid-cols-2 gap-4 mt-auto border-t border-fittree-border pt-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-fittree-sand flex items-center justify-center text-fittree-primary shrink-0 shadow-sm">
                    <Leaf size={22} />
                  </div>
                  <span className="text-[14px] font-semibold text-fittree-text">100% Organic</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-fittree-sand flex items-center justify-center text-fittree-primary shrink-0 shadow-sm">
                    <Truck size={22} />
                  </div>
                  <span className="text-[14px] font-semibold text-fittree-text">Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-20">
          <div className="flex gap-10 border-b border-fittree-border mb-10 overflow-x-auto whitespace-nowrap pb-1 hide-scrollbar">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 text-[16px] font-bold uppercase tracking-wide transition-all ${activeTab === 'description' ? 'text-fittree-primary border-b-2 border-fittree-primary' : 'text-fittree-text-light hover:text-fittree-text'}`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-[16px] font-bold uppercase tracking-wide transition-all ${activeTab === 'reviews' ? 'text-fittree-primary border-b-2 border-fittree-primary' : 'text-fittree-text-light hover:text-fittree-text'}`}
            >
              Reviews ({product.reviews ? product.reviews.length : 0})
            </button>
          </div>

          <div className="bg-white rounded-[2rem] border border-fittree-border p-8 md:p-14 shadow-sm">
            {activeTab === 'description' && (
              <div className="prose prose-lg max-w-none text-fittree-text font-medium leading-relaxed">
                <p>{product.description}</p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-fittree-bg flex items-center justify-center text-fittree-primary shadow-sm border border-fittree-border"><ShieldCheck size={16} /></span>
                    Certified Organic & Pesticide Free
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-fittree-bg flex items-center justify-center text-fittree-primary shadow-sm border border-fittree-border"><ShieldCheck size={16} /></span>
                    Directly Sourced from Local Farmers
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-fittree-bg flex items-center justify-center text-fittree-primary shadow-sm border border-fittree-border"><ShieldCheck size={16} /></span>
                    Packed with Essential Nutrients
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="mb-14">
                  <h3 className="text-[24px] font-semibold text-fittree-text mb-8">Write a Review</h3>
                  {userInfo ? (
                    <form onSubmit={submitHandler} className="max-w-2xl bg-fittree-bg p-8 rounded-3xl border border-fittree-border shadow-sm">
                      <div className="form-group mb-6">
                        <label className="form-label font-semibold text-fittree-text uppercase tracking-widest text-[12px]">Rating</label>
                        <select
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                          className="form-input !rounded-xl"
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </select>
                      </div>
                      <div className="form-group mb-8">
                        <label className="form-label font-semibold text-fittree-text uppercase tracking-widest text-[12px]">Comment</label>
                        <textarea
                          rows="4"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="form-input !rounded-xl resize-none"
                          placeholder="Tell us what you think..."
                        ></textarea>
                      </div>
                      <button type="submit" className="btn btn-primary !px-8">Submit Review</button>
                    </form>
                  ) : (
                    <div className="p-6 bg-fittree-bg border border-fittree-border rounded-2xl text-fittree-text font-medium text-[15px] shadow-sm flex items-center gap-4">
                      <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-fittree-primary border border-fittree-border"><ShieldCheck size={18} /></span>
                      <p>Please <Link to="/login" className="font-bold underline hover:text-fittree-primary transition-colors">sign in</Link> to write a review.</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-[24px] font-semibold text-fittree-text mb-8">Customer Reviews</h3>
                  {(!product.reviews || product.reviews.length === 0) ? (
                    <div className="py-12 px-8 bg-fittree-bg rounded-3xl border border-fittree-border text-center shadow-sm">
                      <p className="text-fittree-text-light font-medium text-[16px]">No reviews yet. Be the first to share your experience!</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {product.reviews.map(review => (
                        <div key={review._id} className="pb-8 border-b border-fittree-border last:border-0 last:pb-0">
                          <div className="flex items-center gap-5 mb-4">
                            <div className="w-12 h-12 rounded-full bg-fittree-sand text-fittree-primary flex items-center justify-center font-bold text-[18px] shadow-sm border border-fittree-border">
                              {review.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-fittree-text text-[15px]">{review.name}</h4>
                              <div className="flex items-center gap-3 mt-1">
                                <div className="flex items-center gap-0.5 text-fittree-accent">
                                  {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} size={14} fill={review.rating >= i ? "currentColor" : "none"} strokeWidth={review.rating >= i ? 0 : 1} />
                                  ))}
                                </div>
                                <span className="text-[12px] font-medium text-fittree-text-light">{review.createdAt?.substring(0, 10)}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-fittree-text text-[15px] font-medium leading-relaxed pl-17">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-24">
          <h3 className="text-[22px] font-bold text-fittree-text mb-8">You May Also Like</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <div key={p._id} className="product-card group p-3 sm:p-4 bg-white hover:border-fittree-primary border border-fittree-border rounded-xl shadow-sm hover:shadow-md transition-all">
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md border border-white/50 text-fittree-text text-[10px] font-bold px-2 py-1 rounded-md z-10 shadow-sm">{getBaseUnit(p)}</span>
                {p.countInStock === 0 ? (
                  <span className="absolute top-4 right-4 bg-red-500 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md z-10 shadow-sm">Sold Out</span>
                ) : (
                  <span className="absolute top-4 right-4 bg-fittree-primary/95 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md z-10 shadow-sm">{getRegion(p)}</span>
                )}
                
                <Link to={`/product/${p._id}`} className="block h-[150px] sm:h-[180px] bg-fittree-sand rounded-xl overflow-hidden mb-3 relative">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" />
                </Link>

                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <Link to={`/product/${p._id}`} className="flex-1">
                      <h3 className="text-[13px] sm:text-[14px] font-bold text-fittree-text leading-snug hover:text-fittree-primary transition-colors line-clamp-2 pr-2">{p.name}</h3>
                    </Link>
                    <span className="text-[10px] font-bold text-fittree-accent flex items-center gap-1 shrink-0 bg-fittree-bg px-1.5 py-1 rounded">
                      <Star size={10} fill="currentColor" stroke="none" /> {p.rating?.toFixed(1) || '—'}
                    </span>
                  </div>
                  <p className="text-[11px] text-fittree-text-light font-medium mb-3 line-clamp-1">{p.description}</p>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-[15px] font-bold text-fittree-text">₹{p.price} <span className="text-[10px] text-fittree-text-light font-medium block">/{getBaseUnit(p)}</span></span>
                    
                    <button
                      disabled={p.countInStock === 0}
                      onClick={(e) => quickAdd(e, p)}
                      className={`px-4 py-1.5 rounded-lg font-bold text-[12px] transition-all flex items-center justify-center gap-1 uppercase tracking-wider ${
                        p.countInStock === 0
                          ? 'bg-fittree-sand text-fittree-text-light cursor-not-allowed'
                          : 'bg-white border border-fittree-primary text-fittree-primary hover:bg-fittree-primary hover:text-white shadow-sm'
                      }`}
                    >
                      {p.countInStock === 0 ? 'Sold' : 'ADD'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetailPage;
