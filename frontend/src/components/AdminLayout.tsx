import { type ReactNode, useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  const [isOpen, setIsOpen] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menu = [
    { path: '/', icon: 'grid_view', text: 'Inicio' },
    { path: '/empleados', icon: 'groups', text: 'Empleados' },
    { path: '/cargos', icon: 'work', text: 'Cargos' },
    { path: '/horarios', icon: 'schedule', text: 'Horarios' },
    { path: '/registro', icon: 'nfc', text: 'Registro (En Vivo)' },
    { path: '/reportes', icon: 'analytics', text: 'Reporte' },
  ];

  const shimmerStyle = {
    maskImage: 'url(/images/SL.png)',
    WebkitMaskImage: 'url(/images/SL.png)',
    maskSize: 'contain',
    maskRepeat: 'no-repeat',
    maskPosition: 'center',
    background: 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.6) 50%, transparent 75%)',
    backgroundSize: '200% 100%'
  };

  return (
    <div className="flex w-full h-screen bg-light dark:bg-dark-background overflow-hidden">
      
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? "14rem" : "7rem" }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="h-full hidden md:flex flex-col bg-white dark:bg-dark-white shadow-xl z-50 shrink-0"
      >
        
        {/* Contenedor del Logo */}
        <div className="mt-[1.4rem] w-full shrink-0 min-h-[3.5rem] flex items-center justify-center overflow-hidden">
          <div 
            className="cursor-pointer select-none w-full h-full flex items-center justify-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div 
                  key="open"
                  initial={{ opacity: 0, filter: "blur(8px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(8px)" }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center pl-4 w-full"
                >
                  <div className="relative w-[2.2rem] h-[1.8rem] flex-shrink-0">
                    <motion.div 
                      className="absolute inset-0 z-20"
                      style={shimmerStyle}
                      animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                    <img src="/images/SL.png" alt="Logo" className="w-full h-full object-contain relative z-10" />
                  </div>
                  <h2 className="text-info-dark dark:text-dark-text font-extrabold text-[1.4rem] ml-2 whitespace-nowrap tracking-tighter">
                    SYNC<motion.span 
                      className="bg-gradient-to-r from-primary via-indigo-900 to-primary dark:via-white bg-[length:200%_auto] bg-clip-text text-transparent inline-block"
                      animate={{ backgroundPosition: ["0% center", "200% center"] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    >LOGIC</motion.span>
                  </h2>
                </motion.div>
              ) : (
                <motion.div 
                  key="closed"
                  initial={{ opacity: 0, scale: 0.8, filter: "blur(8px)" }}
                  animate={{ opacity: 1, scale: 1.8, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.8, filter: "blur(8px)" }}
                  transition={{ duration: 0.4 }}
                  className="relative w-[2.5rem] h-[2.5rem] flex items-center justify-center"
                >
                  <motion.div 
                    className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <div className="relative w-full h-full">
                    <motion.div 
                      className="absolute inset-0 z-20"
                      style={shimmerStyle}
                      animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                    <img src="/images/SL.png" alt="Logo" className="w-full h-full object-contain relative z-10" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Menú de opciones */}
        <div className="flex flex-col mt-[0.8rem] w-full grow overflow-y-auto overflow-x-hidden no-scrollbar">
          {menu.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`group flex items-center h-[3.7rem] relative font-medium transition-all duration-500 ease-in-out w-full justify-start
                ${isActive(item.path) ? 'bg-light dark:bg-dark-light text-primary' : 'text-info-dark dark:text-dark-text-variant hover:text-primary'}
                ${isOpen ? 'pl-3' : 'pl-[2.7rem]'}
              `}
            >
              {isActive(item.path) && (
                <motion.div
                  layoutId="active-indicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute left-0 w-[6px] h-full bg-primary rounded-r-md"
                />
              )}
              <motion.span 
                whileHover={{ scale: 1.15 }}
                className={`material-icons-sharp text-[1.6rem] flex-shrink-0 transition-colors duration-500 ${isActive(item.path) ? 'text-primary' : ''}`}
              >
                {item.icon}
              </motion.span>
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="text"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden flex-shrink-0 ml-4"
                  >
                    <h3 className="text-[0.87rem] w-max whitespace-nowrap">{item.text}</h3>
                  </motion.div>
                ) : (
                  <div className="absolute left-full ml-6 px-3 py-1.5 bg-gray-800 text-white text-[0.75rem] rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 pointer-events-none z-[100] whitespace-nowrap shadow-xl">
                    {item.text}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45" />
                  </div>
                )}
              </AnimatePresence>
            </Link>
          ))}
        </div>

        {/* SECCIÓN DE PERFIL CON ANIMACIÓN FLUIDA */}
        <div className="mb-4 px-4 pt-4 border-t border-light dark:border-dark-light/20 relative shrink-0" ref={profileRef}>
          
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, x: isOpen ? 0 : 20, y: isOpen ? 10 : 0, scale: 0.95 }}
                animate={{ opacity: 1, x: isOpen ? 0 : 0, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: isOpen ? 0 : 20, y: isOpen ? 10 : 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`absolute bg-white dark:bg-dark-white rounded-2xl shadow-2xl border border-light dark:border-dark-light/20 overflow-hidden z-[100] w-48
                  ${isOpen ? 'bottom-full left-4 mb-2' : 'left-full bottom-0 ml-4'}
                `}
              >
                <div className="p-2 flex flex-col gap-1">
                  <div className="px-3 py-2 md:hidden border-b border-light dark:border-dark-light/10 mb-1">
                     <p className="text-[0.8rem] font-bold dark:text-dark-text">CMBT</p>
                     <p className="text-[0.6rem] text-info-dark dark:text-dark-text-variant">Súper Admin</p>
                  </div>
                  <Link 
                    to="/perfil" 
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-light dark:hover:bg-dark-light transition-colors group"
                  >
                    <span className="material-icons-sharp text-info-dark dark:text-dark-text-variant group-hover:text-primary transition-colors">manage_accounts</span>
                    <span className="text-[0.85rem] font-medium text-info-dark dark:text-dark-text-variant group-hover:text-primary">Editar Perfil</span>
                  </Link>
                  <div className="h-[1px] bg-light dark:bg-dark-light/20 mx-2" />
                  <Link 
                    to="/configuracion" 
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-light dark:hover:bg-dark-light transition-colors group"
                  >
                    <span className="material-icons-sharp text-info-dark dark:text-dark-text-variant group-hover:text-primary transition-colors">settings</span>
                    <span className="text-[0.85rem] font-medium text-info-dark dark:text-dark-text-variant group-hover:text-primary">Ajustes</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* El uso de Layout aquí es vital para evitar el "salto" */}
          <motion.div 
            layout
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className={`flex items-center w-full relative h-12 ${isOpen ? 'justify-between' : 'justify-center'}`}
          >
            <motion.div 
              layout
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <motion.div layout className="relative shrink-0 transition-transform group-hover:scale-110 duration-300">
                <img src="/images/logo.png" alt="Perfil" className="w-10 h-10 rounded-full object-cover border-2 border-primary/20" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white dark:border-dark-white shadow-sm"></span>
              </motion.div>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex flex-col overflow-hidden"
                  >
                    <p className="text-[0.85rem] font-black dark:text-dark-text leading-none uppercase tracking-wider whitespace-nowrap">CMBT</p>
                    <span className="text-[0.65rem] text-info-dark dark:text-dark-text-variant font-medium mt-1 whitespace-nowrap">Súper Admin</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <AnimatePresence>
              {isOpen && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.5, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.5, x: 20 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsDark(!isDark)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-light dark:bg-dark-light text-primary shadow-sm shrink-0"
                >
                  <motion.span
                    key={isDark ? 'dark' : 'light'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    className="material-icons-sharp text-[1.4rem]"
                  >
                    {isDark ? 'dark_mode' : 'light_mode'}
                  </motion.span>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Botón Salir */}
        <div className="mb-[1rem] w-full shrink-0">
          <Link to="/salir" 
            className={`group flex items-center h-[3.7rem] relative font-bold text-info-dark dark:text-dark-text-variant hover:text-danger w-full transition-all duration-500
              ${isOpen ? 'pl-3' : 'pl-[2.7rem]'}
            `}
          >
            <motion.span 
              whileHover={{ scale: 1.15 }}
              className="material-icons-sharp text-[1.6rem] flex-shrink-0"
            >
              logout
            </motion.span>
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="logout-text"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden flex-shrink-0 ml-4"
                >
                  <h3 className="text-[0.8rem] uppercase tracking-[0.1em] whitespace-nowrap">
                    Cerrar Sesión
                  </h3>
                </motion.div>
              ) : (
                <div className="absolute left-full ml-6 px-3 py-1.5 bg-gray-800 text-white text-[0.75rem] rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 pointer-events-none z-[100] whitespace-nowrap shadow-xl">
                  Cerrar Sesión
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45" />
                </div>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </motion.aside>

      <main className="flex-1 p-[1.8rem] min-w-0 h-screen overflow-y-auto scroll-smooth">
        {children}
      </main>

    </div>
  );
}