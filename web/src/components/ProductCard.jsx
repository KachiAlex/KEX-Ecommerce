import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { cn } from '../utils/cn';
import Button from './ui/Button';

const ProductCardSkeleton = () => (
  <div className="card-hover animate-pulse">
    <div className="aspect-square bg-gray-200 rounded-t-xl" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-6 bg-gray-200 rounded w-1/3" />
      <div className="h-8 bg-gray-200 rounded" />
    </div>
  </div>
);

const ProductCard = ({
  product,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  isInWishlist = false,
  loading = false,
  className,
  ...props
}) => {
  if (loading) {
    return <ProductCardSkeleton />;
  }

  const {
    _id,
    name,
    price,
    discountPrice,
    image,
    rating = 0,
    reviews = 0,
    stock = 0,
    category,
  } = product;

  const discountPercentage = discountPrice 
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  const isOutOfStock = stock <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('card-hover group', className)}
      {...props}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-error-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            -{discountPercentage}%
          </div>
        )}
        
        {/* Out of Stock Badge */}
        {isOutOfStock && (
          <div className="absolute top-2 right-2 bg-gray-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Out of Stock
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="ghost"
              size="sm"
              className="bg-white text-gray-700 hover:bg-gray-100"
              onClick={() => onQuickView?.(product)}
              aria-label={`Quick view ${name}`}
            >
              <Eye className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="bg-white text-gray-700 hover:bg-gray-100"
              onClick={() => onAddToWishlist?.(product)}
              aria-label={isInWishlist ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
            >
              <Heart 
                className={cn(
                  "w-4 h-4",
                  isInWishlist ? "fill-red-500 text-red-500" : "text-gray-700"
                )} 
              />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          {category}
        </p>
        
        {/* Product Name */}
        <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2 min-h-[2.5rem]">
          {name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center space-x-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < Math.floor(rating) 
                    ? "fill-yellow-400 text-yellow-400" 
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            ({reviews})
          </span>
        </div>
        
        {/* Price */}
        <div className="flex items-center space-x-2">
          {discountPrice ? (
            <>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                ${discountPrice}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ${price}
              </span>
            </>
          ) : (
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              ${price}
            </span>
          )}
        </div>
        
        {/* Add to Cart Button */}
        <Button
          variant="primary"
          size="sm"
          fullWidth
          disabled={isOutOfStock}
          onClick={() => onAddToCart?.(product)}
          className="group-hover:bg-primary-700"
          aria-label={`Add ${name} to cart`}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
