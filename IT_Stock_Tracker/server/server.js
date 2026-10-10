import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";
import User from "./models/User.js";
import StockHistory from "./models/Stock.js";
import sendEmail from "./utils/sendEmail.js";

// ES Modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config(); // Standard loading from .env in current directory

// Connect to database
connectDB();

const app = express();

// Enable CORS
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    process.env.FRONTEND_URL, // Allow for production URL
  ].filter(Boolean),
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api", stockRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

const PORT = process.env.PORT || 5000;

// Simple Alert Checker (Runs every 2 minutes)
setInterval(async () => {
  try {
    console.log('Checking price alerts...');
    const users = await User.find({ "holdings.alertPrice": { $exists: true, $ne: null } });
    
    for (const user of users) {
      for (const holding of user.holdings) {
        if (holding.alertPrice) {
          const stock = await StockHistory.findOne({ symbol: holding.symbol });
          if (stock) {
            // Check if price crossed the alert threshold
            // This is a simple implementation: if price is close to or crossed alert price
            const crossed = (stock.price >= holding.alertPrice); // For now just simple check
            
            if (crossed) {
              await sendEmail({
                email: user.email,
                subject: `Price Alert: ${holding.symbol}`,
                message: `The price of ${holding.symbol} has reached your target of ₹${holding.alertPrice}. Current Price: ₹${stock.price}.`,
                html: `<h1>Price Alert Triggered</h1><p>The price of <strong>${holding.symbol}</strong> has reached your target of <strong>₹${holding.alertPrice}</strong>.</p><p>Current Price: <strong>₹${stock.price}</strong></p>`
              });
              
              // Clear alert after sending to avoid spamming
              holding.alertPrice = undefined;
              await user.save();
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Alert checker error:', err);
  }
}, 120000); // 2 minutes

// Listen on 0.0.0.0 for external access on platforms like Render
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
