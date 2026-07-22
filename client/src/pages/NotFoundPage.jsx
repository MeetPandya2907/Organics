import { Link } from 'react-router-dom';
import { Leaf, ArrowRight, Search } from 'lucide-react';
import Meta from '../components/Meta';

const NotFoundPage = () => {
  return (
    <div className="bg-fittree-bg min-h-screen flex items-center justify-center px-6 pt-[130px] pb-16">
      <Meta title="FitTree Organics | Page Not Found" />
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 bg-fittree-primary/10 text-fittree-primary rounded-full flex items-center justify-center mx-auto mb-8">
          <Leaf size={36} strokeWidth={1.5} />
        </div>
        <span className="block font-display font-extrabold text-fittree-primary text-7xl mb-4 leading-none">404</span>
        <h1 className="text-2xl md:text-3xl font-bold text-fittree-text mb-3">This aisle doesn't exist</h1>
        <p className="text-fittree-text-light font-medium mb-10 leading-relaxed">
          The page you're looking for has been moved, sold out, or never existed. Let's get you back to the pantry.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="btn btn-primary">
            Back to Home <ArrowRight size={16} />
          </Link>
          <Link to="/products" className="flex items-center gap-2 bg-white border border-fittree-border hover:border-fittree-primary text-fittree-text font-bold px-6 py-3.5 rounded-xl shadow-sm transition-all">
            <Search size={16} /> Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
