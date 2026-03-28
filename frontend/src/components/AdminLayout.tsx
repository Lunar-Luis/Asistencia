import { type ReactNode, useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Briefcase, Clock,
  Calendar, FileBarChart, LogOut, Sun, Moon, Settings, UserCircle,
  Menu
} from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigation = () => {
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
      setIsProfileDropdownOpen(false);
    }
  };

  const handleLogoClick = () => {
    if (window.innerWidth >= 768) {
      setIsDesktopCollapsed(!isDesktopCollapsed);
    } else {
      setIsMobileMenuOpen(!isMobileOpen); 
    }
  };

  const menu = [
    { path: '/', icon: <LayoutDashboard size={24} />, text: 'Inicio' },
    { path: '/asistencias', icon: <Clock size={24} />, text: 'Asistencias' },
    { path: '/empleados', icon: <Users size={24} />, text: 'Empleados' },
    { path: '/cargos', icon: <Briefcase size={24} />, text: 'Cargos' },
    { path: '/horarios', icon: <Calendar size={24} />, text: 'Horarios' },
    { path: '/reportes', icon: <FileBarChart size={24} />, text: 'Reportes' },
  ];

  return (
    <div className="flex w-full h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans text-slate-800 dark:text-slate-200">
      
      {/* BARRA SUPERIOR PARA MÓVILES */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-[60] flex items-center justify-between px-4 shadow-sm transition-colors">
        <button onClick={() => setIsMobileMenuOpen(!isMobileOpen)} className="p-2 -ml-2 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none">
          <Menu size={28} />
        </button>

        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-full text-slate-400 hover:text-primary transition-colors bg-slate-50 dark:bg-slate-800 focus:outline-none">
            {isDark ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} />}
          </button>

          <div className="flex items-center gap-2">
            <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="focus:outline-none py-1.5 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <span className="text-[15px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-wide">Admin</span>
            </button>
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
              <img src="/images/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
            </div>
          </div>

          <AnimatePresence>
            {isProfileDropdownOpen && (
              <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 flex flex-col"
              >
                <Link to="/perfil" onClick={handleNavigation} className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-slate-600 dark:text-slate-300">
                  <UserCircle size={20} /> <span className="text-[15px] font-bold">Mi Perfil</span>
                </Link>
                <Link to="/configuracion" onClick={handleNavigation} className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  <Settings size={20} /> <span className="text-[15px] font-bold">Ajustes</span>
                </Link>
                <Link to="/salir" onClick={handleNavigation} className="flex items-center gap-3 px-4 py-3.5 hover:bg-red-50 dark:hover:bg-danger/10 transition-colors text-red-500 dark:text-danger">
                  <LogOut size={20} /> <span className="text-[15px] font-bold">Cerrar Sesión</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* OVERLAY OSCURO MÓVIL (Sidebar) */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40" />
        )}
      </AnimatePresence>

      {/* MENÚ LATERAL */}
      <motion.aside
        initial={false}
        animate={{ width: isDesktopCollapsed ? "6rem" : "17rem", x: typeof window !== 'undefined' && window.innerWidth < 768 ? (isMobileOpen ? 0 : "-100%") : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed md:relative top-0 left-0 h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 shrink-0 transition-colors"
      >
        <div onClick={handleLogoClick} title={isDesktopCollapsed ? "Expandir menú" : "Colapsar menú"}
          className={`w-full flex shrink-0 border-b border-slate-100 dark:border-slate-800 items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isDesktopCollapsed ? 'h-24' : 'h-28'} md:flex hidden`}
        >
          <div className={`rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800 ${isDesktopCollapsed ? 'w-12 h-12' : 'w-20 h-20'}`}>
            <img src="/images/logo.png" alt="Logo CMBT" className={`object-contain transition-all ${isDesktopCollapsed ? 'w-8 h-8' : 'w-14 h-14'}`} />
          </div>
        </div>

        <div className="md:hidden h-16 shrink-0 border-b border-slate-100 dark:border-slate-800"></div>

        <div className="flex flex-col py-6 w-full grow overflow-y-auto overflow-x-hidden gap-2">
          {menu.map(item => (
            <Link key={item.path} to={item.path} onClick={handleNavigation}
              className={`group flex items-center h-14 relative font-semibold transition-colors w-full ${isDesktopCollapsed ? 'justify-center' : 'px-8'} ${isActive(item.path) ? 'text-primary dark:text-primary bg-primary/5 dark:bg-primary/10' : 'text-slate-500 hover:text-primary dark:hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
            >
              {isActive(item.path) && <div className="absolute left-0 top-2 bottom-2 w-1.5 bg-primary rounded-r-md" />}
              <div className={`flex items-center justify-center shrink-0 ${isDesktopCollapsed ? 'group-hover:scale-110 transition-transform' : ''}`}>
                {item.icon}
              </div>
              {!isDesktopCollapsed && <span className="text-[15px] ml-5 whitespace-nowrap tracking-wide">{item.text}</span>}
            </Link>
          ))}
        </div>

        <div className={`p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2 shrink-0 ${isDesktopCollapsed ? 'items-center pb-6' : ''}`}>
          <div className="hidden md:flex flex-col gap-2 w-full">
            <Link to="/configuracion" className={`flex items-center h-12 rounded-xl text-slate-500 hover:text-primary dark:hover:text-primary dark:hover:bg-slate-800/50 transition-colors ${isDesktopCollapsed ? 'justify-center w-12 mx-auto' : 'px-4'}`}>
               <Settings size={22} className="shrink-0" />
               {!isDesktopCollapsed && <span className="text-[15px] font-semibold ml-4 whitespace-nowrap">Ajustes</span>}
            </Link>

            <div className={`flex items-center w-full ${isDesktopCollapsed ? 'flex-col gap-4 py-2' : 'justify-between px-4 h-12'}`}>
               <Link to="/perfil" className={`flex items-center gap-3 text-slate-500 hover:text-primary transition-colors ${isDesktopCollapsed ? 'bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl' : ''}`}>
                 <UserCircle size={24} className="shrink-0" />
                 {!isDesktopCollapsed && <span className="text-[15px] font-bold whitespace-nowrap text-slate-700 dark:text-slate-300">Admin</span>}
               </Link>
               <button onClick={() => setIsDark(!isDark)} className="p-2.5 rounded-xl text-slate-400 hover:text-primary transition-colors bg-slate-50 dark:bg-slate-800">
                 {isDark ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} />}
               </button>
            </div>
          </div>

          <Link to="/salir" onClick={handleNavigation} className={`flex items-center mt-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group ${isDesktopCollapsed ? 'h-12 w-12 mx-auto justify-center' : 'h-14 px-4'}`}>
             <LogOut size={22} className="shrink-0" />
             {!isDesktopCollapsed && <span className="text-[15px] font-bold ml-4 whitespace-nowrap">Cerrar Sesión</span>}
          </Link>
        </div>
      </motion.aside>

      <main className="flex-1 pt-20 md:pt-6 p-6 md:p-8 min-w-0 h-screen overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors">
        {children}
      </main>
    </div>
  );
}