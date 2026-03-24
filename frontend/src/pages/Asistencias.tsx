import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  CalendarDays, Search, User, CheckCircle2, 
  AlertCircle, XCircle, Clock, Cpu, LogIn, LogOut, Activity
} from 'lucide-react';

// ==========================================
// ESTILOS GLOBALES CORPORATIVOS
// ==========================================
const animProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

const cardStyle = "bg-white dark:bg-dark-white rounded-[2.5rem] border border-transparent dark:border-dark-light/5 shadow-sm hover:shadow-md transition-shadow duration-300";
const inputStyle = "w-full pl-10 pr-4 py-3 bg-light/50 dark:bg-dark-light/5 rounded-2xl outline-none text-xs font-bold dark:text-white border border-transparent focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all";

// ==========================================
// SKELETON DE ALTA FIDELIDAD (Igual al contenido real)
// ==========================================
const SkeletonLayout = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 space-y-6">
      
      {/* SKELETON: Tarjeta de Filtros */}
      <motion.div {...animProps} className={`${cardStyle} p-6 md:p-8 animate-pulse`}>
        <div className="w-40 h-6 bg-light/50 dark:bg-dark-light/10 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-12 bg-light/50 dark:bg-dark-light/10 rounded-2xl"></div>
          <div className="h-12 bg-light/50 dark:bg-dark-light/10 rounded-2xl"></div>
          <div className="h-12 bg-light/50 dark:bg-dark-light/10 rounded-2xl"></div>
        </div>
      </motion.div>
      
      {/* SKELETON: Tarjeta de Tabla */}
      <motion.div {...animProps} transition={{ delay: 0.1 }} className={`${cardStyle} p-6 md:p-8 animate-pulse`}>
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="w-48 h-6 bg-light/50 dark:bg-dark-light/10 rounded mb-2"></div>
            <div className="w-32 h-3 bg-light/50 dark:bg-dark-light/10 rounded"></div>
          </div>
          <div className="w-48 h-10 bg-light/50 dark:bg-dark-light/10 rounded-xl"></div>
        </div>
        
        {/* Cabecera de tabla falsa */}
        <div className="w-full h-10 bg-light/50 dark:bg-dark-light/10 rounded-xl mb-4"></div>
        
        {/* Filas falsas */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="w-full h-16 bg-light/30 dark:bg-dark-light/5 rounded-2xl flex items-center px-4 gap-4">
               <div className="w-32 h-4 bg-light/50 dark:bg-dark-light/10 rounded"></div>
               <div className="w-24 h-4 bg-light/50 dark:bg-dark-light/10 rounded mx-auto"></div>
               <div className="w-16 h-6 bg-light/50 dark:bg-dark-light/10 rounded-full ml-auto"></div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>

    {/* SKELETON: Barra lateral en vivo (Sidebar) */}
    <div className="lg:col-span-1">
      <motion.div {...animProps} transition={{ delay: 0.2 }} className={`${cardStyle} p-6 md:p-8 h-full flex flex-col animate-pulse`}>
        <div className="flex justify-between items-start mb-8 pb-6 border-b border-light dark:border-dark-light/5">
          <div>
            <div className="w-32 h-6 bg-light/50 dark:bg-dark-light/10 rounded mb-2"></div>
            <div className="w-24 h-3 bg-light/50 dark:bg-dark-light/10 rounded"></div>
          </div>
          <div className="w-10 h-10 bg-light/50 dark:bg-dark-light/10 rounded-xl"></div>
        </div>
        
        {/* Timeline falso */}
        <div className="space-y-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="pl-6 border-l-2 border-light dark:border-dark-light/10 relative">
              <div className="w-4 h-4 rounded-full bg-light/50 dark:bg-dark-light/10 absolute -left-[9px] top-1"></div>
              <div className="w-full h-20 bg-light/30 dark:bg-dark-light/5 rounded-2xl p-4 flex flex-col justify-between">
                 <div className="w-3/4 h-3 bg-light/50 dark:bg-dark-light/10 rounded"></div>
                 <div className="w-1/2 h-3 bg-light/50 dark:bg-dark-light/10 rounded"></div>
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
      // Datos para la tabla principal (Historial)
      setHistorial([
        { id: 1, empleado: "Ana Rojas", cargo: "Recursos Humanos", fecha: "24 Mar 2026", hora: "07:55 AM", tipo: "Entrada", estado: "A tiempo" },
        { id: 2, empleado: "Luis Medina", cargo: "Desarrollador", fecha: "24 Mar 2026", hora: "08:15 AM", tipo: "Entrada", estado: "Tarde" },
        { id: 3, empleado: "Carlos Pinto", cargo: "Operario", fecha: "24 Mar 2026", hora: "---", tipo: "Entrada", estado: "Ausente" },
        { id: 4, empleado: "María López", cargo: "Administradora", fecha: "23 Mar 2026", hora: "17:05 PM", tipo: "Salida", estado: "A tiempo" },
      ]);

      // Datos para el sidebar (En vivo)
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
    <main className="mt-[1.4rem] pr-4 pb-8">
      {/* --- HEADER --- */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
        <h1 className="text-[2.5rem] md:text-[3.2rem] font-black tracking-tighter uppercase italic leading-[1.1] flex items-center gap-2">
          <span className="text-info-dark dark:text-white">Control de</span>
          <span className="bg-gradient-to-r from-primary via-indigo-900 to-primary dark:via-white bg-[length:200%_auto] bg-clip-text text-transparent inline-block NOT-italic py-1">
            Asistencia
          </span>
        </h1>
        <p className="text-[10px] font-bold text-info-dark/40 dark:text-white/60 uppercase tracking-[0.4em] mt-2">
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
            <motion.div {...animProps} className={`${cardStyle} p-6 md:p-8`}>
              <div className="flex items-center gap-2 mb-6">
                <CalendarDays className="text-primary" size={20} />
                <h2 className="font-black uppercase italic tracking-tighter dark:text-white text-lg">Filtros de Búsqueda</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <label className="text-[9px] font-black uppercase text-primary mb-2 block ml-2">Fecha</label>
                  <div className="relative">
                    <CalendarDays size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-info-dark/40" />
                    <input type="date" className={inputStyle} defaultValue="2026-03-24" />
                  </div>
                </div>
                
                <div className="relative">
                  <label className="text-[9px] font-black uppercase text-primary mb-2 block ml-2">Empleado</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-info-dark/40" />
                    <select className={`${inputStyle} appearance-none`}>
                      <option value="">Todos los empleados</option>
                      <option value="1">Anurbe Martínez</option>
                      <option value="2">Andrea Torres</option>
                    </select>
                  </div>
                </div>

                <div className="relative">
                  <label className="text-[9px] font-black uppercase text-primary mb-2 block ml-2">Estado</label>
                  <div className="relative">
                    <Activity size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-info-dark/40" />
                    <select className={`${inputStyle} appearance-none`}>
                      <option value="all">Todos los estados</option>
                      <option value="ontime">A tiempo</option>
                      <option value="late">Tarde</option>
                      <option value="absent">Ausente</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* TARJETA DE LA TABLA (HISTORIAL) */}
            <motion.div {...animProps} transition={{ delay: 0.1 }} className={`${cardStyle} p-6 md:p-8`}>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="font-black uppercase italic tracking-tighter dark:text-white text-xl">Registros de Asistencia</h2>
                  <p className="text-[10px] font-bold text-info-dark/40 dark:text-white/40 uppercase tracking-widest mt-1">
                    {historial.length} registros encontrados
                  </p>
                </div>
                <div className="relative w-[200px]">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-info-dark/40" />
                  <input type="text" placeholder="Buscar..." className={`${inputStyle} py-2 text-[10px]`} />
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-100 dark:border-dark-light/5 rounded-2xl">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead className="bg-slate-50 dark:bg-dark-light/5 border-b border-slate-100 dark:border-dark-light/5">
                    <tr>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-info-dark/60 dark:text-white/40">Empleado</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-info-dark/60 dark:text-white/40">Fecha y Hora</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-info-dark/60 dark:text-white/40 text-center">Tipo</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-info-dark/60 dark:text-white/40 text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-dark-light/5">
                    <AnimatePresence>
                      {historial.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-dark-light/10 transition-colors group">
                          <td className="p-4">
                            <p className="text-xs font-black text-info-dark dark:text-white uppercase tracking-tight">{item.empleado}</p>
                            <p className="text-[9px] font-bold text-info-dark/40 dark:text-white/40 uppercase mt-0.5">{item.cargo}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-xs font-bold text-info-dark dark:text-white">{item.fecha}</p>
                            <p className="text-[10px] font-bold text-primary italic mt-0.5 flex items-center gap-1">
                              <Clock size={10} /> {item.hora}
                            </p>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase ${item.tipo === 'Entrada' ? 'bg-primary/10 text-primary' : 'bg-light text-info-dark dark:bg-white/10 dark:text-white'}`}>
                              {item.tipo === 'Entrada' ? <LogIn size={12}/> : <LogOut size={12}/>} {item.tipo}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${item.estado === 'A tiempo' ? 'text-success' : item.estado === 'Tarde' ? 'text-warning' : 'text-danger'}`}>
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
            <motion.div {...animProps} transition={{ delay: 0.2 }} className={`${cardStyle} p-6 md:p-8 h-full flex flex-col`}>
              
              {/* Cabecera del Live Feed */}
              <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100 dark:border-dark-light/5">
                <div>
                  <h2 className="font-black uppercase italic tracking-tighter dark:text-white text-lg">Monitor en Vivo</h2>
                  <p className="text-[9px] font-bold text-info-dark/40 dark:text-white/40 uppercase tracking-widest mt-1">Lecturas NFC recientes</p>
                </div>
                <div className="bg-success/10 text-success p-2 rounded-xl flex items-center justify-center relative">
                  <span className="absolute top-1 right-1 w-2 h-2 bg-success rounded-full animate-ping"></span>
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
                      className="relative pl-6 border-l-2 border-slate-100 dark:border-dark-light/10"
                    >
                      {/* Punto del Timeline */}
                      <span className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white dark:border-dark-white ${lectura.estado === 'A tiempo' ? 'bg-success' : lectura.estado === 'Tarde' ? 'bg-warning' : 'bg-danger'}`}></span>
                      
                      <div className="bg-slate-50 dark:bg-dark-light/5 p-4 rounded-2xl hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xs font-black text-info-dark dark:text-white uppercase tracking-tight">{lectura.empleado}</p>
                          <span className="text-[9px] font-black italic text-primary">{lectura.hora}</span>
                        </div>
                        <div className="flex justify-between items-end">
                          <p className="text-[9px] font-bold text-info-dark/40 dark:text-white/40 uppercase">{lectura.cargo}</p>
                          <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg ${lectura.estado === 'A tiempo' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                            {lectura.tipo} - {lectura.estado}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-dark-light/5 text-center">
                <p className="text-[9px] font-bold text-info-dark/40 dark:text-white/40 uppercase tracking-widest flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></span>
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