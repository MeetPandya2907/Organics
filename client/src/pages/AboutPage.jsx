import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, Heart, Droplet, Sun, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="bg-paper min-h-screen text-ink font-sans selection:bg-forest selection:text-white pb-20">
      
      {/* 1. RICH SPLIT HERO */}
      <section className="relative pt-32 pb-20 px-6 max-w-[1400px] mx-auto">
        <div className="bg-ink rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-glass-dark relative">
          <div className="absolute inset-0 bg-forest/20 mix-blend-overlay"></div>
          <div className="lg:w-1/2 p-12 md:p-20 flex flex-col justify-center relative z-10">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-turmeric/10 rounded-full blur-[80px]"></div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                 <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                   <Leaf size={18} className="text-leaf" />
                 </span>
                 <span className="text-leaf font-bold uppercase tracking-widest text-xs">Our Origin Story</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-8 leading-[1.1]">
                Cultivating a <br/><span className="text-turmeric">healthier future.</span>
              </h1>
              <p className="text-lg text-slate-300 font-medium leading-relaxed mb-10 max-w-md">
                We believe that the best things in life take time, patience, and a deep respect for nature. Organics was born from a desire to bring genuine, unadulterated food back to the modern table.
              </p>
            </motion.div>
          </div>
          <div className="lg:w-1/2 relative min-h-[500px] lg:min-h-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent z-10 lg:hidden"></div>
            <img src="https://images.pexels.com/photos/1581484/pexels-photo-1581484.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Farm" className="absolute inset-0 w-full h-full object-cover filter brightness-[0.8] scale-105 hover:scale-100 transition-transform duration-[20s] ease-out" />
          </div>
        </div>
      </section>

      {/* 2. VALUES GRID */}
      <section className="py-24 max-w-[1400px] mx-auto px-6 relative">
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-ink mb-6">The Organics Standard</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">Our guiding principles that dictate every decision we make, from seed to your kitchen.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {[
            { icon: <Leaf strokeWidth={1.5} />, title: "Regenerative", desc: "We use farming practices that actively restore soil health and biodiversity." },
            { icon: <ShieldCheck strokeWidth={1.5} />, title: "Uncompromising", desc: "Every batch is lab-tested. If it's not 100% pure, we don't sell it." },
            { icon: <Heart strokeWidth={1.5} />, title: "Fair & Ethical", desc: "We pay above-market rates to ensure our farmers can thrive, not just survive." },
            { icon: <Sun strokeWidth={1.5} />, title: "Sun-Dried", desc: "Many of our spices are traditionally sun-dried to lock in essential oils." }
          ].map((val, idx) => (
            <div key={idx} className="bg-white p-10 rounded-[2.5rem] shadow-glass border border-slate-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-slate-50 text-forest rounded-2xl flex items-center justify-center mb-8 border border-slate-100 group-hover:bg-forest group-hover:text-white transition-colors">
                {val.icon}
              </div>
              <h3 className="text-2xl font-display font-bold text-ink mb-4">{val.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TIMELINE / OUR JOURNEY */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-slate-50 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-[1000px] mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-ink mb-6">Our Journey</h2>
            <p className="text-slate-500 text-lg font-medium">From a small family farm to a national fair-trade network.</p>
          </div>

          <div className="space-y-16 relative before:absolute before:inset-0 before:ml-7 md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-forest/20 before:via-turmeric/50 before:to-transparent">
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-14 h-14 rounded-full border-[6px] border-white bg-forest shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-white font-display font-bold text-xl z-10">1</div>
              <div className="w-[calc(100%-5rem)] md:w-[calc(50%-3.5rem)] bg-paper p-10 rounded-[2.5rem] shadow-glass border border-slate-100 hover:shadow-lg transition-shadow">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">2015</span>
                <h3 className="font-display font-bold text-ink text-2xl mb-4">The Seed is Planted</h3>
                <p className="text-slate-500 font-medium leading-relaxed">Our founders realized the local markets were flooded with heavily pesticide-treated spices. They started cultivating a single acre using purely organic methods.</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-14 h-14 rounded-full border-[6px] border-white bg-turmeric shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-ink font-display font-bold text-xl z-10">2</div>
              <div className="w-[calc(100%-5rem)] md:w-[calc(50%-3.5rem)] bg-paper p-10 rounded-[2.5rem] shadow-glass border border-slate-100 hover:shadow-lg transition-shadow">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">2018</span>
                <h3 className="font-display font-bold text-ink text-2xl mb-4">Forming the Collective</h3>
                <p className="text-slate-500 font-medium leading-relaxed">As demand grew, we couldn't keep up. We formed a collective, partnering with 50 local farmers, teaching them organic certification standards.</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-14 h-14 rounded-full border-[6px] border-white bg-ink shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-white font-display font-bold text-xl z-10">3</div>
              <div className="w-[calc(100%-5rem)] md:w-[calc(50%-3.5rem)] bg-paper p-10 rounded-[2.5rem] shadow-glass border border-slate-100 hover:shadow-lg transition-shadow">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Today</span>
                <h3 className="font-display font-bold text-ink text-2xl mb-4">Nationwide Harvest</h3>
                <p className="text-slate-500 font-medium leading-relaxed">Today, we work with over 500 farmers across the country. Our state-of-the-art facility tests, processes, and packages the harvest without any chemical intervention.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOUNDERS BLOCK WITH RICH MEDIA */}
      <section className="py-24 max-w-[1400px] mx-auto px-6">
        <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-glass border border-slate-100 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-turmeric/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-6 relative z-10">
            <div className="rounded-[2.5rem] overflow-hidden shadow-lg border-4 border-white transform hover:-translate-y-2 transition-transform duration-500">
               <img src="https://images.pexels.com/photos/8160002/pexels-photo-8160002.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Founder" className="w-full h-72 object-cover" />
            </div>
            <div className="rounded-[2.5rem] overflow-hidden shadow-lg border-4 border-white mt-16 transform hover:-translate-y-2 transition-transform duration-500">
               <img src="https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Founder" className="w-full h-72 object-cover" />
            </div>
          </div>
          <div className="lg:w-1/2 relative z-10">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-ink mb-8 leading-tight">Built by farmers,<br/> for families.</h2>
            <p className="text-slate-600 font-medium leading-relaxed mb-6 text-lg">
              David Chen and Sarah Jenkins didn't come from the corporate world. They came from agriculture. With a combined 30 years in the fields, they understand exactly what it takes to grow premium produce.
            </p>
            <p className="text-slate-600 font-medium leading-relaxed mb-10 text-lg border-l-4 border-turmeric pl-6 italic">
              "We built Organics because we wanted our own children to eat food that we trusted. That means transparency, rigorous lab testing, and paying our partner farmers what they actually deserve."
            </p>
            <div className="flex items-center gap-6 bg-slate-50 p-6 rounded-[2rem] border border-slate-100 w-fit">
              <div className="w-14 h-14 rounded-full bg-forest text-white flex items-center justify-center shadow-md"><ShieldCheck size={24} /></div>
              <div>
                <p className="font-bold text-ink text-lg">Certified by Founders</p>
                <p className="text-sm font-medium text-slate-500 mt-1">Every product line is personally approved.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GALLERY */}
      <section className="py-12 max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="rounded-[2rem] overflow-hidden shadow-sm border-[6px] border-white group">
             <img src="https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=600" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" alt="Farm" />
          </div>
          <div className="rounded-[2rem] overflow-hidden shadow-sm border-[6px] border-white group md:-translate-y-6">
             <img src="https://images.pexels.com/photos/2165688/pexels-photo-2165688.jpeg?auto=compress&cs=tinysrgb&w=600" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" alt="Soil" />
          </div>
          <div className="rounded-[2rem] overflow-hidden shadow-sm border-[6px] border-white group">
             <img src="https://images.pexels.com/photos/3825582/pexels-photo-3825582.jpeg?auto=compress&cs=tinysrgb&w=600" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" alt="Spices" />
          </div>
          <div className="rounded-[2rem] overflow-hidden shadow-sm border-[6px] border-white group md:-translate-y-6">
             <img src="https://images.pexels.com/photos/6169051/pexels-photo-6169051.jpeg?auto=compress&cs=tinysrgb&w=600" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" alt="Packaging" />
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="py-32 text-center px-6 max-w-[1000px] mx-auto">
        <div className="bg-ink rounded-[3rem] p-16 md:p-24 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-forest/20 mix-blend-overlay"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-turmeric/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-8 border border-white/20 backdrop-blur-md">
              <Leaf className="text-leaf" size={28} strokeWidth={1.5} />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-10 leading-tight max-w-2xl">Ready to taste the <br/><span className="text-turmeric">difference?</span></h2>
            <Link to="/products" className="btn bg-turmeric hover:bg-turmeric-light text-ink shadow-xl shadow-turmeric/20 text-lg px-10 py-5 inline-flex items-center gap-3">
              Shop The Harvest <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
