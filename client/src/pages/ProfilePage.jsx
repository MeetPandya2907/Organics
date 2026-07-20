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
    <div className="bg-fittree-bg min-h-screen pt-[130px] pb-24 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
             <div className="w-20 h-20 rounded-2xl bg-white border border-fittree-border text-fittree-primary flex items-center justify-center text-4xl font-bold shadow-sm">
                {name ? name.charAt(0).toUpperCase() : 'U'}
             </div>
             <div>
                <h1 className="text-3xl font-bold text-fittree-text mb-1">{name}</h1>
                <p className="text-fittree-text-light font-medium flex items-center gap-2"><Mail size={16} /> {email}</p>
             </div>
          </div>
          <button onClick={logoutHandler} className="px-6 py-2.5 bg-white hover:bg-red-50 text-fittree-text hover:text-red-500 rounded-xl font-bold transition-colors flex items-center gap-2 border border-fittree-border shadow-sm">
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Profile Settings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:w-1/3">
            <div className="bg-white p-8 rounded-2xl border border-fittree-border sticky top-32 shadow-sm">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-fittree-border">
                 <div className="p-2.5 bg-fittree-sand text-fittree-text rounded-xl">
                   <Settings size={20} strokeWidth={2} />
                 </div>
                 <h2 className="text-xl font-bold text-fittree-text">Account Settings</h2>
              </div>
              
              {message && (
                <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-xl flex items-center gap-3 text-[14px] font-bold border border-red-100">
                  <AlertCircle size={18} /> {message}
                </div>
              )}
              {success && (
                <div className="mb-6 p-4 bg-green-50 text-fittree-primary rounded-xl flex items-center gap-3 text-[14px] font-bold border border-green-100">
                  <CheckCircle size={18} /> Profile Updated Successfully
                </div>
              )}

              <form onSubmit={submitHandler} className="space-y-6">
                <div>
                  <label className="block text-[12px] font-bold text-fittree-text-light uppercase tracking-widest mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-fittree-text-light" size={18} />
                    <input
                      type="text"
                      className="w-full pl-12 pr-4 py-3.5 bg-fittree-sand border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-fittree-primary focus:ring-4 focus:ring-fittree-primary/10 transition-all text-fittree-text font-medium"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-fittree-text-light uppercase tracking-widest mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-fittree-text-light" size={18} />
                    <input
                      type="email"
                      className="w-full pl-12 pr-4 py-3.5 bg-fittree-sand border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-fittree-primary focus:ring-4 focus:ring-fittree-primary/10 transition-all text-fittree-text font-medium"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-fittree-border">
                  <label className="block text-[12px] font-bold text-fittree-text-light uppercase tracking-widest mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-fittree-text-light" size={18} />
                    <input
                      type="password"
                      placeholder="Leave blank to keep current"
                      className="w-full pl-12 pr-4 py-3.5 bg-fittree-sand border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-fittree-primary focus:ring-4 focus:ring-fittree-primary/10 transition-all text-fittree-text font-medium"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-fittree-text-light uppercase tracking-widest mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-fittree-text-light" size={18} />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full pl-12 pr-4 py-3.5 bg-fittree-sand border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-fittree-primary focus:ring-4 focus:ring-fittree-primary/10 transition-all text-fittree-text font-medium"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-full py-3.5 text-[15px] mt-4">
                  Save Changes
                </button>
              </form>
            </div>
          </motion.div>

          {/* Right Column: Order History */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:w-2/3">
            <div className="bg-white p-8 md:p-10 rounded-2xl border border-fittree-border shadow-sm min-h-full">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-fittree-border">
                 <div className="p-2.5 bg-fittree-sand text-fittree-text rounded-xl">
                   <ShoppingBag size={20} strokeWidth={2} />
                 </div>
                 <h2 className="text-xl font-bold text-fittree-text">Order History</h2>
              </div>
              
              {loadingOrders ? (
                <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-fittree-primary"></div></div>
              ) : orders.length === 0 ? (
                <div className="text-center py-24 bg-fittree-bg rounded-2xl border border-dashed border-fittree-border">
                  <Package className="mx-auto text-fittree-text-light mb-6" size={56} strokeWidth={1} />
                  <h3 className="text-[20px] font-bold text-fittree-text mb-2">No Orders Yet</h3>
                  <p className="text-fittree-text-light mb-8 max-w-md mx-auto">Looks like you haven't made your first purchase yet. Discover our fresh groceries.</p>
                  <Link to="/products" className="btn btn-primary inline-flex items-center gap-2">
                    Start Shopping <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order._id} className="bg-white border border-fittree-border rounded-2xl p-6 sm:p-8 hover:shadow-md transition-shadow group">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 border-b border-fittree-border pb-6 mb-6">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <p className="text-[12px] font-bold text-fittree-text-light uppercase tracking-widest">Order</p>
                            <p className="font-mono font-bold text-fittree-text bg-fittree-sand px-2 py-0.5 rounded border border-fittree-border">#{order._id.substring(0, 8)}</p>
                          </div>
                          <p className="text-[13px] font-medium text-fittree-text-light flex items-center gap-2"><Clock size={14}/> {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {order.isDelivered ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-[11px] font-bold uppercase tracking-wider"><CheckCircle size={14} /> Delivered</span>
                          ) : order.isPaid ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-bold uppercase tracking-wider"><Truck size={14} /> Shipped</span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-lg text-[11px] font-bold uppercase tracking-wider"><Clock size={14} /> Processing</span>
                          )}
                          <Link to={`/order/${order._id}`} className="px-4 py-2 bg-white border border-fittree-border text-fittree-text rounded-xl text-[13px] font-bold hover:border-fittree-primary transition-colors shadow-sm">
                            Details
                          </Link>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-3">
                          {order.orderItems.slice(0, 4).map((item, idx) => (
                            <div key={idx} className="w-12 h-12 rounded-full border-2 border-white bg-fittree-sand shadow-sm overflow-hidden p-1 relative z-10 hover:z-20 hover:scale-110 transition-transform">
                               <img src={item.image} alt="product" className="w-full h-full object-contain mix-blend-multiply" title={item.name} />
                            </div>
                          ))}
                          {order.orderItems.length > 4 && (
                            <div className="w-12 h-12 rounded-full border-2 border-white bg-fittree-sand shadow-sm flex items-center justify-center text-[12px] font-bold text-fittree-text-light relative z-0">
                              +{order.orderItems.length - 4}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] font-bold text-fittree-text-light uppercase tracking-widest mb-1">Total Amount</p>
                          <p className="text-xl font-bold text-fittree-text">₹{order.totalPrice}</p>
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
    </div>
  );
};

export default ProfilePage;
