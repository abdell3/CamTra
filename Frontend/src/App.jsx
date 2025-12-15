import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ui/ProtectedRoute';

const LoginPage = () => <div>Login Page</div>;
const UnauthorizedPage = () => <div>Accès non autorisé</div>;
const AdminDashboard = () => <div>Admin Dashboard</div>;
const AdminDrivers = () => <div>Admin Drivers</div>;
const DriverTrips = () => <div>Driver Trips</div>;

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
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/drivers"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminDrivers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/driver/my-trips"
        element={
          <ProtectedRoute allowedRoles={['Chauffeur']}>
            <DriverTrips />
          </ProtectedRoute>
        }
      />

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