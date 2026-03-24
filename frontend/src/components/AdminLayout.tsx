import { type ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// Importamos los iconos de Lucide-React
import { 
  LayoutDashboard, Users, Briefcase, Clock, 
  Nfc, FileBarChart, LogOut, Sun, Moon, Settings, UserCircle
} from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  const [isOpen, setIsOpen] = useState(true);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const menu = [
    { path: '/', icon: <LayoutDashboard size={22} />, text: 'Inicio' },
    { path: '/empleados', icon: <Users size={22} />, text: 'Empleados' },
    { path: '/cargos', icon: <Briefcase size={22} />, text: 'Cargos' },
    { path: '/horarios', icon: <Clock size={22} />, text: 'Horarios' },
    { path: '/registro', icon: <Nfc size={22} />, text: 'Registro (En Vivo)' },
    { path: '/reportes', icon: <FileBarChart size={22} />, text: 'Reportes' },
  ];

  return (
    <div className="flex w-full h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans text-slate-800 dark:text-slate-200">
      
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? "16rem" : "5rem" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="h-full hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 shrink-0"
      >
        
        {/* LOGO */}
        <div className="h-20 w-full flex items-center justify-center border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="cursor-pointer flex items-center justify-center w-full px-4" onClick={() => setIsOpen(!isOpen)}>
            <img src="/images/logo.png" alt="Logo" className="w-8 h-8 object-contain shrink-0" />
            <AnimatePresence>
              {isOpen && (
                <motion.h2 
                  initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }}
                  className="font-black text-xl ml-3 tracking-tight text-blue-600 dark:text-blue-400 overflow-hidden whitespace-nowrap"
                >
                  SYNC<span className="text-slate-800 dark:text-white">LOGIC</span>
                </motion.h2>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* MENÚ NAVEGACIÓN */}
        <div className="flex flex-col py-4 w-full grow overflow-y-auto overflow-x-hidden">
          {menu.map(item => (
            <Link 
              key={item.path} to={item.path} 
              className={`group flex items-center h-12 relative font-medium transition-colors w-full px-4
                ${isActive(item.path) ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-500 hover:text-blue-600 dark:hover:text-blue-400'}
              `}
            >
              {isActive(item.path) && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md" />}
              <div className="shrink-0 mx-auto md:mx-0">{item.icon}</div>
              
              {isOpen ? (
                <span className="text-sm ml-4 whitespace-nowrap">{item.text}</span>
              ) : (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap">
                  {item.text}
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* ÁREA INFERIOR: PERFIL, AJUSTES Y SALIR */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2 shrink-0">
          
          {/* Botón de Ajustes (Opcional, si lo necesitas visible) */}
          <Link to="/configuracion" className="flex items-center h-10 px-2 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors">
             <Settings size={20} className="shrink-0 mx-auto md:mx-0" />
             {isOpen && <span className="text-sm ml-4 whitespace-nowrap">Ajustes</span>}
          </Link>

          {/* Selector de Tema y Perfil rápido */}
          <div className="flex items-center justify-between h-10 px-2">
             <Link to="/perfil" className="flex items-center gap-3 hover:text-blue-600 text-slate-500 transition-colors">
               <UserCircle size={22} className="shrink-0" />
               {isOpen && <span className="text-sm font-semibold whitespace-nowrap">Perfil Admin</span>}
             </Link>
             
             {isOpen && (
               <button onClick={() => setIsDark(!isDark)} className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors">
                 {isDark ? <Sun size={18} /> : <Moon size={18} />}
               </button>
             )}
          </div>

          {/* BOTÓN CERRAR SESIÓN (Totalmente visible) */}
          <Link to="/salir" className="flex items-center h-12 mt-2 px-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors group">
             <LogOut size={22} className="shrink-0 mx-auto md:mx-0 transition-transform group-hover:-translate-x-1" />
             {isOpen && <span className="text-sm font-bold ml-4 whitespace-nowrap">Cerrar Sesión</span>}
          </Link>

        </div>
      </motion.aside>

      <main className="flex-1 p-6 md:p-8 min-w-0 h-screen overflow-y-auto">
        {children}
      </main>

    </div>
  );
}