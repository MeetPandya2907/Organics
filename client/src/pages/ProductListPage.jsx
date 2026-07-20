import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ShoppingCart, Search as SearchIcon, SlidersHorizontal, ChevronDown, Star, Flame, Wheat, Sprout, PackageOpen, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Meta from '../components/Meta';
import Paginate from '../components/Paginate';
import ProductSkeleton from '../components/ProductSkeleton';
import { getBaseUnit, getRegion, getCashback } from '../utils/units';

const CATEGORY_ICONS = {
  All: LayoutGrid,
  SPICES: Flame,
  PULSES: Wheat,
  SEEDS: Sprout,
  'DEHYDRATED PRODUCTS': PackageOpen,
};

const ProductListPage = () => {
  const { keyword, pageNumber } = useParams();
  const { products, pages, page, fetchProducts, loading, addToCart, userInfo } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const cat = searchParams.get('category');
    if (cat) {
      setCategory(cat);
    }
  }, [location]);

  useEffect(() => {
    fetchProducts(keyword || '', pageNumber || '', category, '', '', sort);
  }, [fetchProducts, keyword, pageNumber, category, sort]);

  const categories = ['All', 'SPICES', 'PULSES', 'SEEDS', 'DEHYDRATED PRODUCTS'];

  return (
    <div className="bg-fittree-bg min-h-screen font-sans pb-24 pt-[100px] selection:bg-fittree-accent selection:text-white">
      <Meta title="FitTree Organics | Shop All" />

      {/* D2C Header */}
      <div className="bg-white border-b border-fittree-border">
        <div className="max-w-[1400px] mx-auto px-6 py-10">
          <h1 className="text-[32px] md:text-[42px] font-bold text-fittree-text mb-2 leading-tight">
            {category === 'All' ? 'Shop All Products' : category}
          </h1>
          <p className="text-fittree-text-light text-[15px] max-w-2xl font-medium">
            Fresh, organic produce delivered straight from the farm to your door in 10 minutes.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pt-10">
        {/* Quick category pills */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 -mx-1 px-1 hide-scrollbar">
          {categories.map((c) => {
            const Icon = CATEGORY_ICONS[c];
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`shrink-0 inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-[13px] font-semibold tracking-wider transition-all duration-300 ${category === c
                    ? 'bg-fittree-primary text-white shadow-md'
                    : 'bg-white border border-fittree-border text-fittree-text hover:border-fittree-primary hover:text-fittree-primary shadow-sm'
                  }`}
              >
                <Icon size={16} /> {c === 'DEHYDRATED PRODUCTS' ? 'Dehydrated' : c}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-fittree-border text-fittree-text font-semibold"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} /> Sort & Filter
            </div>
            <ChevronDown size={18} className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Sidebar / Sort */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 1024) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:w-1/4 flex-shrink-0 lg:block overflow-hidden lg:overflow-visible"
              >
                <div className="bg-white rounded-[2rem] shadow-sm border border-fittree-border p-8 sticky top-32">
                  <h3 className="text-[18px] font-semibold text-fittree-text mb-6">Sort Collection</h3>
                  
                  <div className="space-y-3">
                    {[
                      { val: '', label: 'Featured Bestsellers' },
                      { val: 'lowest', label: 'Price: Low to High' },
                      { val: 'highest', label: 'Price: High to Low' },
                      { val: 'toprated', label: 'Customer Rating' },
                    ].map((opt) => (
                      <label key={opt.val} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center w-5 h-5 rounded-full border border-fittree-border bg-fittree-bg group-hover:border-fittree-primary transition-colors">
                          {sort === opt.val && <div className="w-2.5 h-2.5 bg-fittree-primary rounded-full"></div>}
                        </div>
                        <input
                          type="radio"
                          name="sort"
                          value={opt.val}
                          checked={sort === opt.val}
                          onChange={(e) => setSort(e.target.value)}
                          className="sr-only"
                        />
                        <span className={`text-[14px] font-medium transition-colors ${sort === opt.val ? 'text-fittree-primary' : 'text-fittree-text-light group-hover:text-fittree-text'}`}>{opt.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="mt-10 pt-8 border-t border-fittree-border">
                    <div className="flex items-start gap-4 text-fittree-text text-[13px] font-medium leading-relaxed bg-fittree-bg p-4 rounded-2xl">
                      <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-fittree-accent shrink-0 shadow-sm border border-fittree-border"><Star size={14} fill="currentColor" /></span>
                      <p>Every batch is <b className="text-fittree-primary">FSSAI licensed</b> and lab-tested for zero residue.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => <ProductSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-[2rem] shadow-sm border border-fittree-border p-16 text-center">
                <div className="w-20 h-20 bg-fittree-bg rounded-full flex items-center justify-center mx-auto mb-6 text-fittree-text-light"><SearchIcon size={32} /></div>
                <h3 className="text-[24px] font-semibold text-fittree-text mb-3">No products found</h3>
                <p className="text-fittree-text-light mb-10 text-[15px]">We couldn't find any products matching your current filters.</p>
                <button onClick={() => { setCategory('All'); setSort(''); }} className="btn btn-primary">Clear All Filters</button>
              </div>
            ) : (
              <>
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product, idx) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: (idx % 6) * 0.05 }}
                      key={product._id}
                      className="product-card group p-3 sm:p-4 bg-white hover:border-fittree-primary"
                    >
                      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md border border-white/50 text-fittree-text text-[10px] font-bold px-2 py-1 rounded-md z-10 shadow-sm">{getBaseUnit(product)}</span>
                      {product.countInStock === 0 ? (
                        <span className="absolute top-4 right-4 bg-red-500 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md z-10 shadow-sm">Sold Out</span>
                      ) : (
                        <span className="absolute top-4 right-4 bg-fittree-primary/95 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md z-10 shadow-sm">{getRegion(product)}</span>
                      )}
                      
                      <Link to={`/product/${product._id}`} className="block h-[150px] sm:h-[180px] bg-fittree-sand rounded-xl overflow-hidden mb-3 relative">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" />
                      </Link>

                      <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <Link to={`/product/${product._id}`} className="flex-1">
                            <h3 className="text-[13px] sm:text-[14px] font-bold text-fittree-text leading-snug hover:text-fittree-primary transition-colors line-clamp-2 pr-2">{product.name}</h3>
                          </Link>
                          <span className="text-[10px] font-bold text-fittree-accent flex items-center gap-1 shrink-0 bg-fittree-bg px-1.5 py-1 rounded">
                            <Star size={10} fill="currentColor" stroke="none" /> {product.rating?.toFixed(1) || '—'}
                          </span>
                        </div>
                        <p className="text-[11px] text-fittree-text-light font-medium mb-3 line-clamp-1">{product.description}</p>

                        <div className="mt-auto flex items-center justify-between">
                          <span className="text-[15px] font-bold text-fittree-text">₹{product.price} <span className="text-[10px] text-fittree-text-light font-medium block">/{getBaseUnit(product)}</span></span>
                          
                          <button
                            disabled={product.countInStock === 0}
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart({ ...product, qty: 1 }, 1);
                            }}
                            className={`px-4 py-1.5 rounded-lg font-bold text-[12px] transition-all flex items-center justify-center gap-1 uppercase tracking-wider ${
                              product.countInStock === 0
                                ? 'bg-fittree-sand text-fittree-text-light cursor-not-allowed'
                                : 'bg-white border border-fittree-primary text-fittree-primary hover:bg-fittree-primary hover:text-white shadow-sm'
                            }`}
                          >
                            {product.countInStock === 0 ? 'Sold' : 'ADD'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <div className="mt-12">
                  <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;

