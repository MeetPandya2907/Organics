import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, Handshake, Sun, ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Meta from '../components/Meta';

const REGIONS = [
  { place: 'Nashik, Maharashtra', crop: 'Turmeric', desc: 'Sun-dried and stone-ground within days of harvest.' },
  { place: 'Idukki, Kerala', crop: 'Cardamom & Pepper', desc: 'Handpicked from a 60-family growers\' collective.' },
  { place: 'Malwa, Madhya Pradesh', crop: 'Masoor & Toor Dal', desc: 'Stone-milled without polish or added wax.' },
  { place: 'Unjha, Gujarat', crop: 'Cumin & Coriander', desc: 'India\'s largest spice mandi, sourced direct.' },
];

const TIMELINE = [
  { year: '2019', title: 'A single sack of turmeric', desc: 'Started by buying direct from three farmers near Nashik who couldn\'t get a fair price at the local mandi.' },
  { year: '2021', title: 'Building the farmer network', desc: 'Grew to 40+ partner farms across four states, each visited and vetted in person before onboarding.' },
  { year: 'Today', title: '40,000+ homes, one pantry', desc: 'FSSAI-licensed, lab-tested batch by batch, and still packed to order rather than to a warehouse shelf.' },
];

const AboutPage = () => {
  return (
    <div className="bg-fittree-bg min-h-screen text-fittree-text font-sans selection:bg-fittree-yellow selection:text-fittree-dark pb-24 pt-[104px] md:pt-[112px]">
      <Meta title="FitTree Organics | Our Sourcing Story" />

      {/* 1. HERO */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-4 pb-16">
        <div className="rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row shadow-fittree-lg relative bg-fittree-dark">
          <div className="lg:w-1/2 p-10 md:p-16 lg:p-20 flex flex-col justify-center relative z-10">
            <div className="absolute top-0 right-0 w-[380px] h-[380px] bg-fittree-orange/10 rounded-full blur-[90px] pointer-events-none"></div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10">
              <div className="flex items-center gap-2.5 mb-7">
                <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/15">
                  <Leaf size={16} className="text-fittree-yellow" />
                </span>
                <span className="text-fittree-yellow font-bold uppercase tracking-widest text-xs">Our Sourcing Story</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-7 leading-[1.1]">
                From one Nashik farm<br />to <span className="italic font-medium text-fittree-orange">40,000 kitchens.</span>
              </h1>
              <p className="text-lg text-white/70 font-medium leading-relaxed max-w-md">
                FitTree Organics started because we couldn't find turmeric that actually smelled like turmeric. So we went and bought it directly from the farmers who grow it.
              </p>
            </motion.div>
          </div>
          <div className="lg:w-1/2 relative min-h-[340px] lg:min-h-[520px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-fittree-dark/80 via-transparent to-transparent z-10 lg:hidden"></div>
            <img
              src="https://fittreeinternational.com/wp-content/uploads/2026/01/imresizer-istockphoto-515677966-170667a.jpg"
              alt="Green cardamom pods, handpicked from Idukki, Kerala"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 2. VALUES */}
      <section className="max-w-[1400px] mx-auto px-6 mb-24">
        <div className="text-center mb-14">
          <span className="eyebrow text-fittree-pink">What we actually do</span>
          <h2 className="mt-2">Not just another "organic" label</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: <MapPin strokeWidth={1.75} />, title: 'Named Sources', desc: 'Every batch is traceable to a district and a growers\' collective — not a vague "Indian farms" label.' },
            { icon: <ShieldCheck strokeWidth={1.75} />, title: 'Lab-Tested', desc: 'Every batch is tested for pesticide residue before it\'s packed. If it fails, it doesn\'t ship.' },
            { icon: <Handshake strokeWidth={1.75} />, title: 'Fair Farmer Pricing', desc: 'We pay above mandi rate and skip the middlemen, so more of what you pay reaches the farm.' },
            { icon: <Sun strokeWidth={1.75} />, title: 'Packed to Order', desc: 'Nothing sits in a warehouse for months. Most orders are packed within a week of harvest or milling.' },
          ].map((val, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2rem] border border-fittree-border shadow-fittree-sm hover:shadow-fittree-lg hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="w-14 h-14 bg-fittree-light text-fittree-primary rounded-2xl flex items-center justify-center mb-7 group-hover:bg-fittree-primary group-hover:text-white transition-colors">
                {val.icon}
              </div>
              <h3 className="text-xl font-display font-bold text-fittree-dark mb-3">{val.title}</h3>
              <p className="text-fittree-text-light font-medium leading-relaxed text-[14.5px]">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SOURCING REGIONS */}
      <section className="bg-fittree-dark py-24 mb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[460px] h-[460px] bg-fittree-primary/20 rounded-full blur-[110px] pointer-events-none translate-x-1/3 -translate-y-1/4"></div>
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="text-center mb-14">
            <span className="eyebrow text-fittree-yellow">Region by region</span>
            <h2 className="text-white mt-2">A supply chain we can actually name</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {REGIONS.map((r, i) => (
              <div key={i} className="bg-white/[0.06] border border-white/10 rounded-[1.75rem] p-7 hover:bg-white/[0.1] transition-colors">
                <div className="w-10 h-10 rounded-full bg-fittree-orange/20 flex items-center justify-center text-fittree-orange mb-6">
                  <MapPin size={18} />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-fittree-yellow block mb-1.5">{r.crop}</span>
                <h3 className="text-white font-display font-bold text-lg mb-3 leading-snug">{r.place}</h3>
                <p className="text-white/60 text-[13.5px] font-medium leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TIMELINE */}
      <section className="max-w-[900px] mx-auto px-6 mb-24">
        <div className="text-center mb-16">
          <span className="eyebrow text-fittree-orange-dark">How we got here</span>
          <h2 className="mt-2">Our journey</h2>
        </div>
        <div className="space-y-10 relative before:absolute before:inset-0 before:ml-6 before:h-full before:w-[2px] before:bg-fittree-border">
          {TIMELINE.map((t, i) => (
            <div key={i} className="relative flex items-start gap-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-fittree-bg bg-fittree-primary text-white font-display font-bold shrink-0 z-10">
                {i + 1}
              </div>
              <div className="flex-1 bg-white p-7 rounded-[1.75rem] border border-fittree-border shadow-fittree-sm">
                <span className="text-xs font-extrabold text-fittree-orange-dark uppercase tracking-widest mb-2 block">{t.year}</span>
                <h3 className="font-display font-bold text-fittree-dark text-xl mb-2.5">{t.title}</h3>
                <p className="text-fittree-text-light font-medium leading-relaxed text-[14.5px]">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. QUOTE BLOCK */}
      <section className="max-w-[1400px] mx-auto px-6 mb-24">
        <div className="bg-white rounded-[2.5rem] p-10 md:p-16 border border-fittree-border shadow-fittree-sm grid lg:grid-cols-2 gap-14 items-center">
          <div className="relative h-[280px] lg:h-[360px] rounded-[2rem] overflow-hidden">
            <img
              src="https://fittreeinternational.com/wp-content/uploads/2026/01/imresizer-bowl-sackcloth-red-raw-lentils-wooden-board.jpg.jpg"
              alt="Masoor dal, stone-milled without polish"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-display font-medium italic text-fittree-dark leading-snug mb-8 border-l-4 border-fittree-orange pl-6">
              "We wanted spices that tasted like the ones our grandmothers used — not the dust that sits in a supermarket jar for a year."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-fittree-primary/10 text-fittree-primary flex items-center justify-center">
                <ShieldCheck size={22} />
              </div>
              <div>
                <p className="font-bold text-fittree-dark">FitTree Organics, Founding Team</p>
                <p className="text-sm font-medium text-fittree-text-light mt-0.5">Mumbai, Maharashtra</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="max-w-[1100px] mx-auto px-6">
        <div className="bg-fittree-dark rounded-[2.5rem] p-14 md:p-20 relative overflow-hidden text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-fittree-orange/10 rounded-full blur-[90px] pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-7 border border-white/15">
              <Leaf className="text-fittree-yellow" size={24} strokeWidth={1.75} />
            </div>
            <h2 className="text-white text-3xl md:text-5xl mb-9 leading-tight max-w-xl">Ready to taste the <span className="italic font-medium text-fittree-orange">difference?</span></h2>
            <Link to="/products" className="btn btn-accent text-base px-9 py-4 inline-flex items-center gap-2.5">
              Shop the pantry <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
