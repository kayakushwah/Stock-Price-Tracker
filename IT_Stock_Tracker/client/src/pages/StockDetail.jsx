import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import HelpTip from '../components/HelpTip';
import {
  ArrowLeft, Star, TrendingUp, TrendingDown, AlertCircle, RefreshCw, BarChart2, ThumbsUp, ThumbsDown, Activity
} from 'lucide-react';

export default function StockDetail() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { user, updateWatchlist } = useAuth();
  
  const [stock, setStock] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('1M');
  
  const isWatched = user?.watchlist?.includes(symbol);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [quoteRes, historyRes] = await Promise.all([
        api.get(`/stocks/${symbol}`),
        api.get(`/stocks/${symbol}/history?period=${period}`)
      ]);
      setStock(quoteRes.data);
      setHistory(historyRes.data.history);
    } catch (err) {
      setError('Failed to fetch stock data');
    } finally {
      setLoading(false);
    }
  }, [symbol, period]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleWatchlist = async () => {
    try {
      const res = await api.post('/watchlist', { symbol });
      updateWatchlist(res.data.watchlist);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && !stock) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <RefreshCw size={32} className="animate-spin text-[var(--accent-primary)]" />
        <p className="text-sm font-bold text-[var(--text-secondary)] animate-pulse tracking-widest uppercase">Fetching Market Data...</p>
      </div>
    );
  }

  if (error || !stock) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <AlertCircle size={48} className="text-rose-500" />
        <p className="text-lg font-bold text-[var(--text-primary)]">{error || 'Stock not found'}</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 glass-card rounded-full font-bold hover:bg-[var(--accent-primary)]/10 transition-colors">
          Go Back
        </button>
      </div>
    );
  }

  const isUp = stock.changePercent >= 0;
  const priceColor = isUp ? 'var(--up-color)' : 'var(--down-color)';

  // Generate static pseudo-random Pros/Cons based on symbol name to make it fun but static
  const getProsCons = (sym) => {
    const pros = [
      "Consistent historical dividend payouts.",
      "Strong market capitalization and liquidity.",
      "Dominant player in its sector.",
      "Good potential for long-term growth."
    ];
    const cons = [
      "Highly sensitive to global market volatility.",
      "P/E ratio suggests it might be slightly overvalued.",
      "High competition in its primary market.",
      "Slow short-term growth prospects."
    ];
    const hash = sym.length;
    return {
      pro: pros[hash % pros.length],
      con: cons[hash % cons.length]
    };
  };

  const { pro, con } = getProsCons(symbol);

  return (
    <div className="space-y-6 fade-in-up pb-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent-glow)] to-transparent opacity-0 group-hover:opacity-10 transition-opacity -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] duration-1000" />
        
        <div className="flex items-start gap-4 relative z-10">
          <button onClick={() => navigate(-1)} className="mt-1 p-2 rounded-full hover:bg-[var(--sidebar-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] tracking-tight">{stock.symbol}</h1>
              {stock.isCached && <span className="px-2 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold rounded-md uppercase tracking-wider">Simulated</span>}
            </div>
            <p className="text-sm font-semibold text-[var(--text-secondary)] mt-1 flex items-center gap-2">
              Equity <HelpTip topic="market_cap" />
            </p>
          </div>
        </div>

        <div className="flex flex-col md:items-end relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter" style={{ color: priceColor }}>
              ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h2>
            <button
              onClick={toggleWatchlist}
              className={`p-3 rounded-full transition-all ${isWatched ? 'bg-yellow-500/20 text-yellow-500' : 'glass-card text-[var(--text-secondary)] hover:text-[var(--accent-primary)]'}`}
              title={isWatched ? "Remove from Watchlist" : "Add to Watchlist"}
            >
              <Star size={24} className={isWatched ? 'fill-current' : ''} />
            </button>
          </div>
          <p className={`text-sm font-bold flex items-center gap-1 ${isUp ? 'text-profit' : 'text-loss'}`}>
            {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {isUp ? '+' : ''}{stock.changePercent.toFixed(2)}% Today
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Chart Section */}
        <div className="xl:col-span-2 glass-card rounded-3xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-[var(--text-primary)]">
              <Activity size={20} className="text-[var(--accent-primary)]" />
              <h3 className="font-bold text-lg">Price History <HelpTip topic="stock_details" /></h3>
            </div>
            <div className="flex bg-[var(--sidebar-border)] rounded-xl p-1">
              {['1D', '1W', '1M', '3M', '1Y'].map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    period === p ? 'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[350px] w-full">
            {loading ? (
              <div className="w-full h-full rounded-2xl shimmer" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={priceColor} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={priceColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }} minTickGap={20} />
                  <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }} tickFormatter={v => `₹${v}`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--card-bg)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                    itemStyle={{ color: priceColor, fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="close" stroke={priceColor} strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="glass-card rounded-3xl p-6">
            <h3 className="font-bold text-[var(--text-primary)] mb-5 flex items-center gap-2">
              <BarChart2 size={18} className="text-[var(--accent-primary)]" /> Market Data
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-[var(--border-color)]">
                <span className="text-sm font-semibold text-[var(--text-secondary)] flex items-center gap-1">Today's High <HelpTip topic="market_breadth" align="left" /></span>
                <span className="font-bold text-[var(--text-primary)]">₹{stock.high.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[var(--border-color)]">
                <span className="text-sm font-semibold text-[var(--text-secondary)] flex items-center gap-1">Today's Low <HelpTip topic="high_low" align="left" /></span>
                <span className="font-bold text-[var(--text-primary)]">₹{stock.low.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[var(--border-color)]">
                <span className="text-sm font-semibold text-[var(--text-secondary)] flex items-center gap-1">Volume <HelpTip topic="volume" align="left" /></span>
                <span className="font-bold text-[var(--text-primary)]">{(Math.random() * 5 + 1).toFixed(2)}M</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-semibold text-[var(--text-secondary)] flex items-center gap-1">P/E Ratio <HelpTip topic="pe_ratio" align="left" /></span>
                <span className="font-bold text-[var(--text-primary)]">{(Math.random() * 20 + 10).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Beginner Insights (Pros/Cons) */}
          <div className="glass-card rounded-3xl p-6 bg-gradient-to-b from-[var(--card-bg)] to-[var(--bg-main)]">
            <h3 className="font-black text-lg text-[var(--text-primary)] tracking-tight mb-1 flex items-center gap-2">
              Beginner Insights
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-widest mb-5">Stock Analysis</p>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 rounded-md bg-emerald-500 text-white"><ThumbsUp size={14} /></div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">Why it's good</span>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-300/80 leading-relaxed font-medium">
                  {pro}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 rounded-md bg-rose-500 text-white"><ThumbsDown size={14} /></div>
                  <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">What to watch out for</span>
                </div>
                <p className="text-xs text-rose-700 dark:text-rose-300/80 leading-relaxed font-medium">
                  {con}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
