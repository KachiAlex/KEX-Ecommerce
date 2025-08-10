# KEX E-commerce - Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Deployment](#backend-deployment)
3. [Web Frontend Deployment](#web-frontend-deployment)
4. [Mobile App Deployment](#mobile-app-deployment)
5. [Environment Configuration](#environment-configuration)
6. [SSL & Security](#ssl--security)
7. [Monitoring & Analytics](#monitoring--analytics)
8. [Post-Deployment Checklist](#post-deployment-checklist)

## Prerequisites

### Required Accounts & Services
- **Backend Hosting**: Railway, Render, or Heroku
- **Web Hosting**: Vercel or Netlify
- **Mobile App Stores**: Google Play Console & Apple App Store Connect
- **Database**: MongoDB Atlas
- **File Storage**: Cloudinary
- **Payment Processing**: Stripe
- **Email Service**: SendGrid or AWS SES
- **Domain**: Custom domain for web app
- **SSL Certificate**: Let's Encrypt or hosting provider SSL

### Development Environment
- Node.js 18+ installed
- Git configured
- Expo CLI installed (`npm install -g @expo/cli`)
- Android Studio (for Android builds)
- Xcode (for iOS builds, macOS only)

## Backend Deployment

### Option 1: Railway (Recommended)

1. **Create Railway Account**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   railway login
   ```

2. **Initialize Project**
   ```bash
   cd server
   railway init
   ```

3. **Configure Environment Variables**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set MONGODB_URI=your_mongodb_atlas_uri
   railway variables set JWT_SECRET=your_jwt_secret
   railway variables set STRIPE_SECRET_KEY=your_stripe_secret_key
   railway variables set CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   railway variables set CLOUDINARY_API_KEY=your_cloudinary_key
   railway variables set CLOUDINARY_API_SECRET=your_cloudinary_secret
   railway variables set EMAIL_SERVICE_API_KEY=your_email_service_key
   ```

4. **Deploy**
   ```bash
   railway up
   ```

### Option 2: Render

1. **Connect Repository**
   - Link your GitHub repository to Render
   - Create new Web Service

2. **Configure Build Settings**
   ```bash
   Build Command: npm install
   Start Command: npm start
   Root Directory: server
   ```

3. **Set Environment Variables**
   - Add all required environment variables in Render dashboard

4. **Deploy**
   - Render will automatically deploy on git push

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   cd server
   heroku create kex-ecommerce-api
   ```

3. **Configure Environment**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   # Add all other environment variables
   ```

4. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push heroku main
   ```

## Web Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Configure Project**
   ```bash
   cd web
   vercel
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add VITE_API_URL your_backend_url
   vercel env add VITE_STRIPE_PUBLIC_KEY your_stripe_public_key
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

1. **Build Project**
   ```bash
   cd web
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop `dist` folder to Netlify
   - Or connect GitHub repository for automatic deployments

3. **Configure Environment Variables**
   - Add environment variables in Netlify dashboard

### Custom Domain Setup

1. **Add Custom Domain**
   ```bash
   # Vercel
   vercel domains add yourdomain.com
   
   # Netlify
   # Add in Netlify dashboard
   ```

2. **Configure DNS**
   - Point domain to hosting provider
   - Enable SSL certificate

## Mobile App Deployment

### Android App Store (Google Play)

1. **Build Android APK**
   ```bash
   cd client
   expo build:android -t apk
   ```

2. **Create Google Play Console Account**
   - Sign up at [Google Play Console](https://play.google.com/console)
   - Pay one-time $25 registration fee

3. **Upload App**
   - Create new app in Google Play Console
   - Upload APK file
   - Fill in app details:
     - App name: "KEX E-commerce"
     - Short description
     - Full description
     - Screenshots (various device sizes)
     - Feature graphic
     - App icon

4. **Configure App Settings**
   ```json
   {
     "app_type": "Application",
     "category": "Shopping",
     "content_rating": "Everyone",
     "target_audience": "All users"
   }
   ```

5. **Submit for Review**
   - Complete all required sections
   - Submit for Google review (1-7 days)

### iOS App Store (Apple App Store)

1. **Build iOS App**
   ```bash
   cd client
   expo build:ios
   ```

2. **Create Apple Developer Account**
   - Sign up at [Apple Developer](https://developer.apple.com)
   - Pay $99/year membership fee

3. **Create App Store Connect Account**
   - Access [App Store Connect](https://appstoreconnect.apple.com)
   - Create new app

4. **Upload App**
   - Use Xcode or Application Loader
   - Upload IPA file
   - Fill in app metadata

5. **Configure App Settings**
   ```json
   {
     "category": "Shopping",
     "content_rating": "4+",
     "languages": ["English"],
     "devices": ["iPhone", "iPad"]
   }
   ```

6. **Submit for Review**
   - Complete all required sections
   - Submit for Apple review (1-7 days)

## Environment Configuration

### Production Environment Variables

```bash
# Backend (.env)
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kex_production
JWT_SECRET=your_super_secure_jwt_secret_key
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
EMAIL_SERVICE_API_KEY=your_email_service_key
EMAIL_FROM=noreply@kex.com
FRONTEND_URL=https://kex.com
CORS_ORIGIN=https://kex.com,https://app.kex.com

# Web Frontend (.env)
VITE_API_URL=https://api.kex.com
VITE_STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key
VITE_APP_NAME=KEX E-commerce
VITE_APP_VERSION=1.0.0

# Mobile App (app.config.js)
EXPO_PUBLIC_API_URL=https://api.kex.com
EXPO_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key
```

### Database Setup

1. **MongoDB Atlas Configuration**
   ```bash
   # Create production cluster
   # Configure network access (0.0.0.0/0 for all IPs)
   # Create database user with read/write permissions
   # Get connection string
   ```

2. **Database Indexes**
   ```javascript
   // Run in MongoDB shell
   db.products.createIndex({ name: "text", description: "text" });
   db.products.createIndex({ category: 1 });
   db.products.createIndex({ price: 1 });
   db.orders.createIndex({ user: 1, createdAt: -1 });
   db.users.createIndex({ email: 1 }, { unique: true });
   ```

## SSL & Security

### SSL Certificate Setup

1. **Automatic SSL (Recommended)**
   - Vercel/Netlify provide automatic SSL
   - Railway/Render provide automatic SSL
   - Heroku provides automatic SSL

2. **Manual SSL Setup**
   ```bash
   # Using Let's Encrypt
   sudo certbot --nginx -d api.kex.com
   sudo certbot --nginx -d kex.com
   ```

### Security Headers

```javascript
// Add to server/index.js
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "https://js.stripe.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.stripe.com"]
    }
  }
}));
```

## Monitoring & Analytics

### Application Monitoring

1. **Sentry Integration**
   ```bash
   npm install @sentry/node @sentry/react
   ```

2. **Logging Service**
   ```bash
   npm install winston
   ```

3. **Performance Monitoring**
   ```bash
   npm install express-status-monitor
   ```

### Analytics Setup

1. **Google Analytics**
   ```javascript
   // Add to web/index.html
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   ```

2. **Mobile Analytics**
   ```bash
   expo install expo-analytics
   ```

## Post-Deployment Checklist

### Backend Verification
- [ ] API endpoints responding correctly
- [ ] Database connection stable
- [ ] Environment variables configured
- [ ] SSL certificate active
- [ ] Rate limiting working
- [ ] Error logging configured
- [ ] Performance monitoring active

### Web Frontend Verification
- [ ] Site loads without errors
- [ ] All pages accessible
- [ ] Responsive design working
- [ ] PWA functionality working
- [ ] SEO meta tags configured
- [ ] Analytics tracking active
- [ ] Performance scores > 90

### Mobile App Verification
- [ ] App installs successfully
- [ ] All screens load correctly
- [ ] Navigation works smoothly
- [ ] Push notifications configured
- [ ] App store listing complete
- [ ] Screenshots and descriptions accurate

### Security Verification
- [ ] HTTPS enforced
- [ ] CORS configured correctly
- [ ] JWT tokens working
- [ ] Input validation active
- [ ] Rate limiting enforced
- [ ] Security headers set

### Performance Verification
- [ ] Page load times < 3 seconds
- [ ] API response times < 200ms
- [ ] Mobile app startup < 2 seconds
- [ ] Image optimization working
- [ ] Caching strategies active

### Business Logic Verification
- [ ] User registration/login working
- [ ] Product browsing functional
- [ ] Shopping cart operations working
- [ ] Checkout process complete
- [ ] Payment processing working
- [ ] Order management functional
- [ ] Admin panel accessible

## Troubleshooting

### Common Issues

1. **CORS Errors**
   ```javascript
   // Check CORS configuration
   app.use(cors({
     origin: process.env.CORS_ORIGIN.split(','),
     credentials: true
   }));
   ```

2. **Database Connection Issues**
   ```bash
   # Check MongoDB Atlas network access
   # Verify connection string
   # Check database user permissions
   ```

3. **Environment Variables**
   ```bash
   # Verify all required variables are set
   # Check for typos in variable names
   # Ensure proper formatting
   ```

4. **SSL Certificate Issues**
   ```bash
   # Check certificate validity
   # Verify domain configuration
   # Check hosting provider SSL settings
   ```

### Support Resources
- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

## Maintenance

### Regular Tasks
- Monitor application performance
- Update dependencies monthly
- Review security logs weekly
- Backup database daily
- Monitor error rates
- Update SSL certificates
- Review analytics data

### Scaling Considerations
- Implement CDN for static assets
- Add database read replicas
- Implement caching layers
- Monitor resource usage
- Plan for traffic spikes
- Consider microservices architecture
