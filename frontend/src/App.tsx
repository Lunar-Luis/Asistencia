import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Componentes
import AdminLayout from './components/AdminLayout';
import Preloader from './components/Preloader';

// Páginas
import Inicio from './pages/Inicio';
import Empleados from './pages/Empleados';
import Cargos from './pages/Cargos';
import Horarios from './pages/Horarios'; 
import Registro from './pages/Registro';
import Reportes from './pages/Reportes';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      {/* AnimatePresence */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Preloader key="loader" />
        ) : (
          <AdminLayout key="main-content">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/empleados" element={<Empleados />} />
              <Route path="/cargos" element={<Cargos />} />
              <Route path="/horarios" element={<Horarios />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/reportes" element={<Reportes />} />
            </Routes>
          </AdminLayout>
        )}
      </AnimatePresence>
    </BrowserRouter>
  );
}