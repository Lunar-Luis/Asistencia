import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckCircle2, Clock, XCircle, UserPlus, FileBarChart, Settings, CalendarDays, ClipboardList, Fingerprint, AlertCircle } from 'lucide-react';
import { api, type ResumenDashboard, type RegistroAsistencia } from '../services/mockData';

const animProps = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };
const cardStyle = "bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-6 md:p-8 transition-colors";
const actionHoverEffect = "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800/50 cursor-pointer";

// --- SKELETONS ---
const SkeletonStats = () => (
  <motion.div {...animProps} className={`${cardStyle} !p-6 animate-pulse flex flex-col justify-between h-36`}>
    <div className="flex justify-between items-start"><div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800"></div><div className="w-12 h-3 rounded-full bg-slate-200 dark:bg-slate-800"></div></div>
    <div className="mt-auto"><div className="w-16 h-8 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div><div className="w-24 h-3 bg-slate-200 dark:bg-slate-800 rounded"></div></div>
  </motion.div>
);

const SkeletonActivity = () => (
  <motion.div {...animProps} className={`${cardStyle} animate-pulse mb-8`}>
    <div className="flex justify-between items-end mb-8">
      <div><div className="w-48 h-8 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div><div className="w-32 h-3 bg-slate-200 dark:bg-slate-800 rounded"></div></div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex items-center gap-4 p-4 sm:p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50">
          <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0"></div>
          <div className="flex-1"><div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div><div className="w-1/2 h-3 bg-slate-200 dark:bg-slate-800 rounded"></div></div>
        </div>
      ))}
    </div>
  </motion.div>
);

const SkeletonChart = () => (
  <motion.div {...animProps} className={`${cardStyle} relative animate-pulse h-full flex flex-col min-h-[400px]`}>
    <div className="w-56 h-8 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
    <div className="w-40 h-3 bg-slate-200 dark:bg-slate-800 rounded mb-10"></div>
    <div className="relative flex-1 w-full flex items-end justify-between px-2 mt-4">
      {[1,2,3,4,5,6,7].map(i => <div key={i} className="w-10 h-[60%] bg-slate-200 dark:bg-slate-800 rounded-t-xl"></div>)}
    </div>
  </motion.div>
);

const SkeletonActions = () => (
  <motion.div {...animProps} className={`${cardStyle} animate-pulse h-full min-h-[400px]`}>
    <div className="w-40 h-8 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
    <div className="w-24 h-3 bg-slate-200 dark:bg-slate-800 rounded mb-8"></div>
    <div className="grid grid-cols-2 gap-4">
      {[1,2,3,4,5,6].map(i => (
        <div key={i} className="flex flex-col items-center p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50">
          <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 mb-3"></div><div className="w-16 h-3 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
        </div>
      ))}
    </div>
  </motion.div>
);

export default function Inicio() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<ResumenDashboard | null>(null);
  const [actividadReciente, setActividadReciente] = useState<RegistroAsistencia[]>([]);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [resumen, actividad] = await Promise.all([
          api.getDashboardResumen(),
          api.getActividadEnVivo()
        ]);
        setDashboardData(resumen);
        setActividadReciente(actividad);
      } catch (error) {
        console.error("Error cargando dashboard", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = dashboardData ? [
    { title: "Total Empleados", value: dashboardData.stats.totalEmpleados, icon: <Users size={24} />, color: "text-primary", bg: "bg-primary/10", trend: "Activos" },
    { title: "Presentes Hoy", value: dashboardData.stats.presentesHoy, icon: <CheckCircle2 size={24} />, color: "text-emerald-500 dark:text-success", bg: "bg-emerald-50 dark:bg-success/10", trend: "Al día" },
    { title: "Llegadas Tarde", value: dashboardData.stats.tardeHoy, icon: <Clock size={24} />, color: "text-amber-500 dark:text-warning", bg: "bg-amber-50 dark:bg-warning/10", trend: "Atención" },
    { title: "Ausentes Hoy", value: dashboardData.stats.ausentesHoy, icon: <XCircle size={24} />, color: "text-red-500 dark:text-danger", bg: "bg-red-50 dark:bg-danger/10", trend: "Revisar" },
  ] : [];

  const chartData = dashboardData?.chartData || [];
  const maxEmpleados = dashboardData?.stats.totalEmpleados || 10;

  return (
    <main className="pb-8 max-w-[1600px] mx-auto">
      {/* HEADER AJUSTADO: Título más pegado y Enter en la fecha */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6">
        <h1 className="text-[2.2rem] sm:text-[3rem] md:text-[3.5rem] font-black tracking-tighter uppercase italic leading-[0.9] flex items-center gap-2">
          <span className="text-slate-800 dark:text-white">Panel</span>
          <span className="bg-gradient-to-r from-primary via-indigo-900 to-primary dark:via-white bg-[length:200%_auto] bg-clip-text text-transparent inline-block not-italic py-1 px-2">
            Principal
          </span>
        </h1>
        <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] sm:tracking-[0.4em] mt-1 leading-relaxed">
          Resumen Global de Asistencia <br className="block" />12/05/2024
        </p>
      </motion.div>

      {/* CARDS DE ESTADÍSTICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {isLoading ? (
          <><SkeletonStats /> <SkeletonStats /> <SkeletonStats /> <SkeletonStats /></>
        ) : (
          <AnimatePresence>
            {stats.map((stat, i) => (
              <motion.div key={i} {...animProps} transition={{ delay: i * 0.05 }} className={`${cardStyle} !p-6 cursor-default flex flex-col justify-between`}>
                <div className="flex justify-between items-start">
                  <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>{stat.icon}</div>
                  <span className={`text-[10px] font-black uppercase flex items-center gap-1 text-slate-400 tracking-widest`}>
                    {stat.trend}
                  </span>
                </div>
                <div className="mt-5">
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white leading-none mb-1.5">{stat.value}</h2>
                  <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.title}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* ACTIVIDAD RECIENTE */}
      {isLoading ? (
        <SkeletonActivity />
      ) : (
        <motion.div {...animProps} transition={{ delay: 0.15 }} className={`${cardStyle} mb-8`}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-black uppercase italic tracking-tighter dark:text-white text-2xl text-slate-800">Actividad Reciente</h3>
              <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Registros del 12 Nov 2024</p>
            </div>
            <Link to="/asistencias" className="text-xs font-black uppercase text-primary hover:text-indigo-600 dark:hover:text-primary/80 hover:underline italic transition-all flex items-center gap-1 self-start sm:self-end bg-primary/5 dark:bg-primary/10 px-5 py-2.5 rounded-xl">
              Ver historial completo
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {actividadReciente.length > 0 ? actividadReciente.map((user) => {
              const initials = user.empleado.split(' ').map((n: string) => n[0]).join('').substring(0, 2);
              return (
                <div key={user.id} className="flex items-center gap-4 p-4 sm:p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-black text-primary uppercase shrink-0">{initials}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] sm:text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight truncate">{user.empleado}</p>
                    <p className="text-[11px] sm:text-xs text-primary font-bold uppercase italic mt-0.5">{user.hora}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider shrink-0 ${user.estado === 'A tiempo' ? 'bg-emerald-50 text-emerald-600 dark:bg-success/10 dark:text-success' : user.estado === 'Tarde' ? 'bg-amber-50 text-amber-600 dark:bg-warning/10 dark:text-warning' : 'bg-red-50 text-red-500 dark:bg-danger/10 dark:text-danger'}`}>
                    {user.estado === 'A tiempo' ? <CheckCircle2 size={14}/> : user.estado === 'Tarde' ? <AlertCircle size={14}/> : <XCircle size={14}/>}
                    {user.estado}
                  </span>
                </div>
              );
            }) : (
              <p className="text-slate-500 text-sm font-bold p-4 col-span-full">No hay actividad reciente hoy.</p>
            )}
          </div>
        </motion.div>
      )}

      {/* GRÁFICA SEMANAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <SkeletonChart />
            ) : (
              <motion.div {...animProps} transition={{ delay: 0.2 }} className={`${cardStyle} relative h-full flex flex-col min-h-[420px]`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                  <div>
                    <h3 className="font-black uppercase italic tracking-tighter dark:text-white text-2xl text-slate-800">Tendencia Semanal</h3>
                    <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Asistencia de los últimos 7 días</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">A tiempo</span></div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-400"></span><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tarde</span></div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-400"></span><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ausentes</span></div>
                  </div>
                </div>
                
                <div className="relative flex-1 w-full flex items-end justify-between mt-4 pb-8 border-b border-slate-100 dark:border-slate-800/50">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
                    {[100, 75, 50, 25, 0].map(p => (
                      <div key={p} className="w-full border-t border-dashed border-slate-200 dark:border-slate-800/80 flex items-center">
                        <span className="absolute -left-1 sm:-left-4 -translate-x-full text-[9px] font-bold text-slate-400">{Math.round((p/100)*maxEmpleados)}</span>
                      </div>
                    ))}
                  </div>

                  {chartData.map((data, i) => {
                    const h1 = (data.aTiempo / maxEmpleados) * 100;
                    const h2 = (data.tarde / maxEmpleados) * 100;
                    const h3 = (data.ausentes / maxEmpleados) * 100;
                    const isHovered = hoveredBar === i;

                    return (
                      <div 
                        key={i} 
                        className="relative w-[12%] sm:w-[10%] h-full flex flex-col justify-end items-center group cursor-pointer z-10"
                        onMouseEnter={() => setHoveredBar(i)}
                        onMouseLeave={() => setHoveredBar(null)}
                      >
                        <AnimatePresence>
                          {isHovered && (
                            <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.9 }}
                              className="absolute -top-20 bg-slate-800 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black px-4 py-3 rounded-xl shadow-2xl whitespace-nowrap z-50 flex flex-col items-center pointer-events-none"
                            >
                              <span className="text-[9px] text-slate-400 mb-1">{data.dia}</span>
                              <div className="flex gap-3">
                                <div className="flex flex-col items-center"><span className="text-emerald-400 text-lg leading-none">{data.aTiempo}</span><span>OK</span></div>
                                <div className="flex flex-col items-center"><span className="text-amber-400 text-lg leading-none">{data.tarde}</span><span>Tardes</span></div>
                                <div className="flex flex-col items-center"><span className="text-red-400 text-lg leading-none">{data.ausentes}</span><span>Faltas</span></div>
                              </div>
                              <div className="w-3 h-3 bg-slate-800 dark:bg-white rotate-45 absolute -bottom-1.5"></div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="w-full h-full flex items-end justify-center gap-[2px] sm:gap-1">
                          <motion.div initial={{ height: 0 }} animate={{ height: `${h1}%` }} transition={{ type: "spring", bounce: 0.3, delay: i * 0.05 }}
                            className="w-1/3 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm sm:rounded-t-md hover:brightness-110 min-h-[4px]" />
                          <motion.div initial={{ height: 0 }} animate={{ height: `${h2}%` }} transition={{ type: "spring", bounce: 0.3, delay: 0.1 + (i * 0.05) }}
                            className="w-1/3 bg-gradient-to-t from-amber-500 to-amber-300 rounded-t-sm sm:rounded-t-md hover:brightness-110 min-h-[4px]" />
                          <motion.div initial={{ height: 0 }} animate={{ height: `${h3}%` }} transition={{ type: "spring", bounce: 0.3, delay: 0.2 + (i * 0.05) }}
                            className="w-1/3 bg-gradient-to-t from-red-500 to-red-400 rounded-t-sm sm:rounded-t-md hover:brightness-110 min-h-[4px]" />
                        </div>

                        <span className={`absolute -bottom-8 text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-colors ${isHovered ? 'text-primary' : 'text-slate-400'}`}>
                          {data.dia.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <SkeletonActions />
            ) : (
              <motion.div {...animProps} transition={{ delay: 0.3 }} className={`${cardStyle} h-full min-h-[420px]`}>
                <div className="mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-black uppercase italic tracking-tighter dark:text-white text-2xl text-slate-800">Acciones Rápidas</h3>
                  <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mt-1 tracking-widest">Atajos de gestión</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Empleados", sub: "Personal", path: "/empleados", icon: <UserPlus size={24}/>, color: "bg-primary" },
                    { label: "Asistencias", sub: "Control", path: "/asistencias", icon: <Fingerprint size={24}/>, color: "bg-indigo-500" },
                    { label: "Cargos", sub: "Roles", path: "/cargos", icon: <ClipboardList size={24}/>, color: "bg-purple-500" },
                    { label: "Reportes", sub: "Exportar", path: "/reportes", icon: <FileBarChart size={24}/>, color: "bg-emerald-500 dark:bg-success" },
                    { label: "Horarios", sub: "Turnos", path: "/horarios", icon: <CalendarDays size={24}/>, color: "bg-amber-500 dark:bg-warning" },
                    { label: "Ajustes", sub: "Sistema", path: "/configuracion", icon: <Settings size={24}/>, color: "bg-slate-700 dark:bg-slate-600" },
                  ].map((action, i) => (
                    <Link key={i} to={action.path} className={`flex flex-col items-center p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 ${actionHoverEffect}`}>
                      <div className={`p-3.5 sm:p-4 rounded-2xl ${action.color} text-white shadow-sm mb-3 sm:mb-4`}>{action.icon}</div>
                      <div className="text-center">
                        <span className="block text-[10px] sm:text-[11px] font-black uppercase tracking-widest dark:text-white leading-tight mb-1">{action.label}</span>
                        <span className="block text-[9px] sm:text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">{action.sub}</span>
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