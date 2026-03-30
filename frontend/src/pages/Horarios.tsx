import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, Edit, Trash2, Search, Sunrise, Moon, CalendarDays, Watch, CheckCircle2, Filter, Users, PowerOff } from 'lucide-react';
import Swal from 'sweetalert2';

// IMPORTAMOS LA API Y EL TIPO
import { api, type Horario } from '../services/mockData';

const animProps = { initial: { opacity: 0, y: 15, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" as const } }, exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } } };
const cardStyle = "bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-6 md:p-8 transition-colors relative";
const actionHoverEffect = "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800/50 cursor-pointer";
const inputStyle = "w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none text-[13px] font-bold text-slate-700 dark:text-white border border-transparent focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer";
const optionClassName = "bg-white dark:bg-slate-800 text-slate-700 dark:text-white font-bold py-2";

const SkeletonHorario = () => (
  <div className={`${cardStyle} animate-pulse flex flex-col h-full`}>
    <div className="absolute top-6 right-6 w-16 h-5 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
    <div className="flex items-start gap-4 mb-6 pt-1">
      <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0"></div>
      <div className="w-full space-y-2 pt-1">
        <div className="w-3/4 h-5 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="w-1/2 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
    </div>
    <div className="space-y-4 mb-6 pt-5 border-t border-slate-50 dark:border-slate-800/50 flex-1">
      <div className="flex justify-between"><div className="w-1/3 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div><div className="w-1/3 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div></div>
      <div className="flex justify-between"><div className="w-1/3 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div><div className="w-1/4 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div></div>
      <div className="flex justify-between"><div className="w-1/3 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div><div className="w-1/4 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div></div>
    </div>
    <div className="flex gap-2 w-full pt-4 border-t border-slate-50 dark:border-slate-800/50 mt-auto">
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl flex-1"></div>
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl flex-1"></div>
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-12 shrink-0"></div>
    </div>
  </div>
);

const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

// ESTADO INICIAL VACÍO PARA EL FORMULARIO
const emptyForm = {
  id: 0, nombre: '', tipo: 'Normal', entrada: '', salida: '', tolerancia: 0, dias: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'], status: 'Activo' as 'Activo'|'Inactivo', empleados: 0
};

export default function Horarios() {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [filters, setFilters] = useState({ search: '', status: 'all' });

  const [horarios, setHorarios] = useState<Horario[]>([]);
  
  // ESTADO PARA EL FORMULARIO
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    const fetchDatos = async () => {
      setIsLoading(true);
      try {
        const data = await api.getHorarios();
        setHorarios(data);
      } catch (error) {
        console.error("Error cargando horarios", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDatos();
  }, []);

  const filteredHorarios = useMemo(() => {
    return horarios.filter(h => h.nombre.toLowerCase().includes(filters.search.toLowerCase()) && (filters.status === 'all' || h.status.toLowerCase() === filters.status.toLowerCase()));
  }, [horarios, filters]);

  const formatTime = (time24: string) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${(h % 12 || 12).toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const formatDias = (dias: string[]) => {
    if (dias.length === 7) return 'Todos los días';
    if (dias.length === 5 && !dias.includes('Sáb') && !dias.includes('Dom')) return 'Lunes a Viernes';
    if (dias.length === 6 && !dias.includes('Dom')) return 'Lunes a Sábado';
    return dias.join(', ');
  };

  // --- MANEJO DEL MODAL Y FORMULARIO ---
  const handleOpenModal = (mode: 'add' | 'edit', horario?: Horario) => {
    setModalMode(mode);
    if (mode === 'edit' && horario) {
      setFormData({ ...horario });
    } else {
      setFormData(emptyForm);
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleDia = (dia: string) => {
    setFormData(prev => {
      const isSelected = prev.dias.includes(dia);
      if (isSelected) {
        return { ...prev, dias: prev.dias.filter(d => d !== dia) };
      } else {
        // Mantenemos el orden de los días
        const newDias = [...prev.dias, dia].sort((a, b) => diasSemana.indexOf(a) - diasSemana.indexOf(b));
        return { ...prev, dias: newDias };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.dias.length === 0) {
      Swal.fire({ icon: 'warning', title: 'Atención', text: 'Debes seleccionar al menos un día laborable.' });
      return;
    }
    
    setIsModalOpen(false);
    const isDark = document.documentElement.classList.contains('dark');
    
    Swal.fire({ 
      title: modalMode === 'add' ? '¡Horario Creado!' : '¡Horario Actualizado!', 
      text: `El turno ${formData.nombre} ha sido guardado.`,
      icon: 'success', 
      background: isDark ? '#0f172a' : '#fff', 
      color: isDark ? '#f8fafc' : '#334155', 
      customClass: { popup: 'rounded-[2rem] border border-transparent dark:border-slate-800' } 
    });
  };

  // --- MANEJO DE ELIMINAR / ESTADO ---
  const handleDelete = (horario: Horario) => {
    const isDark = document.documentElement.classList.contains('dark');
    
    if (horario.empleados > 0) {
      Swal.fire({ 
        title: 'Acción Denegada', 
        html: `No puedes eliminar el <b>${horario.nombre}</b> porque hay <b>${horario.empleados} empleados</b> asignados a él.<br><br>Sugerencia: <b>Desactívalo</b> para que no se le pueda asignar a nuevos empleados.`, 
        icon: 'error', 
        showCancelButton: true, 
        confirmButtonColor: '#f59e0b', 
        cancelButtonColor: '#94a3b8', 
        confirmButtonText: 'Desactivar', 
        cancelButtonText: 'Cancelar',
        background: isDark ? '#0f172a' : '#fff', 
        color: isDark ? '#f8fafc' : '#334155', 
        customClass: { popup: 'rounded-[2rem] border border-transparent dark:border-slate-800' } 
      }).then((result) => {
        if (result.isConfirmed) {
          handleToggleStatus(horario.id, horario.nombre, 'Activo');
        }
      });
      return;
    }

    Swal.fire({ title: '¿Eliminar horario?', text: `Eliminarás el ${horario.nombre}.`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#ff7782', cancelButtonColor: '#94a3b8', confirmButtonText: 'Sí, eliminar', background: isDark ? '#0f172a' : '#fff', color: isDark ? '#f8fafc' : '#334155', customClass: { popup: 'rounded-[2rem] border border-transparent dark:border-slate-800' } }).then((result) => {
      if (result.isConfirmed) {
        setHorarios(horarios.filter(h => h.id !== horario.id));
        Swal.fire({ title: 'Eliminado', icon: 'success', background: isDark ? '#0f172a' : '#fff', color: isDark ? '#f8fafc' : '#334155', customClass: { popup: 'rounded-[2rem] border border-transparent dark:border-slate-800' }});
      }
    });
  };

  const handleToggleStatus = (id: number, nombre: string, currentStatus: string) => {
    const isDark = document.documentElement.classList.contains('dark');
    const isActivating = currentStatus === 'Inactivo';
    Swal.fire({ title: isActivating ? '¿Activar horario?' : '¿Desactivar horario?', text: isActivating ? `El ${nombre} volverá a estar disponible.` : `El ${nombre} dejará de estar disponible para asignaciones.`, icon: isActivating ? 'info' : 'warning', showCancelButton: true, confirmButtonColor: isActivating ? '#10b981' : '#f59e0b', cancelButtonColor: '#94a3b8', confirmButtonText: isActivating ? 'Sí, activar' : 'Sí, desactivar', background: isDark ? '#0f172a' : '#fff', color: isDark ? '#f8fafc' : '#334155', customClass: { popup: 'rounded-[2rem] border border-transparent dark:border-slate-800' } }).then((result) => {
      if (result.isConfirmed) {
        setHorarios(horarios.map(h => h.id === id ? { ...h, status: isActivating ? 'Activo' : 'Inactivo' } : h));
        Swal.fire({ title: isActivating ? 'Activado' : 'Desactivado', icon: 'success', background: isDark ? '#0f172a' : '#fff', color: isDark ? '#f8fafc' : '#334155', customClass: { popup: 'rounded-[2rem] border border-transparent dark:border-slate-800' } });
      }
    });
  };

  return (
    <>
      <main className="pb-8 max-w-[1600px] mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="pt-2"> 
            <h1 className="text-[2.2rem] sm:text-[3rem] md:text-[3.5rem] font-black tracking-tighter uppercase italic leading-[1.1] flex flex-wrap items-center gap-x-2">
              <span className="text-slate-800 dark:text-white">Gestión de</span>
              <span className="bg-gradient-to-r from-primary via-indigo-900 to-primary dark:via-white bg-[length:200%_auto] bg-clip-text text-transparent inline-block not-italic py-1 px-2">
                Horarios
              </span>
            </h1>
            <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] sm:tracking-[0.4em] mt-2">
              Configura los horarios de trabajo ({horarios.length} total)
            </p>
          </div>
          <button onClick={() => handleOpenModal('add')} className="bg-primary hover:bg-indigo-600 text-white px-7 py-3.5 rounded-2xl font-bold uppercase text-[13px] tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-colors whitespace-nowrap self-start sm:self-end w-full sm:w-auto">
            <Plus size={20} /> Nuevo Horario
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-3 sm:gap-4 bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 items-center shadow-sm mb-8">
          <div className="relative flex-[2] w-full sm:w-auto min-w-[250px]">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input type="text" placeholder="Buscar horarios..." className={`${inputStyle} cursor-text`} value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          </div>
          <div className="relative w-full sm:w-56">
            <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <select className={inputStyle} value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="all" className={optionClassName}>Todos los estados</option>
              <option value="activo" className={optionClassName}>Activos</option>
              <option value="inactivo" className={optionClassName}>Inactivos</option>
            </select>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <><SkeletonHorario /><SkeletonHorario /><SkeletonHorario /></>
          ) : filteredHorarios.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-800"><Clock size={32} className="text-slate-300 dark:text-slate-600" /></div>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">No hay horarios</h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-500">Ajusta los filtros o crea uno nuevo</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredHorarios.map((horario) => (
                <motion.div key={horario.id} layout {...animProps} className={`${cardStyle} group flex flex-col h-full ${actionHoverEffect} ${horario.status === 'Inactivo' ? 'opacity-75 hover:opacity-100 grayscale-[0.3]' : ''}`}>
                  <div className={`absolute top-6 right-6 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase ${horario.status === 'Activo' ? 'bg-emerald-50 text-emerald-600 dark:bg-success/10 dark:text-success' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                    ● {horario.status}
                  </div>

                  <div className="flex items-start gap-4 mb-6 pt-1">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-105"><Clock size={26} /></div>
                    <div className="min-w-0 pr-16 pt-1">
                      <h3 className="text-[17px] font-bold text-slate-800 dark:text-white leading-tight truncate">{horario.nombre}</h3>
                      {/* Eliminado el <p> que mostraba el 'tipo' para evitar redundancia */}
                      <div className="flex flex-wrap items-center gap-4 text-[12px] font-semibold text-slate-600 dark:text-slate-300 mt-2">
                        <span className="flex items-center gap-1.5"><Sunrise size={16} className="text-emerald-500"/> {formatTime(horario.entrada)}</span>
                        <span className="flex items-center gap-1.5"><Moon size={16} className="text-indigo-500"/> {formatTime(horario.salida)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-5 border-t border-slate-50 dark:border-slate-800/50 flex-1 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium"><CalendarDays size={16}/> Días Laborables</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[140px] text-right">{formatDias(horario.dias)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium"><Users size={16}/> Empleados</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{horario.empleados} asignados</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium"><Watch size={16}/> Tolerancia</span>
                      <span className="font-semibold text-amber-500 dark:text-warning">{horario.tolerancia} min</span>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full pt-4 border-t border-slate-50 dark:border-slate-800/50 mt-auto">
                    <button onClick={() => handleOpenModal('edit', horario)} className="flex-1 flex justify-center items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 py-3 rounded-xl text-[11px] font-bold uppercase hover:bg-primary hover:text-white dark:hover:bg-primary transition-all duration-150 border border-transparent hover:border-primary/20">
                      <Edit size={14} /> <span className="italic truncate">Editar</span>
                    </button>
                    <button onClick={() => handleToggleStatus(horario.id, horario.nombre, horario.status)} className={`flex-1 flex justify-center items-center gap-1.5 py-3 rounded-xl text-[11px] font-bold uppercase transition-all border border-transparent ${horario.status === 'Activo' ? 'bg-amber-50 dark:bg-warning/10 text-amber-600 dark:text-warning hover:bg-amber-500 hover:text-white dark:hover:bg-warning' : 'bg-emerald-50 dark:bg-success/10 text-emerald-600 dark:text-success hover:bg-emerald-500 hover:text-white dark:hover:bg-success'}`}>
                      {horario.status === 'Activo' ? <><PowerOff size={14} /> <span className="italic truncate">Desactivar</span></> : <><CheckCircle2 size={14} /> <span className="italic truncate">Activar</span></>}
                    </button>
                    <button onClick={() => handleDelete(horario)} className="w-12 flex justify-center items-center shrink-0 bg-red-50 dark:bg-danger/10 text-red-500 dark:text-danger rounded-xl hover:bg-red-500 hover:text-white dark:hover:bg-danger transition-all border border-transparent hover:border-red-200">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 z-[200] flex justify-center items-center p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[3rem] sm:rounded-[3.5rem] w-full max-w-[650px] relative shadow-2xl border border-transparent dark:border-slate-800 max-h-[90vh] overflow-y-auto">
              <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 sm:right-8 sm:top-8 text-3xl text-slate-400 hover:text-red-500 transition-colors">&times;</button>
              <h2 className="text-2xl sm:text-3xl font-bold uppercase italic tracking-tighter mb-1 text-slate-800 dark:text-white">
                {modalMode === 'add' ? 'Crear Nuevo' : 'Actualizar'} <span className="text-primary not-italic">Horario</span>
              </h2>
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-8">Definición de turnos corporativos</p>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="relative">
                  <label className="text-[10px] font-bold uppercase text-primary mb-2 block ml-2">Nombre del Turno</label>
                  <div className="relative">
                    <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input 
                      type="text" 
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Ej: Turno Nocturno" 
                      required 
                      className={`${inputStyle} cursor-text`} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="text-[10px] font-bold uppercase text-primary mb-2 block ml-2">Hora de Entrada</label>
                    <div className="relative">
                      <Sunrise size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                      <input type="time" name="entrada" value={formData.entrada} onChange={handleInputChange} required className={inputStyle} />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="text-[10px] font-bold uppercase text-primary mb-2 block ml-2">Hora de Salida</label>
                    <div className="relative">
                      <Moon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                      <input type="time" name="salida" value={formData.salida} onChange={handleInputChange} required className={inputStyle} />
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <label className="text-[10px] font-bold uppercase text-primary mb-2 block ml-2 flex items-center justify-between">Tolerancia (Minutos)</label>
                  <div className="relative">
                    <Watch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input type="number" min="0" name="tolerancia" value={formData.tolerancia} onChange={handleInputChange} placeholder="Ej: 15" required className={`${inputStyle} cursor-text`} />
                  </div>
                </div>
                <div className="mt-5">
                  <label className="text-[10px] font-bold uppercase text-primary mb-3 block ml-2">Días Laborables</label>
                  <div className="flex flex-wrap gap-2">
                    {diasSemana.map(dia => {
                      const isSelected = formData.dias.includes(dia);
                      return (
                        <label key={dia} className="cursor-pointer flex-1 min-w-[45px]">
                          <input 
                            type="checkbox" 
                            className="sr-only" 
                            checked={isSelected}
                            onChange={() => handleToggleDia(dia)}
                          />
                          <div className={`px-2 py-3 text-center rounded-xl text-[11px] sm:text-[12px] font-bold uppercase transition-all select-none ${isSelected ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                            {dia}
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>
                
                {modalMode === 'add' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="p-5 bg-emerald-50 dark:bg-success/10 rounded-2xl border border-emerald-100 dark:border-success/20 text-center">
                      <label className="text-[10px] font-bold uppercase text-emerald-600 dark:text-success mb-2 block">Estado Inicial</label>
                      <button type="button" className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase text-emerald-600 dark:text-success w-full"><CheckCircle2 size={18}/> Activo</button>
                    </div>
                    <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800">
                      <span className="text-2xl font-bold text-slate-700 dark:text-slate-200">0</span>
                      <span className="text-[9px] font-semibold uppercase text-slate-500 dark:text-slate-400 mt-1">Empleados Asignados</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="w-full sm:flex-1 py-4 rounded-xl sm:rounded-2xl font-bold uppercase text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-500 dark:hover:bg-danger/10 dark:hover:text-danger transition-all border border-transparent hover:border-red-200 dark:hover:border-danger/20">Cancelar</button>
                  <button type="submit" className="w-full sm:flex-[2] py-4 bg-primary hover:bg-indigo-600 text-white rounded-xl sm:rounded-2xl font-bold uppercase text-[12px] tracking-widest shadow-lg shadow-primary/30 transition-colors">
                    {modalMode === 'add' ? 'Guardar Turno' : 'Guardar Cambios'}
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