import express from 'express';
const router = express.Router();
import { 
  getStocks, 
  toggleWatchlist, 
  getStockHistory, 
  searchStocks, 
  getSingleStock, 
  getSectors 
} from '../controllers/stockController.js';
import { protect } from '../middleware/auth.js';

router.get('/stocks', protect, getStocks);
router.get('/stocks/search', protect, searchStocks);
router.get('/stocks/sectors', protect, getSectors);
router.get('/stocks/:symbol', protect, getSingleStock);
router.get('/stocks/:symbol/history', protect, getStockHistory);
router.post('/watchlist', protect, toggleWatchlist);

export default router;
