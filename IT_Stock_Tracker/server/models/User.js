const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  // Profile fields
  name: { type: String, default: '' },
  phone: { type: String, default: '' },
  pan: { type: String, default: '' },
  dob: { type: String, default: '' },
  city: { type: String, default: '' },
  bio: { type: String, default: 'IT sector investor' },
  avatarColor: { type: String, default: '#6366f1' },
  // Portfolio holdings
  holdings: {
    type: [{
      symbol: String,
      companyName: String,
      qty: Number,
      avgPrice: Number,
      purchaseDate: String,
    }],
    default: []
  },
  watchlist: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


// Encrypt password using bcrypt
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
