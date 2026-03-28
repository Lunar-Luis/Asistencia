import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Briefcase, FileText, Users, Search, Filter, ArrowUpDown, Edit, Trash2, CheckCircle2, PowerOff } from 'lucide-react';
import Swal from 'sweetalert2';

const animProps = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };
const cardStyle = "bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-6 md:p-8 transition-colors relative";
const actionHoverEffect = "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800/50 cursor-pointer";
const inputStyle = "w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none text-[13px] font-bold text-slate-700 dark:text-white border border-transparent focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer";
const optionClassName = "bg-white dark:bg-slate-800 text-slate-700 dark:text-white font-bold py-2";

const SkeletonCargo = () => (
  <motion.div {...animProps} className={`${cardStyle} animate-pulse flex flex-col h-full`}>
    <div className="absolute top-6 right-6 w-16 h-5 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
    <div className="flex items-center gap-4 mb-6 pt-1">
      <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0"></div>
      <div className="w-full space-y-2">
        <div className="w-3/4 h-5 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="w-1/2 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
    </div>
    <div className="space-y-4 mb-6 flex-1">
      <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
      <div className="w-5/6 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
      <div className="w-4/6 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
    </div>
    <div className="flex gap-2 w-full mt-auto pt-4 border-t border-slate-50 dark:border-slate-800/50">
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl flex-1"></div>
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl flex-1"></div>
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-12 shrink-0"></div>
    </div>
  </motion.div>
);

export default function Cargos() {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const [cargos, setCargos] = useState([
    { id: 1, nombre: 'Administrador', descripcion: 'Gestión completa del sistema y control de accesos. Modificación de turnos y usuarios.', empleadosCount: 2, status: 'Activo' },
    { id: 2, nombre: 'Recursos Humanos', descripcion: 'Manejo de nómina, empleados y reportes de asistencia general.', empleadosCount: 3, status: 'Activo' },
    { id: 3, nombre: 'Desarrollador', descripcion: 'Mantenimiento de la infraestructura técnica y biométrica de la institución.', empleadosCount: 4, status: 'Activo' },
    { id: 4, nombre: 'Operario', descripcion: 'Personal de planta con horarios rotativos asignados por el sistema principal.', empleadosCount: 15, status: 'Inactivo' },
  ]);

  const filteredCargos = useMemo(() => {
    return cargos.filter(cargo => cargo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) && (filterStatus === 'all' || cargo.status === filterStatus)).sort((a, b) => sortOrder === 'asc' ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre));
  }, [cargos, searchTerm, filterStatus, sortOrder]);

  const handleDelete = (id: number, nombre: string) => {
    const isDark = document.documentElement.classList.contains('dark');
    Swal.fire({ title: '¿Eliminar cargo?', text: `Esta acción afectará a los empleados asignados a ${nombre}.`, icon: 'error', showCancelButton: true, confirmButtonColor: '#ff7782', cancelButtonColor: '#94a3b8', confirmButtonText: 'Sí, eliminar', background: isDark ? '#0f172a' : '#fff', color: isDark ? '#f8fafc' : '#334155', customClass: { popup: 'rounded-[2rem] border border-transparent dark:border-slate-800' } }).then((result) => {
      if (result.isConfirmed) {
        setCargos(cargos.filter(c => c.id !== id));
        Swal.fire({ title: 'Eliminado', icon: 'success', background: isDark ? '#0f172a' : '#fff', color: isDark ? '#f8fafc' : '#334155', customClass: { popup: 'rounded-[2rem] border border-transparent dark:border-slate-800' } });
      }
    });
  };

  const handleToggleStatus = (id: number, nombre: string, currentStatus: string) => {
    const isDark = document.documentElement.classList.contains('dark');
    const isActivating = currentStatus === 'Inactivo';
    Swal.fire({ title: isActivating ? '¿Activar cargo?' : '¿Desactivar cargo?', text: isActivating ? `El cargo ${nombre} volverá a estar disponible.` : `El cargo ${nombre} no podrá ser asignado a nuevos empleados.`, icon: isActivating ? 'info' : 'warning', showCancelButton: true, confirmButtonColor: isActivating ? '#10b981' : '#f59e0b', cancelButtonColor: '#94a3b8', confirmButtonText: isActivating ? 'Sí, activar' : 'Sí, desactivar', background: isDark ? '#0f172a' : '#fff', color: isDark ? '#f8fafc' : '#334155', customClass: { popup: 'rounded-[2rem] border border-transparent dark:border-slate-800' } }).then((result) => {
      if (result.isConfirmed) {
        setCargos(cargos.map(c => c.id === id ? { ...c, status: isActivating ? 'Activo' : 'Inactivo' } : c));
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
              <span className="bg-gradient-to-r from-primary via-indigo-900 to-primary dark:via-white bg-[length:200%_auto] bg-clip-text text-transparent inline-block NOT-italic py-1 px-2">
                Cargos
              </span>
            </h1>
            <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] sm:tracking-[0.4em] mt-2">
              Estructura Organizacional y Roles ({cargos.length})
            </p>
          </div>
          <button onClick={() => { setModalMode('add'); setIsModalOpen(true); }} className="bg-primary hover:bg-indigo-600 text-white px-7 py-3.5 rounded-2xl font-bold uppercase text-[13px] tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-colors self-start sm:self-end whitespace-nowrap w-full sm:w-auto">
            <Plus size={20} /> Nuevo Cargo
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-3 sm:gap-4 bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 items-center shadow-sm mb-8">
          <div className="relative flex-[2] w-full sm:w-auto min-w-[250px]">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input type="text" placeholder="Buscar cargos por nombre..." className={`${inputStyle} cursor-text`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="relative flex-1 w-full sm:w-auto min-w-[160px]">
            <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <select className={inputStyle} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all" className={optionClassName}>Todos los estados</option>
              <option value="Activo" className={optionClassName}>Activos</option>
              <option value="Inactivo" className={optionClassName}>Inactivos</option>
            </select>
          </div>
          <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl font-bold uppercase text-xs text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary transition-colors flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto sm:ml-auto border border-transparent">
            <ArrowUpDown size={16} /> {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            <><SkeletonCargo /><SkeletonCargo /><SkeletonCargo /><SkeletonCargo /></>
          ) : filteredCargos.length === 0 ? (
             <div className="col-span-full py-12 text-center">
               <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-800">
                 <Briefcase size={32} className="text-slate-300 dark:text-slate-600" />
               </div>
               <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">No hay cargos</h3>
               <p className="text-sm font-medium text-slate-500 dark:text-slate-500">Ajusta los filtros de búsqueda</p>
             </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredCargos.map((cargo, index) => (
                <motion.div key={cargo.id} layout {...animProps} transition={{ delay: index * 0.05 }} className={`${cardStyle} flex flex-col group ${actionHoverEffect} ${cargo.status === 'Inactivo' ? 'opacity-75 hover:opacity-100 grayscale-[0.3]' : ''}`}>
                  <div className={`absolute top-6 right-6 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase ${cargo.status === 'Activo' ? 'bg-emerald-50 text-emerald-600 dark:bg-success/10 dark:text-success' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                    ● {cargo.status}
                  </div>

                  <div className="flex items-center gap-4 mb-5 pt-1">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <Briefcase size={26} />
                    </div>
                    <div className="min-w-0 pr-12">
                      <h3 className="text-[17px] font-bold text-slate-800 dark:text-white leading-tight truncate">{cargo.nombre}</h3>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary uppercase mt-1">
                        <Users size={14} /> {cargo.empleadosCount} Empleados
                      </div>
                    </div>
                  </div>

                  <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-6 flex-1">
                    {cargo.descripcion}
                  </p>

                  {/* NUEVOS BOTONES (Igual que empleados) */}
                  <div className="flex gap-2 w-full pt-4 border-t border-slate-50 dark:border-slate-800/50 mt-auto">
                    <button onClick={() => { setModalMode('edit'); setIsModalOpen(true); }} className="flex-1 flex justify-center items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 py-3 rounded-xl text-[11px] font-bold uppercase hover:bg-primary hover:text-white dark:hover:bg-primary transition-all duration-150 border border-transparent hover:border-primary/20">
                      <Edit size={14} /> <span className="italic truncate">Editar</span>
                    </button>
                    <button onClick={() => handleToggleStatus(cargo.id, cargo.nombre, cargo.status)} className={`flex-1 flex justify-center items-center gap-1.5 py-3 rounded-xl text-[11px] font-bold uppercase transition-all border border-transparent ${cargo.status === 'Activo' ? 'bg-amber-50 dark:bg-warning/10 text-amber-600 dark:text-warning hover:bg-amber-500 hover:text-white dark:hover:bg-warning' : 'bg-emerald-50 dark:bg-success/10 text-emerald-600 dark:text-success hover:bg-emerald-500 hover:text-white dark:hover:bg-success'}`}>
                      {cargo.status === 'Activo' ? <><PowerOff size={14} /> <span className="italic truncate">Desactivar</span></> : <><CheckCircle2 size={14} /> <span className="italic truncate">Activar</span></>}
                    </button>
                    <button onClick={() => handleDelete(cargo.id, cargo.nombre)} className="w-12 flex justify-center items-center shrink-0 bg-red-50 dark:bg-danger/10 text-red-500 dark:text-danger rounded-xl hover:bg-red-500 hover:text-white dark:hover:bg-danger transition-all border border-transparent hover:border-red-200">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 z-[200] flex justify-center items-center p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[3rem] sm:rounded-[3.5rem] w-full max-w-[600px] relative shadow-2xl border border-transparent dark:border-slate-800 max-h-[90vh] overflow-y-auto">
              <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 sm:right-8 sm:top-8 text-3xl text-slate-400 hover:text-red-500 transition-colors">&times;</button>
              <h2 className="text-2xl sm:text-3xl font-bold uppercase italic tracking-tighter mb-1 text-slate-800 dark:text-white">
                {modalMode === 'add' ? 'Crear Nuevo' : 'Actualizar'} <span className="text-primary NOT-italic">Cargo</span>
              </h2>
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-8">Definición de responsabilidades y jerarquía</p>
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
                <div className="relative">
                  <label className="text-[10px] font-bold uppercase text-primary mb-2 block ml-2">Nombre del Cargo</label>
                  <div className="relative">
                    <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input type="text" required placeholder="Ej: Supervisor de Planta" className={`${inputStyle} cursor-text`} />
                  </div>
                </div>
                <div className="relative">
                  <label className="text-[10px] font-bold uppercase text-primary mb-2 block ml-2">Descripción de Funciones</label>
                  <div className="relative">
                    <FileText size={18} className="absolute left-4 top-4 text-slate-400 dark:text-slate-500" />
                    <textarea rows={4} required placeholder="Describe las responsabilidades principales..." className={`${inputStyle} cursor-text resize-none`} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="p-5 bg-emerald-50 dark:bg-success/10 rounded-2xl border border-emerald-100 dark:border-success/20 text-center">
                    <label className="text-[10px] font-bold uppercase text-emerald-600 dark:text-success mb-2 block">Estado Inicial</label>
                    <button type="button" className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase text-emerald-600 dark:text-success w-full"><CheckCircle2 size={18}/> Activo</button>
                  </div>
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800">
                    <span className="text-2xl font-bold text-slate-700 dark:text-slate-200">0</span>
                    <span className="text-[9px] font-semibold uppercase text-slate-500 dark:text-slate-400 mt-1">Empleados Iniciales</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="w-full sm:flex-1 py-4 rounded-xl sm:rounded-2xl font-bold uppercase text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-500 dark:hover:bg-danger/10 dark:hover:text-danger transition-all border border-transparent hover:border-red-200 dark:hover:border-danger/20">Cancelar</button>
                  <button type="submit" className="w-full sm:flex-[2] py-4 bg-primary hover:bg-indigo-600 text-white rounded-xl sm:rounded-2xl font-bold uppercase text-[12px] tracking-widest shadow-lg shadow-primary/30 transition-colors">Confirmar Registro</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}