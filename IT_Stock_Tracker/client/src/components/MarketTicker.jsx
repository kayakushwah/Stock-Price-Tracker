import { useEffect, useRef } from 'react';

const indices = [
  { name: 'SENSEX', value: '73,247.12', change: '+312.45', pct: '+0.43%', up: true },
  { name: 'NIFTY 50', value: '22,196.95', change: '+91.20', pct: '+0.41%', up: true },
  { name: 'NIFTY IT', value: '36,841.30', change: '-124.80', pct: '-0.34%', up: false },
  { name: 'NIFTY BANK', value: '46,532.10', change: '+210.50', pct: '+0.45%', up: true },
  { name: 'BSE 500', value: '31,024.55', change: '+89.30', pct: '+0.29%', up: true },
  { name: 'INDIA VIX', value: '14.23', change: '-0.45', pct: '-3.07%', up: false },
];

const news = [
  "🔥 Global tech stocks rally as AI demand surges across sectors",
  "📉 RBI holds interest rates steady at 6.5% for the 6th consecutive time",
  "💰 Reliance Industries announces massive green energy investment",
  "🚀 TCS reports double-digit growth in cloud services and AI",
  "⚡ Electric vehicle sales jump 45% year-over-year in India",
  "📊 FIIs inject ₹12,000 Crore into Indian Equities this week"
];

// Interleave indices and news
const tickerItems = [];
for (let i = 0; i < Math.max(indices.length, news.length); i++) {
  if (indices[i]) tickerItems.push({ type: 'index', data: indices[i] });
  if (news[i]) tickerItems.push({ type: 'news', data: news[i] });
}

// Duplicate for seamless loop
const doubled = [...tickerItems, ...tickerItems];

export default function MarketTicker() {
  return (
    <div className="w-full overflow-hidden border-b py-2 px-0 select-none glass-card border-x-0 border-t-0 rounded-none shadow-none z-10 relative">
      <div className="ticker-track flex">
        {doubled.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-6 border-r border-[var(--border-color)] whitespace-nowrap flex-shrink-0"
          >
            {item.type === 'index' ? (
              <>
                <span className="text-xs font-bold text-[var(--text-secondary)] tracking-wider">{item.data.name}</span>
                <span className="text-xs font-extrabold text-[var(--text-primary)]">{item.data.value}</span>
                <span className={`text-xs font-bold ${item.data.up ? 'text-profit' : 'text-loss'}`}>
                  {item.data.change} ({item.data.pct})
                </span>
              </>
            ) : (
              <span className="text-xs font-medium text-[var(--text-primary)] tracking-wide">
                {item.data}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
