import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Lightbulb } from 'lucide-react';
import { useMode } from '../hooks/useMode';
import { motion, AnimatePresence } from 'framer-motion';

const TIPS = {
  sensex: "SENSEX: The benchmark index of the Bombay Stock Exchange (BSE), representing the weighted average of 30 well-established and financially sound companies.",
  nifty: "NIFTY 50: The flagship index of the National Stock Exchange (NSE), tracking the performance of the 50 largest and most liquid Indian companies.",
  pe_ratio: "P/E RATIO: A valuation metric calculated by dividing a security's current market price by its Earnings Per Share (EPS). It indicates the cost basis for current earnings.",
  market_cap: "MARKET CAPITALIZATION: The total valuation of a corporation's outstanding equity, calculated as [Current Share Price × Total Outstanding Shares].",
  dividend: "DIVIDENDS: A corporate distribution of a portion of earnings to shareholders, representing a yield on the invested equity capital.",
  volatility: "VOLATILITY: A statistical measure of the dispersion of returns for a security, typically represented by the magnitude and frequency of price fluctuations.",
  volume: "TRADING VOLUME: The total aggregate quantity of shares or contracts traded for a specific security during a defined session.",
  bull_bear: "MARKET SENTIMENT: The prevailing attitude of market participants toward a security. 'Bullish' denotes an upward price trend; 'Bearish' denotes a downward price trend.",
  vix: "INDIA VIX: A volatility index tracking expected market fluctuations over the next 30 days based on the NIFTY Options order book.",
  market_breadth: "MARKET BREADTH: A technical indicator measuring the ratio of advancing securities to declining securities to evaluate the underlying strength of a market movement.",
  high_low: "SESSION EXTREMES: The maximum and minimum price points recorded for a security during the current trading session.",
  open_price: "OPENING PRICE: The initial price at which a security trades upon the commencement of the daily exchange session at 9:15 AM.",
  change_percent: "PERCENTAGE CHANGE: The relative intra-day price movement of a security expressed as a percentage of the previous session's closing price.",
  watchlist: "WATCHLIST: A personalized analytical interface used to monitor and track the real-time performance of a specific subset of tracked securities.",
  top_gainers: "TOP GAINERS: A list of securities exhibiting the highest percentage price appreciation during the current trading session.",
  top_losers: "TOP LOSERS: A list of securities exhibiting the highest percentage price depreciation during the current trading session.",
  equity: "EQUITY: An asset class representing a residual claim on the assets and earnings of a corporation, typically in the form of common stock.",
  eps: "EARNINGS PER SHARE (EPS): The portion of a corporation's net income allocated to each individual outstanding share of common stock.",
  it_stocks: "IT SECTOR EQUITIES: Common stocks representing ownership in companies specializing in software development, digital services, and technology infrastructure.",
  invested: "INVESTED CAPITAL: The total cumulative cost basis of all securities purchased within a portfolio, excluding commissions and realized gains.",
  nifty_it: "NIFTY IT INDEX: A sectoral benchmark tracking the price performance of the 10 largest and most liquid Indian IT companies on the NSE.",
  market_snapshot: "SECTOR SNAPSHOT: A real-time data aggregation of current price movements and percentage changes for key market indices and sectoral benchmarks.",
  sector_perf: "SECTORAL ANALYSIS: The evaluation of the performance and price movements of specific industry groups relative to the broader market index.",
  quick_lessons: "TRADING MODULE: A functional section providing condensed explanations of risk management principles and technical analysis methodologies.",
  gainers_losers: "MARKET DYNAMICS: A prioritized list of securities exhibiting high intra-day price volatility and trading momentum.",
  stock_details: "TECHNICAL DASHBOARD: A comprehensive analytical view of a security integrating historical charts, OHLC data, and volume statistics.",
  p_l: "UNREALIZED P&L: The current valuation of a portfolio's profit or loss based on the difference between market price and purchase cost.",
  total_returns: "CUMULATIVE RETURNS: The aggregate financial performance of an investment portfolio over its entire duration, including price appreciation.",
};

export default function HelpTip({ topic, align }) {
  const { isBeginnerMode } = useMode();
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState({ top: 0, left: 0, arrowLeft: 20, openUp: false });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);

  if (!isBeginnerMode) return null;

  const tip = TIPS[topic] || "The stock market is where buyers and sellers trade shares of companies. Prices move based on supply, demand, and news!";

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const tooltipWidth = 300; 
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const margin = 12;

      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const openUp = spaceBelow < 250 && spaceAbove > spaceBelow;
      
      const spaceRight = viewportWidth - rect.right;
      const spaceLeft = rect.left;
      const forceLeft = align === 'left' || (spaceRight < tooltipWidth && spaceLeft > spaceRight);
      
      let leftPos;
      if (forceLeft) {
        leftPos = rect.left - tooltipWidth + 16; 
      } else {
        leftPos = rect.right - 16;
      }

      leftPos = Math.max(margin, Math.min(leftPos, viewportWidth - tooltipWidth - margin));

      const bulbCenter = rect.left + rect.width / 2;
      const arrowLeft = bulbCenter - leftPos;

      setStyle({
        top: (openUp ? rect.top - 8 : rect.bottom + 8) + window.scrollY,
        left: leftPos + window.scrollX,
        arrowLeft: Math.max(12, Math.min(arrowLeft, tooltipWidth - 28)),
        openUp
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

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target)) setOpen(false);
    };
    const handleScroll = () => { setOpen(false); };
    const handleResize = () => { setOpen(false); };

    document.addEventListener('mousedown', close);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('mousedown', close);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [open]);

  return (
    <span className="helptip-wrapper inline-flex items-center relative">
      <motion.button
        ref={triggerRef}
        onClick={handleToggle}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        className={`transition-all focus:outline-none flex-shrink-0 p-1.5 rounded-full ${
          open 
            ? 'text-yellow-400 bg-white/10' 
            : 'text-[var(--text-muted)] hover:text-yellow-400 hover:bg-white/5'
        }`}
      >
        <Lightbulb size={16} />
      </motion.button>

      {open && createPortal(
        <AnimatePresence>
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.9, y: style.openUp ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: style.openUp ? 10 : -10 }}
            className="absolute z-[9999999] rounded-2xl shadow-2xl border border-white/10 overflow-visible pointer-events-auto"
            style={{
              width: '300px',
              top: style.top,
              left: style.left,
              transform: style.openUp ? 'translateY(-100%)' : 'none',
              background: '#1e293b', 
              boxShadow: '0 20px 50px -12px rgba(0,0,0,0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`absolute w-3.5 h-3.5 rotate-45 border-white/10 ${
                style.openUp ? '-bottom-1.5 border-r border-b' : '-top-1.5 border-l border-t'
              }`}
              style={{ 
                left: style.arrowLeft,
                background: '#1e293b' 
              }}
            />

            <div className="p-5 flex items-start gap-4">
              <div className="p-2.5 rounded-xl flex-shrink-0 bg-white/5 border border-white/10 shadow-inner">
                <Lightbulb size={20} className="text-yellow-400" />
              </div>
              <div>
                <p className="font-black text-[10px] uppercase tracking-[0.2em] mb-1.5 text-white/40">MARKET SYNTAX</p>
                <p className="text-[14px] leading-relaxed font-bold italic text-white/95">
                  "{tip}"
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </span>
  );
}
