import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { CheckCircle, MapPin, CreditCard, ShoppingBag, AlertCircle, Clock, Truck, ShieldCheck, Package, Home, ShoppingCart } from 'lucide-react';
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
        name: 'FitTree Organics',
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
      <div className="min-h-screen flex justify-center items-center bg-fittree-bg">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-fittree-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-fittree-bg px-6">
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-fittree-border max-w-md text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-6" />
          <h2 className="text-2xl text-fittree-text font-bold mb-4">Order Error</h2>
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-fittree-bg min-h-screen pb-24 pt-32">
      {/* Header */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl text-fittree-text font-bold mb-2">Order Details</h1>
          <p className="text-fittree-text-light font-medium flex items-center justify-center md:justify-start gap-2 text-[14px]">
             <span className="uppercase tracking-widest font-bold">Order ID</span> 
             <span className="font-mono bg-white px-2 py-0.5 rounded border border-fittree-border">{order._id}</span>
          </p>
        </div>
        <div className="px-6 py-3 bg-white rounded-full border border-fittree-border font-bold flex items-center gap-2 shadow-sm">
          <span className="text-xs uppercase tracking-widest text-fittree-text-light">Status</span>
          {order.isDelivered ? (
            <span className="text-green-600 flex items-center gap-1.5"><CheckCircle size={16} /> Delivered</span>
          ) : order.isPaid ? (
            <span className="text-fittree-accent flex items-center gap-1.5"><Truck size={16} /> Shipped</span>
          ) : (
            <span className="text-red-500 flex items-center gap-1.5"><Clock size={16} /> Awaiting Payment</span>
          )}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-6">
        
        {/* Left: Order Details */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:w-2/3 space-y-6">
          
          {/* Interactive Tracking Timeline */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-fittree-border">
            <h2 className="text-xl text-fittree-text font-bold mb-8">Order Status</h2>
            <div className="relative">
              <div className="absolute top-6 left-6 bottom-6 w-1 bg-fittree-bg md:top-1/2 md:-translate-y-1/2 md:left-6 md:right-6 md:h-1 md:w-auto"></div>
              
              <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-0 relative z-10">
                {/* 1. Placed */}
                <div className="flex md:flex-col items-center gap-4 md:gap-3 text-center w-full md:w-1/4">
                  <div className="w-12 h-12 rounded-full bg-fittree-primary text-white flex items-center justify-center shrink-0 shadow-sm border-4 border-white">
                    <ShoppingCart size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-fittree-text text-[13px] uppercase tracking-wider">Order Placed</p>
                    <p className="text-[12px] text-fittree-text-light font-medium mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* 2. Paid */}
                <div className="flex md:flex-col items-center gap-4 md:gap-3 text-center w-full md:w-1/4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-white ${order.isPaid || order.paymentMethod === 'CashOnDelivery' ? 'bg-fittree-primary text-white shadow-sm' : 'bg-fittree-sand text-fittree-text-light'}`}>
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className={`font-bold text-[13px] uppercase tracking-wider ${order.isPaid || order.paymentMethod === 'CashOnDelivery' ? 'text-fittree-text' : 'text-fittree-text-light'}`}>Payment Confirmed</p>
                    {order.isPaid && <p className="text-[12px] text-fittree-text-light font-medium mt-1">{new Date(order.paidAt).toLocaleDateString()}</p>}
                    {!order.isPaid && order.paymentMethod === 'CashOnDelivery' && <p className="text-[12px] text-fittree-text-light font-medium mt-1">COD Confirmed</p>}
                  </div>
                </div>

                {/* 3. Shipped */}
                <div className="flex md:flex-col items-center gap-4 md:gap-3 text-center w-full md:w-1/4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-white ${order.isShipped ? 'bg-fittree-primary text-white shadow-sm' : 'bg-fittree-sand text-fittree-text-light'}`}>
                    <Package size={20} />
                  </div>
                  <div>
                    <p className={`font-bold text-[13px] uppercase tracking-wider ${order.isShipped ? 'text-fittree-text' : 'text-fittree-text-light'}`}>Shipped</p>
                    {order.isShipped && <p className="text-[12px] text-fittree-text-light font-medium mt-1">{new Date(order.shippedAt).toLocaleDateString()}</p>}
                  </div>
                </div>

                {/* 4. Delivered */}
                <div className="flex md:flex-col items-center gap-4 md:gap-3 text-center w-full md:w-1/4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-white ${order.isDelivered ? 'bg-fittree-primary text-white shadow-sm' : 'bg-fittree-sand text-fittree-text-light'}`}>
                    <Home size={20} />
                  </div>
                  <div>
                    <p className={`font-bold text-[13px] uppercase tracking-wider ${order.isDelivered ? 'text-fittree-text' : 'text-fittree-text-light'}`}>Delivered</p>
                    {order.isDelivered && <p className="text-[12px] text-fittree-text-light font-medium mt-1">{new Date(order.deliveredAt).toLocaleDateString()}</p>}
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-fittree-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-fittree-light text-fittree-primary rounded-full flex items-center justify-center shrink-0">
                <MapPin size={20} strokeWidth={2} />
              </div>
              <h2 className="text-xl text-fittree-text font-bold">Shipping Details</h2>
            </div>
            <div className="pl-13 text-fittree-text text-[15px] font-medium space-y-4">
              <p className="flex flex-col"><span className="text-[11px] font-bold text-fittree-text-light uppercase tracking-widest mb-1">Recipient</span> <span className="font-bold">{order.user.name}</span></p>
              <p className="flex flex-col"><span className="text-[11px] font-bold text-fittree-text-light uppercase tracking-widest mb-1">Contact</span> <a href={`mailto:${order.user.email}`} className="hover:text-fittree-primary hover:underline">{order.user.email}</a></p>
              <p className="flex flex-col"><span className="text-[11px] font-bold text-fittree-text-light uppercase tracking-widest mb-1">Address</span>
                <span className="leading-relaxed">
                   {order.shippingAddress.address}, <br/>
                   {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </span>
              </p>
            </div>
            {order.isDelivered ? (
              <div className="mt-6 ml-13 bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3 border border-green-100 font-bold text-[14px]">
                <CheckCircle size={18} /> Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
              </div>
            ) : (
              <div className="mt-6 ml-13 bg-amber-50 text-amber-600 p-4 rounded-xl flex items-center gap-3 border border-amber-100 font-bold text-[14px]">
                <Clock size={18} /> Processing & Not Delivered Yet
              </div>
            )}
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-fittree-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                <CreditCard size={20} strokeWidth={2} />
              </div>
              <h2 className="text-xl text-fittree-text font-bold">Payment Method</h2>
            </div>
            <div className="pl-13">
              <div className="mb-6">
                <span className="font-bold text-fittree-text bg-fittree-bg px-3 py-1.5 rounded-lg border border-fittree-border text-[14px]">{order.paymentMethod}</span> 
              </div>
              {order.isPaid ? (
                <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3 border border-green-100 font-bold text-[14px]">
                  <CheckCircle size={18} /> Paid on {new Date(order.paidAt).toLocaleDateString()}
                </div>
              ) : (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100 font-bold text-[14px]">
                  <AlertCircle size={18} /> Payment Pending
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-fittree-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-fittree-bg border border-fittree-border text-fittree-text rounded-full flex items-center justify-center shrink-0">
                <ShoppingBag size={20} strokeWidth={2} />
              </div>
              <h2 className="text-xl text-fittree-text font-bold">Order Items</h2>
            </div>
            
            {order.orderItems.length === 0 ? (
              <p className="text-fittree-text-light text-[15px] font-medium text-center py-8">Order is empty</p>
            ) : (
              <div className="divide-y divide-fittree-border">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="py-4 flex flex-col sm:flex-row sm:items-center gap-4 group/item">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative w-16 h-16 bg-fittree-sand rounded-xl p-2 border border-fittree-border shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div>
                        <Link to={`/product/${item.product}`} className="font-bold text-[15px] text-fittree-text hover:text-fittree-primary transition-colors line-clamp-2">
                          {item.name}
                        </Link>
                        <div className="text-[12px] font-bold text-fittree-text-light mt-1">QTY: {item.qty} &times; ₹{item.price}</div>
                      </div>
                    </div>
                    <div className="text-[16px] font-bold text-fittree-text sm:text-right pl-20 sm:pl-0">
                       ₹{(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Right: Order Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:w-1/3">
          <div className="bg-white p-8 rounded-2xl border border-fittree-border sticky top-32">
            <h2 className="text-xl font-bold mb-6 text-fittree-text border-b border-fittree-border pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 border-b border-fittree-border pb-6">
              <div className="flex justify-between text-fittree-text font-medium text-[15px]">
                <span>Items</span>
                <span className="font-bold">₹{order.itemsPrice || order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-fittree-text font-medium text-[15px]">
                <span>Shipping</span>
                <span className="font-bold">{order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice}`}</span>
              </div>
              <div className="flex justify-between text-fittree-text font-medium text-[15px]">
                <span>Tax</span>
                <span className="font-bold">₹{order.taxPrice}</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <span className="text-[14px] text-fittree-text-light font-bold uppercase tracking-widest">Total</span>
              <div className="text-right">
                <span className="text-3xl font-bold text-fittree-text leading-none">₹{order.totalPrice}</span>
              </div>
            </div>

            {!order.isPaid && order.paymentMethod !== 'CashOnDelivery' && (
              <button 
                onClick={handlePayment} 
                disabled={paymentLoading}
                className="btn btn-primary w-full py-4 text-[15px] flex justify-center items-center gap-2 font-bold disabled:opacity-50"
              >
                {paymentLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                     <ShieldCheck size={18} strokeWidth={2.5} /> Pay with Razorpay
                  </>
                )}
              </button>
            )}

            {userInfo && userInfo.isAdmin && order.isPaid && !order.isShipped && (
              <button 
                onClick={shipOrderHandler} 
                className="w-full mt-4 bg-fittree-accent text-white py-4 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 hover:bg-amber-500 transition-colors"
              >
                <Package size={18} strokeWidth={2.5} /> Mark As Shipped
              </button>
            )}

            {userInfo && userInfo.isAdmin && order.isShipped && !order.isDelivered && (
              <button 
                onClick={deliverOrderHandler} 
                className="w-full mt-4 bg-green-600 text-white py-4 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
              >
                <Truck size={18} strokeWidth={2.5} /> Mark As Delivered
              </button>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default OrderPage;
