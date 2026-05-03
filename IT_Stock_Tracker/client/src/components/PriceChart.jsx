import { useState, useEffect } from 'react';
import {
  AreaChart, Area,
  BarChart, Bar,
  ComposedChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { RefreshCw, TrendingUp, TrendingDown, BarChart2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import api from '../api/axios';

const PERIODS = ['1D', '1W', '1M', '3M', '1Y'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-slate-900 text-white text-xs px-3 py-2.5 rounded-xl shadow-xl border border-white/10 space-y-1 min-w-[140px]">
      <p className="text-slate-400 font-medium">{label}</p>
      {d?.open !== undefined ? (
        <>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">O</span><span className="font-bold">₹{d.open?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-emerald-400">H</span><span className="font-bold">₹{d.high?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-rose-400">L</span><span className="font-bold">₹{d.low?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-300">C</span><span className="font-bold text-white">₹{d.close?.toFixed(2)}</span>
          </div>
          {d.volume > 0 && (
            <div className="flex justify-between gap-4 border-t border-white/10 pt-1 mt-1">
              <span className="text-slate-400">Vol</span>
              <span className="font-semibold">{(d.volume / 1e6).toFixed(2)}M</span>
            </div>
          )}
        </>
      ) : (
        <p className="font-bold text-base">₹{payload[0].value?.toFixed(2)}</p>
      )}
    </div>
  );
};

const PriceChart = ({ stocks, selectedStock, onSelectStock }) => {
  const [period, setPeriod] = useState('1M');
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedStock?.symbol || selectedStock?.error) return;
    setLoading(true);
    setError('');
    api.get(`/stocks/${encodeURIComponent(selectedStock.symbol)}/history?period=${period}`)
      .then(res => setHistoryData(res.data.history || []))
      .catch(() => setError('Could not load history'))
      .finally(() => setLoading(false));
  }, [selectedStock?.symbol, period]);

  if (!selectedStock) return null;

  const isPositive = (selectedStock.changePercent ?? 0) >= 0;
  const strokeColor = isPositive ? '#0ecb81' : '#f6465d';
  const fillId = `chart-fill-${selectedStock.symbol}`;

  const firstClose = historyData[0]?.close ?? selectedStock.price;
  const lastClose  = historyData[historyData.length - 1]?.close ?? selectedStock.price;
  const periodChange = lastClose - firstClose;
  const periodChangePct = ((periodChange / firstClose) * 100).toFixed(2);
  const periodUp = periodChange >= 0;

  const maxVol = Math.max(...historyData.map(d => d.volume || 0));

  // Map history to chart data
  const chartData = historyData.map(d => ({
    ...d,
    time: d.label,
    price: d.close,
  }));

  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
      {/* Stock tabs */}
      {stocks?.length > 0 && (
        <div className="flex gap-2 px-5 pt-5 pb-0 overflow-x-auto">
          {stocks.filter(s => !s.error).map(s => (
            <button
              key={s.symbol}
              onClick={() => onSelectStock(s)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedStock.symbol === s.symbol
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-300/40'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {s.symbol}
            </button>
          ))}
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1">{selectedStock.symbol}</p>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-900">
                ₹{(selectedStock.price ?? 0).toFixed(2)}
              </span>
              <span className={`text-sm font-bold flex items-center gap-1 ${isPositive ? 'text-profit' : 'text-loss'}`}>
                {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {isPositive ? '+' : ''}{(selectedStock.changePercent ?? 0).toFixed(2)}% today
              </span>
            </div>
            {historyData.length > 0 && (
              <p className={`text-xs mt-1 font-medium ${periodUp ? 'text-profit' : 'text-loss'}`}>
                {period} change: {periodUp ? '+' : ''}{periodChange.toFixed(2)} ({periodUp ? '+' : ''}{periodChangePct}%)
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Stats */}
            <div className="flex gap-4 text-right text-xs">
              <div>
                <p className="text-slate-400 uppercase tracking-wider font-semibold mb-0.5">High</p>
                <p className="font-bold text-emerald-600">₹{(selectedStock.high ?? 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-slate-400 uppercase tracking-wider font-semibold mb-0.5">Low</p>
                <p className="font-bold text-rose-500">₹{(selectedStock.low ?? 0).toFixed(2)}</p>
              </div>
            </div>

            {/* Period selector */}
            <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
              {PERIODS.map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                    period === p
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart */}
        {loading ? (
          <div className="h-52 flex items-center justify-center">
            <RefreshCw size={22} className="animate-spin text-indigo-400" />
          </div>
        ) : error ? (
          <div className="h-52 flex items-center justify-center text-sm text-slate-400">{error}</div>
        ) : (
          <>
            {/* Price chart */}
            <ResponsiveContainer width="100%" height={190}>
              <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={strokeColor} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10 }} interval="preserveStartEnd" dy={8} />
                <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  tickFormatter={v => `₹${v.toFixed(0)}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="price" stroke={strokeColor} strokeWidth={2.5}
                  fill={`url(#${fillId})`} dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: strokeColor }} />
              </ComposedChart>
            </ResponsiveContainer>

            {/* Volume bar chart */}
            <div className="mt-2">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                <BarChart2 size={10} /> Volume
              </p>
              <ResponsiveContainer width="100%" height={40}>
                <BarChart data={chartData} margin={{ top: 0, right: 5, left: -20, bottom: 0 }}>
                  <Bar dataKey="volume" fill={strokeColor} opacity={0.35} radius={[2, 2, 0, 0]} />
                  <XAxis hide dataKey="time" />
                  <YAxis hide />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* OHLC Table */}
            {historyData.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">
                  Latest Session OHLC
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Open', val: historyData[historyData.length - 1]?.open },
                    { label: 'High', val: historyData[historyData.length - 1]?.high, clr: 'text-emerald-600' },
                    { label: 'Low',  val: historyData[historyData.length - 1]?.low,  clr: 'text-rose-500'  },
                    { label: 'Close',val: historyData[historyData.length - 1]?.close },
                  ].map(({ label, val, clr }) => (
                    <div key={label} className="bg-slate-50 rounded-lg px-3 py-2">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{label}</p>
                      <p className={`text-sm font-extrabold ${clr ?? 'text-slate-800'}`}>
                        ₹{(val ?? 0).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PriceChart;
