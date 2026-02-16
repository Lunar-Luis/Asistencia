import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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
    /* Contenedor principal: Altura de pantalla completa y bloqueamos el scroll exterior */
    /* Mantenemos tus clases bg originales tal cual */
    <div className="flex w-full h-screen bg-light dark:bg-dark-background overflow-hidden">
      
      {/* SIDEBAR: Altura completa (h-full) para que se mantenga fijo al lateral */}
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

        {/* Menú de opciones: Solo esta parte tiene scroll si los items superan la pantalla */}
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

        {/* SECCIÓN DE PERFIL Y TOGGLE (FIJA ABAJO POR shrink-0) */}
        <div className="mb-4 px-4 pt-4 border-t border-light dark:border-dark-light/20 relative min-h-[5rem] shrink-0">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div 
                key="perfil-open"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img src="/images/logo.png" alt="Perfil" className="w-10 h-10 rounded-full object-cover border-2 border-primary/20" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white dark:border-dark-white shadow-sm"></span>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[0.85rem] font-black dark:text-dark-text leading-none uppercase tracking-wider">CMBT</p>
                    <span className="text-[0.65rem] text-info-dark dark:text-dark-text-variant font-medium mt-1">Súper Admin</span>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsDark(!isDark)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-light dark:bg-dark-light text-primary shadow-sm"
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={isDark ? 'dark' : 'light'}
                      initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                      className="material-icons-sharp text-[1.4rem]"
                    >
                      {isDark ? 'dark_mode' : 'light_mode'}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                key="perfil-closed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-4 w-full group/profile relative"
              >
                <div className="relative shrink-0">
                  <img src="/images/logo.png" alt="Perfil" className="w-10 h-10 rounded-full object-cover border-2 border-primary/20" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white dark:border-dark-white shadow-sm"></span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsDark(!isDark)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-light dark:bg-dark-light text-primary shadow-sm"
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={isDark ? 'dark' : 'light'}
                      initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                      className="material-icons-sharp text-[1.4rem]"
                    >
                      {isDark ? 'dark_mode' : 'light_mode'}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
                <div className="absolute left-full ml-6 px-3 py-1.5 bg-gray-800 text-white text-[0.75rem] rounded-md opacity-0 group-hover/profile:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover/profile:translate-x-0 pointer-events-none z-[100] whitespace-nowrap shadow-xl">
                  Perfil / Tema
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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

      {/* CONTENIDO PRINCIPAL: Habilitamos el scroll independiente aquí */}
      <main className="flex-1 p-[1.8rem] min-w-0 h-screen overflow-y-auto scroll-smooth">
        {children}
      </main>

    </div>
  );
}