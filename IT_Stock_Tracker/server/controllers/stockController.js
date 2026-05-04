const axios = require('axios');
const StockHistory = require('../models/Stock');
const User = require('../models/User');

const IT_STOCKS = ['TCS.BSE', 'INFY.BSE', 'WIPRO.BSE', 'HCLTECH.BSE', 'TECHM.BSE'];

const MOCK_PRICES = {
  'TCS.BSE':    { price: 3954.20, high: 4012.00, low: 3920.00, changePercent: -0.45 },
  'INFY.BSE':   { price: 1612.45, high: 1635.00, low: 1598.00, changePercent:  1.12 },
  'WIPRO.BSE':  { price: 492.30,  high: 501.40,  low: 485.60,  changePercent: -0.23 },
  'HCLTECH.BSE':{ price: 1584.15, high: 1605.00, low: 1568.75, changePercent:  0.84 },
  'TECHM.BSE':  { price: 1248.65, high: 1272.90, low: 1230.20, changePercent: -1.15 },
  'LTIM.BSE':   { price: 5245.00, high: 5310.00, low: 5180.00, changePercent:  0.55 },
  'COFORGE.BSE':{ price: 6120.00, high: 6250.00, low: 6080.00, changePercent:  2.15 },
  'RELIANCE.BSE':{ price: 2950.40, high: 2980.00, low: 2930.50, changePercent:  0.45 },
  'SBIN.BSE':   { price: 760.20,  high: 768.50, low: 755.10, changePercent:  1.15 },
  'HDFCBANK.BSE':{ price: 1435.60, high: 1445.00, low: 1425.20, changePercent: -0.65 }
};

const getMockPrice = (symbol) => {
  if (MOCK_PRICES[symbol]) return MOCK_PRICES[symbol];
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  const basePrice = 100 + (Math.abs(hash) % 3000);
  return { price: basePrice, high: basePrice * 1.02, low: basePrice * 0.98, changePercent: (Math.abs(hash) % 100) / 20 - 2.5 };
};

const MOCK_SEARCH_RESULTS = [
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'Equity', region: 'United States' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'Equity', region: 'United States' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'Equity', region: 'United States' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'Equity', region: 'United States' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'Equity', region: 'United States' },
  { symbol: 'TSLA', name: 'Tesla Inc.', type: 'Equity', region: 'United States' },
  { symbol: 'RELIANCE.BSE', name: 'Reliance Industries Limited', type: 'Equity', region: 'India' },
  { symbol: 'SBIN.BSE', name: 'State Bank of India', type: 'Equity', region: 'India' },
  { symbol: 'HDFCBANK.BSE', name: 'HDFC Bank Limited', type: 'Equity', region: 'India' },
];

const SECTORS_DATA = [
  { 
    name: 'IT', change: -0.34, mktCap: '₹18.4L Cr', 
    stocks: ['TCS.BSE', 'INFY.BSE', 'WIPRO.BSE', 'HCLTECH.BSE', 'TECHM.BSE', 'LTIM.BSE', 'PERSISTENT.BSE', 'MPHASIS.BSE', 'KPITTECH.BSE', 'COFORGE.BSE', 'OFSS.BSE', 'HEXAWARE.BSE'] 
  },
  { 
    name: 'Banking', change: 0.45, mktCap: '₹32.1L Cr', 
    stocks: ['HDFCBANK.BSE', 'ICICIBANK.BSE', 'SBIN.BSE', 'KOTAKBANK.BSE', 'AXISBANK.BSE', 'INDUSINDBK.BSE', 'PNB.BSE', 'BOB.BSE', 'FEDERALBNK.BSE', 'IDFCFIRSTB.BSE', 'BANDHANBNK.BSE', 'YESBANK.BSE'] 
  },
  { 
    name: 'FMCG', change: 0.21, mktCap: '₹12.6L Cr', 
    stocks: ['ITC.BSE', 'HINDUNILVR.BSE', 'NESTLEIND.BSE', 'BRITANNIA.BSE', 'DABUR.BSE', 'GODREJCP.BSE', 'MARICO.BSE', 'TATACONSUM.BSE', 'COLPAL.BSE', 'UBL.BSE', 'RADICO.BSE', 'VARUNBEV.BSE'] 
  },
  { 
    name: 'Auto', change: 1.23, mktCap: '₹9.8L Cr', 
    stocks: ['TATAMOTORS.BSE', 'MARUTI.BSE', 'M&M.BSE', 'BAJAJ-AUTO.BSE', 'HEROMOTOCO.BSE', 'EICHERMOT.BSE', 'TVSMOTOR.BSE', 'ASHOKLEY.BSE', 'BOSCHLTD.BSE', 'MRF.BSE', 'CEATLTD.BSE', 'BHARATFORG.BSE'] 
  },
  { 
    name: 'Energy', change: 0.78, mktCap: '₹14.2L Cr', 
    stocks: ['RELIANCE.BSE', 'ONGC.BSE', 'NTPC.BSE', 'POWERGRID.BSE', 'TATAPOWER.BSE', 'IOC.BSE', 'BPCL.BSE', 'GAIL.BSE', 'ADANIGREEN.BSE', 'COALINDIA.BSE', 'HINDPETRO.BSE', 'PETRONET.BSE'] 
  }
];

const fetchAlphaVantage = async (symbol) => {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
  const response = await axios.get(url);
  
  if (response.data['Information'] || response.data['Note']) {
    throw new Error('API Rate Limit Exceeded');
  }

  const quote = response.data['Global Quote'];
  if (!quote || Object.keys(quote).length === 0) {
    throw new Error('Empty quote returned');
  }

  return {
    symbol: symbol,
    price: parseFloat(quote['05. price']),
    high: parseFloat(quote['03. high']),
    low: parseFloat(quote['04. low']),
    changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
  };
};

const getStocks = async (req, res) => {
  try {
    const results = [];
    const symbolsToFetch = req.query.symbols ? req.query.symbols.split(',') : IT_STOCKS;
    
    for (const symbol of symbolsToFetch) {
      const cachedData = await StockHistory.findOne({ symbol });
      
      // SMART POLLING: Check DB first. If fresh (< 1 hr), skip API to save rate limits
      if (cachedData && (Date.now() - cachedData.lastUpdated < 3600000)) {
        const drift = (Math.random() - 0.5) * 0.002;
        const livePrice = parseFloat((cachedData.price * (1 + drift)).toFixed(2));
        results.push({
          symbol: cachedData.symbol,
          price: livePrice,
          high: Math.max(cachedData.high, livePrice),
          low: Math.min(cachedData.low, livePrice),
          changePercent: parseFloat((cachedData.changePercent + drift * 100).toFixed(2)),
          isCached: true
        });
        continue;
      }

      try {
        const liveData = await fetchAlphaVantage(symbol);
        await StockHistory.findOneAndUpdate(
          { symbol }, { ...liveData, lastUpdated: Date.now() }, { upsert: true, new: true }
        );
        results.push(liveData);
      } catch (error) {
        if (cachedData) {
          const drift = (Math.random() - 0.5) * 0.002;
          const livePrice = parseFloat((cachedData.price * (1 + drift)).toFixed(2));
          results.push({
            symbol: cachedData.symbol, price: livePrice,
            high: Math.max(cachedData.high, livePrice), low: Math.min(cachedData.low, livePrice),
            changePercent: parseFloat((cachedData.changePercent + drift * 100).toFixed(2)),
            isCached: true
          });
        } else {
          const mock = getMockPrice(symbol);
          const drift = (Math.random() - 0.5) * 0.003;
          const price = parseFloat((mock.price * (1 + drift)).toFixed(2));
          results.push({
            symbol, price,
            high: parseFloat((mock.high * (1 + Math.abs(drift))).toFixed(2)),
            low: parseFloat((mock.low * (1 - Math.abs(drift))).toFixed(2)),
            changePercent: parseFloat((mock.changePercent + drift * 50).toFixed(2)),
            isCached: true, isMock: true,
          });
          await StockHistory.findOneAndUpdate(
            { symbol }, { symbol, price, high: mock.high, low: mock.low, changePercent: mock.changePercent, lastUpdated: Date.now() }, { upsert: true, new: true }
          ).catch(() => {});
        }
      }
    }
    
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching stocks' });
  }
};

const searchStocks = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Query is required' });
    
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${q}&apikey=${apiKey}`;
    const response = await axios.get(url);
    
    if (response.data['Information'] || response.data['Note']) {
      const cached = await StockHistory.find({ symbol: new RegExp(q, 'i') }).limit(10);
      const cachedMapped = cached.map(c => ({ symbol: c.symbol, name: c.symbol, isCached: true }));
      
      const mockFiltered = MOCK_SEARCH_RESULTS.filter(m => 
        m.symbol.toLowerCase().includes(q.toLowerCase()) || 
        m.name.toLowerCase().includes(q.toLowerCase())
      );
      
      const combined = [...cachedMapped];
      for (const m of mockFiltered) {
        if (!combined.find(c => c.symbol === m.symbol)) {
          combined.push({ ...m, isCached: true, isMock: true });
        }
      }
      return res.json(combined);
    }

    const matches = response.data['bestMatches'] || [];
    const results = matches.map(m => ({
      symbol: m['1. symbol'],
      name: m['2. name'],
      type: m['3. type'],
      region: m['4. region']
    }));

    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error searching stocks' });
  }
};

const getSingleStock = async (req, res) => {
  try {
    const { symbol } = req.params;
    let liveData;
    let isMock = false;
    let isCached = false;

    const cachedData = await StockHistory.findOne({ symbol });
    if (cachedData && (Date.now() - cachedData.lastUpdated < 3600000)) {
      liveData = {
        symbol: cachedData.symbol, price: cachedData.price,
        high: cachedData.high, low: cachedData.low, changePercent: cachedData.changePercent,
      };
      isCached = true;
    } else {
      try {
        liveData = await fetchAlphaVantage(symbol);
        await StockHistory.findOneAndUpdate(
          { symbol }, { ...liveData, lastUpdated: Date.now() }, { upsert: true, new: true }
        );
      } catch (error) {
        if (cachedData) {
          liveData = {
            symbol: cachedData.symbol, price: cachedData.price,
            high: cachedData.high, low: cachedData.low, changePercent: cachedData.changePercent,
          };
          isCached = true;
        } else {
          const mock = getMockPrice(symbol);
          liveData = { symbol, ...mock };
          isMock = true; isCached = true;
          await StockHistory.findOneAndUpdate(
            { symbol }, { ...liveData, lastUpdated: Date.now() }, { upsert: true, new: true }
          ).catch(() => {});
        }
      }
    }
    
    // Add micro drift to make charts/details feel alive even if cached
    const drift = (Math.random() - 0.5) * 0.002;
    liveData.price = parseFloat((liveData.price * (1 + drift)).toFixed(2));
    
    res.json({ ...liveData, isCached, isMock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching stock' });
  }
};

const toggleWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { symbol } = req.body;
    if (!symbol) return res.status(400).json({ message: 'Symbol is required' });
    if (!user.watchlist) user.watchlist = [];

    const isWatched = user.watchlist.includes(symbol);
    if (isWatched) user.watchlist = user.watchlist.filter(s => s !== symbol);
    else user.watchlist.push(symbol);

    await user.save();
    res.json({ watchlist: user.watchlist });
  } catch (error) {
    console.error('Watchlist Toggle Error:', error);
    res.status(500).json({ message: 'Server error updating watchlist' });
  }
};

const getStockHistory = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = '1M' } = req.query;

    const cached = await StockHistory.findOne({ symbol });
    const mockBase = getMockPrice(symbol);
    const basePrice = cached?.price || mockBase.price;
    const baseHigh = cached?.high || basePrice * 1.02;
    const baseLow = cached?.low || basePrice * 0.98;

    const configs = {
      '1D': { points: 78, labelFn: (i) => {
        const totalMins = i * 5;
        const h = 9 + Math.floor(totalMins / 60);
        const m = totalMins % 60;
        return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
      }, volatility: 0.008 },
      '1W': { points: 5, labelFn: (i) => {
        const days = ['Mon','Tue','Wed','Thu','Fri'];
        return days[i % 5];
      }, volatility: 0.015 },
      '1M': { points: 22, labelFn: (i) => {
        const d = new Date(); d.setDate(d.getDate() - (21 - i));
        return `${d.getDate()}/${d.getMonth()+1}`;
      }, volatility: 0.025 },
      '3M': { points: 13, labelFn: (i) => {
        const d = new Date(); d.setDate(d.getDate() - (12 - i) * 7);
        return `${d.getDate()}/${d.getMonth()+1}`;
      }, volatility: 0.04 },
      '1Y': { points: 12, labelFn: (i) => {
        const d = new Date(); d.setMonth(d.getMonth() - (11 - i));
        return d.toLocaleString('en-IN', { month: 'short' });
      }, volatility: 0.07 },
    };

    const cfg = configs[period] || configs['1M'];
    const { points, labelFn, volatility } = cfg;

    const startPrice = basePrice * (1 - volatility * points * 0.5 * Math.random());
    let price = startPrice;
    const history = [];

    for (let i = 0; i < points; i++) {
      const change = (Math.random() - 0.48) * volatility * price;
      price = Math.max(price * 0.85, price + change);
      const pointHigh = price * (1 + Math.random() * volatility * 0.5);
      const pointLow  = price * (1 - Math.random() * volatility * 0.5);
      const open = i === 0 ? startPrice : history[i - 1].close;
      history.push({
        label: labelFn(i),
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(pointHigh.toFixed(2)),
        low:  parseFloat(pointLow.toFixed(2)),
        close: parseFloat(price.toFixed(2)),
        volume: Math.floor(Math.random() * 5000000 + 500000),
      });
    }

    if (history.length > 0) {
      history[history.length - 1].close = basePrice;
      history[history.length - 1].high = Math.max(baseHigh, basePrice);
      history[history.length - 1].low  = Math.min(baseLow, basePrice);
    }

    res.json({ symbol, period, history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching stock history' });
  }
};

const getSectors = async (req, res) => {
  res.json(SECTORS_DATA);
};

module.exports = {
  getStocks,
  searchStocks,
  getSingleStock,
  toggleWatchlist,
  getStockHistory,
  getSectors
};
