# 🚀 KEX Server Deployment on Render

## Quick Deploy to Render

### Step 1: Prepare Your Repository
1. Make sure your code is pushed to GitHub
2. Ensure the server directory contains:
   - `index.js` (main server file)
   - `package.json` (with start script)
   - `assets/logo.png` (logo file)

### Step 2: Deploy on Render

1. **Go to [Render.com](https://render.com)** and sign up/login

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing KEX

3. **Configure the Service**
   ```
   Name: kex-ecommerce-server
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Environment Variables** (Optional)
   ```
   NODE_ENV=production
   PORT=10000
   ```

5. **Click "Create Web Service"**

### Step 3: Get Your Live URL
- Render will provide a URL like: `https://kex-ecommerce-server.onrender.com`
- Your API endpoints will be:
  - Health: `https://kex-ecommerce-server.onrender.com/api/health`
  - Products: `https://kex-ecommerce-server.onrender.com/api/products`
  - Logo: `https://kex-ecommerce-server.onrender.com/assets/logo.png`

### Step 4: Update Frontend Configuration
Update your web frontend to use the Render URL:

```javascript
// In web/src/utils/api.js
const API_BASE_URL = 'https://kex-ecommerce-server.onrender.com/api';
```

## Manual Deployment Steps

If you prefer to deploy manually:

1. **Fork/Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/KEX-Ecommerce.git
   cd KEX-Ecommerce
   ```

2. **Test Locally First**
   ```bash
   cd server
   npm install
   npm start
   ```

3. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Render deployment"
   git push origin main
   ```

4. **Follow Render Setup Above**

## Deployment Checklist

- [ ] Server starts locally without errors
- [ ] All dependencies in package.json
- [ ] Start script configured correctly
- [ ] Code pushed to GitHub
- [ ] Render service created
- [ ] Environment variables set (if needed)
- [ ] Service deployed successfully
- [ ] Health endpoint responds
- [ ] Frontend updated with new API URL

## Troubleshooting

### Common Issues:
1. **Build Fails**: Check package.json and dependencies
2. **Service Won't Start**: Verify start script in package.json
3. **404 Errors**: Check root directory setting in Render
4. **CORS Issues**: Ensure CORS is configured for your frontend domain

### Render Logs:
- Check Render dashboard for build and runtime logs
- Monitor service health and performance

## Benefits of Render Deployment

✅ **Free Tier Available** - Perfect for development and testing
✅ **Automatic HTTPS** - Secure connections out of the box
✅ **Global CDN** - Fast response times worldwide
✅ **Auto-Deploy** - Updates on every git push
✅ **Easy Scaling** - Upgrade when needed
✅ **Built-in Monitoring** - Track performance and errors

## Next Steps After Deployment

1. **Test All Endpoints**
   ```bash
   curl https://your-app.onrender.com/api/health
   curl https://your-app.onrender.com/api/products
   ```

2. **Update Frontend**
   - Change API base URL to Render domain
   - Test all frontend functionality

3. **Monitor Performance**
   - Check Render dashboard for metrics
   - Monitor response times and errors

4. **Set Up Custom Domain** (Optional)
   - Add custom domain in Render settings
   - Configure DNS records

---

**Your KEX server will be live and accessible worldwide! 🌍**
