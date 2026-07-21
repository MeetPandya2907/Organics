import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, Handshake, Sun, ArrowRight, MapPin, Users, Sprout, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Meta from '../components/Meta';

const STATS = [
  { num: '40,000+', label: 'Homes Served' },
  { num: '40+', label: 'Partner Farms' },
  { num: '4', label: 'Sourcing States' },
  { num: '100%', label: 'Batches Lab-Tested' },
];

const REGIONS = [
  { place: 'Nashik, Maharashtra', crop: 'Turmeric', desc: 'Sun-dried and stone-ground within days of harvest.', img: 'https://fittreeinternational.com/wp-content/uploads/2026/01/imresizer-turmeric-2344157-scaled-1-1.jpg' },
  { place: 'Idukki, Kerala', crop: 'Cardamom & Pepper', desc: 'Handpicked from a 60-family growers\' collective.', img: 'https://fittreeinternational.com/wp-content/uploads/2026/01/imresizer-istockphoto-515677966-170667a.jpg' },
  { place: 'Malwa, Madhya Pradesh', crop: 'Masoor & Toor Dal', desc: 'Stone-milled without polish or added wax.', img: 'https://fittreeinternational.com/wp-content/uploads/2026/01/imresizer-bowl-sackcloth-red-raw-lentils-wooden-board.jpg.jpg' },
  { place: 'Unjha, Gujarat', crop: 'Cumin & Coriander', desc: 'India\'s largest spice mandi, sourced direct.', img: 'https://fittreeinternational.com/wp-content/uploads/2026/01/coriander1_imresizer.jpg' },
];

const TIMELINE = [
  { year: '2019', title: 'A single sack of turmeric', desc: 'Started by buying direct from three farmers near Nashik who couldn\'t get a fair price at the local mandi.' },
  { year: '2021', title: 'Building the farmer network', desc: 'Grew to 40+ partner farms across four states, each visited and vetted in person before onboarding.' },
  { year: '2023', title: 'Our own testing lab', desc: 'Brought pesticide-residue testing in-house so every single batch is checked before it ships — not sampled occasionally.' },
  { year: 'Today', title: '40,000+ homes, one pantry', desc: 'FSSAI-licensed, lab-tested batch by batch, and still packed to order rather than to a warehouse shelf.' },
];

const VALUES = [
  { icon: <MapPin strokeWidth={1.75} />, title: 'Named Sources', desc: 'Every batch is traceable to a district and a growers\' collective — not a vague "Indian farms" label.' },
  { icon: <ShieldCheck strokeWidth={1.75} />, title: 'Lab-Tested', desc: 'Every batch is tested for pesticide residue before it\'s packed. If it fails, it doesn\'t ship.' },
  { icon: <Handshake strokeWidth={1.75} />, title: 'Fair Farmer Pricing', desc: 'We pay above mandi rate and skip the middlemen, so more of what you pay reaches the farm.' },
  { icon: <Sun strokeWidth={1.75} />, title: 'Packed to Order', desc: 'Nothing sits in a warehouse for months. Most orders are packed within a week of harvest or milling.' },
];

const AboutPage = () => {
  return (
    <div className="bg-fittree-bg min-h-screen text-fittree-text font-sans pb-24 pt-[130px]">
      <Meta title="FitTree Organics | Our Story & Sourcing" description="Learn how FitTree Organics sources whole spices, pulses and seeds directly from named farms across India." />

      {/* HERO */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-6">
        <div className="relative w-full min-h-[420px] md:min-h-[520px] rounded-[2rem] overflow-hidden shadow-fittree-md">
          <img
            src="/hero_banner_farm.png"
            alt="A farmer holding freshly harvested lentils in a field near Nashik"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent"></div>

          <div className="relative z-10 h-full flex flex-col justify-center px-8 sm:px-12 md:px-16 py-14 max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="pill-tag bg-white/15 backdrop-blur-sm border border-white/25 text-white w-fit mb-6"
            >
              <Leaf size={12} /> Our Sourcing Story
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}
              className="text-white text-4xl sm:text-5xl lg:text-[3.2rem] font-extrabold leading-[1.1] mb-6 drop-shadow-md"
            >
              From one Nashik farm<br />to 40,000 kitchens.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.16 }}
              className="text-white/85 text-[15px] sm:text-[17px] leading-relaxed max-w-lg font-medium"
            >
              FitTree Organics started because we couldn't find turmeric that actually smelled like turmeric. So we went and bought it directly from the farmers who grow it.
            </motion.p>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-24">
        <div className="bg-white rounded-2xl border border-fittree-border shadow-sm grid grid-cols-2 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={i} className={`text-center py-7 px-4 ${i < STATS.length - 1 ? 'border-r border-fittree-border' : ''} ${i === 2 ? 'border-r-0 md:border-r' : ''}`}>
              <b className="block font-display text-2xl md:text-3xl font-extrabold text-fittree-primary leading-none mb-1.5">{s.num}</b>
              <span className="text-[11.5px] font-bold uppercase tracking-wider text-fittree-text-light">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-24">
        <div className="text-center mb-12">
          <span className="eyebrow">What we actually do</span>
          <h2 className="mt-2 text-[28px] md:text-[36px] font-extrabold text-fittree-text">Not just another "organic" label</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map((val, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }}
              className="bg-white p-7 rounded-2xl border border-fittree-border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-fittree-primary/10 text-fittree-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-fittree-primary group-hover:text-white transition-colors">
                {val.icon}
              </div>
              <h3 className="text-[17px] font-display font-bold text-fittree-text mb-2.5">{val.title}</h3>
              <p className="text-fittree-text-light font-medium leading-relaxed text-[13.5px]">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SOURCING REGIONS */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-24">
        <div className="text-center mb-12">
          <span className="eyebrow">Region by region</span>
          <h2 className="mt-2 text-[28px] md:text-[36px] font-extrabold text-fittree-text">A supply chain we can actually name</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {REGIONS.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl border border-fittree-border shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all group"
            >
              <div className="h-[130px] overflow-hidden">
                <img src={r.img} alt={r.crop} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <div className="w-9 h-9 rounded-full bg-fittree-accent-light text-fittree-accent-dark flex items-center justify-center mb-4">
                  <MapPin size={16} />
                </div>
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-fittree-accent-dark block mb-1.5">{r.crop}</span>
                <h3 className="font-display font-bold text-fittree-text text-[16px] mb-2.5 leading-snug">{r.place}</h3>
                <p className="text-fittree-text-light text-[13px] font-medium leading-relaxed">{r.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="max-w-[900px] mx-auto px-4 sm:px-6 mb-24">
        <div className="text-center mb-14">
          <span className="eyebrow">How we got here</span>
          <h2 className="mt-2 text-[28px] md:text-[36px] font-extrabold text-fittree-text">Our journey</h2>
        </div>
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:h-full before:w-[2px] before:bg-fittree-border">
          {TIMELINE.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="relative flex items-start gap-6"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-fittree-bg bg-fittree-primary text-white font-display font-bold shrink-0 z-10">
                {i + 1}
              </div>
              <div className="flex-1 bg-white p-6 rounded-2xl border border-fittree-border shadow-sm">
                <span className="text-xs font-extrabold text-fittree-accent-dark uppercase tracking-widest mb-2 block">{t.year}</span>
                <h3 className="font-display font-bold text-fittree-text text-[17px] mb-2">{t.title}</h3>
                <p className="text-fittree-text-light font-medium leading-relaxed text-[13.5px]">{t.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* QUOTE BLOCK */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-24">
        <div className="bg-white rounded-[2rem] p-8 md:p-14 border border-fittree-border shadow-sm grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-[260px] lg:h-[360px] rounded-2xl overflow-hidden">
            <img
              src="https://fittreeinternational.com/wp-content/uploads/2026/01/imresizer-bowl-sackcloth-red-raw-lentils-wooden-board.jpg.jpg"
              alt="Masoor dal, stone-milled without polish"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex gap-0.5 text-fittree-accent mb-5">{[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" stroke="none" />)}</div>
            <p className="text-xl md:text-2xl font-display font-medium italic text-fittree-text leading-snug mb-7 border-l-4 border-fittree-primary pl-6">
              "We wanted spices that tasted like the ones our grandmothers used — not the dust that sits in a supermarket jar for a year."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-fittree-primary/10 text-fittree-primary flex items-center justify-center">
                <Users size={20} />
              </div>
              <div>
                <p className="font-bold text-fittree-text text-[14.5px]">FitTree Organics, Founding Team</p>
                <p className="text-[12.5px] font-medium text-fittree-text-light mt-0.5">Mumbai, Maharashtra</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROMISE STRIP */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-24">
        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-fittree-primary/5 border border-fittree-primary/15 rounded-2xl p-7">
            <Sprout className="text-fittree-primary mb-4" size={26} strokeWidth={1.75} />
            <h4 className="font-display font-bold text-fittree-text text-[16px] mb-2">Grown, Not Manufactured</h4>
            <p className="text-fittree-text-light text-[13.5px] font-medium leading-relaxed">No fillers, no anti-caking agents, no "natural flavour" shortcuts. Just the crop, cleaned and packed.</p>
          </div>
          <div className="bg-fittree-accent-light/50 border border-fittree-accent/20 rounded-2xl p-7">
            <ShieldCheck className="text-fittree-accent-dark mb-4" size={26} strokeWidth={1.75} />
            <h4 className="font-display font-bold text-fittree-text text-[16px] mb-2">Every Report, On Request</h4>
            <p className="text-fittree-text-light text-[13.5px] font-medium leading-relaxed">Ask for the lab report on any batch and we'll send it. Nothing about our testing is confidential.</p>
          </div>
          <div className="bg-fittree-primary/5 border border-fittree-primary/15 rounded-2xl p-7">
            <Handshake className="text-fittree-primary mb-4" size={26} strokeWidth={1.75} />
            <h4 className="font-display font-bold text-fittree-text text-[16px] mb-2">Not Happy? Full Refund</h4>
            <p className="text-fittree-text-light text-[13.5px] font-medium leading-relaxed">If a batch doesn't meet your expectations, tell us — we'll refund it, no questions asked.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <div className="bg-fittree-primary rounded-[2rem] p-12 md:p-16 relative overflow-hidden text-center">
          <div className="absolute -top-16 -right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 bg-white/15 rounded-full flex items-center justify-center mb-6">
              <Leaf className="text-white" size={24} strokeWidth={1.75} />
            </div>
            <h2 className="text-white text-3xl md:text-4xl font-extrabold mb-8 leading-tight max-w-xl">Ready to taste the difference?</h2>
            <Link to="/products" className="bg-white text-fittree-primary px-9 py-4 rounded-xl font-bold hover:scale-[1.03] transition-transform flex items-center gap-2.5 shadow-lg">
              Shop the Pantry <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
