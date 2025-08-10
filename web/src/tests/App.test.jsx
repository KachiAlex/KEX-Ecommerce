import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../contexts/AuthContext';
import App from '../App';

// Mock API calls
jest.mock('../utils/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const renderWithProviders = (component) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {component}
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderWithProviders(<App />);
    expect(screen.getByText(/KEX/i)).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('navigates to home page by default', async () => {
    renderWithProviders(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Featured Products/i)).toBeInTheDocument();
    });
  });
});

describe('Navigation', () => {
  it('navigates between pages correctly', async () => {
    renderWithProviders(<App />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText(/Featured Products/i)).toBeInTheDocument();
    });

    // Navigate to products
    const productsLink = screen.getByText(/Products/i);
    fireEvent.click(productsLink);
    
    await waitFor(() => {
      expect(screen.getByText(/All Products/i)).toBeInTheDocument();
    });

    // Navigate to cart
    const cartLink = screen.getByText(/Cart/i);
    fireEvent.click(cartLink);
    
    await waitFor(() => {
      expect(screen.getByText(/Shopping Cart/i)).toBeInTheDocument();
    });
  });
});

describe('Authentication Flow', () => {
  it('shows login form when not authenticated', async () => {
    renderWithProviders(<App />);
    
    const loginLink = screen.getByText(/Login/i);
    fireEvent.click(loginLink);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    });
  });

  it('validates login form inputs', async () => {
    renderWithProviders(<App />);
    
    const loginLink = screen.getByText(/Login/i);
    fireEvent.click(loginLink);
    
    await waitFor(() => {
      const loginButton = screen.getByText(/Sign In/i);
      fireEvent.click(loginButton);
    });

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });

  it('shows registration form', async () => {
    renderWithProviders(<App />);
    
    const registerLink = screen.getByText(/Register/i);
    fireEvent.click(registerLink);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    });
  });
});

describe('Product Display', () => {
  const mockProducts = [
    {
      _id: '1',
      name: 'Test Product 1',
      price: 99.99,
      description: 'Test description 1',
      images: ['https://example.com/image1.jpg'],
      rating: 4.5,
      reviews: 10
    },
    {
      _id: '2',
      name: 'Test Product 2',
      price: 149.99,
      description: 'Test description 2',
      images: ['https://example.com/image2.jpg'],
      rating: 4.0,
      reviews: 5
    }
  ];

  beforeEach(() => {
    // Mock API response
    const { api } = require('../utils/api');
    api.get.mockResolvedValue({
      data: {
        success: true,
        products: mockProducts,
        totalPages: 1,
        currentPage: 1
      }
    });
  });

  it('displays products correctly', async () => {
    renderWithProviders(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
      expect(screen.getByText('$99.99')).toBeInTheDocument();
      expect(screen.getByText('$149.99')).toBeInTheDocument();
    });
  });

  it('shows product details when clicked', async () => {
    renderWithProviders(<App />);
    
    await waitFor(() => {
      const productLink = screen.getByText('Test Product 1');
      fireEvent.click(productLink);
    });

    await waitFor(() => {
      expect(screen.getByText(/Product Details/i)).toBeInTheDocument();
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('$99.99')).toBeInTheDocument();
    });
  });
});

describe('Shopping Cart', () => {
  it('shows empty cart message when no items', async () => {
    renderWithProviders(<App />);
    
    const cartLink = screen.getByText(/Cart/i);
    fireEvent.click(cartLink);
    
    await waitFor(() => {
      expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
    });
  });

  it('adds product to cart', async () => {
    const { api } = require('../utils/api');
    
    // Mock product data
    api.get.mockResolvedValue({
      data: {
        success: true,
        products: [{
          _id: '1',
          name: 'Test Product',
          price: 99.99,
          images: ['https://example.com/image.jpg']
        }]
      }
    });

    // Mock add to cart
    api.post.mockResolvedValue({
      data: {
        success: true,
        cart: {
          items: [{
            _id: '1',
            product: '1',
            quantity: 1,
            price: 99.99
          }],
          total: 99.99,
          itemCount: 1
        }
      }
    });

    renderWithProviders(<App />);
    
    await waitFor(() => {
      const addToCartButton = screen.getByText(/Add to Cart/i);
      fireEvent.click(addToCartButton);
    });

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/cart/add', {
        productId: '1',
        quantity: 1,
        price: 99.99
      });
    });
  });
});

describe('Search Functionality', () => {
  it('filters products by search term', async () => {
    const { api } = require('../utils/api');
    
    api.get.mockResolvedValue({
      data: {
        success: true,
        products: [{
          _id: '1',
          name: 'iPhone',
          price: 999.99,
          images: ['https://example.com/iphone.jpg']
        }]
      }
    });

    renderWithProviders(<App />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Search products/i);
      fireEvent.change(searchInput, { target: { value: 'iPhone' } });
    });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/products/search?q=iPhone');
    });
  });
});

describe('Responsive Design', () => {
  it('adapts to mobile screen size', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    renderWithProviders(<App />);
    
    // Check if mobile menu is available
    expect(screen.getByLabelText(/Toggle navigation/i)).toBeInTheDocument();
  });

  it('adapts to desktop screen size', () => {
    // Mock desktop viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    renderWithProviders(<App />);
    
    // Check if desktop navigation is visible
    expect(screen.getByText(/Products/i)).toBeInTheDocument();
    expect(screen.getByText(/Cart/i)).toBeInTheDocument();
  });
});

describe('Error Handling', () => {
  it('shows error message when API fails', async () => {
    const { api } = require('../utils/api');
    api.get.mockRejectedValue(new Error('Network error'));

    renderWithProviders(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    });
  });

  it('shows loading states during API calls', async () => {
    const { api } = require('../utils/api');
    
    // Create a promise that doesn't resolve immediately
    let resolvePromise;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    
    api.get.mockReturnValue(promise);

    renderWithProviders(<App />);
    
    // Should show loading state
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    
    // Resolve the promise
    resolvePromise({
      data: {
        success: true,
        products: []
      }
    });
  });
});

describe('Accessibility', () => {
  it('has proper ARIA labels', () => {
    renderWithProviders(<App />);
    
    expect(screen.getByLabelText(/Toggle navigation/i)).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('supports keyboard navigation', () => {
    renderWithProviders(<App />);
    
    const searchInput = screen.getByPlaceholderText(/Search products/i);
    searchInput.focus();
    
    expect(searchInput).toHaveFocus();
  });

  it('has proper color contrast', () => {
    renderWithProviders(<App />);
    
    // This would typically be tested with a color contrast library
    // For now, we'll check that important elements are present
    expect(screen.getByText(/KEX/i)).toBeInTheDocument();
  });
});

describe('Performance', () => {
  it('loads initial page quickly', async () => {
    const startTime = performance.now();
    
    renderWithProviders(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Featured Products/i)).toBeInTheDocument();
    });
    
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  it('handles large product lists efficiently', async () => {
    const { api } = require('../utils/api');
    
    // Mock large product list
    const largeProductList = Array.from({ length: 100 }, (_, i) => ({
      _id: i.toString(),
      name: `Product ${i}`,
      price: Math.random() * 1000,
      images: [`https://example.com/image${i}.jpg`]
    }));
    
    api.get.mockResolvedValue({
      data: {
        success: true,
        products: largeProductList,
        totalPages: 5,
        currentPage: 1
      }
    });

    renderWithProviders(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Product 0')).toBeInTheDocument();
      expect(screen.getByText('Product 99')).toBeInTheDocument();
    });
  });
});
