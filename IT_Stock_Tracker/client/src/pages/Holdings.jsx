import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import { Briefcase, TrendingUp, TrendingDown, AlertCircle, RefreshCw, Bell, BellRing, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Holdings = () => {
  const { user, setUser } = useAuth();
  const [holdingsData, setHoldingsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Alert settings state
  const [editingAlert, setEditingAlert] = useState(null);
  const [alertPrice, setAlertPrice] = useState('');

  const fetchHoldingsPrices = async (isManual = false) => {
    if (!user?.holdings || user.holdings.length === 0) {
      setHoldingsData([]);
      setLoading(false);
      return;
    }

    if (isManual) setIsRefreshing(true);
    else setLoading(true);

    try {
      const symbols = user.holdings.map(h => h.symbol).join(',');
      const response = await api.get(`/stocks?symbols=${symbols}`);
      
      const merged = user.holdings.map(h => {
        const live = response.data.find(s => s.symbol === h.symbol) || {};
        return { ...h, ...live };
      });
      
      setHoldingsData(merged);
    } catch (err) {
      setError('Failed to refresh holdings prices');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHoldingsPrices();
  }, [user?.holdings]);

  const removeHolding = async (symbol) => {
    try {
      const res = await api.delete(`/auth/holdings/${symbol}`);
      const updatedUser = { ...user, holdings: res.data.holdings };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Failed to remove holding');
    }
  };

  const saveAlert = async () => {
    // In a real app, this would call an API to save the alert price
    // For now, we'll just simulate it by updating the user object locally
    // and informing the user it's saved.
    const updatedHoldings = user.holdings.map(h => 
      h.symbol === editingAlert ? { ...h, alertPrice: parseFloat(alertPrice) } : h
    );
    const updatedUser = { ...user, holdings: updatedHoldings };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setEditingAlert(null);
    setAlertPrice('');
    
    // We would also trigger a backend update here
    await api.put('/auth/profile', { holdings: updatedHoldings });
  };

  return (
    <div className="space-y-6 fade-in-up pb-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-3">
            <Briefcase size={32} className="text-[var(--accent-primary)]" />
            My Holdings
          </h1>
          <p className="text-sm font-medium text-[var(--text-secondary)] mt-1">
            Track stocks you hold and set price alerts for email notifications.
          </p>
        </div>
        <button 
          onClick={() => fetchHoldingsPrices(true)} 
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl text-sm font-bold hover:text-[var(--accent-primary)] transition-all"
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          Refresh Prices
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl flex items-center gap-3 text-rose-500 font-bold text-sm">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-40 rounded-2xl shimmer" />)}
        </div>
      ) : holdingsData.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center">
          <div className="bg-[var(--accent-primary)]/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase size={32} className="text-[var(--accent-primary)]" />
          </div>
          <h2 className="text-xl font-black text-[var(--text-primary)] mb-2">No Holdings Yet</h2>
          <p className="text-[var(--text-secondary)] text-sm mb-6 max-w-md mx-auto">
            You aren't holding any stocks yet. Click "Hold" on any stock page to add it here and set alerts.
          </p>
          <Link to="/dashboard" className="px-6 py-3 bg-[var(--accent-primary)] text-white font-black rounded-xl hover:opacity-90 transition-all inline-block shadow-lg shadow-[var(--accent-glow)]">
            Explore Market
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {holdingsData.map((stock) => (
            <div key={stock.symbol} className="glass-card rounded-2xl p-5 border border-[var(--border-color)] hover:border-[var(--accent-primary)]/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <Link to={`/stock/${stock.symbol}`}>
                  <h3 className="text-lg font-black text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">{stock.symbol}</h3>
                  <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">{stock.companyName}</p>
                </Link>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setEditingAlert(stock.symbol); setAlertPrice(stock.alertPrice || ''); }}
                    className={`p-2 rounded-lg transition-all ${stock.alertPrice ? 'bg-amber-500/10 text-amber-500' : 'hover:bg-white/5 text-[var(--text-muted)]'}`}
                    title="Set Price Alert"
                  >
                    {stock.alertPrice ? <BellRing size={16} /> : <Bell size={16} />}
                  </button>
                  <button 
                    onClick={() => removeHolding(stock.symbol)}
                    className="p-2 rounded-lg hover:bg-rose-500/10 text-[var(--text-muted)] hover:text-rose-500 transition-all"
                    title="Remove Holding"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
                    ₹{stock.price?.toLocaleString('en-IN') || '---'}
                  </p>
                  <p className={`text-xs font-bold flex items-center gap-1 ${stock.changePercent >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {stock.changePercent >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {stock.changePercent?.toFixed(2)}%
                  </p>
                </div>
                {stock.alertPrice && (
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Alert At</p>
                    <p className="text-sm font-black text-[var(--text-primary)]">₹{stock.alertPrice.toLocaleString('en-IN')}</p>
                  </div>
                )}
              </div>

              {editingAlert === stock.symbol && (
                <div className="mt-4 pt-4 border-t border-[var(--border-color)] animate-in fade-in slide-in-from-top-2">
                  <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-2">Set Target Price for Email Alert</p>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      value={alertPrice}
                      onChange={(e) => setAlertPrice(e.target.value)}
                      placeholder="Enter target price..."
                      className="bg-[var(--bg-base)] border border-[var(--border-color)] text-sm rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                    />
                    <button 
                      onClick={saveAlert}
                      className="px-4 py-2 bg-[var(--accent-primary)] text-white text-xs font-black rounded-lg hover:opacity-90"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setEditingAlert(null)}
                      className="px-3 py-2 hover:bg-white/5 text-[var(--text-secondary)] text-xs font-bold rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Holdings;
