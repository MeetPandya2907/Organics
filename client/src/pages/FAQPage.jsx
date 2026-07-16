import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const FAQPage = () => {
  return (
    <div className="bg-paper min-h-screen pb-24">
      {/* Header */}
      <div className="bg-ink pt-32 pb-40 px-6 text-center shadow-2xl shadow-black/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-forest/20 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-turmeric/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-forest/20 rounded-full blur-[80px] pointer-events-none"></div>
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto relative z-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-md">
              <HelpCircle size={24} className="text-turmeric" />
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-slate-300 font-medium leading-relaxed max-w-lg mx-auto">
            Everything you need to know about our products and services.
          </p>
        </motion.div>
      </div>

      <div className="max-w-[800px] mx-auto px-6 -mt-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
          <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-glass border border-slate-100 hover:shadow-lg transition-shadow group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-forest/5 rounded-full blur-[40px] pointer-events-none"></div>
            <h3 className="text-2xl font-display font-bold text-ink mb-4 group-hover:text-forest transition-colors">Are your products truly 100% organic?</h3>
            <p className="text-slate-500 font-medium leading-relaxed text-lg">Yes. We source exclusively from farms that utilize regenerative agriculture and strictly avoid synthetic pesticides and fertilizers. Every batch is rigorously lab-tested before packaging.</p>
          </div>
          
          <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-glass border border-slate-100 hover:shadow-lg transition-shadow group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-turmeric/5 rounded-full blur-[40px] pointer-events-none"></div>
            <h3 className="text-2xl font-display font-bold text-ink mb-4 group-hover:text-forest transition-colors">How long does shipping take?</h3>
            <p className="text-slate-500 font-medium leading-relaxed text-lg">Orders are processed within 24 hours. Standard shipping takes 3-5 business days depending on your location. You will receive a tracking number once your order ships.</p>
          </div>
          
          <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-glass border border-slate-100 hover:shadow-lg transition-shadow group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-forest/5 rounded-full blur-[40px] pointer-events-none"></div>
            <h3 className="text-2xl font-display font-bold text-ink mb-4 group-hover:text-forest transition-colors">Do you accept returns?</h3>
            <p className="text-slate-500 font-medium leading-relaxed text-lg">Due to the perishable nature of food items, we cannot accept returns on opened products. However, if you are unsatisfied with the quality or receive a damaged item, please contact our support within 7 days for a full refund or replacement.</p>
          </div>
          
          <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-glass border border-slate-100 hover:shadow-lg transition-shadow group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-turmeric/5 rounded-full blur-[40px] pointer-events-none"></div>
            <h3 className="text-2xl font-display font-bold text-ink mb-4 group-hover:text-forest transition-colors">Is your packaging eco-friendly?</h3>
            <p className="text-slate-500 font-medium leading-relaxed text-lg">We use biodegradable and recyclable materials for all our primary packaging to minimize our environmental footprint.</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center mt-20">
          <p className="text-slate-500 font-bold mb-6 uppercase tracking-widest text-sm">Still have questions?</p>
          <Link to="/contact" className="btn btn-primary inline-flex shadow-lg shadow-forest/20 px-10 py-4 text-lg">
             Contact Support
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;
