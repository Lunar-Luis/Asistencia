import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Componentes
import AdminLayout from './components/AdminLayout';

// Páginas
import Inicio from './pages/Inicio';
import Empleados from './pages/Empleados';
import Cargos from './pages/Cargos';
import Horarios from './pages/Horarios'; 
import Asistencias from './pages/Asistencias';
import Reportes from './pages/Reportes';
import Login from './pages/login';

// Nuevas Páginas de Usuario
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// ==========================================
// 1. EL GUARDIA DE SEGURIDAD (Protected Route)
// ==========================================
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Revisamos si existe la "llave" de acceso en el navegador
  const isAuthenticated = localStorage.getItem('syncLogic_auth') === 'true';
  
  // Si no está autenticado, lo mandamos al login de inmediato
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Si está autenticado, lo dejamos pasar al contenido
  return <>{children}</>;
};

// ==========================================
// 2. COMPONENTE PARA CERRAR SESIÓN
// ==========================================
const Logout = () => {
  localStorage.removeItem('syncLogic_auth'); // Borramos la llave
  return <Navigate to="/login" replace />;   // Lo mandamos al login
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTA PÚBLICA */}
        <Route path="/login" element={<Login />} />
        
        {/* RUTA PARA SALIR */}
        <Route path="/salir" element={<Logout />} />

        {/* RUTAS PRIVADAS (Protegidas por el Guardia) */}
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  {/* Rutas Principales del Menú */}
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