import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ShoppingCart, Search as SearchIcon, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Meta from '../components/Meta';
import Paginate from '../components/Paginate';
import ProductSkeleton from '../components/ProductSkeleton';

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
    <div className="bg-fittree-bg min-h-screen font-sans pb-20 pt-32">
      <Meta title="FitTree Organics | Shop All" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-fittree-dark mb-4">
              {category === 'All' ? 'Shop All Products' : category}
            </h1>
            <p className="text-fittree-text-light max-w-2xl">
              Whole spices, pulses and seeds sourced directly from Indian farms — packed the week you order.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-between p-4 bg-white rounded-xl shadow-fittree-sm border border-fittree-border text-fittree-dark font-semibold"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} /> Filters & Sorting
            </div>
            <ChevronDown size={18} className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Sidebar / Filters */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 1024) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:w-1/4 flex-shrink-0 lg:block overflow-hidden lg:overflow-visible"
              >
                <div className="bg-white rounded-3xl shadow-fittree-sm border border-white p-7 sticky top-32">

                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-fittree-dark mb-4 border-b border-fittree-border pb-2">Categories</h3>
                    <ul className="flex flex-col gap-2">
                      {categories.map((c, i) => (
                        <li key={i}>
                          <button
                            onClick={() => {
                              setCategory(c);
                              if (window.innerWidth < 1024) setShowFilters(false);
                            }}
                            className={`w-full text-left py-2 px-3 rounded-lg transition-colors text-sm font-medium ${category === c
                                ? 'bg-fittree-primary/10 text-fittree-primary'
                                : 'text-fittree-text hover:bg-fittree-bg hover:text-fittree-dark'
                              }`}
                          >
                            {c}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-fittree-dark mb-4 border-b border-fittree-border pb-2">Sort By</h3>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="w-full p-3 bg-fittree-bg border border-fittree-border rounded-lg text-sm text-fittree-text focus:outline-none focus:border-fittree-primary"
                    >
                      <option value="">Featured</option>
                      <option value="lowest">Price: Low to High</option>
                      <option value="highest">Price: High to Low</option>
                      <option value="toprated">Customer Rating</option>
                    </select>
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
              <div className="bg-white rounded-2xl shadow-fittree-sm border border-fittree-border p-12 text-center">
                <SearchIcon size={48} className="mx-auto mb-6 text-fittree-border" />
                <h3 className="text-2xl font-bold text-fittree-dark mb-3">No products found</h3>
                <p className="text-fittree-text-light mb-8">We couldn't find any products matching your current filters.</p>
                <button
                  onClick={() => { setCategory('All'); setSort(''); }}
                  className="btn btn-outline"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product, idx) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      key={product._id}
                      className="group product-card"
                    >
                      <div className="relative aspect-[4/3] rounded-t-3xl rounded-b-xl overflow-hidden mb-5 bg-[#FAFAF8] p-4 flex items-center justify-center">
                        {product.countInStock === 0 && (
                          <span className="absolute top-3 left-3 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold z-10 shadow-sm border border-red-200">
                            Out of Stock
                          </span>
                        )}
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex flex-col flex-1 px-5 pb-5">
                        <span className="text-[10px] uppercase font-bold text-fittree-primary tracking-widest mb-2 opacity-80">{product.category}</span>
                        <Link to={`/product/${product._id}`}>
                          <h3 className="text-[17px] font-bold text-fittree-dark group-hover:text-fittree-primary transition-colors leading-tight mb-2 line-clamp-2">{product.name}</h3>
                        </Link>

                        <p className="text-[15px] font-bold text-fittree-text mb-5 mt-auto">₹{product.price}<span className="text-[11px] font-normal text-fittree-text-light ml-1">/unit</span></p>

                        <div className="pt-2 border-t border-fittree-border/50">
                          <button
                            disabled={product.countInStock === 0}
                            onClick={(e) => {
                              e.preventDefault();
                              if (!userInfo) navigate('/login');
                              else addToCart({ ...product, qty: 1 }, 1);
                            }}
                            className={`w-full py-2.5 text-sm font-semibold rounded-lg transition-colors ${product.countInStock === 0
                                ? 'bg-fittree-bg text-fittree-text-light cursor-not-allowed border border-fittree-border'
                                : 'btn-primary'
                              }`}
                          >
                            {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
