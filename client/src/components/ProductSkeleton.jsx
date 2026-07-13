const ProductSkeleton = () => {
  return (
    <div className="flex flex-col bg-paper rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/5] bg-slate-200/50"></div>
      
      <div className="p-6 flex flex-col flex-1 bg-white">
        {/* Stars Skeleton */}
        <div className="flex gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-slate-100"></div>
          ))}
        </div>
        
        {/* Title Skeleton */}
        <div className="h-5 bg-slate-200 rounded-md w-3/4 mb-2"></div>
        <div className="h-5 bg-slate-200 rounded-md w-1/2 mb-6"></div>
        
        {/* Price Skeleton */}
        <div className="flex flex-col mt-auto pt-4 border-t border-slate-50">
          <div className="h-3 bg-slate-100 rounded-md w-1/4 mb-2"></div>
          <div className="h-6 bg-slate-200 rounded-md w-1/3"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
