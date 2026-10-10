import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Activity, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, verifyOTP } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (showOtp) {
        await verifyOTP(email, otp);
        navigate('/dashboard');
      } else {
        const data = await login(email, password);
        if (data.requireOTP) {
          setShowOtp(true);
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      if (!err.response) {
        setError('Network Error - The backend server is offline.');
      } else {
        setError(err.response.data?.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent-primary)]/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--accent-secondary)]/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-md w-full space-y-8 glass-card p-10 rounded-3xl shadow-2xl relative z-10 border border-[var(--border-color)]">
        <div>
          <div className="flex justify-center">
            <div className="bg-[var(--accent-primary)]/10 p-4 rounded-2xl shadow-inner border border-[var(--accent-primary)]/20">
              {showOtp ? <ShieldCheck className="h-10 w-10 text-[var(--accent-primary)]" /> : <Activity className="h-10 w-10 text-[var(--accent-primary)]" />}
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-black text-[var(--text-primary)] tracking-tight">
            {showOtp ? 'Verify Identity' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-center text-sm font-medium text-[var(--text-secondary)]">
            {showOtp ? `Enter the 6-digit code sent to ${email}` : 'Sign in to access your portfolio and market trends.'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-rose-500/10 text-rose-500 p-4 rounded-xl text-sm font-bold border border-rose-500/20 text-center">
              {error}
            </div>
          )}

          {!showOtp ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 ml-1" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none relative block w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-color)] placeholder-[var(--text-muted)] text-[var(--text-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent sm:text-sm transition-all"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 ml-1" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none relative block w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-color)] placeholder-[var(--text-muted)] text-[var(--text-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent sm:text-sm transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 ml-1" htmlFor="otp">
                Verification Code
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                maxLength="6"
                required
                className="appearance-none relative block w-full px-4 py-4 text-center text-2xl font-black tracking-[0.5em] bg-[var(--bg-base)] border border-[var(--border-color)] placeholder-[var(--text-muted)] text-[var(--text-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
              <button 
                type="button" 
                onClick={() => setShowOtp(false)}
                className="mt-4 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
              >
                ← Back to Login
              </button>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-black rounded-xl text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)] transition-all shadow-lg shadow-[var(--accent-glow)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : (showOtp ? 'Verify Code' : 'Sign In')}
            </button>
          </div>
        </form>

        {!showOtp && (
          <div className="text-center mt-8">
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors">
                Create one now
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
