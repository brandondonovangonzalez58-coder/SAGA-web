//dashboard


import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

export default function Dashboard() {
  const usuario = useAuthStore((s) => s.usuario);
  
  // Si aún no carga el usuario, no mostramos nada
  if (!usuario) return null; 

  // Si es Docente, lo mandamos a su panel
  if (usuario.rol === 'Docente') return <Navigate to="/docente" replace />;
  
  // Si es Alumno, lo mandamos a su panel
  if (usuario.rol === 'Estudiante') return <Navigate to="/alumno" replace />;
  
  // Si es Administrador, se queda aquí y ve su Dashboard
  return <AdminDashboard />; 
}