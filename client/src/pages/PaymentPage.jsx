import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { CreditCard, Wallet, Banknote, ArrowRight, ShieldCheck } from 'lucide-react';

const PaymentPage = () => {
  const { shippingAddress, paymentMethod: storedPaymentMethod, savePaymentMethod, userInfo } = useStore();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState(storedPaymentMethod || 'Razorpay');

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/payment');
    } else if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [userInfo, shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    savePaymentMethod(paymentMethod);
    navigate('/placeorder');
  };

  return (
    <div className="bg-paper min-h-screen pb-24">
      {/* Checkout Steps Header */}
      <div className="bg-ink pt-32 pb-32 px-6 shadow-2xl shadow-black/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-forest/20 mix-blend-overlay"></div>
        <div className="max-w-[800px] mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-display text-white mb-10 font-bold">Checkout</h1>
          <div className="flex justify-center items-center gap-2 sm:gap-6 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
            <div className="flex items-center gap-3 text-slate-300"><div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center">1</div> <span className="hidden sm:inline">Shipping</span></div>
            <div className="w-8 sm:w-16 h-[2px] bg-white/20 rounded-full"></div>
            <div className="flex items-center gap-3 text-turmeric"><div className="w-8 h-8 rounded-full bg-turmeric text-ink flex items-center justify-center shadow-lg shadow-turmeric/20">2</div> <span className="hidden sm:inline">Payment</span></div>
            <div className="w-8 sm:w-16 h-[2px] bg-white/20 rounded-full"></div>
            <div className="flex items-center gap-3 text-slate-500"><div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">3</div> <span className="hidden sm:inline">Review</span></div>
          </div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-[700px] mx-auto px-6 relative z-10 -mt-16">
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-glass border border-slate-100">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 text-forest rounded-full flex items-center justify-center mb-6 shadow-sm">
              <CreditCard size={28} strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl text-ink font-display font-bold mb-2">Payment Method</h2>
            <p className="text-slate-500 font-medium flex items-center justify-center gap-2"><ShieldCheck size={16} className="text-blue-500" /> All transactions are secure and encrypted.</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="space-y-4">
              <label 
                onClick={() => setPaymentMethod('Razorpay')}
                className={`flex items-center p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'Razorpay' ? 'border-fittree-primary bg-fittree-primary/5 shadow-md shadow-fittree-primary/10' : 'border-slate-100 hover:border-slate-300 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === 'Razorpay' ? 'border-fittree-primary' : 'border-slate-300'}`}>
                   {paymentMethod === 'Razorpay' && <div className="w-3 h-3 bg-fittree-primary rounded-full"></div>}
                </div>
                <div className="ml-4 flex items-center gap-4">
                   <div className={`p-3 rounded-xl ${paymentMethod === 'Razorpay' ? 'bg-forest text-white' : 'bg-white text-slate-400 border border-slate-200 shadow-sm'}`}>
                     <Wallet size={24} strokeWidth={1.5} />
                   </div>
                   <div>
                     <span className={`block text-lg font-bold ${paymentMethod === 'Razorpay' ? 'text-forest' : 'text-ink'}`}>Razorpay</span>
                     <span className="block text-sm text-slate-500 font-medium">Credit Card, Debit Card, UPI, NetBanking</span>
                   </div>
                </div>
              </label>

              <label 
                onClick={() => setPaymentMethod('CashOnDelivery')}
                className={`flex items-center p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'CashOnDelivery' ? 'border-fittree-primary bg-fittree-primary/5 shadow-md shadow-fittree-primary/10' : 'border-slate-100 hover:border-slate-300 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === 'CashOnDelivery' ? 'border-fittree-primary' : 'border-slate-300'}`}>
                   {paymentMethod === 'CashOnDelivery' && <div className="w-3 h-3 bg-fittree-primary rounded-full"></div>}
                </div>
                <div className="ml-4 flex items-center gap-4">
                   <div className={`p-3 rounded-xl ${paymentMethod === 'CashOnDelivery' ? 'bg-forest text-white' : 'bg-white text-slate-400 border border-slate-200 shadow-sm'}`}>
                     <Banknote size={24} strokeWidth={1.5} />
                   </div>
                   <div>
                     <span className={`block text-lg font-bold ${paymentMethod === 'CashOnDelivery' ? 'text-forest' : 'text-ink'}`}>Cash On Delivery</span>
                     <span className="block text-sm text-slate-500 font-medium">Pay with cash upon delivery</span>
                   </div>
                </div>
              </label>
            </div>

            <div className="pt-6">
              <button type="submit" className="btn btn-primary w-full py-5 text-lg flex justify-center items-center gap-3 group shadow-lg shadow-forest/20">
                Continue to Review Order
                <ArrowRight size={20} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentPage;
