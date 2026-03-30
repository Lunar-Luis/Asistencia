import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, User, IdCard, Mail, Phone, Clock, Activity, Edit, Trash2, Search, Filter, ArrowUpDown, ImagePlus, CreditCard, PowerOff, CheckCircle2, Wifi } from 'lucide-react';
import Swal from 'sweetalert2';

import { api, type Empleado } from '../services/mockData';

const animProps = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };
const cardStyle = "bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-5 transition-colors relative";
const actionHoverEffect = "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800/50";
const inputStyle = "w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none text-[13px] font-bold text-slate-700 dark:text-white border border-transparent focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer";
const optionClassName = "bg-white dark:bg-slate-800 text-slate-700 dark:text-white font-bold py-2";

const SkeletonCard = () => (
  <motion.div {...animProps} className={`${cardStyle} animate-pulse flex flex-col h-full`}>
    <div className="absolute top-5 right-5 w-16 h-5 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
    <div className="flex items-center gap-4 mb-5"><div className="w-16 h-16 rounded-[1rem] bg-slate-200 dark:bg-slate-800 shrink-0"></div><div className="space-y-2 w-full"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div><div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div></div></div>
    <div className="space-y-3 mb-5 flex-1"><div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div><div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div><div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-4/6"></div></div>
    <div className="grid grid-cols-2 gap-4 py-3 border-t border-slate-50 dark:border-slate-800/50 mb-4"><div><div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-2"></div><div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div></div><div className="flex flex-col items-end"><div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-2"></div><div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div></div></div>
    <div className="flex gap-2 w-full pt-4 border-t border-slate-50 dark:border-slate-800/50 mt-auto"><div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl flex-1"></div><div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl flex-1"></div><div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-12 shrink-0"></div></div>
  </motion.div>
);

// ESTADO INICIAL VACÍO PARA EL FORMULARIO
const emptyForm = {
  id: 0, nombre: '', apellido: '', cedula: '', cargo: '', departamento: '', correo: '', telefono: '', nfc_uid: '', ingreso: '', horario: '', status: 'Activo' as 'Activo'|'Inactivo', foto: null as string|null
};

export default function Empleados() {
  const [isLoading, setIsLoading] = useState(true); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCargo, setFilterCargo] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterHorario, setFilterHorario] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  
  // NUEVOS ESTADOS PARA EL FORMULARIO Y NFC (Eliminamos el useRef que causaba error)
  const [formData, setFormData] = useState(emptyForm);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const fetchDatos = async () => {
      setIsLoading(true);
      try {
        const data = await api.getEmpleados();
        setEmpleados(data);
      } catch (error) {
        console.error("Error cargando empleados", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDatos();
  }, []);

  const cargos = ['Administrador', 'Recursos Humanos', 'Desarrollador', 'Operario'];
  const estados = ['Activo', 'Inactivo'];
  const horarios = ['Horario Normal', 'Seguridad', 'Flexible', 'Turno Operativo CMBT'];
  
  const filteredEmpleados = useMemo(() => {
    return empleados.filter(emp => emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) && (filterCargo === 'all' || emp.cargo === filterCargo) && (filterStatus === 'all' || emp.status === filterStatus) && (filterHorario === 'all' || emp.horario === filterHorario)).sort((a, b) => sortOrder === 'asc' ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre));
  }, [empleados, searchTerm, filterCargo, filterStatus, filterHorario, sortOrder]);

  // --- MANEJO DEL MODAL Y FORMULARIO ---
  const handleOpenModal = (mode: 'add' | 'edit', emp?: Empleado) => {
    setModalMode(mode);
    if (mode === 'edit' && emp) {
      // Separar nombre y apellido (simplificado)
      const [nombre, ...apellidos] = emp.nombre.split(' ');
      setFormData({
        ...emp,
        nombre: nombre,
        apellido: apellidos.join(' '),
      });
    } else {
      setFormData(emptyForm);
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) { 
      setFormData(prev => ({ ...prev, foto: URL.createObjectURL(e.target.files![0]) }));
    }
  };

  // Simula la lectura de una tarjeta física
  const simularEscaneoNFC = () => {
    setIsScanning(true);
    // Simula que el lector tarda 2 segundos en leer la tarjeta
    setTimeout(() => {
      const randomUID = Array.from({length: 4}, () => Math.floor(Math.random()*256).toString(16).padStart(2, '0').toUpperCase()).join(':');
      setFormData(prev => ({ ...prev, nfc_uid: randomUID }));
      setIsScanning(false);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    const isDark = document.documentElement.classList.contains('dark');
    
    // Alerta de Éxito
    Swal.fire({ 
      title: modalMode === 'add' ? '¡Empleado Registrado!' : '¡Empleado Actualizado!', 
      text: `Los datos de ${formData.nombre} han sido guardados correctamente.`,
      icon: 'success', 
      background: isDark ? '#0f172a' : '#fff', 
      color: isDark ? '#f8fafc' : '#334155', 
      customClass: { popup: 'rounded-[2rem] border border-transparent dark:border-slate-800' } 
    });

    // En un caso real, aquí harías el POST o PUT a tu API.
    // Por ahora, solo cerramos el modal.
  };

  // --- MANEJO DE ELIMINAR / ESTADO ---
  const handleDelete = (id: number, nombre: string) => {
    const isDark = document.documentElement.classList.contains('dark');
    Swal.fire({ title: '¿Eliminar definitivamente?', text: `Eliminarás a ${nombre} permanentemente.`, icon: 'error', showCancelButton: true, confirmButtonColor: '#ff7782', cancelButtonColor: '#94a3b8', confirmButtonText: 'Sí, eliminar', background: isDark ? '#0f172a' : '#fff', color: isDark ? '#f8fafc' : '#334155', customClass: { popup: 'rounded-[2rem] border border-transparent dark:border-slate-800' } }).then((result) => {
      if (result.isConfirmed) {
        setEmpleados(empleados.filter(e => e.id !== id));
        Swal.fire({ title: 'Eliminado', icon: 'success', background: isDark ? '#0f172a' : '#fff', color: isDark ? '#f8fafc' : '#334155', customClass: { popup: 'rounded-[2rem] border border-transparent dark:border-slate-800' } });
      }
    });
  };

  const handleToggleStatus = (id: number, nombre: string, currentStatus: string) => {
    const isDark = document.documentElement.classList.contains('dark');
    const isActivating = currentStatus === 'Inactivo';
    Swal.fire({ title: isActivating ? '¿Activar empleado?' : '¿Desactivar empleado?', text: isActivating ? `${nombre} volverá a tener acceso.` : `${nombre} perderá el acceso al sistema.`, icon: isActivating ? 'info' : 'warning', showCancelButton: true, confirmButtonColor: isActivating ? '#10b981' : '#f59e0b', cancelButtonColor: '#94a3b8', confirmButtonText: isActivating ? 'Sí, activar' : 'Sí, desactivar', background: isDark ? '#0f172a' : '#fff', color: isDark ? '#f8fafc' : '#334155', customClass: { popup: 'rounded-[2rem] border border-transparent dark:border-slate-800' } }).then((result) => {
      if (result.isConfirmed) {
        setEmpleados(empleados.map(emp => emp.id === id ? { ...emp, status: isActivating ? 'Activo' : 'Inactivo' } : emp));
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
                Empleados
              </span>
            </h1>
            <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] sm:tracking-[0.4em] mt-2">
              Personal Administrativo y Operativo ({empleados.length})
            </p>
          </div>
          <button onClick={() => handleOpenModal('add')} className="bg-primary hover:bg-indigo-600 text-white px-7 py-3.5 rounded-2xl font-bold uppercase text-[13px] tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-colors self-start sm:self-end whitespace-nowrap w-full sm:w-auto">
            <Plus size={20} /> Registrar
          </button>
        </motion.div>

        {/* FILTROS */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-3 sm:gap-4 bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 items-center shadow-sm mb-8">
          <div className="relative flex-[1.5] w-full sm:w-auto min-w-[200px]">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input type="text" placeholder="Buscar por nombre..." className={`${inputStyle} cursor-text`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="relative flex-1 w-full sm:w-auto min-w-[140px]">
            <Activity size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <select className={inputStyle} onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus}>
              <option value="all" className={optionClassName}>Todos los estados</option>
              {estados.map(s => <option key={s} value={s} className={optionClassName}>{s}</option>)}
            </select>
          </div>
          <div className="relative flex-1 w-full sm:w-auto min-w-[140px]">
            <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <select className={inputStyle} onChange={(e) => setFilterCargo(e.target.value)} value={filterCargo}>
              <option value="all" className={optionClassName}>Todos los cargos</option>
              {cargos.map(c => <option key={c} value={c} className={optionClassName}>{c}</option>)}
            </select>
          </div>
          <div className="relative flex-1 w-full sm:w-auto min-w-[140px]">
            <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <select className={inputStyle} onChange={(e) => setFilterHorario(e.target.value)} value={filterHorario}>
              <option value="all" className={optionClassName}>Todos los horarios</option>
              {horarios.map(h => <option key={h} value={h} className={optionClassName}>{h}</option>)}
            </select>
          </div>
          <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl font-bold uppercase text-xs text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary transition-colors flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto sm:ml-auto border border-transparent">
            <ArrowUpDown size={16} /> {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
          </button>
        </motion.div>

        {/* TARJETAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
          ) : filteredEmpleados.length === 0 ? (
             <div className="col-span-full py-12 text-center">
               <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-800">
                 <User size={32} className="text-slate-300 dark:text-slate-600" />
               </div>
               <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">No hay empleados</h3>
               <p className="text-xs font-medium text-slate-500 dark:text-slate-500">Ajusta los filtros de búsqueda</p>
             </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredEmpleados.map((emp, index) => (
                <motion.div key={emp.id} layout {...animProps} transition={{ delay: index * 0.05 }} className={`${cardStyle} flex flex-col group ${actionHoverEffect} ${emp.status === 'Inactivo' ? 'opacity-75 hover:opacity-100 grayscale-[0.3]' : ''}`}>
                  <div className={`absolute top-5 right-5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase ${emp.status === 'Activo' ? 'bg-emerald-50 text-emerald-600 dark:bg-success/10 dark:text-success' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                    ● {emp.status}
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-[1rem] bg-primary/5 dark:bg-primary/10 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0">
                      <img src={emp.foto || `https://ui-avatars.com/api/?name=${emp.nombre}&background=7380ec&color=fff`} alt={emp.nombre} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 pr-10">
                      <h3 className="text-base font-bold text-slate-800 dark:text-white leading-tight truncate">{emp.nombre}</h3>
                      <p className="text-xs font-semibold text-primary uppercase tracking-widest mt-1 mb-1 truncate">{emp.cargo}</p>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase truncate">{emp.departamento}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-6 flex-1">
                    <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <div className="w-6 h-6 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary shrink-0"><Mail size={12}/></div>
                      <span className="truncate">{emp.correo}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <div className="w-6 h-6 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary shrink-0"><Phone size={12}/></div>
                      <span className="truncate">{emp.telefono}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <div className="w-6 h-6 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary shrink-0"><IdCard size={12}/></div>
                      <span className="truncate">{emp.cedula}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-3 border-t border-slate-50 dark:border-slate-800/50 mb-3">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1">Horario Asignado</p>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{emp.horario}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1">Fecha de Ingreso</p>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{emp.ingreso}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full pt-4 border-t border-slate-50 dark:border-slate-800/50 mt-1.5">
                    <button onClick={() => handleOpenModal('edit', emp)} className="flex-1 flex justify-center items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 py-3 rounded-xl text-[11px] font-bold uppercase hover:bg-primary hover:text-white dark:hover:bg-primary transition-all duration-150 border border-transparent hover:border-primary/20">
                      <Edit size={14} /> <span className="italic truncate">Editar</span>
                    </button>
                    <button onClick={() => handleToggleStatus(emp.id, emp.nombre, emp.status)} className={`flex-1 flex justify-center items-center gap-1.5 py-3 rounded-xl text-[11px] font-bold uppercase transition-all border border-transparent ${emp.status === 'Activo' ? 'bg-amber-50 dark:bg-warning/10 text-amber-600 dark:text-warning hover:bg-amber-500 hover:text-white dark:hover:bg-warning' : 'bg-emerald-50 dark:bg-success/10 text-emerald-600 dark:text-success hover:bg-emerald-500 hover:text-white dark:hover:bg-success'}`}>
                      {emp.status === 'Activo' ? <><PowerOff size={14} /> <span className="italic truncate">Desactivar</span></> : <><CheckCircle2 size={14} /> <span className="italic truncate">Activar</span></>}
                    </button>
                    <button onClick={() => handleDelete(emp.id, emp.nombre)} className="w-12 flex justify-center items-center shrink-0 bg-red-50 dark:bg-danger/10 text-red-500 dark:text-danger rounded-xl hover:bg-red-500 hover:text-white dark:hover:bg-danger transition-all border border-transparent hover:border-red-200">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div> 
      </main>

      {/* MODAL DE REGISTRO/EDICIÓN */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 z-[200] flex justify-center items-center p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[3rem] sm:rounded-[3.5rem] w-full max-w-[750px] relative shadow-2xl border border-transparent dark:border-slate-800 max-h-[90vh] overflow-y-auto">
              <button type="button" onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 sm:right-8 sm:top-8 text-2xl text-slate-400 hover:text-red-500 transition-colors">&times;</button>
              <h2 className="text-xl sm:text-2xl font-bold uppercase italic tracking-tighter mb-1 text-slate-800 dark:text-white">
                {modalMode === 'add' ? 'Registrar' : 'Actualizar'} <span className="text-primary not-italic">Empleado</span>
              </h2>
              <p className="text-[9px] sm:text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-8">Información institucional y acceso biométrico</p>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-6 md:pb-0 md:pr-6 space-y-6">
                  
                  {/* FOTO */}
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden relative group">
                    {formData.foto ? <img src={formData.foto} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Preview" /> : <ImagePlus size={36} className="text-primary/40 group-hover:scale-110 transition-transform" />}
                    <label className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all duration-300">
                      <ImagePlus size={24} className="text-white mb-2" />
                      <span className="text-[9px] font-bold text-white uppercase tracking-widest">Subir Foto</span>
                      <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                    </label>
                  </div>

                  {/* LECTOR NFC */}
                  <div className={`w-full p-4 sm:p-5 rounded-2xl sm:rounded-3xl border text-center transition-all ${formData.nfc_uid ? 'bg-emerald-50 dark:bg-success/10 border-emerald-100 dark:border-success/20 text-emerald-600 dark:text-success' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}>
                    <label className={`text-[9px] font-bold uppercase block mb-3 tracking-widest ${formData.nfc_uid ? 'text-emerald-600 dark:text-success' : 'text-slate-500'}`}>Vínculo Tarjeta NFC</label>
                    
                    {formData.nfc_uid ? (
                      <div className="flex items-center justify-center gap-2">
                        <CreditCard size={18} />
                        <span className="font-mono text-[11px] sm:text-[13px] font-bold tracking-widest">{formData.nfc_uid}</span>
                      </div>
                    ) : (
                      <button 
                        type="button" 
                        onClick={simularEscaneoNFC}
                        disabled={isScanning}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all ${isScanning ? 'bg-primary/20 text-primary cursor-wait' : 'bg-primary text-white hover:bg-indigo-600'}`}
                      >
                        {isScanning ? (
                           <><Wifi size={16} className="animate-pulse" /> Esperando Tarjeta...</>
                        ) : (
                           <><CreditCard size={16} /> Escanear Tarjeta</>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* CAMPOS DE TEXTO (Vinculados al estado formData) */}
                <div className="space-y-4">
                  <div className="relative">
                    <IdCard size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input type="text" name="cedula" value={formData.cedula} onChange={handleInputChange} placeholder="Cédula / DNI" required className={`${inputStyle} cursor-text`} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                      <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Nombre" required className={`${inputStyle} cursor-text`} />
                    </div>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                      <input type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} placeholder="Apellido" required className={`${inputStyle} cursor-text`} />
                    </div>
                  </div>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input type="email" name="correo" value={formData.correo} onChange={handleInputChange} placeholder="Correo electrónico" required className={`${inputStyle} cursor-text`} />
                  </div>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input type="text" name="telefono" value={formData.telefono} onChange={handleInputChange} placeholder="Teléfono" required className={`${inputStyle} cursor-text`} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <select name="cargo" value={formData.cargo} onChange={handleInputChange} required className={inputStyle}>
                        <option value="" className={optionClassName}>Cargo...</option>
                        {cargos.map(c => <option key={c} value={c} className={optionClassName}>{c}</option>)}
                      </select>
                    </div>
                    <div className="relative">
                      <select name="horario" value={formData.horario} onChange={handleInputChange} required className={inputStyle}>
                        <option value="" className={optionClassName}>Horario...</option>
                        {horarios.map(h => <option key={h} value={h} className={optionClassName}>{h}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
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