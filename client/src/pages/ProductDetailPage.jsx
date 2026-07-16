import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Minus, Plus, ShoppingCart, Star, ShieldCheck, ArrowLeft, Leaf, Truck } from 'lucide-react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';
import Meta from '../components/Meta';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, fetchProducts, addToCart, loading, userInfo, createReview } = useStore();
  const product = products.find((p) => p._id === id);

  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!products.length) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  const addToCartHandler = () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    addToCart(product, qty);
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
      <h2 className="text-3xl font-display font-bold text-fittree-dark mb-4">Product Not Found</h2>
      <p className="text-fittree-text-light mb-8">The harvest you're looking for doesn't exist.</p>
      <Link to="/products" className="btn btn-primary">Return to Shop</Link>
    </div>
  );

  return (
    <div className="bg-fittree-bg min-h-screen font-sans pb-20 pt-28">
      <Meta title={`FitTree Organics | ${product.name}`} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[13px] font-medium text-fittree-text-light mb-10 overflow-x-auto whitespace-nowrap pb-2">
          <Link to="/" className="hover:text-fittree-primary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/products" className="hover:text-fittree-primary transition-colors">Shop</Link>
          <ChevronRight size={14} />
          <Link to={`/products?category=${product.category}`} className="hover:text-fittree-primary transition-colors capitalize">{product.category}</Link>
          <ChevronRight size={14} />
          <span className="text-fittree-dark">{product.name}</span>
        </div>

        <div className="bg-white rounded-[2rem] shadow-fittree-sm border border-fittree-border p-6 md:p-10 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Left: Image Gallery */}
            <div className="space-y-6">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-fittree-bg relative border border-fittree-border shadow-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col">
              <div className="mb-2">
                <span className="inline-block px-3 py-1 bg-fittree-primary/10 text-fittree-primary text-xs font-bold uppercase tracking-wider rounded-md">
                  {product.category}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-display font-bold text-fittree-dark mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center text-yellow-400">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} size={16} fill={product.rating >= i ? "currentColor" : "none"} strokeWidth={product.rating >= i ? 0 : 1.5} />
                  ))}
                </div>
                <span className="text-sm font-medium text-fittree-text-light">{product.numReviews} Reviews</span>
              </div>

              <div className="text-3xl font-bold text-fittree-text mb-8">
                ₹{product.price}<span className="text-lg font-normal text-fittree-text-light">/unit</span>
              </div>

              <p className="text-fittree-text leading-relaxed mb-10">
                {product.description}
              </p>

              {/* Add to Cart Area */}
              <div className="p-6 bg-fittree-bg rounded-2xl border border-fittree-border mb-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-fittree-text">Availability</span>
                  {product.countInStock > 0 ? (
                    <span className="text-sm font-bold text-fittree-primary flex items-center gap-1.5"><ShieldCheck size={16} /> In Stock</span>
                  ) : (
                    <span className="text-sm font-bold text-red-500">Out of Stock</span>
                  )}
                </div>

                {product.countInStock > 0 && (
                  <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-white border border-fittree-border rounded-xl h-12 w-full sm:w-32 shadow-sm overflow-hidden">
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="flex-1 h-full flex items-center justify-center text-fittree-text-light hover:bg-fittree-bg hover:text-fittree-dark transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-bold text-fittree-dark w-10 text-center">{qty}</span>
                      <button
                        onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                        className="flex-1 h-full flex items-center justify-center text-fittree-text-light hover:bg-fittree-bg hover:text-fittree-dark transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={addToCartHandler}
                      className="flex-1 btn btn-primary h-12 shadow-md flex items-center justify-center gap-2 rounded-xl text-base"
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
                  <div className="w-10 h-10 rounded-full bg-fittree-primary/10 flex items-center justify-center text-fittree-primary">
                    <Leaf size={20} />
                  </div>
                  <span className="text-sm font-semibold text-fittree-dark">100% Organic</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-fittree-primary/10 flex items-center justify-center text-fittree-primary">
                    <Truck size={20} />
                  </div>
                  <span className="text-sm font-semibold text-fittree-dark">Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-16">
          <div className="flex gap-8 border-b border-fittree-border mb-8 overflow-x-auto whitespace-nowrap pb-2">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 text-lg font-bold transition-all ${activeTab === 'description' ? 'text-fittree-primary border-b-2 border-fittree-primary' : 'text-fittree-text-light hover:text-fittree-dark'}`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-lg font-bold transition-all ${activeTab === 'reviews' ? 'text-fittree-primary border-b-2 border-fittree-primary' : 'text-fittree-text-light hover:text-fittree-dark'}`}
            >
              Reviews ({product.reviews ? product.reviews.length : 0})
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-fittree-sm border border-fittree-border p-8 md:p-12">
            {activeTab === 'description' && (
              <div className="prose prose-lg max-w-none text-fittree-text">
                <p>{product.description}</p>
                <ul className="mt-6 space-y-2 font-medium">
                  <li className="flex items-center gap-3">
                    <ShieldCheck className="text-fittree-primary" size={20} /> Certified Organic & Pesticide Free
                  </li>
                  <li className="flex items-center gap-3">
                    <ShieldCheck className="text-fittree-primary" size={20} /> Directly Sourced from Local Farmers
                  </li>
                  <li className="flex items-center gap-3">
                    <ShieldCheck className="text-fittree-primary" size={20} /> Packed with Essential Nutrients
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-fittree-dark mb-6">Write a Review</h3>
                  {userInfo ? (
                    <form onSubmit={submitHandler} className="max-w-2xl bg-fittree-bg p-6 rounded-2xl border border-fittree-border">
                      <div className="form-group">
                        <label className="form-label">Rating</label>
                        <select
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                          className="form-input"
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Comment</label>
                        <textarea
                          rows="4"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="form-input resize-none"
                          placeholder="Tell us what you think..."
                        ></textarea>
                      </div>
                      <button type="submit" className="btn btn-primary">Submit Review</button>
                    </form>
                  ) : (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 font-medium text-sm">
                      Please <Link to="/login" className="font-bold underline hover:text-yellow-900">sign in</Link> to write a review.
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-fittree-dark mb-6">Customer Reviews</h3>
                  {(!product.reviews || product.reviews.length === 0) ? (
                    <p className="text-fittree-text-light font-medium p-8 bg-fittree-bg rounded-xl border border-fittree-border text-center">No reviews yet. Be the first!</p>
                  ) : (
                    <div className="space-y-6">
                      {product.reviews.map(review => (
                        <div key={review._id} className="pb-6 border-b border-fittree-border last:border-0 last:pb-0">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-10 h-10 rounded-full bg-fittree-primary/20 text-fittree-primary flex items-center justify-center font-bold">
                              {review.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-fittree-dark">{review.name}</h4>
                              <div className="flex items-center text-yellow-400 mt-0.5">
                                {[1, 2, 3, 4, 5].map(i => (
                                  <Star key={i} size={12} fill={review.rating >= i ? "currentColor" : "none"} strokeWidth={review.rating >= i ? 0 : 1} />
                                ))}
                                <span className="text-[11px] text-fittree-text-light ml-2">{review.createdAt?.substring(0, 10)}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-fittree-text text-sm leading-relaxed">{review.comment}</p>
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
    </div>
  );
};

export default ProductDetailPage;
