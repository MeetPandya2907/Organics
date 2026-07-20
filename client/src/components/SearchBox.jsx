import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <form onSubmit={submitHandler} className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-fittree-text-light" size={18} strokeWidth={2} />
      <input
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search for organic products..."
        className="w-full bg-slate-100 border border-transparent rounded-xl py-3 pl-11 pr-[90px] focus:outline-none focus:bg-white focus:border-fittree-primary focus:ring-4 focus:ring-fittree-primary/10 transition-all placeholder-fittree-text-light text-fittree-text text-[14px] font-medium shadow-inner"
      />
      <button 
        type="submit" 
        className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-fittree-primary text-white text-[12px] font-bold px-4 py-1.5 rounded-lg hover:bg-fittree-primary-soft transition-colors shadow-sm"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBox;
