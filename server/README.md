# KEX E-commerce Server

A clean, modern Express.js server for the KEX E-commerce platform.

## Features

- ✅ **Clean Architecture** - Simple, maintainable code structure
- ✅ **Security** - Helmet, CORS, Rate limiting
- ✅ **Performance** - Compression, Morgan logging
- ✅ **Mock APIs** - Ready-to-use endpoints for development
- ✅ **Logo Integration** - Serves the KEX logo at `/assets/logo.png`
- ✅ **Health Check** - `/api/health` endpoint for monitoring

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   copy env.example .env
   ```

3. **Start the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `GET /api/search?q=query` - Search products

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add item to cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order

### Categories
- `GET /api/categories` - Get all categories

## Demo Credentials

For testing the login endpoint:
- Email: `demo@kex.com`
- Password: `password`

## Logo Access

The KEX logo is available at:
- `http://localhost:5000/assets/logo.png`

## Development

The server runs on port 5000 by default and includes:
- Hot reloading with nodemon
- CORS enabled for frontend integration
- Comprehensive error handling
- Mock data for immediate testing

## Next Steps

This server provides a solid foundation. You can extend it by:
1. Adding MongoDB integration
2. Implementing real authentication with JWT
3. Adding file upload capabilities
4. Integrating payment gateways
5. Adding email functionality
