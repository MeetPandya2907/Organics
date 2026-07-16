import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  ShoppingCart, ArrowRight, Star, ShieldCheck, Truck, Leaf, Undo2,
  Quote, ChevronRight, Sparkles, Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import Meta from '../components/Meta';
import ProductSkeleton from '../components/ProductSkeleton';
import { getBaseUnit } from '../utils/units';

const CATEGORIES = [
  {
    name: 'Whole Spices',
    query: 'SPICES',
    tag: '3 varieties',
    color: 'bg-fittree-orange',
    img: 'https://fittreeinternational.com/wp-content/uploads/2026/01/imresizer-istockphoto-515677966-170667a.jpg',
  },
  {
    name: 'Pulses & Dals',
    query: 'PULSES',
    tag: 'Protein staples',
    color: 'bg-fittree-primary',
    img: 'https://fittreeinternational.com/wp-content/uploads/2026/01/imresizer-bowl-sackcloth-red-raw-lentils-wooden-board.jpg.jpg',
  },
  {
    name: 'Seeds & Superfoods',
    query: 'SEEDS',
    tag: 'Quinoa, chia & more',
    color: 'bg-fittree-pink',
    img: 'https://fittreeinternational.com/wp-content/uploads/2026/01/istockphoto-1153368009-612x612-1-1.jpg',
  },
  {
    name: 'Dehydrated Range',
    query: 'DEHYDRATED PRODUCTS',
    tag: 'Instant kitchen fixes',
    color: 'bg-fittree-yellow',
    img: 'https://fittreeinternational.com/wp-content/uploads/2026/01/76-769552_dehydrated._imresizer.jpg',
  },
];

const KITCHEN_STORIES = [
  {
    tag: 'Turmeric Powder (Haldi)',
    title: 'The base of every good curry',
    desc: 'High-curcumin, deep golden colour — a teaspoon transforms dal, sabzi or a warm turmeric latte.',
    meta: ['₹199 / 100g', 'Everyday staple'],
    img: 'https://fittreeinternational.com/wp-content/uploads/2026/01/imresizer-turmeric-2344157-scaled-1-1.jpg',
  },
  {
    tag: 'Masoor Dal (Red Lentils)',
    title: 'Sunday dal fry, done right',
    desc: 'Unpolished and quick-cooking, it holds tadka beautifully and needs no soaking.',
    meta: ['₹149 / kg', 'Cooks in 20 min'],
    img: 'https://fittreeinternational.com/wp-content/uploads/2026/01/imresizer-bowl-sackcloth-red-raw-lentils-wooden-board.jpg.jpg',
  },
  {
    tag: 'Green Cardamom (Elaichi)',
    title: 'The queen of your chai',
    desc: 'Handpicked pods with the boldest aroma — crush two into your next pot of masala chai.',
    meta: ['₹899 / 100g', 'Festive favourite'],
    img: 'https://fittreeinternational.com/wp-content/uploads/2026/01/imresizer-istockphoto-515677966-170667a.jpg',
  },
];

const HomePage = () => {
  const { products, fetchProducts, loading, addToCart, userInfo } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const heroChipA = products.find(p => p.name.includes('Turmeric')) || products[0];
  const heroChipB = products.find(p => p.name.includes('Cardamom') && p._id !== heroChipA?._id) || products.find(p => p._id !== heroChipA?._id);

  const quickAdd = (e, product) => {
    e.preventDefault();
    if (!product) return;
    if (!userInfo) navigate('/login');
    else addToCart({ ...product, qty: 1 }, 1);
  };

  return (
    <div className="bg-fittree-bg min-h-screen font-sans pb-24 pt-[104px] md:pt-[112px] overflow-x-hidden">
      <Meta title="FitTree Organics | Real Spices, Pulses & Seeds from Indian Farms" />

      {/* 1. HERO */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-4 pb-16">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-fittree-light via-white to-fittree-light border border-fittree-border/70">
          {/* decorative depth */}
          <div className="absolute -top-24 -right-16 w-[420px] h-[420px] bg-fittree-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[360px] h-[300px] bg-fittree-orange/10 rounded-full blur-[90px] pointer-events-none"></div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-14 items-center px-6 py-14 sm:px-10 sm:py-16 md:px-16 md:py-20">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex flex-wrap items-center gap-2.5 mb-7">
                <span className="pill-tag bg-white text-fittree-primary shadow-fittree-sm"><ShieldCheck size={13} /> FSSAI Licensed</span>
                <span className="pill-tag bg-white text-fittree-orange-dark shadow-fittree-sm"><Leaf size={13} /> Direct from farms</span>
              </div>
              <h1 className="mb-6">
                Your masala box,<br />
                <span className="relative inline-block text-fittree-orange">
                  reinvented.
                  <svg className="absolute left-0 -bottom-2 w-full" height="10" viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M2 7 Q 50 1 100 5 T 198 4" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.35" />
                  </svg>
                </span>
              </h1>
              <p className="text-lg text-fittree-text-light max-w-lg mb-9 font-medium leading-relaxed">
                Whole spices, dals and seeds — sourced straight from Indian farms and packed the week you order. No fillers, no dust, just the real thing.
              </p>
              <div className="flex flex-wrap items-center gap-7 mb-11">
                <Link to="/products" className="btn btn-primary">
                  Shop the pantry <ArrowRight size={17} />
                </Link>
                <Link to="/about" className="inline-flex items-center gap-2 font-bold text-[14.5px] text-fittree-text hover:text-fittree-primary transition-colors group">
                  Our sourcing story
                  <span className="w-7 h-7 rounded-full bg-white shadow-fittree-sm flex items-center justify-center group-hover:translate-x-1 transition-transform"><ChevronRight size={14} /></span>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-7 border-t border-fittree-dark/10">
                <div className="flex -space-x-3">
                  {['P', 'R', 'A', 'S'].map((initial, i) => (
                    <div key={i} className="w-9 h-9 rounded-full bg-fittree-primary text-white flex items-center justify-center text-xs font-extrabold border-2 border-white shadow-sm">{initial}</div>
                  ))}
                </div>
                <div className="h-8 w-px bg-fittree-dark/10"></div>
                <div>
                  <div className="flex items-center gap-1 text-fittree-yellow">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={13} fill="currentColor" stroke="none" />)}
                    <span className="text-fittree-dark font-extrabold text-sm ml-1">4.8</span>
                  </div>
                  <p className="text-xs text-fittree-text-light font-semibold">from 40,000+ Indian kitchens</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative h-[380px] sm:h-[440px] lg:h-[480px]"
            >
              <div className="absolute inset-0 sm:inset-4 rounded-[2rem] overflow-hidden shadow-fittree-xl border-4 border-white">
                <img src="https://fittreeinternational.com/wp-content/uploads/2026/01/imresizer-turmeric-2344157-scaled-1-1.jpg" alt="Turmeric powder, a FitTree Organics bestseller" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-fittree-dark/50 via-transparent to-transparent"></div>
              </div>

              {/* Shoppable chip 1 */}
              {heroChipA && (
                <Link
                  to={`/product/${heroChipA._id}`}
                  className="absolute -top-2 left-0 sm:-left-4 bg-white rounded-2xl shadow-fittree-lg border border-fittree-border p-3 pr-4 flex items-center gap-3 hover:-translate-y-1 transition-transform animate-float"
                >
                  <img src={heroChipA.image} alt={heroChipA.name} className="w-12 h-12 rounded-xl object-cover bg-fittree-light" />
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-fittree-dark leading-tight truncate max-w-[130px]">{heroChipA.name}</p>
                    <p className="text-xs font-extrabold text-fittree-primary">₹{heroChipA.price}</p>
                  </div>
                  <button
                    onClick={(e) => quickAdd(e, heroChipA)}
                    className="w-8 h-8 rounded-full bg-fittree-light flex items-center justify-center text-fittree-primary hover:bg-fittree-primary hover:text-white transition-colors shrink-0"
                    aria-label={`Add ${heroChipA.name} to cart`}
                  >
                    <Plus size={15} />
                  </button>
                </Link>
              )}

              {/* Shoppable chip 2 */}
              {heroChipB && (
                <Link
                  to={`/product/${heroChipB._id}`}
                  className="absolute -bottom-2 right-0 sm:-right-4 bg-white rounded-2xl shadow-fittree-lg border border-fittree-border p-3 pr-4 flex items-center gap-3 hover:-translate-y-1 transition-transform"
                >
                  <img src={heroChipB.image} alt={heroChipB.name} className="w-12 h-12 rounded-xl object-cover bg-fittree-light" />
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-fittree-dark leading-tight truncate max-w-[130px]">{heroChipB.name}</p>
                    <p className="text-xs font-extrabold text-fittree-primary">₹{heroChipB.price}</p>
                  </div>
                  <button
                    onClick={(e) => quickAdd(e, heroChipB)}
                    className="w-8 h-8 rounded-full bg-fittree-light flex items-center justify-center text-fittree-primary hover:bg-fittree-primary hover:text-white transition-colors shrink-0"
                    aria-label={`Add ${heroChipB.name} to cart`}
                  >
                    <Plus size={15} />
                  </button>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <div className="max-w-[1200px] mx-auto px-6 mb-20">
        <div className="bg-white rounded-[2rem] border border-fittree-border shadow-fittree-sm p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <ShieldCheck className="text-fittree-primary" />, title: 'FSSAI Certified', desc: 'Lab-tested purity' },
            { icon: <Truck className="text-fittree-orange" />, title: 'COD Available', desc: 'Pay on delivery' },
            { icon: <Leaf className="text-fittree-pink" />, title: 'Farm Direct', desc: 'No middlemen' },
            { icon: <Undo2 className="text-fittree-dark" />, title: '7-Day Returns', desc: 'Easy & free' },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-fittree-light flex items-center justify-center shrink-0">{f.icon}</div>
              <div><h4 className="font-extrabold text-[13.5px] text-fittree-dark leading-tight">{f.title}</h4><p className="text-[11.5px] text-fittree-text-light font-semibold">{f.desc}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. CATEGORY SHELF */}
      <section className="max-w-[1400px] mx-auto px-6 mb-24">
        <div className="flex justify-between items-end mb-10 gap-4 flex-wrap">
          <div>
            <span className="eyebrow text-fittree-orange-dark">The pantry shelf</span>
            <h2 className="mt-2">What's actually in stock</h2>
          </div>
          <Link to="/products" className="link-more inline-flex items-center gap-1.5 font-bold text-fittree-primary text-sm">
            Browse everything <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat) => (
            <Link key={cat.query} to={`/products?category=${encodeURIComponent(cat.query)}`} className="group relative rounded-[2rem] overflow-hidden aspect-[3/4] shadow-fittree-md border border-white hover:shadow-fittree-xl transition-shadow">
              <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-fittree-dark/90 via-fittree-dark/10 to-transparent"></div>
              <span className={`absolute top-4 left-4 ${cat.color} text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full`}>{cat.tag}</span>
              <div className="absolute bottom-0 left-0 p-5">
                <h3 className="text-white font-display font-extrabold text-xl leading-tight">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. BESTSELLERS */}
      <section className="bg-fittree-light py-20 mb-24">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex justify-between items-end mb-10 gap-4 flex-wrap">
            <div>
              <span className="eyebrow text-fittree-pink">Most reordered</span>
              <h2 className="mt-2">This month's bestsellers</h2>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <ProductSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  key={product._id}
                  className="product-card bg-white"
                >
                  <div className="relative aspect-square bg-white p-4">
                    <span className="absolute top-4 left-4 bg-fittree-dark text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full z-10">
                      {product.category}
                    </span>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-5 pt-2 flex flex-col flex-1 border-t border-fittree-border">
                    <div className="flex items-center gap-0.5 text-fittree-yellow mb-2">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} size={13} fill="currentColor" stroke="none" />)}
                      <span className="text-fittree-text-light text-xs ml-1.5 font-bold">({product.numReviews})</span>
                    </div>
                    <Link to={`/product/${product._id}`} className="mb-4 flex-1">
                      <h3 className="text-[16px] font-bold text-fittree-dark hover:text-fittree-primary transition-colors line-clamp-2 leading-snug">{product.name}</h3>
                    </Link>
                    <div className="flex items-center justify-between mt-auto pt-3">
                      <span className="font-display font-extrabold text-xl text-fittree-primary">₹{product.price}<span className="font-sans text-xs font-semibold text-fittree-text-light">/{getBaseUnit(product)}</span></span>
                      <button
                        onClick={(e) => quickAdd(e, product)}
                        className="w-10 h-10 rounded-full bg-fittree-light flex items-center justify-center text-fittree-primary hover:bg-fittree-primary hover:text-white transition-all shadow-sm hover:shadow-fittree-sm"
                        title="Add to cart"
                      >
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. KITCHEN STORIES */}
      <section className="max-w-[1400px] mx-auto px-6 mb-24">
        <div className="mb-10 max-w-xl">
          <span className="eyebrow text-fittree-primary">From our kitchen to yours</span>
          <h2 className="mt-2 mb-3">Know the dish before you know the spice</h2>
          <p className="text-fittree-text-light font-medium">A jar of cardamom is only useful if you know what to do with it.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {KITCHEN_STORIES.map((story, i) => (
            <div key={i} className="fittree-card bg-white flex flex-col">
              <div className="h-44 overflow-hidden">
                <img src={story.img} alt={story.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-fittree-orange-dark mb-2">{story.tag}</span>
                <h3 className="text-lg font-bold text-fittree-dark mb-2 leading-snug">{story.title}</h3>
                <p className="text-[13.5px] text-fittree-text-light font-medium leading-relaxed mb-4">{story.desc}</p>
                <div className="flex gap-2 mt-auto flex-wrap">
                  {story.meta.map((m, j) => (
                    <span key={j} className="text-[11px] font-bold bg-fittree-light text-fittree-text px-3 py-1.5 rounded-full">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SOURCING (bold color block) */}
      <section className="bg-fittree-dark text-white py-24 mb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-fittree-primary/25 rounded-full blur-[110px] pointer-events-none translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[420px] h-[320px] bg-fittree-orange/15 rounded-full blur-[100px] pointer-events-none -translate-x-1/4"></div>
        <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="relative h-[380px] lg:h-[460px] rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-fittree-xl">
            <img src="https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Farmer in a field" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-fittree-dark via-transparent to-transparent opacity-70"></div>
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md rounded-2xl p-6 max-w-[260px] shadow-fittree-lg border border-white/40">
              <div className="flex gap-0.5 text-fittree-yellow mb-2">{[1, 2, 3, 4, 5].map(i => <Star key={i} size={13} fill="currentColor" stroke="none" />)}</div>
              <p className="text-[12.5px] font-bold text-fittree-dark leading-snug">"We visit every co-operative twice a season."</p>
            </div>
          </div>
          <div>
            <span className="eyebrow text-fittree-yellow">Where it actually comes from</span>
            <h2 className="text-white mt-3 mb-6">A supply chain we can name, region by region.</h2>
            <p className="text-white/75 text-[16.5px] font-medium leading-relaxed mb-9 max-w-xl">
              Most "organic" labels stop at a certificate. We can tell you the district and the family behind every sack — because unlike a certificate, we still go back every season.
            </p>
            <ul className="space-y-5 mb-10">
              <li className="flex gap-3 items-start"><span className="w-2 h-2 rounded-full bg-fittree-yellow mt-2 shrink-0"></span><span className="text-[14.5px] font-medium"><b className="font-bold">Kerala & Karnataka</b> — cardamom and pepper from small growers' collectives.</span></li>
              <li className="flex gap-3 items-start"><span className="w-2 h-2 rounded-full bg-fittree-orange mt-2 shrink-0"></span><span className="text-[14.5px] font-medium"><b className="font-bold">Madhya Pradesh</b> — masoor and other dals, stone-milled without polish.</span></li>
              <li className="flex gap-3 items-start"><span className="w-2 h-2 rounded-full bg-fittree-primary mt-2 shrink-0"></span><span className="text-[14.5px] font-medium"><b className="font-bold">Rajasthan & Gujarat</b> — coriander, cumin and dehydrated onion &amp; garlic.</span></li>
            </ul>
            <Link to="/about" className="btn btn-accent">
              Meet our farmers <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. REVIEWS */}
      <section className="max-w-[1400px] mx-auto px-6 mb-20">
        <div className="text-center mb-14">
          <span className="eyebrow text-fittree-orange-dark">What India's kitchens are saying</span>
          <h2 className="mt-2">40,000+ homes, one pantry</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { text: "The turmeric actually smells like turmeric, not the dusty stuff from the supermarket shelf. My mother-in-law asked where I bought it.", name: 'Priya Menon', city: 'Bengaluru' },
            { text: "Ordered COD the first time to be sure. Been reordering the masoor dal every month since — cooks softer, no stones.", name: 'Rohit Sharma', city: 'Lucknow' },
            { text: "Finally a spice brand that tells you which region it's from. The cardamom is genuinely stronger than anything I've cooked with before.", name: 'Ananya Kulkarni', city: 'Pune' },
          ].map((review, idx) => (
            <div key={idx} className="fittree-card bg-white p-8 relative">
              <Quote className="text-fittree-orange/10 absolute top-6 right-6" size={56} />
              <div className="flex gap-0.5 text-fittree-yellow mb-5 relative z-10">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" stroke="none" />)}
              </div>
              <p className="text-fittree-text font-medium text-[15px] leading-relaxed mb-7 relative z-10">"{review.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-fittree-light flex items-center justify-center font-display font-extrabold text-fittree-dark">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-fittree-dark text-sm">{review.name}</h4>
                  <p className="text-xs text-fittree-primary font-bold">Verified buyer · {review.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CTA BAND */}
      <section className="max-w-[1400px] mx-auto px-6">
        <div className="bg-[#DF8C60] rounded-[2.5rem] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-fittree-lg relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-fittree-yellow rounded-full opacity-30"></div>
          <div className="relative z-10 max-w-lg">
            <span className="flex items-center gap-2 text-fittree-dark font-extrabold text-sm mb-3"><Sparkles size={16} /> First-order offer</span>
            <h3 className="text-white text-3xl md:text-4xl mb-2">Get 10% off your first pantry order</h3>
            <p className="text-white/85 font-medium text-sm">Join 40,000+ subscribers for restock alerts and recipes on WhatsApp.</p>
          </div>
          <Link to="/register" className="btn bg-white text-fittree-dark shadow-fittree-lg hover:-translate-y-1 hover:shadow-fittree-xl relative z-10 shrink-0">
            Get my discount <ArrowRight size={17} />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
