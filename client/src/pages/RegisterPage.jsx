import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Clock, Star } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import Meta from '../components/Meta';

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
    <div className="min-h-screen bg-fittree-bg flex flex-row-reverse">
      <Meta title="FitTree Organics | Create Account" />

      {/* Right Side - Image */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden bg-fittree-dark">
        <img
          src="https://fittreeinternational.com/wp-content/uploads/2026/01/imresizer-istockphoto-515677966-170667a.jpg"
          alt="Handpicked green cardamom pods"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-fittree-dark via-fittree-dark/40 to-fittree-dark/60"></div>
        <div className="absolute inset-0 p-14 flex flex-col justify-between text-white z-10">
          <div className="flex justify-end">
            <Link to="/" className="inline-flex items-center gap-2 hover:text-fittree-yellow transition-colors w-fit group">
              <span className="font-bold tracking-widest uppercase text-xs">Back to Store</span>
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md group-hover:bg-white/20 transition-all">
                <ArrowLeft size={18} className="rotate-180" />
              </div>
            </Link>
          </div>
          <div className="mb-6 text-right flex flex-col items-end">
            <div className="flex items-center gap-2.5 mb-7">
              <div className="flex flex-col leading-none items-end">
                <span className="text-white font-display font-extrabold text-xl leading-none">FitTree</span>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-fittree-yellow leading-none mt-1">Organics</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-fittree-orange to-fittree-pink flex items-center justify-center font-display font-extrabold text-lg">F</div>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-[1.1] text-white text-right">
              Join 40,000+<br /><span className="italic font-medium text-fittree-orange">Indian kitchens.</span>
            </h1>
            <p className="text-base text-white/70 max-w-md font-medium leading-relaxed text-right mb-8">
              Create an account for faster checkout, order tracking, and first-order offers.
            </p>
            <div className="flex items-center gap-5 pt-6 border-t border-white/10 w-fit">
              <span className="text-white/60 text-xs font-semibold">4.8 average rating</span>
              <div className="flex items-center gap-1 text-fittree-yellow">
                {[1,2,3,4,5].map(i => <Star key={i} size={13} fill="currentColor" stroke="none" />)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-24 bg-fittree-bg relative">
        <Link to="/" className="lg:hidden absolute top-8 left-8 inline-flex items-center gap-2 text-fittree-text-light hover:text-fittree-primary transition-colors">
          <ArrowLeft size={20} />
          <span className="font-bold tracking-widest uppercase text-[10px]">Back</span>
        </Link>

        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[2rem] border border-fittree-border shadow-fittree-sm overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="lg:hidden mb-10 flex items-center gap-2.5 justify-center">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-fittree-primary to-fittree-dark flex items-center justify-center font-display font-extrabold text-white">F</div>
                  <span className="font-display font-extrabold text-xl text-fittree-dark">FitTree Organics</span>
                </div>

                <h2 className="text-3xl font-display font-bold mb-2.5 text-fittree-dark">Create Account</h2>
                <p className="text-fittree-text-light font-medium mb-8 text-sm">Fill in your details to get started.</p>

                {message && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-fittree-pink/10 text-fittree-pink-dark p-4 rounded-xl mb-7 border border-fittree-pink/20 text-sm font-bold">
                    {message}
                  </motion.div>
                )}
                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-fittree-pink/10 text-fittree-pink-dark p-4 rounded-xl mb-7 border border-fittree-pink/20 text-sm font-bold">
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
                    text="signup_with"
                  />
                </div>

                <div className="flex items-center gap-4 mb-7">
                  <div className="h-px bg-fittree-border flex-1"></div>
                  <span className="text-xs font-bold text-fittree-text-light uppercase tracking-widest">Or register with email</span>
                  <div className="h-px bg-fittree-border flex-1"></div>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div className="form-group mb-0">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
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
                  <div className="form-group mb-0">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                    ) : 'Send OTP'}
                  </button>
                </form>

                <div className="mt-8 text-center text-fittree-text-light font-medium text-sm">
                  Already have an account? <Link to={`/login?redirect=${redirect}`} className="text-fittree-primary font-bold hover:text-fittree-orange-dark transition-colors ml-1">Sign In</Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <button onClick={() => setStep(1)} className="mb-8 text-fittree-text-light hover:text-fittree-dark font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-colors">
                  <ArrowLeft size={16} /> Back
                </button>

                <div className="w-14 h-14 bg-fittree-primary/10 rounded-full flex items-center justify-center mb-7 border border-fittree-primary/20">
                  <ShieldCheck size={26} strokeWidth={1.75} className="text-fittree-primary" />
                </div>

                <h2 className="text-3xl font-display font-bold mb-2.5 text-fittree-dark">Verify Email</h2>
                <p className="text-fittree-text-light font-medium mb-8 text-sm">We've sent a 6-digit code to <span className="font-bold text-fittree-dark">{email}</span></p>

                {message && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-fittree-pink/10 text-fittree-pink-dark p-4 rounded-xl mb-7 border border-fittree-pink/20 text-sm font-bold">
                    {message}
                  </motion.div>
                )}
                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-fittree-pink/10 text-fittree-pink-dark p-4 rounded-xl mb-7 border border-fittree-pink/20 text-sm font-bold">
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-7">
                  <div>
                    <input
                      type="text"
                      maxLength="6"
                      className="w-full text-center text-3xl tracking-[0.5em] px-5 py-5 rounded-2xl border-2 border-fittree-border bg-fittree-bg focus:bg-white focus:ring-0 focus:border-fittree-primary transition-all outline-none text-fittree-dark font-mono font-bold"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-widest ${timeLeft === 0 ? 'text-fittree-pink' : 'text-fittree-text-light'}`}>
                      <Clock size={16} />
                      {formatTime(timeLeft)}
                    </div>

                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={resendCooldown > 0 || loading}
                      className="font-bold text-xs uppercase tracking-widest text-fittree-primary hover:text-fittree-orange-dark disabled:text-fittree-text-light/50 disabled:cursor-not-allowed transition-colors"
                    >
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full py-4 text-base flex justify-center"
                    disabled={loading || otp.length !== 6 || timeLeft === 0}
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : 'Verify & Register'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
