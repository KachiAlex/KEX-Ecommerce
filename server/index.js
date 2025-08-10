const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(cors());
app.use(express.json());

// Serve static files (logo)
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Health check - INSTANT response
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'KEX Server is running fast!',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// Simple products API
app.get('/api/products', (req, res) => {
  const products = [
    {
      id: '1',
      name: 'iPhone 15 Pro',
      price: 999.99,
      image: 'https://via.placeholder.com/300x300?text=iPhone+15+Pro'
    },
    {
      id: '2', 
      name: 'MacBook Air M2',
      price: 1199.99,
      image: 'https://via.placeholder.com/300x300?text=MacBook+Air+M2'
    }
  ];
  
  res.json({ success: true, data: products });
});

// Simple auth mock
app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login successful',
    data: { user: { id: '1', name: 'Demo User' }, token: 'mock-token' }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'KEX E-commerce API - Fast & Ready!',
    endpoints: ['/api/health', '/api/products', '/api/auth/login'],
    logo: '/assets/logo.png'
  });
});

// Start server - FAST!
app.listen(PORT, () => {
  console.log(`⚡ KEX Server running FAST on port ${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log(`🎨 Logo: http://localhost:${PORT}/assets/logo.png`);
  console.log(`📱 API: http://localhost:${PORT}/api/products`);
});
