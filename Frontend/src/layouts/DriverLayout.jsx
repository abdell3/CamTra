import { Link, Outlet } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DriverLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="h-16 bg-night text-white px-6 flex items-center justify-between shadow-md">
        <div className="text-lg font-semibold">CamTra Driver</div>
        <div className="flex items-center gap-6">
          <Link
            to="/driver/my-trips"
            className="text-sm font-medium hover:text-brick transition-colors"
          >
            Mes Missions
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-200">
              Bonjour, {user?.firstName || 'Chauffeur'}
            </span>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1 text-sm font-medium text-red-200 hover:bg-brick hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default DriverLayout;

