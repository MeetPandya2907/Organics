const ProductSkeleton = () => {
  return (
    <div className="product-card animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3] bg-fittree-bg rounded-xl mb-4"></div>
      
      <div className="flex flex-col flex-1">
        {/* Title Skeleton */}
        <div className="h-4 bg-fittree-bg rounded-full w-3/4 mb-2"></div>
        <div className="h-4 bg-fittree-bg rounded-full w-1/2 mb-6"></div>
        
        {/* Price Skeleton */}
        <div className="h-4 bg-fittree-bg rounded-full w-1/3 mb-4"></div>
        
        {/* Button Skeleton */}
        <div className="mt-auto pt-2">
          <div className="h-10 bg-fittree-bg rounded-lg w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
