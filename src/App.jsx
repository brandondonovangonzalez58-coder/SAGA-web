//configuracion de rutas
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // El portero
import ProtectedRoute from './components/ProtectedRoute';

// Importación de páginas
import Estudiantes from './pages/Estudiantes';
import Docentes from './pages/Docentes';
import Carreras from './pages/Carreras';
import Grupos from './pages/Grupos';
import Materias from './pages/Materias';
import Sesiones from './pages/Sesiones';
import Asistencias from './pages/Asistencias';
import Periodos from './pages/Periodos';
import Roles from './pages/Roles';
import DocenteDashboard from './pages/DocenteDashboard';
import AlumnoDashboard from './pages/AlumnoDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Pública */}
        <Route path="/login" element={<Login />} />

        {/* Rutas Privadas (Protegidas por el JWT) */}
        <Route element={<ProtectedRoute />}>
          
          {/* El Portero (decide a dónde ir) */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Rutas del Administrador */}
          <Route path="/estudiantes" element={<Estudiantes />} />
          <Route path="/docentes" element={<Docentes />} />
          <Route path="/carreras" element={<Carreras />} />
          <Route path="/grupos" element={<Grupos />} />
          <Route path="/materias" element={<Materias />} />
          <Route path="/sesiones" element={<Sesiones />} />
          <Route path="/asistencias" element={<Asistencias />} />
          <Route path="/periodos" element={<Periodos />} />
          <Route path="/roles" element={<Roles />} />

          {/* Rutas del Docente y Alumno */}
          <Route path="/docente" element={<DocenteDashboard />} />
          <Route path="/alumno" element={<AlumnoDashboard />} />
        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}