import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_here', {
    expiresIn: '30d',
  });
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log('Attempting to create user:', email);
    // Create user
    const user = await User.create({
      email,
      password,
    });
    console.log('User created successfully:', user._id);

    if (user) {
      // Send welcome email
      try {
        await sendEmail({
          email: user.email,
          subject: 'Welcome to IT Stock Tracker',
          message: `Hello! Welcome to IT Stock Tracker. Your account has been created successfully.`,
          html: `<h1>Welcome to IT Stock Tracker</h1><p>Your account has been created successfully.</p>`
        });
      } catch (err) {
        console.error('Email could not be sent', err);
      }

      res.status(201).json({
        _id: user._id,
        email: user.email,
        watchlist: user.watchlist || [],
        holdings: user.holdings || [],
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      // Check if 2FA is enabled
      if (user.isTwoFactorEnabled) {
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
        await user.save();

        // Send OTP via email
        try {
          await sendEmail({
            email: user.email,
            subject: 'Your Login OTP',
            message: `Your OTP for login is ${otp}. It expires in 10 minutes.`,
            html: `<h1>Login Verification</h1><p>Your OTP for login is <strong>${otp}</strong>. It expires in 10 minutes.</p>`
          });
          return res.json({ requireOTP: true, email: user.email });
        } catch (err) {
          console.error('OTP email failed', err);
          return res.status(500).json({ message: 'Failed to send OTP email' });
        }
      }

      res.json({
        _id: user._id,
        email: user.email,
        watchlist: user.watchlist,
        holdings: user.holdings,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
      _id: user._id,
      email: user.email,
      watchlist: user.watchlist,
      holdings: user.holdings,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error verifying OTP' });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail({
      email: user.email,
      subject: 'Your Login OTP',
      message: `Your OTP for login is ${otp}. It expires in 10 minutes.`,
    });

    res.json({ message: 'OTP sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error resending OTP' });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const allowed = ['name', 'phone', 'pan', 'dob', 'city', 'bio', 'avatarColor', 'isTwoFactorEnabled'];
    const updates = {};
    allowed.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// @desc    Add a holding (Buy stock)
// @route   POST /api/auth/holdings
// @access  Private
export const addHolding = async (req, res) => {
  try {
    const { symbol, companyName, qty, avgPrice, purchaseDate } = req.body;
    if (!symbol || qty === undefined || !avgPrice) return res.status(400).json({ message: 'symbol, qty and avgPrice required' });
    
    const user = await User.findById(req.user._id);
    
    if (!user.holdings) user.holdings = [];

    // Find if already exists to update average price
    const existingIndex = user.holdings.findIndex(h => h.symbol === symbol);
    
    if (existingIndex > -1) {
      const existing = user.holdings[existingIndex];
      const totalQty = Number(existing.qty) + Number(qty);
      const totalCost = (Number(existing.qty) * Number(existing.avgPrice)) + (Number(qty) * Number(avgPrice));
      user.holdings[existingIndex].qty = totalQty;
      if (totalQty > 0) {
        user.holdings[existingIndex].avgPrice = (totalCost / totalQty).toFixed(2);
      } else {
        user.holdings[existingIndex].avgPrice = avgPrice;
      }
      user.holdings[existingIndex].purchaseDate = purchaseDate || new Date().toISOString().split('T')[0];
    } else {
      user.holdings.push({ 
        symbol, 
        companyName: companyName || symbol, 
        qty: Number(qty), 
        avgPrice: Number(avgPrice), 
        purchaseDate: purchaseDate || new Date().toISOString().split('T')[0] 
      });
    }

    await user.save();
    res.json({ holdings: user.holdings });
  } catch (error) {
    console.error('Error adding holding:', error);
    res.status(500).json({ message: 'Server error adding holding' });
  }
};

// @desc    Delete a holding (Sell stock)
// @route   DELETE /api/auth/holdings/:symbol
// @access  Private
export const deleteHolding = async (req, res) => {
  try {
    const { qty } = req.body || {}; // Optional: sell only some qty
    const user = await User.findById(req.user._id);
    
    if (!user.holdings) user.holdings = [];

    if (qty) {
      const hIndex = user.holdings.findIndex(h => h.symbol === req.params.symbol);
      if (hIndex > -1) {
        if (user.holdings[hIndex].qty > qty) {
          user.holdings[hIndex].qty -= Number(qty);
        } else {
          user.holdings = user.holdings.filter(h => h.symbol !== req.params.symbol);
        }
      }
    } else {
      user.holdings = user.holdings.filter(h => h.symbol !== req.params.symbol);
    }

    await user.save();
    res.json({ holdings: user.holdings });
  } catch (error) {
    console.error('Error deleting holding:', error);
    res.status(500).json({ message: 'Server error deleting holding' });
  }
};
