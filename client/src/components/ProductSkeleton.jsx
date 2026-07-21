const ProductSkeleton = () => {
  return (
    <div className="product-card animate-pulse bg-white">
      {/* Image Skeleton */}
      <div className="relative h-[220px] sm:h-[240px] bg-gradient-to-br from-fittree-sand to-fittree-bg rounded-t-2xl" />

      <div className="flex flex-col flex-1 p-4">
        {/* Region + Rating row */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 bg-fittree-sand rounded-md w-20" />
          <div className="h-4 bg-fittree-sand rounded-md w-10" />
        </div>

        {/* Title Skeleton */}
        <div className="h-4 bg-fittree-sand rounded-full w-full mb-2" />
        <div className="h-4 bg-fittree-sand rounded-full w-3/4 mb-4" />

        {/* Price + Button */}
        <div className="mt-auto pt-3 border-t border-fittree-border flex items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="h-5 bg-fittree-sand rounded-full w-16" />
            <div className="h-3 bg-fittree-sand rounded-full w-12" />
          </div>
          <div className="h-9 bg-fittree-sand rounded-xl w-20" />
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;

