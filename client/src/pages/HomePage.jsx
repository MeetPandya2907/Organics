import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ShoppingCart, ArrowRight, Star, ShieldCheck, Truck, Leaf, Award, Quote, CheckCircle, ChevronRight, Play } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const HomePage = () => {
  const { products, fetchProducts, loading, addToCart, userInfo } = useStore();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="bg-paper min-h-screen font-sans selection:bg-turmeric/30 selection:text-ink pb-20 overflow-hidden">

      {/* 1. PREMIUM HERO SECTION */}
      <section className="relative w-full h-[95vh] min-h-[700px] flex items-center justify-center pt-24 overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 w-full h-full">
          <img
            src="https://images.pexels.com/photos/1581484/pexels-photo-1581484.jpeg?auto=compress&cs=tinysrgb&w=2000"
            alt="Organic Farm"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink/90"></div>
        </motion.div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-[0.2em] uppercase mb-8 text-white">
              <Leaf size={14} className="text-turmeric" /> The New Standard of Purity
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-display mb-8 leading-[1.1] text-white">
              Earth's Finest,<br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-turmeric-light to-turmeric font-serif italic">Curated for You.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-light mb-12 leading-relaxed max-w-2xl">
              Elevate your wellness journey with our meticulously sourced, lab-tested organic harvest. Direct from regenerative farms to your table.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
              <Link to="/products" className="w-full sm:w-auto px-10 py-4 sm:py-5 bg-turmeric text-white rounded-full font-bold text-[15px] hover:bg-turmeric-light transition-all shadow-glow hover:-translate-y-1 flex items-center justify-center gap-3 group">
                Explore The Harvest <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/about" className="w-full sm:w-auto px-10 py-4 sm:py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-bold text-[15px] hover:bg-white/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-3">
                <Play size={18} className="text-turmeric" /> Watch Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* OVERLAPPING FEATURES STRIP */}
      <div className="max-w-[1200px] mx-auto -mt-20 relative z-20 px-4 mb-32">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-glass border border-white p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {[
            { icon: <Leaf className="text-leaf" />, title: "100% Organic", desc: "Certified pure products" },
            { icon: <ShieldCheck className="text-turmeric" />, title: "Lab Tested", desc: "Zero chemical residue" },
            { icon: <Truck className="text-blue-500" />, title: "Free Shipping", desc: "On orders over ₹999" },
            { icon: <Award className="text-forest" />, title: "Fair Trade", desc: "Direct from farmers" }
          ].map((feature, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              key={idx} 
              className="flex items-center gap-5 px-4 w-full pt-6 md:pt-0"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-bold text-ink text-[15px] mb-1">{feature.title}</h4>
                <p className="text-sm text-slate-500 font-medium">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 2. BENTO GRID CATEGORIES */}
      <section className="py-20 px-6 max-w-[1400px] mx-auto mb-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-turmeric font-bold tracking-widest uppercase text-sm mb-3 block">Curated Collections</span>
            <h2 className="text-4xl md:text-5xl font-display text-ink leading-tight">Discover Nature's <br/><span className="italic text-slate-500 font-serif">Finest Ingredients</span></h2>
          </div>
          <Link to="/products" className="group flex items-center gap-2 text-forest font-bold hover:text-turmeric transition-colors">
            View All Categories <span className="w-8 h-8 rounded-full bg-forest/5 flex items-center justify-center group-hover:bg-turmeric/10 transition-colors"><ChevronRight size={16} /></span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-[auto_auto] gap-6 max-w-[1400px] mx-auto h-[800px] md:h-[600px]">
          {/* Large Featured Category */}
          <Link to="/products?category=SPICES" className="group relative rounded-[2rem] overflow-hidden md:col-span-2 md:row-span-2 shadow-soft">
            <img src="https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Spices" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-10 w-full">
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-wider mb-4 inline-block">Best Seller</span>
              <h3 className="text-4xl font-display font-bold text-white mb-2">Premium Spices</h3>
              <p className="text-slate-200 font-light max-w-sm mb-6">Aromatic, vibrant, and ethically sourced spices for your culinary masterpieces.</p>
              <span className="inline-flex items-center gap-2 text-turmeric font-bold group-hover:text-white transition-colors">
                Shop Collection <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </span>
            </div>
          </Link>
          
          {/* Small Category 1 */}
          <Link to="/products?category=PULSES" className="group relative rounded-[2rem] overflow-hidden shadow-soft">
            <img src="https://images.pexels.com/photos/6287515/pexels-photo-6287515.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Pulses" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <h3 className="text-2xl font-bold text-white group-hover:text-turmeric transition-colors mb-1">Pulses & Grains</h3>
              <p className="text-slate-300 text-sm">Protein-rich staples.</p>
            </div>
          </Link>
          
          {/* Small Category 2 */}
          <Link to="/products?category=SEEDS" className="group relative rounded-[2rem] overflow-hidden shadow-soft">
            <img src="https://images.pexels.com/photos/10313176/pexels-photo-10313176.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Seeds" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <h3 className="text-2xl font-bold text-white group-hover:text-turmeric transition-colors mb-1">Super Seeds</h3>
              <p className="text-slate-300 text-sm">Nutrient-dense powerhouses.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. BEST SELLERS CAROUSEL */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-leaf font-bold tracking-widest uppercase text-sm mb-3 block">Top Rated</span>
              <h2 className="text-4xl md:text-5xl font-display text-ink">Customer Favorites</h2>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest"></div></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.slice(0, 4).map((product, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  key={product._id} 
                  className="group flex flex-col bg-paper rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-soft transition-all duration-500 overflow-hidden"
                >
                  <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden">
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-ink px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest z-10 shadow-sm">
                      {product.category}
                    </span>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply"
                    />
                    
                    {/* Hover Overlay Action */}
                    <div className="absolute inset-0 bg-ink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
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
                        className="translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-ink font-bold px-6 py-3 rounded-full shadow-lg hover:bg-forest hover:text-white flex items-center gap-2"
                      >
                        <ShoppingCart size={18} /> Quick Add
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1 bg-white">
                    <div className="flex items-center gap-1 text-turmeric mb-3">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                      <span className="text-slate-400 text-xs ml-1 font-medium">({product.numReviews})</span>
                    </div>
                    <Link to={`/product/${product._id}`} className="mb-4 flex-1">
                      <h3 className="text-[17px] font-bold text-ink group-hover:text-forest transition-colors line-clamp-2 leading-tight">{product.name}</h3>
                    </Link>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-400 font-medium mb-0.5">Starting at</span>
                        <span className="text-xl font-bold text-forest">₹{product.price}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. SPLIT FEATURE BLOCK (Dark Premium) */}
      <section className="py-32 bg-ink text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-forest/20 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/4"></div>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[500px] lg:h-[700px] rounded-[3rem] overflow-hidden group">
              <img src="https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Farmer" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80"></div>
              {/* Floating Badge */}
              <div className="absolute bottom-10 left-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 max-w-[280px]">
                <div className="flex gap-1 text-turmeric mb-2">
                   {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="font-medium text-sm text-white mb-2">"The highest quality organic produce we've ever sourced."</p>
                <p className="text-xs text-slate-300 uppercase tracking-wider font-bold">— EcoFarms Cert.</p>
              </div>
            </div>
            
            <div className="flex flex-col justify-center">
              <span className="text-turmeric font-bold tracking-[0.2em] uppercase text-sm mb-6 block">Our Philosophy</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display mb-8 leading-[1.1]">The difference is <br/><span className="font-serif italic text-slate-400">in the soil.</span></h2>
              <p className="text-slate-300 text-lg font-light mb-10 leading-relaxed max-w-xl">
                We believe that healthy food can only come from healthy earth. By utilizing regenerative agriculture, our farmers restore soil vitality, conserve water, and grow crops that are significantly richer in essential nutrients.
              </p>
              
              <ul className="space-y-6 mb-12">
                {[
                  "Zero synthetic pesticides or chemicals",
                  "Non-GMO Heirloom seeds for rich flavor",
                  "Harvested exactly at peak maturity"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-white font-medium">
                    <span className="w-10 h-10 rounded-full bg-forest/20 flex items-center justify-center text-leaf shrink-0">
                      <CheckCircle size={20} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              
              <div>
                <Link to="/about" className="px-10 py-5 bg-white text-ink rounded-full font-bold hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-3 group">
                  Discover Our Process <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MINIMALIST TESTIMONIALS */}
      <section className="py-32 bg-paper relative">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-forest font-bold tracking-widest uppercase text-sm mb-3 block">Voices of Wellness</span>
            <h2 className="text-4xl md:text-5xl font-display text-ink">Trusted by Thousands</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "The quality of the spices is unmatched. You can literally smell the freshness the moment you open the pouch. I'm never going back to supermarket brands.", name: "Priya M.", role: "Home Chef" },
              { text: "I've been looking for a reliable source of organic pulses for my family. Organics delivers on every promise. Clean, healthy, and ethical.", name: "Rahul S.", role: "Verified Buyer" },
              { text: "Not only is the food incredible, but their customer service and sustainable packaging make me feel good about every purchase.", name: "Ananya K.", role: "Nutritionist" }
            ].map((review, idx) => (
              <div key={idx} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 relative group hover:shadow-soft transition-all duration-300 hover:-translate-y-2">
                <Quote className="text-turmeric/10 absolute top-8 right-8 transition-transform group-hover:scale-110" size={64} />
                <div className="flex gap-1 text-turmeric mb-8 relative z-10">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-slate-600 font-medium text-lg leading-relaxed mb-10 relative z-10">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-ink text-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-ink">{review.name}</h4>
                    <p className="text-sm text-forest font-medium">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
