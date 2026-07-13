import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { AlertCircle, CheckCircle, XCircle, Trash2, Edit, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const UserListScreen = () => {
  const { userInfo } = useStore();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

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

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(`/api/users/${deleteConfirmId}`, config);
      setUsers(prev => prev.filter(u => u._id !== deleteConfirmId));
      toast.success('User deleted successfully');
      setDeleteConfirmId(null);
    } catch (err) {
      toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
      setDeleteConfirmId(null);
    }
  };

  const toggleAdminHandler = async (user) => {
    // Optimistic update
    setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isAdmin: !u.isAdmin } : u));
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`/api/users/${user._id}`, { isAdmin: !user.isAdmin }, config);
      toast.success(user.isAdmin ? 'Admin privileges revoked' : 'User is now an admin');
    } catch (err) {
      // Revert on error
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isAdmin: user.isAdmin } : u));
      toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
    }
  };

  return (
    <div className="bg-paper min-h-screen pb-24">
      <div className="bg-forest pt-32 pb-24 px-6 rounded-b-[3rem] shadow-soft mb-[-80px]">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-4xl text-white">Manage Users</h1>
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
                    <th className="py-4 px-4 text-text-muted font-medium">NAME</th>
                    <th className="py-4 px-4 text-text-muted font-medium">EMAIL</th>
                    <th className="py-4 px-4 text-text-muted font-medium text-center">ADMIN</th>
                    <th className="py-4 px-4 text-text-muted font-medium text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-mono text-sm text-gray-500">{user._id.substring(0, 8)}...</td>
                      <td className="py-4 px-4 font-medium text-ink">{user.name}</td>
                      <td className="py-4 px-4"><a href={`mailto:${user.email}`} className="text-leaf hover:underline">{user.email}</a></td>
                      <td className="py-4 px-4 text-center">
                        {user.isAdmin ? (
                          <div className="w-8 h-8 mx-auto bg-green-50 text-green-500 rounded-full flex items-center justify-center"><CheckCircle size={16} /></div>
                        ) : (
                          <div className="w-8 h-8 mx-auto bg-red-50 text-red-500 rounded-full flex items-center justify-center"><XCircle size={16} /></div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => toggleAdminHandler(user)} className="px-4 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors text-sm font-medium">
                            {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                          </button>
                          <button onClick={() => setDeleteConfirmId(user._id)} className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors" title="Delete User">
                            <Trash2 size={16} />
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
      </div>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[400px] bg-white rounded-3xl p-8 shadow-2xl z-50 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                  <Trash2 size={24} />
                </div>
                <button onClick={() => setDeleteConfirmId(null)} className="text-gray-400 hover:text-ink transition-colors">
                  <X size={24} />
                </button>
              </div>

              <h3 className="text-2xl text-ink mb-2">Delete User?</h3>
              <p className="text-gray-500 mb-8">This action cannot be undone. This user will lose access to their account.</p>

              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3 px-4 rounded-xl font-medium text-ink bg-gray-100 hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button onClick={confirmDelete} className="flex-1 py-3 px-4 rounded-xl font-medium text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all hover:-translate-y-0.5">
                  Delete Permanently
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default UserListScreen;
