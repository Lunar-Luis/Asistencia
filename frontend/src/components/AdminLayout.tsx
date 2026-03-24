import { type ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Briefcase, Clock,
  Calendar, FileBarChart, LogOut, Sun, Moon, Settings, UserCircle,
  Menu, X
} from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  // Estados del Menú
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileMenuOpen] = useState(false);
  
  // Estado del Tema
  const [isDark, setIsDark] = useState(false);

  // Aplicar Tema Oscuro
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // --- SOLUCIÓN AL ERROR ---
  // Quitamos el useEffect que causaba el error y manejamos el cierre 
  // mediante una función simple que llamaremos en los Links.
  const handleNavigation = () => {
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const menu = [
    { path: '/', icon: <LayoutDashboard size={22} />, text: 'Inicio' },
    { path: '/asistencias', icon: <Clock size={22} />, text: 'Asistencias' },
    { path: '/empleados', icon: <Users size={22} />, text: 'Empleados' },
    { path: '/cargos', icon: <Briefcase size={22} />, text: 'Cargos' },
    { path: '/horarios', icon: <Calendar size={22} />, text: 'Horarios' },
    { path: '/reportes', icon: <FileBarChart size={22} />, text: 'Reportes' },
  ];

  return (
    <div className="flex w-full h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans text-slate-800 dark:text-slate-200">
      
      {/* BARRA SUPERIOR PARA MÓVILES */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-40 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/images/logo.png" alt="Logo CMBT" className="w-8 h-8 object-contain" />
          <h2 className="font-black text-xl tracking-tight text-primary dark:text-white">CMBT</h2>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* OVERLAY OSCURO */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* MENÚ LATERAL */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isDesktopCollapsed ? "5.5rem" : "16rem",
          x: typeof window !== 'undefined' && window.innerWidth < 768 ? (isMobileOpen ? 0 : "-100%") : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed md:relative top-0 left-0 h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 shrink-0"
      >
        <div className={`w-full flex shrink-0 border-b border-slate-100 dark:border-slate-800
          ${isDesktopCollapsed ? 'h-24 flex-col items-center justify-center gap-3 pt-2' : 'h-20 items-center justify-between px-6'}`}
        >
          <div className="flex items-center justify-center overflow-hidden">
            <img src="/images/logo.png" alt="Logo CMBT" className={`object-contain shrink-0 ${isDesktopCollapsed ? 'w-8 h-8' : 'w-7 h-7'}`} />
            <AnimatePresence>
              {!isDesktopCollapsed && (
                <motion.h2 
                  initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }}
                  className="font-black text-xl ml-3 tracking-tighter text-primary dark:text-white whitespace-nowrap"
                >
                  CMBT
                </motion.h2>
              )}
            </AnimatePresence>
          </div>
          <button onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)} className="hidden md:flex p-2 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors">
            <Menu size={20} />
          </button>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden p-2 rounded-xl text-slate-400 hover:text-danger hover:bg-danger/10">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col py-6 w-full grow overflow-y-auto overflow-x-hidden gap-1.5">
          {menu.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              onClick={handleNavigation} // <-- Cerramos el menú aquí al hacer clic
              className={`group flex items-center h-12 relative font-semibold transition-colors w-full
                ${isDesktopCollapsed ? 'justify-center' : 'px-6'}
                ${isActive(item.path) 
                  ? 'text-primary dark:text-primary bg-primary/5 dark:bg-primary/10' 
                  : 'text-slate-500 hover:text-primary dark:hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5'
                }
              `}
            >
              {isActive(item.path) && <div className="absolute left-0 top-2 bottom-2 w-1.5 bg-primary rounded-r-md" />}
              <div className={`flex items-center justify-center shrink-0 ${isDesktopCollapsed ? 'group-hover:scale-110' : ''}`}>
                {item.icon}
              </div>
              {!isDesktopCollapsed && <span className="text-[13px] ml-4 whitespace-nowrap tracking-wide">{item.text}</span>}
            </Link>
          ))}
        </div>

        {/* ÁREA INFERIOR */}
        <div className={`p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2 shrink-0 ${isDesktopCollapsed ? 'items-center pb-6' : ''}`}>
          <Link to="/configuracion" onClick={handleNavigation} className={`flex items-center h-10 rounded-xl text-slate-500 hover:text-primary transition-colors ${isDesktopCollapsed ? 'justify-center w-10' : 'px-3'}`}>
             <Settings size={20} className="shrink-0" />
             {!isDesktopCollapsed && <span className="text-[13px] font-semibold ml-4 whitespace-nowrap">Ajustes</span>}
          </Link>

          <div className={`flex items-center w-full ${isDesktopCollapsed ? 'flex-col gap-4 py-2' : 'justify-between px-3 h-10'}`}>
             <Link to="/perfil" onClick={handleNavigation} className={`flex items-center gap-3 text-slate-500 hover:text-primary transition-colors ${isDesktopCollapsed ? 'bg-slate-50 dark:bg-slate-800 p-2 rounded-xl' : ''}`}>
               <UserCircle size={22} className="shrink-0" />
               {!isDesktopCollapsed && <span className="text-[13px] font-bold whitespace-nowrap text-slate-700 dark:text-slate-300">Admin</span>}
             </Link>
             <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-xl text-slate-400 hover:text-primary transition-colors">
               {isDark ? <Sun size={18} /> : <Moon size={18} />}
             </button>
          </div>

          <Link to="/salir" className={`flex items-center mt-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group ${isDesktopCollapsed ? 'h-10 w-10 justify-center' : 'h-12 px-3'}`}>
             <LogOut size={20} className="shrink-0" />
             {!isDesktopCollapsed && <span className="text-[13px] font-bold ml-4 whitespace-nowrap">Cerrar Sesión</span>}
          </Link>
        </div>
      </motion.aside>

      <main className="flex-1 pt-20 md:pt-6 p-6 md:p-8 min-w-0 h-screen overflow-y-auto bg-slate-50 dark:bg-[#121212] transition-colors">
        {children}
      </main>
    </div>
  );
}