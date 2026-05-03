const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: '../.env' }); // Load from root directory

// Connect to database
connectDB();

const app = express();

// Enable CORS — must be before body parser and routes
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json());

const path = require('path');

// Mount routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/stockRoutes'));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, '../client', 'dist', 'index.html')
    );
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

const PORT = process.env.PORT || 5000;

// Listen on 0.0.0.0 for external access on platforms like Render
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
