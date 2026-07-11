import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';

const OrderSuccessPage = () => {
  const { id } = useParams();

  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6 pt-32 pb-24 relative overflow-hidden">
      
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-forest/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-turmeric/10 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
        className="bg-white max-w-lg w-full rounded-[3rem] p-10 md:p-14 text-center shadow-glass border border-slate-100 relative z-10"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', bounce: 0.6 }}
          className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-soft"
        >
          <CheckCircle size={48} className="text-forest" strokeWidth={1.5} />
        </motion.div>
        
        <h1 className="text-4xl font-display font-bold text-ink mb-4">Payment Successful!</h1>
        <p className="text-lg text-slate-500 mb-8 leading-relaxed font-medium">
          Thank you for your purchase! Your order has been placed successfully and is now being processed.
        </p>

        <div className="bg-slate-50 rounded-2xl p-6 mb-10 border border-slate-100">
          <p className="text-sm font-bold text-slate-400 mb-1 tracking-widest uppercase">Order Reference</p>
          <p className="text-xl font-mono text-ink font-bold">#{id}</p>
        </div>

        <div className="flex flex-col gap-4">
          <Link 
            to={`/order/${id}`} 
            className="btn btn-primary w-full h-14 text-lg flex items-center justify-center gap-2 shadow-lg shadow-forest/20"
          >
            <ShoppingBag size={20} /> View Order Details
          </Link>
          <Link 
            to="/" 
            className="btn bg-white hover:bg-slate-50 text-ink border border-slate-200 w-full h-14 text-lg flex items-center justify-center gap-2 transition-colors font-bold"
          >
            Continue Shopping <ArrowRight size={20} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;
