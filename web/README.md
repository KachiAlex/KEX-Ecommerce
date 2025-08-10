# KEX E-commerce Web Frontend

A modern, responsive React.js web application for the KEX e-commerce platform, built with TailwindCSS and optimized for performance and accessibility.

## 🚀 Features

### Core Features
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Dark Mode**: Complete dark/light theme support
- **Authentication**: Login, register, password reset
- **Product Management**: Browse, search, filter, and view products
- **Shopping Cart**: Add, remove, and manage cart items
- **Checkout Process**: Complete checkout with payment integration
- **Order Management**: View and track orders
- **Wishlist**: Save favorite products
- **User Profile**: Manage account settings and preferences

### Technical Features
- **Performance Optimized**: 
  - Lazy loading with React.lazy()
  - Image optimization and compression
  - Code splitting and bundle optimization
  - Skeleton loading states
- **Accessibility**: 
  - WCAG 2.1 AA compliant
  - Screen reader support
  - Keyboard navigation
  - High contrast ratios
- **SEO Optimized**: 
  - Meta tags and Open Graph
  - Structured data
  - Sitemap generation
- **PWA Ready**: 
  - Service worker
  - Offline support
  - App-like experience

## 🛠 Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: React Query + Context API
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Testing**: Jest + React Testing Library

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kex-ecommerce/web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   ├── layout/         # Layout components (Header, Footer, etc.)
│   └── features/       # Feature-specific components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── utils/              # Utility functions
├── styles/             # Global styles and TailwindCSS
└── assets/             # Static assets (images, icons)
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#0ea5e9) - Main brand color
- **Secondary**: Yellow (#eab308) - Accent color
- **Success**: Green (#22c55e) - Success states
- **Warning**: Orange (#f59e0b) - Warning states
- **Error**: Red (#ef4444) - Error states
- **Gray**: Neutral grays for text and backgrounds

### Typography
- **Primary Font**: Inter (Sans-serif)
- **Display Font**: Poppins (Headings)
- **Font Sizes**: Responsive scale from 12px to 48px

### Components
- **Buttons**: Primary, secondary, outline, ghost variants
- **Inputs**: Text, email, password, select, textarea
- **Cards**: Product cards, info cards, feature cards
- **Modals**: Confirmation, forms, product quick view
- **Navigation**: Header, footer, breadcrumbs, pagination

## 🔧 Configuration

### TailwindCSS
The project uses a custom TailwindCSS configuration with:
- Extended color palette
- Custom animations
- Responsive breakpoints
- Dark mode support
- Custom components and utilities

### Vite Configuration
- React plugin
- PWA support
- API proxy for development
- Code splitting optimization
- Build optimization

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

## ♿ Accessibility

### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 ratio
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and roles
- **Focus Management**: Visible focus indicators
- **Semantic HTML**: Proper heading structure and landmarks

### Accessibility Features
- Skip to main content links
- Alt text for all images
- Form labels and error messages
- Loading states and announcements
- Reduced motion support

## 🚀 Performance

### Optimization Strategies
- **Code Splitting**: Route-based and component-based
- **Lazy Loading**: Images and components
- **Caching**: React Query for API data
- **Bundle Optimization**: Tree shaking and minification
- **Image Optimization**: WebP format and responsive images

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🧪 Testing

### Test Structure
```bash
npm run test          # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Testing Strategy
- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: API integration and user flows
- **E2E Tests**: Critical user journeys (planned)

## 📦 Deployment

### Build Process
```bash
npm run build        # Create production build
npm run preview      # Preview production build
```

### Deployment Options
- **Vercel**: Recommended for React apps
- **Netlify**: Static site hosting
- **AWS S3 + CloudFront**: Scalable hosting
- **Docker**: Containerized deployment

## 🔒 Security

### Security Measures
- **HTTPS**: Enforced in production
- **CSP**: Content Security Policy headers
- **XSS Protection**: Input sanitization
- **CSRF Protection**: Token-based protection
- **Environment Variables**: Secure configuration management

## 📈 Analytics & Monitoring

### Analytics Integration
- **Google Analytics**: User behavior tracking
- **Error Tracking**: Sentry integration
- **Performance Monitoring**: Core Web Vitals tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type safety (planned)
- **Conventional Commits**: Commit message format

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

Built with ❤️ by the KEX Team
