import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { AlertCircle, CheckCircle, XCircle, Trash2, Edit } from 'lucide-react';
import axios from 'axios';

const UserListScreen = () => {
  const { userInfo } = useStore();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/users/${id}`, config);
        fetchUsers();
      } catch (err) {
        alert(err.response && err.response.data.message ? err.response.data.message : err.message);
      }
    }
  };

  const toggleAdminHandler = async (user) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`/api/users/${user._id}`, { isAdmin: !user.isAdmin }, config);
      fetchUsers();
    } catch (err) {
      alert(err.response && err.response.data.message ? err.response.data.message : err.message);
    }
  };

  return (
    <div className="bg-paper min-h-screen pb-24">
      <div className="bg-forest pt-12 pb-24 px-6 rounded-b-[3rem] shadow-soft mb-[-80px]">
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
                          <button onClick={() => deleteHandler(user._id)} className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors" title="Delete User">
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
    </div>
  );
};

export default UserListScreen;
