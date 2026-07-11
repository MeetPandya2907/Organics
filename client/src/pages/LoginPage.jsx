import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { ArrowLeft, Leaf } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, googleLogin, userInfo, error, loading } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden bg-ink">
        <div className="absolute inset-0 bg-forest/20 mix-blend-overlay z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1615486171430-b18b4dd4a5db?auto=format&fit=crop&q=80&w=2000" 
          alt="Fresh Organics" 
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7] scale-105 hover:scale-100 transition-transform duration-[20s] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/50 z-20"></div>
        
        <div className="absolute inset-0 p-16 flex flex-col justify-between text-white z-30">
          <Link to="/" className="inline-flex items-center gap-2 hover:text-turmeric transition-colors w-fit group">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md group-hover:bg-white/20 transition-all">
              <ArrowLeft size={18} />
            </div>
            <span className="font-bold tracking-widest uppercase text-xs">Back to Store</span>
          </Link>
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-12 h-12 bg-forest rounded-full flex items-center justify-center">
                 <Leaf size={24} className="text-white" />
               </div>
               <h2 className="text-white text-3xl font-display font-bold tracking-wide">Organics</h2>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 leading-[1.1] text-white">Welcome back to <br/><span className="text-turmeric">pure wellness.</span></h1>
            <p className="text-lg text-slate-300 max-w-md font-medium leading-relaxed">Sign in to access your orders, saved items, and personalized organic recommendations.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-24 bg-white relative">
        {/* Mobile back button */}
        <Link to="/" className="lg:hidden absolute top-8 left-8 inline-flex items-center gap-2 text-slate-500 hover:text-forest transition-colors">
            <ArrowLeft size={20} />
            <span className="font-bold tracking-widest uppercase text-[10px]">Back</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-12 flex items-center gap-3 justify-center">
            <div className="w-10 h-10 bg-forest rounded-full flex items-center justify-center">
              <Leaf size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-ink">Organics</span>
          </div>
          
          <h2 className="text-4xl font-display font-bold mb-3 text-ink">Sign In</h2>
          <p className="text-slate-500 font-medium mb-10">Please enter your details to sign in.</p>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-8 border border-red-500/20 text-sm font-bold"
            >
              {error}
            </motion.div>
          )}
          <div className="mb-8 flex justify-center">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                googleLogin(credentialResponse.credential);
              }}
              onError={() => {
                console.log('Login Failed');
              }}
              useOneTap
              theme="outline"
              size="large"
              shape="pill"
              width="100%"
            />
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Or continue with</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>
          
          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Email Address</label>
              <input 
                type="email" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors text-ink font-medium placeholder-slate-400" 
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                <Link to="/forgot-password" className="text-xs font-bold text-forest hover:text-leaf transition-colors uppercase tracking-widest">Forgot Password?</Link>
              </div>
              <input 
                type="password" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors text-ink font-medium placeholder-slate-400"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary w-full py-4 text-lg shadow-lg shadow-forest/20 flex justify-center" 
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-10 text-center text-slate-500 font-medium">
            Don't have an account? <Link to={`/register?redirect=${redirect}`} className="text-forest font-bold hover:text-leaf transition-colors ml-2 border-b-2 border-forest/30 hover:border-forest pb-0.5">Create Account</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
