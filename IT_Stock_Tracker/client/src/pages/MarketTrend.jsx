import { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp, TrendingDown, Activity, Zap, ArrowUpRight,
  ArrowDownRight, RefreshCw, BarChart2, Flame, Snowflake, X
} from 'lucide-react';
import api from '../api/axios';
import HelpTip from '../components/HelpTip';
import CompanyLogo from '../components/CompanyLogo';
import { useNavigate } from 'react-router-dom';


const NIFTY_IT_HISTORY = (() => {
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
  let v = 34000;
  return months.map(m => {
    v += (Math.random() - 0.44) * 1200;
    return { month: m, value: Math.round(v) };
  });
})();

const BREADTH = { advances: 1342, declines: 892, unchanged: 156 };
const BREADTH_TOTAL = BREADTH.advances + BREADTH.declines + BREADTH.unchanged;
const FEAR_GREED = 65;


const StatBadge = ({ label, value, sub, up, icon: Icon, tip }) => (
  <div className="glass-card rounded-2xl p-5 overflow-hidden transition-transform hover:scale-[1.02] group relative">
    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[var(--accent-glow)] opacity-0 group-hover:opacity-20 transition-opacity" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest flex items-center gap-1">
          {label}{tip && <HelpTip topic={tip} />}
        </p>
        {Icon && <Icon size={15} className={up ? 'text-profit' : 'text-loss'} />}
      </div>
      <p className="text-2xl font-extrabold text-[var(--text-primary)] mb-1">{value}</p>
      {sub !== undefined && (
        <p className={`text-[11px] font-bold flex items-center gap-1 ${up ? 'text-profit' : 'text-loss'}`}>
          {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}{sub}
        </p>
      )}
    </div>
  </div>
);

const SectorCard = ({ sector, onClick }) => {
  const up = sector.change >= 0;
  return (
    <div
      onClick={() => onClick(sector)}
      className="glass-card rounded-xl p-4 transition-all hover:scale-[1.02] cursor-pointer hover:border-[var(--accent-primary)] group relative overflow-hidden"
      style={{ border: '1px solid var(--card-border)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[var(--accent-glow)] opacity-0 group-hover:opacity-20 transition-opacity" />
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-sm font-black text-[var(--text-primary)]">{sector.name}</p>
          <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-semibold">{sector.stocks.length} stocks · {sector.mktCap}</p>
        </div>
        <span className={`text-sm font-extrabold flex items-center gap-0.5 ${up ? 'text-profit' : 'text-loss'}`}>
          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {up ? '+' : ''}{sector.change.toFixed(2)}%
        </span>
      </div>
      <div className="mt-3 h-1.5 rounded-full overflow-hidden relative z-10" style={{ background: 'var(--sidebar-border)' }}>
        <div className="h-full rounded-full" style={{ width: `${50 + sector.change * 10}%`, background: up ? 'var(--up-color)' : 'var(--down-color)', transition: 'width 1s ease' }} />
      </div>
    </div>
  );
};

export default function MarketTrend() {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedSector, setSelectedSector] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [stocksRes, sectorsRes] = await Promise.all([
        api.get('/stocks?symbols=TCS.BSE,INFY.BSE,WIT,HCLTECH.BSE,TECHM.BSE,LTIM.BSE,PERSISTENT.BSE,MPHASIS.BSE,KPITTECH.BSE,COFORGE.BSE'),
        api.get('/stocks/sectors')
      ]);
      setStocks(stocksRes.data ?? []);
      setSectors(sectorsRes.data ?? []);
      setLastUpdated(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // All stocks sorted for gainers/losers — show up to 10 each
  const validStocks = stocks.filter(s => !s.error && s.changePercent !== undefined);
  const gainers = [...validStocks].filter(s => s.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent).slice(0, 10);
  const losers = [...validStocks].filter(s => s.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent).slice(0, 10);
  // Fill remaining slots from all sorted (for when all are same sign)
  const allSorted = [...validStocks].sort((a, b) => b.changePercent - a.changePercent);
  const finalGainers = gainers.length > 0 ? gainers : allSorted.slice(0, 5);
  const finalLosers = losers.length > 0 ? losers : allSorted.slice(-5).reverse();

  const fgColor = FEAR_GREED >= 70 ? 'var(--up-color)' : FEAR_GREED <= 30 ? 'var(--down-color)' : '#f59e0b';
  const fgLabel = FEAR_GREED >= 70 ? 'Greed' : FEAR_GREED <= 30 ? 'Fear' : 'Neutral';

  return (
    <div className="space-y-6 fade-in-up pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity size={22} className="text-[var(--accent-primary)]" />
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">Market Trends <HelpTip topic="market_snapshot" /></h1>
          </div>
          <p className="text-sm text-[var(--text-secondary)] font-medium">
            Updated {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-all"
          style={{ border: '1px solid var(--card-border)' }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBadge label="SENSEX" value="73,247" sub="+312 (+0.43%)" up={true} icon={TrendingUp} tip="sensex" />
        <StatBadge label="NIFTY 50" value="22,197" sub="+91 (+0.41%)" up={true} icon={TrendingUp} tip="nifty" />
        <StatBadge label="NIFTY IT" value="36,841" sub="-124 (-0.34%)" up={false} icon={TrendingDown} tip="nifty it" />
        <StatBadge label="INDIA VIX" value="14.23" sub="-3.07%" up={true} icon={Zap} tip="vix" />
      </div>

      {/* Market Breadth + Fear/Greed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6" style={{ border: '1px solid var(--card-border)' }}>
          <p className="text-sm font-bold text-[var(--text-primary)] mb-5 flex items-center gap-2">
            <BarChart2 size={16} className="text-[var(--accent-primary)]" />
            Market Breadth <HelpTip topic="market_breadth" />
            <span className="text-xs text-[var(--text-muted)] font-normal ml-auto">NSE · {BREADTH_TOTAL} stocks</span>
          </p>
          <div className="space-y-4">
            {[
              { label: 'Advances', count: BREADTH.advances, color: 'var(--up-color)' },
              { label: 'Declines', count: BREADTH.declines, color: 'var(--down-color)' },
              { label: 'Unchanged', count: BREADTH.unchanged, color: 'var(--text-muted)' },
            ].map(({ label, count, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold text-[var(--text-secondary)]">{label}</span>
                  <span className="font-extrabold" style={{ color }}>{count}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--sidebar-border)' }}>
                  <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${(count / BREADTH_TOTAL) * 100}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group" style={{ border: '1px solid var(--card-border)' }}>
          <p className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            Sentiment <HelpTip topic="bull_bear" />
          </p>
          <div className="relative w-28 h-28">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 drop-shadow-lg">
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--sidebar-border)" strokeWidth="14" />
              <circle cx="50" cy="50" r="40" fill="none" stroke={fgColor} strokeWidth="14"
                strokeDasharray={`${(FEAR_GREED / 100) * 251} 251`} strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-[var(--text-primary)]">{FEAR_GREED}</span>
              <span className="text-[10px] font-black uppercase tracking-widest mt-0.5" style={{ color: fgColor }}>{fgLabel}</span>
            </div>
          </div>
          <div className="flex justify-between w-full text-xs mt-4 px-2 font-bold">
            <span className="text-rose-400 flex items-center gap-1"><Snowflake size={12} /> Fear</span>
            <span className="text-emerald-400 flex items-center gap-1">Greed <Flame size={12} /></span>
          </div>
        </div>
      </div>

      {/* Sector Performance */}
      <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid var(--card-border)' }}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <BarChart2 size={16} className="text-[var(--accent-primary)]" /> Sector Performance <HelpTip topic="sector_perf" />
            <span className="text-[10px] font-bold text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-2 py-1 rounded-full animate-pulse ml-1">Explore all sectors!</span>
          </p>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-24 rounded-xl shimmer" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {sectors.map(s => <SectorCard key={s.name} sector={s} onClick={setSelectedSector} />)}
          </div>
        )}
      </div>

      {/* Top Gainers & Losers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Gainers */}
        <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid var(--card-border)' }}>
          <p className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-500" />
            Top Gainers
            <HelpTip topic="top_gainers" />
            <span className="text-[10px] text-[var(--text-muted)] font-normal ml-auto">IT Stocks</span>
          </p>
          {loading ? (
            <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 rounded-xl shimmer" />)}</div>
          ) : finalGainers.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)] text-center py-6">No data yet</p>
          ) : finalGainers.map(s => (
            <div key={s.symbol} onClick={() => navigate(`/stock/${s.symbol}`)}
              className="flex items-center gap-3 py-2.5 border-b last:border-0 cursor-pointer hover:bg-[var(--accent-primary)]/5 px-2 -mx-2 rounded-xl transition-all"
              style={{ borderColor: 'var(--card-border)' }}
            >
              <CompanyLogo symbol={s.symbol} size={34} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold text-[var(--text-primary)] truncate">{s.symbol}</p>
                <p className="text-[10px] text-[var(--text-muted)] font-semibold">₹{(s.price ?? 0).toFixed(2)}</p>
              </div>
              <span className="text-sm font-extrabold text-profit flex items-center gap-0.5 flex-shrink-0">
                <ArrowUpRight size={13} />+{(s.changePercent ?? 0).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>

        {/* Losers */}
        <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid var(--card-border)' }}>
          <p className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <TrendingDown size={16} className="text-rose-500" />
            Top Losers
            <HelpTip topic="top_losers" />
            <span className="text-[10px] text-[var(--text-muted)] font-normal ml-auto">IT Stocks</span>
          </p>
          {loading ? (
            <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 rounded-xl shimmer" />)}</div>
          ) : finalLosers.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)] text-center py-6">No data yet</p>
          ) : finalLosers.map(s => (
            <div key={s.symbol} onClick={() => navigate(`/stock/${s.symbol}`)}
              className="flex items-center gap-3 py-2.5 border-b last:border-0 cursor-pointer hover:bg-[var(--accent-primary)]/5 px-2 -mx-2 rounded-xl transition-all"
              style={{ borderColor: 'var(--card-border)' }}
            >
              <CompanyLogo symbol={s.symbol} size={34} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold text-[var(--text-primary)] truncate">{s.symbol}</p>
                <p className="text-[10px] text-[var(--text-muted)] font-semibold">₹{(s.price ?? 0).toFixed(2)}</p>
              </div>
              <span className="text-sm font-extrabold text-loss flex items-center gap-0.5 flex-shrink-0">
                <ArrowDownRight size={13} />{(s.changePercent ?? 0).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sector Drill-Down Modal */}
      {selectedSector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/60" onClick={() => setSelectedSector(null)}>
          <div
            className="w-full max-w-4xl rounded-3xl overflow-hidden flex flex-col max-h-[85vh] shadow-2xl"
            style={{ background: 'var(--bg-base)', border: '1px solid var(--accent-primary)', boxShadow: `0 0 60px var(--accent-glow)` }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--card-border)', background: 'var(--sidebar-bg)' }}>
              <div>
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <span style={{ color: 'var(--accent-primary)' }}>#</span> {selectedSector.name} Sector
                </h2>
                <p className="text-sm text-slate-400 mt-1 font-medium">Top stocks of this sector — click any to explore details.</p>
              </div>
              <button onClick={() => setSelectedSector(null)} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                <X size={22} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto" style={{ background: 'var(--bg-main)' }}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedSector.stocks.map((symbol, idx) => (
                    <div
                      key={symbol}
                      onClick={() => navigate(`/stock/${symbol}`)}
                      className="p-4 rounded-2xl cursor-pointer group relative overflow-hidden transition-all hover:scale-[1.05]"
                      style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', animationDelay: `${idx * 40}ms` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[var(--accent-glow)] opacity-0 group-hover:opacity-30 transition-opacity" />
                      <div className="relative z-10 flex items-center gap-3 mb-3">
                        <CompanyLogo symbol={symbol} size={36} />
                        <p className="font-extrabold text-sm text-[var(--text-primary)] leading-tight">{symbol}</p>
                      </div>
                      <span className="text-xs font-bold text-[var(--accent-primary)] flex items-center gap-1 relative z-10 group-hover:translate-x-1 transition-transform">
                        Explore <ArrowUpRight size={12} />
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
