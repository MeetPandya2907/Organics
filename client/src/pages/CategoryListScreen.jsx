import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { AlertCircle, Trash2, Plus, X, List } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../components/AdminLayout';

const CategoryListScreen = () => {
  const { userInfo } = useStore();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const authConfig = () => ({ headers: { Authorization: `Bearer ${userInfo.token}` } });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/categories');
      setCategories(data);
      setLoading(false);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchCategories();
    } else {
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }
    setSaving(true);
    try {
      const { data } = await axios.post('/api/categories', { name: newCategoryName }, authConfig());
      setCategories((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      toast.success('Category created');
      setNewCategoryName('');
      setShowForm(false);
    } catch (err) {
      toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await axios.delete(`/api/categories/${deleteConfirmId}`, authConfig());
      setCategories((prev) => prev.filter((c) => c._id !== deleteConfirmId));
      toast.success('Category deleted');
      setDeleteConfirmId(null);
    } catch (err) {
      toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
      setDeleteConfirmId(null);
    }
  };

  const actions = (
    <button onClick={() => setShowForm(true)} className="btn btn-primary flex items-center gap-2">
      <Plus size={18} /> New Category
    </button>
  );

  return (
    <AdminLayout title="Categories" actions={actions}>
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fittree-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-xl flex items-center gap-3 border border-red-100">
          <AlertCircle size={22} /> {error}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-fittree-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-fittree-bg border-b border-fittree-border">
                  <th className="py-4 px-6 text-fittree-text-light font-bold text-[11.5px] uppercase tracking-wider">Name</th>
                  <th className="py-4 px-6 text-fittree-text-light font-bold text-[11.5px] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fittree-border">
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-fittree-bg/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-fittree-sand flex items-center justify-center text-fittree-primary">
                          <List size={14} />
                        </div>
                        <span className="font-bold text-fittree-text text-[14px]">{category.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setDeleteConfirmId(category._id)}
                        className="p-2 text-fittree-text-light hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={2} className="py-12 text-center text-fittree-text-light">
                      No categories found. Click "New Category" to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NEW CATEGORY MODAL */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-45%" }} animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }} exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-45%" }}
              className="fixed top-1/2 left-1/2 w-[92%] max-w-[400px] bg-white rounded-3xl p-8 shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-fittree-text">New Category</h3>
                <button onClick={() => setShowForm(false)} className="text-fittree-text-light hover:text-fittree-text bg-fittree-bg hover:bg-fittree-border p-2 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={submitHandler} className="space-y-4">
                <div className="form-group">
                  <label className="form-label font-bold text-[12px] uppercase tracking-wider text-fittree-text block mb-2">Category Name</label>
                  <input
                    type="text"
                    required
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="form-input !rounded-xl"
                    placeholder="e.g. SPICES"
                  />
                </div>
                <div className="pt-2">
                  <button type="submit" disabled={saving} className="w-full btn btn-primary py-3.5">
                    {saving ? 'Creating...' : 'Create Category'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM MODAL */}
      <AnimatePresence>
        {deleteConfirmId && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-45%" }} animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }} exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-45%" }}
              className="fixed top-1/2 left-1/2 w-[90%] max-w-[400px] bg-white rounded-3xl p-8 shadow-2xl z-50 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                  <AlertCircle size={24} />
                </div>
                <button onClick={() => setDeleteConfirmId(null)} className="text-fittree-text-light hover:text-fittree-text bg-fittree-bg hover:bg-fittree-border p-2 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <h3 className="text-xl font-bold text-fittree-text mb-2">Delete Category?</h3>
              <p className="text-fittree-text-light text-[15px] leading-relaxed mb-8">
                Are you sure you want to delete this category? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3 px-4 bg-fittree-bg hover:bg-fittree-border text-fittree-text font-bold rounded-xl transition-colors">
                  Cancel
                </button>
                <button onClick={confirmDelete} className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-sm shadow-red-500/30">
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default CategoryListScreen;
