import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import StockCard from '../components/StockCard';
import PriceChart from '../components/PriceChart';
import HelpTip from '../components/HelpTip';
import MarketAMA from '../components/MarketAMA';
import { useMode } from '../hooks/useMode';
import {
  RefreshCw, ServerCrash, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Activity, Star, BookOpen, CheckCircle, Cpu, LayoutGrid, ShieldCheck, Target, Timer, Layers, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 9 IT stocks for a cleaner 3x3 grid
const IT_STOCKS_SYMBOLS = [
  'TCS.BSE', 'INFY.BSE', 'WIPRO.BSE', 'HCLTECH.BSE', 'TECHM.BSE',
  'LTIM.BSE', 'PERSISTENT.BSE', 'MPHASIS.BSE', 'KPITTECH.BSE'
];

const MOCK_PORTFOLIO = {
  investedValue: 524800,
  currentValue: 591342,
  dayPnL: 3847,
  dayPnLPct: 0.65,
  totalPnL: 66542,
  totalPnLPct: 12.68,
};

const StatCard = ({ label, value, sub, up, tip, align }) => (
  <div className="glass-card rounded-2xl p-4 relative overflow-hidden group transition-all hover:scale-[1.02]">
    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[var(--accent-glow)] opacity-0 group-hover:opacity-10 transition-opacity" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] text-[var(--text-secondary)] font-bold tracking-widest uppercase">{label}</p>
        {tip && <HelpTip topic={tip} align={align} />}
      </div>
      <p className="text-xl font-black text-[var(--text-primary)] tracking-tight">{value}</p>
      {sub && (
        <p className={`text-xs font-bold mt-1 flex items-center gap-1 ${up ? 'text-profit' : 'text-loss'}`}>
          {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {sub}
        </p>
      )}
    </div>
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isBeginnerMode } = useMode();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [randomTips, setRandomTips] = useState([]);

  const fetchStocks = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const symbolsQuery = IT_STOCKS_SYMBOLS.join(',');
      const response = await api.get(`/stocks?symbols=${symbolsQuery}`);
      if (response.data && response.data.length > 0) {
        setStocks(response.data);
        if (!selectedStock) setSelectedStock(response.data.find(s => !s.error) ?? null);
      }
    } catch (err) {
      setError('Failed to fetch stock data. Ensure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedStock]);

  useEffect(() => { 
    fetchStocks(); 
    
    // Randomize market tips on mount
    const ALL_MARKET_TIPS = [
      { q: 'Volume Check', a: 'High volume with rising prices indicates strong buyer conviction and confirms the trend.', icon: <Activity size={12} className="text-emerald-400" /> },
      { q: 'Stop Loss', a: 'Always set a stop loss to protect your capital. It is your ultimate insurance against market crashes.', icon: <ShieldCheck size={12} className="text-rose-400" /> },
      { q: 'Trend Following', a: 'Never trade against the primary market trend. The trend is your friend until it bends.', icon: <TrendingUp size={12} className="text-indigo-400" /> },
      { q: 'Risk Management', a: 'Aim for a 1:2 risk-to-reward ratio. Your potential profit should always outweigh your potential loss.', icon: <Target size={12} className="text-amber-400" /> },
      { q: 'Patience Pays', a: 'Successful trading is 90% waiting and 10% execution. Don\'t force trades out of boredom.', icon: <Timer size={12} className="text-sky-400" /> },
      { q: 'Diversification', a: 'Spread your investments across different IT sectors (SaaS, Services, Cloud) to minimize risk.', icon: <Layers size={12} className="text-fuchsia-400" /> },
      { q: 'FOMO Warning', a: 'Never enter a trade because you are afraid of missing out. The market always offers new opportunities.', icon: <Zap size={12} className="text-yellow-400" /> },
      { q: 'Fundamental Check', a: 'Always review P/E Ratios and EPS growth before committing to long-term stock holdings.', icon: <BookOpen size={12} className="text-emerald-400" /> }
    ];
    const shuffled = [...ALL_MARKET_TIPS].sort(() => 0.5 - Math.random());
    setRandomTips(shuffled.slice(0, 3));
  }, [fetchStocks]);

  const watchedSymbols = user?.watchlist ?? [];
  const topGainer = [...stocks].filter(s => !s.error && s.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent)[0];
  const topLoser = [...stocks].filter(s => !s.error && s.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent)[0];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6 fade-in-up pb-8 max-w-7xl mx-auto">
      {/* ── Portfolio Header ─────────────────────────────── */}
      <div className="rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl"
        style={{ background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)' }}
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Cpu size={16} className="text-white/70" />
              <span className="text-white/70 text-sm font-semibold">IT Stock Tracker</span>
            </div>
            <p className="text-white/80 text-sm font-medium mb-1">
              {greeting()}, <span className="font-black text-white">{user?.email?.split('@')[0]}</span> 👋
            </p>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter drop-shadow-sm mb-1">
              ₹{MOCK_PORTFOLIO.currentValue.toLocaleString('en-IN')}
            </h1>
            <p className="text-white/70 text-[11px] font-bold tracking-widest uppercase flex items-center gap-2">
              Demo Portfolio Value <HelpTip topic="market_cap" />
            </p>
          </div>

          <div className="flex gap-6 bg-black/20 p-4 rounded-2xl backdrop-blur-md border border-white/10">
            <div>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                Demo P&L <HelpTip topic="p_l" align="left" />
              </p>
              <p className="text-xl font-black text-emerald-300 flex items-center gap-1">
                <ArrowUpRight size={16} />+₹{MOCK_PORTFOLIO.dayPnL.toLocaleString('en-IN')}
              </p>
              <p className="text-emerald-300/70 text-xs font-bold">+{MOCK_PORTFOLIO.dayPnLPct.toFixed(2)}%</p>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                Total Returns <HelpTip topic="total_returns" align="left" />
              </p>
              <p className="text-xl font-black text-emerald-300 flex items-center gap-1">
                <ArrowUpRight size={16} />+₹{MOCK_PORTFOLIO.totalPnL.toLocaleString('en-IN')}
              </p>
              <p className="text-emerald-300/70 text-xs font-bold">+{MOCK_PORTFOLIO.totalPnLPct.toFixed(2)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Stats ────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="IT STOCKS" value={stocks.length} sub={`${stocks.filter(s => !s.error).length} Active Leaders`} up={true} tip="it_stocks" />
        <StatCard label="INVESTED" value={`₹${MOCK_PORTFOLIO.investedValue.toLocaleString('en-IN')}`} tip="invested" />
        <StatCard label="TOP GAINER" value={topGainer?.symbol ?? 'N/A'} sub={topGainer ? `+${topGainer.changePercent.toFixed(2)}%` : ''} up={true} tip="top_gainers" align="left" />
        <StatCard label="TOP LOSER" value={topLoser?.symbol ?? 'N/A'} sub={topLoser ? `${topLoser.changePercent.toFixed(2)}%` : ''} up={false} tip="top_losers" align="left" />
      </div>

      {/* ── Error ─────────────────────────────────────── */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl flex items-start gap-3">
          <ServerCrash className="text-rose-500 mt-0.5 flex-shrink-0" size={20} />
          <p className="text-rose-500 font-bold text-sm">{error}</p>
        </div>
      )}

      {/* ── Main Layout ────────────────────────────────── */}
      <div className={`grid gap-6 ${isBeginnerMode ? 'grid-cols-1 xl:grid-cols-3' : 'grid-cols-1'}`}>

        {/* Left Column: Charts + Stocks */}
        <div className={`${isBeginnerMode ? 'xl:col-span-2' : ''} space-y-6`}>
          
          {/* Price Chart Section */}
          {!loading && !error && stocks.length > 0 && (
            <div className="glass-card rounded-3xl p-4">
               <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-lg font-black text-[var(--text-primary)] flex items-center gap-2 italic uppercase">
                  <Activity size={20} className="text-[var(--accent-primary)]" />
                  Live Performance Analysis
                  <HelpTip topic="volatility" />
                </h2>
              </div>
              <div className="p-2">
                <PriceChart stocks={stocks} selectedStock={selectedStock} onSelectStock={setSelectedStock} />
              </div>
            </div>
          )}

          {/* Stocks Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-black text-[var(--text-primary)] flex items-center gap-2 italic uppercase">
                <LayoutGrid size={20} className="text-[var(--accent-primary)]" />
                Core IT Sector
                <HelpTip topic="equity" />
              </h2>
              <button onClick={() => fetchStocks(true)} disabled={isRefreshing} className="p-2 glass-card rounded-full text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-all">
                <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
            </div>

            {loading ? (
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`}>
                {Array.from({ length: 9 }).map((_, i) => <div key={i} className="h-44 rounded-2xl shimmer" />)}
              </div>
            ) : (
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${!isBeginnerMode ? 'xl:grid-cols-3' : ''} gap-4`}>
                {stocks.map(stock => (
                  <StockCard
                    key={stock.symbol}
                    stock={stock}
                    isWatchlisted={watchedSymbols.includes(stock.symbol)}
                    isSelected={selectedStock?.symbol === stock.symbol}
                    onClick={() => { setSelectedStock(stock); navigate(`/stock/${stock.symbol}`); }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Beginner 101 & Insights */}
        {isBeginnerMode && (
          <div className="space-y-8">
            {/* Beginner 101 Header */}
            <div className="px-2">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight italic uppercase">Beginner 101</h2>
                  <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Learning Essentials</p>
                </div>
              </div>
              <div className="h-1 w-12 bg-[var(--accent-primary)]/30 rounded-full mt-3" />
            </div>

            {/* Market Mentor Bull - Now in Sidebar */}
            <MarketAMA />

            {/* Market Snapshot */}
            <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent-glow)] rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2" />
               
              <h3 className="font-black text-[var(--text-primary)] text-sm mb-6 flex items-center gap-2 italic uppercase tracking-wider">
                <Activity size={16} className="text-[var(--accent-primary)]" /> 
                Market Pulse
                <HelpTip topic="market_snapshot" align="left" />
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'NIFTY IT', value: '36,841', change: '-0.34%', up: false, tip: 'nifty' },
                  { label: 'SENSEX', value: '73,247', change: '+0.43%', up: true, tip: 'sensex' },
                  { label: 'Sector P/E', value: '28.4x', change: 'vs 25.1 avg', up: false, tip: 'pe_ratio' },
                ].map(item => (
                  <div key={item.label} className="p-4 rounded-2xl border flex items-center justify-between transition-all hover:border-[var(--accent-primary)]/30" style={{ borderColor: 'var(--card-border)', background: 'var(--bg-main)' }}>
                    <span className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                      {item.label} <HelpTip topic={item.tip} align="left" />
                    </span>
                    <div className="text-right">
                      <p className="text-base font-black text-[var(--text-primary)] tracking-tight">{item.value}</p>
                      <p className={`text-[10px] font-bold ${item.up ? 'text-profit' : 'text-loss'} flex items-center justify-end gap-0.5`}>
                        {item.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                        {item.change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-2xl bg-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/10">
                <p className="text-[11px] font-bold text-[var(--accent-primary)]/80 leading-relaxed italic text-center">
                  "IT Sector is currently trading at a premium. Watch for quarterly results."
                </p>
              </div>
            </div>

            {/* Quick Tips List */}
            <div className="glass-card rounded-3xl p-6 border-l-4 border-[var(--accent-primary)]/30">
               <h3 className="font-black text-[var(--text-primary)] text-sm mb-6 flex items-center gap-2 italic uppercase tracking-wider">
                <Star size={16} className="text-[var(--accent-primary)]" />
                Quick Lessons
                <HelpTip topic="quick_lessons" align="left" />
              </h3>
              <div className="space-y-4">
                {randomTips.map((tip, i) => (
                  <div key={i} className="p-4 rounded-2xl border hover:bg-white/5 transition-all" style={{ borderColor: 'var(--card-border)', background: 'var(--bg-main)' }}>
                    <p className="text-xs font-black text-[var(--text-primary)] mb-2 flex items-center gap-2 uppercase tracking-wide">
                      {tip.icon} {tip.q}
                    </p>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-bold italic">"{tip.a}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
