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
import MonitoreoCamara from './pages/MonitoreoCamara';
import Terminales from './pages/Terminales';
import RestablecerClave from './pages/RestablecerClave'; // <--- IMPORTACIÓN

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const rol = localStorage.getItem('rol');
  if (rol !== 'SUPERADMIN') return <Navigate to="/" replace />;
  return <>{children}</>;
};

// ==========================================
// Componente Logout (LIMPIA TODOS LOS DATOS Y RELOJ)
// ==========================================
const Logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('rol');
  localStorage.removeItem('avatar');
  localStorage.removeItem('lastActivity'); // <--- AÑADIDO: Resetear el reloj
  return <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* ============================================== */}
        {/* ZONA PÚBLICA (Accesible sin estar logueado) */}
        {/* ============================================== */}
        <Route path="/login" element={<Login />} />
        <Route path="/salir" element={<Logout />} />
        
        {/* ---> AQUÍ ES DONDE DEBE IR LA RUTA DE RESTABLECER <--- */}
        <Route path="/restablecer-clave" element={<RestablecerClave />} />

        {/* ============================================== */}
        {/* ZONA PRIVADA (Protegida con Token)          */}
        {/* ============================================== */}
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

                  <Route path="/terminales" element={<AdminRoute><Terminales /></AdminRoute>} /> 

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