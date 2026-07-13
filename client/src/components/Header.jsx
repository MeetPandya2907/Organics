import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, ChevronDown, LogOut, LayoutDashboard } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const Header = () => {
  const { cart, userInfo, logout } = useStore();
  const navigate = useNavigate();
  const cartItemCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-1' : 'py-2'}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className={`flex items-center justify-between px-6 transition-all duration-500 rounded-full ${scrolled ? 'h-16 bg-white/90 backdrop-blur-xl shadow-glass border border-white/40' : 'h-16 bg-white/70 backdrop-blur-md shadow-sm border border-white/20'}`}>
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest to-[#0a664e] text-white flex items-center justify-center font-display font-bold text-xl shadow-md"
            >
              O.
            </motion.div>
            <span className="font-display font-bold text-2xl tracking-tight text-forest hidden sm:block">
              Organics
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { name: 'Home', path: '/' },
              { name: 'Shop', path: '/products' },
              { name: 'Our Story', path: '/about' },
              { name: 'Contact', path: '/contact' }
            ].map((item) => (
              <Link 
                key={item.name} 
                to={item.path} 
                className="text-ink hover:text-forest font-semibold text-sm tracking-wide transition-colors relative group py-2"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-turmeric transition-all duration-300 ease-out group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const keyword = formData.get('q');
              if (keyword.trim()) navigate(`/search/${keyword}`);
              else navigate('/products');
            }} className="relative hidden md:block">
              <Search size={16} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" name="q" placeholder="Search..." className="w-32 lg:w-48 h-10 pl-9 pr-4 rounded-full bg-slate-50 border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-forest focus:bg-white transition-all" />
            </form>
            
            <button className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-ink hover:bg-forest/5 hover:text-forest transition-colors">
              <Search size={20} strokeWidth={2} />
            </button>
            
            <div className="relative group">
              <Link to={userInfo ? "/profile" : "/login"} className="h-10 px-3 sm:px-4 rounded-full flex items-center gap-2 hover:bg-forest/5 transition-colors border border-transparent hover:border-forest/10">
                <User size={20} strokeWidth={2} className="text-ink group-hover:text-forest transition-colors" />
                {userInfo && (
                  <>
                    <span className="text-sm font-semibold text-ink group-hover:text-forest hidden sm:block transition-colors">{userInfo.name.split(' ')[0]}</span>
                    <ChevronDown size={14} className="text-slate-400 group-hover:text-forest hidden sm:block transition-colors" />
                  </>
                )}
              </Link>
              
              {userInfo && (
                <div className="absolute right-0 top-full pt-4 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top group-hover:translate-y-0 translate-y-2 z-50">
                  <div className="bg-white/90 backdrop-blur-xl rounded-[1.5rem] shadow-glass border border-white/60 p-2 flex flex-col overflow-hidden">
                    <div className="px-4 py-4 mb-2 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                      <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-1">Signed in as</p>
                      <p className="font-semibold text-ink truncate text-sm">{userInfo.email}</p>
                    </div>
                    {userInfo.isAdmin && (
                      <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-forest/5 text-ink hover:text-forest font-medium transition-colors text-sm">
                        <LayoutDashboard size={18} /> Admin Dashboard
                      </Link>
                    )}
                    <button onClick={async () => { await logout(); navigate('/login'); }} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 font-medium transition-colors text-sm w-full text-left mt-1">
                      <LogOut size={18} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Link to="/cart" className="relative w-10 h-10 rounded-full flex items-center justify-center text-ink hover:bg-forest/5 hover:text-forest transition-colors">
              <ShoppingCart size={20} strokeWidth={2} />
              <AnimatePresence>
                {cartItemCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute top-1 right-1 bg-turmeric text-white text-[10px] font-bold w-[16px] h-[16px] rounded-full flex items-center justify-center shadow-sm transform translate-x-1/4 -translate-y-1/4"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            
            <button className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-ink hover:bg-forest/5 hover:text-forest transition-colors">
              <Menu size={22} strokeWidth={2} />
            </button>
          </div>
          
        </div>
      </div>
    </header>
  );
};

export default Header;
