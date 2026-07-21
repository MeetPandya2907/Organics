import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, Tag, ExternalLink } from 'lucide-react';

const NAV = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { name: 'Customers', path: '/admin/users', icon: Users },
  { name: 'Coupons', path: '/admin/coupons', icon: Tag },
];

const AdminLayout = ({ title, actions, children }) => {
  const location = useLocation();

  return (
    <div className="bg-fittree-bg min-h-screen pt-[130px] pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-6">

        {/* Sidebar */}
        <aside className="lg:w-[220px] shrink-0">
          <div className="bg-white rounded-2xl border border-fittree-border shadow-sm p-3 lg:sticky lg:top-[150px]">
            <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible hide-scrollbar">
              {NAV.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13.5px] font-bold whitespace-nowrap transition-colors shrink-0 ${
                      active
                        ? 'bg-fittree-primary text-white shadow-sm'
                        : 'text-fittree-text-light hover:bg-fittree-sand hover:text-fittree-text'
                    }`}
                  >
                    <Icon size={16} /> {item.name}
                  </Link>
                );
              })}
            </div>
            <div className="hidden lg:block mt-3 pt-3 border-t border-fittree-border">
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold text-fittree-text-light hover:bg-fittree-sand hover:text-fittree-text transition-colors"
              >
                <ExternalLink size={15} /> View Store
              </Link>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-fittree-text">{title}</h1>
            {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
          </div>
          {children}
        </div>

      </div>
    </div>
  );
};

export default AdminLayout;
