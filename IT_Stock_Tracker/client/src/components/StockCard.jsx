import { useState } from 'react';
import { TrendingUp, TrendingDown, Clock, Star } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import CompanyLogo from './CompanyLogo';

const MiniSparkline = ({ price, high, low, up }) => {
  const data = Array.from({ length: 10 }, (_, i) => {
    const rand = low + Math.random() * (high - low);
    return { v: i === 9 ? price : rand };
  });
  const color = up ? 'var(--up-color)' : 'var(--down-color)';
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <defs>
          <linearGradient id={`sg-${up}-${Math.round(price)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#sg-${up}-${Math.round(price)})`} dot={false} />
        <Tooltip content={() => null} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const StockCard = ({ stock, onClick, isSelected, isWatchlisted }) => {
  const { user, updateWatchlist } = useAuth();
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  const isWatched = isWatchlisted ?? user?.watchlist?.includes(stock.symbol);
  const isPositive = (stock.changePercent ?? 0) >= 0;

  const highLowPct = stock.high && stock.low && stock.price
    ? ((stock.price - stock.low) / (stock.high - stock.low)) * 100
    : 50;

  const handleWatchlistToggle = async (e) => {
    e.stopPropagation();
    if (watchlistLoading) return;
    setWatchlistLoading(true);
    try {
      const res = await api.post('/watchlist', { symbol: stock.symbol });
      updateWatchlist(res.data.watchlist);
    } catch (err) {
      console.error('Watchlist toggle failed', err);
    } finally {
      setWatchlistLoading(false);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl cursor-pointer overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-xl ${isSelected ? 'ring-2 ring-[var(--accent-primary)] shadow-lg shadow-[var(--accent-glow)]' : ''} ${isWatched ? 'ring-1 ring-yellow-400/50' : ''}`}
      style={{
        background: isWatched
          ? 'linear-gradient(135deg, var(--card-bg), rgba(234,179,8,0.06))'
          : 'var(--card-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${isWatched ? 'rgba(234,179,8,0.3)' : 'var(--card-border)'}`,
      }}
    >
      <div className="relative z-10 p-4">
        {/* Header: Logo + Symbol + Badges + Star */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            {/* Real company logo — renders nothing if not found */}
            <CompanyLogo symbol={stock.symbol} size={32} className="flex-shrink-0" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-[var(--text-primary)] tracking-tight">{stock.symbol}</span>
                {stock.isMock && (
                  <span className="text-[9px] text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide">demo</span>
                )}
                {stock.isCached && !stock.isMock && (
                  <span className="text-[9px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5 uppercase tracking-wide">
                    <Clock size={8} />sim
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[var(--text-muted)] font-medium">NSE/BSE · Equity</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isPositive ? 'bg-profit text-profit' : 'bg-loss text-loss'}`}>
              {isPositive ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
              {isPositive ? '+' : ''}{(stock.changePercent ?? 0).toFixed(2)}%
            </span>
            <button
              onClick={handleWatchlistToggle}
              disabled={watchlistLoading}
              title={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
              className={`p-1.5 rounded-full transition-all ${
                isWatched
                  ? 'text-yellow-400 bg-yellow-400/10'
                  : 'text-[var(--text-muted)] hover:text-yellow-400 hover:bg-yellow-400/10'
              } ${watchlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Star size={13} fill={isWatched ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Price */}
        <div className="mb-2">
          {stock.error ? (
            <span className="text-sm text-rose-400 font-medium">Unavailable</span>
          ) : (
            <span className="text-xl font-black text-[var(--text-primary)] tracking-tight">
              ₹{(stock.price ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          )}
        </div>

        {/* Sparkline */}
        {!stock.error && stock.price && (
          <div className="-mx-1 mb-2">
            <MiniSparkline price={stock.price} high={stock.high} low={stock.low} up={isPositive} />
          </div>
        )}

        {/* High / Low range bar */}
        {!stock.error && stock.high && stock.low && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
              <span>L ₹{(stock.low ?? 0).toFixed(0)}</span>
              <span>H ₹{(stock.high ?? 0).toFixed(0)}</span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--sidebar-border)' }}>
              <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, highLowPct))}%`, background: isPositive ? 'var(--up-color)' : 'var(--down-color)' }} />
            </div>
          </div>
        )}
      </div>

      {/* Watched accent bar at top */}
      {isWatched && (
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
      )}
    </div>
  );
};

export default StockCard;
