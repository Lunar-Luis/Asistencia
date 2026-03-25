import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  CalendarDays, Search, User, CheckCircle2, 
  AlertCircle, XCircle, Clock, Cpu, LogIn, LogOut, Activity
} from 'lucide-react';

// ==========================================
// ESTILOS GLOBALES CORPORATIVOS (CMBT Design System)
// ==========================================
const animProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

const cardStyle = "bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-6 md:p-8 transition-colors";
const inputStyle = "w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none text-[11px] font-bold text-slate-700 dark:text-white border border-transparent focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer";
const optionClassName = "bg-white dark:bg-slate-800 text-slate-700 dark:text-white font-bold py-2"; // <-- Mejorado para móvil

// ==========================================
// SKELETON DE ALTA FIDELIDAD
// ==========================================
const SkeletonLayout = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 space-y-6">
      <motion.div {...animProps} className={`${cardStyle} animate-pulse`}>
        <div className="w-40 h-6 bg-slate-200 dark:bg-slate-800 rounded mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
      </motion.div>
      
      <motion.div {...animProps} transition={{ delay: 0.1 }} className={`${cardStyle} animate-pulse`}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
          <div>
            <div className="w-48 h-6 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
            <div className="w-32 h-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
          <div className="w-full sm:w-48 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
        
        <div className="w-full h-10 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4"></div>
        
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="w-full h-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center px-4 gap-4">
               <div className="w-32 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
               <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded mx-auto"></div>
               <div className="w-16 h-6 bg-slate-200 dark:bg-slate-800 rounded-full ml-auto"></div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>

    <div className="lg:col-span-1">
      <motion.div {...animProps} transition={{ delay: 0.2 }} className={`${cardStyle} h-full flex flex-col animate-pulse`}>
        <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="w-32 h-6 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
            <div className="w-24 h-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
        
        <div className="space-y-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="pl-6 border-l-2 border-slate-100 dark:border-slate-800 relative">
              <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 absolute -left-[9px] top-1"></div>
              <div className="w-full h-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex flex-col justify-between">
                 <div className="w-3/4 h-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
                 <div className="w-1/2 h-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);

// ==========================================
// INTERFACES Y DATOS MOCK
// ==========================================
interface Asistencia {
  id: number;
  empleado: string;
  cargo: string;
  fecha: string;
  hora: string;
  tipo: 'Entrada' | 'Salida';
  estado: 'A tiempo' | 'Tarde' | 'Ausente';
}

export default function Asistencias() {
  const [isLoading, setIsLoading] = useState(true);
  const [historial, setHistorial] = useState<Asistencia[]>([]);
  const [enVivo, setEnVivo] = useState<Asistencia[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHistorial([
        { id: 1, empleado: "Ana Rojas", cargo: "Recursos Humanos", fecha: "24 Mar 2026", hora: "07:55 AM", tipo: "Entrada", estado: "A tiempo" },
        { id: 2, empleado: "Luis Medina", cargo: "Desarrollador", fecha: "24 Mar 2026", hora: "08:15 AM", tipo: "Entrada", estado: "Tarde" },
        { id: 3, empleado: "Carlos Pinto", cargo: "Operario", fecha: "24 Mar 2026", hora: "---", tipo: "Entrada", estado: "Ausente" },
        { id: 4, empleado: "María López", cargo: "Administradora", fecha: "23 Mar 2026", hora: "17:05 PM", tipo: "Salida", estado: "A tiempo" },
      ]);

      setEnVivo([
        { id: 101, empleado: "Anurbe Martínez", cargo: "Administrador", fecha: "Hoy", hora: "Hace 2 min", tipo: "Entrada", estado: "A tiempo" },
        { id: 102, empleado: "Andrea Torres", cargo: "Contralora", fecha: "Hoy", hora: "Hace 15 min", tipo: "Entrada", estado: "Tarde" },
        { id: 103, empleado: "Juan Castro", cargo: "Seguridad", fecha: "Hoy", hora: "Hace 1 hora", tipo: "Salida", estado: "A tiempo" },
      ]);
      
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="pb-8 max-w-[1600px] mx-auto">
      {/* --- HEADER CORREGIDO PARA MÓVIL --- */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
        <h1 className="text-[1.8rem] sm:text-[2.5rem] md:text-[3.2rem] font-black tracking-tighter uppercase italic leading-[1.1] flex flex-wrap items-center gap-x-2"> {/* flex-wrap y tamaños ajustados */}
          <span className="text-slate-800 dark:text-white">Control de</span>
          <span className="bg-gradient-to-r from-primary via-indigo-900 to-primary dark:via-white bg-[length:200%_auto] bg-clip-text text-transparent inline-block NOT-italic py-1">
            Asistencia
          </span>
        </h1>
        <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] sm:tracking-[0.4em] mt-2">
          Monitorea y filtra la asistencia en tiempo real
        </p>
      </motion.div>

      {isLoading ? (
        <SkeletonLayout />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ========================================== */}
          {/* COLUMNA IZQUIERDA (Filtros y Tabla)        */}
          {/* ========================================== */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* TARJETA DE FILTROS */}
            <motion.div {...animProps} className={cardStyle}>
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                <CalendarDays className="text-primary" size={24} />
                <h2 className="font-black uppercase italic tracking-tighter dark:text-white text-xl">Filtros de Búsqueda</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="relative">
                  <label className="text-[9px] font-black uppercase text-primary mb-2 block ml-2">Fecha</label>
                  <div className="relative">
                    <CalendarDays size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
                    <input type="date" className={inputStyle} defaultValue="2026-03-24" />
                  </div>
                </div>
                
                <div className="relative">
                  <label className="text-[9px] font-black uppercase text-primary mb-2 block ml-2">Empleado</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
                    <select className={inputStyle}>
                      <option value="" className={optionClassName}>Todos los empleados</option>
                      <option value="1" className={optionClassName}>Anurbe Martínez</option>
                      <option value="2" className={optionClassName}>Andrea Torres</option>
                    </select>
                  </div>
                </div>

                <div className="relative">
                  <label className="text-[9px] font-black uppercase text-primary mb-2 block ml-2">Estado</label>
                  <div className="relative">
                    <Activity size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
                    <select className={inputStyle}>
                      <option value="all" className={optionClassName}>Todos los estados</option>
                      <option value="ontime" className={optionClassName}>A tiempo</option>
                      <option value="late" className={optionClassName}>Tarde</option>
                      <option value="absent" className={optionClassName}>Ausente</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* TARJETA DE LA TABLA (HISTORIAL) */}
            <motion.div {...animProps} transition={{ delay: 0.1 }} className={cardStyle}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="font-black uppercase italic tracking-tighter dark:text-white text-xl text-slate-800">Registros de Asistencia</h2>
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                    {historial.length} registros encontrados
                  </p>
                </div>
                <div className="relative w-full sm:w-[250px]">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
                  <input type="text" placeholder="Buscar..." className={`${inputStyle} cursor-text`} />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 rounded-l-xl">Empleado</th>
                      <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Fecha y Hora</th>
                      <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center">Tipo</th>
                      <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-right rounded-r-xl">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                    <AnimatePresence>
                      {historial.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                          <td className="p-4">
                            <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tight">{item.empleado}</p>
                            <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5">{item.cargo}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-[11px] font-bold text-slate-700 dark:text-white">{item.fecha}</p>
                            <p className="text-[10px] font-bold text-primary italic mt-0.5 flex items-center gap-1">
                              <Clock size={10} /> {item.hora}
                            </p>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase ${item.tipo === 'Entrada' ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                              {item.tipo === 'Entrada' ? <LogIn size={12}/> : <LogOut size={12}/>} {item.tipo}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <span className={`inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-wider ${item.estado === 'A tiempo' ? 'text-emerald-600 bg-emerald-50 dark:text-success dark:bg-success/10' : item.estado === 'Tarde' ? 'text-amber-600 bg-amber-50 dark:text-warning dark:bg-warning/10' : 'text-red-500 bg-red-50 dark:text-danger dark:bg-danger/10'}`}>
                              {item.estado === 'A tiempo' ? <CheckCircle2 size={12}/> : item.estado === 'Tarde' ? <AlertCircle size={12}/> : <XCircle size={12}/>}
                              {item.estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* ========================================== */}
          {/* COLUMNA DERECHA (Live Attendance Sidebar)  */}
          {/* ========================================== */}
          <div className="lg:col-span-1">
            <motion.div {...animProps} transition={{ delay: 0.2 }} className={`${cardStyle} h-full flex flex-col`}>
              
              {/* Cabecera del Live Feed */}
              <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="font-black uppercase italic tracking-tighter dark:text-white text-lg text-slate-800">Monitor en Vivo</h2>
                  <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Lecturas NFC recientes</p>
                </div>
                <div className="bg-emerald-50 dark:bg-success/10 text-emerald-600 dark:text-success p-2 rounded-xl flex items-center justify-center relative shadow-sm border border-emerald-100 dark:border-success/20">
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 dark:bg-success rounded-full animate-ping"></span>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 dark:bg-success rounded-full"></span>
                  <Cpu size={20} />
                </div>
              </div>

              {/* Lista de Actividad (Timeline) */}
              <div className="flex-1 space-y-6">
                <AnimatePresence>
                  {enVivo.map((lectura) => (
                    <motion.div 
                      key={lectura.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="relative pl-6 border-l-2 border-slate-100 dark:border-slate-800"
                    >
                      {/* Punto del Timeline */}
                      <span className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 ${lectura.estado === 'A tiempo' ? 'bg-emerald-500 dark:bg-success' : lectura.estado === 'Tarde' ? 'bg-amber-500 dark:bg-warning' : 'bg-red-500 dark:bg-danger'}`}></span>
                      
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent dark:border-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700 cursor-default">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tight">{lectura.empleado}</p>
                          <span className="text-[9px] font-black italic text-primary">{lectura.hora}</span>
                        </div>
                        <div className="flex justify-between items-end mt-1">
                          <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase">{lectura.cargo}</p>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider ${lectura.estado === 'A tiempo' ? 'bg-emerald-50 dark:bg-success/10 text-emerald-600 dark:text-success' : 'bg-amber-50 dark:bg-warning/10 text-amber-600 dark:text-warning'}`}>
                            {lectura.tipo} - {lectura.estado}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 dark:bg-success rounded-full animate-pulse"></span>
                  Conectado al Lector Principal
                </p>
              </div>

            </motion.div>
          </div>

        </div>
      )}
    </main>
  );
}