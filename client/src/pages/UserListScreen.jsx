import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { AlertCircle, CheckCircle, XCircle, Trash2, X, Search, Download } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../components/AdminLayout';
import { exportCsv } from '../utils/exportCsv';

const UserListScreen = () => {
  const { userInfo } = useStore();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('/api/users', config);
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchUsers();
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (search) {
        const q = search.toLowerCase();
        if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      }
      if (roleFilter === 'admin' && !u.isAdmin) return false;
      if (roleFilter === 'customer' && u.isAdmin) return false;
      return true;
    });
  }, [users, search, roleFilter]);

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(`/api/users/${deleteConfirmId}`, config);
      setUsers((prev) => prev.filter((u) => u._id !== deleteConfirmId));
      toast.success('User deleted successfully');
      setDeleteConfirmId(null);
    } catch (err) {
      toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
      setDeleteConfirmId(null);
    }
  };

  const toggleAdminHandler = async (user) => {
    setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, isAdmin: !u.isAdmin } : u)));
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`/api/users/${user._id}`, { isAdmin: !user.isAdmin }, config);
      toast.success(user.isAdmin ? 'Admin privileges revoked' : 'User is now an admin');
    } catch (err) {
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, isAdmin: user.isAdmin } : u)));
      toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
    }
  };

  const handleExport = () => {
    exportCsv(`customers-${Date.now()}.csv`, filtered, [
      { label: 'ID', get: (u) => u._id },
      { label: 'Name', get: (u) => u.name },
      { label: 'Email', get: (u) => u.email },
      { label: 'Admin', get: (u) => (u.isAdmin ? 'Yes' : 'No') },
      { label: 'Joined', get: (u) => new Date(u.createdAt).toLocaleDateString() },
    ]);
  };

  return (
    <AdminLayout
      title="Manage Customers"
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
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-fittree-border bg-fittree-bg focus:outline-none focus:border-fittree-primary text-[13.5px] text-fittree-text"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-fittree-border bg-fittree-bg focus:outline-none focus:border-fittree-primary text-[13.5px] text-fittree-text font-medium"
        >
          <option value="all">All Users</option>
          <option value="admin">Admins Only</option>
          <option value="customer">Customers Only</option>
        </select>
      </div>

      <div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-fittree-border">
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fittree-primary"></div></div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl flex items-center gap-3"><AlertCircle /> {error}</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-fittree-text-light font-medium">No customers match your filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-fittree-border">
                  <th className="py-4 px-4 text-fittree-text-light font-bold text-[11.5px] uppercase tracking-wider">Name</th>
                  <th className="py-4 px-4 text-fittree-text-light font-bold text-[11.5px] uppercase tracking-wider">Email</th>
                  <th className="py-4 px-4 text-fittree-text-light font-bold text-[11.5px] uppercase tracking-wider">Joined</th>
                  <th className="py-4 px-4 text-fittree-text-light font-bold text-[11.5px] uppercase tracking-wider text-center">Admin</th>
                  <th className="py-4 px-4 text-fittree-text-light font-bold text-[11.5px] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fittree-border">
                {filtered.map((user) => (
                  <tr key={user._id} className="hover:bg-fittree-bg transition-colors">
                    <td className="py-3 px-4 font-medium text-fittree-text text-[13.5px]">{user.name}</td>
                    <td className="py-3 px-4"><a href={`mailto:${user.email}`} className="text-fittree-primary hover:underline text-[13px]">{user.email}</a></td>
                    <td className="py-3 px-4 text-[13px] text-fittree-text-light">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</td>
                    <td className="py-3 px-4 text-center">
                      {user.isAdmin ? (
                        <div className="w-8 h-8 mx-auto bg-green-50 text-green-500 rounded-full flex items-center justify-center"><CheckCircle size={16} /></div>
                      ) : (
                        <div className="w-8 h-8 mx-auto bg-red-50 text-red-500 rounded-full flex items-center justify-center"><XCircle size={16} /></div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => toggleAdminHandler(user)} className="px-3.5 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors text-[12px] font-bold whitespace-nowrap">
                          {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                        </button>
                        <button onClick={() => setDeleteConfirmId(user._id)} className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors" title="Delete User">
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
        <div className="mt-4 text-[12.5px] text-fittree-text-light font-medium">{filtered.length} of {users.length} customers</div>
      </div>

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
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500"><Trash2 size={24} /></div>
                <button onClick={() => setDeleteConfirmId(null)} className="text-gray-400 hover:text-fittree-text transition-colors"><X size={24} /></button>
              </div>
              <h3 className="text-2xl font-bold text-fittree-text mb-2">Delete User?</h3>
              <p className="text-fittree-text-light mb-8 font-medium">This action cannot be undone. This user will lose access to their account.</p>
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

export default UserListScreen;
