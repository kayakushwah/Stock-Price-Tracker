import { useState, useRef, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';
import { useMode } from '../hooks/useMode';

const TIPS = {
  sensex: "SENSEX is the benchmark index of the BSE (Bombay Stock Exchange). It tracks India's top 30 largest companies. Think of it as the \"mood ring\" of the Indian market!",
  nifty: "NIFTY 50 tracks the 50 biggest companies on the NSE. When NIFTY goes up, it usually means the overall market is doing well.",
  pe_ratio: "P/E Ratio (Price-to-Earnings) = How much you pay for every ₹1 of profit. A stock with P/E of 20 means you pay ₹20 for ₹1 of earnings. Lower P/E can mean a bargain!",
  market_cap: "Market Cap = Stock Price × Total Shares. A company worth ₹10 lakh crore is 'Large Cap'. It tells you the size of a company in the market.",
  dividend: "Dividends are like a 'thank you' bonus! Companies share part of their profits with you just for holding their stock.",
  volatility: "Volatility = how wildly the price swings. High volatility means big ups and downs — more risk, but more potential reward too!",
  volume: "Volume = total shares traded today. High volume means lots of people are buying/selling. It signals strong interest in the stock.",
  bull_bear: "Bull market = prices rising 🐂 (optimistic). Bear market = prices falling 🐻 (pessimistic). It describes the overall market direction.",
  vix: "India VIX is the 'Fear Index'. High VIX (>20) = investors are scared. Low VIX (<15) = calm market. Useful to gauge how nervous traders are.",
  market_breadth: "Market Breadth shows if the WHOLE market is healthy — not just a few big stocks. More advances than declines = broad market rally.",
  high_low: "Today's High & Low show the price range during the trading session. The further apart they are, the more volatile the stock was today.",
  open_price: "Open Price is where the stock started trading at 9:15 AM. Comparing it to the current price tells you how the day is going.",
  change_percent: "Change % shows how much the stock moved today vs. yesterday's close. +2% = it rose 2%. -2% = it fell 2%.",
  watchlist: "Your Watchlist is like a favorites list. Add stocks to track them without buying. Great for keeping an eye on stocks you like!",
  top_gainers: "Top Gainers are today's best-performing stocks — the ones that rose the most in percentage terms.",
  top_losers: "Top Losers are stocks that fell the most today. Sometimes a dip is an opportunity to buy at a lower price!",
  equity: "Equity (or share/stock) = owning a small piece of a company. If the company does well, your piece becomes more valuable.",
  eps: "Earnings Per Share (EPS) is the portion of a company's profit allocated to each outstanding share of common stock.",
  market_snapshot: "The snapshot gives you a quick overview of how the IT sector and overall market indices are performing today.",
  sector_perf: "Sector performance shows which industries (like IT, Banking, Auto) are leading or lagging in the market today.",
  gainers_losers: "Keep track of the biggest movers in the market to identify trends or potential buy/sell opportunities.",
  stock_details: "Detailed view of a stock's performance, including interactive charts, key metrics, and beginner-friendly analysis.",
  p_l: "P&L (Profit and Loss) statement shows the financial performance of your portfolio over a specific period.",
};

export default function HelpTip({ topic, align = 'right' }) {
  const { isBeginnerMode } = useMode();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, openUp: false });
  const triggerRef = useRef(null);

  // In Pro mode, don't render tips at all
  if (!isBeginnerMode) return null;

  const tip = TIPS[topic] || "The stock market is where buyers and sellers trade shares of companies. Prices move based on supply, demand, and news!";

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpwards = spaceBelow < 220;
      
      setPosition({
        top: openUpwards ? rect.top - 10 : rect.bottom + 10,
        left: align === 'right' ? rect.right : rect.left,
        openUp: openUpwards
      });
    }
  };

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!open) {
      updatePosition();
    }
    setOpen(prev => !prev);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleScroll = () => {
      if (open) setOpen(false); // Close on scroll to avoid position desync
    };
    document.addEventListener('mousedown', close);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', close);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [open]);

  return (
    <span className="helptip-wrapper inline-flex items-center">
      <button
        ref={triggerRef}
        onClick={handleToggle}
        className={`transition-all ml-1 focus:outline-none flex-shrink-0 p-0.5 rounded-full ${open ? 'text-yellow-400 scale-125 bg-yellow-400/10' : 'text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:scale-125'}`}
        title="Beginner tip — click me!"
      >
        <Lightbulb size={12} className={open ? 'animate-pulse' : ''} />
      </button>

      {open && (
        <div
          className={`fixed z-[99999] w-72 rounded-2xl shadow-2xl border fade-in-scale`}
          style={{
            top: position.top,
            left: position.left,
            transform: `translate(${align === 'right' ? '-100%' : '0'}, ${position.openUp ? '-100%' : '0'})`,
            background: 'var(--sidebar-bg)',
            borderColor: 'var(--accent-primary)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px var(--accent-primary)/30',
            backdropFilter: 'blur(20px)',
            pointerEvents: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Arrow */}
          <div
            className={`absolute w-3 h-3 rotate-45 border ${position.openUp ? '-bottom-1.5 border-r border-b' : '-top-1.5 border-l border-t'} ${align === 'right' ? 'right-4' : 'left-4'}`}
            style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--accent-primary)' }}
          />

          <div className="p-4 flex items-start gap-3">
            <div className="p-2 rounded-xl flex-shrink-0 mt-0.5" style={{ background: 'rgba(250, 204, 21, 0.15)' }}>
              <Lightbulb size={14} className="text-yellow-400" />
            </div>
            <div>
              <p className="font-black text-[10px] uppercase tracking-widest mb-1.5" style={{ color: 'var(--accent-primary)' }}>Beginner Lesson 💡</p>
              <p className="text-[13px] leading-relaxed font-bold italic" style={{ color: 'rgba(255,255,255,0.95)' }}>
                "{tip}"
              </p>
            </div>
          </div>
        </div>
      )}
    </span>
  );
}
