import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingCart, Minus, Plus, Trash2, ArrowRight, ShieldCheck, Leaf, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';

const FREE_SHIPPING_THRESHOLD = 1000;

const CartDrawer = ({ open, onClose }) => {
  const { cart, removeFromCart, addToCart } = useStore();
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const toFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const freeShippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  // Prevent body scroll when drawer open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const updateQty = (item, newQty) => {
    if (newQty < 1) return;
    addToCart(item, newQty);
  };

  const goToCheckout = () => {
    onClose();
    navigate('/shipping');
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[998]"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-[999] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-fittree-border shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-fittree-primary text-white flex items-center justify-center">
                  <ShoppingCart size={18} />
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-fittree-text">Your Bag</h2>
                  <p className="text-[11px] text-fittree-text-light font-semibold">
                    {cart.reduce((a, c) => a + c.qty, 0)} item{cart.reduce((a, c) => a + c.qty, 0) !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl border border-fittree-border flex items-center justify-center text-fittree-text-light hover:text-fittree-text hover:bg-fittree-light transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Free Shipping Progress */}
            {cart.length > 0 && (
              <div className="px-6 py-3 bg-fittree-light/60 border-b border-fittree-border shrink-0">
                {toFreeShipping > 0 ? (
                  <p className="text-[11.5px] font-semibold text-fittree-text mb-2">
                    Add <span className="font-extrabold text-fittree-primary">₹{toFreeShipping.toFixed(0)}</span> more for <span className="font-extrabold">FREE Shipping!</span>
                  </p>
                ) : (
                  <p className="text-[11.5px] font-extrabold text-fittree-primary mb-2 flex items-center gap-1.5">
                    🎉 You've unlocked Free Shipping!
                  </p>
                )}
                <div className="w-full h-1.5 bg-fittree-border rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${freeShippingProgress}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full bg-fittree-primary rounded-full"
                  />
                </div>
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center pb-16">
                  <div className="w-20 h-20 rounded-full bg-fittree-light flex items-center justify-center mb-5 text-fittree-text-light border border-fittree-border">
                    <Package size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[17px] font-bold text-fittree-text mb-2">Your bag is empty</h3>
                  <p className="text-[13px] text-fittree-text-light font-medium mb-6 max-w-[200px]">
                    Start adding some organic goodness!
                  </p>
                  <button
                    onClick={() => { onClose(); navigate('/products'); }}
                    className="btn btn-primary text-[13px] !px-6 !py-2.5"
                  >
                    Shop Now
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex gap-4 py-4 border-b border-fittree-border/60 last:border-0"
                    >
                      {/* Image */}
                      <Link
                        to={`/product/${item.originalId || item._id}`}
                        onClick={onClose}
                        className="shrink-0 w-[72px] h-[72px] rounded-xl bg-fittree-sand border border-fittree-border overflow-hidden"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.originalId || item._id}`}
                          onClick={onClose}
                          className="text-[13.5px] font-bold text-fittree-text hover:text-fittree-primary transition-colors line-clamp-2 leading-snug block mb-1"
                        >
                          {item.name}
                        </Link>
                        <p className="text-[13px] font-bold text-fittree-primary mb-3">
                          ₹{item.price}
                        </p>

                        <div className="flex items-center justify-between">
                          {/* Qty control */}
                          <div className="flex items-center border border-fittree-border rounded-lg overflow-hidden h-8 bg-white">
                            <button
                              onClick={() => updateQty(item, item.qty - 1)}
                              className="w-8 h-full flex items-center justify-center text-fittree-text-light hover:bg-fittree-light hover:text-fittree-primary transition-colors"
                            >
                              <Minus size={12} strokeWidth={2.5} />
                            </button>
                            <span className="w-8 text-center text-[13px] font-bold text-fittree-text">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item, item.qty + 1)}
                              className="w-8 h-full flex items-center justify-center text-fittree-text-light hover:bg-fittree-light hover:text-fittree-primary transition-colors"
                            >
                              <Plus size={12} strokeWidth={2.5} />
                            </button>
                          </div>

                          {/* Line total */}
                          <span className="text-[14px] font-extrabold text-fittree-text">
                            ₹{(item.price * item.qty).toFixed(0)}
                          </span>

                          {/* Remove */}
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-fittree-text-light hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="px-6 py-5 border-t border-fittree-border bg-fittree-bg shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[14px] font-bold text-fittree-text-light uppercase tracking-wider">Subtotal</span>
                  <span className="text-[20px] font-extrabold text-fittree-text">₹{subtotal.toFixed(0)}</span>
                </div>
                <button
                  onClick={goToCheckout}
                  className="w-full btn btn-primary py-4 text-[14px] uppercase tracking-wider flex items-center justify-center gap-2 group"
                >
                  Checkout
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center justify-center gap-5 mt-4 text-fittree-text-light">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                    <ShieldCheck size={13} /> Secure
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                    <Leaf size={13} /> Organic
                  </div>
                  <button
                    onClick={() => { onClose(); navigate('/cart'); }}
                    className="text-[10px] font-bold uppercase tracking-wider text-fittree-primary hover:underline"
                  >
                    View Full Cart
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
