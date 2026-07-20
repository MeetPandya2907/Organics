import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ShoppingCart, User, LogOut, Package, Menu, X, Leaf, Search } from 'lucide-react';
import SearchBox from './SearchBox';

const NAV_LINKS = [
  { name: 'Categories', path: '/products' },
  { name: 'Spices', path: '/products?category=SPICES' },
  { name: 'Pulses', path: '/products?category=PULSES' },
  { name: 'Seeds', path: '/products?category=SEEDS' },
  { name: 'Offers', path: '/offers' },
];

const Header = () => {
  const { userInfo, logout, cart } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const cartItemsCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const logoutHandler = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <div className="fixed w-full top-0 z-50 bg-white border-b border-fittree-border shadow-sm">
      {/* Top promotional bar */}
      <div className="bg-fittree-primary text-white text-center py-1.5 text-[12px] font-medium tracking-wide">
        ⚡ Superfast Delivery in 10 Minutes! <span className="font-bold underline cursor-pointer ml-1">Order Now</span>
      </div>

      <header className="w-full">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-6 py-4">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0 group">
              <div className="w-10 h-10 rounded-xl bg-fittree-primary text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Leaf size={22} fill="currentColor" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-bold text-[22px] text-fittree-text leading-none">FitTree</span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-fittree-primary uppercase mt-1">Organics</span>
              </div>
            </Link>

            {/* Desktop Search Bar (Centralized like D2C) */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <SearchBox />
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-6">
              <nav className="flex items-center gap-5 text-[14px] font-semibold text-fittree-text">
                {NAV_LINKS.map(link => (
                  <Link key={link.name} to={link.path} className="hover:text-fittree-primary transition-colors">
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="w-px h-6 bg-fittree-border"></div>

              {userInfo ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 font-semibold text-[14px] text-fittree-text hover:text-fittree-primary transition-colors">
                    <div className="w-8 h-8 rounded-full bg-fittree-light text-fittree-primary border border-fittree-primary/20 flex items-center justify-center">
                      <User size={16} />
                    </div>
                    {userInfo.name.split(' ')[0]}
                  </button>

                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-fittree-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-fittree-text hover:bg-fittree-light hover:text-fittree-primary transition-colors">
                      <User size={16} /> Profile
                    </Link>
                    {userInfo.isAdmin && (
                      <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-fittree-text hover:bg-fittree-light hover:text-fittree-primary transition-colors">
                        <Package size={16} /> Dashboard
                      </Link>
                    )}
                    <button onClick={logoutHandler} className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-fittree-pink hover:bg-red-50 transition-colors border-t border-fittree-border">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="font-bold text-[14px] text-fittree-text hover:text-fittree-primary transition-colors">
                  Login
                </Link>
              )}

              <Link to="/cart" className="relative flex items-center justify-center w-12 h-12 bg-fittree-primary text-white rounded-xl hover:bg-fittree-primary-soft transition-colors shadow-md hover:shadow-lg hover:-translate-y-0.5">
                <ShoppingCart size={22} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-fittree-accent text-white text-[11px] font-bold h-6 w-6 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-4">
              <Link to="/cart" className="relative text-fittree-text p-2">
                <ShoppingCart size={24} />
                {cartItemsCount > 0 && (
                  <span className="absolute 0 right-0 bg-fittree-accent text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              
              <button
                className="text-fittree-text p-2"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Menu"
              >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
          
          {/* Mobile Search Bar */}
          <div className="md:hidden pb-4">
             <div className="w-full relative shadow-sm rounded-xl overflow-hidden border border-fittree-border focus-within:border-fittree-primary focus-within:ring-2 focus-within:ring-fittree-primary/20">
                <SearchBox />
             </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-[115px] bg-white z-40 md:hidden overflow-y-auto">
          <div className="p-6 flex flex-col gap-6">
            <nav className="flex flex-col gap-4 text-[20px] font-bold text-fittree-text">
              {NAV_LINKS.map((link) => (
                <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="pb-3 border-b border-fittree-border">
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-4 mt-2">
              {userInfo ? (
                <>
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-[16px] font-bold text-fittree-text p-3 bg-fittree-bg rounded-xl">
                    <User size={20} /> My Profile
                  </Link>
                  {userInfo.isAdmin && (
                    <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-[16px] font-bold text-fittree-text p-3 bg-fittree-bg rounded-xl">
                      <Package size={20} /> Admin Dashboard
                    </Link>
                  )}
                  <button onClick={logoutHandler} className="flex items-center gap-3 text-[16px] font-bold text-fittree-pink p-3 bg-red-50 rounded-xl">
                    <LogOut size={20} /> Logout
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="btn btn-primary w-full py-4 text-[16px]">
                  Sign In to your account
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
