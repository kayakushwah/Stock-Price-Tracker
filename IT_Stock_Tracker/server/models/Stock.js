import mongoose from 'mongoose';

const StockHistorySchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  high: {
    type: Number,
    required: true
  },
  low: {
    type: Number,
    required: true
  },
  changePercent: {
    type: Number,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const StockHistory = mongoose.model('StockHistory', StockHistorySchema);
export default StockHistory;
