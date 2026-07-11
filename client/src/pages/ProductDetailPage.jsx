import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Minus, Plus, ShoppingCart, Star, ShieldCheck, Leaf, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart, userInfo, createReview } = useStore();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState('250g');
  const [packaging, setPackaging] = useState('Eco Pouch');
  const [activeTab, setActiveTab] = useState('description');
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
      setLoading(false);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      navigate('/login');
      return;
    }
    const res = await createReview(id, { rating, comment });
    if (res.success) {
      setReviewSuccess('Review submitted successfully!');
      setComment('');
      setRating(5);
      fetchProduct();
    } else {
      setReviewError(res.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-paper">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-paper px-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-12 rounded-[2.5rem] shadow-glass border border-red-100 max-w-md text-center">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Leaf size={40} className="rotate-45" />
          </div>
          <h2 className="text-3xl text-ink font-display mb-3">Oops!</h2>
          <p className="text-slate-500 mb-8 font-medium">{error || 'Product not found'}</p>
          <Link to="/products" className="btn btn-primary w-full shadow-lg">Back to Collection</Link>
        </motion.div>
      </div>
    );
  }

  const sizeMultipliers = { '250g': 1, '500g': 1.8, '1kg': 3.2 };
  const packagingPrices = { 'Eco Pouch': 0, 'Glass Jar': 50 };
  const finalPrice = Math.round((product.price * sizeMultipliers[size]) + packagingPrices[packaging]);

  return (
    <div className="bg-paper min-h-screen pb-24 pt-24">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        
        {/* Breadcrumbs */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-wrap items-center gap-3 text-[13px] font-semibold text-slate-400 mb-10 tracking-wide uppercase">
          <Link to="/products" className="inline-flex items-center gap-1.5 hover:text-forest transition-colors">
            <ArrowLeft size={16} /> Shop Collection
          </Link>
          <ChevronRight size={14} className="opacity-40" />
          <span className="text-forest bg-forest/5 px-3 py-1 rounded-full">{product.name}</span>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20 mb-32">
          
          {/* Left: Image Gallery */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full lg:w-[45%] relative">
            <div className="sticky top-32">
              <div className="relative aspect-[4/5] bg-white rounded-[3rem] flex items-center justify-center p-12 overflow-hidden border border-slate-100 shadow-sm group">
                <span className="absolute top-8 left-8 bg-paper text-ink px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest z-10 border border-slate-200 shadow-sm">
                  {product.category || 'Organic'}
                </span>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop' }}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-1000 ease-out mix-blend-multiply drop-shadow-xl"
                />
              </div>
            </div>
          </motion.div>

          {/* Right: Product Info */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="w-full lg:w-[55%] flex flex-col justify-center">
            
            <div className="flex items-center gap-2 text-turmeric mb-4">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={16} fill={i <= product.rating ? "currentColor" : "none"} stroke="currentColor" className={i <= product.rating ? "" : "text-slate-200"} />
                ))}
              </div>
              <span className="text-slate-500 text-sm ml-2 font-medium">({product.numReviews} Reviews)</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display mb-6 text-ink leading-[1.1] font-bold">
              {product.name}
            </h1>
            
            <div className="text-[2rem] font-bold text-forest mb-8 flex items-baseline gap-2">
              ₹{finalPrice}
              <span className="text-base font-medium text-slate-400">/ {size}</span>
            </div>

            <p className="text-lg text-slate-600 leading-relaxed mb-10 font-medium">
              {product.description}
            </p>

            <div className="flex flex-col gap-8 mb-10 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              {/* Size Selector */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Select Quantity</h4>
                <div className="flex flex-wrap gap-3">
                  {['250g', '500g', '1kg'].map(s => (
                    <button 
                      key={s} 
                      onClick={() => setSize(s)}
                      className={`px-6 py-3 rounded-xl border-2 font-bold transition-all text-sm ${size === s ? 'border-forest bg-forest text-white shadow-md' : 'border-slate-100 text-slate-500 hover:border-slate-300 bg-slate-50 hover:bg-slate-100'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Packaging Selector */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Packaging Type</h4>
                <div className="flex flex-wrap gap-3">
                  {['Eco Pouch', 'Glass Jar'].map(p => (
                    <button 
                      key={p} 
                      onClick={() => setPackaging(p)}
                      className={`px-6 py-3 rounded-xl border-2 font-bold transition-all text-sm flex items-center gap-2 ${packaging === p ? 'border-turmeric bg-turmeric text-white shadow-md' : 'border-slate-100 text-slate-500 hover:border-slate-300 bg-slate-50 hover:bg-slate-100'}`}
                    >
                      {p === 'Eco Pouch' ? <Leaf size={16} /> : <CheckCircle2 size={16} />}
                      {p} 
                      {p === 'Glass Jar' && <span className={`text-[11px] ${packaging === p ? 'text-turmeric-100' : 'text-turmeric'}`}>(+₹50)</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <div className="flex items-center gap-2.5 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                <Leaf className="text-leaf" size={18} strokeWidth={2} />
                <span className="font-bold text-slate-600 text-[13px] uppercase tracking-wider">100% Organic</span>
              </div>
              <div className="flex items-center gap-2.5 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                <ShieldCheck className="text-blue-500" size={18} strokeWidth={2} />
                <span className="font-bold text-slate-600 text-[13px] uppercase tracking-wider">Lab Tested</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center justify-between border-2 border-slate-100 rounded-full h-[60px] bg-white w-full sm:w-[150px] p-1.5">
                <button 
                  className="w-11 h-11 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-ink rounded-full transition-colors"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                >
                  <Minus size={18} strokeWidth={2.5} />
                </button>
                <div className="w-8 h-full flex items-center justify-center font-bold text-lg text-ink">
                  {qty}
                </div>
                <button 
                  className="w-11 h-11 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-ink rounded-full transition-colors"
                  onClick={() => setQty(qty + 1)}
                >
                  <Plus size={18} strokeWidth={2.5} />
                </button>
              </div>
              
              <button 
                onClick={() => {
                  if (!userInfo) { navigate('/login'); }
                  else {
                    addToCart({
                      ...product,
                      price: finalPrice,
                      name: `${product.name} (${size} - ${packaging})`,
                      _id: `${product._id}-${size}-${packaging}`,
                      originalId: product._id
                    }, qty); 
                  }
                }}
                className="btn btn-primary flex-1 h-[60px] text-lg hover:shadow-lg hover:shadow-forest/20 gap-3 group"
              >
                <ShoppingCart size={20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                Add to Cart — ₹{(finalPrice * qty).toFixed(2)}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-5xl mx-auto bg-white rounded-[3rem] p-8 md:p-16 border border-slate-100 shadow-sm">
          <div className="flex justify-center flex-wrap gap-4 md:gap-12 border-b border-slate-100 mb-12 pb-4">
            {['description', 'details', 'reviews'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[15px] md:text-lg font-bold uppercase tracking-widest transition-all relative px-4 py-2 ${
                  activeTab === tab ? 'text-forest' : 'text-slate-400 hover:text-ink'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-[3px] bg-forest rounded-t-full"></motion.div>
                )}
              </button>
            ))}
          </div>
          
          <div className="text-lg text-slate-600">
            {activeTab === 'description' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center max-w-3xl mx-auto font-medium leading-relaxed">
                <p>{product.description}</p>
                <p className="mt-8">Our mission is to bring you the highest quality organic produce directly from sustainable farms. Every product is rigorously tested to ensure it meets our strict organic standards, providing you with nutrition as nature intended.</p>
              </motion.div>
            )}
            {activeTab === 'details' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4 max-w-3xl mx-auto">
                <div className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl"><strong className="text-ink font-bold text-sm uppercase tracking-wider">Category</strong> <span className="uppercase tracking-widest text-xs bg-white px-3 py-1.5 rounded-full text-forest font-bold border border-slate-100 shadow-sm">{product.category || 'Organic'}</span></div>
                <div className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl"><strong className="text-ink font-bold text-sm uppercase tracking-wider">Origin</strong> <span className="font-medium">Directly sourced from Indian organic farms.</span></div>
                <div className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl"><strong className="text-ink font-bold text-sm uppercase tracking-wider">Packaging</strong> <span className="font-medium">Premium sealed eco-pouch to preserve freshness.</span></div>
                <div className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl"><strong className="text-ink font-bold text-sm uppercase tracking-wider">Net Weight</strong> <span className="font-medium">250g Standard</span></div>
              </motion.div>
            )}
            {activeTab === 'reviews' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4">
                <div className="flex flex-col lg:flex-row gap-16 text-left">
                  <div className="lg:w-1/2">
                    <h3 className="text-2xl text-ink font-display font-bold mb-8">Customer Reviews</h3>
                    {product.reviews.length === 0 ? (
                      <div className="text-center py-16 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <div className="w-16 h-16 bg-white border border-slate-200 text-turmeric rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                          <Star size={24} fill="currentColor" />
                        </div>
                        <p className="text-slate-500 font-medium">No reviews yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                        {product.reviews.map((review) => (
                          <div key={review._id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-bold text-ink">{review.name}</h4>
                                <div className="flex gap-1 text-turmeric mt-1.5">
                                  {[1,2,3,4,5].map(i => (
                                    <Star key={i} size={14} fill={i <= review.rating ? "currentColor" : "none"} stroke="currentColor" className={i <= review.rating ? "" : "text-slate-300"} />
                                  ))}
                                </div>
                              </div>
                              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-slate-600 mt-4 text-[15px] font-medium leading-relaxed">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="lg:w-1/2">
                    <div className="bg-ink p-8 md:p-10 rounded-[2.5rem] shadow-glass-dark text-white relative overflow-hidden">
                      <div className="absolute -top-20 -right-20 w-64 h-64 bg-forest/30 rounded-full blur-[60px]"></div>
                      <h3 className="text-2xl font-display font-bold mb-8 relative z-10">Write a Review</h3>
                      
                      {reviewError && <div className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-6 text-sm border border-red-500/20 font-medium relative z-10">{reviewError}</div>}
                      {reviewSuccess && <div className="bg-leaf/10 text-leaf p-4 rounded-xl mb-6 text-sm border border-leaf/20 font-medium relative z-10">{reviewSuccess}</div>}
                      
                      {userInfo ? (
                        <form onSubmit={submitReviewHandler} className="space-y-6 relative z-10">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Your Rating</label>
                            <select 
                              value={rating} 
                              onChange={(e) => setRating(Number(e.target.value))}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-leaf text-white font-medium appearance-none"
                            >
                              <option value="5" className="text-ink">5 - Excellent</option>
                              <option value="4" className="text-ink">4 - Very Good</option>
                              <option value="3" className="text-ink">3 - Good</option>
                              <option value="2" className="text-ink">2 - Fair</option>
                              <option value="1" className="text-ink">1 - Poor</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Your Comment</label>
                            <textarea 
                              rows="4" 
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="What did you like or dislike?"
                              required
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-leaf resize-none text-white placeholder-slate-500 font-medium"
                            ></textarea>
                          </div>
                          <button type="submit" className="btn bg-turmeric text-white w-full hover:bg-turmeric-light border-none">Submit Review</button>
                        </form>
                      ) : (
                        <div className="text-center py-10 relative z-10">
                          <p className="text-slate-400 font-medium mb-6">Please sign in to write a review.</p>
                          <Link to={`/login?redirect=/product/${id}`} className="btn bg-white/10 text-white border-white/20 hover:bg-white/20">Sign In</Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ProductDetailPage;
