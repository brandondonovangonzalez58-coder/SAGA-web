import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute() {
  const token = useAuthStore((s) => s.token);

  // Si no hay token, redirige al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si hay token, renderiza la página hija
  return <Outlet />;
}