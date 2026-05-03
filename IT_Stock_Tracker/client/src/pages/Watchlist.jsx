import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import CompanyLogo from '../components/CompanyLogo';
import {
  Star, TrendingUp, TrendingDown, RefreshCw, LayoutGrid, ArrowRight, Activity, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const WatchlistCard = ({ stock, onRemove }) => {
  const navigate = useNavigate();
  const isPositive = (stock.changePercent ?? 0) >= 0;

  return (
    <div
      className="cursor-pointer rounded-2xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-xl relative"
      onClick={() => navigate(`/stock/${stock.symbol}`)}
      style={{
        background: 'linear-gradient(135deg, var(--card-bg), rgba(234,179,8,0.06))',
        border: '1px solid rgba(234,179,8,0.3)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      {/* Gold accent top bar */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Real company logo */}
            <CompanyLogo symbol={stock.symbol} size={36} />
            <div>
              <h3 className="text-base font-extrabold text-[var(--text-primary)] tracking-tight">{stock.symbol}</h3>
              <p className="text-[11px] font-semibold text-[var(--text-muted)]">NSE/BSE · Equity</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full ${isPositive ? 'bg-profit text-profit' : 'bg-loss text-loss'}`}>
              {isPositive ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
              {isPositive ? '+' : ''}{(stock.changePercent ?? 0).toFixed(2)}%
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(stock.symbol); }}
              title="Remove from watchlist"
              className="p-1.5 rounded-full text-yellow-400 bg-yellow-400/10 hover:bg-rose-500/10 hover:text-rose-400 transition-all"
            >
              <Star size={13} fill="currentColor" />
            </button>
          </div>
        </div>

        {/* Price */}
        <div>
          {stock.error ? (
            <span className="text-sm text-rose-400 font-medium">Data unavailable</span>
          ) : (
            <>
              <p className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
                ₹{(stock.price ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <div className="flex gap-4 mt-2 text-xs text-[var(--text-muted)] font-semibold">
                <span className="flex items-center gap-0.5 text-profit"><ArrowUpRight size={11} />H ₹{(stock.high ?? 0).toFixed(0)}</span>
                <span className="flex items-center gap-0.5 text-loss"><ArrowDownRight size={11} />L ₹{(stock.low ?? 0).toFixed(0)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Watchlist() {
  const { user, updateWatchlist } = useAuth();
  const [allStocks, setAllStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  const fetchStocks = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch IT stocks + any watchlist symbols not in IT list
      const itSymbols = 'TCS.BSE,INFY.BSE,WIT,HCLTECH.BSE,TECHM.BSE,LTIM.BSE,PERSISTENT.BSE,MPHASIS.BSE,KPITTECH.BSE,COFORGE.BSE';
      const watchlistExtra = (user?.watchlist ?? []).filter(s => !itSymbols.includes(s)).join(',');
      const query = watchlistExtra ? `${itSymbols},${watchlistExtra}` : itSymbols;
      const res = await api.get(`/stocks?symbols=${query}`);
      setAllStocks(res.data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user?.watchlist]);

  useEffect(() => { fetchStocks(); }, [fetchStocks]);

  const watchedSymbols = user?.watchlist ?? [];
  const watchedStocks = allStocks.filter(s => watchedSymbols.includes(s.symbol));

  const handleRemove = async (symbol) => {
    setRemoving(symbol);
    try {
      const res = await api.post('/watchlist', { symbol });
      updateWatchlist(res.data.watchlist);
    } catch (e) {
      console.error(e);
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="space-y-6 fade-in-up pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Star size={20} className="text-yellow-400" fill="currentColor" />
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">My Watchlist</h1>
          </div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            {watchedStocks.length} stock{watchedStocks.length !== 1 ? 's' : ''} tracked — your personal market monitor
          </p>
        </div>
        <button
          onClick={fetchStocks}
          className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl text-sm font-bold transition-all"
          style={{ border: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-44 rounded-2xl shimmer" />)}
        </div>
      ) : watchedStocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 glass-card rounded-3xl text-center" style={{ border: '1px solid var(--card-border)' }}>
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 text-5xl" style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)' }}>⭐</div>
          <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">Watchlist is empty</h2>
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-6 max-w-xs">
            Tap the ⭐ star icon on any IT stock from the Dashboard to start tracking it here.
          </p>
          <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-extrabold text-sm text-white transition-all shadow-lg shadow-[var(--accent-glow)]" style={{ background: 'var(--accent-primary)' }}>
            <LayoutGrid size={15} />
            Go to Dashboard
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {watchedStocks.map(stock => (
            <WatchlistCard key={stock.symbol} stock={stock} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
}
