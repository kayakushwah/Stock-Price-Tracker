import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LineChart, Menu, X, TrendingUp, Activity, Star, Search, Loader, ChevronRight } from 'lucide-react';
import api from '../api/axios';

// Map of avatar IDs to their sticker image paths
const AVATAR_MAP = {
  bull:       '/assets/avatars/bull.png',
  bear:       '/assets/avatars/bear.png',
  trader:     '/assets/avatars/trader.png',
  investor:   '/assets/avatars/investor.png',
  analyst:    '/assets/avatars/analyst.png',
  penny:      '/assets/avatars/penny.png',
  quant:      '/assets/avatars/quant.png',
  crypto:     '/assets/avatars/crypto.png',
  dividend:   '/assets/avatars/dividend.png',
  volatility: '/assets/avatars/volatility.png',
};

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [avatar, setAvatar] = useState(() => localStorage.getItem('user-avatar') || 'bull');

  // Listen for avatar changes across the app
  useEffect(() => {
    const handler = () => setAvatar(localStorage.getItem('user-avatar') || 'bull');
    window.addEventListener('storage', handler);
    // Also poll every few seconds to stay in sync (for same-tab changes)
    const iv = setInterval(() => {
      const stored = localStorage.getItem('user-avatar') || 'bull';
      setAvatar(prev => prev !== stored ? stored : prev);
    }, 1000);
    return () => { window.removeEventListener('storage', handler); clearInterval(iv); };
  }, []);

  const username = user?.email?.split('@')[0] ?? 'Investor';

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LineChart },
    { to: '/market', label: 'Market Trends', icon: Activity },
    { to: '/watchlist', label: 'Watchlist', icon: Star },
  ];

  return (
    <>
      {/* Mobile toggle */}
      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl text-white shadow-lg" style={{ background: 'var(--accent-primary)' }}>
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {isOpen && <div className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 h-16 px-5 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg shadow-[var(--accent-glow)]" style={{ background: 'var(--accent-primary)' }}>
            <TrendingUp size={15} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white tracking-wide leading-none">IT Stock Tracker</h1>
            <span className="text-[10px] font-semibold" style={{ color: 'var(--accent-secondary)' }}>Live Market</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold px-3 mb-2">Navigation</p>

          {/* Search */}
          <SearchBox onClose={() => setIsOpen(false)} />

          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
              style={({ isActive }) => isActive ? { background: 'var(--accent-primary)', boxShadow: `0 4px 14px var(--accent-glow)` } : {}}
            >
              <Icon size={16} />
              {label}
              {label === 'Watchlist' && user?.watchlist?.length > 0 && (
                <span className="ml-auto text-[10px] font-black px-1.5 py-0.5 rounded-full" style={{ background: 'var(--accent-primary)', color: 'white' }}>
                  {user.watchlist.length}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Market Status */}
        <div className="mx-3 mb-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400">Market Open</span>
          </div>
          <p className="text-[10px] text-slate-500 font-semibold">NSE · BSE · 09:15–15:30 IST</p>
        </div>

        {/* ── Profile section at bottom ── */}
        <div className="border-t p-3" style={{ borderColor: 'var(--sidebar-border)' }}>
          <button
            onClick={() => { navigate('/profile'); setIsOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-left group transition-all hover:bg-white/5"
          >
            {/* Avatar */}
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 overflow-hidden p-0.5" 
              style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
              <img src={AVATAR_MAP[avatar] || AVATAR_MAP.bull} alt="avatar" className="w-full h-full object-cover rounded-lg" />
            </div>
            {/* User info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white truncate leading-tight">{username}</p>
              <p className="text-[10px] text-slate-400 font-medium truncate">{user?.email}</p>
            </div>
            <ChevronRight size={14} className="text-slate-500 group-hover:text-slate-300 transition-colors flex-shrink-0" />
          </button>
        </div>
      </aside>
    </>
  );
};

/* ── Search component ──────────────────────────────────── */
function SearchBox({ onClose }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (query.trim().length === 0) { setResults([]); return; }
    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await api.get(`/stocks/search?q=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return (
    <div className="mb-1">
      <button
        onClick={() => { setOpen(o => !o); setQuery(''); }}
        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${open ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
      >
        <Search size={15} /> Search Stock
      </button>

      {open && (
        <div className="mt-1 mx-1 rounded-xl overflow-hidden" style={{ background: 'var(--sidebar-bg)', border: '1px solid var(--sidebar-border)' }}>
          <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
            <Search size={12} className="text-slate-500" />
            <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Type to search…"
              className="bg-transparent text-xs text-white placeholder-slate-500 outline-none flex-1" />
            {query && <button onClick={() => setQuery('')} className="text-slate-500 hover:text-white text-xs">✕</button>}
          </div>
          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <p className="text-center text-slate-500 text-xs py-4 flex items-center justify-center gap-2">
                <Loader size={12} className="animate-spin" /> Searching...
              </p>
            ) : results.length === 0 && query.trim().length > 0 ? (
              <p className="text-center text-slate-500 text-xs py-4">No results found</p>
            ) : results.length === 0 ? (
              <p className="text-center text-slate-500 text-xs py-4">Search global stocks…</p>
            ) : results.map(s => (
              <NavLink key={s.symbol} to={`/stock/${s.symbol}`} onClick={onClose}
                className="flex items-center justify-between px-3 py-2.5 hover:bg-white/5 transition-colors group">
                <div>
                  <p className="text-xs font-black text-white">{s.symbol}</p>
                  <p className="text-[10px] text-slate-500">{s.name}</p>
                </div>
                <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold" style={{ color: 'var(--accent-primary)' }}>View →</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
