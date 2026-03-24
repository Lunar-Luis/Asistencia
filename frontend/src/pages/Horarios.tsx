import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Clock, 
  Edit, 
  Trash2, 
  Search,
  Sunrise,
  Moon,
  CalendarDays,
  Watch,
  CheckCircle2,
  Filter,
  Users
} from 'lucide-react';
import Swal from 'sweetalert2';

// ==========================================
// ESTILOS GLOBALES CORPORATIVOS
// ==========================================
const animProps = {
  initial: { opacity: 0, y: 15, scale: 0.98 },
  // Agregamos "as const" para que TypeScript reconozca el tipo exacto de Easing
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

// ==========================================
// COMPONENTE SKELETON (Diseño Ligero)
// ==========================================
const SkeletonHorario = () => (
  <div className="bg-white dark:bg-dark-white p-6 rounded-[2rem] border border-transparent dark:border-dark-light/5 relative animate-pulse flex flex-col h-full">
    <div className="absolute top-6 right-6 w-14 h-4 bg-slate-200 dark:bg-dark-light/10 rounded-full"></div>
    
    {/* Header Skeleton */}
    <div className="flex items-start gap-4 mb-6">
      <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-dark-light/10 shrink-0"></div>
      <div className="w-full space-y-2 pt-1">
        <div className="w-3/4 h-4 bg-slate-200 dark:bg-dark-light/10 rounded"></div>
        <div className="w-1/2 h-3 bg-slate-200 dark:bg-dark-light/10 rounded"></div>
        <div className="w-2/3 h-3 bg-slate-200 dark:bg-dark-light/10 rounded mt-2"></div>
      </div>
    </div>
    
    {/* Details Skeleton */}
    <div className="space-y-3 mb-6 pt-4 border-t border-slate-50 dark:border-dark-light/5 flex-1">
      <div className="flex justify-between">
        <div className="w-1/3 h-3 bg-slate-200 dark:bg-dark-light/10 rounded"></div>
        <div className="w-1/3 h-3 bg-slate-200 dark:bg-dark-light/10 rounded"></div>
      </div>
      <div className="flex justify-between">
        <div className="w-1/3 h-3 bg-slate-200 dark:bg-dark-light/10 rounded"></div>
        <div className="w-1/4 h-3 bg-slate-200 dark:bg-dark-light/10 rounded"></div>
      </div>
      <div className="flex justify-between">
        <div className="w-1/3 h-3 bg-slate-200 dark:bg-dark-light/10 rounded"></div>
        <div className="w-1/4 h-3 bg-slate-200 dark:bg-dark-light/10 rounded"></div>
      </div>
    </div>

    {/* Actions Skeleton */}
    <div className="flex gap-2 pt-4 border-t border-slate-50 dark:border-dark-light/5 mt-auto">
      <div className="h-10 bg-slate-200 dark:bg-dark-light/10 rounded-xl flex-1"></div>
      <div className="h-10 w-12 bg-slate-200 dark:bg-dark-light/10 rounded-xl shrink-0"></div>
    </div>
  </div>
);

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function Horarios() {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  
  // Filtros
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
  });

  // Simular carga
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // --- DATOS MOCK ---
  const [horarios, setHorarios] = useState([
    { id: 1, nombre: 'Turno Administrativo', tipo: 'Normal', entrada: '08:00', salida: '17:00', tolerancia: 15, dias: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'], status: 'Activo', empleados: 45 },
    { id: 2, nombre: 'Turno Operativo CMBT', tipo: 'Normal', entrada: '06:00', salida: '14:00', tolerancia: 10, dias: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'], status: 'Activo', empleados: 82 },
    { id: 3, nombre: 'Turno Nocturno SEG', tipo: 'Seguridad', entrada: '22:00', salida: '06:00', tolerancia: 5, dias: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'], status: 'Inactivo', empleados: 15 },
  ]);

  const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // --- LÓGICA DE FILTROS ---
  const filteredHorarios = useMemo(() => {
    return horarios.filter(h => {
      const matchSearch = h.nombre.toLowerCase().includes(filters.search.toLowerCase());
      const matchStatus = filters.status === 'all' || h.status.toLowerCase() === filters.status.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [horarios, filters]);

  // --- FORMATEO ---
  const formatTime = (time24: string) => {
    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const formatDias = (dias: string[]) => {
    if (dias.length === 7) return 'Todos los días';
    if (dias.length === 5 && !dias.includes('Sáb') && !dias.includes('Dom')) return 'Lunes a Viernes';
    if (dias.length === 6 && !dias.includes('Dom')) return 'Lunes a Sábado';
    return dias.join(', ');
  };

  const handleDelete = (id: number, nombre: string) => {
    const isDark = document.documentElement.classList.contains('dark');
    Swal.fire({
      title: '¿Eliminar horario?',
      text: `Eliminarás el ${nombre}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff7782',
      cancelButtonColor: '#7380ec',
      confirmButtonText: 'Sí, eliminar',
      background: isDark ? '#181a1e' : '#fff',
      color: isDark ? '#edeffd' : '#363949',
      customClass: { popup: 'rounded-2xl border border-transparent dark:border-white/5' }
    }).then((result) => {
      if (result.isConfirmed) {
        setHorarios(horarios.filter(h => h.id !== id));
        Swal.fire({ title: 'Eliminado', icon: 'success', background: isDark ? '#181a1e' : '#fff', color: isDark ? '#edeffd' : '#363949', customClass: { popup: 'rounded-2xl border border-transparent dark:border-white/5' }});
      }
    });
  };

  const openModal = (mode: 'add' | 'edit') => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  return (
    <>
      <main className="mt-[0.8rem] pr-4 pb-8">
        
        {/* --- HEADER --- */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="pt-2"> 
            <h1 className="text-[2.5rem] md:text-[3.2rem] font-black tracking-tighter uppercase italic leading-[1.1] flex items-center gap-x-1">
              <span className="text-slate-800 dark:text-white">Gestión de</span>
              <span className="bg-gradient-to-r from-primary via-indigo-900 to-primary dark:via-white bg-[length:200%_auto] bg-clip-text text-transparent inline-block NOT-italic py-1 ml-1">
                Horarios
              </span>
            </h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-white/60 uppercase tracking-[0.2em] mt-2">
              Configura los horarios de trabajo ({horarios.length} total)
            </p>
          </div>
          
          <button 
            onClick={() => openModal('add')} 
            className="bg-primary hover:bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold uppercase text-[11px] tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2 transition-colors whitespace-nowrap self-start sm:self-end"
          >
            <Plus size={18} /> Nuevo Horario
          </button>
        </motion.div>

        {/* --- FILTROS --- */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-dark-white p-3 rounded-[2rem] border border-transparent dark:border-dark-light/5 items-center shadow-sm mb-8">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
            <input 
              type="text" 
              placeholder="Buscar horarios..." 
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-dark-light/5 rounded-xl outline-none text-xs font-semibold text-slate-700 dark:text-white border border-transparent focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          
          <div className="relative w-full sm:w-48">
            <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
            <select 
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-dark-light/5 rounded-xl outline-none text-xs font-semibold text-slate-700 dark:text-white appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20 transition-all border border-transparent focus:border-primary/40"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all" className="dark:bg-[#181a1e]">Todos los estados</option>
              <option value="activo" className="dark:bg-[#181a1e]">Activos</option>
              <option value="inactivo" className="dark:bg-[#181a1e]">Inactivos</option>
            </select>
          </div>
        </motion.div>

        {/* --- GRID DE TARJETAS (ESTILO LIGERO UI/UX) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              <SkeletonHorario />
              <SkeletonHorario />
              <SkeletonHorario />
            </>
          ) : filteredHorarios.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <div className="w-20 h-20 bg-slate-50 dark:bg-dark-light/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={32} className="text-slate-300 dark:text-white/20" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 dark:text-white mb-1">No hay horarios</h3>
              <p className="text-xs font-medium text-slate-500 dark:text-white/40">Ajusta los filtros o crea uno nuevo</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredHorarios.map((horario) => (
                <motion.div
                  key={horario.id}
                  layout
                  {...animProps}
                  className="bg-white dark:bg-dark-white p-6 rounded-[2rem] border border-slate-100 dark:border-dark-light/5 relative group hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                >
                  {/* Badge de estado superior derecho */}
                  <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[9px] font-bold uppercase ${horario.status === 'Activo' ? 'bg-emerald-50 text-emerald-600 dark:bg-success/10 dark:text-success' : 'bg-red-50 text-red-600 dark:bg-danger/10 dark:text-danger'}`}>
                    ● {horario.status}
                  </div>

                  {/* Header: Titulo y Horas de Entrada/Salida */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-105">
                      <Clock size={22} />
                    </div>
                    <div className="min-w-0 pr-14 pt-1">
                      <h3 className="text-[15px] font-bold text-slate-800 dark:text-white leading-tight truncate">{horario.nombre}</h3>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-white/50 mb-2 truncate">{horario.tipo}</p>
                      
                      {/* Horas integradas bajo el título */}
                      <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600 dark:text-white/70">
                        <span className="flex items-center gap-1"><Sunrise size={14} className="text-emerald-500"/> {formatTime(horario.entrada)}</span>
                        <span className="flex items-center gap-1"><Moon size={14} className="text-indigo-500"/> {formatTime(horario.salida)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Detalles en Lista Limpia */}
                  <div className="space-y-3 pt-4 border-t border-slate-50 dark:border-dark-light/5 flex-1 mb-5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-white/50 flex items-center gap-1.5 font-medium"><CalendarDays size={14}/> Días Laborables</span>
                      <span className="font-semibold text-slate-700 dark:text-white truncate max-w-[130px] text-right">{formatDias(horario.dias)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-white/50 flex items-center gap-1.5 font-medium"><Users size={14}/> Empleados</span>
                      <span className="font-semibold text-slate-700 dark:text-white">{horario.empleados} asignados</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-white/50 flex items-center gap-1.5 font-medium"><Watch size={14}/> Tolerancia</span>
                      <span className="font-semibold text-amber-500 dark:text-warning">{horario.tolerancia} min</span>
                    </div>
                  </div>

                  {/* Botones de acción ligeros */}
                  <div className="flex gap-2 pt-4 border-t border-slate-50 dark:border-dark-light/5 mt-auto">
                    <button 
                      onClick={() => openModal('edit')}
                      className="flex-1 flex justify-center items-center gap-2 bg-slate-50 dark:bg-dark-light/5 text-slate-600 dark:text-white py-2.5 rounded-xl text-[10px] font-bold uppercase hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white transition-all duration-150"
                    >
                      <Edit size={14} /> <span className="italic">Editar</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(horario.id, horario.nombre)}
                      className="p-2.5 bg-red-50 dark:bg-danger/10 text-red-500 dark:text-danger rounded-xl hover:bg-red-500 dark:hover:bg-danger hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* --- MODAL CORPORATIVO SUAVIZADO --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 z-[200] flex justify-center items-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white dark:bg-[#181a1e] p-8 rounded-[3rem] w-full max-w-[600px] relative shadow-2xl border border-transparent dark:border-white/5"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 text-2xl text-slate-400 hover:text-red-500 transition-colors">&times;</button>
              
              <h2 className="text-2xl font-bold uppercase italic tracking-tighter mb-1 text-slate-800 dark:text-white">
                {modalMode === 'add' ? 'Crear Nuevo' : 'Actualizar'} <span className="text-primary NOT-italic">Horario</span>
              </h2>
              <p className="text-[10px] font-medium text-slate-500 dark:text-white/40 uppercase tracking-widest mb-8">Definición de turnos corporativos</p>

              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
                <div className="relative">
                  <label className="text-[9px] font-bold uppercase text-primary mb-1.5 block ml-1.5">Nombre del Turno</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
                    <input 
                      type="text" placeholder="Ej: Turno Nocturno" required
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-dark-light/5 rounded-2xl outline-none text-sm font-medium text-slate-700 dark:text-white border border-transparent focus:border-primary/40 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="text-[9px] font-bold uppercase text-primary mb-1.5 block ml-1.5">Hora de Entrada</label>
                    <div className="relative">
                      <Sunrise size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
                      <input type="time" required className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-dark-light/5 rounded-2xl outline-none text-sm font-medium text-slate-700 dark:text-white border border-transparent focus:border-primary/40 cursor-pointer" />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="text-[9px] font-bold uppercase text-primary mb-1.5 block ml-1.5">Hora de Salida</label>
                    <div className="relative">
                      <Moon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
                      <input type="time" required className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-dark-light/5 rounded-2xl outline-none text-sm font-medium text-slate-700 dark:text-white border border-transparent focus:border-primary/40 cursor-pointer" />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label className="text-[9px] font-bold uppercase text-primary mb-1.5 block ml-1.5 flex items-center justify-between">
                    Tolerancia (Minutos)
                  </label>
                  <div className="relative">
                    <Watch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
                    <input 
                      type="number" min="0" placeholder="Ej: 15" required
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-dark-light/5 rounded-2xl outline-none text-sm font-medium text-slate-700 dark:text-white border border-transparent focus:border-primary/40 transition-all"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-[9px] font-bold uppercase text-primary mb-2 block ml-1.5">Días Laborables</label>
                  <div className="flex flex-wrap gap-2">
                    {diasSemana.map(dia => (
                      <label key={dia} className="cursor-pointer flex-1">
                        <input type="checkbox" className="peer sr-only" defaultChecked={dia !== 'Dom'} />
                        <div className="px-1 py-2.5 text-center rounded-xl text-[11px] font-semibold uppercase transition-all bg-slate-50 dark:bg-dark-light/5 text-slate-400 dark:text-white/40 border border-transparent peer-checked:bg-primary/10 peer-checked:text-primary peer-checked:border-primary/20 hover:bg-slate-100 dark:hover:bg-white/10 select-none">
                          {dia}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-emerald-50 dark:bg-primary/5 rounded-2xl border border-emerald-100 dark:border-primary/10 text-center">
                    <label className="text-[9px] font-bold uppercase text-emerald-600 dark:text-primary mb-2 block">Estado Inicial</label>
                    <button type="button" className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase text-emerald-600 dark:text-success w-full">
                      <CheckCircle2 size={16}/> Activo
                    </button>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-dark-light/5 rounded-2xl flex flex-col items-center justify-center border border-transparent dark:border-white/5">
                    <span className="text-xl font-bold text-slate-700 dark:text-white">0</span>
                    <span className="text-[8px] font-semibold uppercase text-slate-400 dark:text-white/40 mt-1">Empleados Asignados</span>
                  </div>
                </div>

                <div className="flex gap-4 mt-8 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 rounded-2xl font-bold uppercase text-[10px] text-slate-500 dark:text-white bg-slate-100 dark:bg-white/5 hover:bg-red-50 hover:text-red-500 dark:hover:bg-danger/10 dark:hover:text-danger transition-all">Cancelar</button>
                  <button type="submit" className="flex-[2] py-3.5 bg-primary text-white rounded-2xl font-bold uppercase text-[11px] tracking-widest shadow-lg shadow-primary/30 hover:bg-indigo-600 transition-colors">Guardar Turno</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}