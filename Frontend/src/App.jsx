import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ui/ProtectedRoute';
import LoginPage from './pages/Login';
import AdminLayout from './layouts/AdminLayout';
import DriverLayout from './layouts/DriverLayout';

const UnauthorizedPage = () => <div>Accès non autorisé</div>;
const AdminDashboard = () => <div>Admin Dashboard</div>;
const AdminDrivers = () => <div>Admin Drivers</div>;
const AdminTrucks = () => <div>Admin Trucks</div>;
const AdminTrips = () => <div>Admin Trips</div>;
import DriverTrips from './pages/driver/DriverTrips';
// import AdminDashboard from './pages/admin/AdminDashboard';
// import AdminDrivers from './pages/admin/AdminDrivers';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  const getRootRedirect = () => {
    if (loading) {
      return <div>Chargement...</div>;
    }
    if (user?.role === 'Admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user?.role === 'Chauffeur') {
      return <Navigate to="/driver/my-trips" replace />;
    }
    return <Navigate to="/login" replace />;
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/drivers" element={<AdminDrivers />} />
        <Route path="/admin/trucks" element={<AdminTrucks />} />
        <Route path="/admin/trips" element={<AdminTrips />} />
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={['Chauffeur']}>
            <DriverLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/driver/my-trips" element={<DriverTrips />} />
      </Route>

      <Route path="/" element={getRootRedirect()} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}