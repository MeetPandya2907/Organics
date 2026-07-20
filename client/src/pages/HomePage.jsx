import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ShoppingCart, ArrowRight, Star, ChevronLeft, ChevronRight, Zap, ShieldCheck, Truck, Leaf, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Meta from '../components/Meta';
import ProductSkeleton from '../components/ProductSkeleton';
import { getBaseUnit, getRegion } from '../utils/units';

const CATEGORIES = [
  { name: 'Spices', query: 'SPICES', img: 'https://fittreeinternational.com/wp-content/uploads/2026/01/imresizer-turmeric-2344157-scaled-1-1.jpg' },
  { name: 'Pulses', query: 'PULSES', img: 'https://fittreeinternational.com/wp-content/uploads/2026/01/imresizer-bowl-sackcloth-red-raw-lentils-wooden-board.jpg.jpg' },
  { name: 'Seeds', query: 'SEEDS', img: 'https://fittreeinternational.com/wp-content/uploads/2026/01/istockphoto-1153368009-612x612-1-1.jpg' },
  { name: 'Dehydrated', query: 'DEHYDRATED PRODUCTS', img: 'https://fittreeinternational.com/wp-content/uploads/2026/01/76-769552_dehydrated._imresizer.jpg' },
  { name: 'Quinoa', query: 'SEEDS', img: 'https://fittreeinternational.com/wp-content/uploads/2026/01/istockphoto-171117213-612x612-1-1.jpg' },
  { name: 'Blends', query: 'SPICES', img: 'https://fittreeinternational.com/wp-content/uploads/2026/01/coriander1_imresizer.jpg' },
  { name: 'New In', query: 'All', img: 'https://fittreeinternational.com/wp-content/uploads/2026/01/imresizer-istockphoto-144803768-170667a.jpg' },
];

const BANNERS = [
  { id: 1, img: '/banner1.png', title: '50% OFF on Organic Spices', sub: 'Freshly ground & lab-tested' },
  { id: 2, img: '/banner2.png', title: 'Stock up on Pulses', sub: 'Unpolished & pure' },
  { id: 3, img: '/banner3.png', title: 'Farm Fresh to Home', sub: 'Directly from our growers' },
];

const HomePage = () => {
  const { products, fetchProducts, loading, addToCart } = useStore();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);

  const quickAdd = (e, product) => {
    e.preventDefault();
    if (!product || product.countInStock === 0) return;
    addToCart({ ...product, qty: 1 }, 1); // Removed userInfo check so guests can add to cart!
  };

  return (
    <div className="bg-fittree-bg min-h-screen font-sans pt-[130px] overflow-x-hidden">
      <Meta title="FitTree Organics | Fast Grocery Delivery" />

      {/* D2C HERO CAROUSEL */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-2 mb-12">
        <div className="relative w-full h-[250px] md:h-[450px] rounded-[2rem] overflow-hidden group shadow-sm bg-fittree-sand">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img src={BANNERS[currentSlide].img} alt={BANNERS[currentSlide].title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent flex flex-col justify-center px-10 md:px-24 text-left">
                <span className="text-white text-[14px] md:text-[18px] font-bold uppercase tracking-wider mb-2 drop-shadow-md">{BANNERS[currentSlide].sub}</span>
                <h2 className="text-white text-3xl md:text-5xl lg:text-6xl max-w-lg mb-8 drop-shadow-md font-extrabold">{BANNERS[currentSlide].title}</h2>
                <Link to="/products" className="bg-white text-fittree-text px-8 py-3.5 rounded-xl font-bold w-fit hover:scale-105 transition-transform flex items-center gap-2 shadow-lg">
                  Shop Now <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Controls */}
          <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-fittree-text opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg z-10"><ChevronLeft size={28} /></button>
          <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-fittree-text opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg z-10"><ChevronRight size={28} /></button>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {BANNERS.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)} className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? 'bg-white scale-125' : 'bg-white/50'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY BUBBLES */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-16">
        <h3 className="text-[22px] font-bold text-fittree-text mb-6">Shop by Category</h3>
        <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
          {CATEGORIES.map((cat, i) => (
            <Link key={i} to={cat.query === 'All' ? '/products' : `/products?category=${encodeURIComponent(cat.query)}`} className="flex flex-col items-center gap-3 shrink-0 group w-28">
              <div className="w-24 h-24 rounded-full overflow-hidden border-[4px] border-white shadow-md group-hover:shadow-lg transition-all group-hover:border-fittree-primary bg-fittree-sand">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <span className="text-[15px] font-bold text-fittree-text text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FLASH SALE / PRODUCTS */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[24px] font-bold text-fittree-text flex items-center gap-2">
            <Zap size={24} className="text-fittree-accent fill-fittree-accent" /> Trending Deals
          </h3>
          <Link to="/products" className="text-fittree-primary font-bold hover:underline">View All</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(i => <ProductSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {products.slice(0, 10).map((product, idx) => (
              <div key={product._id} className="product-card group p-3 sm:p-4 bg-white hover:border-fittree-primary">
                {idx === 0 && <span className="absolute top-3 left-3 bg-fittree-accent text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md z-10 shadow-sm">Bestseller</span>}
                <Link to={`/product/${product._id}`} className="block h-[150px] sm:h-[180px] bg-fittree-sand rounded-xl overflow-hidden mb-3 relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" />
                </Link>
                
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] text-fittree-text-light font-bold uppercase tracking-wider mb-1">{getRegion(product)}</span>
                  <Link to={`/product/${product._id}`}>
                    <h4 className="text-[13px] sm:text-[14px] font-bold text-fittree-text leading-snug line-clamp-2 hover:text-fittree-primary transition-colors mb-1">{product.name}</h4>
                  </Link>
                  <p className="text-[11px] text-fittree-text-light font-medium line-clamp-1 mb-3">{product.description}</p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-[15px] font-bold text-fittree-text">₹{product.price} <span className="text-[10px] text-fittree-text-light font-medium block">/{getBaseUnit(product)}</span></span>
                    
                    <button
                      onClick={(e) => quickAdd(e, product)}
                      disabled={product.countInStock === 0}
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
              </div>
            ))}
          </div>
        )}
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-fittree-sand py-16 mb-20 border-y border-fittree-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <div className="w-12 h-12 bg-fittree-primary/10 text-fittree-primary rounded-xl flex items-center justify-center mx-auto mb-4"><Clock size={24} /></div>
              <h4 className="font-bold text-[15px] text-fittree-text mb-2">10-Minute Delivery</h4>
              <p className="text-[13px] text-fittree-text-light font-medium">Get your organic groceries delivered faster than you can brew tea.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <div className="w-12 h-12 bg-fittree-primary/10 text-fittree-primary rounded-xl flex items-center justify-center mx-auto mb-4"><Leaf size={24} /></div>
              <h4 className="font-bold text-[15px] text-fittree-text mb-2">100% Organic</h4>
              <p className="text-[13px] text-fittree-text-light font-medium">Sourced directly from certified farmers with zero chemical pesticides.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <div className="w-12 h-12 bg-fittree-primary/10 text-fittree-primary rounded-xl flex items-center justify-center mx-auto mb-4"><ShieldCheck size={24} /></div>
              <h4 className="font-bold text-[15px] text-fittree-text mb-2">FSSAI Lab Tested</h4>
              <p className="text-[13px] text-fittree-text-light font-medium">Every batch is rigorously tested to ensure safety and purity.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <div className="w-12 h-12 bg-fittree-primary/10 text-fittree-primary rounded-xl flex items-center justify-center mx-auto mb-4"><Truck size={24} /></div>
              <h4 className="font-bold text-[15px] text-fittree-text mb-2">Easy Returns</h4>
              <p className="text-[13px] text-fittree-text-light font-medium">Not satisfied with the quality? We offer instant, no-questions-asked refunds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-24">
        <h3 className="text-[24px] font-bold text-fittree-text mb-8 text-center">Loved by thousands</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-fittree-border p-6 rounded-2xl shadow-sm">
            <div className="flex gap-1 text-fittree-accent mb-4"><Star size={16} fill="currentColor" stroke="none"/><Star size={16} fill="currentColor" stroke="none"/><Star size={16} fill="currentColor" stroke="none"/><Star size={16} fill="currentColor" stroke="none"/><Star size={16} fill="currentColor" stroke="none"/></div>
            <p className="text-[14px] text-fittree-text font-medium mb-6">"FitTree Organics has completely changed how I buy my weekly groceries. The 10-minute delivery is a lifesaver, and the quality of their spices is unmatched."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-fittree-sand flex items-center justify-center font-bold text-fittree-primary border border-fittree-border">A</div>
              <div><h5 className="font-bold text-[13px] text-fittree-text">Aarti Sharma</h5><span className="text-[11px] text-fittree-text-light font-bold uppercase">Verified Buyer</span></div>
            </div>
          </div>
          <div className="bg-white border border-fittree-border p-6 rounded-2xl shadow-sm">
            <div className="flex gap-1 text-fittree-accent mb-4"><Star size={16} fill="currentColor" stroke="none"/><Star size={16} fill="currentColor" stroke="none"/><Star size={16} fill="currentColor" stroke="none"/><Star size={16} fill="currentColor" stroke="none"/><Star size={16} fill="currentColor" stroke="none"/></div>
            <p className="text-[14px] text-fittree-text font-medium mb-6">"I love the transparency! I can see exactly where my lentils came from. Plus, the quick 'Add to Cart' experience makes shopping super fast."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-fittree-sand flex items-center justify-center font-bold text-fittree-primary border border-fittree-border">R</div>
              <div><h5 className="font-bold text-[13px] text-fittree-text">Rahul Verma</h5><span className="text-[11px] text-fittree-text-light font-bold uppercase">Verified Buyer</span></div>
            </div>
          </div>
          <div className="bg-white border border-fittree-border p-6 rounded-2xl shadow-sm">
            <div className="flex gap-1 text-fittree-accent mb-4"><Star size={16} fill="currentColor" stroke="none"/><Star size={16} fill="currentColor" stroke="none"/><Star size={16} fill="currentColor" stroke="none"/><Star size={16} fill="currentColor" stroke="none"/><Star size={16} fill="currentColor" stroke="none"/></div>
            <p className="text-[14px] text-fittree-text font-medium mb-6">"Finally an organic brand that doesn't feel overly expensive. Their white quinoa is my absolute favorite, always fresh and beautifully packaged."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-fittree-sand flex items-center justify-center font-bold text-fittree-primary border border-fittree-border">S</div>
              <div><h5 className="font-bold text-[13px] text-fittree-text">Sneha Patel</h5><span className="text-[11px] text-fittree-text-light font-bold uppercase">Verified Buyer</span></div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
