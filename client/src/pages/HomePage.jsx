import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  ShoppingCart, ArrowRight, Star, Leaf, Tractor, FlaskConical, Heart, Play,
  CheckCircle2, Truck, ShieldCheck, Headphones, Sprout, Package, Globe, MapPin,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Meta from '../components/Meta';
import ProductSkeleton from '../components/ProductSkeleton';

const MARQUEE_ITEMS = ['Farm-Traced Batches', 'Zero Middlemen', 'FSSAI Lab Tested', '40,000+ Homes', 'Flat 10% Off Prepaid', 'Pan-India Delivery'];

const FEATURES = [
  { icon: Leaf, title: '100% Organic', sub: 'No Chemicals' },
  { icon: Tractor, title: 'Farm Fresh', sub: 'Direct from Farmers' },
  { icon: FlaskConical, title: 'Lab Tested', sub: 'For Purity' },
  { icon: Heart, title: 'Sustainable', sub: 'Better for Earth' },
];

const CATEGORIES = [
  { name: 'Pulses', query: 'PULSES', img: 'https://fittreeinternational.com/wp-content/uploads/2026/01/imresizer-bowl-sackcloth-red-raw-lentils-wooden-board.jpg.jpg' },
  { name: 'Grains', query: null, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80' },
  { name: 'Flours', query: null, img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80' },
  { name: 'Dry Fruits', query: null, img: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=300&q=80' },
  { name: 'Spices', query: 'SPICES', img: 'https://fittreeinternational.com/wp-content/uploads/2026/01/imresizer-turmeric-2344157-scaled-1-1.jpg' },
  { name: 'Seeds', query: 'SEEDS', img: 'https://fittreeinternational.com/wp-content/uploads/2026/01/istockphoto-1153368009-612x612-1-1.jpg' },
  { name: 'Oils', query: null, img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&q=80' },
  { name: 'Herbs', query: null, img: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=300&q=80' },
];

const WHY_CHOOSE = [
  'Chemical & Pesticide Free',
  'Sourced from Trusted Farmers',
  'Lab Tested for Purity',
  'Sustainable & Ethical Practices',
];

const ASSURANCE_SIDEBAR = [
  { icon: Truck, title: 'Free Shipping', sub: 'On orders above ₹999' },
  { icon: ShieldCheck, title: 'Easy Returns', sub: 'Hassle free returns' },
  { icon: Package, title: 'Secure Payment', sub: '100% secure payments' },
  { icon: Headphones, title: '24/7 Support', sub: 'We are here to help' },
];

const PROMISE_STATS = [
  { icon: Sprout, n: '100+', l: 'Organic Products' },
  { icon: Heart, n: '50K+', l: 'Happy Customers' },
  { icon: Tractor, n: '30+', l: 'Partner Farms' },
  { icon: ShieldCheck, n: '100%', l: 'Quality Assured' },
];

const FOOTER_STRIP = [
  { icon: Leaf, title: '100% Organic', sub: 'No chemicals or additives' },
  { icon: Tractor, title: 'Direct from Farms', sub: 'Fresh & responsibly sourced' },
  { icon: Package, title: 'Secure Packaging', sub: 'Safe & hygienic delivery' },
  { icon: Globe, title: 'Environment Friendly', sub: 'We care for our planet' },
];

const BADGES = ['Bestseller', 'Organic', 'New', null, null, 'Sale'];

const HomePage = () => {
  const { products, fetchProducts, loading, addToCart, wishlist, toggleWishlist, recentlyViewed } = useStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const sellableProducts = products.filter(p => p.price > 0 && p.name !== 'Sample name');
  const trending = sellableProducts.slice(0, 6);
  const trendingHeroPick = trending[0];

  const quickAdd = (e, product) => {
    e.preventDefault();
    if (!product || product.countInStock === 0) return;
    addToCart({ ...product, qty: 1 }, 1);
  };

  return (
    <div className="bg-fittree-cream min-h-screen font-sans pt-[100px] overflow-x-hidden">
      <Meta title="FitTree Organics | Real Spices, Pulses & Seeds From Indian Farms" />

      {/* HERO — editorial split, real photography, no gimmicks */}
      <section className="relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[minmax(0,480px)_1fr] gap-10 lg:gap-14 items-center py-6 lg:py-10">

            {/* Left — copy */}
            <div className="relative z-10 order-2 lg:order-1">
              <span className="inline-flex items-center gap-2 text-fittree-primary font-bold text-[11.5px] uppercase tracking-[0.22em] mb-6">
                <MapPin size={13} /> Farm-Traced &middot; Zero Middlemen
              </span>

              <motion.h1
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
                className="font-serif text-fittree-forest text-[3rem] sm:text-[3.6rem] lg:text-[4.1rem] font-medium leading-[0.98] mb-6 -tracking-[0.01em]"
              >
                Real food,<br /><span className="italic text-fittree-primary">real farms.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}
                className="text-fittree-text-light text-[16.5px] leading-relaxed max-w-[420px] mb-9 font-medium"
              >
                Whole spices, unpolished dals and cold-pressed oils — every batch traced to the district and growers' collective it came from, packed the week you order.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.18 }}
                className="flex flex-wrap items-center gap-5 mb-10"
              >
                <Link to="/products" className="bg-fittree-forest text-white px-7 py-3.5 rounded-xl font-bold text-[14.5px] hover:bg-fittree-forest-light transition-colors flex items-center gap-2 shadow-lg shadow-fittree-forest/15">
                  Shop Now <ArrowRight size={17} />
                </Link>
                <button className="flex items-center gap-3 font-bold text-[14.5px] text-fittree-dark hover:text-fittree-primary transition-colors group">
                  <span className="w-10 h-10 rounded-full border-2 border-fittree-dark/15 flex items-center justify-center group-hover:border-fittree-primary transition-colors">
                    <Play size={13} fill="currentColor" />
                  </span>
                  Watch Our Story
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
                className="flex gap-8 border-t border-fittree-border pt-6 w-fit"
              >
                {[['4.8★', 'Rating'], ['100%', 'Lab-Tested'], ['0', 'Middlemen']].map(([n, l], i) => (
                  <div key={i}>
                    <b className="block font-serif text-fittree-forest text-[22px] font-medium leading-none">{n}</b>
                    <span className="text-fittree-text-light text-[10.5px] font-bold uppercase tracking-wider">{l}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — real photography, full bleed */}
            <div className="relative order-1 lg:order-2 -mx-4 sm:-mx-6 lg:mx-0">
              <div className="relative rounded-none lg:rounded-[2rem] overflow-hidden aspect-[4/3.1] lg:aspect-[16/12] shadow-fittree-lg">
                <img
                  src="/01_hero_product_basket.jpg"
                  alt="A wicker basket of FitTree Organics Toor Dal, Moong Dal, oils and spice jars in a farm field"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Rotating batch stamp */}
              <div className="hidden sm:flex absolute -bottom-6 -left-6 w-[104px] h-[104px] rounded-full bg-white shadow-xl border border-fittree-border items-center justify-center text-center animate-float" style={{ '--float-rot': '0deg' }}>
                <span className="text-fittree-forest font-serif italic text-[13px] font-medium leading-tight">Pure<br />Natural</span>
              </div>

              {/* Floating quick-shop card */}
              {trendingHeroPick && (
                <Link
                  to={`/product/${trendingHeroPick._id}`}
                  className="hidden lg:flex absolute top-6 right-6 bg-white/95 backdrop-blur rounded-2xl shadow-xl p-3 items-center gap-3 w-[220px] hover:-translate-y-1 transition-transform"
                >
                  <div className="w-12 h-12 rounded-xl bg-fittree-sand overflow-hidden shrink-0">
                    <img src={trendingHeroPick.image} alt={trendingHeroPick.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[8.5px] font-bold uppercase tracking-wider text-fittree-primary">Bestseller</span>
                    <h4 className="text-[12px] font-bold text-fittree-text leading-tight truncate">{trendingHeroPick.name}</h4>
                    <span className="text-[12px] font-bold text-fittree-text-light">₹{trendingHeroPick.price}</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST MARQUEE */}
      <div className="bg-fittree-forest py-3 overflow-hidden mb-16">
        <div className="flex w-max animate-[marquee_28s_linear_infinite]">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-3 text-white/80 text-[11.5px] font-bold uppercase tracking-[0.15em] px-6 shrink-0">
              {item} <span className="text-fittree-accent text-base leading-none">&bull;</span>
            </span>
          ))}
        </div>
      </div>

      {/* BOTTOM ASSURANCE CARDS */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {ASSURANCE_SIDEBAR.map((feature, i) => (
            <div key={i} className="bg-[#F5F0E6] rounded-2xl p-5 flex items-center gap-4 hover:shadow-sm transition-shadow border border-[#EBE3D5]">
              <feature.icon size={32} className="text-fittree-forest shrink-0" strokeWidth={1.5} />
              <div>
                <h4 className="text-[14px] font-bold text-fittree-dark mb-0.5">{feature.title}</h4>
                <p className="text-[12px] text-fittree-text-light font-medium">{feature.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-24 relative z-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="eyebrow">Explore the Pantry</span>
            <h3 className="font-serif text-[26px] sm:text-[28px] font-medium text-fittree-dark mt-1">Shop by Category</h3>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-1.5 text-fittree-primary font-bold text-[13.5px] hover:underline shrink-0">
            View All <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-5">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={i}
              to={cat.query ? `/products?category=${encodeURIComponent(cat.query)}` : '/products'}
              className="group relative rounded-2xl overflow-hidden aspect-square shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
              <span className="absolute bottom-0 left-0 right-0 pb-3 text-center text-white text-[13px] font-bold px-1 drop-shadow-sm">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* TRENDING THIS WEEK */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-24">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-serif text-[24px] font-bold text-fittree-forest">Trending This Week</h3>
          <Link to="/products" className="text-fittree-forest font-bold text-[13.5px] hover:text-fittree-primary transition-colors flex items-center gap-1.5 shrink-0">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {[1, 2, 3, 4, 5, 6].map(i => <ProductSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 lg:gap-6">
            {trending.map((product, idx) => {
              const badge = BADGES[idx];
              return (
                <div key={product._id} className="bg-white rounded-[1.5rem] shadow-sm hover:shadow-md transition-shadow group relative flex flex-col h-full border border-transparent hover:border-fittree-border">
                  {badge && (
                    <span className={`absolute top-3 left-3 z-10 text-[9px] font-bold uppercase tracking-wider text-white px-2.5 py-1 rounded-sm ${badge === 'Sale' ? 'bg-fittree-pink' : badge === 'Bestseller' ? 'bg-fittree-accent' : 'bg-fittree-primary'
                      }`}>{badge}</span>
                  )}
                  <Link to={`/product/${product._id}`} className="block h-[160px] bg-white rounded-t-[1.5rem] overflow-hidden p-2">
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-500" />
                  </Link>
                  <div className="p-4 flex-1 flex flex-col">
                    <Link to={`/product/${product._id}`}>
                      <h4 className="text-[13.5px] font-bold text-fittree-dark leading-snug line-clamp-1 mb-1 group-hover:text-fittree-primary transition-colors">{product.name}</h4>
                    </Link>
                    <span className="text-[11.5px] text-fittree-text-light font-medium block mb-2 truncate">Powder / Seed</span>

                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="text-[14px] font-extrabold text-fittree-dark">₹{product.price}<span className="text-[11px] text-fittree-text-light font-medium ml-0.5">/ kg</span></span>
                      <span className="flex items-center gap-1 text-[11.5px] font-bold text-fittree-text-light"><Star size={11} className="text-fittree-accent" fill="currentColor" />{product.rating || '4.8'}</span>
                    </div>

                    <button
                      onClick={(e) => quickAdd(e, product)}
                      disabled={product.countInStock === 0}
                      className="mt-4 w-full bg-fittree-forest text-white text-[12.5px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-fittree-forest-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                    >
                      <ShoppingCart size={14} /> Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>



      {/* RECENTLY VIEWED */}
      {recentlyViewed.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-20">
          <h3 className="font-display text-[20px] font-bold text-fittree-dark mb-6">Recently Viewed</h3>
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {recentlyViewed.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="shrink-0 w-[160px] sm:w-[190px] bg-white border border-fittree-border rounded-xl overflow-hidden hover:border-fittree-primary hover:shadow-fittree-sm transition-all group"
              >
                <div className="h-[110px] sm:h-[130px] bg-fittree-sand overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-3">
                  <h4 className="text-[12.5px] font-bold text-fittree-text leading-snug line-clamp-2 mb-1.5 group-hover:text-fittree-primary transition-colors">{product.name}</h4>
                  <span className="text-[13px] font-bold text-fittree-text-light">₹{product.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FOOTER STRIP */}
      <section className="border-t border-fittree-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FOOTER_STRIP.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-fittree-light text-fittree-primary flex items-center justify-center shrink-0"><f.icon size={18} /></span>
                <span>
                  <span className="block text-[13px] font-bold text-fittree-text leading-tight">{f.title}</span>
                  <span className="block text-[11px] text-fittree-text-light font-medium">{f.sub}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;

