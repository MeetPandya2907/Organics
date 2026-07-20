import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  ShoppingCart, ArrowRight, Star, ShieldCheck, Truck, Leaf, Handshake, Heart,
  MapPin, Sparkles, Clock, ChefHat, Send,
} from 'lucide-react';
import { motion } from 'framer-motion';
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

const REGIONS = [
  { place: 'Nashik, MH', crop: 'Turmeric' },
  { place: 'Idukki, KL', crop: 'Cardamom' },
  { place: 'Malwa, MP', crop: 'Masoor Dal' },
  { place: 'Unjha, GJ', crop: 'Cumin' },
];

const RECIPES = [
  { title: 'The Perfect Golden Milk (Haldi Doodh)', excerpt: 'Boost your immunity with this traditional evening drink using our high-curcumin turmeric.', image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&q=80', time: '10 Mins' },
  { title: 'Comforting Sunday Masoor Dal', excerpt: 'A hearty, protein-packed bowl of red lentil dal tempered with fresh cumin and ghee.', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80', time: '30 Mins' },
  { title: 'Overnight Chia Pudding', excerpt: 'Start your morning right with organic chia seeds soaked in almond milk and seasonal fruit.', image: 'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?w=800&q=80', time: '5 Mins' },
];

const HomePage = () => {
  const { products, fetchProducts, loading, addToCart, wishlist, toggleWishlist, recentlyViewed } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const sellableProducts = products.filter(p => p.price > 0 && p.name !== 'Sample name');
  const heroProduct = sellableProducts.find(p => p.name.includes('Turmeric')) || sellableProducts[0];

  const quickAdd = (e, product) => {
    e.preventDefault();
    if (!product || product.countInStock === 0) return;
    addToCart({ ...product, qty: 1 }, 1);
  };

  const isSaved = (id) => wishlist.some((w) => w._id === id);

  return (
    <div className="bg-fittree-bg min-h-screen font-sans pt-[130px] overflow-x-hidden">
      <Meta title="FitTree Organics | Real Spices, Pulses & Seeds From Indian Farms" />

      {/* HERO */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-2 mb-16">
        <div className="relative w-full min-h-[440px] md:min-h-[560px] rounded-[2rem] overflow-hidden shadow-fittree-md">
          <img src="/hero_banner_pantry.png" alt="Labelled jars of chia seeds, quinoa, lentils and grains on a kitchen counter" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent"></div>

          <div className="relative z-10 h-full flex flex-col justify-center px-8 sm:px-12 md:px-16 py-14 max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="pill-tag bg-white/15 backdrop-blur-sm border border-white/25 text-white w-fit mb-6"
            >
              <Sparkles size={12} /> FSSAI Licensed · 40,000+ Homes
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}
              className="text-white text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.08] mb-5 drop-shadow-md"
            >
              Clean food, from farms<br className="hidden sm:block" /> we can name.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.16 }}
              className="text-white/85 text-[15px] sm:text-[17px] leading-relaxed max-w-lg mb-8 font-medium"
            >
              Whole spices, unpolished dals and cold-milled flours — every batch traceable to a district and a growers' collective, packed the week you order.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.24 }}
              className="flex flex-wrap gap-3.5 mb-10"
            >
              <Link to="/products" className="bg-white text-fittree-text px-7 py-3.5 rounded-xl font-bold hover:scale-[1.03] transition-transform flex items-center gap-2 shadow-lg">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="border border-white/40 text-white bg-white/10 backdrop-blur-sm px-7 py-3.5 rounded-xl font-bold hover:bg-white/20 transition-colors">
                Our Sourcing Story
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.35 }}
              className="flex gap-8 border-t border-white/20 pt-5 w-fit"
            >
              {[['4.8★', 'Rating'], ['100%', 'Lab-Tested'], ['0', 'Middlemen']].map(([n, l], i) => (
                <div key={i}>
                  <b className="block text-white text-xl font-extrabold leading-none">{n}</b>
                  <span className="text-white/60 text-[11px] font-bold uppercase tracking-wider">{l}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Floating shoppable card */}
          {heroProduct && (
            <Link
              to={`/product/${heroProduct._id}`}
              className="hidden lg:flex absolute bottom-8 right-8 bg-white rounded-2xl shadow-xl p-3.5 items-center gap-3.5 w-[280px] hover:-translate-y-1 transition-transform"
            >
              <div className="w-16 h-16 rounded-xl bg-fittree-sand overflow-hidden shrink-0">
                <img src={heroProduct.image} alt={heroProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-wider text-fittree-primary">Bestseller</span>
                <h4 className="text-[13px] font-bold text-fittree-text leading-tight truncate">{heroProduct.name}</h4>
                <span className="text-[13px] font-bold text-fittree-text-light">₹{heroProduct.price}</span>
              </div>
              <button
                onClick={(e) => quickAdd(e, heroProduct)}
                className="w-9 h-9 rounded-full bg-fittree-primary text-white flex items-center justify-center shrink-0 hover:bg-fittree-primary-soft transition-colors"
              >
                <ShoppingCart size={15} />
              </button>
            </Link>
          )}
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
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

      {/* TRENDING PRODUCTS */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="eyebrow">Most reordered</span>
            <h3 className="text-[24px] font-bold text-fittree-text mt-1">Trending This Week</h3>
          </div>
          <Link to="/products" className="text-fittree-primary font-bold text-sm hover:underline shrink-0">View All →</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map(i => <ProductSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {sellableProducts.slice(0, 8).map((product, idx) => (
              <div key={product._id} className="product-card group bg-white">
                <div className="relative h-[190px] sm:h-[210px] bg-fittree-sand overflow-hidden">
                  {idx === 0 && <span className="absolute top-3 left-3 z-10 bg-fittree-accent text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">Bestseller</span>}
                  <button
                    onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                    className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center transition-colors ${
                      isSaved(product._id) ? 'text-fittree-pink' : 'text-fittree-text-light hover:text-fittree-pink'
                    }`}
                    title="Save to wishlist"
                  >
                    <Heart size={16} fill={isSaved(product._id) ? 'currentColor' : 'none'} />
                  </button>
                  <Link to={`/product/${product._id}`} className="block w-full h-full">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </Link>
                </div>

                <div className="flex flex-col flex-1 p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-fittree-primary font-bold uppercase tracking-wider">{getRegion(product)}</span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-fittree-text-light">
                      <Star size={11} className="text-fittree-accent fill-fittree-accent" /> {product.rating?.toFixed(1) || '—'}
                    </span>
                  </div>
                  <Link to={`/product/${product._id}`}>
                    <h4 className="text-[14.5px] font-bold text-fittree-text leading-snug line-clamp-2 hover:text-fittree-primary transition-colors mb-3">{product.name}</h4>
                  </Link>

                  <div className="mt-auto flex items-center justify-between gap-2 pt-3 border-t border-fittree-border">
                    <span className="text-[16px] font-extrabold text-fittree-text">₹{product.price}<span className="text-[10.5px] text-fittree-text-light font-semibold">/{getBaseUnit(product)}</span></span>
                    <button
                      onClick={(e) => quickAdd(e, product)}
                      disabled={product.countInStock === 0}
                      className={`px-4 py-2 rounded-lg font-bold text-[12px] transition-all flex items-center gap-1.5 uppercase tracking-wider shrink-0 ${
                        product.countInStock === 0
                          ? 'bg-fittree-sand text-fittree-text-light cursor-not-allowed'
                          : 'bg-fittree-primary text-white hover:bg-fittree-primary-soft shadow-sm'
                      }`}
                    >
                      <ShoppingCart size={13} /> {product.countInStock === 0 ? 'Sold' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SOURCING STORY */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center bg-white rounded-[2rem] overflow-hidden border border-fittree-border shadow-sm">
          <div className="relative h-[300px] lg:h-[460px]">
            <img src="/hero_banner_farm.png" alt="A farmer holding freshly harvested lentils in a field" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur rounded-xl px-4 py-3 shadow-lg max-w-[240px]">
              <div className="flex gap-0.5 text-fittree-accent mb-1.5">{[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" stroke="none" />)}</div>
              <p className="text-[12px] font-bold text-fittree-text leading-snug">"We visit every growers' collective twice a season."</p>
            </div>
          </div>
          <div className="p-8 lg:p-12">
            <span className="eyebrow">Where it actually comes from</span>
            <h2 className="mt-2 mb-5 text-[28px] md:text-[34px] font-extrabold leading-tight text-fittree-text">Four regions.<br />Zero middlemen.</h2>
            <p className="text-fittree-text-light text-[15px] leading-relaxed mb-8 max-w-md font-medium">
              Most "organic" labels stop at a certificate. We can tell you the district and the family behind every sack — because we still go back every season.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-9">
              {REGIONS.map((r, i) => (
                <div key={i} className="bg-fittree-bg rounded-xl border border-fittree-border px-4 py-3 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-fittree-primary/10 text-fittree-primary flex items-center justify-center shrink-0"><MapPin size={14} /></span>
                  <span>
                    <b className="block text-[13px] text-fittree-text">{r.place}</b>
                    <span className="text-[11px] text-fittree-text-light font-semibold">{r.crop}</span>
                  </span>
                </div>
              ))}
            </div>
            <Link to="/about" className="btn btn-primary">Meet Our Farmers <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-fittree-sand py-16 mb-20 border-y border-fittree-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <div className="w-12 h-12 bg-fittree-primary/10 text-fittree-primary rounded-xl flex items-center justify-center mx-auto mb-4"><Handshake size={24} /></div>
              <h4 className="font-bold text-[15px] text-fittree-text mb-2">Farm-Traced Batches</h4>
              <p className="text-[13px] text-fittree-text-light font-medium">Every pack names the district and growers' collective it came from.</p>
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

      {/* RECENTLY VIEWED */}
      {recentlyViewed.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-24">
          <h3 className="text-[22px] font-bold text-fittree-text mb-6">Recently Viewed</h3>
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

      {/* FROM THE JOURNAL */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="eyebrow">From the journal</span>
            <h3 className="text-[24px] font-bold text-fittree-text mt-1">Recipes worth cooking</h3>
          </div>
          <Link to="/recipes" className="text-fittree-primary font-bold text-sm hover:underline shrink-0">All Recipes →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RECIPES.map((r, i) => (
            <Link key={i} to="/recipes" className="group bg-white rounded-2xl overflow-hidden border border-fittree-border hover:shadow-fittree-md hover:-translate-y-1 transition-all">
              <div className="h-[170px] overflow-hidden">
                <img src={r.image} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-[11px] font-bold text-fittree-text-light uppercase tracking-wider mb-2.5">
                  <Clock size={12} /> {r.time}
                  <span className="w-1 h-1 rounded-full bg-fittree-border"></span>
                  <ChefHat size={12} /> Easy
                </div>
                <h4 className="font-bold text-[15.5px] text-fittree-text leading-snug mb-2 group-hover:text-fittree-primary transition-colors">{r.title}</h4>
                <p className="text-[12.5px] text-fittree-text-light font-medium line-clamp-2">{r.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-24">
        <h3 className="text-[24px] font-bold text-fittree-text mb-8 text-center">Loved by thousands</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-fittree-border p-6 rounded-2xl shadow-sm">
            <div className="flex gap-1 text-fittree-accent mb-4"><Star size={16} fill="currentColor" stroke="none"/><Star size={16} fill="currentColor" stroke="none"/><Star size={16} fill="currentColor" stroke="none"/><Star size={16} fill="currentColor" stroke="none"/><Star size={16} fill="currentColor" stroke="none"/></div>
            <p className="text-[14px] text-fittree-text font-medium mb-6">"The turmeric actually smells like turmeric — not the dusty stuff from the supermarket. My mother-in-law asked where I bought it."</p>
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

      {/* NEWSLETTER / WHATSAPP CTA */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-24">
        <div className="bg-fittree-primary rounded-[2rem] px-8 py-12 md:px-16 md:py-14 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 text-center md:text-left">
            <span className="inline-flex items-center gap-2 text-white/80 font-bold text-[12px] uppercase tracking-widest mb-3"><Sparkles size={14} /> First-order offer</span>
            <h3 className="text-white text-[26px] md:text-[30px] font-extrabold mb-2">Get 10% off your first pantry order</h3>
            <p className="text-white/70 text-sm font-medium">Join 40,000+ subscribers for restock alerts and recipes on WhatsApp.</p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="relative z-10 flex w-full md:w-auto max-w-md gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white/95 rounded-xl px-5 py-3.5 text-[14px] text-fittree-text placeholder-fittree-text-light focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button type="submit" className="bg-white text-fittree-primary font-bold px-5 py-3.5 rounded-xl flex items-center gap-2 hover:bg-fittree-bg transition-colors shrink-0">
              <Send size={16} /> <span className="hidden sm:inline">Subscribe</span>
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
