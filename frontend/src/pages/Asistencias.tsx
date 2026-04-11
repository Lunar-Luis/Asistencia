import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { CalendarDays, Search, User, CheckCircle2, AlertCircle, XCircle, Cpu, Activity, CreditCard } from 'lucide-react';
import Swal from 'sweetalert2';

// IMPORTAMOS LA API REAL
import * as api from '../services/api';
import type { Asistencia } from '../services/api';

const animProps = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };
const cardStyle = "bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-6 md:p-8 transition-colors";
const inputStyle = "w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none text-[13px] font-bold text-slate-700 dark:text-white border border-transparent focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer";
const optionClassName = "bg-white dark:bg-slate-800 text-slate-700 dark:text-white font-bold py-2";

// Funciones Helper
const formatearHora = (fechaString: string | null) => {
  if (!fechaString) return '---';
  const fecha = new Date(fechaString);
  return fecha.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const formatearEstado = (estado: string) => {
  if (estado === 'A_TIEMPO') return 'A tiempo';
  if (estado === 'TARDE') return 'Tarde';
  if (estado === 'AUSENTE') return 'Ausente';
  return estado;
};

const SkeletonLayout = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 space-y-6">
      <motion.div {...animProps} className={`${cardStyle} animate-pulse`}>
        <div className="w-48 h-8 bg-slate-200 dark:bg-slate-800 rounded mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
      </motion.div>
      <motion.div {...animProps} transition={{ delay: 0.1 }} className={`${cardStyle} animate-pulse`}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
          <div><div className="w-56 h-8 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div><div className="w-40 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div></div>
          <div className="w-full sm:w-56 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
        <div className="w-full h-12 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="w-full h-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center px-4 gap-4">
               <div className="w-40 h-5 bg-slate-200 dark:bg-slate-800 rounded"></div>
               <div className="w-32 h-5 bg-slate-200 dark:bg-slate-800 rounded mx-auto"></div>
               <div className="w-20 h-8 bg-slate-200 dark:bg-slate-800 rounded-full ml-auto"></div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
    <div className="lg:col-span-1">
      <motion.div {...animProps} transition={{ delay: 0.2 }} className={`${cardStyle} h-full flex flex-col animate-pulse`}>
        <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div><div className="w-40 h-8 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div><div className="w-32 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div></div>
          <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
        <div className="space-y-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="pl-6 border-l-2 border-slate-100 dark:border-slate-800 relative">
              <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 absolute -left-[11px] top-1"></div>
              <div className="w-full h-24 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 flex flex-col justify-between">
                 <div className="w-3/4 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                 <div className="w-1/2 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);

export default function Asistencias() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Datos reales desde la BD
  const [historialCompleto, setHistorialCompleto] = useState<Asistencia[]>([]);

  // 1. ESTADOS PARA LOS FILTROS
  const hoyStr = new Date().toISOString().split('T')[0];
  const [fechaFiltro, setFechaFiltro] = useState(hoyStr);
  const [empleadoFiltro, setEmpleadoFiltro] = useState("all");
  const [estadoFiltro, setEstadoFiltro] = useState("all");
  const [busquedaGlobal, setBusquedaGlobal] = useState("");

  // 2. CARGA DE DATOS (CON POLLING PARA EL EN VIVO)
  const fetchDatos = async () => {
    try {
      const data = await api.getAsistencias();
      // Ordenar: Los más recientes arriba
      const dataOrdenada = data.sort((a: Asistencia, b: Asistencia) => {
         return new Date(b.marcaEntrada).getTime() - new Date(a.marcaEntrada).getTime();
      });
      setHistorialCompleto(dataOrdenada);
    } catch (error) {
      console.error("Error cargando asistencias", error);
      Swal.fire("Error", "No se pudo cargar el historial de asistencias.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
    // Actualizar cada 5 segundos para el Monitor en Vivo
    const intervalo = setInterval(fetchDatos, 5000); 
    return () => clearInterval(intervalo);
  }, []);

  // 3. OBTENER LISTA ÚNICA DE EMPLEADOS PARA EL SELECT
  const empleadosUnicos = useMemo(() => {
    const nombres = historialCompleto.map(item => `${item.empleado.nombre} ${item.empleado.apellido}`);
    return [...new Set(nombres)].sort();
  }, [historialCompleto]);

  // 4. FILTRADO DINÁMICO
  const historialFiltrado = useMemo(() => {
    return historialCompleto.filter(item => {
      const nombreCompleto = `${item.empleado.nombre} ${item.empleado.apellido}`;

      // Filtro 1: Fecha
      const matchFecha = fechaFiltro ? item.fechaRegistro === fechaFiltro : true;
      
      // Filtro 2: Empleado
      const matchEmpleado = empleadoFiltro === "all" ? true : nombreCompleto === empleadoFiltro;
      
      // Filtro 3: Estado 
      let matchEstado = true;
      if (estadoFiltro === "ontime") matchEstado = item.estadoEntrada === "A_TIEMPO";
      else if (estadoFiltro === "late") matchEstado = item.estadoEntrada === "TARDE";
      else if (estadoFiltro === "absent") matchEstado = item.estadoEntrada === "AUSENTE";

      // Filtro 4: Búsqueda Global 
      const textoBusqueda = `${nombreCompleto} ${item.empleado.nfcUid} ${item.empleado.cargo?.nombre || ''}`.toLowerCase();
      const matchBusqueda = busquedaGlobal ? textoBusqueda.includes(busquedaGlobal.toLowerCase()) : true;

      return matchFecha && matchEmpleado && matchEstado && matchBusqueda;
    });
  }, [historialCompleto, fechaFiltro, empleadoFiltro, estadoFiltro, busquedaGlobal]);

  // 5. DATOS PARA EL MONITOR EN VIVO (Hoy, Max 5)
  const enVivo = useMemo(() => {
      return historialCompleto
        .filter(item => item.fechaRegistro === hoyStr)
        .slice(0, 5);
  }, [historialCompleto, hoyStr]);

  return (
    <main className="pb-8 max-w-[1600px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
        <h1 className="text-[2.2rem] sm:text-[3rem] md:text-[3.5rem] font-black tracking-tighter uppercase italic leading-[1.1] flex flex-wrap items-center gap-x-2">
          <span className="text-slate-800 dark:text-white">Control de</span>
          <span className="bg-gradient-to-r from-primary via-indigo-900 to-primary dark:via-white bg-[length:200%_auto] bg-clip-text text-transparent inline-block not-italic py-1 px-2">
            Asistencia
          </span>
        </h1>
        <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] sm:tracking-[0.4em] mt-2">
          Monitorea y filtra la asistencia en tiempo real
        </p>
      </motion.div>

      {isLoading && historialCompleto.length === 0 ? (
        <SkeletonLayout />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* --- PANEL DE FILTROS --- */}
            <motion.div {...animProps} className={cardStyle}>
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                <CalendarDays className="text-primary" size={28} />
                <h2 className="font-black uppercase italic tracking-tighter dark:text-white text-2xl">Filtros de Búsqueda</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* 1. INPUT FECHA */}
                <div className="relative">
                  <label className="text-[10px] font-black uppercase text-primary mb-2 block ml-2">Fecha</label>
                  <div className="relative">
                    <CalendarDays size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
                    <input 
                      type="date" 
                      className={inputStyle} 
                      value={fechaFiltro}
                      onChange={(e) => setFechaFiltro(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* 2. SELECT EMPLEADO */}
                <div className="relative">
                  <label className="text-[10px] font-black uppercase text-primary mb-2 block ml-2">Empleado</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
                    <select 
                      className={inputStyle}
                      value={empleadoFiltro}
                      onChange={(e) => setEmpleadoFiltro(e.target.value)}
                    >
                      <option value="all" className={optionClassName}>Todos los empleados</option>
                      {empleadosUnicos.map((nombre, idx) => (
                        <option key={idx} value={nombre} className={optionClassName}>{nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. SELECT ESTADO */}
                <div className="relative">
                  <label className="text-[10px] font-black uppercase text-primary mb-2 block ml-2">Estado</label>
                  <div className="relative">
                    <Activity size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
                    <select 
                      className={inputStyle}
                      value={estadoFiltro}
                      onChange={(e) => setEstadoFiltro(e.target.value)}
                    >
                      <option value="all" className={optionClassName}>Todos los estados</option>
                      <option value="ontime" className={optionClassName}>A tiempo</option>
                      <option value="late" className={optionClassName}>Tarde</option>
                      <option value="absent" className={optionClassName}>Ausente</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* --- TABLA DE RESULTADOS --- */}
            <motion.div {...animProps} transition={{ delay: 0.1 }} className={cardStyle}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="font-black uppercase italic tracking-tighter dark:text-white text-2xl text-slate-800">Registros de Asistencia</h2>
                  <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                    {historialFiltrado.length} registros encontrados {fechaFiltro && `el ${fechaFiltro}`}
                  </p>
                </div>
                
                {/* 4. INPUT DE BÚSQUEDA GLOBAL */}
                <div className="relative w-full sm:w-[280px]">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
                  <input 
                    type="text" 
                    placeholder="Buscar nombre o NFC..." 
                    className={`${inputStyle} cursor-text`} 
                    value={busquedaGlobal}
                    onChange={(e) => setBusquedaGlobal(e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-x-auto pb-2">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="p-4 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 rounded-l-xl">Empleado</th>
                      <th className="p-4 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Fecha</th>
                      <th className="p-4 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Entrada</th>
                      <th className="p-4 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Salida</th>
                      <th className="p-4 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center">Tarjeta NFC</th>
                      <th className="p-4 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-right rounded-r-xl">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                    <AnimatePresence>
                      {historialFiltrado.length > 0 ? (
                        historialFiltrado.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                            <td className="p-4">
                              <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">
                                {item.empleado.nombre} {item.empleado.apellido}
                              </p>
                              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-1">
                                {item.empleado.cargo?.nombre || 'Sin Cargo'}
                              </p>
                            </td>
                            <td className="p-4">
                              <p className="text-xs font-bold text-slate-700 dark:text-white">{item.fechaRegistro}</p>
                            </td>
                            <td className="p-4">
                              <span className="text-xs font-bold text-slate-600 dark:text-white/60 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-md">
                                {formatearHora(item.marcaEntrada)}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="text-xs font-bold text-slate-600 dark:text-white/60 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-md">
                                {item.marcaSalida ? formatearHora(item.marcaSalida) : '---'}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 uppercase">
                                <CreditCard size={14} className="text-primary/70" /> {item.empleado.nfcUid}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <span className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-wider ${item.estadoEntrada === 'A_TIEMPO' ? 'text-emerald-600 bg-emerald-50 dark:text-success dark:bg-success/10' : item.estadoEntrada === 'TARDE' ? 'text-amber-600 bg-amber-50 dark:text-warning dark:bg-warning/10' : 'text-red-500 bg-red-50 dark:text-danger dark:bg-danger/10'}`}>
                                {item.estadoEntrada === 'A_TIEMPO' ? <CheckCircle2 size={14}/> : item.estadoEntrada === 'TARDE' ? <AlertCircle size={14}/> : <XCircle size={14}/>}
                                {formatearEstado(item.estadoEntrada)}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-8 text-center">
                            <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                              <Search size={48} className="mb-4 opacity-50" />
                              <p className="text-sm font-bold uppercase tracking-widest">No hay registros para estos filtros</p>
                              <p className="text-[11px] mt-1 font-medium">Intenta cambiar la fecha o el empleado</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* --- MONITOR EN VIVO --- */}
          <div className="lg:col-span-1">
            <motion.div {...animProps} transition={{ delay: 0.2 }} className={`${cardStyle} h-full flex flex-col`}>
              <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="font-black uppercase italic tracking-tighter dark:text-white text-2xl text-slate-800">Monitor en Vivo</h2>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Lecturas NFC recientes</p>
                </div>
                <div className="bg-emerald-50 dark:bg-success/10 text-emerald-600 dark:text-success p-3 rounded-xl flex items-center justify-center relative shadow-sm border border-emerald-100 dark:border-success/20">
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 dark:bg-success rounded-full animate-ping"></span>
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 dark:bg-success rounded-full"></span>
                  <Cpu size={24} />
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <AnimatePresence>
                  {enVivo.length > 0 ? (
                    enVivo.map((lectura) => (
                      <motion.div key={lectura.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="relative pl-7 border-l-2 border-slate-100 dark:border-slate-800">
                        {/* Lógica de color original mantenida */}
                        <span className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-[5px] border-white dark:border-slate-900 ${lectura.estadoEntrada === 'A_TIEMPO' ? 'bg-emerald-500 dark:bg-success' : lectura.estadoEntrada === 'TARDE' ? 'bg-amber-500 dark:bg-warning' : 'bg-red-500 dark:bg-danger'}`}></span>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent dark:border-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700 cursor-default">
                          <div className="flex justify-between items-start mb-3">
                            <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">
                              {lectura.empleado.nombre} {lectura.empleado.apellido}
                            </p>
                            <span className="text-[10px] font-black italic text-primary">
                              {lectura.marcaSalida ? formatearHora(lectura.marcaSalida) : formatearHora(lectura.marcaEntrada)}
                            </span>
                          </div>
                          <div className="flex justify-between items-end mt-1">
                            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                              {lectura.empleado.cargo?.nombre || 'Sin Cargo'}
                            </p>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${lectura.estadoEntrada === 'A_TIEMPO' ? 'bg-emerald-50 dark:bg-success/10 text-emerald-600 dark:text-success' : 'bg-amber-50 dark:bg-warning/10 text-amber-600 dark:text-warning'}`}>
                              {lectura.marcaSalida ? 'Salida' : 'Entrada'} - {formatearEstado(lectura.estadoEntrada)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-center text-slate-500 font-bold text-sm">Sin actividad hoy.</p>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 dark:bg-success rounded-full animate-pulse"></span>
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