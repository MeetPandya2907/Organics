import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { User, Mail, Lock, AlertCircle, CheckCircle, Package, Truck, Clock, ArrowRight, Settings, ShoppingBag, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const { userInfo, updateProfile, getMyOrders, logout } = useStore();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      setName(userInfo.name);
      setEmail(userInfo.email);
      
      const fetchOrders = async () => {
        const myOrders = await getMyOrders();
        setOrders(myOrders);
        setLoadingOrders(false);
      };
      fetchOrders();
    }
  }, [userInfo, navigate, getMyOrders]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      const success = await updateProfile(name, email, password);
      if (success) {
        setSuccess(true);
        setMessage(null);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setMessage(useStore.getState().error);
      }
    }
  };

  const logoutHandler = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-paper min-h-screen pb-24">
      {/* Profile Header */}
      <div className="bg-ink pt-32 pb-32 px-6 shadow-2xl shadow-black/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-forest/20 mix-blend-overlay"></div>
        <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
             <div className="w-24 h-24 rounded-full bg-turmeric text-ink flex items-center justify-center text-4xl font-display font-bold shadow-xl shadow-turmeric/20">
                {name ? name.charAt(0).toUpperCase() : 'U'}
             </div>
             <div>
                <h1 className="text-4xl md:text-5xl font-display text-white font-bold mb-2">{name}</h1>
                <p className="text-slate-300 font-medium text-lg flex items-center gap-2"><Mail size={16} /> {email}</p>
             </div>
          </div>
          <button onClick={logoutHandler} className="px-6 py-3 bg-white/10 hover:bg-red-500/20 text-white hover:text-red-400 rounded-xl font-bold transition-colors flex items-center gap-2 backdrop-blur-md border border-white/10 hover:border-red-500/30">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10 -mt-12 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Profile Settings */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="lg:w-1/3">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-glass border border-slate-100 sticky top-28">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
               <div className="p-3 bg-forest/10 text-forest rounded-xl">
                 <Settings size={24} strokeWidth={1.5} />
               </div>
               <h2 className="text-2xl font-display font-bold text-ink">Account Settings</h2>
            </div>
            
            {message && (
              <div className="mb-6 p-4 bg-red-500/10 text-red-500 rounded-xl flex items-center gap-3 text-sm font-bold border border-red-500/20">
                <AlertCircle size={20} /> {message}
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-500/10 text-forest rounded-xl flex items-center gap-3 text-sm font-bold border border-forest/20">
                <CheckCircle size={20} /> Profile Updated Successfully
              </div>
            )}

            <form onSubmit={submitHandler} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Full Name</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} strokeWidth={1.5} />
                  <input
                    type="text"
                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors text-ink font-medium placeholder-slate-400"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} strokeWidth={1.5} />
                  <input
                    type="email"
                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors text-ink font-medium placeholder-slate-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} strokeWidth={1.5} />
                  <input
                    type="password"
                    placeholder="Leave blank to keep current"
                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors text-ink font-medium placeholder-slate-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} strokeWidth={1.5} />
                  <input
                    type="password"
                    placeholder="Confirm password"
                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors text-ink font-medium placeholder-slate-400"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full py-4 text-lg mt-6 shadow-lg shadow-forest/20">
                Save Changes
              </button>
            </form>
          </div>
        </motion.div>

        {/* Right Column: Order History */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:w-2/3">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-glass border border-slate-100 min-h-full">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
               <div className="p-3 bg-turmeric/20 text-turmeric-light rounded-xl">
                 <ShoppingBag size={24} strokeWidth={1.5} />
               </div>
               <h2 className="text-2xl font-display font-bold text-ink">Order History</h2>
            </div>
            
            {loadingOrders ? (
              <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-forest"></div></div>
            ) : orders.length === 0 ? (
              <div className="text-center py-24 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                <Package className="mx-auto text-slate-300 mb-6" size={64} strokeWidth={1} />
                <h3 className="text-xl font-bold text-ink mb-2">No Orders Yet</h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">Looks like you haven't made your first organic purchase yet. Discover our fresh produce.</p>
                <Link to="/" className="btn btn-primary inline-flex items-center gap-2 shadow-lg shadow-forest/20">
                  Start Shopping <ArrowRight size={18} />
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 sm:p-8 hover:shadow-md transition-shadow group">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 border-b border-slate-200 pb-6 mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Order</p>
                          <p className="font-mono font-bold text-ink bg-white px-2 py-0.5 rounded border border-slate-200">#{order._id.substring(0, 8)}</p>
                        </div>
                        <p className="text-sm font-medium text-slate-500 flex items-center gap-2"><Clock size={14}/> {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {order.isDelivered ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-forest border border-forest/20 rounded-lg text-xs font-bold uppercase tracking-wider"><CheckCircle size={14} /> Delivered</span>
                        ) : order.isPaid ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-lg text-xs font-bold uppercase tracking-wider"><Truck size={14} /> Shipped</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-turmeric/20 text-turmeric-light border border-turmeric/30 rounded-lg text-xs font-bold uppercase tracking-wider"><Clock size={14} /> Processing</span>
                        )}
                        <Link to={`/order/${order._id}`} className="px-4 py-2 bg-white border border-slate-200 text-ink rounded-xl text-sm font-bold hover:bg-forest hover:border-forest hover:text-white transition-all shadow-sm">
                          Details
                        </Link>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-3">
                        {order.orderItems.slice(0, 4).map((item, idx) => (
                          <div key={idx} className="w-14 h-14 rounded-full border-4 border-slate-50 bg-white shadow-sm overflow-hidden p-1.5 relative z-10 hover:z-20 hover:scale-110 transition-transform">
                             <img src={item.image} alt="product" className="w-full h-full object-contain mix-blend-multiply" title={item.name} />
                          </div>
                        ))}
                        {order.orderItems.length > 4 && (
                          <div className="w-14 h-14 rounded-full border-4 border-slate-50 bg-white shadow-sm flex items-center justify-center text-xs font-bold text-slate-400 relative z-0">
                            +{order.orderItems.length - 4}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-forest">₹{order.totalPrice}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
