import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, User, IdCard, Mail, Phone, Activity, Edit, Search, Filter, ImagePlus, CreditCard, PowerOff, CheckCircle2, Wifi, } from 'lucide-react';
import Swal from 'sweetalert2';

import * as api from '../services/api';
import type { Empleado, EmpleadoRequest, Cargo, Horario } from '../services/api';

const animProps = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };
const cardStyle = "bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-5 transition-colors relative";
const actionHoverEffect = "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800/50 cursor-pointer";
const inputStyle = "w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none text-[13px] font-bold text-slate-700 dark:text-white border border-transparent focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer";
const optionClassName = "bg-white dark:bg-slate-800 text-slate-700 dark:text-white font-bold py-2";

const SkeletonCard = () => (
  <motion.div {...animProps} className={`${cardStyle} animate-pulse flex flex-col h-full`}>
    <div className="absolute top-5 right-5 w-16 h-5 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
    <div className="flex items-center gap-4 mb-5"><div className="w-16 h-16 rounded-[1rem] bg-slate-200 dark:bg-slate-800 shrink-0"></div><div className="space-y-2 w-full"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div><div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div></div></div>
    <div className="space-y-3 mb-5 flex-1"><div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div><div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div><div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-4/6"></div></div>
    <div className="flex gap-2 w-full mt-auto"><div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl flex-1"></div></div>
  </motion.div>
);

const emptyForm: EmpleadoRequest & { id?: number, fotoUrl?: string } = {
  nombre: '', apellido: '', cedula: '', correo: '', telefono: '', nfcUid: '', cargoId: 0, horarioId: 0, activo: true
};

export default function Empleados() {
  const [isLoading, setIsLoading] = useState(true); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCargo, setFilterCargo] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  
  const [formData, setFormData] = useState(emptyForm);
  const [isScanning, setIsScanning] = useState(false);

  const fetchDatos = async () => {
    setIsLoading(true);
    try {
      const [empleadosData, cargosData, horariosData] = await Promise.all([
        api.getEmpleados(),
        api.getCargos(),
        api.getHorarios()
      ]);
      setEmpleados(empleadosData);
      setCargos(cargosData.filter((c: Cargo) => c.activo)); // Cargos activos para el modal
      setHorarios(horariosData.filter((h: Horario) => h.activo)); // Horarios activos para el modal
    } catch {
      Swal.fire("Error", "No se pudieron cargar los datos.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  const filteredEmpleados = useMemo(() => {
    return empleados.filter(emp => {
      const fullName = `${emp.nombre} ${emp.apellido}`.toLowerCase();
      const matchSearch = fullName.includes(searchTerm.toLowerCase()) || emp.cedula.includes(searchTerm);
      const matchCargo = filterCargo === 'all' || emp.cargo?.id?.toString() === filterCargo;
      const matchStatus = filterStatus === 'all' || (filterStatus === 'Activo' && emp.activo) || (filterStatus === 'Inactivo' && !emp.activo);
      return matchSearch && matchCargo && matchStatus;
    }).sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [empleados, searchTerm, filterCargo, filterStatus]);

  const handleOpenModal = (mode: 'add' | 'edit', emp?: Empleado) => {
    setModalMode(mode);
    if (mode === 'edit' && emp) {
      setFormData({
        id: emp.id,
        nombre: emp.nombre,
        apellido: emp.apellido,
        cedula: emp.cedula,
        correo: emp.correo,
        telefono: emp.telefono,
        nfcUid: emp.nfcUid,
        cargoId: emp.cargo?.id || (cargos.length > 0 ? cargos[0].id! : 0),
        horarioId: emp.horario?.id || (horarios.length > 0 ? horarios[0].id! : 0),
        activo: emp.activo ?? true,
        fotoUrl: emp.fotoUrl
      });
    } else {
      setFormData({
        ...emptyForm,
        cargoId: cargos.length > 0 ? cargos[0].id! : 0,
        horarioId: horarios.length > 0 ? horarios[0].id! : 0
      });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'cargoId' || name === 'horarioId' ? Number(value) : value }));
  };

  const iniciarEscaneoNFC = async () => {
    setIsScanning(true);
    try {
      await api.activarModoRegistro();
      let intentos = 0;
      const maxIntentos = 15;
      
      const intervalo = setInterval(async () => {
        intentos++;
        try {
          const respuesta = await api.leerTarjetaHardware();
          if (respuesta && respuesta.nfcUid !== "") {
            clearInterval(intervalo);
            setFormData(prev => ({ ...prev, nfcUid: respuesta.nfcUid }));
            setIsScanning(false);
            Swal.fire({ title: "¡Tarjeta Detectada!", icon: "success", toast: true, position: "top-end", timer: 3000, showConfirmButton: false });
          }
        } catch (error) { console.error(error); }

        if (intentos >= maxIntentos) {
          clearInterval(intervalo);
          setIsScanning(false);
          Swal.fire("Tiempo Agotado", "No pasaste ninguna tarjeta.", "info");
        }
      }, 1000);
    } catch {
      setIsScanning(false);
      Swal.fire("Error", "No se pudo activar el modo registro en el servidor.", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cargoId || !formData.horarioId) {
      Swal.fire("Atención", "Debes crear al menos un Cargo y un Horario antes de registrar empleados.", "warning");
      return;
    }
    const isDark = document.documentElement.classList.contains('dark');
    try {
      if (modalMode === 'add') {
        await api.crearEmpleado(formData);
      } else {
        await api.actualizarEmpleado(formData.id!, formData);
      }
      setIsModalOpen(false);
      fetchDatos();
      Swal.fire({ title: modalMode === 'add' ? '¡Registrado!' : '¡Actualizado!', text: `El empleado ha sido guardado correctamente.`, icon: 'success', background: isDark ? '#0f172a' : '#fff', color: isDark ? '#f8fafc' : '#334155', customClass: { popup: 'rounded-[2rem] border border-transparent dark:border-slate-800' } });
    } catch {
      Swal.fire("Error", "Hubo un problema. Verifica que la cédula, correo o UID NFC no estén repetidos.", "error");
    }
  };

  const handleToggleStatus = (emp: Empleado) => {
    const isDark = document.documentElement.classList.contains('dark');
    const isActivating = !emp.activo;

    Swal.fire({ 
      title: isActivating ? '¿Activar empleado?' : '¿Dar de baja?', 
      text: isActivating ? `${emp.nombre} volverá a tener acceso.` : `${emp.nombre} perderá el acceso al sistema.`, 
      icon: isActivating ? 'info' : 'warning', 
      showCancelButton: true, confirmButtonColor: isActivating ? '#10b981' : '#ef4444', cancelButtonColor: '#94a3b8', 
      confirmButtonText: isActivating ? 'Sí, activar' : 'Sí, desactivar', 
      background: isDark ? '#0f172a' : '#fff', color: isDark ? '#f8fafc' : '#334155', customClass: { popup: 'rounded-[2rem] border border-transparent dark:border-slate-800' } 
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (isActivating) {
            await api.actualizarEmpleado(emp.id!, {
              nombre: emp.nombre, apellido: emp.apellido, cedula: emp.cedula, correo: emp.correo,
              telefono: emp.telefono, nfcUid: emp.nfcUid, cargoId: emp.cargo!.id!, horarioId: emp.horario!.id!, activo: true
            });
          } else {
            await api.desactivarEmpleado(emp.id!);
          }
          fetchDatos();
          Swal.fire({ title: isActivating ? 'Activado' : 'Desactivado', icon: 'success', background: isDark ? '#0f172a' : '#fff', color: isDark ? '#f8fafc' : '#334155', customClass: { popup: 'rounded-[2rem] border border-transparent dark:border-slate-800' } });
        } catch {
          Swal.fire("Error", "No se pudo cambiar el estado.", "error");
        }
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
            <input type="text" placeholder="Buscar por nombre o cédula..." className={`${inputStyle} cursor-text`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="relative flex-1 w-full sm:w-auto min-w-[140px]">
            <Activity size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <select className={inputStyle} onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus}>
              <option value="all" className={optionClassName}>Todos los estados</option>
              <option value="Activo" className={optionClassName}>Activos</option>
              <option value="Inactivo" className={optionClassName}>Inactivos</option>
            </select>
          </div>
          <div className="relative flex-1 w-full sm:w-auto min-w-[140px]">
            <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <select className={inputStyle} onChange={(e) => setFilterCargo(e.target.value)} value={filterCargo}>
              <option value="all" className={optionClassName}>Todos los cargos</option>
              {cargos.map(c => <option key={c.id} value={c.id} className={optionClassName}>{c.nombre}</option>)}
            </select>
          </div>
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
               <p className="text-xs font-medium text-slate-500 dark:text-slate-500">Ajusta los filtros o registra uno nuevo</p>
             </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredEmpleados.map((emp, index) => (
                <motion.div 
                  key={emp.id} 
                  layout 
                  {...animProps} 
                  transition={{ delay: index * 0.05 }} 
                  className={`${cardStyle} flex flex-col group ${actionHoverEffect} ${!emp.activo ? 'opacity-70 bg-slate-50/80 dark:bg-slate-900/60' : ''}`}
                >
                  
                  <div className={`absolute top-5 right-5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5 ${emp.activo ? 'bg-emerald-50 text-emerald-600 dark:bg-success/10 dark:text-success' : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                    <span className={emp.activo ? "w-1.5 h-1.5 rounded-full bg-emerald-500" : ""}></span> {emp.activo ? 'Activo' : 'Inactivo'}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-[1rem] flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0 text-xl font-black ${emp.activo ? 'bg-primary/10 text-primary' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                      {emp.fotoUrl ? (
                        <img src={emp.fotoUrl} alt={emp.nombre} className={`w-full h-full object-cover ${!emp.activo ? 'grayscale opacity-75' : ''}`} />
                      ) : (
                        `${emp.nombre.charAt(0)}${emp.apellido.charAt(0)}`
                      )}
                    </div>
                    <div className="min-w-0 pr-10">
                      <h3 className={`text-base font-bold leading-tight truncate ${emp.activo ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{emp.nombre} {emp.apellido}</h3>
                      <p className={`text-xs font-semibold uppercase tracking-widest mt-1 mb-1 truncate ${emp.activo ? 'text-primary' : 'text-slate-500'}`}>{emp.cargo?.nombre || 'Sin Cargo'}</p>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase truncate font-mono">UID: {emp.nfcUid || 'No asignado'}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6 flex-1">
                    <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <div className="w-6 h-6 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0"><Mail size={12} className={emp.activo ? 'text-primary' : 'text-slate-400'}/></div>
                      <span className="truncate">{emp.correo}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <div className="w-6 h-6 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0"><Phone size={12} className={emp.activo ? 'text-primary' : 'text-slate-400'}/></div>
                      <span className="truncate">{emp.telefono}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <div className="w-6 h-6 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0"><IdCard size={12} className={emp.activo ? 'text-primary' : 'text-slate-400'}/></div>
                      <span className="truncate">{emp.cedula}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-3 border-t border-slate-50 dark:border-slate-800/50 mb-3">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1">Horario Asignado</p>
                      <p className={`text-xs font-bold truncate ${emp.activo ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500'}`}>{emp.horario?.nombre || 'Ninguno'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1">Fecha de Ingreso</p>
                      <p className={`text-xs font-bold ${emp.activo ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500'}`}>{emp.fechaIngreso || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full pt-4 border-t border-slate-50 dark:border-slate-800/50 mt-1.5">
                    <button onClick={() => handleOpenModal('edit', emp)} className="flex-1 flex justify-center items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 py-3 rounded-xl text-[11px] font-bold uppercase hover:bg-primary hover:text-white dark:hover:bg-primary transition-all duration-150 border border-transparent hover:border-primary/20">
                      <Edit size={14} /> <span className="italic truncate">Editar</span>
                    </button>
                    
                    {/* BOTONES DE ACCIÓN MEJORADOS */}
                    {emp.activo ? (
                      <button onClick={() => handleToggleStatus(emp)} className="flex-1 flex justify-center items-center gap-1.5 py-3 rounded-xl text-[11px] font-bold uppercase transition-all border border-transparent bg-red-50 text-red-600 hover:bg-red-500 hover:text-white dark:bg-danger/10 dark:text-danger dark:hover:bg-danger">
                        <PowerOff size={14} /> <span className="italic truncate">Dar de Baja</span>
                      </button>
                    ) : (
                      <button onClick={() => handleToggleStatus(emp)} className="flex-1 flex justify-center items-center gap-1.5 py-3 rounded-xl text-[11px] font-bold uppercase transition-all border border-transparent bg-slate-800 text-white hover:bg-emerald-500 dark:bg-white dark:text-slate-900 dark:hover:bg-success shadow-md">
                        <CheckCircle2 size={14} /> <span className="italic truncate">Reactivar</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div> 
      </main>

      {/* MODAL (SIN CAMBIOS) */}
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
                  
                  {/* FOTO (Preview) */}
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden relative group">
                    {formData.fotoUrl ? <img src={formData.fotoUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Preview" /> : <ImagePlus size={36} className="text-primary/40 group-hover:scale-110 transition-transform" />}
                    <label className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all duration-300">
                      <ImagePlus size={24} className="text-white mb-2" />
                      <span className="text-[9px] font-bold text-white uppercase tracking-widest">En desarrollo</span>
                    </label>
                  </div>

                  {/* LECTOR NFC */}
                  <div className={`w-full p-4 sm:p-5 rounded-2xl sm:rounded-3xl border text-center transition-all ${formData.nfcUid ? 'bg-emerald-50 dark:bg-success/10 border-emerald-100 dark:border-success/20 text-emerald-600 dark:text-success' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}>
                    <label className={`text-[9px] font-bold uppercase block mb-3 tracking-widest ${formData.nfcUid ? 'text-emerald-600 dark:text-success' : 'text-slate-500'}`}>
                      Vínculo Tarjeta NFC
                    </label>
                    
                    {formData.nfcUid ? (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-center gap-2">
                          <CreditCard size={18} />
                          <span className="font-mono text-[11px] sm:text-[13px] font-bold tracking-widest">{formData.nfcUid}</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setFormData(prev => ({ ...prev, nfcUid: '' }))}
                          className="text-[10px] uppercase font-bold text-emerald-700/70 hover:text-emerald-700 dark:text-success/70 dark:hover:text-success transition-colors flex items-center justify-center gap-1 mx-auto"
                        >
                          <Edit size={12} /> Reasignar Tarjeta
                        </button>
                      </div>
                    ) : (
                      <button type="button" onClick={iniciarEscaneoNFC} disabled={isScanning} className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all ${isScanning ? 'bg-primary/20 text-primary cursor-wait' : 'bg-primary text-white hover:bg-indigo-600'}`}>
                        {isScanning ? <><Wifi size={16} className="animate-pulse" /> Esperando Tarjeta...</> : <><CreditCard size={16} /> Escanear Tarjeta</>}
                      </button>
                    )}
                  </div>
                </div>

                {/* CAMPOS DE TEXTO */}
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
                      <select name="cargoId" value={formData.cargoId} onChange={handleInputChange} required className={inputStyle}>
                        <option value="0" disabled className={optionClassName}>Selecciona Cargo...</option>
                        {cargos.map(c => <option key={c.id} value={c.id} className={optionClassName}>{c.nombre}</option>)}
                      </select>
                    </div>
                    <div className="relative">
                      <select name="horarioId" value={formData.horarioId} onChange={handleInputChange} required className={inputStyle}>
                        <option value="0" disabled className={optionClassName}>Selecciona Horario...</option>
                        {horarios.map(h => <option key={h.id} value={h.id} className={optionClassName}>{h.nombre}</option>)}
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