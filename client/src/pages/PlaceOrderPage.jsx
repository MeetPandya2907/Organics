import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { CheckCircle, MapPin, CreditCard, ShoppingBag, ArrowRight, ShieldCheck, Leaf } from 'lucide-react';
import axios from 'axios';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const { cart, shippingAddress, paymentMethod, userInfo, clearCart } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const itemsPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 1000 ? 0 : 50;
  const taxPrice = addDecimals(Number((0.05 * itemsPrice).toFixed(2))); // 5% tax
  const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else if (!shippingAddress.address) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    }
  }, [userInfo, shippingAddress, paymentMethod, navigate]);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cart.map(item => ({
            name: item.name,
            qty: item.qty,
            image: item.image,
            price: item.price,
            product: item.originalId || item._id,
          })),
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        config
      );

      clearCart();
      navigate(`/order/${data._id}`);
    } catch (error) {
      setError(error.response && error.response.data.message ? error.response.data.message : error.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-paper min-h-screen pb-24">
      {/* Checkout Steps Header */}
      <div className="bg-ink pt-32 pb-32 px-6 shadow-soft relative overflow-hidden">
        <div className="absolute inset-0 bg-forest/20 mix-blend-overlay"></div>
        <div className="max-w-[800px] mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-display text-white mb-10 font-bold">Checkout</h1>
          <div className="flex justify-center items-center gap-2 sm:gap-6 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
            <div className="flex items-center gap-3 text-slate-300"><div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center">1</div> <span className="hidden sm:inline">Shipping</span></div>
            <div className="w-8 sm:w-16 h-[2px] bg-white/20 rounded-full"></div>
            <div className="flex items-center gap-3 text-slate-300"><div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center">2</div> <span className="hidden sm:inline">Payment</span></div>
            <div className="w-8 sm:w-16 h-[2px] bg-white/20 rounded-full"></div>
            <div className="flex items-center gap-3 text-turmeric"><div className="w-8 h-8 rounded-full bg-turmeric text-ink flex items-center justify-center shadow-lg shadow-turmeric/20">3</div> <span className="hidden sm:inline">Review</span></div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10 -mt-16 flex flex-col lg:flex-row gap-8">
        
        {/* Left: Order Details */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="lg:w-2/3 space-y-6">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-glass border border-slate-100 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-forest/5 text-forest rounded-full flex items-center justify-center shrink-0">
                <MapPin size={24} strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl text-ink font-display font-bold">Shipping Details</h2>
            </div>
            <div className="pl-16">
              <p className="text-slate-600 text-lg font-medium leading-relaxed">
                {shippingAddress.address}, <br/>
                {shippingAddress.city} {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-glass border border-slate-100 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-turmeric/10 text-turmeric-light rounded-full flex items-center justify-center shrink-0">
                <CreditCard size={24} strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl text-ink font-display font-bold">Payment Method</h2>
            </div>
            <div className="pl-16">
              <p className="text-slate-600 text-lg font-medium flex items-center gap-3">
                 <span className="font-bold text-ink bg-slate-50 px-3 py-1 rounded-md border border-slate-200">{paymentMethod}</span> 
              </p>
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-glass border border-slate-100 overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-slate-50 border border-slate-200 text-slate-500 rounded-full flex items-center justify-center shrink-0">
                <ShoppingBag size={24} strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl text-ink font-display font-bold">Order Items</h2>
            </div>
            
            {cart.length === 0 ? (
              <p className="text-slate-500 text-lg font-medium text-center py-8">Your bag is empty</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {cart.map((item, index) => (
                  <div key={index} className="py-6 flex items-center gap-6 group/item hover:bg-slate-50/50 transition-colors -mx-8 px-8">
                    <div className="relative w-20 h-20 bg-slate-50 rounded-[1.25rem] p-2 border border-slate-100 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover/item:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1">
                      <Link to={`/product/${item.originalId || item._id}`} className="font-bold text-[17px] text-ink hover:text-forest transition-colors line-clamp-2">
                        {item.name}
                      </Link>
                      <div className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">Qty: {item.qty}</div>
                    </div>
                    <div className="text-xl font-bold text-forest whitespace-nowrap text-right">
                       ₹{(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Right: Order Summary */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:w-1/3">
          <div className="bg-ink p-8 sm:p-10 rounded-[2.5rem] shadow-glass-dark text-white sticky top-28 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-forest/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            
            <h2 className="text-2xl font-display font-bold mb-8 relative z-10 border-b border-white/10 pb-6">Order Summary</h2>
            
            <div className="space-y-5 mb-8 relative z-10 border-b border-white/10 pb-8">
              <div className="flex justify-between text-slate-300 font-medium text-[15px]">
                <span>Items ({cart.reduce((a, c) => a + c.qty, 0)})</span>
                <span className="font-bold text-white">₹{itemsPrice}</span>
              </div>
              <div className="flex justify-between text-slate-300 font-medium text-[15px]">
                <span>Shipping</span>
                <span className="font-bold text-white">{shippingPrice === 0 ? 'Free' : `₹${shippingPrice}`}</span>
              </div>
              <div className="flex justify-between text-slate-300 font-medium text-[15px]">
                <span>Tax (5%)</span>
                <span className="font-bold text-white">₹{taxPrice}</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-10 relative z-10">
              <span className="text-lg text-slate-400 font-bold uppercase tracking-widest">Total</span>
              <div className="text-right">
                <span className="text-4xl sm:text-5xl font-bold text-turmeric leading-none">₹{totalPrice}</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-6 text-sm border border-red-500/20 font-medium relative z-10">
                {error}
              </div>
            )}

            <button
              onClick={placeOrderHandler}
              disabled={cart.length === 0 || loading}
              className={`btn bg-turmeric text-ink border-none w-full py-5 text-lg flex justify-center items-center gap-3 group relative z-10 hover:bg-turmeric-light hover:shadow-xl hover:shadow-turmeric/20 font-bold ${cart.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-ink"></div>
              ) : (
                <>
                  <CheckCircle size={20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" /> Place Order
                </>
              )}
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default PlaceOrderPage;
