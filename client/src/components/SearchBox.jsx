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
    <form onSubmit={submitHandler} className="relative flex-1 md:w-64">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-fittree-text-light" size={16} strokeWidth={2} />
      <input
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search products..."
        className="w-full bg-white border border-fittree-border rounded-full py-2.5 pl-10 pr-4 focus:border-fittree-primary outline-none transition-all placeholder-fittree-text-light text-fittree-text text-sm font-medium shadow-sm"
      />
    </form>
  );
};

export default SearchBox;
