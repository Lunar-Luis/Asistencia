import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, CheckCircle2, Clock, XCircle,
  TrendingUp, UserPlus, FileBarChart,
  Settings, CalendarDays,
  ClipboardList, Fingerprint
} from 'lucide-react';

// ==========================================
// ESTILOS GLOBALES CORPORATIVOS (Hover Suave)
// ==========================================
const hoverEffect = "transition-all duration-200 hover:shadow-md border border-transparent hover:border-slate-200 dark:hover:border-slate-700 dark:hover:bg-white/5";

const animProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

// ==========================================
// COMPONENTES SKELETON
// ==========================================
const SkeletonStats = () => (
  <motion.div {...animProps} className="bg-white dark:bg-dark-white p-7 rounded-[2.5rem] border border-transparent dark:border-dark-light/5 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="w-16 h-16 rounded-2xl bg-light/50 dark:bg-dark-light/10"></div>
      <div className="w-12 h-4 rounded-full bg-light/50 dark:bg-dark-light/10"></div>
    </div>
    <div className="mt-6">
      <div className="w-24 h-3 bg-light/50 dark:bg-dark-light/10 rounded mb-3"></div>
      <div className="w-16 h-10 bg-light/50 dark:bg-dark-light/10 rounded"></div>
    </div>
  </motion.div>
);

const SkeletonActivity = () => (
  <motion.div {...animProps} className="bg-white dark:bg-dark-white p-8 rounded-[3rem] border border-transparent dark:border-dark-light/5 animate-pulse mb-8">
    <div className="flex justify-between items-end mb-8">
      <div>
        <div className="w-48 h-8 bg-light/50 dark:bg-dark-light/10 rounded mb-2"></div>
        <div className="w-32 h-3 bg-light/50 dark:bg-dark-light/10 rounded"></div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex items-center gap-4 p-5 rounded-[2rem] bg-light/30 dark:bg-dark-light/5">
          <div className="w-14 h-14 rounded-full bg-light/50 dark:bg-dark-light/10 shrink-0"></div>
          <div className="flex-1">
            <div className="w-full h-4 bg-light/50 dark:bg-dark-light/10 rounded mb-2"></div>
            <div className="w-1/2 h-3 bg-light/50 dark:bg-dark-light/10 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const SkeletonChart = () => (
  <motion.div {...animProps} className="bg-white dark:bg-dark-white p-8 rounded-[3rem] border border-transparent dark:border-dark-light/5 relative animate-pulse h-full flex flex-col">
    <div className="flex flex-wrap justify-between items-start mb-10 gap-4">
      <div>
        <div className="w-56 h-8 bg-light/50 dark:bg-dark-light/10 rounded mb-2"></div>
        <div className="w-40 h-3 bg-light/50 dark:bg-dark-light/10 rounded"></div>
      </div>
      <div className="w-48 h-8 bg-light/50 dark:bg-dark-light/10 rounded-2xl"></div>
    </div>
    <div className="relative flex-1 w-full flex items-end justify-between px-2 mt-4 min-h-[250px]">
      {[1,2,3,4,5,6,7].map(i => (
        <div key={i} className="w-[11%] h-[60%] bg-light/50 dark:bg-dark-light/10 rounded-2xl"></div>
      ))}
    </div>
  </motion.div>
);

const SkeletonActions = () => (
  <motion.div {...animProps} className="bg-white dark:bg-dark-white p-8 rounded-[3rem] border border-transparent dark:border-dark-light/5 animate-pulse h-full">
    <div className="w-40 h-8 bg-light/50 dark:bg-dark-light/10 rounded mb-2"></div>
    <div className="w-24 h-3 bg-light/50 dark:bg-dark-light/10 rounded mb-8"></div>
    <div className="grid grid-cols-2 gap-4">
      {[1,2,3,4,5,6].map(i => (
        <div key={i} className="flex flex-col items-center p-4 rounded-[2rem] border border-light/50 dark:border-dark-light/10">
          <div className="w-16 h-16 rounded-2xl bg-light/50 dark:bg-dark-light/10 mb-2"></div>
          <div className="w-16 h-3 bg-light/50 dark:bg-dark-light/10 rounded mb-1"></div>
          <div className="w-10 h-2 bg-light/50 dark:bg-dark-light/10 rounded"></div>
        </div>
      ))}
    </div>
  </motion.div>
);

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function Inicio() {
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredValue, setHoveredValue] = useState<{val: number, label: string, x: number, y: number} | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { title: "Total Empleados", value: "142", icon: <Users size={32} />, color: "text-primary", bg: "bg-primary/10", trend: "+12%" },
    { title: "Presentes", value: "118", icon: <CheckCircle2 size={32} />, color: "text-success", bg: "bg-success/10", trend: "80%" },
    { title: "Tarde", value: "8", icon: <Clock size={32} />, color: "text-warning", bg: "bg-warning/10", trend: "15%" },
    { title: "Ausentes", value: "12", icon: <XCircle size={32} />, color: "text-danger", bg: "bg-danger/10", trend: "5%" },
  ];

  const chartData = [
    { fecha: "10 Mar", p: 110, t: 15, a: 17 },
    { fecha: "11 Mar", p: 125, t: 8, a: 9 },
    { fecha: "12 Mar", p: 118, t: 12, a: 12 },
    { fecha: "13 Mar", p: 130, t: 5, a: 7 },
    { fecha: "14 Mar", p: 115, t: 10, a: 17 },
    { fecha: "15 Mar", p: 135, t: 2, a: 5 },
    { fecha: "16 Mar", p: 118, t: 8, a: 12 },
  ];

  return (
    <main className="mt-[1.4rem] pr-4 pb-4">
      {/* --- HEADER --- */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
        <h1 className="text-[3rem] font-black tracking-tighter uppercase italic leading-none flex items-center gap-x-3">
          <span className="text-info-dark dark:text-white">Panel</span>
          <span className="bg-gradient-to-r from-primary via-indigo-900 to-primary dark:via-white bg-[length:200%_auto] bg-clip-text text-transparent inline-block NOT-italic">
            Principal
          </span>
        </h1>
        <p className="text-xs font-bold text-info-dark/40 dark:text-white/60 uppercase tracking-[0.4em] mt-2">
          Resumen Global de Asistencia
        </p>
      </motion.div>

      {/* --- 1. ESTADÍSTICAS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoading ? (
          <>
            <SkeletonStats />
            <SkeletonStats />
            <SkeletonStats />
            <SkeletonStats />
          </>
        ) : (
          <AnimatePresence>
            {stats.map((stat, i) => (
              <motion.div key={i} {...animProps} transition={{ delay: i * 0.05 }}
                className={`bg-white dark:bg-dark-white p-7 rounded-[2.5rem] cursor-default ${hoverEffect}`}
              >
                <div className="flex justify-between items-start">
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>{stat.icon}</div>
                  <span className={`text-xs font-bold flex items-center gap-1 ${stat.color}`}>
                    <TrendingUp size={14} /> {stat.trend}
                  </span>
                </div>
                <div className="mt-6">
                  <p className="text-[11px] font-bold text-info-dark/40 dark:text-white/60 uppercase tracking-widest">{stat.title}</p>
                  <h2 className="text-4xl font-black text-info-dark dark:text-white">{stat.value}</h2>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* --- 2. ACTIVIDAD RECIENTE --- */}
      {isLoading ? (
        <SkeletonActivity />
      ) : (
        <motion.div {...animProps} transition={{ delay: 0.15 }} className={`bg-white dark:bg-dark-white p-8 rounded-[3rem] mb-8 ${hoverEffect}`}>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="font-black uppercase italic tracking-tighter dark:text-white text-xl">Actividad Reciente</h3>
              <p className="text-[10px] font-bold text-info-dark/40 dark:text-white/60 uppercase tracking-widest mt-1">Últimos registros nfc detectados</p>
            </div>
            <Link to="/asistencias" className="text-[10px] font-black uppercase text-primary hover:underline italic transition-all">Ver historial completo</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Sebastián López", time: "08:00 AM", status: "A tiempo", img: "SL", color: "text-success", bg: "bg-success/10" },
              { name: "Andrea Pérez", time: "08:15 AM", status: "Tarde", img: "AP", color: "text-warning", bg: "bg-warning/10" },
              { name: "Juan Castro", time: "---", status: "Ausente", img: "JC", color: "text-danger", bg: "bg-danger/10" },
              { name: "Anurbe Dev", time: "07:55 AM", status: "A tiempo", img: "AD", color: "text-success", bg: "bg-success/10" },
            ].map((user, i) => (
              <div key={i} className="flex items-center gap-4 group p-5 rounded-[2rem] bg-light/30 dark:bg-dark-light/5 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-sm font-black text-primary border border-primary/20">{user.img}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-info-dark dark:text-white uppercase tracking-tighter truncate">{user.name}</p>
                  <p className="text-[10px] text-info-dark/40 dark:text-dark-text-variant font-black uppercase italic">{user.time}</p>
                </div>
                <span className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-lg ${user.bg} ${user.color}`}>{user.status}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* --- 3. SECCIÓN INFERIOR: GRÁFICA + ACCIONES RÁPIDAS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Gráfica */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <SkeletonChart />
          ) : (
            <motion.div {...animProps} transition={{ delay: 0.2 }} className={`bg-white dark:bg-dark-white p-8 rounded-[3rem] relative h-full flex flex-col ${hoverEffect}`}>
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
              
              <div className="relative flex-1 w-full flex items-end justify-between px-2 mt-4 min-h-[250px]">
                 <AnimatePresence>
                   {hoveredValue && (
                     <motion.div 
                       initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }}
                       className="absolute z-50 bg-info-dark text-white text-[10px] font-black px-4 py-2 rounded-2xl shadow-xl pointer-events-none uppercase italic flex flex-col items-center"
                       style={{ left: `${hoveredValue.x}%`, bottom: `${hoveredValue.y + 10}%`, transform: 'translateX(-50%)' }}
                     >
                       <span className="opacity-60 text-[8px]">{hoveredValue.label}</span>
                       <span>{hoveredValue.val} EMPLEADOS</span>
                       <div className="w-2 h-2 bg-info-dark rotate-45 absolute -bottom-1"></div>
                     </motion.div>
                   )}
                 </AnimatePresence>

                 {chartData.map((data, i) => {
                   const total = 142;
                   const pHeight = (data.p / total) * 100;
                   const tHeight = (data.t / total) * 100;
                   const aHeight = (data.a / total) * 100;

                   return (
                     <div key={i} className="w-[11%] h-full flex flex-col justify-end items-center gap-4 group">
                       <div className="w-full flex flex-col-reverse h-full bg-gray-100 dark:bg-white/5 rounded-2xl relative overflow-hidden transition-colors">
                          <motion.div initial={{height:0}} animate={{height: `${pHeight}%`}} transition={{ duration: 0.8, delay: 0.1 }}
                            className="bg-success w-full relative cursor-pointer hover:brightness-110 transition-all border-t border-white/10"
                            onMouseEnter={() => setHoveredValue({ val: data.p, label: "Presentes", x: (i * 14.3) + 6, y: pHeight })}
                            onMouseLeave={() => setHoveredValue(null)}
                          />
                          <motion.div initial={{height:0}} animate={{height: `${tHeight}%`}} transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-warning w-full relative cursor-pointer hover:brightness-110 transition-all border-t border-white/10"
                            onMouseEnter={() => setHoveredValue({ val: data.t, label: "Tarde", x: (i * 14.3) + 6, y: pHeight + tHeight })}
                            onMouseLeave={() => setHoveredValue(null)}
                          />
                          <motion.div initial={{height:0}} animate={{height: `${aHeight}%`}} transition={{ duration: 0.8, delay: 0.3 }}
                            className="bg-danger w-full relative cursor-pointer hover:brightness-110 transition-all"
                            onMouseEnter={() => setHoveredValue({ val: data.a, label: "Ausentes", x: (i * 14.3) + 6, y: pHeight + tHeight + aHeight })}
                            onMouseLeave={() => setHoveredValue(null)}
                          />
                       </div>
                       <span className="text-[10px] font-black text-info-dark/40 dark:text-white/60 uppercase italic">{data.fecha}</span>
                     </div>
                   );
                 })}
              </div>
            </motion.div>
          )}
        </div>

        {/* Acciones Rápidas */}
        <div className="lg:col-span-1">
          {isLoading ? (
            <SkeletonActions />
          ) : (
            <motion.div {...animProps} transition={{ delay: 0.3 }} className={`bg-white dark:bg-dark-white p-8 rounded-[3rem] h-full ${hoverEffect}`}>
              <h3 className="font-black uppercase italic tracking-tighter dark:text-white text-xl">Acciones Rápidas</h3>
              <p className="text-[10px] font-bold text-info-dark/40 dark:text-white/60 uppercase mt-1 mb-8 tracking-widest">Atajos de gestión</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Empleados", sub: "Personal", path: "/empleados", icon: <UserPlus size={24}/>, color: "bg-primary" },
                  { label: "Asistencias", sub: "Control", path: "/asistencias", icon: <Fingerprint size={24}/>, color: "bg-indigo-500" },
                  { label: "Cargos", sub: "Roles", path: "/cargos", icon: <ClipboardList size={24}/>, color: "bg-purple-500" },
                  { label: "Reportes", sub: "Exportar", path: "/reportes", icon: <FileBarChart size={24}/>, color: "bg-success" },
                  { label: "Horarios", sub: "Turnos", path: "/horarios", icon: <CalendarDays size={24}/>, color: "bg-warning" },
                  { label: "Ajustes", sub: "Sistema", path: "/configuracion", icon: <Settings size={24}/>, color: "bg-[#4154f1]" },
                ].map((action, i) => (
                  <Link key={i} to={action.path} className="flex flex-col items-center p-4 rounded-[2rem] hover:bg-light dark:hover:bg-dark-light/10 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                    <div className={`p-4 rounded-2xl ${action.color} text-white shadow-sm`}>
                      {action.icon}
                    </div>
                    <div className="mt-3 text-center">
                      <span className="block text-[9px] font-black uppercase tracking-tighter dark:text-white leading-tight">{action.label}</span>
                      <span className="block text-[7px] font-bold uppercase text-info-dark/40 dark:text-white/40">{action.sub}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}