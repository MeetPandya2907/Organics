import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ShoppingCart, Star, SlidersHorizontal, Leaf, Search as SearchIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Paginate from '../components/Paginate';
import SearchBox from '../components/SearchBox';

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
  
  const [filter, setFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts(keyword, pageNumber);
  }, [fetchProducts, keyword, pageNumber]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryQuery = params.get('category');
    if (categoryQuery) {
      setFilter(categoryQuery.toUpperCase());
    } else {
      setFilter('All');
    }
  }, [location]);

  const filteredProducts = products.filter(p => {
    return filter === 'All' || p.category === filter;
  });

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
              className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-ink hover:bg-forest/10 hover:text-forest transition-colors shrink-0 border border-slate-100"
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="bg-white p-6 md:p-12 rounded-[3rem] shadow-sm border border-slate-100 min-h-[500px]">
          {loading ? (
             <div className="flex justify-center items-center py-32">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest"></div>
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
                      <div className="absolute inset-0 bg-ink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                        <button 
                          onClick={(e) => { 
                            e.preventDefault(); 
                            if (!userInfo) { navigate('/login'); } 
                            else { 
                              addToCart({
                                ...product,
                                name: `${product.name} (250g - Eco Pouch)`,
                                _id: `${product._id}-250g-Eco Pouch`,
                                originalId: product._id
                              }, 1); 
                            } 
                          }}
                          className="translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-ink font-bold px-6 py-3 rounded-full shadow-lg hover:bg-forest hover:text-white flex items-center gap-2"
                        >
                          <ShoppingCart size={18} /> Quick Add
                        </button>
                      </div>
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
