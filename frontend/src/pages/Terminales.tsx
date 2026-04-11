import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Cpu, MapPin, Wifi, CheckCircle2, PowerOff, Activity } from 'lucide-react';
import Swal from 'sweetalert2';

import * as api from '../services/api';
import type { Terminal } from '../services/api';

const animProps = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };
const cardStyle = "bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-5 transition-colors relative";
const actionHoverEffect = "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800/50 cursor-pointer";
const inputStyle = "w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none text-[13px] font-bold text-slate-700 dark:text-white border border-transparent focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all cursor-text";
const optionClassName = "bg-white dark:bg-slate-800 text-slate-700 dark:text-white font-bold py-2";

const emptyForm: Terminal = { nombre: '', macAddress: '', ubicacion: '', activo: true };

const SkeletonTerminal = () => (
  <motion.div {...animProps} className={`${cardStyle} animate-pulse flex flex-col h-full`}>
    <div className="absolute top-5 right-5 w-16 h-5 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
    <div className="flex items-center gap-4 mb-5 pt-1">
      <div className="w-16 h-16 rounded-[1rem] bg-slate-200 dark:bg-slate-800 shrink-0"></div>
      <div className="w-full space-y-2">
        <div className="w-3/4 h-5 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="w-1/2 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
    </div>
    <div className="space-y-3 mb-5 flex-1">
      <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
      <div className="w-5/6 h-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
    </div>
    <div className="flex gap-2 w-full mt-auto pt-4 border-t border-slate-50 dark:border-slate-800/50">
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl flex-1"></div>
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl flex-1"></div>
    </div>
  </motion.div>
);

export default function Terminales() {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [terminales, setTerminales] = useState<Terminal[]>([]);
  const [formData, setFormData] = useState<Terminal>(emptyForm);

  const fetchDatos = async () => {
    try {
      const data = await api.getTerminales();
      setTerminales(data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar las terminales.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
    const intervalo = setInterval(fetchDatos, 10000); // Autorefresco para el Ping (10s)
    return () => clearInterval(intervalo);
  }, []);

  const filteredTerminales = useMemo(() => {
    return terminales.filter(t => 
      (t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || t.macAddress.toLowerCase().includes(searchTerm.toLowerCase())) && 
      (filterStatus === 'all' || (filterStatus === 'Activo' && t.activo) || (filterStatus === 'Inactivo' && !t.activo))
    ).sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [terminales, searchTerm, filterStatus]);

  const handleOpenModal = (mode: 'add' | 'edit', terminal?: Terminal) => {
    setModalMode(mode);
    if (mode === 'edit' && terminal) {
      setFormData({ ...terminal });
    } else {
      setFormData(emptyForm);
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'macAddress' ? value.toUpperCase() : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isDark = document.documentElement.classList.contains('dark');
    
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    if (!macRegex.test(formData.macAddress)) {
      Swal.fire("Formato Inválido", "La MAC Address debe tener el formato XX:XX:XX:XX:XX:XX", "warning");
      return;
    }

    try {
      if (modalMode === 'add') {
        await api.crearTerminal(formData);
      } else {
        await api.actualizarTerminal(formData.id!, formData);
      }
      setIsModalOpen(false);
      fetchDatos();
      Swal.fire({ 
        title: modalMode === 'add' ? '¡Registrada!' : '¡Actualizada!', 
        text: `La terminal ha sido guardada.`, 
        icon: 'success', 
        background: isDark ? '#0f172a' : '#fff', color: isDark ? '#f8fafc' : '#334155', 
        customClass: { popup: 'rounded-[2rem] border border-transparent dark:border-slate-800' } 
      });
    } catch {
      Swal.fire("Error", "Hubo un problema. Verifica la conexión.", "error");
    }
  };

  const handleToggleStatus = (terminal: Terminal) => {
    const isDark = document.documentElement.classList.contains('dark');
    const isActivating = !terminal.activo;

    Swal.fire({ 
      title: isActivating ? '¿Activar terminal?' : '¿Desactivar terminal?', 
      text: isActivating ? `La terminal volverá a recibir asistencias.` : `Se bloquearán las asistencias de este dispositivo.`, 
      icon: isActivating ? 'info' : 'warning', 
      showCancelButton: true, confirmButtonColor: isActivating ? '#10b981' : '#f59e0b', cancelButtonColor: '#94a3b8', 
      confirmButtonText: isActivating ? 'Sí, activar' : 'Sí, desactivar', 
      background: isDark ? '#0f172a' : '#fff', color: isDark ? '#f8fafc' : '#334155', customClass: { popup: 'rounded-[2rem] border border-transparent dark:border-slate-800' } 
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (isActivating) {
            await api.actualizarTerminal(terminal.id!, { ...terminal, activo: true });
          } else {
            await api.desactivarTerminal(terminal.id!);
          }
          fetchDatos();
          Swal.fire({ title: isActivating ? 'Activada' : 'Desactivada', icon: 'success', background: isDark ? '#0f172a' : '#fff', color: isDark ? '#f8fafc' : '#334155', customClass: { popup: 'rounded-[2rem] border border-transparent dark:border-slate-800' } });
        } catch {
          Swal.fire("Error", "No se pudo cambiar el estado.", "error");
        }
      }
    });
  };

  // Función para determinar si está online (Ping recibido en los últimos 2 minutos)
  const isOnline = (ultimoPing?: string) => {
    if (!ultimoPing) return false;
    const pingTime = new Date(ultimoPing).getTime();
    const currentTime = new Date().getTime();
    const diffMinutes = (currentTime - pingTime) / (1000 * 60);
    return diffMinutes <= 2;
  };

  return (
    <>
      <main className="pb-8 max-w-[1600px] mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="pt-2"> 
            <h1 className="text-[2.2rem] sm:text-[3rem] md:text-[3.5rem] font-black tracking-tighter uppercase italic leading-[1.1] flex flex-wrap items-center gap-x-2">
              <span className="text-slate-800 dark:text-white">Hardware y</span>
              <span className="bg-gradient-to-r from-primary via-indigo-900 to-primary dark:via-white bg-[length:200%_auto] bg-clip-text text-transparent inline-block not-italic py-1 px-2">
                Terminales
              </span>
            </h1>
            <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] sm:tracking-[0.4em] mt-2">
              Lectores Biométricos y RFID ({terminales.length})
            </p>
          </div>
          <button onClick={() => handleOpenModal('add')} className="bg-primary hover:bg-indigo-600 text-white px-7 py-3.5 rounded-2xl font-bold uppercase text-[13px] tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-colors self-start sm:self-end whitespace-nowrap w-full sm:w-auto">
            <Plus size={20} /> Nueva Terminal
          </button>
        </motion.div>

        {/* FILTROS */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-3 sm:gap-4 bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 items-center shadow-sm mb-8">
          <div className="relative flex-[2] w-full sm:w-auto min-w-[250px]">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input type="text" placeholder="Buscar por nombre o MAC..." className={`${inputStyle} cursor-text`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="relative flex-1 w-full sm:w-auto min-w-[160px]">
            <Activity size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <select className={inputStyle} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all" className={optionClassName}>Todos los estados</option>
              <option value="Activo" className={optionClassName}>Activos</option>
              <option value="Inactivo" className={optionClassName}>Inactivos</option>
            </select>
          </div>
        </motion.div>

        {/* TARJETAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading && terminales.length === 0 ? (
            <><SkeletonTerminal /><SkeletonTerminal /><SkeletonTerminal /></>
          ) : filteredTerminales.length === 0 ? (
             <div className="col-span-full py-12 text-center">
               <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-800">
                 <Cpu size={32} className="text-slate-300 dark:text-slate-600" />
               </div>
               <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">No hay terminales</h3>
               <p className="text-xs font-medium text-slate-500 dark:text-slate-500">Registra tu primer ESP32</p>
             </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredTerminales.map((terminal, index) => {
                const online = isOnline(terminal.ultimoPing);
                
                return (
                <motion.div key={terminal.id} layout {...animProps} transition={{ delay: index * 0.05 }} className={`${cardStyle} flex flex-col group ${actionHoverEffect} ${!terminal.activo ? 'opacity-75 hover:opacity-100 grayscale-[0.3]' : ''}`}>
                  {/* BUBBLE ESTADO ONLINE/OFFLINE */}
                  <div className={`absolute top-5 right-5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5 ${online ? 'bg-emerald-50 text-emerald-600 dark:bg-success/10 dark:text-success' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                    <Wifi size={10} className={online ? "animate-pulse" : ""} /> {online ? 'Online' : 'Offline'}
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-[1rem] bg-primary/10 flex items-center justify-center text-primary overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <Cpu size={26} />
                    </div>
                    <div className="min-w-0 pr-16">
                      <h3 className="text-base font-bold text-slate-800 dark:text-white leading-tight truncate">{terminal.nombre}</h3>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase truncate font-mono mt-1">
                        {terminal.macAddress}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6 flex-1">
                    <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <div className="w-6 h-6 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary shrink-0">
                        <MapPin size={12} />
                      </div>
                      <span className="truncate leading-relaxed">{terminal.ubicacion}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full pt-4 border-t border-slate-50 dark:border-slate-800/50 mt-1.5">
                    <button onClick={() => handleOpenModal('edit', terminal)} className="flex-1 flex justify-center items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 py-3 rounded-xl text-[11px] font-bold uppercase hover:bg-primary hover:text-white dark:hover:bg-primary transition-all duration-150 border border-transparent hover:border-primary/20">
                      <Edit size={14} /> <span className="italic truncate">Editar</span>
                    </button>
                    {terminal.activo ? (
                      <button onClick={() => handleToggleStatus(terminal)} className="flex-1 flex justify-center items-center gap-1.5 py-3 rounded-xl text-[11px] font-bold uppercase transition-all border border-transparent bg-amber-50 dark:bg-warning/10 text-amber-600 dark:text-warning hover:bg-amber-500 hover:text-white dark:hover:bg-warning">
                        <PowerOff size={14} /> <span className="italic truncate">Desactivar</span>
                      </button>
                    ) : (
                      <button onClick={() => handleToggleStatus(terminal)} className="flex-1 flex justify-center items-center gap-1.5 py-3 rounded-xl text-[11px] font-bold uppercase transition-all border border-transparent bg-emerald-50 dark:bg-success/10 text-emerald-600 dark:text-success hover:bg-emerald-500 hover:text-white dark:hover:bg-success">
                        <CheckCircle2 size={14} /> <span className="italic truncate">Activar</span>
                      </button>
                    )}
                  </div>
                </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* MODAL DE EDICIÓN/REGISTRO */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 z-[200] flex justify-center items-center p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[3rem] sm:rounded-[3.5rem] w-full max-w-[500px] relative shadow-2xl border border-transparent dark:border-slate-800">
              <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 sm:right-8 sm:top-8 text-2xl text-slate-400 hover:text-red-500 transition-colors">&times;</button>
              <h2 className="text-xl sm:text-2xl font-bold uppercase italic tracking-tighter mb-1 text-slate-800 dark:text-white">
                {modalMode === 'add' ? 'Registrar' : 'Actualizar'} <span className="text-primary not-italic">Terminal</span>
              </h2>
              <p className="text-[9px] sm:text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-8">Dispositivo de lectura RFID/NFC</p>
              
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="relative">
                  <Cpu size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required placeholder="Nombre del Equipo (Ej: Puerta Principal)" className={`${inputStyle} cursor-text`} />
                </div>
                
                <div className="relative">
                  <Wifi size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input type="text" name="macAddress" value={formData.macAddress} onChange={handleInputChange} required placeholder="Dirección MAC (Ej: EC:64:C9:AE:2D:78)" className={`${inputStyle} font-mono cursor-text`} />
                </div>

                <div className="relative">
                  <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input type="text" name="ubicacion" value={formData.ubicacion} onChange={handleInputChange} required placeholder="Ubicación Física" className={`${inputStyle} cursor-text`} />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="w-full sm:flex-1 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold uppercase text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-500 dark:hover:bg-danger/10 dark:hover:text-danger transition-all border border-transparent hover:border-red-200 dark:hover:border-danger/20">Cancelar</button>
                  <button type="submit" className="w-full sm:flex-[2] py-3.5 sm:py-4 bg-primary hover:bg-indigo-600 text-white rounded-xl sm:rounded-2xl font-bold uppercase text-[10px] sm:text-[13px] tracking-widest shadow-lg shadow-primary/30 transition-colors">
                    {modalMode === 'add' ? 'Confirmar Registro' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}