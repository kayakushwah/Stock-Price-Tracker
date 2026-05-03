const express = require('express');
const router = express.Router();
const { getStocks, toggleWatchlist, getStockHistory, searchStocks, getSingleStock, getSectors } = require('../controllers/stockController');
const { protect } = require('../middleware/auth');

router.get('/stocks', protect, getStocks);
router.get('/stocks/search', protect, searchStocks);
router.get('/stocks/sectors', protect, getSectors);
router.get('/stocks/:symbol', protect, getSingleStock);
router.get('/stocks/:symbol/history', protect, getStockHistory);
router.post('/watchlist', protect, toggleWatchlist);

module.exports = router;
