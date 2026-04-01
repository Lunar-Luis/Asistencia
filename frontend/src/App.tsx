import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Componentes
import AdminLayout from './components/AdminLayout';
import ScrollToTop from './components/ScrollToTop';

// Páginas
import Inicio from './pages/Inicio';
import Empleados from './pages/Empleados';
import Cargos from './pages/Cargos';
import Horarios from './pages/Horarios'; 
import Asistencias from './pages/Asistencias';
import Reportes from './pages/Reportes';
import Login from './pages/login';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import MonitoreoCamara from './pages/MonitoreoCamara'; // 1. IMPORTAR LA NUEVA PÁGINA

// ==========================================
// Protected Route
// ==========================================
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('syncLogic_auth') === 'true';
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// ==========================================
// Componente Logout
// ==========================================
const Logout = () => {
  localStorage.removeItem('syncLogic_auth');
  return <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/salir" element={<Logout />} />

        {/* Todas las rutas dentro de path="/*" están protegidas 
          y comparten el diseño del AdminLayout
        */}
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Inicio />} />
                  <Route path="/asistencias" element={<Asistencias />} />
                  <Route path="/empleados" element={<Empleados />} />
                  <Route path="/cargos" element={<Cargos />} />
                  <Route path="/horarios" element={<Horarios />} />
                  <Route path="/reportes" element={<Reportes />} />
                  <Route path="/perfil" element={<Profile />} />
                  <Route path="/configuracion" element={<Settings />} />
                  <Route path="/camara" element={<MonitoreoCamara />} /> 

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}