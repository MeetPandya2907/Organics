import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Star } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import Meta from '../components/Meta';

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
    <div className="min-h-screen bg-fittree-bg flex">
      <Meta title="FitTree Organics | Sign In" />

      {/* Left Side - Image */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden bg-fittree-dark">
        <img
          src="https://fittreeinternational.com/wp-content/uploads/2026/01/imresizer-turmeric-2344157-scaled-1-1.jpg"
          alt="High-curcumin turmeric powder"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-fittree-dark via-fittree-dark/40 to-fittree-dark/60"></div>

        <div className="absolute inset-0 p-14 flex flex-col justify-between text-white z-10">
          <Link to="/" className="inline-flex items-center gap-2 hover:text-fittree-yellow transition-colors w-fit group">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md group-hover:bg-white/20 transition-all">
              <ArrowLeft size={18} />
            </div>
            <span className="font-bold tracking-widest uppercase text-xs">Back to Store</span>
          </Link>
          <div className="mb-6">
            <div className="flex items-center gap-2.5 mb-7">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-fittree-orange to-fittree-pink flex items-center justify-center font-display font-extrabold text-lg">F</div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-display font-extrabold text-xl leading-none">FitTree</span>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-fittree-yellow leading-none mt-1">Organics</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-[1.1] text-white">
              Welcome back<br />to the <span className="italic font-medium text-fittree-orange">pantry.</span>
            </h1>
            <p className="text-base text-white/70 max-w-md font-medium leading-relaxed mb-8">
              Sign in to track your orders, reorder your regulars, and manage your subscriptions.
            </p>
            <div className="flex items-center gap-5 pt-6 border-t border-white/10 w-fit">
              <div className="flex items-center gap-1 text-fittree-yellow">
                {[1,2,3,4,5].map(i => <Star key={i} size={13} fill="currentColor" stroke="none" />)}
                <span className="text-white font-bold text-sm ml-1">4.8</span>
              </div>
              <span className="text-white/60 text-xs font-semibold">from 40,000+ Indian kitchens</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-24 bg-fittree-bg relative">
        <Link to="/" className="lg:hidden absolute top-8 left-8 inline-flex items-center gap-2 text-fittree-text-light hover:text-fittree-primary transition-colors">
          <ArrowLeft size={20} />
          <span className="font-bold tracking-widest uppercase text-[10px]">Back</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[2rem] border border-fittree-border shadow-fittree-sm"
        >
          <div className="lg:hidden mb-10 flex items-center gap-2.5 justify-center">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-fittree-primary to-fittree-dark flex items-center justify-center font-display font-extrabold text-white">F</div>
            <span className="font-display font-extrabold text-xl text-fittree-dark">FitTree Organics</span>
          </div>

          <h2 className="text-3xl font-display font-bold mb-2.5 text-fittree-dark">Sign In</h2>
          <p className="text-fittree-text-light font-medium mb-8 text-sm">Enter your details to access your account.</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-fittree-pink/10 text-fittree-pink-dark p-4 rounded-xl mb-7 border border-fittree-pink/20 text-sm font-bold"
            >
              {error}
            </motion.div>
          )}
          <div className="mb-7 flex justify-center">
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

          <div className="flex items-center gap-4 mb-7">
            <div className="h-px bg-fittree-border flex-1"></div>
            <span className="text-xs font-bold text-fittree-text-light uppercase tracking-widest">Or continue with</span>
            <div className="h-px bg-fittree-border flex-1"></div>
          </div>

          <form onSubmit={submitHandler} className="space-y-5">
            <div className="form-group mb-0">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="form-label mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs font-bold text-fittree-primary hover:text-fittree-orange-dark transition-colors uppercase tracking-widest">Forgot?</Link>
              </div>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full py-4 text-base flex justify-center"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center text-fittree-text-light font-medium text-sm">
            Don't have an account? <Link to={`/register?redirect=${redirect}`} className="text-fittree-primary font-bold hover:text-fittree-orange-dark transition-colors ml-1">Create Account</Link>
          </div>

          <div className="mt-7 pt-6 border-t border-fittree-border flex items-center justify-center gap-2 text-fittree-text-light text-xs font-semibold">
            <ShieldCheck size={14} className="text-fittree-primary" /> FSSAI Licensed · COD Available
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
