import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  const [isOpen, setIsOpen] = useState(true);

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
    <motion.div 
      animate={{ gridTemplateColumns: isOpen ? "14rem 1fr 23rem" : "7rem 1fr 23rem" }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="grid w-full pl-0 pr-[2%] gap-[1.8rem] grid-cols-1 md:grid-cols-[7rem_1fr_23rem] min-h-screen"
    >
      <aside className="h-screen sticky top-0 hidden md:flex flex-col">
        
        {/* Contenedor del Logo */}
        <div className="mt-[1.4rem] w-full shrink-0 min-h-[4rem] flex items-center justify-center">
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
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
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
        <div className="flex flex-col mt-[0.8rem] w-full">
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
                    <h3 className="text-[0.87rem] w-max whitespace-nowrap">
                      {item.text}
                    </h3>
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

        {/* Botón Salir */}
        <Link to="/salir" 
          className={`group flex items-center h-[3.7rem] relative font-medium text-info-dark dark:text-dark-text-variant hover:text-primary mt-auto mb-[2rem] w-full transition-all duration-500 ease-in-out justify-start
            ${isOpen ? 'pl-3' : 'pl-[2.7rem]'}
          `}
        >
          <motion.span whileHover={{ scale: 1.15 }} className="material-icons-sharp text-[1.6rem] flex-shrink-0 transition-colors duration-500">logout</motion.span>
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="exit-text"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden flex-shrink-0 ml-4"
              >
                <h3 className="text-[0.87rem] w-max whitespace-nowrap">Salir</h3>
              </motion.div>
            ) : (
              <div className="absolute left-full ml-6 px-3 py-1.5 bg-gray-800 text-white text-[0.75rem] rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 pointer-events-none z-[100] whitespace-nowrap shadow-xl">
                Salir
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45" />
              </div>
            )}
          </AnimatePresence>
        </Link>
      </aside>

      {children}
    </motion.div>
  );
}