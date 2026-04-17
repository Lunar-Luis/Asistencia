import { type ReactNode, useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Briefcase, Clock,
  Calendar, FileBarChart, LogOut, Sun, Moon, Settings, UserCircle,
  Menu, Camera, Cpu
} from 'lucide-react';
import Swal from 'sweetalert2';
import * as api from '../services/api';

// ==============================================================
// CORRECCIÓN ESLINT: Constantes movidas fuera del componente
// para evitar dependencias innecesarias en el useEffect
// ==============================================================
const IDLE_TIMEOUT_MS = 5 * 60 * 1000;     // 5 minutos (Expiración del Backend)
const WARNING_TIME_MS = 4 * 60 * 1000;     // 4 minutos (Muestra advertencia)
const REFRESH_INTERVAL_MS = 3 * 60 * 1000; // 3 minutos (Renovación silenciosa)

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate(); 
  const isActive = (path: string) => location.pathname === path;
  
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('themePref');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
  });
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const rolUsuario = localStorage.getItem('rol') || '';
  const username = localStorage.getItem('username') || 'Usuario';
  const esSuperAdmin = rolUsuario === 'SUPERADMIN';
  
  const userAvatar = localStorage.getItem('avatar') || '/images/logo.png';

  const forzarCierreSesion = useCallback(() => {
    Swal.close();
    navigate('/salir');
  }, [navigate]);

  useEffect(() => {
    let warningShown = false;

    const updateActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    // 1. Verificar inactividad al cargar la página
    const lastActivityStr = localStorage.getItem('lastActivity');
    if (lastActivityStr) {
      const diff = Date.now() - parseInt(lastActivityStr, 10);
      if (diff >= IDLE_TIMEOUT_MS) {
        forzarCierreSesion();
        return;
      }
    } else {
      updateActivity();
    }

    // 2. Escuchar actividad
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
    events.forEach(e => window.addEventListener(e, updateActivity, { passive: true }));

    // 3. Vigilar el tiempo restante para alertar o expulsar
    // CORRECCIÓN TS/ESLINT: Usamos window.setInterval y declaramos la const de una vez
    const activityInterval = window.setInterval(() => {
      const last = parseInt(localStorage.getItem('lastActivity') || '0', 10);
      const diff = Date.now() - last;

      if (diff >= IDLE_TIMEOUT_MS) {
        clearInterval(activityInterval);
        forzarCierreSesion();
      } else if (diff >= WARNING_TIME_MS && !warningShown) {
        warningShown = true;
        const timeLeft = IDLE_TIMEOUT_MS - diff;
        const isDarkMode = document.documentElement.classList.contains('dark');

        Swal.fire({
          title: '¿Sigues ahí?',
          text: 'Tu sesión expirará en 1 minuto por inactividad.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#7380ec',
          cancelButtonColor: '#ff7782',
          confirmButtonText: 'Sí, seguir conectado',
          cancelButtonText: 'Cerrar sesión',
          timer: timeLeft,
          timerProgressBar: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
          background: isDarkMode ? '#0f172a' : '#fff',
          color: isDarkMode ? '#f8fafc' : '#334155',
          customClass: { popup: 'rounded-[2rem] border border-transparent dark:border-slate-800' }
        }).then(async (result) => {
          warningShown = false;
          if (result.isConfirmed) {
            updateActivity();
            try {
              const data = await api.refreshTokenAPI();
              localStorage.setItem('token', data.token); 
            } catch {
              // CORRECCIÓN ESLINT: variable de error removida porque no se usa
              forzarCierreSesion(); 
            }
          } else if (result.dismiss === Swal.DismissReason.cancel || result.dismiss === Swal.DismissReason.timer) {
            forzarCierreSesion();
          }
        });
      }
    }, 1000);

    // 4. Renovación silenciosa si el usuario está trabajando
    const refreshInterval = window.setInterval(async () => {
       const last = parseInt(localStorage.getItem('lastActivity') || '0', 10);
       const diff = Date.now() - last;
       
       if (diff < REFRESH_INTERVAL_MS) {
           try {
              const data = await api.refreshTokenAPI();
              localStorage.setItem('token', data.token);
           } catch {
              forzarCierreSesion();
           }
       }
    }, REFRESH_INTERVAL_MS);

    return () => {
      events.forEach(e => window.removeEventListener(e, updateActivity));
      clearInterval(activityInterval);
      clearInterval(refreshInterval);
    };
  }, [forzarCierreSesion]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('themePref', 'dark'); // Guardamos la preferencia
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('themePref', 'light'); // Guardamos la preferencia
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
    if (window.innerWidth >= 768) setIsDesktopCollapsed(!isDesktopCollapsed);
    else setIsMobileMenuOpen(!isMobileOpen); 
  };

  const menu = [
    { path: '/', icon: <LayoutDashboard size={24} />, text: 'Inicio' },
    { path: '/asistencias', icon: <Clock size={24} />, text: 'Asistencias' },
    { path: '/empleados', icon: <Users size={24} />, text: 'Empleados' },
    { path: '/cargos', icon: <Briefcase size={24} />, text: 'Cargos' },
    { path: '/horarios', icon: <Calendar size={24} />, text: 'Horarios' },
    { path: '/reportes', icon: <FileBarChart size={24} />, text: 'Reportes' },
    { path: '/camara', icon: <Camera size={24} />, text: 'Monitoreo' }, 
    ...(esSuperAdmin ? [{ path: '/terminales', icon: <Cpu size={24} />, text: 'Terminales' }] : []),
  ];

  const getLinkStyle = (path: string) => `
    group flex items-center relative h-14 font-semibold transition-colors w-full cursor-pointer
    ${isDesktopCollapsed ? 'justify-center' : 'px-8'} 
    ${isActive(path) 
      ? 'text-primary dark:text-sky-100 bg-primary/5 dark:bg-slate-800' 
      : 'text-slate-500 hover:text-primary dark:hover:text-sky-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'
    }
  `;

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
              <span className="text-[15px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-wide">{username}</span>
            </button>
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
              <img src={userAvatar} alt="User Avatar" className="w-full h-full object-cover" />
            </div>
          </div>

          <AnimatePresence>
            {isProfileDropdownOpen && (
              <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 flex flex-col"
              >
                <Link to="/perfil" onClick={handleNavigation} className={`flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${isActive('/perfil') ? 'text-primary' : 'text-slate-600 dark:text-slate-300'}`}>
                  <UserCircle size={20} /> <span className="text-[15px] font-bold">Mi Perfil</span>
                </Link>
                <Link to="/configuracion" onClick={handleNavigation} className={`flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700 ${isActive('/configuracion') ? 'text-primary' : 'text-slate-600 dark:text-slate-300'}`}>
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

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onClick={() => setIsMobileMenuOpen(false)} className="md:hidden fixed inset-0 bg-slate-900/60 z-40" />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: isDesktopCollapsed ? "6rem" : "17rem", x: typeof window !== 'undefined' && window.innerWidth < 768 ? (isMobileOpen ? 0 : "-100%") : 0 }}
        transition={{ type: "tween", duration: 0.15, ease: "easeOut" }}
        className="fixed md:relative top-0 left-0 h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 shrink-0 transition-colors shadow-xl md:shadow-none"
      >
        <div onClick={handleLogoClick} className={`w-full flex shrink-0 border-b border-slate-100 dark:border-slate-800 items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isDesktopCollapsed ? 'h-24' : 'h-28'} md:flex hidden`}>
          <div className={`rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800 ${isDesktopCollapsed ? 'w-12 h-12' : 'w-20 h-20'}`}>
            <img src="/images/logo.png" alt="Logo" className={`object-contain transition-all ${isDesktopCollapsed ? 'w-8 h-8' : 'w-14 h-14'}`} />
          </div>
        </div>

        <div className="md:hidden h-16 shrink-0 border-b border-slate-100 dark:border-slate-800 flex items-center px-6">
           <span className="font-black text-xl text-slate-800 dark:text-white uppercase italic tracking-tighter">Menú</span>
        </div>

        <div className="flex flex-col py-6 w-full grow overflow-y-auto overflow-x-hidden gap-1">
          {menu.map(item => (
            <Link key={item.path} to={item.path} onClick={handleNavigation} className={getLinkStyle(item.path)}>
              {isActive(item.path) && <div className="absolute left-0 top-2 bottom-2 w-1.5 bg-primary rounded-r-md" />}
              <div className={`flex items-center justify-center shrink-0 ${isDesktopCollapsed ? 'group-hover:scale-110 transition-transform' : ''}`}>
                {item.icon}
              </div>
              {!isDesktopCollapsed && <span className="text-[15px] ml-5 whitespace-nowrap tracking-wide">{item.text}</span>}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex border-t border-slate-100 dark:border-slate-800 flex-col shrink-0 py-2">
          <Link to="/configuracion" onClick={handleNavigation} className={getLinkStyle('/configuracion')}>
             {isActive('/configuracion') && <div className="absolute left-0 top-2 bottom-2 w-1.5 bg-primary rounded-r-md" />}
             <div className={`flex items-center justify-center shrink-0 ${isDesktopCollapsed ? 'group-hover:scale-110 transition-transform' : ''}`}>
               <Settings size={24} />
             </div>
             {!isDesktopCollapsed && <span className="text-[15px] ml-5 whitespace-nowrap tracking-wide">Ajustes</span>}
          </Link>

          <Link to="/perfil" onClick={handleNavigation} className={getLinkStyle('/perfil')}>
             {isActive('/perfil') && <div className="absolute left-0 top-2 bottom-2 w-1.5 bg-primary rounded-r-md" />}
             <div className={`flex items-center justify-center shrink-0 ${isDesktopCollapsed ? 'group-hover:scale-110 transition-transform' : ''}`}>
               <UserCircle size={24} />
             </div>
             {!isDesktopCollapsed && <span className="text-[15px] font-bold ml-5 whitespace-nowrap tracking-wide">{username}</span>}
          </Link>

          <button onClick={() => setIsDark(!isDark)} className={`group flex items-center relative h-14 font-semibold transition-colors w-full cursor-pointer ${isDesktopCollapsed ? 'justify-center' : 'px-8'} text-slate-500 hover:text-primary dark:hover:text-sky-100 hover:bg-slate-50 dark:hover:bg-slate-800/50`}>
             <div className={`flex items-center justify-center shrink-0 ${isDesktopCollapsed ? 'group-hover:scale-110 transition-transform' : ''}`}>
               {isDark ? <Sun size={24} className="text-amber-500" /> : <Moon size={24} />}
             </div>
             {!isDesktopCollapsed && <span className="text-[15px] ml-5 whitespace-nowrap tracking-wide">{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>}
          </button>

          <Link to="/salir" onClick={handleNavigation} className={`group flex items-center relative h-14 font-semibold transition-colors w-full ${isDesktopCollapsed ? 'justify-center' : 'px-8'} text-red-500 hover:bg-red-50 dark:hover:bg-danger/10`}>
             <div className={`flex items-center justify-center shrink-0 ${isDesktopCollapsed ? 'group-hover:scale-110 transition-transform' : ''}`}>
               <LogOut size={24} />
             </div>
             {!isDesktopCollapsed && <span className="text-[15px] font-bold ml-5 whitespace-nowrap tracking-wide">Cerrar Sesión</span>}
          </Link>
        </div>
      </motion.aside>

      <main className="flex-1 pt-20 md:pt-6 p-6 md:p-8 min-w-0 h-screen overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors relative">
        {children}
      </main>
    </div>
  );
}