import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ShieldCheck, Truck, Leaf } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white pt-10 mt-20 relative overflow-hidden border-t border-fittree-border">
      {/* Trust strip */}
      <div className="max-w-[1400px] mx-auto px-6 py-10 border-b border-fittree-border relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
          <div className="flex items-center gap-5 justify-center md:justify-start">
            <div className="w-14 h-14 rounded-2xl bg-fittree-sand flex items-center justify-center text-fittree-primary shrink-0 shadow-sm border border-fittree-border"><ShieldCheck size={24} /></div>
            <div><h4 className="font-bold text-fittree-text text-[15px] mb-0.5">FSSAI Certified</h4><p className="text-[13px] text-fittree-text-light font-medium">Lab-tested, zero residue</p></div>
          </div>
          <div className="flex items-center gap-5 justify-center md:justify-start">
            <div className="w-14 h-14 rounded-2xl bg-fittree-sand flex items-center justify-center text-fittree-primary shrink-0 shadow-sm border border-fittree-border"><Truck size={24} /></div>
            <div><h4 className="font-bold text-fittree-text text-[15px] mb-0.5">10-Minute Delivery</h4><p className="text-[13px] text-fittree-text-light font-medium">Superfast doorstep delivery</p></div>
          </div>
          <div className="flex items-center gap-5 justify-center md:justify-start">
            <div className="w-14 h-14 rounded-2xl bg-fittree-sand flex items-center justify-center text-fittree-primary shrink-0 shadow-sm border border-fittree-border"><Leaf size={24} /></div>
            <div><h4 className="font-bold text-fittree-text text-[15px] mb-0.5">100% Organic</h4><p className="text-[13px] text-fittree-text-light font-medium">Directly from farmers</p></div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Brand Info */}
          <div className="pr-4">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-fittree-primary text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Leaf size={22} fill="currentColor" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-bold text-[22px] text-fittree-text leading-none">FitTree</span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-fittree-primary uppercase mt-1">Organics</span>
              </div>
            </Link>
            <p className="text-fittree-text-light text-[14px] leading-relaxed mb-8 font-medium">
              Your one-stop destination for fresh, organic, and lab-tested grocery essentials delivered straight to your door.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Instagram" className="w-11 h-11 rounded-xl bg-fittree-sand border border-fittree-border flex items-center justify-center text-fittree-text hover:bg-fittree-primary hover:border-fittree-primary hover:text-white transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" aria-label="Facebook" className="w-11 h-11 rounded-xl bg-fittree-sand border border-fittree-border flex items-center justify-center text-fittree-text hover:bg-fittree-primary hover:border-fittree-primary hover:text-white transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" aria-label="WhatsApp" className="w-11 h-11 rounded-xl bg-fittree-sand border border-fittree-border flex items-center justify-center text-fittree-text hover:bg-fittree-primary hover:border-fittree-primary hover:text-white transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[15px] font-bold text-fittree-text mb-6">Categories</h4>
            <ul className="flex flex-col gap-4 text-fittree-text-light text-[14px] font-medium">
              <li><Link to="/products?category=SPICES" className="hover:text-fittree-primary transition-colors">Premium Spices</Link></li>
              <li><Link to="/products?category=PULSES" className="hover:text-fittree-primary transition-colors">Organic Pulses</Link></li>
              <li><Link to="/products?category=SEEDS" className="hover:text-fittree-primary transition-colors">Super Seeds</Link></li>
              <li><Link to="/products" className="hover:text-fittree-primary transition-colors">Shop All</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[15px] font-bold text-fittree-text mb-6">Discover</h4>
            <ul className="flex flex-col gap-4 text-fittree-text-light text-[14px] font-medium">
              <li><Link to="/about" className="hover:text-fittree-primary transition-colors">About Us</Link></li>
              <li><Link to="/faq" className="hover:text-fittree-primary transition-colors">Help & FAQ</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-fittree-primary transition-colors">Shipping Details</Link></li>
              <li><Link to="/refund" className="hover:text-fittree-primary transition-colors">Returns Policy</Link></li>
            </ul>
          </div>

          {/* Contact / Newsletter */}
          <div>
            <h4 className="text-[15px] font-bold text-fittree-text mb-6">Contact Us</h4>
            <ul className="flex flex-col gap-4 text-fittree-text-light text-[14px] font-medium mb-8">
              <li className="flex items-center gap-3"><Phone size={16} className="text-fittree-primary shrink-0" /> +91 98765 43210</li>
              <li className="flex items-center gap-3"><Mail size={16} className="text-fittree-primary shrink-0" /> hello@fittreeorganics.com</li>
              <li className="flex items-start gap-3"><MapPin size={16} className="text-fittree-primary shrink-0 mt-0.5" /> Mumbai, Maharashtra, India</li>
            </ul>
            <form className="relative flex items-center" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-fittree-sand border border-fittree-border rounded-xl py-4 pl-5 pr-14 text-[14px] text-fittree-text placeholder-fittree-text-light focus:outline-none focus:border-fittree-primary transition-colors"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-1.5 w-10 h-10 bg-fittree-primary text-white rounded-lg flex items-center justify-center hover:bg-fittree-primary-soft transition-colors shadow-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-fittree-border bg-fittree-sand">
        <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-fittree-text-light font-medium text-center md:text-left">
            © {new Date().getFullYear()} FitTree Organics. FSSAI Lic. No. 1234********. All rights reserved.
          </p>
          <div className="flex gap-6 text-[13px] font-medium text-fittree-text-light">
            <Link to="/privacy" className="hover:text-fittree-primary transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-fittree-primary transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
