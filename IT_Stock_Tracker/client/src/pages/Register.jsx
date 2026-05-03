import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Activity } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      await register(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (!err.response) {
        setError('Network Error - The backend server is offline.');
      } else {
        setError(err.response.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[var(--accent-primary)]/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[var(--accent-secondary)]/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-md w-full space-y-8 glass-card p-10 rounded-3xl shadow-2xl relative z-10 border border-[var(--border-color)]">
        <div>
          <div className="flex justify-center">
            <div className="bg-[var(--accent-primary)]/10 p-4 rounded-2xl shadow-inner border border-[var(--accent-primary)]/20">
              <Activity className="h-10 w-10 text-[var(--accent-primary)]" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-black text-[var(--text-primary)] tracking-tight">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm font-medium text-[var(--text-secondary)]">
            Join thousands tracking the market every day.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-rose-500/10 text-rose-500 p-4 rounded-xl text-sm font-bold border border-rose-500/20 text-center">
              {error}
            </div>
          )}

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

            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 ml-1" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-color)] placeholder-[var(--text-muted)] text-[var(--text-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent sm:text-sm transition-all"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-black rounded-xl text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)] transition-all shadow-lg shadow-[var(--accent-glow)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <div className="text-center mt-8">
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
