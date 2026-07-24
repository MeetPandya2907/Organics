import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStore } from '../store/useStore';
import { ShoppingCart, User, LogOut, Package, Menu, X, Leaf, Heart, Truck, ChevronDown } from 'lucide-react';
import SearchBox from './SearchBox';
import CartDrawer from './CartDrawer';
import Logo from './Logo';

const NAV_LINKS = [
  { name: 'Shop', path: '/products' },
  { name: 'Our Story', path: '/about' },
  { name: 'Sustainability', path: '/about' },
  { name: 'Blog', path: '/recipes' },
  { name: 'Track Order', path: '/track-order' },
  { name: 'Contact', path: '/contact' },
];

const Header = () => {
  const { userInfo, logout, cart, wishlist } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/categories').then(({ data }) => setCategories(data)).catch(() => { });
  }, []);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const logoutHandler = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <>
      <div className="absolute w-full top-0 z-50 bg-fittree-cream/90 backdrop-blur-md">

        <header className="w-full">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between gap-6 py-4">

              {/* Logo (Left, flex-1 to push nav to center) */}
              <div className="flex flex-1">
                <Link to="/" className="flex items-center shrink-0 group" aria-label="FitTree Organics">
                  <Logo className="group-hover:scale-105 transition-transform" />
                </Link>
              </div>

              {/* Nav (Centered) */}
              <nav className="hidden lg:flex items-center justify-center gap-8 text-[14px] font-bold text-fittree-text shrink-0">
                <Link to="/products" className="hover:text-fittree-primary transition-colors">Shop</Link>

                <div className="relative group py-2 -my-2">
                  <button className="flex items-center gap-1 hover:text-fittree-primary transition-colors">
                    Categories <ChevronDown size={14} />
                  </button>
                  <div className="absolute left-0 top-full w-52 bg-white rounded-xl shadow-lg border border-fittree-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden py-1.5">
                    {categories.map((c) => (
                      <Link
                        key={c._id}
                        to={`/products?category=${encodeURIComponent(c.name)}`}
                        className="block px-4 py-2.5 text-[13.5px] font-medium text-fittree-text hover:bg-fittree-light hover:text-fittree-primary transition-colors"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {NAV_LINKS.slice(1).map(link => (
                  <Link key={link.name} to={link.path} className="hover:text-fittree-primary transition-colors whitespace-nowrap">
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* Desktop Actions (Right, flex-1) */}
              <div className="hidden md:flex flex-1 items-center justify-end gap-5 shrink-0">
                <div className="w-full max-w-[200px] lg:max-w-[240px]">
                  <SearchBox />
                </div>
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

                <Link to="/wishlist" className="relative flex items-center justify-center w-10 h-10 text-fittree-text hover:text-fittree-pink transition-colors">
                  <Heart size={22} strokeWidth={1.5} />
                  {wishlist.length > 0 && (
                    <span className="absolute top-0 right-0 bg-fittree-pink text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                {/* Cart Button */}
                <button
                  onClick={() => setCartOpen(true)}
                  className="relative flex items-center justify-center w-10 h-10 text-fittree-text hover:text-fittree-primary transition-colors"
                >
                  <ShoppingCart size={22} strokeWidth={1.5} />
                  {cartItemsCount > 0 && (
                    <span className="absolute top-0 right-0 bg-fittree-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Mobile Actions */}
              <div className="flex md:hidden items-center gap-4">
                <Link to="/wishlist" className="relative text-fittree-text p-2">
                  <Heart size={22} />
                  {wishlist.length > 0 && (
                    <span className="absolute 0 right-0 bg-fittree-pink text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
                {/* Mobile cart → drawer */}
                <button onClick={() => setCartOpen(true)} className="relative text-fittree-text p-2">
                  <ShoppingCart size={24} />
                  {cartItemsCount > 0 && (
                    <span className="absolute 0 right-0 bg-fittree-accent text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                      {cartItemsCount}
                    </span>
                  )}
                </button>

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
                {categories.length > 0 && (
                  <div className="pb-3 border-b border-fittree-border">
                    <span className="block text-[13px] font-bold uppercase tracking-wider text-fittree-text-light mb-3">Categories</span>
                    <div className="flex flex-col gap-3">
                      {categories.map((c) => (
                        <Link key={c._id} to={`/products?category=${encodeURIComponent(c.name)}`} onClick={() => setIsOpen(false)} className="text-[16px] font-semibold text-fittree-text">
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
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

      {/* Global Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Header;
