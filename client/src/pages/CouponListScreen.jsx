import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { AlertCircle, Trash2, Plus, X, Tag, Power } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../components/AdminLayout';

const emptyForm = {
  code: '',
  discountType: 'PERCENT',
  discountValue: '',
  minOrderValue: '',
  maxDiscountAmount: '',
  usageLimit: '',
  expiresAt: '',
};

const CouponListScreen = () => {
  const { userInfo } = useStore();
  const navigate = useNavigate();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const authConfig = () => ({ headers: { Authorization: `Bearer ${userInfo.token}` } });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/coupons', authConfig());
      setCoupons(data);
      setLoading(false);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchCoupons();
    } else {
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!form.code.trim() || !form.discountValue) {
      toast.error('Coupon code and discount value are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        code: form.code,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : 0,
        maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        expiresAt: form.expiresAt || undefined,
      };
      const { data } = await axios.post('/api/coupons', payload, authConfig());
      setCoupons((prev) => [data, ...prev]);
      toast.success('Coupon created');
      setForm(emptyForm);
      setShowForm(false);
    } catch (err) {
      toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (coupon) => {
    setCoupons((prev) => prev.map((c) => (c._id === coupon._id ? { ...c, isActive: !c.isActive } : c)));
    try {
      await axios.put(`/api/coupons/${coupon._id}`, { isActive: !coupon.isActive }, authConfig());
      toast.success(coupon.isActive ? 'Coupon deactivated' : 'Coupon activated');
    } catch (err) {
      setCoupons((prev) => prev.map((c) => (c._id === coupon._id ? { ...c, isActive: coupon.isActive } : c)));
      toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await axios.delete(`/api/coupons/${deleteConfirmId}`, authConfig());
      setCoupons((prev) => prev.filter((c) => c._id !== deleteConfirmId));
      toast.success('Coupon deleted');
      setDeleteConfirmId(null);
    } catch (err) {
      toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
      setDeleteConfirmId(null);
    }
  };

  const isExpired = (c) => c.expiresAt && new Date(c.expiresAt) < new Date();

  return (
    <AdminLayout
      title="Manage Coupons"
      actions={
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-fittree-primary text-white font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all text-[13.5px]">
          <Plus size={16} /> New Coupon
        </button>
      }
    >
      <div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-fittree-border">
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fittree-primary"></div></div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl flex items-center gap-3"><AlertCircle /> {error}</div>
        ) : coupons.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-fittree-light text-fittree-primary flex items-center justify-center mx-auto mb-5"><Tag size={28} /></div>
            <h3 className="text-xl font-bold text-fittree-text mb-2">No coupons yet</h3>
            <p className="text-fittree-text-light font-medium mb-6">Create your first discount code — like the "10% off prepaid" offer already promised on the site.</p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary">Create a Coupon</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-fittree-border">
                  <th className="py-4 px-4 text-fittree-text-light font-bold text-[11.5px] uppercase tracking-wider">Code</th>
                  <th className="py-4 px-4 text-fittree-text-light font-bold text-[11.5px] uppercase tracking-wider">Discount</th>
                  <th className="py-4 px-4 text-fittree-text-light font-bold text-[11.5px] uppercase tracking-wider">Min Order</th>
                  <th className="py-4 px-4 text-fittree-text-light font-bold text-[11.5px] uppercase tracking-wider">Usage</th>
                  <th className="py-4 px-4 text-fittree-text-light font-bold text-[11.5px] uppercase tracking-wider">Expires</th>
                  <th className="py-4 px-4 text-fittree-text-light font-bold text-[11.5px] uppercase tracking-wider text-center">Status</th>
                  <th className="py-4 px-4 text-fittree-text-light font-bold text-[11.5px] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fittree-border">
                {coupons.map((c) => (
                  <tr key={c._id} className="hover:bg-fittree-bg transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-fittree-text bg-fittree-sand px-2.5 py-1 rounded-md text-[13px]">{c.code}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-fittree-primary text-[13.5px]">
                      {c.discountType === 'PERCENT' ? `${c.discountValue}% off` : `₹${c.discountValue} off`}
                      {c.maxDiscountAmount ? <span className="text-fittree-text-light font-medium"> (up to ₹{c.maxDiscountAmount})</span> : ''}
                    </td>
                    <td className="py-3 px-4 text-[13px] text-fittree-text-light">{c.minOrderValue ? `₹${c.minOrderValue}+` : 'None'}</td>
                    <td className="py-3 px-4 text-[13px] text-fittree-text-light">{c.usedCount || 0}{c.usageLimit ? ` / ${c.usageLimit}` : ' / ∞'}</td>
                    <td className="py-3 px-4 text-[13px] text-fittree-text-light">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'Never'}</td>
                    <td className="py-3 px-4 text-center">
                      {isExpired(c) ? (
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-[11px] font-bold uppercase">Expired</span>
                      ) : c.isActive ? (
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-[11px] font-bold uppercase">Active</span>
                      ) : (
                        <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-[11px] font-bold uppercase">Inactive</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => toggleActive(c)} className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors" title={c.isActive ? 'Deactivate' : 'Activate'}>
                          <Power size={15} />
                        </button>
                        <button onClick={() => setDeleteConfirmId(c._id)} className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors" title="Delete Coupon">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Coupon Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-[480px] bg-white rounded-3xl p-8 shadow-2xl z-50 max-h-[88vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-fittree-text">New Coupon</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-fittree-text transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={submitHandler} className="space-y-4">
                <div>
                  <label className="form-label">Coupon Code</label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="WELCOME10"
                    className="form-input"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Type</label>
                    <select
                      value={form.discountType}
                      onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                      className="form-input"
                    >
                      <option value="PERCENT">Percent Off</option>
                      <option value="FLAT">Flat Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">{form.discountType === 'PERCENT' ? 'Percent (%)' : 'Amount (₹)'}</label>
                    <input
                      type="number"
                      min="0"
                      value={form.discountValue}
                      onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                      onWheel={(e) => e.target.blur()}
                      placeholder={form.discountType === 'PERCENT' ? '10' : '100'}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Min Order (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={form.minOrderValue}
                      onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
                      onWheel={(e) => e.target.blur()}
                      placeholder="Optional"
                      className="form-input"
                    />
                  </div>
                  {form.discountType === 'PERCENT' && (
                    <div>
                      <label className="form-label">Max Discount (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={form.maxDiscountAmount}
                        onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })}
                        onWheel={(e) => e.target.blur()}
                        placeholder="Optional cap"
                        className="form-input"
                      />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Usage Limit</label>
                    <input
                      type="number"
                      min="0"
                      value={form.usageLimit}
                      onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                      onWheel={(e) => e.target.blur()}
                      placeholder="Unlimited"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Expires On</label>
                    <input
                      type="date"
                      value={form.expiresAt}
                      onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <button type="submit" disabled={saving} className="btn btn-primary w-full py-3.5 mt-2 flex justify-center">
                  {saving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Create Coupon'}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirmId && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[400px] bg-white rounded-3xl p-8 shadow-2xl z-50 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500"><Trash2 size={24} /></div>
                <button onClick={() => setDeleteConfirmId(null)} className="text-gray-400 hover:text-fittree-text transition-colors"><X size={24} /></button>
              </div>
              <h3 className="text-2xl font-bold text-fittree-text mb-2">Delete Coupon?</h3>
              <p className="text-fittree-text-light mb-8 font-medium">Customers will no longer be able to redeem this code.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3 px-4 rounded-xl font-bold text-fittree-text bg-fittree-sand hover:bg-fittree-border transition-colors">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all hover:-translate-y-0.5">Delete</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default CouponListScreen;
