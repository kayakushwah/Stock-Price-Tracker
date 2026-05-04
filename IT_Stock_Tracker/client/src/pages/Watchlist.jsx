import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import CompanyLogo from '../components/CompanyLogo';
import PriceChart from '../components/PriceChart';
import {
  Star, TrendingUp, TrendingDown, RefreshCw, LayoutGrid, ArrowRight, MousePointer2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const WatchlistListItem = ({ stock, onRemove, onSelect, isActive }) => {
  const isPositive = (stock.changePercent ?? 0) >= 0;

  return (
    <div
      onClick={() => onSelect(stock)}
      className={`group cursor-pointer p-4 rounded-2xl transition-all border ${
        isActive 
          ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/30 shadow-lg shadow-[var(--accent-glow)]/10' 
          : 'bg-white/5 border-white/5 hover:bg-white/10'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <CompanyLogo symbol={stock.symbol} size={32} />
          <div>
            <h3 className={`text-sm font-black tracking-tight ${isActive ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'}`}>
              {stock.symbol}
            </h3>
            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase">NSE/BSE</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-[var(--text-primary)]">
            ₹{(stock.price ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 1 })}
          </p>
          <span className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${isPositive ? 'text-profit' : 'text-loss'}`}>
            {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {Math.abs(stock.changePercent ?? 0).toFixed(2)}%
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(stock.symbol); }}
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
        >
          <Star size={14} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};

export default function Watchlist() {
  const { user, updateWatchlist } = useAuth();
  const [allStocks, setAllStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);

  const fetchStocks = useCallback(async () => {
    setLoading(true);
    try {
      const itSymbols = 'TCS.BSE,INFY.BSE,WIT,HCLTECH.BSE,TECHM.BSE,LTIM.BSE,PERSISTENT.BSE,MPHASIS.BSE,KPITTECH.BSE,COFORGE.BSE';
      const watched = user?.watchlist ?? [];
      const query = [...new Set([...itSymbols.split(','), ...watched])].join(',');
      const res = await api.get(`/stocks?symbols=${query}`);
      const data = res.data ?? [];
      setAllStocks(data);
      
      const watchedData = data.filter(s => watched.includes(s.symbol));
      if (watchedData.length > 0 && !selectedStock) {
        setSelectedStock(watchedData[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user?.watchlist, selectedStock]);

  useEffect(() => { fetchStocks(); }, [fetchStocks]);

  const watchedSymbols = user?.watchlist ?? [];
  const watchedStocks = allStocks.filter(s => watchedSymbols.includes(s.symbol));

  const handleRemove = async (symbol) => {
    try {
      const res = await api.post('/watchlist', { symbol });
      updateWatchlist(res.data.watchlist);
      if (selectedStock?.symbol === symbol) {
        setSelectedStock(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 fade-in-up pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Star size={20} className="text-yellow-400" fill="currentColor" />
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">Technical Watchlist</h1>
          </div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            Advanced charting and real-time monitoring for your {watchedStocks.length} tracked stocks
          </p>
        </div>
        <button
          onClick={fetchStocks}
          className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl text-sm font-bold transition-all border border-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Refresh Data
        </button>
      </div>

      {watchedStocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 glass-card rounded-3xl text-center border border-white/5">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 text-5xl bg-yellow-400/10 border border-yellow-400/20 shadow-xl shadow-yellow-400/10">⭐</div>
          <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">Your Watchlist is Empty</h2>
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-6 max-w-xs">
            Start tracking stocks by clicking the star icon on the Dashboard to see detailed technical analysis here.
          </p>
          <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-extrabold text-sm text-white transition-all shadow-lg shadow-[var(--accent-glow)] bg-[var(--accent-primary)] hover:scale-105 active:scale-95">
            <LayoutGrid size={15} />
            Explore Markets
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          {/* Left Column: List */}
          <div className="xl:col-span-1 space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-2 custom-scrollbar">
            {watchedStocks.map(stock => (
              <WatchlistListItem 
                key={stock.symbol} 
                stock={stock} 
                isActive={selectedStock?.symbol === stock.symbol}
                onSelect={setSelectedStock}
                onRemove={handleRemove} 
              />
            ))}
          </div>

          {/* Right Column: Full Price Chart */}
          <div className="xl:col-span-2">
            {selectedStock ? (
              <PriceChart 
                selectedStock={selectedStock} 
                onSelectStock={setSelectedStock}
                stocks={watchedStocks}
              />
            ) : (
              <div className="h-[500px] glass-card rounded-3xl flex flex-col items-center justify-center text-center border border-white/5 border-dashed">
                <MousePointer2 size={40} className="text-[var(--text-muted)] mb-4 animate-bounce" />
                <p className="text-[var(--text-secondary)] font-bold">Select a stock from the left<br/>to view detailed performance chart</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
