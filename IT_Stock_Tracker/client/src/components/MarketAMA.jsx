import { useState, useRef } from 'react';
import { Search, Send, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [answer, setAnswer] = useState("Hi! Ask me the meaning of any trading word (e.g. 'P/E Ratio' or 'Nifty'). I'm your Market Dictionary!");
  const [isTyping, setIsTyping] = useState(false);

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
    <div className="glass-card rounded-3xl p-4 relative overflow-hidden group border border-white/5 shadow-2xl">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-glow)] rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="p-2.5 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
          <MessageCircle size={20} />
        </div>
        <div>
          <h3 className="font-black text-lg text-[var(--text-primary)] tracking-tight italic uppercase">Market Mentor Bull</h3>
          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Always Online (AMA)
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center relative z-10">
        {/* Bull Avatar Container */}
        <div className="relative w-full flex justify-center p-0">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              scale: [1, 1.02, 1]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative z-10 w-full md:w-[110%] aspect-square drop-shadow-2xl flex items-center justify-center -mb-8"
          >
            <img 
              src="/assets/mentor-bull.png" 
              alt="Market Mentor Bull" 
              className="w-full h-full object-contain"
              style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}
            />
          </motion.div>
        </div>

        {/* Interaction Area */}
        <div className="w-full space-y-4">
          {/* Chat Cloud / Answer */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div 
                key={isTyping ? 'typing' : answer}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="glass-card rounded-2xl p-4 border border-white/10 shadow-xl min-h-[80px] flex items-center justify-center text-center relative"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#1e293b] border-l border-t border-white/10 rotate-45" />
                
                {isTyping ? (
                  <div className="flex gap-2 items-center">
                    {[0, 0.2, 0.4].map((delay) => (
                      <motion.div 
                        key={delay}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay }}
                        className="w-2 h-2 rounded-full bg-[var(--accent-primary)]"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-base font-bold text-[var(--text-primary)] leading-relaxed italic drop-shadow-sm">
                    "{answer}"
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearch} className="relative group/input">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask me something..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm font-bold text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--accent-primary)] transition-all shadow-inner"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-[var(--accent-primary)] text-white hover:scale-110 active:scale-95 transition-all shadow-md"
            >
              <Send size={18} />
            </button>
          </form>
          
          <div className="flex flex-wrap justify-center gap-2">
            {['Sensex', 'Bull Market', 'P/E Ratio'].map(term => (
              <button 
                key={term}
                onClick={() => { setQuery(term); handleSearch(); }}
                className="text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all hover:scale-105"
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
