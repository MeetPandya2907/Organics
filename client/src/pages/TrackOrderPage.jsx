import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, PackageCheck, Truck, CheckCircle2, XCircle, Clock, Package } from 'lucide-react';
import Meta from '../components/Meta';

const STEPS = [
  { key: 'isPaid', label: 'Order Confirmed', icon: PackageCheck },
  { key: 'isShipped', label: 'Shipped', icon: Truck },
  { key: 'isDelivered', label: 'Delivered', icon: CheckCircle2 },
];

const TrackOrderPage = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const { data } = await axios.get(`/api/orders/track/${orderNumber.trim()}`, {
        params: { email: email.trim() },
      });
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || "We couldn't find an order with that number and email combination.");
    } finally {
      setLoading(false);
    }
  };

  const activeStepIndex = order
    ? order.isCancelled
      ? -1
      : STEPS.reduce((acc, s, i) => (order[s.key] ? i : acc), -1)
    : -1;

  return (
    <div className="bg-fittree-bg min-h-screen font-sans pb-24 pt-[130px]">
      <Meta title="FitTree Organics | Track Your Order" />

      <div className="max-w-[640px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="eyebrow">Where's my order?</span>
          <h1 className="mt-2 text-[28px] md:text-[34px] font-extrabold text-fittree-text">Track Your Order</h1>
          <p className="text-fittree-text-light text-[15px] mt-2 font-medium">Enter your Order Number and the email used at checkout.</p>
        </div>

        <form onSubmit={submitHandler} className="bg-white rounded-[2rem] border border-fittree-border shadow-sm p-8 mb-8 space-y-5">
          <div>
            <label className="form-label">Order Number</label>
            <input
              type="text"
              inputMode="numeric"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. 100234"
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="form-input"
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-60">
            <Search size={17} /> {loading ? 'Searching…' : 'Track Order'}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-5 rounded-2xl font-medium text-[14px] text-center mb-8">
            {error}
          </div>
        )}

        {order && (
          <div className="bg-white rounded-[2rem] border border-fittree-border shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-fittree-text-light">Order</span>
                <h3 className="font-mono text-[15px] font-bold text-fittree-text">#{order.orderNumber}</h3>
              </div>
              <span className="text-[13px] font-semibold text-fittree-text-light">
                Placed {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>

            {order.isCancelled ? (
              <div className="flex items-center gap-3 bg-red-50 text-red-600 p-5 rounded-2xl font-bold">
                <XCircle size={22} /> This order was cancelled
              </div>
            ) : (
              <div className="flex items-center justify-between mb-8">
                {STEPS.map((step, i) => {
                  const reached = i <= activeStepIndex;
                  return (
                    <div key={step.key} className="flex-1 flex flex-col items-center text-center relative">
                      {i > 0 && (
                        <div className={`absolute top-5 right-1/2 w-full h-0.5 ${i <= activeStepIndex ? 'bg-fittree-primary' : 'bg-fittree-border'}`} style={{ zIndex: 0 }} />
                      )}
                      <span className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center mb-2 ${reached ? 'bg-fittree-primary text-white' : 'bg-fittree-sand text-fittree-text-light'}`}>
                        <step.icon size={18} />
                      </span>
                      <span className={`text-[12px] font-bold ${reached ? 'text-fittree-text' : 'text-fittree-text-light'}`}>{step.label}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="border-t border-fittree-border pt-6 space-y-3">
              <div className="flex items-center gap-3 text-fittree-text">
                <Package size={16} className="text-fittree-text-light shrink-0" />
                <span className="font-semibold text-[14px]">{order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''} &middot; ₹{order.totalPrice}</span>
              </div>
              <div className="flex items-center gap-3 text-fittree-text-light">
                <Clock size={16} className="shrink-0" />
                <span className="text-[13px] font-medium">
                  {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : order.isShipped ? 'On its way to you' : order.isPaid ? 'Preparing your order' : 'Awaiting payment confirmation'}
                </span>
              </div>
            </div>

            <Link to={`/order/${order._id}?email=${encodeURIComponent(email.trim())}`} className="btn btn-outline w-full py-3.5 mt-8 flex items-center justify-center">
              View Full Order Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;
