#!/bin/bash

echo "🚀 KEX Server - Render Deployment Script"
echo "========================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if server directory exists
if [ ! -d "server" ]; then
    echo "❌ Server directory not found!"
    exit 1
fi

# Check if server files exist
if [ ! -f "server/index.js" ] || [ ! -f "server/package.json" ]; then
    echo "❌ Required server files missing!"
    echo "   Make sure server/index.js and server/package.json exist"
    exit 1
fi

echo "✅ Server files found"

# Test server locally
echo "🧪 Testing server locally..."
cd server
npm install > /dev/null 2>&1

# Start server in background
node index.js &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Test health endpoint
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Server is working locally"
else
    echo "❌ Server failed to start locally"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Stop local server
kill $SERVER_PID 2>/dev/null

cd ..

echo ""
echo "📋 Deployment Checklist:"
echo "========================"
echo "✅ Server files present"
echo "✅ Server starts locally"
echo "✅ Health endpoint responds"
echo ""
echo "🌐 Next Steps for Render Deployment:"
echo "===================================="
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Ready for Render deployment'"
echo "   git push origin main"
echo ""
echo "2. Go to https://render.com"
echo "3. Create new Web Service"
echo "4. Connect your GitHub repository"
echo "5. Configure:"
echo "   - Root Directory: server"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo ""
echo "6. Your server will be live at:"
echo "   https://your-app-name.onrender.com"
echo ""
echo "📖 See RENDER_DEPLOYMENT.md for detailed instructions"
echo ""
echo "�� Happy deploying!"
