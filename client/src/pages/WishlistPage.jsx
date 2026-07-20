import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Heart, ShoppingCart, Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Meta from '../components/Meta';
import { getBaseUnit, getRegion } from '../utils/units';

const WishlistPage = () => {
  const { wishlist, toggleWishlist, addToCart, userInfo } = useStore();
  const navigate = useNavigate();

  const quickAdd = (e, product) => {
    e.preventDefault();
    if (product.countInStock === 0) return;
    if (!userInfo) {
      navigate('/login');
      return;
    }
    addToCart({ ...product, qty: 1 }, 1);
  };

  return (
    <div className="bg-fittree-bg min-h-screen font-sans pb-24 pt-[130px]">
      <Meta title="FitTree Organics | Your Wishlist" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-fittree-primary rounded-xl flex items-center justify-center text-white shadow-sm">
            <Heart size={22} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-fittree-text leading-tight">Your Wishlist</h1>
            <p className="text-fittree-text-light text-sm font-medium mt-1">{wishlist.length} saved {wishlist.length === 1 ? 'item' : 'items'}</p>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-16 rounded-2xl text-center border border-fittree-border max-w-xl mx-auto">
            <div className="w-20 h-20 bg-fittree-light text-fittree-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={32} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-display font-bold text-fittree-text mb-3">Nothing saved yet</h2>
            <p className="text-fittree-text-light mb-8 font-medium">Tap the heart on any product to save it here for later.</p>
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <AnimatePresence>
              {wishlist.map((p) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={p._id}
                  className="product-card group p-3 sm:p-4 bg-white border border-fittree-border"
                >
                  <button
                    onClick={() => toggleWishlist(p)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white shadow-sm border border-fittree-border flex items-center justify-center text-fittree-pink hover:bg-fittree-pink hover:text-white transition-colors"
                    title="Remove from wishlist"
                  >
                    <X size={15} />
                  </button>
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md border border-white/50 text-fittree-text text-[10px] font-bold px-2 py-1 rounded-md z-10 shadow-sm">{getBaseUnit(p)}</span>

                  <Link to={`/product/${p._id}`} className="block h-[150px] sm:h-[180px] bg-fittree-sand rounded-xl overflow-hidden mb-3 relative">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </Link>

                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] text-fittree-text-light font-bold uppercase tracking-wider mb-1">{getRegion(p)}</span>
                    <Link to={`/product/${p._id}`}>
                      <h4 className="text-[13px] sm:text-[14px] font-bold text-fittree-text leading-snug line-clamp-2 hover:text-fittree-primary transition-colors mb-2">{p.name}</h4>
                    </Link>
                    <div className="flex items-center gap-1 text-fittree-accent mb-3">
                      <Star size={11} fill="currentColor" stroke="none" />
                      <span className="text-[11px] font-bold text-fittree-text-light">{p.rating?.toFixed(1) || '—'}</span>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-[15px] font-bold text-fittree-text">₹{p.price}</span>
                      <button
                        onClick={(e) => quickAdd(e, p)}
                        disabled={p.countInStock === 0}
                        className={`px-4 py-1.5 rounded-lg font-bold text-[12px] transition-all flex items-center justify-center gap-1 uppercase tracking-wider ${
                          p.countInStock === 0
                            ? 'bg-fittree-sand text-fittree-text-light cursor-not-allowed'
                            : 'bg-white border border-fittree-primary text-fittree-primary hover:bg-fittree-primary hover:text-white shadow-sm'
                        }`}
                      >
                        <ShoppingCart size={12} /> ADD
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
