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
    <div className="bg-fittree-bg min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-fittree-primary rounded-sm flex items-center justify-center text-white shadow-sm">
            <ShoppingBag size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-display text-fittree-dark font-bold">Shopping Bag</h1>
        </div>
        
        {cart.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-16 rounded-sm text-center border border-fittree-border max-w-2xl mx-auto py-24">
            <div className="w-24 h-24 bg-fittree-light text-fittree-primary rounded-full flex items-center justify-center mx-auto mb-8 border border-fittree-border">
              <ShoppingBag size={40} strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-display text-fittree-dark mb-4 font-bold">Your bag is empty</h2>
            <p className="text-fittree-text-light mb-10 max-w-md mx-auto font-medium">Looks like you haven't added any organic goodness to your bag yet. Discover our premium collections.</p>
            <Link to="/products" className="btn btn-primary px-10">Explore Collection</Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* Cart Items */}
            <div className="lg:w-2/3 w-full">
              <div className="bg-white rounded-sm border border-fittree-border overflow-hidden">
                <div className="px-8 py-5 border-b border-fittree-border bg-fittree-light/50">
                  <h3 className="font-bold text-fittree-text text-sm uppercase tracking-widest">Bag Items ({cart.reduce((a, c) => a + c.qty, 0)})</h3>
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
                      className="p-6 sm:p-8 border-b border-fittree-border last:border-b-0 flex flex-col sm:flex-row items-center gap-8 group transition-colors hover:bg-fittree-light/30"
                    >
                      {/* Image */}
                      <Link to={`/product/${item.originalId || item._id}`} className="relative w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 bg-white rounded-sm p-3 border border-fittree-border group-hover:border-fittree-primary/20 transition-all">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                      </Link>
                      
                      {/* Details */}
                      <div className="flex-1 text-center sm:text-left flex flex-col justify-center h-full">
                        <Link to={`/product/${item.originalId || item._id}`}>
                          <h3 className="text-[17px] font-bold text-fittree-dark hover:text-fittree-primary transition-colors mb-2 leading-tight">{item.name}</h3>
                        </Link>
                        <p className="text-fittree-primary font-bold text-[15px] mb-6">₹{item.price}</p>
                        
                        {/* Quantity Selector */}
                        <div className="inline-flex items-center justify-between border border-fittree-border rounded-sm h-[40px] bg-white w-[120px] p-1 mx-auto sm:mx-0">
                          <button 
                            className="w-8 h-8 flex items-center justify-center text-fittree-text hover:text-fittree-dark hover:bg-fittree-light transition-colors"
                            onClick={() => updateQty(item, item.qty - 1)}
                          >
                            <Minus size={14} strokeWidth={2.5} />
                          </button>
                          <div className="font-bold text-fittree-dark text-sm w-8 text-center">{item.qty}</div>
                          <button 
                            className="w-8 h-8 flex items-center justify-center text-fittree-text hover:text-fittree-dark hover:bg-fittree-light transition-colors"
                            onClick={() => updateQty(item, item.qty + 1)}
                          >
                            <Plus size={14} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Price & Delete */}
                      <div className="flex flex-col items-center sm:items-end justify-center h-full gap-8 mt-4 sm:mt-0">
                        <div className="font-bold text-xl text-fittree-dark">
                          ₹{(item.price * item.qty).toFixed(2)}
                        </div>
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="text-fittree-text-light hover:text-red-500 hover:bg-red-50 p-2.5 rounded-full transition-colors flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider"
                          title="Remove Item"
                        >
                          <Trash2 size={16} /> <span className="sm:hidden block">Remove</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3 w-full">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 sm:p-10 rounded-2xl border border-fittree-border sticky top-32 overflow-hidden relative shadow-sm">
                
                <h2 className="text-[20px] font-bold text-fittree-text mb-8 relative z-10">Order Summary</h2>
                
                <div className="space-y-4 mb-8 relative z-10 border-b border-fittree-border pb-8">
                  <div className="flex justify-between text-fittree-text-light font-medium text-[15px]">
                    <span>Subtotal</span>
                    <span className="font-bold text-fittree-text">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-fittree-text-light font-medium text-[15px]">
                    <span>Estimated Shipping</span>
                    <span className="font-bold text-fittree-text">{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                </div>
                
                {shipping > 0 && (
                  <div className="mb-8 relative z-10">
                    <div className="bg-fittree-primary/10 border border-fittree-primary/20 p-4 rounded-xl flex items-start gap-3">
                      <div className="w-8 h-8 bg-fittree-primary/20 text-fittree-primary flex items-center justify-center shrink-0 mt-0.5 rounded-lg">
                        <ShoppingBag size={14} strokeWidth={3} />
                      </div>
                      <div className="text-[13px] text-fittree-text leading-relaxed font-medium">
                        Add <strong className="text-fittree-primary">₹{(1000 - subtotal).toFixed(2)}</strong> more to your bag to get <strong>Free Shipping</strong>!
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-end mb-10 relative z-10">
                  <span className="text-[14px] text-fittree-text-light font-bold uppercase tracking-widest">Total</span>
                  <div className="text-right">
                    <span className="text-[10px] text-fittree-text-light block mb-1 font-bold tracking-widest">INCLUDING GST</span>
                    <span className="text-3xl sm:text-4xl font-bold text-fittree-text leading-none">₹{total.toFixed(2)}</span>
                  </div>
                </div>
                
                <button onClick={() => navigate('/shipping')} className="btn btn-primary w-full py-4 text-[15px] uppercase tracking-wider flex justify-center items-center gap-3 group relative z-10 rounded-xl">
                  Proceed to Checkout
                  <ArrowRight size={17} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="mt-8 flex items-center justify-center gap-4 text-fittree-text-light relative z-10">
                   <div className="flex items-center gap-1.5"><ShieldCheck size={16} /> <span className="text-[11px] font-bold uppercase tracking-widest">Secure</span></div>
                   <div className="w-1 h-1 bg-fittree-border rounded-full"></div>
                   <div className="flex items-center gap-1.5"><Leaf size={16} /> <span className="text-[11px] font-bold uppercase tracking-widest">Organic</span></div>
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

