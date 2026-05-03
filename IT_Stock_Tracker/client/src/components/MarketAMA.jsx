import { useState, useRef, useEffect } from 'react';
import { Search, Send, X, HelpCircle, MessageCircle } from 'lucide-react';

const DICTIONARY = {
  "sensex": "SENSEX is the benchmark index of the BSE (Bombay Stock Exchange). It tracks India's top 30 largest companies.",
  "nifty": "NIFTY 50 tracks the 50 biggest companies on the NSE. It's the most widely used benchmark in India.",
  "pe ratio": "P/E Ratio (Price-to-Earnings) = How much you pay for every ₹1 of profit. It helps you see if a stock is cheap or expensive.",
  "market cap": "Market Cap is the total value of a company. It's calculated by multiplying the stock price by the total number of shares.",
  "dividend": "Dividends are a portion of a company's profit that is paid to shareholders. It's like a reward for owning the stock!",
  "bull": "A Bull Market is when prices are rising or expected to rise. Optimism is high! 🐂",
  "bear": "A Bear Market is when prices are falling or expected to fall. Pessimism is high! 🐻",
  "equity": "Equity means ownership. When you buy a stock, you're buying 'equity' in that company.",
  "volume": "Volume is the total number of shares traded in a day. High volume means high interest in the stock.",
  "volatility": "Volatility is how much a stock's price swings. High volatility means high risk but also high potential reward.",
  "stop loss": "A stop loss is an order to sell a stock when it reaches a certain price, to prevent further losses.",
  "ipo": "IPO (Initial Public Offering) is the first time a company sells its shares to the public.",
  "market": "The stock market is a place where buyers and sellers meet to trade shares of companies.",
  "stock": "A stock represents a piece of ownership in a company.",
  "trading": "Trading is the act of buying and selling stocks, often with the goal of making a quick profit.",
  "investment": "Investment is buying an asset (like a stock) with the goal of generating long-term wealth.",
  "nifty it": "NIFTY IT is an index that tracks the performance of major IT companies in India.",
  "bse": "BSE (Bombay Stock Exchange) is one of the oldest and largest stock exchanges in Asia.",
  "nse": "NSE (National Stock Exchange) is the leading stock exchange in India, located in Mumbai.",
};

export default function MarketAMA() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState("Hi! I'm your Market Mentor Bull. Ask me anything about stocks or trading!");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setIsTyping(true);
    setAnswer('');

    setTimeout(() => {
      const lowerQuery = query.toLowerCase().trim();
      let foundAnswer = "I'm still learning about that! Try asking about Sensex, Nifty, P/E Ratio, or Bull/Bear markets.";
      
      for (const [key, val] of Object.entries(DICTIONARY)) {
        if (lowerQuery.includes(key)) {
          foundAnswer = val;
          break;
        }
      }

      setAnswer(foundAnswer);
      setIsTyping(false);
      setQuery('');
    }, 600);
  };

  return (
    <div className="glass-card rounded-3xl p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-glow)] rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2.5 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] shadow-lg shadow-[var(--accent-glow)]">
          <MessageCircle size={20} />
        </div>
        <div>
          <h3 className="font-black text-lg text-[var(--text-primary)] tracking-tight italic uppercase">Market Mentor Bull</h3>
          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Always Online (AMA)
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
        {/* Bull Image Container */}
        <div className="relative flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
          <div className="absolute inset-0 bg-[var(--accent-primary)] rounded-full blur-2xl opacity-20 animate-pulse" />
          <img 
            src="/assets/mentor-bull.png" 
            alt="Market Mentor Bull" 
            className="w-40 h-40 md:w-48 md:h-48 object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] relative z-10"
          />
        </div>

        {/* Interaction Area */}
        <div className="flex-1 w-full space-y-4">
          {/* Chat Cloud / Answer */}
          <div className="relative">
            <div className="absolute -left-3 top-4 w-4 h-4 bg-[var(--sidebar-bg)] border-l border-t border-[var(--accent-primary)]/30 rotate-45 hidden md:block" />
            <div 
              className="glass-card rounded-2xl p-5 border border-[var(--accent-primary)]/30 shadow-xl min-h-[100px] flex items-center"
              style={{ background: 'var(--sidebar-bg)' }}
            >
              {isTyping ? (
                <div className="flex gap-1.5 items-center p-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-bounce [animation-delay:0.4s]" />
                </div>
              ) : (
                <p className="text-sm font-medium text-[var(--text-primary)] leading-relaxed italic">
                  "{answer}"
                </p>
              )}
            </div>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearch} className="relative group/input">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask me something (e.g., 'What is Sensex?')"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--accent-primary)] transition-all shadow-inner"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-[var(--accent-primary)] transition-colors" size={18} />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-glow)] hover:scale-110 active:scale-95 transition-all"
            >
              <Send size={16} />
            </button>
          </form>
          
          <div className="flex flex-wrap gap-2">
            {['Sensex', 'Bull Market', 'P/E Ratio'].map(term => (
              <button 
                key={term}
                onClick={() => { setQuery(term); handleSearch(); }}
                className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
