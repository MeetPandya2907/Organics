import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Edit, Trash2, Plus, AlertCircle, X, Search, Download, Check } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../components/AdminLayout';
import { exportCsv } from '../utils/exportCsv';

const ProductListScreen = () => {
  const { userInfo } = useStore();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('all'); // all | low | out
  const [editingStockId, setEditingStockId] = useState(null);
  const [stockDraft, setStockDraft] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/products?pageSize=200');
      setProducts(data.products);
      setLoading(false);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchProducts();
      axios.get('/api/categories').then(({ data }) => setCategories(data)).catch(() => {});
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (category !== 'All' && p.category !== category) return false;
      if (stockFilter === 'low' && !(p.countInStock > 0 && p.countInStock <= 5)) return false;
      if (stockFilter === 'out' && p.countInStock !== 0) return false;
      return true;
    });
  }, [products, search, category, stockFilter]);

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(`/api/products/${deleteConfirmId}`, config);
      setProducts((prev) => prev.filter((p) => p._id !== deleteConfirmId));
      toast.success('Product deleted successfully');
      setDeleteConfirmId(null);
    } catch (err) {
      toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
      setDeleteConfirmId(null);
    }
  };

  const createProductHandler = () => {
    // Navigates to a blank create form — nothing is saved to the database
    // until the admin actually submits it.
    navigate('/admin/product/new/edit');
  };

  const startEditStock = (product) => {
    setEditingStockId(product._id);
    setStockDraft(String(product.countInStock));
  };

  const saveStock = async (product) => {
    const newStock = Number(stockDraft);
    if (Number.isNaN(newStock) || newStock < 0) {
      toast.error('Enter a valid stock quantity');
      return;
    }
    const prevStock = product.countInStock;
    setProducts((prev) => prev.map((p) => (p._id === product._id ? { ...p, countInStock: newStock } : p)));
    setEditingStockId(null);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`/api/products/${product._id}`, {
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
        images: product.images,
        category: product.category,
        countInStock: newStock,
      }, config);
      toast.success('Stock updated');
    } catch (err) {
      setProducts((prev) => prev.map((p) => (p._id === product._id ? { ...p, countInStock: prevStock } : p)));
      toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
    }
  };

  const handleExport = () => {
    exportCsv(`products-${Date.now()}.csv`, filtered, [
      { label: 'ID', get: (p) => p._id },
      { label: 'Name', get: (p) => p.name },
      { label: 'Category', get: (p) => p.category },
      { label: 'Price', get: (p) => p.price },
      { label: 'Stock', get: (p) => p.countInStock },
      { label: 'Rating', get: (p) => p.rating },
      { label: 'Reviews', get: (p) => p.numReviews },
    ]);
  };

  return (
    <AdminLayout
      title="Manage Products"
      actions={
        <>
          <button onClick={handleExport} className="flex items-center gap-2 bg-white border border-fittree-border hover:border-fittree-primary text-fittree-text font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all text-[13.5px]">
            <Download size={16} /> Export CSV
          </button>
          <button onClick={createProductHandler} className="flex items-center gap-2 bg-fittree-primary text-white font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all text-[13.5px]">
            <Plus size={16} /> Create Product
          </button>
        </>
      }
    >
      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-fittree-border shadow-sm mb-5 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fittree-text-light" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-fittree-border bg-fittree-bg focus:outline-none focus:border-fittree-primary text-[13.5px] text-fittree-text"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-fittree-border bg-fittree-bg focus:outline-none focus:border-fittree-primary text-[13.5px] text-fittree-text font-medium"
        >
          <option value="All">All</option>
          {categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
        </select>
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-fittree-border bg-fittree-bg focus:outline-none focus:border-fittree-primary text-[13.5px] text-fittree-text font-medium"
        >
          <option value="all">All Stock</option>
          <option value="low">Low Stock (≤5)</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      <div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-fittree-border">
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fittree-primary"></div></div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl flex items-center gap-3"><AlertCircle /> {error}</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-fittree-text-light font-medium">No products match your filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-fittree-border">
                  <th className="py-4 px-4 text-fittree-text-light font-bold text-[11.5px] uppercase tracking-wider">Name</th>
                  <th className="py-4 px-4 text-fittree-text-light font-bold text-[11.5px] uppercase tracking-wider">Price</th>
                  <th className="py-4 px-4 text-fittree-text-light font-bold text-[11.5px] uppercase tracking-wider">Category</th>
                  <th className="py-4 px-4 text-fittree-text-light font-bold text-[11.5px] uppercase tracking-wider">Stock</th>
                  <th className="py-4 px-4 text-fittree-text-light font-bold text-[11.5px] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fittree-border">
                {filtered.map((product) => (
                  <tr key={product._id} className="hover:bg-fittree-bg transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-fittree-sand shrink-0" />
                        <span className="font-medium text-fittree-text text-[13.5px] line-clamp-1">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-fittree-primary font-semibold text-[13.5px]">₹{product.price}</td>
                    <td className="py-3 px-4 text-[12px]"><span className="bg-fittree-light text-fittree-primary px-3 py-1 rounded-full font-bold">{product.category}</span></td>
                    <td className="py-3 px-4">
                      {editingStockId === product._id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            autoFocus
                            value={stockDraft}
                            onChange={(e) => setStockDraft(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && saveStock(product)}
                            onWheel={(e) => e.target.blur()}
                            className="w-16 px-2 py-1 rounded-lg border border-fittree-primary text-[13px] text-fittree-text focus:outline-none"
                          />
                          <button onClick={() => saveStock(product)} className="w-7 h-7 rounded-full bg-fittree-primary text-white flex items-center justify-center shrink-0"><Check size={13} /></button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditStock(product)}
                          className={`px-2.5 py-1 rounded-full text-[11.5px] font-bold ${
                            product.countInStock === 0
                              ? 'bg-red-100 text-red-700'
                              : product.countInStock <= 5
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                          title="Click to edit stock"
                        >
                          {product.countInStock} units
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/product/${product._id}/edit`} className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors" title="Edit Product">
                          <Edit size={15} />
                        </Link>
                        <button onClick={() => setDeleteConfirmId(product._id)} className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors" title="Delete Product">
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
        <div className="mt-4 text-[12.5px] text-fittree-text-light font-medium">{filtered.length} of {products.length} products</div>
      </div>

      {/* Delete Confirmation Modal */}
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
              <h3 className="text-2xl font-bold text-fittree-text mb-2">Delete Product?</h3>
              <p className="text-fittree-text-light mb-8 font-medium">This action cannot be undone. This product will be permanently removed from your store.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3 px-4 rounded-xl font-bold text-fittree-text bg-fittree-sand hover:bg-fittree-border transition-colors">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all hover:-translate-y-0.5">Delete Permanently</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default ProductListScreen;
