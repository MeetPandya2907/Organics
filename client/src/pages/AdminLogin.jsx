import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  
  const { login, userInfo, loading } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoginError(null);
    const success = await login(email, password);
    
    if (success) {
      // We need to verify isAdmin status after a slight delay for state to update
      // But actually, we can just let the useEffect handle the redirect if successful
      // However, if they are NOT an admin, we should immediately log them out and show error.
      setTimeout(() => {
        const currentUser = JSON.parse(localStorage.getItem('userInfo'));
        if (currentUser && !currentUser.isAdmin) {
          useStore.getState().logout();
          setLoginError('Not authorized as an administrator.');
        }
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-ink text-white flex items-center justify-center px-6 selection:bg-leaf selection:text-white">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block text-leaf mb-6 hover:text-white transition-colors">
            <ShieldCheck size={48} className="mx-auto" />
          </Link>
          <h2 className="text-3xl font-display text-white mb-2">Staff Portal</h2>
          <p className="text-gray-400">Authorized personnel only.</p>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
          {loginError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{loginError}</p>
            </div>
          )}
          {useStore.getState().error && !loginError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{useStore.getState().error}</p>
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Staff Email</label>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-leaf focus:ring-1 focus:ring-leaf transition-colors placeholder-gray-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-leaf focus:ring-1 focus:ring-leaf transition-colors placeholder-gray-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-leaf text-white font-bold py-4 rounded-xl shadow-lg hover:bg-forest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          Return to <Link to="/" className="text-leaf hover:underline">Public Store</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
