import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ShoppingCart, User, LogOut, Package, Menu, X, Sparkles } from 'lucide-react';
import SearchBox from './SearchBox';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Spices', path: '/products?category=SPICES' },
  { name: 'Pulses', path: '/products?category=PULSES' },
  { name: 'Seeds', path: '/products?category=SEEDS' },
  { name: 'Shop All', path: '/products' },
  { name: 'Our Story', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const Header = () => {
  const { userInfo, logout, cart } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const cartItemsCount = cart.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoutHandler = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <div className="fixed w-full top-0 z-50">
      {/* Festive marquee strip */}
      <div className="bg-fittree-dark text-white overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee py-2">
          {Array(2).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-10 px-5 text-[12.5px] font-bold tracking-wide">
              <span className="flex items-center gap-2"><Sparkles size={13} className="text-fittree-yellow" /> Flat 10% off on prepaid orders</span>
              <span className="flex items-center gap-2 text-fittree-yellow">•</span>
              <span>Cash on Delivery available across India</span>
              <span className="flex items-center gap-2 text-fittree-yellow">•</span>
              <span>Free shipping over ₹799</span>
              <span className="flex items-center gap-2 text-fittree-yellow">•</span>
              <span>FSSAI Licensed &amp; lab-tested</span>
              <span className="flex items-center gap-2 text-fittree-yellow">•</span>
            </div>
          ))}
        </div>
      </div>

      <header className={`w-full transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-fittree-md py-3' : 'bg-white/70 backdrop-blur-md py-4'} border-b border-white/50`}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 z-50 shrink-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-fittree-primary to-[#253f25] flex items-center justify-center text-white font-display font-extrabold text-xl shadow-fittree-sm">
                F
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-extrabold text-2xl text-fittree-dark leading-none">FitTree</span>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-fittree-orange leading-none mt-1">Organics</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-7 font-bold text-[14.5px] text-fittree-text">
              {NAV_LINKS.map((link) => (
                <Link key={link.name} to={link.path} className="relative hover:text-fittree-primary transition-colors py-1 group">
                  {link.name}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[3px] rounded-full bg-fittree-orange transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-3">
              <div className="w-56">
                <SearchBox />
              </div>

              <Link to="/cart" className="relative p-2.5 text-fittree-text hover:text-fittree-primary transition-colors bg-white rounded-full shadow-sm hover:shadow-fittree-sm border border-fittree-border">
                <ShoppingCart size={19} strokeWidth={2.2} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-fittree-orange text-white text-[10px] font-extrabold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {userInfo ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 p-1.5 pl-2 pr-4 rounded-full bg-white border border-fittree-border shadow-sm hover:border-fittree-primary hover:shadow-fittree-sm transition-all text-sm font-bold">
                    <div className="w-7 h-7 rounded-full bg-fittree-primary text-white flex items-center justify-center text-xs font-extrabold">
                      {userInfo.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-fittree-dark">{userInfo.name.split(' ')[0]}</span>
                  </button>

                  <div className="absolute right-0 mt-2 w-52 bg-white/95 backdrop-blur-md rounded-2xl shadow-fittree-xl border border-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 z-50 overflow-hidden">
                    <div className="p-2">
                      <div className="px-4 py-2 border-b border-fittree-border mb-2">
                        <p className="text-xs text-fittree-text-light font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-fittree-dark truncate">{userInfo.email}</p>
                      </div>
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-fittree-text hover:bg-fittree-light hover:text-fittree-primary rounded-xl transition-colors">
                        <User size={16} /> Profile
                      </Link>
                      {userInfo.isAdmin && (
                        <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-fittree-text hover:bg-fittree-light hover:text-fittree-primary rounded-xl transition-colors">
                          <Package size={16} /> Dashboard
                        </Link>
                      )}
                      <button
                        onClick={logoutHandler}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-fittree-pink hover:bg-fittree-pink/10 rounded-xl transition-colors mt-1"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="btn btn-primary py-2.5 px-6 text-[13.5px]">
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
              <button
              className="lg:hidden p-2.5 text-fittree-text z-50 bg-white rounded-full shadow-sm border border-fittree-border hover:shadow-fittree-sm transition-all"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-[52px] bg-white z-40 lg:hidden pt-8 px-6 overflow-y-auto"
          >
            <div className="flex flex-col gap-6">
              <SearchBox />

              <nav className="flex flex-col gap-1 text-2xl font-display font-bold text-fittree-dark">
                {NAV_LINKS.map((link) => (
                  <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="py-2 border-b border-fittree-border">
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-col gap-4 mt-2">
                <Link to="/cart" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-lg font-bold text-fittree-text">
                  <div className="relative">
                    <ShoppingCart size={24} />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-fittree-orange text-white text-xs font-extrabold h-5 w-5 rounded-full flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </div>
                  Cart
                </Link>

                {userInfo ? (
                  <>
                    <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-lg font-bold text-fittree-text">
                      <User size={24} /> Profile
                    </Link>
                    {userInfo.isAdmin && (
                      <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-lg font-bold text-fittree-text">
                        <Package size={24} /> Dashboard
                      </Link>
                    )}
                    <button onClick={logoutHandler} className="flex items-center gap-4 text-lg font-bold text-fittree-pink">
                      <LogOut size={24} /> Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="btn btn-primary justify-center text-lg py-3.5">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
