import { motion, type Variants, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom'; // Importante para la navegación
import { 
  HiOutlineUsers, HiOutlineCheckCircle, HiOutlineClock, HiOutlineXCircle,
  HiOutlineArrowTrendingUp, HiOutlineUserPlus, HiOutlineDocumentChartBar,
  HiOutlineCog6Tooth, HiOutlineCalendarDays,
  HiOutlineClipboardDocumentList, HiOutlineCpuChip
} from 'react-icons/hi2';
import RightTopBar from "../components/RightTopBar";

export default function Inicio() {
  const [hoveredValue, setHoveredValue] = useState<{val: number, label: string, x: number, y: number} | null>(null);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3, when: "beforeChildren", staggerChildren: 0.05 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const stats = [
    { title: "Total Empleados", value: "12", icon: <HiOutlineUsers />, color: "text-primary", bg: "bg-primary/10", trend: "+12%" },
    { title: "Presentes", value: "8", icon: <HiOutlineCheckCircle />, color: "text-success", bg: "bg-success/10", trend: "80%" },
    { title: "Tarde", value: "2", icon: <HiOutlineClock />, color: "text-warning", bg: "bg-warning/10", trend: "15%" },
    { title: "Ausentes", value: "2", icon: <HiOutlineXCircle />, color: "text-danger", bg: "bg-danger/10", trend: "5%" },
  ];

  const chartData = [
    { fecha: "10 Mar", p: 8, t: 2, a: 2 },
    { fecha: "11 Mar", p: 7, t: 3, a: 2 },
    { fecha: "12 Mar", p: 9, t: 1, a: 2 },
    { fecha: "13 Mar", p: 10, t: 1, a: 1 },
    { fecha: "14 Mar", p: 6, t: 4, a: 2 },
    { fecha: "15 Mar", p: 11, t: 0, a: 1 },
    { fecha: "16 Mar", p: 8, t: 2, a: 2 },
  ];

  const hoverEffect = "hover:shadow-[0_15px_35px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_15px_35px_rgba(0,0,0,0.5)] transition-all duration-300";

  return (
    <>
      <motion.main 
        className="mt-[1.4rem] pr-4 pb-4" 
        initial="hidden" animate="visible" variants={containerVariants}
      >
        {/* --- HEADER --- */}
        <motion.div variants={itemVariants} className="mb-10">
          <h1 className="text-[3rem] font-black tracking-tighter uppercase italic leading-none flex items-center gap-x-3">
            <span className="text-info-dark dark:text-white">Panel</span>
            <motion.span 
              className="bg-gradient-to-r from-primary via-indigo-900 to-primary dark:via-white bg-[length:200%_auto] bg-clip-text text-transparent inline-block NOT-italic"
              animate={{ backgroundPosition: ["0% center", "200% center"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            >
              Principal
            </motion.span>
          </h1>
          <p className="text-xs font-bold text-info-dark/40 dark:text-white/60 uppercase tracking-[0.4em] mt-2">
            Resumen Global de Asistencia
          </p>
        </motion.div>

        {/* --- 1. ESTADÍSTICAS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <motion.div key={i} variants={itemVariants} whileHover={{ y: -8 }}
              className={`bg-white dark:bg-dark-white p-7 rounded-[2.5rem] border border-transparent dark:border-dark-light/5 cursor-default ${hoverEffect}`}
            >
              <div className="flex justify-between items-start">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} text-3xl`}>{stat.icon}</div>
                <span className={`text-xs font-bold flex items-center gap-1 ${stat.color}`}>
                  <HiOutlineArrowTrendingUp /> {stat.trend}
                </span>
              </div>
              <div className="mt-6">
                <p className="text-[11px] font-bold text-info-dark/40 dark:text-white/60 uppercase tracking-widest">{stat.title}</p>
                <h2 className="text-4xl font-black text-info-dark dark:text-white">{stat.value}</h2>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- 2. SECCIÓN CENTRAL: GRÁFICA + ACCIONES RÁPIDAS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Gráfica */}
          <motion.div 
            variants={itemVariants}
            className={`lg:col-span-2 bg-white dark:bg-dark-white p-8 rounded-[3rem] border border-transparent dark:border-dark-light/5 relative ${hoverEffect}`}
          >
            <div className="flex flex-wrap justify-between items-start mb-10 gap-4">
              <div>
                <h3 className="font-black uppercase italic tracking-tighter dark:text-white text-xl">Resumen de Asistencia</h3>
                <p className="text-[10px] font-bold text-info-dark/40 dark:text-white/60 uppercase tracking-widest mt-1">Monitoreo semanal interactivo</p>
              </div>
              <div className="flex gap-4 items-center bg-light/50 dark:bg-dark-light/10 p-2 px-4 rounded-2xl border border-transparent dark:border-white/5">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-success"></span><span className="text-[10px] font-black dark:text-white uppercase">Presente</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-warning"></span><span className="text-[10px] font-black dark:text-white uppercase">Tarde</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-danger"></span><span className="text-[10px] font-black dark:text-white uppercase">Ausente</span></div>
              </div>
            </div>
            
            <div className="relative h-72 w-full flex items-end justify-between px-2 mt-4">
               <AnimatePresence>
                 {hoveredValue && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }}
                     className="absolute z-50 bg-info-dark text-white text-[10px] font-black px-4 py-2 rounded-2xl shadow-2xl pointer-events-none uppercase italic flex flex-col items-center"
                     style={{ left: `${hoveredValue.x}%`, bottom: `${hoveredValue.y + 10}%`, transform: 'translateX(-50%)' }}
                   >
                     <span className="opacity-60 text-[8px]">{hoveredValue.label}</span>
                     <span>{hoveredValue.val} EMPLEADOS</span>
                     <div className="w-2 h-2 bg-info-dark rotate-45 absolute -bottom-1"></div>
                   </motion.div>
                 )}
               </AnimatePresence>

               {chartData.map((data, i) => {
                 const total = 12;
                 const pHeight = (data.p / total) * 100;
                 const tHeight = (data.t / total) * 100;
                 const aHeight = (data.a / total) * 100;

                 return (
                   <div key={i} className="w-[11%] h-full flex flex-col justify-end items-center gap-4 group">
                     <div className="w-full flex flex-col-reverse h-full bg-gray-100 dark:bg-white/5 rounded-2xl relative overflow-hidden transition-colors">
                        <motion.div 
                          initial={{height:0}} animate={{height: `${pHeight}%`}} 
                          className="bg-success w-full relative cursor-pointer hover:brightness-110 transition-all border-t border-white/10"
                          onMouseEnter={() => setHoveredValue({ val: data.p, label: "Presentes", x: (i * 14.3) + 6, y: pHeight })}
                          onMouseLeave={() => setHoveredValue(null)}
                        />
                        <motion.div 
                          initial={{height:0}} animate={{height: `${tHeight}%`}} 
                          className="bg-warning w-full relative cursor-pointer hover:brightness-110 transition-all border-t border-white/10"
                          onMouseEnter={() => setHoveredValue({ val: data.t, label: "Tarde", x: (i * 14.3) + 6, y: pHeight + tHeight })}
                          onMouseLeave={() => setHoveredValue(null)}
                        />
                        <motion.div 
                          initial={{height:0}} animate={{height: `${aHeight}%`}} 
                          className="bg-danger w-full relative cursor-pointer hover:brightness-110 transition-all"
                          onMouseEnter={() => setHoveredValue({ val: data.a, label: "Ausentes", x: (i * 14.3) + 6, y: pHeight + tHeight + aHeight })}
                          onMouseLeave={() => setHoveredValue(null)}
                        />
                     </div>
                     <span className="text-[10px] font-black text-info-dark/40 dark:text-white/60 uppercase group-hover:text-primary transition-colors italic">{data.fecha}</span>
                   </div>
                 );
               })}
            </div>
          </motion.div>

          {/* Acciones Rápidas con RUTAS REALES */}
          <motion.div variants={itemVariants} className={`bg-white dark:bg-dark-white p-8 rounded-[3rem] border border-transparent dark:border-dark-light/5 ${hoverEffect}`}>
            <h3 className="font-black uppercase italic tracking-tighter dark:text-white text-xl">Acciones Rápidas</h3>
            <p className="text-[10px] font-bold text-info-dark/40 dark:text-white/60 uppercase mt-1 mb-8 tracking-widest">Atajos de gestión</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Personal", sub: "Empleados", path: "/empleados", icon: <HiOutlineUserPlus />, color: "bg-primary" },
                { label: "NFC", sub: "Registro", path: "/registro", icon: <HiOutlineCpuChip />, color: "bg-indigo-500" },
                { label: "Cargos", sub: "Roles", path: "/cargos", icon: <HiOutlineClipboardDocumentList />, color: "bg-purple-500" },
                { label: "Reportes", sub: "Exportar", path: "/reportes", icon: <HiOutlineDocumentChartBar />, color: "bg-success" },
                { label: "Horarios", sub: "Turnos", path: "/horarios", icon: <HiOutlineCalendarDays />, color: "bg-warning" },
                { label: "Ajustes", sub: "Sistema", path: "/configuracion", icon: <HiOutlineCog6Tooth />, color: "bg-[#4154f1]" },
              ].map((action, i) => (
                <Link key={i} to={action.path} className="flex flex-col items-center p-4 rounded-[2rem] hover:bg-light dark:hover:bg-dark-light/10 transition-all group border border-transparent hover:border-primary/5">
                  <div className={`p-4 rounded-2xl ${action.color} text-white text-xl group-hover:scale-110 group-hover:rotate-3 transition-all shadow-md`}>
                    {action.icon}
                  </div>
                  <div className="mt-2 text-center">
                    <span className="block text-[9px] font-black uppercase tracking-tighter dark:text-white leading-tight">{action.label}</span>
                    <span className="block text-[7px] font-bold uppercase text-info-dark/30 dark:text-white/20">{action.sub}</span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* --- 3. ACTIVIDAD RECIENTE (ANCHO COMPLETO) --- */}
        <motion.div variants={itemVariants} className={`bg-white dark:bg-dark-white p-8 rounded-[3rem] border border-transparent dark:border-dark-light/5 ${hoverEffect}`}>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="font-black uppercase italic tracking-tighter dark:text-white text-xl">Actividad Reciente</h3>
              <p className="text-[10px] font-bold text-info-dark/40 dark:text-white/60 uppercase tracking-widest mt-1">Últimos registros nfc detectados</p>
            </div>
            <Link to="/registro" className="text-[10px] font-black uppercase text-primary hover:underline italic transition-all">Ver historial completo</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Sebastián López", time: "08:00 AM", status: "A tiempo", img: "SL", color: "text-success", bg: "bg-success/10" },
              { name: "Andrea Pérez", time: "08:15 AM", status: "Tarde", img: "AP", color: "text-warning", bg: "bg-warning/10" },
              { name: "Juan Castro", time: "---", status: "Ausente", img: "JC", color: "text-danger", bg: "bg-danger/10" },
              { name: "Anurbe Dev", time: "07:55 AM", status: "A tiempo", img: "AD", color: "text-success", bg: "bg-success/10" },
            ].map((user, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer p-5 rounded-[2rem] bg-light/30 dark:bg-dark-light/5 border border-transparent hover:border-primary/10 hover:bg-white dark:hover:bg-dark-light/10 transition-all">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-sm font-black text-primary border border-primary/20 group-hover:scale-110 transition-transform">{user.img}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-info-dark dark:text-white uppercase tracking-tighter truncate">{user.name}</p>
                  <p className="text-[10px] text-info-dark/40 dark:text-dark-text-variant font-black uppercase italic">{user.time}</p>
                </div>
                <span className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-lg ${user.bg} ${user.color}`}>{user.status}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.main>

      <div className="mt-[1rem]">
        <RightTopBar />
      </div>
    </>
  );
}