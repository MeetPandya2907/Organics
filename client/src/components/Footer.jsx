import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ShieldCheck, Truck, Leaf, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-fittree-dark text-white pt-6 mt-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-fittree-primary/20 rounded-full blur-[110px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[420px] h-[300px] bg-fittree-orange/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/4"></div>

      {/* Trust strip */}
      <div className="max-w-[1400px] mx-auto px-6 py-8 border-b border-white/10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-fittree-yellow shrink-0"><ShieldCheck size={22} /></div>
            <div><h4 className="font-bold text-sm">FSSAI Licensed</h4><p className="text-xs text-white/60">Lab-tested, zero residue</p></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-fittree-orange shrink-0"><Truck size={22} /></div>
            <div><h4 className="font-bold text-sm">Pan-India Delivery</h4><p className="text-xs text-white/60">COD available everywhere</p></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-fittree-primary shrink-0"><Leaf size={22} /></div>
            <div><h4 className="font-bold text-sm">Direct From Farms</h4><p className="text-xs text-white/60">No middlemen, fair prices</p></div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pt-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-14">

          {/* Brand Info */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fittree-primary to-fittree-orange flex items-center justify-center text-white font-display font-extrabold text-lg border border-white/20 shadow-fittree-sm">
                F
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-extrabold text-2xl text-white leading-none">FitTree</span>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-fittree-yellow leading-none mt-1">Organics</span>
              </div>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Whole spices, pulses and seeds sourced directly from Indian farms and packed to order. Real ingredients, real flavor, no shortcuts.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-fittree-orange transition-colors">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-fittree-orange transition-colors">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-fittree-orange transition-colors">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-fittree-yellow mb-5">Shop</h4>
            <ul className="flex flex-col gap-3 text-white/70 text-sm font-medium">
              <li><Link to="/products?category=SPICES" className="hover:text-white transition-colors">Whole Spices</Link></li>
              <li><Link to="/products?category=PULSES" className="hover:text-white transition-colors">Pulses & Dals</Link></li>
              <li><Link to="/products?category=SEEDS" className="hover:text-white transition-colors">Seeds & Superfoods</Link></li>
              <li><Link to="/products?category=DEHYDRATED PRODUCTS" className="hover:text-white transition-colors">Dehydrated Range</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Shop All</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-fittree-yellow mb-5">Company</h4>
            <ul className="flex flex-col gap-3 text-white/70 text-sm font-medium">
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact / Newsletter */}
          <div>
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-fittree-yellow mb-5">Get In Touch</h4>
            <ul className="flex flex-col gap-3 text-white/70 text-sm font-medium mb-6">
              <li className="flex items-center gap-3"><Phone size={15} className="text-fittree-primary shrink-0" /> +91 98765 43210</li>
              <li className="flex items-center gap-3"><Mail size={15} className="text-fittree-primary shrink-0" /> hello@fittreeorganics.com</li>
              <li className="flex items-start gap-3"><MapPin size={15} className="text-fittree-primary shrink-0 mt-0.5" /> Mumbai, Maharashtra, India</li>
            </ul>
            <form className="relative flex items-center" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="w-full bg-white/10 border border-white/20 rounded-full py-3.5 pl-5 pr-14 text-sm text-white placeholder-white/50 focus:outline-none focus:border-fittree-orange transition-colors"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-1.5 w-9 h-9 bg-fittree-orange text-white rounded-full flex items-center justify-center hover:bg-white hover:text-fittree-dark transition-colors"
              >
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>&copy; {new Date().getFullYear()} FitTree Organics. FSSAI Lic. No. 1234********. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
