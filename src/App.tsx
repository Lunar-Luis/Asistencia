import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Inicio from './pages/Inicio';
import Empleados from './pages/Empleados';
import Cargos from './pages/Cargos';
import Horarios from './pages/Horarios'; 
import Registro from './pages/Registro';
import Reportes from './pages/Reportes';

export default function App() {
  return (
    <BrowserRouter>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/cargos" element={<Cargos />} />
          <Route path="/horarios" element={<Horarios />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/reportes" element={<Reportes />} />
        </Routes>
      </AdminLayout>
    </BrowserRouter>
  );
}