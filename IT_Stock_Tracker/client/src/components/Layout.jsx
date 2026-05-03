import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from './Sidebar';
import MarketTicker from './MarketTicker';

const Layout = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-main)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top market ticker bar */}
        <MarketTicker />
        {/* Main scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
