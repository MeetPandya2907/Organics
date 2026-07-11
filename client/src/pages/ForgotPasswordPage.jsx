import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Leaf, ShieldCheck, Clock, KeyRound } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [resendCooldown, setResendCooldown] = useState(20);

  const { sendOtp, resetPassword, userInfo, error, loading } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

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
    setMessage(null);
    const success = await sendOtp(email);
    if (success) {
      setStep(2);
      setTimeLeft(300);
      setResendCooldown(20);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (timeLeft === 0) {
      setMessage('OTP has expired. Please resend.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    setMessage(null);
    const success = await resetPassword(email, otp, newPassword);
    if (success) {
      alert('Password reset successful! You can now log in.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-row-reverse overflow-hidden">
      {/* Right Side - Image */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden bg-ink">
        <div className="absolute inset-0 bg-forest/20 mix-blend-overlay z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1615485934526-72418e2bb6cb?auto=format&fit=crop&q=80&w=2000" 
          alt="Organic Market" 
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.60] scale-105 hover:scale-100 transition-transform duration-[20s] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-ink/80 via-transparent to-transparent z-10"></div>
        <div className="absolute inset-0 p-16 flex flex-col justify-between text-white z-20">
          <div className="flex justify-end">
            <Link to="/login" className="inline-flex items-center gap-2 hover:text-turmeric transition-colors w-fit bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
              <span className="font-bold">Back to Login</span>
              <ArrowLeft size={20} className="rotate-180" />
            </Link>
          </div>
          <div className="mb-10 text-right flex flex-col items-end">
            <div className="flex items-center gap-2 mb-6">
               <h2 className="text-white text-3xl font-display font-bold">Organics</h2>
               <Leaf size={32} className="text-turmeric" />
            </div>
            <h1 className="text-6xl font-display font-bold mb-6 leading-[1.1] text-white text-right">Secure your <br/><span className="text-turmeric">account.</span></h1>
            <p className="text-xl text-slate-300 max-w-md font-medium text-right">Recover access to your organic journey quickly and securely.</p>
          </div>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-24 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-forest to-turmeric"></div>
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
              <div className="lg:hidden mb-12 flex items-center gap-2">
                <Leaf size={32} className="text-forest" />
                <span className="font-display font-bold text-3xl text-ink">Organics</span>
              </div>
              
              <div className="w-16 h-16 bg-turmeric/10 rounded-[1.25rem] flex items-center justify-center mb-8 border border-turmeric/20">
                <KeyRound size={32} className="text-turmeric" strokeWidth={1.5} />
              </div>

              <h2 className="text-4xl font-display font-bold mb-4 text-ink">Forgot Password</h2>
              <p className="text-slate-500 mb-10 font-medium text-lg">Enter your email address to receive a password reset code.</p>
              
              {message && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 text-sm font-bold">
                  {message}
                </motion.div>
              )}
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 text-sm font-bold">
                  {error}
                </motion.div>
              )}
              
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-forest focus:border-forest transition-colors outline-none text-ink font-medium placeholder-slate-400" 
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-full py-4 mt-8 shadow-lg shadow-forest/20" 
                  disabled={loading}
                >
                  {loading ? 'Sending Code...' : 'Send Reset Code'}
                </button>
              </form>
              
              <div className="mt-10 text-center text-slate-500 font-medium">
                Remember your password? <Link to="/login" className="text-forest font-bold hover:text-leaf transition-colors ml-1">Sign In</Link>
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
              <button onClick={() => setStep(1)} className="mb-10 text-slate-400 hover:text-ink font-bold flex items-center gap-2 transition-colors">
                <ArrowLeft size={18} /> Back
              </button>
              
              <div className="w-16 h-16 bg-forest/10 rounded-[1.25rem] flex items-center justify-center mb-8 border border-forest/20">
                <ShieldCheck size={32} className="text-forest" strokeWidth={1.5} />
              </div>
              
              <h2 className="text-4xl font-display font-bold mb-4 text-ink">Reset Password</h2>
              <p className="text-slate-500 mb-10 font-medium text-lg">We've sent a 6-digit code to <br/><span className="font-bold text-ink">{email}</span></p>
              
              {message && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 text-sm font-bold">
                  {message}
                </motion.div>
              )}
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 text-sm font-bold">
                  {error}
                </motion.div>
              )}
              
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <input 
                    type="text"
                    maxLength="6"
                    className="w-full text-center text-4xl tracking-[0.5em] px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-forest focus:border-forest transition-colors outline-none text-ink font-mono font-bold placeholder-slate-300" 
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm px-1">
                  <div className={`flex items-center gap-2 font-bold ${timeLeft === 0 ? 'text-red-500' : 'text-slate-500'}`}>
                    <Clock size={16} />
                    {formatTime(timeLeft)}
                  </div>
                  
                  <button 
                    type="button"
                    onClick={handleSendOtp}
                    disabled={resendCooldown > 0 || loading}
                    className="font-bold text-turmeric hover:text-turmeric-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                  </button>
                </div>

                <div className="pt-6 space-y-6 border-t border-slate-100 mt-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">New Password</label>
                    <input 
                      type="password" 
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-forest focus:border-forest transition-colors outline-none text-ink font-medium placeholder-slate-400"
                      placeholder="Create a strong password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-forest focus:border-forest transition-colors outline-none text-ink font-medium placeholder-slate-400"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-full py-4 mt-8 shadow-lg shadow-forest/20" 
                  disabled={loading || otp.length !== 6 || timeLeft === 0 || !newPassword || !confirmPassword}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
