import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Package, ShoppingBag, Users, DollarSign, AlertCircle, Tag, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import AdminLayout from '../components/AdminLayout';

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
    <AdminLayout
      title="Store Analytics"
      actions={
        <>
          <Link to="/admin/orders" className="bg-white border border-fittree-border hover:border-fittree-primary text-fittree-text font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all text-[13.5px]">Manage Orders</Link>
          <Link to="/admin/products" className="bg-white border border-fittree-border hover:border-fittree-primary text-fittree-text font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all text-[13.5px]">Manage Products</Link>
          <Link to="/admin/coupons" className="flex items-center gap-2 bg-fittree-primary text-white font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all text-[13.5px]"><Tag size={15} /> Coupons</Link>
        </>
      }
    >
      <div className="relative z-10">
        {loading ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-fittree-border flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fittree-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-fittree-border">
            <div className="bg-red-50 text-red-600 p-6 rounded-xl flex items-center gap-3"><AlertCircle /> {error}</div>
          </div>
        ) : summary && (
          <div className="space-y-8">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-fittree-border flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                  <DollarSign size={24} />
                </div>
                <div>
                  <p className="text-sm text-fittree-text-light font-medium mb-1">Total Revenue</p>
                  <h3 className="text-2xl font-bold text-fittree-text">₹{summary.totalSales.toFixed(2)}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-fittree-border flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <p className="text-sm text-fittree-text-light font-medium mb-1">Total Orders</p>
                  <h3 className="text-2xl font-bold text-fittree-text">{summary.totalOrders}</h3>
                  {summary.pendingOrders > 0 && <p className="text-xs text-amber-500 font-bold mt-1">{summary.pendingOrders} Pending</p>}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-fittree-border flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-sm text-fittree-text-light font-medium mb-1">Total Customers</p>
                  <h3 className="text-2xl font-bold text-fittree-text">{summary.totalUsers}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-fittree-border flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                  <Package size={24} />
                </div>
                <div>
                  <p className="text-sm text-fittree-text-light font-medium mb-1">Low Stock Alerts</p>
                  <h3 className="text-2xl font-bold text-fittree-text">{summary.lowStockItems} Items</h3>
                  <Link to="/admin/products" className="text-xs text-fittree-primary font-bold hover:underline mt-1 block">View Inventory</Link>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Line Chart: Sales over time */}
              <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-fittree-border">
                <h3 className="text-xl font-bold text-fittree-text mb-6 border-b border-fittree-border pb-4">Revenue Trend</h3>
                {summary.salesByDate.length === 0 ? (
                  <div className="h-[300px] flex items-center justify-center text-fittree-text-light">No sales data yet</div>
                ) : (
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={summary.salesByDate} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <Line type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                        <CartesianGrid stroke="#f1f5f9" strokeDasharray="5 5" vertical={false} />
                        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          formatter={(value) => [`₹${value}`, 'Revenue']}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Pie Chart: Sales by Category */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-fittree-border">
                <h3 className="text-xl font-bold text-fittree-text mb-6 border-b border-fittree-border pb-4">Sales by Category</h3>
                {summary.salesByCategory.length === 0 ? (
                  <div className="h-[300px] flex items-center justify-center text-fittree-text-light">No category data yet</div>
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
                        <RechartsTooltip formatter={(value) => `₹${value}`} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

            </div>

            {/* Top Sellers + Low Stock */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-fittree-border">
                <h3 className="text-xl font-bold text-fittree-text mb-6 border-b border-fittree-border pb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-fittree-primary" /> Top Selling Products
                </h3>
                {summary.topSellingProducts.length === 0 ? (
                  <div className="py-10 text-center text-fittree-text-light">No paid orders yet</div>
                ) : (
                  <div className="space-y-3">
                    {summary.topSellingProducts.map((p, i) => (
                      <div key={p._id} className="flex items-center gap-4">
                        <span className="w-6 text-center font-bold text-fittree-text-light text-[13px]">{i + 1}</span>
                        <div className="w-11 h-11 rounded-lg bg-fittree-bg overflow-hidden shrink-0 border border-fittree-border">
                          {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[14px] text-fittree-text truncate">{p.name}</p>
                          <p className="text-[12px] text-fittree-text-light font-medium">{p.qtySold} units sold</p>
                        </div>
                        <span className="font-bold text-[14px] text-fittree-text shrink-0">₹{p.revenue.toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-fittree-border">
                <h3 className="text-xl font-bold text-fittree-text mb-6 border-b border-fittree-border pb-4 flex items-center gap-2">
                  <AlertCircle size={20} className="text-red-500" /> Low Stock Alerts
                </h3>
                {summary.lowStockProducts.length === 0 ? (
                  <div className="py-10 text-center text-fittree-text-light">All products well-stocked</div>
                ) : (
                  <div className="space-y-3">
                    {summary.lowStockProducts.map((p) => (
                      <Link key={p._id} to={`/admin/product/${p._id}/edit`} className="flex items-center gap-4 hover:bg-fittree-bg -mx-2 px-2 py-1 rounded-lg transition-colors">
                        <div className="w-11 h-11 rounded-lg bg-fittree-bg overflow-hidden shrink-0 border border-fittree-border">
                          {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[14px] text-fittree-text truncate">{p.name}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider shrink-0 ${p.countInStock === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                          {p.countInStock === 0 ? 'Out of stock' : `${p.countInStock} left`}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-fittree-border">
              <div className="flex justify-between items-center mb-6 border-b border-fittree-border pb-4">
                <h3 className="text-xl font-bold text-fittree-text">Recent Orders</h3>
                <Link to="/admin/orders" className="text-sm text-fittree-primary font-bold hover:underline">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-fittree-border bg-fittree-bg">
                      <th className="py-4 px-4 text-fittree-text-light font-bold text-[12px] uppercase tracking-wider rounded-tl-lg">ID</th>
                      <th className="py-4 px-4 text-fittree-text-light font-bold text-[12px] uppercase tracking-wider">USER</th>
                      <th className="py-4 px-4 text-fittree-text-light font-bold text-[12px] uppercase tracking-wider">DATE</th>
                      <th className="py-4 px-4 text-fittree-text-light font-bold text-[12px] uppercase tracking-wider">TOTAL</th>
                      <th className="py-4 px-4 text-fittree-text-light font-bold text-[12px] uppercase tracking-wider">PAID</th>
                      <th className="py-4 px-4 text-fittree-text-light font-bold text-[12px] uppercase tracking-wider rounded-tr-lg">DELIVERED</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-fittree-border">
                    {summary.recentOrders.length === 0 && (
                      <tr><td colSpan="6" className="py-8 text-center text-fittree-text-light font-medium">No recent orders</td></tr>
                    )}
                    {summary.recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-fittree-bg transition-colors">
                        <td className="py-4 px-4 font-mono text-[13px] text-fittree-text-light">#{order.orderNumber ?? order._id.substring(0, 8)}</td>
                        <td className="py-4 px-4 font-medium text-fittree-text">{order.user && order.user.name}</td>
                        <td className="py-4 px-4 text-[14px] font-medium text-fittree-text-light">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 px-4 font-bold text-fittree-text">₹{order.totalPrice}</td>
                        <td className="py-4 px-4">
                          {order.isPaid ? (
                            <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded text-[11px] font-bold uppercase tracking-wider">Paid</span>
                          ) : (
                            <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded text-[11px] font-bold uppercase tracking-wider">Unpaid</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {order.isDelivered ? (
                            <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded text-[11px] font-bold uppercase tracking-wider">Yes</span>
                          ) : (
                            <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded text-[11px] font-bold uppercase tracking-wider">No</span>
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
    </AdminLayout>
  );
};

export default AdminDashboard;
