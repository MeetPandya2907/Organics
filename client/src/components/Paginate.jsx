import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 && (
      <div className="flex justify-center gap-3 mt-12">
        {[...Array(pages).keys()].map((x) => (
          <Link
            key={x + 1}
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/page/${x + 1}`
                  : `/page/${x + 1}`
                : `/admin/productlist/${x + 1}`
            }
            className={`w-10 h-10 flex items-center justify-center rounded-xl font-semibold transition-all duration-300 border ${
              x + 1 === page
                ? 'bg-fittree-primary text-white border-fittree-primary shadow-sm'
                : 'bg-white text-fittree-text border-fittree-border hover:border-fittree-primary hover:text-fittree-primary'
            }`}
          >
            {x + 1}
          </Link>
        ))}
      </div>
    )
  );
};

export default Paginate;
