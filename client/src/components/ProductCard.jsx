import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Zap, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { getBaseUnit, getRegion } from '../utils/units';

const ProductCard = ({ product, index = 0, badge = null }) => {
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  // True image swap: only if images[0] exists AND differs from primary
  const primaryImage = product.image;
  const secondaryImage =
    product.images &&
    product.images.length > 0 &&
    product.images[0] !== product.image
      ? product.images[0]
      : null;

  const isSaved = wishlist.some((w) => w._id === product._id);
  const inStock = product.countInStock > 0;
  const isLowStock = product.countInStock > 0 && product.countInStock <= 5;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!inStock || added) return;
    addToCart({ ...product, qty: 1 }, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  return (
    <div
      className="product-card group relative bg-white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Image Area ── */}
      <Link to={`/product/${product._id}`} className="block overflow-hidden rounded-t-2xl">
        <div className="relative h-[220px] sm:h-[240px] bg-fittree-sand overflow-hidden rounded-t-2xl">

          {/* ─── PRIMARY IMAGE ─── */}
          <img
            src={primaryImage}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
              secondaryImage
                ? hovered
                  ? 'opacity-0 scale-110'
                  : 'opacity-100 scale-100'
                : hovered
                  ? 'opacity-100 scale-110 brightness-[1.06] saturate-[1.15]'
                  : 'opacity-100 scale-100 brightness-100 saturate-100'
            }`}
          />

          {/* ─── SECONDARY IMAGE — true swap when available ─── */}
          {secondaryImage && (
            <img
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
                hovered ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
              }`}
            />
          )}

          {/* ── Top Badges ── */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {!inStock && (
              <span className="bg-red-500 text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg shadow">
                Sold Out
              </span>
            )}
            {inStock && badge && (
              <span className="bg-fittree-accent text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg shadow">
                {badge}
              </span>
            )}
            {isLowStock && (
              <span className="bg-amber-400 text-amber-900 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg shadow flex items-center gap-1">
                <Zap size={9} /> Only {product.countInStock} left
              </span>
            )}
          </div>

          {/* ── Wishlist Button ── */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full shadow-md flex items-center justify-center transition-all duration-200 ${
              isSaved
                ? 'bg-red-50 text-red-500 scale-110'
                : 'bg-white text-fittree-text-light hover:text-red-400 hover:scale-110'
            }`}
            title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} className="transition-all duration-200" />
          </button>

          {/* Dot indicators — only when a second image is available */}
          {secondaryImage && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className={`block w-1.5 h-1.5 rounded-full transition-all duration-500 ${hovered ? 'bg-white/50 w-3' : 'bg-white'}`} />
              <span className={`block w-1.5 h-1.5 rounded-full transition-all duration-500 ${hovered ? 'bg-white w-3' : 'bg-white/50'}`} />
            </div>
          )}
        </div>
      </Link>

      {/* ── Card Body ── */}
      <div className="flex flex-col flex-1 p-4">
        {/* Region + Rating */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-fittree-primary font-bold uppercase tracking-wider bg-fittree-light px-2 py-0.5 rounded-md">
            {getRegion(product)}
          </span>
          {product.rating > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-fittree-text-light">
              <Star size={11} className="text-fittree-accent fill-fittree-accent" />
              {product.rating.toFixed(1)}
              {product.numReviews > 0 && (
                <span className="text-[10px] font-medium text-fittree-text-light/70">
                  ({product.numReviews})
                </span>
              )}
            </span>
          )}
        </div>

        {/* Product Name */}
        <Link to={`/product/${product._id}`}>
          <h3 className="text-[14.5px] font-bold text-fittree-text leading-snug line-clamp-2 mb-3 hover:text-fittree-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price + Add to Cart */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3 border-t border-fittree-border">
          <div className="flex flex-col">
            <span className="text-[17px] font-extrabold text-fittree-text leading-none">
              ₹{product.price}
            </span>
            <span className="text-[10px] text-fittree-text-light font-semibold mt-0.5">
              per {getBaseUnit(product)}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`px-4 py-2 rounded-xl font-bold text-[12px] transition-all duration-200 flex items-center gap-1.5 uppercase tracking-wider shrink-0 ${
              !inStock
                ? 'bg-fittree-sand text-fittree-text-light cursor-not-allowed'
                : added
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-fittree-primary text-white hover:bg-fittree-primary-soft shadow-sm hover:shadow-md'
            }`}
          >
            {added ? (
              <><CheckCircle size={13} /> Done</>
            ) : (
              <><ShoppingCart size={13} /> {inStock ? 'Add' : 'Sold'}</>
            )}
          </button>
        </div>
      </div>

      {/* Green top-border reveal on hover */}
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-fittree-primary to-fittree-primary-soft transition-opacity duration-300 rounded-t-2xl ${
          hovered ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

export default ProductCard;
