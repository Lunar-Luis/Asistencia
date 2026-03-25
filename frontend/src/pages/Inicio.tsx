import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, CheckCircle2, Clock, XCircle,
  TrendingUp, UserPlus, FileBarChart,
  Settings, CalendarDays,
  ClipboardList, Fingerprint, AlertCircle
} from 'lucide-react';

// ==========================================
// ESTILOS GLOBALES CORPORATIVOS (CMBT Design System)
// ==========================================
const animProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

// Tarjetas adaptadas al Modo Oscuro del AdminLayout (bg-slate-900)
const cardStyle = "bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-6 md:p-8 transition-colors";
const actionHoverEffect = "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800/50 cursor-pointer";

// ==========================================
// COMPONENTES SKELETON
// ==========================================
const SkeletonStats = () => (
  <motion.div {...animProps} className={`${cardStyle} animate-pulse`}>
    <div className="flex justify-between items-start">
      <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
      <div className="w-12 h-4 rounded-full bg-slate-200 dark:bg-slate-800"></div>
    </div>
    <div className="mt-6">
      <div className="w-24 h-3 bg-slate-200 dark:bg-slate-800 rounded mb-3"></div>
      <div className="w-16 h-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
    </div>
  </motion.div>
);

const SkeletonActivity = () => (
  <motion.div {...animProps} className={`${cardStyle} animate-pulse mb-8`}>
    <div className="flex justify-between items-end mb-8">
      <div>
        <div className="w-48 h-8 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
        <div className="w-32 h-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex items-center gap-4 p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50">
          <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0"></div>
          <div className="flex-1">
            <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
            <div className="w-1/2 h-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const SkeletonChart = () => (
  <motion.div {...animProps} className={`${cardStyle} relative animate-pulse h-full flex flex-col min-h-[350px]`}>
    <div className="flex flex-col sm:flex-row justify-between items-start mb-10 gap-4">
      <div className="w-full sm:w-auto">
        <div className="w-56 h-8 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
        <div className="w-40 h-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
      <div className="w-full sm:w-48 h-8 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
    </div>
    <div className="relative flex-1 w-full flex items-end justify-between px-2 mt-4">
      {[1,2,3,4,5,6,7].map(i => (
        <div key={i} className="w-[11%] h-[60%] bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
      ))}
    </div>
  </motion.div>
);

const SkeletonActions = () => (
  <motion.div {...animProps} className={`${cardStyle} animate-pulse h-full min-h-[350px]`}>
    <div className="w-40 h-8 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
    <div className="w-24 h-3 bg-slate-200 dark:bg-slate-800 rounded mb-8"></div>
    <div className="grid grid-cols-2 gap-4">
      {[1,2,3,4,5,6].map(i => (
        <div key={i} className="flex flex-col items-center p-4 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50">
          <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-800 mb-3"></div>
          <div className="w-16 h-3 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
          <div className="w-10 h-2 bg-slate-200 dark:bg-slate-800 rounded"></div>
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
    <main className="pb-8 max-w-[1600px] mx-auto">
      
      {/* --- HEADER --- */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
        <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3.2rem] font-black tracking-tighter uppercase italic leading-[1.1] flex items-center gap-2">
          <span className="text-slate-800 dark:text-white">Panel</span>
          <span className="bg-gradient-to-r from-primary via-indigo-900 to-primary dark:via-white bg-[length:200%_auto] bg-clip-text text-transparent inline-block NOT-italic py-1">
            CMBT
          </span>
        </h1>
        <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] sm:tracking-[0.4em] mt-2">
          Resumen Global de Asistencia
        </p>
      </motion.div>

      {/* --- 1. ESTADÍSTICAS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoading ? (
          <>
            <SkeletonStats /> <SkeletonStats /> <SkeletonStats /> <SkeletonStats />
          </>
        ) : (
          <AnimatePresence>
            {stats.map((stat, i) => (
              <motion.div key={i} {...animProps} transition={{ delay: i * 0.05 }}
                className={`${cardStyle} cursor-default`}
              >
                <div className="flex justify-between items-start">
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>{stat.icon}</div>
                  <span className={`text-[10px] font-black flex items-center gap-1 ${stat.color} tracking-widest`}>
                    <TrendingUp size={14} /> {stat.trend}
                  </span>
                </div>
                <div className="mt-6">
                  <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.title}</p>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white mt-1">{stat.value}</h2>
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
        <motion.div {...animProps} transition={{ delay: 0.15 }} className={`${cardStyle} mb-8`}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-black uppercase italic tracking-tighter dark:text-white text-xl text-slate-800">Actividad Reciente</h3>
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Últimos registros nfc detectados</p>
            </div>
            <Link to="/asistencias" className="text-[10px] font-black uppercase text-primary hover:text-indigo-600 dark:hover:text-primary/80 hover:underline italic transition-all flex items-center gap-1 self-start sm:self-end bg-primary/5 dark:bg-primary/10 px-4 py-2 rounded-xl">
              Ver historial completo
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Sebastián López", time: "08:00 AM", status: "A tiempo", icon: <CheckCircle2 size={12}/>, img: "SL", color: "text-emerald-600 dark:text-success", bg: "bg-emerald-50 dark:bg-success/10" },
              { name: "Andrea Pérez", time: "08:15 AM", status: "Tarde", icon: <AlertCircle size={12}/>, img: "AP", color: "text-amber-600 dark:text-warning", bg: "bg-amber-50 dark:bg-warning/10" },
              { name: "Juan Castro", time: "---", status: "Ausente", icon: <XCircle size={12}/>, img: "JC", color: "text-red-500 dark:text-danger", bg: "bg-red-50 dark:bg-danger/10" },
              { name: "Anurbe Dev", time: "07:55 AM", status: "A tiempo", icon: <CheckCircle2 size={12}/>, img: "AD", color: "text-emerald-600 dark:text-success", bg: "bg-emerald-50 dark:bg-success/10" },
            ].map((user, i) => (
              <div key={i} className="flex items-center gap-4 p-4 sm:p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-black text-primary uppercase shrink-0">{user.img}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] sm:text-xs font-black text-slate-800 dark:text-white uppercase tracking-tight truncate">{user.name}</p>
                  <p className="text-[9px] sm:text-[10px] text-primary font-bold uppercase italic mt-0.5">{user.time}</p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider shrink-0 ${user.bg} ${user.color}`}>
                  {user.icon} {user.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* --- 3. SECCIÓN INFERIOR --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Gráfica */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <SkeletonChart />
            ) : (
              <motion.div {...animProps} transition={{ delay: 0.2 }} className={`${cardStyle} relative h-full flex flex-col min-h-[350px]`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
                  <div>
                    <h3 className="font-black uppercase italic tracking-tighter dark:text-white text-xl text-slate-800">Resumen Semanal</h3>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Monitoreo interactivo de asistencia</p>
                  </div>
                  <div className="flex flex-wrap gap-3 sm:gap-4 items-center bg-slate-50 dark:bg-slate-800/50 p-3 px-4 sm:px-5 rounded-2xl w-full sm:w-auto">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-success"></span><span className="text-[8px] sm:text-[9px] font-black dark:text-white uppercase tracking-widest">Presente</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-warning"></span><span className="text-[8px] sm:text-[9px] font-black dark:text-white uppercase tracking-widest">Tarde</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-danger"></span><span className="text-[8px] sm:text-[9px] font-black dark:text-white uppercase tracking-widest">Ausente</span></div>
                  </div>
                </div>
                
                <div className="relative flex-1 w-full flex items-end justify-between px-1 sm:px-2 mt-4 min-h-[200px] sm:min-h-[250px]">
                  <AnimatePresence>
                    {hoveredValue && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute z-50 bg-slate-800 dark:bg-white text-white dark:text-slate-900 text-[9px] sm:text-[10px] font-black px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-xl pointer-events-none uppercase italic flex flex-col items-center"
                        style={{ left: `${hoveredValue.x}%`, bottom: `${hoveredValue.y + 10}%`, transform: 'translateX(-50%)' }}
                      >
                        <span className="opacity-70 text-[7px] sm:text-[8px] tracking-widest mb-0.5">{hoveredValue.label}</span>
                        <span>{hoveredValue.val} EMPLEADOS</span>
                        <div className="w-2.5 h-2.5 bg-slate-800 dark:bg-white rotate-45 absolute -bottom-1"></div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {chartData.map((data, i) => {
                    const total = 142;
                    const pHeight = (data.p / total) * 100;
                    const tHeight = (data.t / total) * 100;
                    const aHeight = (data.a / total) * 100;

                    return (
                      <div key={i} className="w-[11%] h-full flex flex-col justify-end items-center gap-2 sm:gap-4 group">
                        <div className="w-full flex flex-col-reverse h-full bg-slate-50 dark:bg-slate-800/50 rounded-xl sm:rounded-2xl relative overflow-hidden transition-colors">
                            <motion.div initial={{height:0}} animate={{height: `${pHeight}%`}} transition={{ duration: 0.8, delay: 0.1 }}
                              className="bg-success w-full relative cursor-pointer hover:brightness-110 transition-all border-t border-white/10 dark:border-black/10"
                              onMouseEnter={() => setHoveredValue({ val: data.p, label: "Presentes", x: (i * 14.3) + 6, y: pHeight })}
                              onMouseLeave={() => setHoveredValue(null)}
                            />
                            <motion.div initial={{height:0}} animate={{height: `${tHeight}%`}} transition={{ duration: 0.8, delay: 0.2 }}
                              className="bg-warning w-full relative cursor-pointer hover:brightness-110 transition-all border-t border-white/10 dark:border-black/10"
                              onMouseEnter={() => setHoveredValue({ val: data.t, label: "Tarde", x: (i * 14.3) + 6, y: pHeight + tHeight })}
                              onMouseLeave={() => setHoveredValue(null)}
                            />
                            <motion.div initial={{height:0}} animate={{height: `${aHeight}%`}} transition={{ duration: 0.8, delay: 0.3 }}
                              className="bg-danger w-full relative cursor-pointer hover:brightness-110 transition-all"
                              onMouseEnter={() => setHoveredValue({ val: data.a, label: "Ausentes", x: (i * 14.3) + 6, y: pHeight + tHeight + aHeight })}
                              onMouseLeave={() => setHoveredValue(null)}
                            />
                        </div>
                        <span className="text-[7px] sm:text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{data.fecha}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Acciones Rápidas */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <SkeletonActions />
            ) : (
              <motion.div {...animProps} transition={{ delay: 0.3 }} className={`${cardStyle} h-full min-h-[350px]`}>
                <div className="mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-black uppercase italic tracking-tighter dark:text-white text-xl text-slate-800">Acciones Rápidas</h3>
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-1 tracking-widest">Atajos de gestión</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Empleados", sub: "Personal", path: "/empleados", icon: <UserPlus size={20}/>, color: "bg-primary" },
                    { label: "Asistencias", sub: "Control", path: "/asistencias", icon: <Fingerprint size={20}/>, color: "bg-indigo-500" },
                    { label: "Cargos", sub: "Roles", path: "/cargos", icon: <ClipboardList size={20}/>, color: "bg-purple-500" },
                    { label: "Reportes", sub: "Exportar", path: "/reportes", icon: <FileBarChart size={20}/>, color: "bg-success" },
                    { label: "Horarios", sub: "Turnos", path: "/horarios", icon: <CalendarDays size={20}/>, color: "bg-warning" },
                    { label: "Ajustes", sub: "Sistema", path: "/configuracion", icon: <Settings size={20}/>, color: "bg-slate-700 dark:bg-slate-600" },
                  ].map((action, i) => (
                    <Link key={i} to={action.path} className={`flex flex-col items-center p-3 sm:p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 ${actionHoverEffect}`}>
                      <div className={`p-3 sm:p-3.5 rounded-2xl ${action.color} text-white shadow-sm mb-2 sm:mb-3`}>
                        {action.icon}
                      </div>
                      <div className="text-center">
                        <span className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest dark:text-white leading-tight mb-1">{action.label}</span>
                        <span className="block text-[7px] sm:text-[8px] font-bold uppercase text-slate-400 dark:text-slate-500">{action.sub}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}