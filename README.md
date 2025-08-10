# KEX E-commerce Platform

A full-stack e-commerce platform built with React Native (frontend) and Node.js/Express (backend), featuring modern UI/UX, secure authentication, payment processing, and comprehensive admin functionality.

## 🚀 Features

### Frontend (React Native)
- **Modern UI/UX**: Beautiful, responsive design with dark/light theme support
- **Authentication**: Complete user registration, login, and profile management
- **Product Browsing**: Advanced product search, filtering, and categorization
- **Shopping Cart**: Full cart functionality with quantity management
- **Product Details**: Rich product pages with image galleries, reviews, and variants
- **Checkout Process**: Streamlined checkout with address and payment management
- **Order Management**: Order tracking and history
- **User Profile**: Comprehensive profile management with settings
- **Wishlist**: Save and manage favorite products
- **Reviews & Ratings**: Product reviews and rating system
- **Skeleton Loading**: Smooth loading states for better UX

### Web Frontend (React.js)
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Modern UI**: Clean, accessible design with dark mode support
- **Performance Optimized**: Lazy loading, code splitting, and image optimization
- **Accessibility**: WCAG 2.1 AA compliant with screen reader support
- **PWA Ready**: Progressive Web App with offline support
- **SEO Optimized**: Meta tags, structured data, and sitemap
- **Reusable Components**: Modular component architecture
- **Fast Load Times**: Optimized bundle size and caching strategies

### Backend (Node.js/Express)
- **RESTful API**: Complete REST API with proper error handling
- **Authentication**: JWT-based authentication with refresh tokens
- **Cart Management**: Full shopping cart functionality with item management
- **Wishlist Management**: User wishlist with notes and priority levels
- **Database**: MongoDB with Mongoose ODM
- **Payment Processing**: Stripe integration for secure payments
- **Email System**: Transactional emails for orders and notifications
- **File Upload**: Cloudinary integration for image management
- **Admin Panel**: Comprehensive admin dashboard and management tools
- **Analytics**: Detailed sales, inventory, user, and product analytics
- **Security**: Rate limiting, input validation, and security middleware
- **Caching**: Redis integration for performance optimization

## 📱 Screenshots

*Screenshots will be added here*

## 🛠 Tech Stack

### Frontend
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools
- **React Navigation** - Navigation and routing
- **Context API** - State management
- **AsyncStorage** - Local data persistence
- **Vector Icons** - Icon library

### Web Frontend
- **React.js** - Modern web development
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - Object Data Modeling
- **JWT** - Authentication tokens
- **Stripe** - Payment processing
- **Nodemailer** - Email sending
- **Cloudinary** - Image upload and management
- **Redis** - Caching and sessions
- **Multer** - File upload handling

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud)
- **Expo CLI** (`npm install -g expo-cli`)
- **React Native development environment**

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/kex-ecommerce.git
cd kex-ecommerce
```

### 2. Install dependencies

#### Backend
```bash
cd server
npm install
```

#### Mobile Frontend
```bash
cd client
npm install
```

#### Web Frontend
```bash
cd web
npm install
```

### 3. Environment Setup

#### Backend Environment
```bash
cd server
cp env.example .env
```

Edit the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kex-ecommerce
JWT_SECRET=your-super-secret-jwt-key
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Frontend Environment
The frontend uses the API configuration in `client/src/config/api.js`. Update the `API_BASE_URL` for your environment.

### 4. Database Setup
```bash
# Start MongoDB (if running locally)
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env file
```

### 5. Start the development servers

#### Backend
```bash
cd server
npm run dev
```

#### Frontend
```bash
cd client
expo start
```

## 📱 Running the App

### Using Expo Go (Recommended for development)
1. Install Expo Go on your mobile device
2. Scan the QR code from the terminal
3. The app will load on your device

### Using Simulator/Emulator
```bash
# iOS Simulator
expo start --ios

# Android Emulator
expo start --android
```

## 🏗 Project Structure

```
kex-ecommerce/
├── client/                 # React Native frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── screens/        # Screen components
│   │   ├── context/        # React Context providers
│   │   ├── config/         # Configuration files
│   │   ├── utils/          # Utility functions
│   │   └── assets/         # Images, fonts, etc.
│   ├── App.js             # Main app component
│   └── package.json       # Frontend dependencies
├── server/                # Node.js backend
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   ├── index.js           # Server entry point
│   └── package.json       # Backend dependencies
├── admin/                 # Admin dashboard (future)
└── README.md             # Project documentation
```

## 🔧 Configuration

### API Configuration
Update `client/src/config/api.js`:
```javascript
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000' 
  : 'https://your-production-api.com';
```

### Database Configuration
The app uses MongoDB. Configure your connection in `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/kex-ecommerce
```

### Payment Configuration
Set up Stripe in `server/.env`:
```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Product Endpoints
- `GET /api/products` - Get all products with filtering
- `GET /api/products/:id` - Get product details
- `POST /api/products/:id/reviews` - Add product review
- `GET /api/categories` - Get product categories

### Order Endpoints
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/change-password` - Change password
- `GET /api/users/addresses` - Get user addresses
- `POST /api/users/addresses` - Add new address

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Password Hashing** using bcrypt
- **Input Validation** with express-validator
- **Rate Limiting** to prevent abuse
- **CORS Configuration** for cross-origin requests
- **Helmet.js** for security headers
- **SQL Injection Protection** (MongoDB)
- **XSS Protection** with input sanitization

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

## 📦 Deployment

### Backend Deployment (Heroku)
```bash
cd server
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-production-mongodb-uri
git push heroku main
```

### Frontend Deployment (Expo)
```bash
cd client
expo build:android  # For Android
expo build:ios      # For iOS
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/kex-ecommerce/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [React Navigation](https://reactnavigation.org/) for navigation solutions
- [Stripe](https://stripe.com/) for payment processing
- [MongoDB](https://www.mongodb.com/) for the database
- [Cloudinary](https://cloudinary.com/) for image management

## 📈 Roadmap

- [ ] Admin dashboard with analytics
- [ ] Push notifications
- [ ] Social media login
- [ ] Multi-language support
- [ ] Advanced search with Elasticsearch
- [ ] Real-time chat support
- [ ] Advanced inventory management
- [ ] Subscription/membership features
- [ ] Mobile app store deployment
- [ ] Performance optimization
- [ ] Unit and integration tests
- [ ] CI/CD pipeline setup

---

**Made with ❤️ by the KEX Development Team** 