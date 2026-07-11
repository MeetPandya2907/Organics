import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Leaf, ShieldCheck, Clock } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState(null);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [resendCooldown, setResendCooldown] = useState(20);

  const { register, sendOtp, googleLogin, userInfo, error, loading } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  // Handle Timers
  useEffect(() => {
    let timerId;
    if (step === 2) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [step]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    setMessage(null);
    const success = await sendOtp(email);
    if (success) {
      setStep(2);
      setTimeLeft(300);
      setResendCooldown(20);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (timeLeft === 0) {
      setMessage('OTP has expired. Please resend.');
      return;
    }
    setMessage(null);
    await register(name, email, password, otp);
  };

  return (
    <div className="min-h-screen bg-white flex flex-row-reverse">
      {/* Right Side - Image */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden bg-ink">
        <div className="absolute inset-0 bg-forest/20 mix-blend-overlay z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000" 
          alt="Organic Market" 
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7] scale-105 hover:scale-100 transition-transform duration-[20s] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/50 z-20"></div>
        <div className="absolute inset-0 p-16 flex flex-col justify-between text-white z-30">
          <div className="flex justify-end">
            <Link to="/" className="inline-flex items-center gap-2 hover:text-turmeric transition-colors w-fit group">
              <span className="font-bold tracking-widest uppercase text-xs">Back to Store</span>
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md group-hover:bg-white/20 transition-all">
                <ArrowLeft size={18} className="rotate-180" />
              </div>
            </Link>
          </div>
          <div className="mb-10 text-right flex flex-col items-end">
            <div className="flex items-center gap-3 mb-6">
               <h2 className="text-white text-3xl font-display font-bold tracking-wide">Organics</h2>
               <div className="w-12 h-12 bg-forest rounded-full flex items-center justify-center">
                 <Leaf size={24} className="text-white" />
               </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 leading-[1.1] text-white text-right">Join the natural <br/><span className="text-turmeric">revolution.</span></h1>
            <p className="text-lg text-slate-300 max-w-md font-medium leading-relaxed text-right">Create an account to start your journey towards a healthier, organic lifestyle.</p>
          </div>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-24 bg-white relative">
        {/* Mobile back button */}
        <Link to="/" className="lg:hidden absolute top-8 left-8 inline-flex items-center gap-2 text-slate-500 hover:text-forest transition-colors">
            <ArrowLeft size={20} />
            <span className="font-bold tracking-widest uppercase text-[10px]">Back</span>
        </Link>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md"
            >
              <div className="lg:hidden mb-12 flex items-center gap-3 justify-center">
                <div className="w-10 h-10 bg-forest rounded-full flex items-center justify-center">
                  <Leaf size={20} className="text-white" />
                </div>
                <span className="font-display font-bold text-2xl text-ink">Organics</span>
              </div>
              
              <h2 className="text-4xl font-display font-bold mb-3 text-ink">Create Account</h2>
              <p className="text-slate-500 font-medium mb-10">Please fill in your details to register.</p>
              
              {message && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-8 border border-red-500/20 text-sm font-bold">
                  {message}
                </motion.div>
              )}
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-8 border border-red-500/20 text-sm font-bold">
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
                  text="signup_with"
                />
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Or register with email</span>
                <div className="h-px bg-slate-200 flex-1"></div>
              </div>
              
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors text-ink font-medium placeholder-slate-400" 
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors text-ink font-medium placeholder-slate-400" 
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors text-ink font-medium placeholder-slate-400"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-8">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Confirm Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors text-ink font-medium placeholder-slate-400"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  ) : 'Send OTP'}
                </button>
              </form>
              
              <div className="mt-10 text-center text-slate-500 font-medium">
                Already have an account? <Link to={`/login?redirect=${redirect}`} className="text-forest font-bold hover:text-leaf transition-colors ml-2 border-b-2 border-forest/30 hover:border-forest pb-0.5">Sign In</Link>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md"
            >
              <button onClick={() => setStep(1)} className="mb-10 text-slate-400 hover:text-ink font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-colors">
                <ArrowLeft size={16} /> Back
              </button>
              
              <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mb-8 border border-forest/20 shadow-inner">
                <ShieldCheck size={32} strokeWidth={1.5} className="text-forest" />
              </div>
              
              <h2 className="text-4xl font-display font-bold mb-3 text-ink">Verify Email</h2>
              <p className="text-slate-500 font-medium mb-10">We've sent a 6-digit verification code to <span className="font-bold text-ink">{email}</span></p>
              
              {message && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-8 border border-red-500/20 text-sm font-bold">
                  {message}
                </motion.div>
              )}
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-8 border border-red-500/20 text-sm font-bold">
                  {error}
                </motion.div>
              )}
              
              <form onSubmit={handleVerifyOtp} className="space-y-8">
                <div>
                  <input 
                    type="text"
                    maxLength="6"
                    className="w-full text-center text-4xl tracking-[0.5em] px-5 py-6 rounded-2xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:ring-0 focus:border-forest transition-all outline-none text-ink font-mono font-bold" 
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-widest ${timeLeft === 0 ? 'text-red-500' : 'text-slate-400'}`}>
                    <Clock size={16} />
                    {formatTime(timeLeft)}
                  </div>
                  
                  <button 
                    type="button"
                    onClick={handleSendOtp}
                    disabled={resendCooldown > 0 || loading}
                    className="font-bold text-xs uppercase tracking-widest text-forest hover:text-leaf disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                  </button>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-full py-4 text-lg shadow-lg shadow-forest/20 flex justify-center" 
                  disabled={loading || otp.length !== 6 || timeLeft === 0}
                >
                  {loading ? (
                     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : 'Verify & Register'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RegisterPage;
