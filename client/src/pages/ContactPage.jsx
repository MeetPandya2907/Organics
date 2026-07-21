import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Send, Sparkles } from 'lucide-react';
import Meta from '../components/Meta';

const ContactPage = () => {
  return (
    <div className="bg-white min-h-screen pb-24">
      <Meta title="FitTree Organics | Contact Us" />
      {/* Header */}
      <div className="bg-fittree-primary pt-32 pb-48 px-6 text-center shadow-2xl shadow-black/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px] pointer-events-none"></div>
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto relative z-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-md">
              <Sparkles size={18} className="text-white" />
            </span>
            <span className="text-white/80 font-bold uppercase tracking-widest text-xs">Get In Touch</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">Let's Connect</h1>
          <p className="text-xl text-white/70 font-medium leading-relaxed max-w-lg mx-auto">
            Questions about an order, a product, or where your spices come from? We'd love to hear from you.
          </p>
        </motion.div>
      </div>
      
      <div className="max-w-[1200px] mx-auto px-6 -mt-32 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Contact Info Cards */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-[2rem] shadow-glass border border-slate-100 flex items-start gap-6 group hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-[1.25rem] flex items-center justify-center text-forest shrink-0 group-hover:bg-forest group-hover:text-white transition-colors">
                <MapPin size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-ink mb-2">Our Office</h3>
                <p className="text-slate-500 font-medium leading-relaxed">Mumbai,<br/>Maharashtra, India</p>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-[2rem] shadow-glass border border-slate-100 flex items-start gap-6 group hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-[1.25rem] flex items-center justify-center text-turmeric shrink-0 group-hover:bg-turmeric group-hover:text-ink transition-colors">
                <Mail size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-ink mb-2">Email Us</h3>
                <p className="text-slate-500 font-medium leading-relaxed">hello@fittreeorganics.com<br/>support@fittreeorganics.com</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white p-8 rounded-[2rem] shadow-glass border border-slate-100 flex items-start gap-6 group hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-[1.25rem] flex items-center justify-center text-leaf shrink-0 group-hover:bg-leaf group-hover:text-white transition-colors">
                <Phone size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-ink mb-2">Call Us</h3>
                <p className="text-slate-500 font-medium leading-relaxed">+91 98765 43210<br/>Mon - Fri, 9am - 6pm</p>
              </div>
            </motion.div>
          </div>
          
          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full lg:w-2/3">
            <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-glass border border-slate-100 h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-turmeric/5 rounded-full blur-[40px] pointer-events-none"></div>
              <h2 className="text-3xl font-display font-bold text-ink mb-8 relative z-10">Send a Message</h2>
              
              <form className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Full Name</label>
                    <input type="text" className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-forest focus:border-forest transition-colors outline-none text-ink font-medium placeholder-slate-400" placeholder="John Doe" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Email Address</label>
                    <input type="email" className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-forest focus:border-forest transition-colors outline-none text-ink font-medium placeholder-slate-400" placeholder="john@example.com" required />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Subject</label>
                  <input type="text" className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-forest focus:border-forest transition-colors outline-none text-ink font-medium placeholder-slate-400" placeholder="How can we help?" required />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Message</label>
                  <textarea className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-forest focus:border-forest transition-colors outline-none text-ink font-medium placeholder-slate-400 resize-y" rows="5" placeholder="Write your message here..." required></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary w-full md:w-auto px-12 py-4 text-lg mt-4 flex items-center justify-center gap-3 shadow-lg shadow-forest/20">
                  <Send size={20} /> Send Message
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
