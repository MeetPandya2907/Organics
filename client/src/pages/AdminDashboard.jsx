import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Package, ShoppingBag, Users, DollarSign, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const AdminDashboard = () => {
  const { userInfo } = useStore();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/admin/login');
      return;
    }

    const fetchSummary = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/summary', config);
        setSummary(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchSummary();
  }, [userInfo, navigate]);

  const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6'];

  return (
    <div className="bg-paper min-h-screen pb-24">
      <div className="bg-forest pt-32 pb-24 px-6 rounded-b-[3rem] shadow-2xl shadow-black/5 mb-[-80px]">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <h1 className="text-4xl text-white">Store Analytics</h1>
          <div className="flex gap-4">
            <Link to="/admin/orders" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors">Manage Orders</Link>
            <Link to="/admin/products" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors">Manage Products</Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        {loading ? (
          <div className="bg-white p-12 rounded-[2rem] shadow-glass flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-leaf"></div>
          </div>
        ) : error ? (
          <div className="bg-white p-12 rounded-[2rem] shadow-glass">
            <div className="bg-red-50 text-red-600 p-6 rounded-xl flex items-center gap-3"><AlertCircle /> {error}</div>
          </div>
        ) : summary && (
          <div className="space-y-8">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                  <DollarSign size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Total Revenue</p>
                  <h3 className="text-2xl font-bold text-ink">₹{summary.totalSales.toFixed(2)}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Total Orders</p>
                  <h3 className="text-2xl font-bold text-ink">{summary.totalOrders}</h3>
                  {summary.pendingOrders > 0 && <p className="text-xs text-orange-500 mt-1">{summary.pendingOrders} Pending</p>}
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Total Customers</p>
                  <h3 className="text-2xl font-bold text-ink">{summary.totalUsers}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                  <Package size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Low Stock Alerts</p>
                  <h3 className="text-2xl font-bold text-ink">{summary.lowStockItems} Items</h3>
                  <Link to="/admin/products" className="text-xs text-red-500 hover:underline mt-1 block">View Inventory</Link>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Line Chart: Sales over time */}
              <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-display text-forest mb-6">Revenue Trend</h3>
                {summary.salesByDate.length === 0 ? (
                  <div className="h-[300px] flex items-center justify-center text-gray-400">No sales data yet</div>
                ) : (
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={summary.salesByDate} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <Line type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} />
                        <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          formatter={(value) => [`₹${value}`, 'Revenue']}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Pie Chart: Sales by Category */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-display text-forest mb-6">Sales by Category</h3>
                {summary.salesByCategory.length === 0 ? (
                  <div className="h-[300px] flex items-center justify-center text-gray-400">No category data yet</div>
                ) : (
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={summary.salesByCategory}
                          cx="50%"
                          cy="45%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {summary.salesByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value) => `₹${value}`} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

            </div>

            {/* Recent Orders Table */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-display text-forest">Recent Orders</h3>
                <Link to="/admin/orders" className="text-sm text-leaf font-medium hover:underline">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="py-4 px-4 text-gray-500 font-medium text-sm">ID</th>
                      <th className="py-4 px-4 text-gray-500 font-medium text-sm">USER</th>
                      <th className="py-4 px-4 text-gray-500 font-medium text-sm">DATE</th>
                      <th className="py-4 px-4 text-gray-500 font-medium text-sm">TOTAL</th>
                      <th className="py-4 px-4 text-gray-500 font-medium text-sm">PAID</th>
                      <th className="py-4 px-4 text-gray-500 font-medium text-sm">DELIVERED</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {summary.recentOrders.length === 0 && (
                      <tr><td colSpan="6" className="py-8 text-center text-gray-500">No recent orders</td></tr>
                    )}
                    {summary.recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 font-mono text-sm text-gray-400">{order._id.substring(0, 8)}</td>
                        <td className="py-4 px-4 font-medium text-ink">{order.user && order.user.name}</td>
                        <td className="py-4 px-4 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 px-4 font-bold text-forest">₹{order.totalPrice}</td>
                        <td className="py-4 px-4">
                          {order.isPaid ? (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Paid</span>
                          ) : (
                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Unpaid</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {order.isDelivered ? (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Yes</span>
                          ) : (
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">No</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
