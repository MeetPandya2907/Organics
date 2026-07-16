import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';

const ShippingPage = () => {
  const { shippingAddress, saveShippingAddress, userInfo } = useStore();
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');
  const [phone, setPhone] = useState(shippingAddress.phone || '');

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    saveShippingAddress({ address, city, postalCode, country, phone });
    navigate('/payment');
  };

  return (
    <div className="bg-paper min-h-screen pb-24">
      {/* Checkout Steps Header */}
      <div className="bg-ink pt-32 pb-32 px-6 shadow-2xl shadow-black/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-forest/20 mix-blend-overlay"></div>
        <div className="max-w-[800px] mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-display text-white mb-10 font-bold">Checkout</h1>
          <div className="flex justify-center items-center gap-2 sm:gap-6 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
            <div className="flex items-center gap-3 text-turmeric"><div className="w-8 h-8 rounded-full bg-turmeric text-ink flex items-center justify-center shadow-lg shadow-turmeric/20">1</div> <span className="hidden sm:inline">Shipping</span></div>
            <div className="w-8 sm:w-16 h-[2px] bg-white/20 rounded-full"></div>
            <div className="flex items-center gap-3 text-slate-500"><div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">2</div> <span className="hidden sm:inline">Payment</span></div>
            <div className="w-8 sm:w-16 h-[2px] bg-white/20 rounded-full"></div>
            <div className="flex items-center gap-3 text-slate-500"><div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">3</div> <span className="hidden sm:inline">Review</span></div>
          </div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-[700px] mx-auto px-6 relative z-10 -mt-16">
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-glass border border-slate-100">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 text-forest rounded-full flex items-center justify-center mb-6 shadow-sm">
              <MapPin size={28} strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl text-ink font-display font-bold mb-2">Shipping Details</h2>
            <p className="text-slate-500 font-medium">Where should we deliver your organic harvest?</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Street Address</label>
              <input 
                type="text" 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors text-ink font-medium placeholder-slate-400" 
                placeholder="123 Organic Way, Apt 4B"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">City</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors text-ink font-medium placeholder-slate-400" 
                  placeholder="Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Postal Code</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors text-ink font-medium placeholder-slate-400" 
                  placeholder="400001"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Country</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors text-ink font-medium placeholder-slate-400" 
                  placeholder="India"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Phone Number</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors text-ink font-medium placeholder-slate-400" 
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-6">
              <button type="submit" className="btn btn-primary w-full py-5 text-lg flex justify-center items-center gap-3 group shadow-lg shadow-forest/20">
                Continue to Payment
                <ArrowRight size={20} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ShippingPage;
