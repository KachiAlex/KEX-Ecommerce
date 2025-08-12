import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';

const ProductsPage = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock product data
  const mockProducts = [
    {
      _id: '1',
      name: 'Wireless Bluetooth Headphones',
      price: 99.99,
      discountPrice: 79.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      rating: 4.5,
      reviews: 128,
      stock: 15,
      category: 'Audio'
    },
    {
      _id: '2',
      name: 'Smart Fitness Watch',
      price: 199.99,
      discountPrice: null,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 256,
      stock: 8,
      category: 'Wearables'
    },
    {
      _id: '3',
      name: 'Portable Bluetooth Speaker',
      price: 59.99,
      discountPrice: 49.99,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
      rating: 4.2,
      reviews: 89,
      stock: 25,
      category: 'Audio'
    },
    {
      _id: '4',
      name: 'Wireless Charging Pad',
      price: 39.99,
      discountPrice: null,
      image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop',
      rating: 4.0,
      reviews: 67,
      stock: 0,
      category: 'Charging'
    },
    {
      _id: '5',
      name: 'Smart Home Hub',
      price: 149.99,
      discountPrice: 129.99,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      rating: 4.6,
      reviews: 203,
      stock: 12,
      category: 'Smart Home'
    },
    {
      _id: '6',
      name: '4K Action Camera',
      price: 299.99,
      discountPrice: 249.99,
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop',
      rating: 4.7,
      reviews: 156,
      stock: 6,
      category: 'Cameras'
    }
  ];

  const categories = ['all', ...new Set(mockProducts.map(product => product.category))];
  
  const filteredProducts = selectedCategory === 'all' 
    ? mockProducts 
    : mockProducts.filter(product => product.category === selectedCategory);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleAddToWishlist = (product) => {
    // TODO: Implement wishlist functionality
    console.log('Added to wishlist:', product.name);
  };

  const handleQuickView = (product) => {
    // TODO: Implement quick view modal
    console.log('Quick view:', product.name);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Our Products
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover amazing smart gadgets and electronics
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              onQuickView={handleQuickView}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try selecting a different category or check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
