const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_here', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        email: user.email,
        watchlist: user.watchlist || [],
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
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        email: user.email,
        watchlist: user.watchlist,
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

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile

// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const allowed = ['name', 'phone', 'pan', 'dob', 'city', 'bio', 'avatarColor'];
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

// @desc    Add a holding
// @route   POST /api/auth/holdings
// @access  Private
const addHolding = async (req, res) => {
  try {
    console.log('Incoming addHolding request:', req.body, 'from user:', req.user._id);
    const { symbol, companyName, qty, avgPrice, purchaseDate } = req.body;
    if (!symbol || !qty || !avgPrice) return res.status(400).json({ message: 'symbol, qty and avgPrice required' });
    const user = await User.findById(req.user._id);
    
    if (!user.holdings) {
      user.holdings = [];
    }

    // Remove existing holding for same symbol then add new
    user.holdings = user.holdings.filter(h => h.symbol !== symbol);
    user.holdings.push({ symbol, companyName: companyName || symbol, qty: Number(qty), avgPrice: Number(avgPrice), purchaseDate: purchaseDate || new Date().toISOString().split('T')[0] });
    await user.save();
    res.json({ holdings: user.holdings });
  } catch (error) {
    console.error('Error adding holding:', error);
    res.status(500).json({ message: 'Server error adding holding' });
  }
};

// @desc    Delete a holding
// @route   DELETE /api/auth/holdings/:symbol
// @access  Private
const deleteHolding = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.holdings) {
      user.holdings = [];
    }

    user.holdings = user.holdings.filter(h => h.symbol !== req.params.symbol);
    await user.save();
    res.json({ holdings: user.holdings });
  } catch (error) {
    console.error('Error deleting holding:', error);
    res.status(500).json({ message: 'Server error deleting holding' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  addHolding,
  deleteHolding,
};

