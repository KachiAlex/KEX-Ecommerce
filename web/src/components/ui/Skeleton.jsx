import React from 'react';
import { cn } from '../../utils/cn';

const Skeleton = React.forwardRef(({
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'animate-pulse rounded bg-gray-200 dark:bg-gray-700',
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
});

Skeleton.displayName = 'Skeleton';

// Product Card Skeleton
export const ProductCardSkeleton = () => (
  <div className="card-hover">
    <Skeleton className="aspect-square rounded-t-xl" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-3 w-1/4" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-4 h-4 rounded" />
        ))}
        <Skeleton className="h-3 w-8 ml-1" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  </div>
);

// Product Grid Skeleton
export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(count)].map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

// Category Card Skeleton
export const CategoryCardSkeleton = () => (
  <div className="card-hover p-6 text-center">
    <Skeleton className="w-16 h-16 mx-auto mb-4 rounded-full" />
    <Skeleton className="h-4 w-24 mx-auto" />
  </div>
);

// Banner Skeleton
export const BannerSkeleton = () => (
  <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
    <Skeleton className="w-full h-full" />
    <div className="absolute inset-0 p-6 flex flex-col justify-end">
      <Skeleton className="h-6 w-1/3 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

// Review Skeleton
export const ReviewSkeleton = () => (
  <div className="border-b border-gray-200 dark:border-gray-700 py-4">
    <div className="flex items-center space-x-3 mb-2">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-4 w-24 mb-1" />
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-3 h-3 rounded" />
          ))}
        </div>
      </div>
    </div>
    <Skeleton className="h-4 w-full mb-1" />
    <Skeleton className="h-4 w-3/4" />
  </div>
);

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 4 }) => (
  <tr>
    {[...Array(columns)].map((_, i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

// Form Skeleton
export const FormSkeleton = ({ fields = 4 }) => (
  <div className="space-y-4">
    {[...Array(fields)].map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
    ))}
    <Skeleton className="h-10 w-32" />
  </div>
);

// Profile Skeleton
export const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center space-x-4">
      <Skeleton className="w-20 h-20 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="card p-4 text-center">
          <Skeleton className="h-8 w-8 mx-auto mb-2" />
          <Skeleton className="h-4 w-16 mx-auto mb-1" />
          <Skeleton className="h-3 w-12 mx-auto" />
        </div>
      ))}
    </div>
  </div>
);

// Cart Item Skeleton
export const CartItemSkeleton = () => (
  <div className="flex items-center space-x-4 p-4 border-b border-gray-200 dark:border-gray-700">
    <Skeleton className="w-16 h-16 rounded-lg" />
    <div className="flex-1">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <div className="flex items-center space-x-2">
      <Skeleton className="w-8 h-8 rounded" />
      <Skeleton className="h-4 w-12" />
      <Skeleton className="w-8 h-8 rounded" />
    </div>
  </div>
);

export default Skeleton;
