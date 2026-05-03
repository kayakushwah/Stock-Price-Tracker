import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Zap, LineChart, Globe, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* Navigation Layer */}
      <nav className="fixed top-0 inset-x-0 z-50 px-6 py-4 flex items-center justify-between bg-[#0a0f1d]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <LineChart size={20} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
            IT TRACKER
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Live Premium Data
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Master the
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            IT Sector Markets
          </span>
        </h1>
        
        <p className="max-w-2xl text-lg lg:text-xl text-slate-400 mb-10 leading-relaxed">
          Real-time tracking, advanced analytics, and personalized watchlists tailored specifically for top tech giants like TCS, Infosys, and HCLTech.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link 
            to="/register" 
            className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl hover:bg-slate-100 transition-all shadow-xl shadow-white/10"
          >
            Start Tracking Free
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a 
            href="#features" 
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-white/5 text-white font-semibold rounded-xl border border-white/10 hover:bg-white/10 transition-all"
          >
            Explore Features
          </a>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-24 bg-[#0d1326] px-6 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Precision Tools for Modern Investors</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Everything you need to monitor, analyze, and act on the fast-moving IT services stock market.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-indigo-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-6">
                <Globe size={24} className="text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Live Market Data</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Stay ahead with real-time price updates powered by institutional-grade APIs, ensuring you never miss a market move.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-purple-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6">
                <Activity size={24} className="text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Advanced Analytics</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Visualize trends effortlessly using our beautiful, interactive charts designed for quick technical assessments.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6">
                <ShieldCheck size={24} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Secure Watchlists</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Build your personalized portfolio quickly. Your data is protected by industry-standard JWT authentication.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="border-t border-white/5 bg-[#0a0f1d] py-8 text-center px-6">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-2 opacity-50">
            <Zap size={16} className="text-indigo-400" />
            <span className="text-sm font-bold text-slate-300">IT TRACKER INC.</span>
          </div>
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Real-Time IT Stock Tracker. Built for modern investors.
          </p>
        </div>
      </footer>

    </div>
  );
}
