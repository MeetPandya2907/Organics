import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useStore } from '../store/useStore';

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { products } = useStore();
  const ref = useRef(null);

  // Filter products live as keyword changes
  useEffect(() => {
    const q = keyword.trim().toLowerCase();
    if (q.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    const filtered = products
      .filter(
        (p) =>
          p.price > 0 &&
          p.name !== 'Sample name' &&
          p.name.toLowerCase().includes(q)
      )
      .slice(0, 6);
    setSuggestions(filtered);
    setOpen(filtered.length > 0);
  }, [keyword, products]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    setOpen(false);
    if (keyword.trim()) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword('');
    } else {
      navigate('/products');
    }
  };

  const selectSuggestion = (product) => {
    setOpen(false);
    setKeyword('');
    navigate(`/product/${product._id}`);
  };

  return (
    <div ref={ref} className="relative w-full">
      <form onSubmit={submitHandler} className="relative w-full">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-fittree-text-light pointer-events-none"
          size={18}
          strokeWidth={2}
        />
        <input
          type="text"
          name="q"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="Search for organic products..."
          autoComplete="off"
          className="w-full bg-slate-100 border border-transparent rounded-xl py-3 pl-11 pr-[90px] focus:outline-none focus:bg-white focus:border-fittree-primary focus:ring-4 focus:ring-fittree-primary/10 transition-all placeholder-fittree-text-light text-fittree-text text-[14px] font-medium shadow-inner"
        />
        {keyword && (
          <button
            type="button"
            onClick={() => { setKeyword(''); setSuggestions([]); setOpen(false); }}
            className="absolute right-[72px] top-1/2 -translate-y-1/2 text-fittree-text-light hover:text-fittree-text transition-colors"
          >
            <X size={15} />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-fittree-primary text-white text-[12px] font-bold px-4 py-1.5 rounded-lg hover:bg-fittree-primary-soft transition-colors shadow-sm"
        >
          Search
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-fittree-border rounded-2xl shadow-xl z-[999] overflow-hidden">
          <div className="px-4 py-2 border-b border-fittree-border">
            <span className="text-[10px] font-bold uppercase tracking-widest text-fittree-text-light">
              Suggestions
            </span>
          </div>
          {suggestions.map((product) => (
            <button
              key={product._id}
              type="button"
              onClick={() => selectSuggestion(product)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-fittree-light text-left transition-colors group border-b border-fittree-border/50 last:border-0"
            >
              <div className="w-10 h-10 rounded-lg bg-fittree-sand overflow-hidden shrink-0 border border-fittree-border">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-bold text-fittree-text truncate group-hover:text-fittree-primary transition-colors">
                  {product.name}
                </p>
                <p className="text-[11px] text-fittree-text-light font-semibold">
                  ₹{product.price} · {product.category}
                </p>
              </div>
              <Search size={14} className="text-fittree-text-light shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
          <button
            type="button"
            onClick={submitHandler}
            className="w-full px-4 py-3 text-center text-[12px] font-bold text-fittree-primary hover:bg-fittree-light transition-colors"
          >
            See all results for "{keyword}" →
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBox;
