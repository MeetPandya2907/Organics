import { Link } from 'react-router-dom';
import { Leaf, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-ink text-slate-300 pt-10 pb-6 border-t-4 border-turmeric relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-forest/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[300px] bg-turmeric/10 rounded-full blur-[80px] pointer-events-none translate-y-1/2 -translate-x-1/4"></div>
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-8 relative z-10">
        
        {/* Brand Column */}
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-turmeric to-turmeric-dark text-white flex items-center justify-center font-display font-bold text-xl shadow-glow">
              O.
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-white">
              Organics
            </span>
          </div>
          <p className="font-light text-slate-400 leading-snug mb-4 text-xs">
            Elevating your wellness journey with nature's purest elements. Ethically sourced, sustainably grown, and delivered with care.
          </p>
          <div className="flex gap-2">
            <a href="#" className="w-8 h-8 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center text-white hover:bg-turmeric hover:border-turmeric transition-all duration-300 group">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center text-white hover:bg-turmeric hover:border-turmeric transition-all duration-300 group">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center text-white hover:bg-turmeric hover:border-turmeric transition-all duration-300 group">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="lg:col-span-2 lg:col-start-6">
          <h3 className="font-bold text-white mb-3 uppercase tracking-[0.2em] text-[11px] font-sans">Navigation</h3>
          <ul className="space-y-1.5">
            <li><Link to="/about" className="hover:text-turmeric transition-colors inline-block hover:translate-x-1 transform duration-300 font-medium text-xs">Our Story</Link></li>
            <li><Link to="/products" className="hover:text-turmeric transition-colors inline-block hover:translate-x-1 transform duration-300 font-medium text-xs">The Harvest</Link></li>
            <li><Link to="/faq" className="hover:text-turmeric transition-colors inline-block hover:translate-x-1 transform duration-300 font-medium text-xs">FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-turmeric transition-colors inline-block hover:translate-x-1 transform duration-300 font-medium text-xs">Contact</Link></li>
          </ul>
        </div>
        
        <div className="lg:col-span-2">
          <h3 className="font-bold text-white mb-3 uppercase tracking-[0.2em] text-[11px] font-sans">Legal</h3>
          <ul className="space-y-1.5">
            <li><Link to="/terms" className="hover:text-turmeric transition-colors inline-block hover:translate-x-1 transform duration-300 font-medium text-xs">Terms of Use</Link></li>
            <li><Link to="/privacy" className="hover:text-turmeric transition-colors inline-block hover:translate-x-1 transform duration-300 font-medium text-xs">Privacy Policy</Link></li>
            <li><Link to="/shipping" className="hover:text-turmeric transition-colors inline-block hover:translate-x-1 transform duration-300 font-medium text-xs">Shipping Policy</Link></li>
          </ul>
        </div>

        {/* Trust & Newsletter */}
        <div className="lg:col-span-4">
          <h4 className="font-display text-lg text-white mb-2 tracking-wide">Join the Inner Circle</h4>
          <p className="font-light mb-4 text-slate-400 text-xs">Subscribe for early access to fresh harvests and offers.</p>
          <form className="flex mb-4 bg-slate-800/40 p-1 rounded-full border border-slate-700/50 backdrop-blur-md focus-within:border-turmeric/50 focus-within:ring-2 focus-within:ring-turmeric/20 transition-all duration-300">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="bg-transparent py-1.5 px-3 text-white placeholder:text-slate-500 focus:outline-none flex-1 font-medium w-full text-xs"
            />
            <button type="submit" className="bg-turmeric text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-turmeric-light hover:scale-105 transition-all duration-300 shrink-0 shadow-lg">
              <ArrowRight size={14} />
            </button>
          </form>
          
          {/* Trust Badges */}
          <div className="flex gap-2 items-center mt-auto">
            <div className="w-10 h-10 border border-slate-700 bg-slate-800/30 rounded-lg flex flex-col items-center justify-center text-[7px] uppercase tracking-widest text-center leading-tight hover:border-leaf hover:text-leaf transition-colors text-slate-400 font-bold"><Leaf size={12} className="mb-0.5"/>100%</div>
            <div className="w-10 h-10 border border-slate-700 bg-slate-800/30 rounded-lg flex items-center justify-center text-[7px] uppercase tracking-widest text-center leading-tight hover:border-turmeric hover:text-turmeric transition-colors text-slate-400 font-bold px-1">Farm<br/>Direct</div>
            <div className="w-10 h-10 border border-slate-700 bg-slate-800/30 rounded-lg flex items-center justify-center text-[8px] uppercase tracking-widest text-center leading-tight hover:border-blue-400 hover:text-blue-400 transition-colors text-slate-400 font-bold">Lab<br/>Tested</div>
          </div>
        </div>

      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-4 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] font-medium text-slate-500 tracking-wide">
        <p>&copy; {new Date().getFullYear()} Organics. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
