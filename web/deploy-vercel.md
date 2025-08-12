# Deploy KEX Commerce to Vercel

## Quick Deployment Steps

### 1. Prepare Your Repository
```bash
# Make sure your code is committed to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with your GitHub account
3. Click "New Project"
4. Import your GitHub repository: `kex-ecommerce`
5. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click "Deploy"

#### Option B: Via Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from web directory
cd web
vercel --prod
```

### 3. Environment Variables (Optional)
If you have a backend API, add these in Vercel dashboard:
- `VITE_API_URL`: Your backend API URL
- `VITE_STRIPE_PUBLIC_KEY`: Your Stripe public key

### 4. Custom Domain (Optional)
1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Configure DNS records

## Your App Features
✅ Modern React + Vite setup
✅ Tailwind CSS for styling
✅ Dark/Light theme toggle
✅ Responsive design
✅ PWA ready
✅ Product catalog
✅ Shopping cart
✅ User authentication
✅ Beautiful UI/UX

## Post-Deployment
- Your app will be available at: `https://your-project.vercel.app`
- Automatic deployments on every git push
- Built-in analytics and performance monitoring
- Free SSL certificate
- Global CDN

## Troubleshooting
- If build fails, check console for errors
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility
- Check for environment variable issues
