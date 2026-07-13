import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

import toast from 'react-hot-toast';

const OrderListScreen = () => {
  const { userInfo } = useStore();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const deliverOrderHandler = async (id) => {
    // Optimistic update
    setOrders(prev => prev.map(o => o._id === id ? { ...o, isDelivered: true, deliveredAt: new Date().toISOString() } : o));
    
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`/api/orders/${id}/deliver`, {}, config);
      toast.success('Order marked as delivered');
    } catch (err) {
      // Revert optimistic update
      setOrders(prev => prev.map(o => o._id === id ? { ...o, isDelivered: false, deliveredAt: null } : o));
      toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
    }
  };

  const shipOrderHandler = async (id) => {
    // Optimistic update
    setOrders(prev => prev.map(o => o._id === id ? { ...o, isShipped: true, shippedAt: new Date().toISOString() } : o));
    
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`/api/orders/${id}/ship`, {}, config);
      toast.success('Order marked as shipped');
    } catch (err) {
      // Revert optimistic update
      setOrders(prev => prev.map(o => o._id === id ? { ...o, isShipped: false, shippedAt: null } : o));
      toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/orders', config);
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    if (userInfo && userInfo.isAdmin) {
      fetchOrders();
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  return (
    <div className="bg-paper min-h-screen pb-24">
      <div className="bg-forest pt-32 pb-24 px-6 rounded-b-[3rem] shadow-soft mb-[-80px]">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-4xl text-white">Manage Orders</h1>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-glass border border-gray-100">
          {loading ? (
             <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-leaf"></div></div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-xl flex items-center gap-3"><AlertCircle /> {error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-4 px-4 text-text-muted font-medium">ID</th>
                    <th className="py-4 px-4 text-text-muted font-medium">USER</th>
                    <th className="py-4 px-4 text-text-muted font-medium">DATE</th>
                    <th className="py-4 px-4 text-text-muted font-medium">TOTAL</th>
                    <th className="py-4 px-4 text-text-muted font-medium text-center">PAID</th>
                    <th className="py-4 px-4 text-text-muted font-medium text-center">SHIPPED</th>
                    <th className="py-4 px-4 text-text-muted font-medium text-center">DELIVERED</th>
                    <th className="py-4 px-4 text-text-muted font-medium text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-mono text-sm text-gray-500">{order._id.substring(0, 8)}...</td>
                      <td className="py-4 px-4 font-medium text-ink">{order.user && order.user.name}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-4 text-forest font-semibold">₹{order.totalPrice}</td>
                      <td className="py-4 px-4 text-center">
                        {order.isPaid ? (
                          <div className="w-8 h-8 mx-auto bg-green-50 text-green-500 rounded-full flex items-center justify-center"><CheckCircle size={16} /></div>
                        ) : (
                          <div className="w-8 h-8 mx-auto bg-red-50 text-red-500 rounded-full flex items-center justify-center"><XCircle size={16} /></div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {order.isShipped ? (
                          <div className="w-8 h-8 mx-auto bg-green-50 text-green-500 rounded-full flex items-center justify-center"><CheckCircle size={16} /></div>
                        ) : (
                          <div className="w-8 h-8 mx-auto bg-amber-50 text-amber-500 rounded-full flex items-center justify-center"><XCircle size={16} /></div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {order.isDelivered ? (
                          <div className="w-8 h-8 mx-auto bg-green-50 text-green-500 rounded-full flex items-center justify-center"><CheckCircle size={16} /></div>
                        ) : (
                          <div className="w-8 h-8 mx-auto bg-amber-50 text-amber-500 rounded-full flex items-center justify-center"><XCircle size={16} /></div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-3 items-center">
                          {!order.isShipped ? (
                            <button onClick={() => shipOrderHandler(order._id)} className="text-xs bg-turmeric text-ink font-bold px-3 py-1.5 rounded-full hover:bg-turmeric-light transition-colors">
                              Mark Shipped
                            </button>
                          ) : !order.isDelivered ? (
                            <button onClick={() => deliverOrderHandler(order._id)} className="text-xs bg-leaf text-white font-bold px-3 py-1.5 rounded-full hover:bg-forest transition-colors">
                              Mark Delivered
                            </button>
                          ) : null}
                          <Link to={`/order/${order._id}`} className="inline-flex items-center gap-1 bg-paper hover:bg-gray-200 text-forest px-4 py-2 rounded-full text-sm font-medium transition-colors">
                            Details
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderListScreen;
