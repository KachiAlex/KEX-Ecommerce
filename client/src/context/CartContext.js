import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    saveCart();
  }, [cartItems]);

  const loadCart = async () => {
    try {
      const storedCart = await AsyncStorage.getItem('kex_cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem('kex_cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      
      if (existingItem) {
        // Update quantity if item already exists
        const updatedItems = prevItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        
        Toast.show({
          type: 'success',
          text1: 'Cart Updated',
          text2: `${product.name} quantity updated`,
        });
        
        return updatedItems;
      } else {
        // Add new item
        const newItem = {
          ...product,
          quantity,
          addedAt: new Date().toISOString(),
        };
        
        Toast.show({
          type: 'success',
          text1: 'Added to Cart',
          text2: `${product.name} added to your cart`,
        });
        
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item._id === productId);
      const updatedItems = prevItems.filter(item => item._id !== productId);
      
      if (itemToRemove) {
        Toast.show({
          type: 'info',
          text1: 'Removed from Cart',
          text2: `${itemToRemove.name} removed from cart`,
        });
      }
      
      return updatedItems;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    Toast.show({
      type: 'info',
      text1: 'Cart Cleared',
      text2: 'All items removed from cart',
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discountPrice || item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartItems = () => {
    return cartItems;
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item._id === productId);
  };

  const getItemQuantity = (productId) => {
    const item = cartItems.find(item => item._id === productId);
    return item ? item.quantity : 0;
  };

  const moveToWishlist = (productId) => {
    const item = cartItems.find(item => item._id === productId);
    if (item) {
      removeFromCart(productId);
      // Note: This would need to be integrated with a wishlist context
      Toast.show({
        type: 'success',
        text1: 'Moved to Wishlist',
        text2: `${item.name} moved to wishlist`,
      });
    }
  };

  const applyCoupon = (couponCode) => {
    // This would integrate with backend coupon validation
    Toast.show({
      type: 'info',
      text1: 'Coupon Applied',
      text2: 'Discount applied to your order',
    });
  };

  const removeCoupon = () => {
    Toast.show({
      type: 'info',
      text1: 'Coupon Removed',
      text2: 'Discount removed from your order',
    });
  };

  const checkout = async (orderData) => {
    try {
      // This would integrate with backend checkout process
      const order = {
        items: cartItems,
        total: getCartTotal(),
        ...orderData,
      };

      // Clear cart after successful checkout
      clearCart();

      Toast.show({
        type: 'success',
        text1: 'Order Placed!',
        text2: 'Your order has been placed successfully',
      });

      return { success: true, order };
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Checkout Failed',
        text2: 'Please try again',
      });

      return { success: false, error: error.message };
    }
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    getCartItems,
    isInCart,
    getItemQuantity,
    moveToWishlist,
    applyCoupon,
    removeCoupon,
    checkout,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 