import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { CheckCircle, MapPin, CreditCard, ShoppingBag, AlertCircle, Clock, Truck, ShieldCheck, ArrowRight, Package, Home, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const OrderPage = () => {
  const { id: orderId } = useParams();
  const { userInfo } = useStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get(`/api/orders/${orderId}`, config);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchOrder();
    }
  }, [orderId, userInfo]);

  const handlePayment = async () => {
    setPaymentLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      // 1. Get Razorpay Key
      const { data: keyData } = await axios.get('/api/payment/razorpay/key', config);

      // 2. Create Razorpay Order
      const { data: razorpayOrder } = await axios.post(
        '/api/payment/razorpay/create',
        { amount: order.totalPrice, orderId: order._id },
        config
      );

      // 3. Open Razorpay Checkout
      const options = {
        key: keyData.key,
        amount: razorpayOrder.amount,
        currency: 'INR',
        name: 'Organics Store',
        description: 'Thank you for your purchase',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            // 4. Verify Payment
            await axios.post(
              '/api/payment/razorpay/verify',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order._id,
              },
              config
            );
            
            // Redirect to success page
            navigate(`/order-success/${order._id}`);
          } catch (err) {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: order.user.name,
          email: order.user.email,
          contact: (order.shippingAddress && order.shippingAddress.phone) ? order.shippingAddress.phone.replace(/\D/g, '').slice(-10) : undefined,
        },
        theme: {
          color: '#1B4D3E', // forest green
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert(response.error.description);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert('Failed to initialize payment gateway.');
    }
    setPaymentLoading(false);
  };

  const shipOrderHandler = async () => {
    const previousOrder = { ...order };
    setOrder({ ...order, isShipped: true, shippedAt: new Date().toISOString() });
    
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`/api/orders/${order._id}/ship`, {}, config);
      toast.success('Order marked as shipped');
    } catch (err) {
      setOrder(previousOrder);
      toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
    }
  };

  const deliverOrderHandler = async () => {
    // Optimistic update
    const previousOrder = { ...order };
    setOrder({ ...order, isDelivered: true, deliveredAt: new Date().toISOString() });
    
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`/api/orders/${order._id}/deliver`, {}, config);
      toast.success('Order marked as delivered');
    } catch (err) {
      // Revert on error
      setOrder(previousOrder);
      toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-paper">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-forest"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-paper px-6">
        <div className="bg-white p-12 rounded-[2rem] shadow-glass border border-red-100 max-w-md text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-6" />
          <h2 className="text-2xl text-ink font-display font-bold mb-4">Order Error</h2>
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper min-h-screen pb-24">
      {/* Header */}
      <div className="bg-ink pt-32 pb-32 px-6 shadow-2xl shadow-black/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-forest/20 mix-blend-overlay"></div>
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between relative z-10 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-display text-white font-bold mb-3">Order Details</h1>
            <p className="text-slate-300 font-medium flex items-center justify-center md:justify-start gap-2">
               <span className="text-xs uppercase tracking-widest font-bold">Order ID</span> 
               <span className="font-mono bg-white/10 px-2 py-0.5 rounded border border-white/20">{order._id}</span>
            </p>
          </div>
          <div className="px-6 py-3 bg-white/10 rounded-full border border-white/20 text-white font-bold flex items-center gap-2 backdrop-blur-md shadow-lg">
            <span className="text-xs uppercase tracking-widest text-slate-300">Status</span>
            {order.isDelivered ? (
              <span className="text-green-400 flex items-center gap-1.5"><CheckCircle size={16} /> Delivered</span>
            ) : order.isPaid ? (
              <span className="text-turmeric flex items-center gap-1.5"><Truck size={16} /> Shipped</span>
            ) : (
              <span className="text-red-400 flex items-center gap-1.5"><Clock size={16} /> Awaiting Payment</span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10 -mt-16 flex flex-col lg:flex-row gap-8">
        
        {/* Left: Order Details */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="lg:w-2/3 space-y-6">
          
          {/* Interactive Tracking Timeline */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-glass border border-slate-100">
            <h2 className="text-2xl text-ink font-display font-bold mb-8">Order Status</h2>
            <div className="relative">
              <div className="absolute top-6 left-6 bottom-6 w-1 bg-slate-100 md:top-1/2 md:-translate-y-1/2 md:left-6 md:right-6 md:h-1 md:w-auto"></div>
              
              <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-0 relative z-10">
                {/* 1. Placed */}
                <div className="flex md:flex-col items-center gap-4 md:gap-3 text-center w-full md:w-1/4">
                  <div className="w-12 h-12 rounded-full bg-forest text-white flex items-center justify-center shadow-lg shadow-forest/20 shrink-0 border-4 border-white">
                    <ShoppingCart size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-ink text-sm">Order Placed</p>
                    <p className="text-xs text-slate-400 font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* 2. Paid */}
                <div className="flex md:flex-col items-center gap-4 md:gap-3 text-center w-full md:w-1/4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-white ${order.isPaid || order.paymentMethod === 'CashOnDelivery' ? 'bg-forest text-white shadow-lg shadow-forest/20' : 'bg-slate-100 text-slate-400'}`}>
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${order.isPaid || order.paymentMethod === 'CashOnDelivery' ? 'text-ink' : 'text-slate-400'}`}>Payment Confirmed</p>
                    {order.isPaid && <p className="text-xs text-slate-400 font-medium">{new Date(order.paidAt).toLocaleDateString()}</p>}
                    {!order.isPaid && order.paymentMethod === 'CashOnDelivery' && <p className="text-xs text-slate-400 font-medium">COD Confirmed</p>}
                  </div>
                </div>

                {/* 3. Shipped */}
                <div className="flex md:flex-col items-center gap-4 md:gap-3 text-center w-full md:w-1/4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-white ${order.isShipped ? 'bg-forest text-white shadow-lg shadow-forest/20' : 'bg-slate-100 text-slate-400'}`}>
                    <Package size={20} />
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${order.isShipped ? 'text-ink' : 'text-slate-400'}`}>Shipped</p>
                    {order.isShipped && <p className="text-xs text-slate-400 font-medium">{new Date(order.shippedAt).toLocaleDateString()}</p>}
                  </div>
                </div>

                {/* 4. Delivered */}
                <div className="flex md:flex-col items-center gap-4 md:gap-3 text-center w-full md:w-1/4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-white ${order.isDelivered ? 'bg-forest text-white shadow-lg shadow-forest/20' : 'bg-slate-100 text-slate-400'}`}>
                    <Home size={20} />
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${order.isDelivered ? 'text-ink' : 'text-slate-400'}`}>Delivered</p>
                    {order.isDelivered && <p className="text-xs text-slate-400 font-medium">{new Date(order.deliveredAt).toLocaleDateString()}</p>}
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-glass border border-slate-100 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-forest/5 text-forest rounded-full flex items-center justify-center shrink-0">
                <MapPin size={24} strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl text-ink font-display font-bold">Shipping Details</h2>
            </div>
            <div className="pl-16">
              <div className="text-slate-600 text-lg font-medium space-y-2 mb-6">
                <p><span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Recipient</span> <span className="text-ink font-bold">{order.user.name}</span></p>
                <p><span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1 mt-4">Contact</span> <a href={`mailto:${order.user.email}`} className="text-forest hover:underline">{order.user.email}</a></p>
                <p className="mt-4"><span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1 mt-4">Address</span>
                  <span className="leading-relaxed block">
                     {order.shippingAddress.address}, <br/>
                     {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                  </span>
                </p>
              </div>
              {order.isDelivered ? (
                <div className="bg-green-500/10 text-forest p-4 rounded-xl flex items-center gap-3 border border-forest/20 font-bold">
                  <CheckCircle size={20} /> Delivered on {new Date(order.deliveredAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              ) : (
                <div className="bg-turmeric/10 text-turmeric-light p-4 rounded-xl flex items-center gap-3 border border-turmeric/20 font-bold">
                  <Clock size={20} /> Processing & Not Delivered Yet
                </div>
              )}
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
              <div className="text-slate-600 text-lg font-medium mb-6">
                <p className="flex items-center gap-3">
                   <span className="font-bold text-ink bg-slate-50 px-3 py-1 rounded-md border border-slate-200">{order.paymentMethod}</span> 
                </p>
              </div>
              {order.isPaid ? (
                <div className="bg-green-500/10 text-forest p-4 rounded-xl flex items-center gap-3 border border-forest/20 font-bold">
                  <CheckCircle size={20} /> Paid on {new Date(order.paidAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              ) : (
                <div className="bg-red-500/10 text-red-500 p-4 rounded-xl flex items-center gap-3 border border-red-500/20 font-bold">
                  <AlertCircle size={20} /> Payment Pending
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-glass border border-slate-100 overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-slate-50 border border-slate-200 text-slate-500 rounded-full flex items-center justify-center shrink-0">
                <ShoppingBag size={24} strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl text-ink font-display font-bold">Order Items</h2>
            </div>
            
            {order.orderItems.length === 0 ? (
              <p className="text-slate-500 text-lg font-medium text-center py-8">Order is empty</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="py-6 flex items-center gap-6 group/item hover:bg-slate-50/50 transition-colors -mx-8 px-8">
                    <div className="relative w-20 h-20 bg-slate-50 rounded-[1.25rem] p-2 border border-slate-100 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover/item:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1">
                      <Link to={`/product/${item.product}`} className="font-bold text-[17px] text-ink hover:text-forest transition-colors line-clamp-2">
                        {item.name}
                      </Link>
                      <div className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">Qty: {item.qty} &times; ₹{item.price}</div>
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
                <span>Items</span>
                <span className="font-bold text-white">₹{order.itemsPrice || order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300 font-medium text-[15px]">
                <span>Shipping</span>
                <span className="font-bold text-white">{order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice}`}</span>
              </div>
              <div className="flex justify-between text-slate-300 font-medium text-[15px]">
                <span>Tax</span>
                <span className="font-bold text-white">₹{order.taxPrice}</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-10 relative z-10">
              <span className="text-lg text-slate-400 font-bold uppercase tracking-widest">Total</span>
              <div className="text-right">
                <span className="text-4xl sm:text-5xl font-bold text-turmeric leading-none">₹{order.totalPrice}</span>
              </div>
            </div>

            {!order.isPaid && order.paymentMethod !== 'CashOnDelivery' && (
              <button 
                onClick={handlePayment} 
                disabled={paymentLoading}
                className="btn bg-turmeric text-ink border-none w-full py-5 text-lg flex justify-center items-center gap-3 group relative z-10 hover:bg-turmeric-light hover:shadow-xl hover:shadow-turmeric/20 font-bold disabled:opacity-50"
              >
                {paymentLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-ink"></div>
                ) : (
                  <>
                     <ShieldCheck size={20} strokeWidth={2.5} /> Pay with Razorpay
                  </>
                )}
              </button>
            )}

            {userInfo && userInfo.isAdmin && order.isPaid && !order.isShipped && (
              <button 
                onClick={shipOrderHandler} 
                className="btn bg-turmeric text-ink border-none w-full py-5 text-lg flex justify-center items-center gap-3 group relative z-10 hover:bg-turmeric-light hover:shadow-xl hover:shadow-turmeric/20 font-bold mt-4"
              >
                <Package size={20} strokeWidth={2.5} /> Mark As Shipped
              </button>
            )}

            {userInfo && userInfo.isAdmin && order.isShipped && !order.isDelivered && (
              <button 
                onClick={deliverOrderHandler} 
                className="btn bg-leaf text-white border-none w-full py-5 text-lg flex justify-center items-center gap-3 group relative z-10 hover:bg-forest hover:shadow-xl hover:shadow-leaf/20 font-bold mt-4"
              >
                <Truck size={20} strokeWidth={2.5} /> Mark As Delivered
              </button>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default OrderPage;
