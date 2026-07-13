import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ShoppingCart, Star, SlidersHorizontal, Leaf, Search as SearchIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Paginate from '../components/Paginate';
import SearchBox from '../components/SearchBox';
import ProductSkeleton from '../components/ProductSkeleton';

const categories = [
  'All',
  'Spices',
  'Pulses',
  'Seeds',
  'Dehydrated Products'
];

const ProductListPage = () => {
  const { products, page, pages, fetchProducts, loading, error, addToCart, userInfo } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { keyword, pageNumber } = useParams();
  
  const [filter, setFilter] = useState('All'); // Category
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryQuery = params.get('category') || 'All';
    const minPriceQuery = params.get('minPrice') || '';
    const maxPriceQuery = params.get('maxPrice') || '';
    const sortQuery = params.get('sort') || 'newest';

    setFilter(categoryQuery);
    setMinPrice(minPriceQuery);
    setMaxPrice(maxPriceQuery);
    setSort(sortQuery);

    fetchProducts(keyword, pageNumber, categoryQuery, minPriceQuery, maxPriceQuery, sortQuery);
  }, [fetchProducts, keyword, pageNumber, location.search]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filter !== 'All') params.append('category', filter);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (sort !== 'newest') params.append('sort', sort);
    
    // Maintain keyword if exists
    if (keyword) {
      navigate(`/search/${keyword}?${params.toString()}`);
    } else {
      navigate(`/products?${params.toString()}`);
    }
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilter('All');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    if (keyword) navigate(`/search/${keyword}`);
    else navigate('/products');
    setShowFilters(false);
  };

  // We don't filter locally anymore, since the backend handles it.
  const filteredProducts = products;

  return (
    <div className="bg-paper min-h-screen pb-24">
      {/* Header */}
      <div className="relative pt-40 pb-48 px-6 text-center overflow-hidden bg-ink">
        <div className="absolute inset-0 w-full h-full">
           <img src="https://images.pexels.com/photos/10313176/pexels-photo-10313176.jpeg?auto=compress&cs=tinysrgb&w=2000" alt="Harvest" className="w-full h-full object-cover opacity-30 mix-blend-overlay" />
           <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-transparent"></div>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{duration: 0.8}} className="relative z-10 max-w-4xl mx-auto">
          <span className="text-turmeric font-bold tracking-[0.2em] uppercase text-sm mb-4 block">The Collection</span>
          <h1 className="text-5xl md:text-7xl font-display text-white mb-6">Organic Harvest</h1>
          <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">
            Browse our collection of 100% natural, ethically sourced products. Fresh from the farm, straight to your kitchen.
          </p>
        </motion.div>
      </div>

      {/* Floating Content (-mt-32) */}
      <div className="max-w-[1400px] mx-auto px-6 -mt-32 relative z-10">
        
        {/* Controls Bar */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-glass border border-white p-4 md:p-6 mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat === 'All' ? 'All' : cat.toUpperCase())}
                className={`px-6 py-3 rounded-full whitespace-nowrap text-[15px] font-semibold transition-all duration-300 ${
                  (filter === cat || filter === cat.toUpperCase())
                  ? 'bg-forest text-white shadow-md' 
                  : 'bg-transparent text-slate-500 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <SearchBox />
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors shrink-0 border ${showFilters ? 'bg-forest text-white border-forest' : 'bg-slate-50 text-ink border-slate-100 hover:bg-forest/10 hover:text-forest'}`}
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-12"
            >
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-bold text-ink mb-3 uppercase tracking-widest">Category</label>
                    <div className="space-y-2">
                      {categories.map(cat => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="category"
                            checked={filter.toUpperCase() === cat.toUpperCase()}
                            onChange={() => setFilter(cat === 'All' ? 'All' : cat.toUpperCase())}
                            className="w-4 h-4 text-forest focus:ring-forest border-gray-300"
                          />
                          <span className="text-gray-600 group-hover:text-ink">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-bold text-ink mb-3 uppercase tracking-widest">Price Range (₹)</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="number" 
                        placeholder="Min" 
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-forest outline-none"
                      />
                      <span className="text-gray-400">-</span>
                      <input 
                        type="number" 
                        placeholder="Max" 
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-forest outline-none"
                      />
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-bold text-ink mb-3 uppercase tracking-widest">Sort By</label>
                    <select 
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-forest outline-none"
                    >
                      <option value="newest">Newest Arrivals</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="toprated">Top Rated</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 flex justify-end gap-4">
                  <button onClick={clearFilters} className="px-6 py-2 rounded-xl font-medium text-gray-500 hover:bg-gray-100 transition-colors">Clear All</button>
                  <button onClick={applyFilters} className="btn bg-forest text-white px-8 py-2 rounded-xl shadow-lg shadow-forest/20 hover:bg-forest/90">Apply Filters</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className="bg-white p-6 md:p-12 rounded-[3rem] shadow-sm border border-slate-100 min-h-[500px]">
          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
               {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <ProductSkeleton key={i} />)}
             </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-8 rounded-3xl text-center border border-red-100 font-medium">
              {error}
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center py-32">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300 mb-6 border border-slate-100">
                <SearchIcon size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-display text-ink mb-3">No products found</h3>
              <p className="text-slate-500 font-medium mb-8">We couldn't find anything matching your current filters.</p>
              <button onClick={() => setFilter('All')} className="btn btn-primary shadow-lg shadow-forest/20">View All Harvest</button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <AnimatePresence>
                {filteredProducts.map((product, idx) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    key={product._id} 
                    className="group flex flex-col h-full bg-paper rounded-[2rem] overflow-hidden border border-slate-100 relative hover:shadow-soft transition-all duration-500"
                  >
                    <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden flex items-center justify-center p-6">
                      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur shadow-sm px-3 py-1.5 rounded-full text-[10px] font-bold text-ink uppercase tracking-widest z-10 border border-slate-100">
                        {product.category}
                      </span>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1 border-t border-slate-100 bg-white">
                      <div className="flex items-center gap-1 text-turmeric mb-3">
                        {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                        <span className="text-slate-400 text-xs ml-1 font-medium">({product.numReviews})</span>
                      </div>
                      <Link to={`/product/${product._id}`} className="block mb-4 flex-1">
                        <h3 className="font-bold text-[17px] text-ink group-hover:text-forest transition-colors line-clamp-2 leading-tight">{product.name}</h3>
                      </Link>
                      <div className="mt-auto flex justify-between items-end">
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-400 font-medium mb-0.5">Starting at</span>
                          <span className="text-xl font-bold text-forest">₹{product.price}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (!userInfo) navigate('/login');
                            else addToCart({
                              ...product,
                              name: `${product.name} (250g - Eco Pouch)`,
                              _id: `${product._id}-250g-Eco Pouch`,
                              originalId: product._id
                            }, 1);
                          }}
                          className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center text-forest hover:bg-forest hover:text-white transition-colors"
                          title="Quick Add"
                        >
                          <ShoppingCart size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          
          <div className="mt-16 flex justify-center">
            <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
