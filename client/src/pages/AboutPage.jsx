import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Leaf, Handshake, FlaskConical, Package, ArrowRight, ShieldCheck,
  CheckCircle2, Send, Sprout, Heart, Tractor, Award, Users,
} from 'lucide-react';
import Meta from '../components/Meta';
import NewsletterForm from '../components/NewsletterForm';

const STATS = [
  { icon: Sprout, n: '100+', l: 'Organic Products' },
  { icon: Heart, n: '50K+', l: 'Happy Customers' },
  { icon: Tractor, n: '30+', l: 'Partner Farms' },
  { icon: ShieldCheck, n: '100%', l: 'Quality Assured' },
  { icon: Award, n: '5+', l: 'Years of Trust' },
];

const WHY_CHOOSE = [
  'Chemical & Pesticide Free',
  'Sourced from Trusted Farmers',
  'Lab Tested for Purity',
  'Sustainable & Ethical Practices',
  'Secure Packaging & Timely Delivery',
];

const WHY_CARDS = [
  { title: 'Pure & Natural', desc: 'No additives, no preservatives. Just honest, natural food.', icon: Leaf, img: 'https://fittreeinternational.com/wp-content/uploads/2026/01/imresizer-bowl-sackcloth-red-raw-lentils-wooden-board.jpg.jpg' },
  { title: 'Farm to Home', desc: 'Directly sourced from farms and delivered to your home.', icon: Tractor, img: '/hero_banner_farm.png' },
  { title: 'Better for Earth', desc: 'We care for our planet through responsible & eco-friendly practices.', icon: Sprout, img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&q=80' },
];

const OUR_VALUES = [
  { icon: ShieldCheck, title: 'Integrity', desc: 'We believe in honesty and transparency in everything we do.' },
  { icon: Award, title: 'Quality', desc: 'We never compromise on the quality of our products.' },
  { icon: Leaf, title: 'Sustainability', desc: 'We support sustainable farming and care for the environment.' },
  { icon: Users, title: 'Customer First', desc: 'Your health and happiness are our top priorities.' },
];

const AboutPage = () => {
  return (
    <div className="bg-fittree-cream min-h-screen text-fittree-text font-sans pb-0 pt-[130px]">
      <Meta title="FitTree Organics | Our Story" description="Learn how FitTree Organics sources whole spices, pulses and seeds directly from named farms across India." />

      {/* HERO */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-fittree-primary font-bold text-[12px] uppercase tracking-[0.18em] mb-4 block">About FitTree Organics</span>
            <motion.h1
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="font-serif text-[2.6rem] sm:text-[3.1rem] font-medium leading-[1.05] mb-6"
            >
              <span className="text-fittree-dark">Pure Food.</span><br /><span className="text-fittree-primary">Pure Purpose.</span>
            </motion.h1>
            <p className="text-fittree-text-light text-[15.5px] leading-relaxed max-w-md mb-8 font-medium">
              At FitTree Organics, we believe good health begins with pure, natural and honest food. That's why we bring you organic staples directly from trusted Indian farms.
            </p>
            <div className="flex flex-wrap gap-8 mb-9">
              <div className="flex items-center gap-3">
                <Leaf size={22} className="text-fittree-primary shrink-0" />
                <span className="leading-tight"><span className="block text-[13.5px] font-bold text-fittree-text">100% Organic</span><span className="block text-[11.5px] text-fittree-text-light font-medium">No Chemicals</span></span>
              </div>
              <div className="flex items-center gap-3">
                <Handshake size={22} className="text-fittree-primary shrink-0" />
                <span className="leading-tight"><span className="block text-[13.5px] font-bold text-fittree-text">Farm to Home</span><span className="block text-[11.5px] text-fittree-text-light font-medium">Direct from Farmers</span></span>
              </div>
            </div>
            <Link to="/products" className="inline-flex items-center gap-2 bg-fittree-forest text-white px-7 py-3.5 rounded-xl font-bold text-[14.5px] hover:bg-fittree-forest-light transition-colors shadow-lg shadow-fittree-forest/15">
              Our Story <ArrowRight size={16} />
            </Link>
          </div>

          <div className="relative">
            <div className="relative rounded-tl-[5rem] rounded-br-[5rem] rounded-tr-2xl rounded-bl-2xl overflow-hidden aspect-[16/11] shadow-fittree-lg">
              <img src="/hero_banner_farm.png" alt="A farmer tending organic crops in a field" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block absolute -right-6 top-1/2 -translate-y-1/2 w-[230px] bg-fittree-forest rounded-2xl p-6 shadow-xl">
              <span className="font-serif text-fittree-accent text-4xl leading-none block mb-1">&ldquo;</span>
              <p className="text-white/90 text-[14px] font-medium leading-snug -mt-2">We work directly with farmers who follow natural &amp; sustainable farming methods.</p>
              <Leaf size={38} className="text-white/10 absolute bottom-4 right-4" />
            </div>
          </div>
        </div>
      </section>

      {/* OUR JOURNEY */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] shadow-fittree-md">
              <img src="/01_hero_product_basket.jpg" alt="A wicker basket of FitTree Organics Toor Dal, Moong Dal, oils and spice jars" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="hidden sm:flex absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white shadow-xl border border-fittree-border items-center justify-center text-center">
              <span className="text-fittree-forest font-serif italic text-[12px] font-medium leading-tight">Pure<br />Natural</span>
            </div>
          </div>

          <div>
            <span className="text-fittree-primary font-bold text-[12px] uppercase tracking-[0.18em] mb-4 block">Our Journey</span>
            <h2 className="font-serif text-[2.1rem] font-medium leading-tight text-fittree-dark mb-6">From Our Farms<br />to Your Family</h2>
            <p className="text-fittree-text-light text-[14.5px] leading-relaxed mb-4 font-medium max-w-md">
              FitTree Organics started with a simple idea — to make clean, chemical-free food accessible to every home.
            </p>
            <p className="text-fittree-text-light text-[14.5px] leading-relaxed mb-9 font-medium max-w-md">
              We partner with farmers who share our values of purity, transparency and sustainability. Every product you see is carefully sourced, tested and packed with love.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-md">
              <div className="flex items-center gap-2.5">
                <Handshake size={19} className="text-fittree-primary shrink-0" />
                <span className="leading-tight"><span className="block text-[12.5px] font-bold text-fittree-text">Carefully Sourced</span><span className="block text-[10.5px] text-fittree-text-light font-medium">From Trusted Farms</span></span>
              </div>
              <div className="flex items-center gap-2.5">
                <FlaskConical size={19} className="text-fittree-primary shrink-0" />
                <span className="leading-tight"><span className="block text-[12.5px] font-bold text-fittree-text">Lab Tested</span><span className="block text-[10.5px] text-fittree-text-light font-medium">For Purity</span></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Package size={19} className="text-fittree-primary shrink-0" />
                <span className="leading-tight"><span className="block text-[12.5px] font-bold text-fittree-text">Hygienically Packed</span><span className="block text-[10.5px] text-fittree-text-light font-medium">With Care</span></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-16">
        <div className="bg-fittree-forest rounded-[2rem] py-8 px-6 sm:px-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {STATS.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <s.icon size={26} className="text-fittree-accent shrink-0" />
              <span>
                <span className="block font-serif text-white text-[22px] font-medium leading-none">{s.n}</span>
                <span className="block text-white/60 text-[11px] font-semibold mt-1">{s.l}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-16">
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12 items-center">
          <div>
            <span className="text-fittree-primary font-bold text-[12px] uppercase tracking-[0.18em] mb-4 block">Why Choose Us</span>
            <h2 className="font-serif text-[2.1rem] font-medium leading-tight text-fittree-dark mb-5">Better Food. Better Life.</h2>
            <p className="text-fittree-text-light text-[14.5px] leading-relaxed mb-7 font-medium max-w-md">
              We are committed to delivering wholesome food that's good for you and kind to the planet.
            </p>
            <ul className="space-y-3 mb-8">
              {WHY_CHOOSE.map((item, i) => (
                <li key={i} className="flex items-center gap-2.5 text-[13.5px] font-semibold text-fittree-text">
                  <CheckCircle2 size={17} className="text-fittree-primary shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <Link to="/products" className="inline-flex items-center gap-2 bg-fittree-forest text-white px-6 py-3 rounded-xl font-bold text-[13.5px] hover:bg-fittree-forest-light transition-colors">
              Shop Our Products <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {WHY_CARDS.map((c, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-fittree-border bg-white">
                <div className="relative h-[110px]">
                  <img src={c.img} alt={c.title} className="absolute inset-0 w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur flex items-center justify-center text-fittree-primary shadow-sm"><c.icon size={17} /></span>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-[13.5px] text-fittree-dark mb-1.5">{c.title}</h4>
                  <p className="text-[11.5px] text-fittree-text-light font-medium leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR VALUES */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-16">
        <div className="bg-fittree-sand border border-fittree-border rounded-[2rem] py-8 px-6 sm:px-10">
          <span className="text-fittree-primary font-bold text-[11px] uppercase tracking-[0.18em] mb-6 block">Our Values</span>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {OUR_VALUES.map((v, i) => (
              <div key={i} className="flex items-start gap-3">
                <v.icon size={22} className="text-fittree-forest shrink-0 mt-0.5" />
                <span>
                  <span className="block text-[13.5px] font-bold text-fittree-text">{v.title}</span>
                  <span className="block text-[12px] text-fittree-text-light font-medium leading-relaxed mt-0.5">{v.desc}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-0">
        <div className="bg-fittree-forest rounded-[2rem] px-8 py-10 md:px-14 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <Leaf size={90} className="hidden md:block absolute -left-4 -bottom-4 text-white/5 rotate-[20deg]" />
          <Leaf size={70} className="hidden md:block absolute -right-2 -top-4 text-white/5 -rotate-[15deg]" />
          <div className="relative z-10 text-center md:text-left">
            <span className="text-fittree-accent font-bold text-[11.5px] uppercase tracking-widest mb-2 block">Subscribe &amp; Save</span>
            <h3 className="font-serif text-white text-[24px] md:text-[28px] font-medium mb-2">Get 10% OFF on your first order</h3>
            <p className="text-white/70 text-[13.5px] font-medium">Join 40,000+ subscribers for recipes, offers &amp; more.</p>
          </div>
          <NewsletterForm className="relative z-10 flex w-full md:w-auto max-w-md gap-2.5">
            {({ email, setEmail, loading }) => (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 bg-white/95 rounded-xl px-5 py-3.5 text-[14px] text-fittree-text placeholder-fittree-text-light focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button type="submit" disabled={loading} className="bg-fittree-primary text-white font-bold px-5 py-3.5 rounded-xl flex items-center gap-2 hover:bg-fittree-primary-soft transition-colors shrink-0 disabled:opacity-60">
                  <Send size={15} /> <span className="hidden sm:inline">{loading ? 'Subscribing…' : 'Subscribe'}</span>
                </button>
              </>
            )}
          </NewsletterForm>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
