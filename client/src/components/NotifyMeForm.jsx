import { useState } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { useStore } from '../store/useStore';

const NotifyMeForm = ({ product }) => {
  const { userInfo } = useStore();
  const [email, setEmail] = useState(userInfo?.email || '');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await axios.post('/api/stock-alerts', { productId: product._id, email: email.trim() });
      setDone(true);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="mt-2 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3.5 text-green-700 font-semibold text-[13.5px]">
        <CheckCircle2 size={18} className="shrink-0" />
        We'll email you the moment this is back in stock.
      </div>
    );
  }

  return (
    <form onSubmit={submitHandler} className="mt-2">
      <p className="text-[13px] text-fittree-text-light font-medium mb-3">Out of stock right now — want to know when it's back?</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-4 py-3 rounded-xl border border-fittree-border bg-white focus:outline-none focus:border-fittree-primary text-[13.5px] text-fittree-text"
        />
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary !h-auto py-3 px-6 flex items-center justify-center gap-2 rounded-xl text-[13.5px] uppercase tracking-wider whitespace-nowrap disabled:opacity-60"
        >
          <Bell size={15} /> {submitting ? 'Saving...' : 'Notify Me'}
        </button>
      </div>
      {error && <p className="text-red-500 text-[12.5px] font-semibold mt-2">{error}</p>}
    </form>
  );
};

export default NotifyMeForm;
