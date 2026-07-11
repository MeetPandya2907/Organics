import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, addToCart } = useStore();
  
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = subtotal > 0 ? (subtotal > 1000 ? 0 : 50) : 0;
  const total = subtotal + shipping;

  const updateQty = (item, newQty) => {
    if (newQty > 0) {
      addToCart(item, newQty);
    }
  };

  return (
    <div className="bg-paper min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-forest rounded-full flex items-center justify-center text-white shadow-lg">
            <ShoppingBag size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-display text-ink font-bold">Shopping Bag</h1>
        </div>
        
        {cart.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-16 rounded-[3rem] text-center shadow-sm border border-slate-100 max-w-2xl mx-auto py-24">
            <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
              <ShoppingBag size={40} strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-display text-ink mb-4 font-bold">Your bag is empty</h2>
            <p className="text-slate-500 mb-10 max-w-md mx-auto font-medium">Looks like you haven't added any organic goodness to your bag yet. Discover our premium collections.</p>
            <Link to="/products" className="btn btn-primary px-10 shadow-lg shadow-forest/20">Explore Collection</Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* Cart Items */}
            <div className="lg:w-2/3 w-full">
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-bold text-slate-500 text-sm uppercase tracking-widest">Bag Items ({cart.reduce((a, c) => a + c.qty, 0)})</h3>
                </div>
                <AnimatePresence>
                  {cart.map((item, index) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, height: 0, overflow: 'hidden' }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      key={item._id} 
                      className="p-6 sm:p-8 border-b border-slate-100 last:border-b-0 flex flex-col sm:flex-row items-center gap-8 group transition-colors hover:bg-slate-50/30"
                    >
                      {/* Image */}
                      <Link to={`/product/${item.originalId || item._id}`} className="relative w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 bg-slate-50 rounded-[1.5rem] p-3 border border-slate-100 group-hover:border-forest/20 transition-all">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                      </Link>
                      
                      {/* Details */}
                      <div className="flex-1 text-center sm:text-left flex flex-col justify-center h-full">
                        <Link to={`/product/${item.originalId || item._id}`}>
                          <h3 className="text-xl font-bold text-ink hover:text-forest transition-colors mb-2 leading-tight">{item.name}</h3>
                        </Link>
                        <p className="text-forest font-bold text-lg mb-6">₹{item.price}</p>
                        
                        {/* Quantity Selector */}
                        <div className="inline-flex items-center justify-between border-2 border-slate-100 rounded-full h-[48px] bg-white w-[140px] p-1.5 mx-auto sm:mx-0">
                          <button 
                            className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 rounded-full transition-colors"
                            onClick={() => updateQty(item, item.qty - 1)}
                          >
                            <Minus size={16} strokeWidth={2.5} />
                          </button>
                          <div className="font-bold text-ink text-base w-8 text-center">{item.qty}</div>
                          <button 
                            className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 rounded-full transition-colors"
                            onClick={() => updateQty(item, item.qty + 1)}
                          >
                            <Plus size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Price & Delete */}
                      <div className="flex flex-col items-center sm:items-end justify-center h-full gap-8 mt-4 sm:mt-0">
                        <div className="font-bold text-2xl text-ink">
                          ₹{(item.price * item.qty).toFixed(2)}
                        </div>
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2.5 rounded-full transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-wider"
                          title="Remove Item"
                        >
                          <Trash2 size={18} /> <span className="sm:hidden block">Remove</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3 w-full">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-ink p-8 sm:p-10 rounded-[2.5rem] shadow-glass-dark text-white sticky top-32 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-forest/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                
                <h2 className="text-2xl font-display font-bold mb-8 relative z-10">Order Summary</h2>
                
                <div className="space-y-5 mb-8 relative z-10 border-b border-white/10 pb-8">
                  <div className="flex justify-between text-slate-300 font-medium text-lg">
                    <span>Subtotal</span>
                    <span className="font-bold text-white">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300 font-medium text-lg">
                    <span>Estimated Shipping</span>
                    <span className="font-bold text-white">{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                </div>
                
                {shipping > 0 && (
                  <div className="mb-8 relative z-10">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-turmeric/20 text-turmeric flex items-center justify-center shrink-0 mt-0.5">
                        <ShoppingBag size={14} strokeWidth={3} />
                      </div>
                      <div className="text-sm text-slate-300 leading-relaxed font-medium">
                        Add <strong className="text-turmeric">₹{(1000 - subtotal).toFixed(2)}</strong> more to your bag to get <strong className="text-white">Free Shipping</strong>!
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-end mb-10 relative z-10">
                  <span className="text-lg text-slate-400 font-bold uppercase tracking-widest">Total</span>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block mb-1 font-bold tracking-wider">INCLUDING GST</span>
                    <span className="text-4xl sm:text-5xl font-bold text-white leading-none">₹{total.toFixed(2)}</span>
                  </div>
                </div>
                
                <button onClick={() => navigate('/shipping')} className="btn bg-turmeric text-ink border-none w-full py-5 text-lg flex justify-center items-center gap-3 group relative z-10 hover:bg-turmeric-light hover:shadow-xl hover:shadow-turmeric/20 font-bold">
                  Proceed to Checkout
                  <ArrowRight size={20} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="mt-8 flex items-center justify-center gap-4 text-slate-400 relative z-10">
                   <div className="flex items-center gap-1.5"><ShieldCheck size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Secure</span></div>
                   <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                   <div className="flex items-center gap-1.5"><Leaf size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Organic</span></div>
                </div>
              </motion.div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

