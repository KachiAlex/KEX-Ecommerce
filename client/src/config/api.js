// API Configuration
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000' 
  : 'https://your-production-api.com';

// Common headers for API requests
export const getHeaders = (token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  REFRESH_TOKEN: '/api/auth/refresh',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
  
  // User
  PROFILE: '/api/users/profile',
  UPDATE_PROFILE: '/api/users/profile',
  CHANGE_PASSWORD: '/api/users/change-password',
  ADDRESSES: '/api/users/addresses',
  PAYMENT_METHODS: '/api/users/payment-methods',
  
  // Products
  PRODUCTS: '/api/products',
  PRODUCT_DETAIL: (id) => `/api/products/${id}`,
  PRODUCT_REVIEWS: (id) => `/api/products/${id}/reviews`,
  CATEGORIES: '/api/categories',
  
  // Orders
  ORDERS: '/api/orders',
  ORDER_DETAIL: (id) => `/api/orders/${id}`,
  ORDER_STATUS: (id) => `/api/orders/${id}/status`,
  
  // Payments
  CREATE_PAYMENT_INTENT: '/api/payments/create-intent',
  CONFIRM_PAYMENT: '/api/payments/confirm',
  
  // Admin
  ADMIN_DASHBOARD: '/api/admin/dashboard',
  ADMIN_USERS: '/api/admin/users',
  ADMIN_PRODUCTS: '/api/admin/products',
  ADMIN_ORDERS: '/api/admin/orders',
  
  // Promo Codes
  VALIDATE_PROMO: '/api/promo-codes/validate',
};

// Error handling
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.message || 'Bad request';
      case 401:
        return 'Unauthorized. Please login again.';
      case 403:
        return 'Access denied. You don\'t have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 422:
        return data.message || 'Validation error';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return data.message || 'An error occurred';
    }
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your connection.';
  } else {
    // Other error
    return error.message || 'An unexpected error occurred';
  }
};

// Request timeout
export const REQUEST_TIMEOUT = 10000; // 10 seconds

// Retry configuration
export const RETRY_CONFIG = {
  retries: 3,
  retryDelay: 1000,
  retryCondition: (error) => {
    // Retry on network errors or 5xx server errors
    return !error.response || (error.response.status >= 500 && error.response.status < 600);
  }
};
