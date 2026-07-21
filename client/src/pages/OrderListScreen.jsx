import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { AlertCircle, CheckCircle, XCircle, Search, Download } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';
import { exportCsv } from '../utils/exportCsv';

const STATUS_TABS = [
  { key: 'all', label: 'All Orders' },
  { key: 'unpaid', label: 'Unpaid' },
  { key: 'unshipped', label: 'Not Shipped' },
  { key: 'undelivered', label: 'Not Delivered' },
  { key: 'completed', label: 'Completed' },
];

const OrderListScreen = () => {
  const { userInfo } = useStore();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState('all');

  const deliverOrderHandler = async (id) => {
    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, isDelivered: true, deliveredAt: new Date().toISOString() } : o)));
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`/api/orders/${id}/deliver`, {}, config);
      toast.success('Order marked as delivered');
    } catch (err) {
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, isDelivered: false, deliveredAt: null } : o)));
      toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
    }
  };

  const shipOrderHandler = async (id) => {
    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, isShipped: true, shippedAt: new Date().toISOString() } : o)));
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`/api/orders/${id}/ship`, {}, config);
      toast.success('Order marked as shipped');
    } catch (err) {
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, isShipped: false, shippedAt: null } : o)));
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

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (search) {
        const q = search.toLowerCase();
        const matchesId = o._id.toLowerCase().includes(q);
        const matchesName = (o.user?.name || '').toLowerCase().includes(q);
        if (!matchesId && !matchesName) return false;
      }
      if (statusTab === 'unpaid') return !o.isPaid;
      if (statusTab === 'unshipped') return !o.isShipped;
      if (statusTab === 'undelivered') return !o.isDelivered;
      if (statusTab === 'completed') return o.isPaid && o.isShipped && o.isDelivered;
      return true;
    });
  }, [orders, search, statusTab]);

  const counts = useMemo(() => ({
    all: orders.length,
    unpaid: orders.filter((o) => !o.isPaid).length,
    unshipped: orders.filter((o) => !o.isShipped).length,
    undelivered: orders.filter((o) => !o.isDelivered).length,
    completed: orders.filter((o) => o.isPaid && o.isShipped && o.isDelivered).length,
  }), [orders]);

  const handleExport = () => {
    exportCsv(`orders-${Date.now()}.csv`, filtered, [
      { label: 'Order ID', get: (o) => o._id },
      { label: 'Customer', get: (o) => o.user?.name || '' },
      { label: 'Date', get: (o) => new Date(o.createdAt).toLocaleDateString() },
      { label: 'Total', get: (o) => o.totalPrice },
      { label: 'Paid', get: (o) => (o.isPaid ? 'Yes' : 'No') },
      { label: 'Shipped', get: (o) => (o.isShipped ? 'Yes' : 'No') },
      { label: 'Delivered', get: (o) => (o.isDelivered ? 'Yes' : 'No') },
    ]);
  };

  return (
    <AdminLayout
      title="Manage Orders"
      actions={
        <button onClick={handleExport} className="flex items-center gap-2 bg-white border border-fittree-border hover:border-fittree-primary text-fittree-text font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all text-[13.5px]">
          <Download size={16} /> Export CSV
        </button>
      }
    >
      <div className="bg-white p-4 rounded-2xl border border-fittree-border shadow-sm mb-5 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fittree-text-light" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or customer name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-fittree-border bg-fittree-bg focus:outline-none focus:border-fittree-primary text-[13.5px] text-fittree-text"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 hide-scrollbar">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusTab(tab.key)}
            className={`shrink-0 px-4 py-2 rounded-xl text-[12.5px] font-bold transition-colors ${
              statusTab === tab.key
                ? 'bg-fittree-primary text-white shadow-sm'
                : 'bg-white border border-fittree-border text-fittree-text-light hover:text-fittree-text'
            }`}
          >
            {tab.label} <span className="opacity-70">({counts[tab.key]})</span>
          </button>
        ))}
      </div>

      <div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-fittree-border">
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fittree-primary"></div></div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl flex items-center gap-3"><AlertCircle /> {error}</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-fittree-text-light font-medium">No orders match your filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-fittree-border">
                  <th className="py-4 px-4 text-fittree-text-light font-bold text-[11.5px] uppercase tracking-wider">ID</th>
                  <th className="py-4 px-4 text-fittree-text-light font-bold text-[11.5px] uppercase tracking-wider">User</th>
                  <th className="py-4 px-4 text-fittree-text-light font-bold text-[11.5px] uppercase tracking-wider">Date</th>
                  <th className="py-4 px-4 text-fittree-text-light font-bold text-[11.5px] uppercase tracking-wider">Total</th>
                  <th className="py-4 px-4 text-fittree-text-light font-bold text-[11.5px] uppercase tracking-wider text-center">Paid</th>
                  <th className="py-4 px-4 text-fittree-text-light font-bold text-[11.5px] uppercase tracking-wider text-center">Shipped</th>
                  <th className="py-4 px-4 text-fittree-text-light font-bold text-[11.5px] uppercase tracking-wider text-center">Delivered</th>
                  <th className="py-4 px-4 text-fittree-text-light font-bold text-[11.5px] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fittree-border">
                {filtered.map((order) => (
                  <tr key={order._id} className="hover:bg-fittree-bg transition-colors">
                    <td className="py-3 px-4 font-mono text-[12px] text-fittree-text-light">{order._id.substring(0, 8)}...</td>
                    <td className="py-3 px-4 font-medium text-fittree-text text-[13.5px]">{order.user && order.user.name}</td>
                    <td className="py-3 px-4 text-[13px] text-fittree-text-light">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-fittree-primary font-semibold text-[13.5px]">₹{order.totalPrice}</td>
                    <td className="py-3 px-4 text-center">
                      {order.isPaid ? (
                        <div className="w-8 h-8 mx-auto bg-green-50 text-green-500 rounded-full flex items-center justify-center"><CheckCircle size={16} /></div>
                      ) : (
                        <div className="w-8 h-8 mx-auto bg-red-50 text-red-500 rounded-full flex items-center justify-center"><XCircle size={16} /></div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {order.isShipped ? (
                        <div className="w-8 h-8 mx-auto bg-green-50 text-green-500 rounded-full flex items-center justify-center"><CheckCircle size={16} /></div>
                      ) : (
                        <div className="w-8 h-8 mx-auto bg-amber-50 text-amber-500 rounded-full flex items-center justify-center"><XCircle size={16} /></div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {order.isDelivered ? (
                        <div className="w-8 h-8 mx-auto bg-green-50 text-green-500 rounded-full flex items-center justify-center"><CheckCircle size={16} /></div>
                      ) : (
                        <div className="w-8 h-8 mx-auto bg-amber-50 text-amber-500 rounded-full flex items-center justify-center"><XCircle size={16} /></div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2 items-center">
                        {!order.isShipped ? (
                          <button onClick={() => shipOrderHandler(order._id)} className="text-[11.5px] bg-fittree-accent text-white font-bold px-3 py-1.5 rounded-full hover:bg-fittree-accent-dark transition-colors whitespace-nowrap">
                            Mark Shipped
                          </button>
                        ) : !order.isDelivered ? (
                          <button onClick={() => deliverOrderHandler(order._id)} className="text-[11.5px] bg-fittree-primary text-white font-bold px-3 py-1.5 rounded-full hover:bg-fittree-primary-soft transition-colors whitespace-nowrap">
                            Mark Delivered
                          </button>
                        ) : null}
                        <Link to={`/order/${order._id}`} className="inline-flex items-center gap-1 bg-fittree-sand hover:bg-fittree-border text-fittree-text px-3 py-1.5 rounded-full text-[11.5px] font-bold transition-colors whitespace-nowrap">
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
        <div className="mt-4 text-[12.5px] text-fittree-text-light font-medium">{filtered.length} of {orders.length} orders</div>
      </div>
    </AdminLayout>
  );
};

export default OrderListScreen;
