import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  // El flujo estricto de 6 vistas
  const menu = [
    { path: '/', icon: 'grid_view', text: 'Inicio' },
    { path: '/empleados', icon: 'groups', text: 'Empleados' },
    { path: '/cargos', icon: 'work', text: 'Cargos' },
    { path: '/horarios', icon: 'schedule', text: 'Horarios' },
    { path: '/registro', icon: 'nfc', text: 'Registro (En Vivo)' },
    { path: '/reportes', icon: 'analytics', text: 'Reporte' },
  ];

  return (
    <div className="grid w-[96%] mx-auto gap-[1.8rem] grid-cols-1 md:grid-cols-[7rem_1fr_23rem] xl:grid-cols-[14rem_auto_23rem] min-h-screen">
      <aside className="h-screen sticky top-0 hidden md:block">
        <div className="flex items-center justify-between mt-[1.4rem]">
          <div className="flex gap-[0.8rem]">
            <img src="/images/SL.png" alt="Logo" className="w-[2.5rem] h-[2rem]" />
            <h2 className="text-info-dark dark:text-dark-text font-bold text-[1.4rem] hidden xl:block">SYNC<span className="text-danger">LOGIC</span></h2>
          </div>
        </div>

        <div className="flex flex-col h-[86vh] relative top-[3rem]">
          {menu.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex items-center h-[3.7rem] gap-4 relative transition-all duration-300 font-medium ${isActive(item.path) ? 'bg-light dark:bg-dark-light text-primary ml-0' : 'text-info-dark dark:text-dark-text-variant ml-8 hover:text-primary hover:ml-4'}`}
            >
              {isActive(item.path) && <div className="absolute left-0 w-[6px] h-full bg-primary" />}
              <span className={`material-icons-sharp text-[1.6rem] transition-all duration-300 ${isActive(item.path) ? 'ml-[calc(1rem-3px)] text-primary' : ''}`}>{item.icon}</span>
              <h3 className="text-[0.87rem] hidden xl:block">{item.text}</h3>
            </Link>
          ))}
          
          {/* Botón de Salir (Mantenido por estándar de seguridad) */}
          <Link to="/salir" className="flex items-center h-[3.7rem] gap-4 text-info-dark dark:text-dark-text-variant ml-8 hover:text-primary hover:ml-4 absolute bottom-[2rem] w-full transition-all duration-300">
            <span className="material-icons-sharp text-[1.6rem]">logout</span>
            <h3 className="text-[0.87rem] font-medium hidden xl:block">Salir</h3>
          </Link>
        </div>
      </aside>

      {children}
    </div>
  );
}