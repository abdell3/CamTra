import { Link, Outlet, useLocation } from 'react-router-dom';
import { Truck, LayoutDashboard, Users, Map, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Chauffeurs', to: '/admin/drivers', icon: Users },
  { label: 'Camions', to: '/admin/trucks', icon: Truck },
  { label: 'Trajets', to: '/admin/trips', icon: Map },
];

const AdminLayout = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-night text-white flex flex-col">
        <div className="px-6 py-6 flex items-center gap-3 border-b border-night-light">
          <div className="h-10 w-10 rounded-full bg-brick/20 flex items-center justify-center text-brick">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-gray-300">CamTra</p>
            <p className="text-lg font-semibold">Admin</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map(({ label, to, icon: Icon }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  active
                    ? 'bg-brick text-white'
                    : 'text-gray-200 hover:bg-night-light hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 pb-6">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-300 hover:bg-brick hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

