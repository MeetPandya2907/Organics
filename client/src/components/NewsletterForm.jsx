import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Shared submit logic for the newsletter signup forms scattered across
// the site (About page, Footer). Callers own their own markup/styling
// and just render <input>/<button> inside this wrapper <form>.
const NewsletterForm = ({ children, className }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.post('/api/newsletter', { email });
      toast.success(data.message);
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submitHandler} className={className}>
      {children({ email, setEmail, loading })}
    </form>
  );
};

export default NewsletterForm;
