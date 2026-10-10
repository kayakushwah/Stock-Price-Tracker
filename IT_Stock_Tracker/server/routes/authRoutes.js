import express from 'express';
const router = express.Router();
import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  addHolding,
  deleteHolding,
  verifyOTP,
  resendOTP
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/holdings', protect, addHolding);
router.delete('/holdings/:symbol', protect, deleteHolding);

export default router;
