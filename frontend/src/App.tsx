import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Componentes
import AdminLayout from './components/AdminLayout';
import ScrollToTop from './components/ScrollToTop'; // Asegúrate de que la ruta sea correcta

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
      {/* DEBE IR AQUÍ: Dentro del BrowserRouter para acceder al historial 
         pero fuera de las Routes para que no se renderice según la URL.
      */}
      <ScrollToTop />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/salir" element={<Logout />} />

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