import { Link, Outlet } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BackgroundBlobs from '../components/ui/BackgroundBlobs';

const DriverLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="relative min-h-screen">
      <BackgroundBlobs />

      <header className="relative z-10 h-16 px-6 flex items-center justify-between border-b border-white/10 bg-white/10 backdrop-blur-md shadow-lg">
        <div className="text-lg font-semibold text-white">CamTra Driver</div>
        <div className="flex items-center gap-6">
          <Link
            to="/driver/my-trips"
            className="text-sm font-medium text-slate-100 hover:text-accent transition-colors"
          >
            Mes Missions
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-200">
              Bonjour, {user?.firstName || 'Chauffeur'}
            </span>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1 text-sm font-medium text-white border border-white/20 bg-white/10 hover:bg-white/20 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default DriverLayout;

