import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Importamos TODOS los iconos desde Lucide-React
import { 
  Plus, User, IdCard, Mail, Phone, Clock, 
  Activity, Edit, Trash2, Search, Filter, 
  ArrowUpDown, ImagePlus, CreditCard 
} from 'lucide-react';
import Swal from 'sweetalert2';

// ==========================================
// ESTILOS GLOBALES CORPORATIVOS (Hover Suave)
// ==========================================
const hoverEffect = "transition-all duration-200 hover:shadow-md border border-transparent hover:border-slate-200 dark:hover:border-slate-700 dark:hover:bg-white/5";

const animProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

// ==========================================
// COMPONENTE SKELETON
// ==========================================
const SkeletonCard = () => (
  <motion.div {...animProps} className="bg-white dark:bg-dark-white p-6 rounded-[2.5rem] border border-transparent dark:border-dark-light/5 relative animate-pulse">
    <div className="absolute top-6 right-6 w-16 h-5 bg-light/50 dark:bg-dark-light/10 rounded-full"></div>
    
    <div className="flex items-center gap-4 mb-6">
      <div className="w-20 h-20 rounded-2xl bg-light/50 dark:bg-dark-light/10 shrink-0"></div>
      <div className="space-y-2 w-full">
        <div className="h-4 bg-light/50 dark:bg-dark-light/10 rounded w-3/4"></div>
        <div className="h-3 bg-light/50 dark:bg-dark-light/10 rounded w-1/2"></div>
        <div className="h-2 bg-light/50 dark:bg-dark-light/10 rounded w-1/3"></div>
      </div>
    </div>

    <div className="space-y-3 mb-6">
      <div className="h-3 bg-light/50 dark:bg-dark-light/10 rounded w-5/6"></div>
      <div className="h-3 bg-light/50 dark:bg-dark-light/10 rounded w-4/6"></div>
      <div className="h-3 bg-light/50 dark:bg-dark-light/10 rounded w-5/6"></div>
    </div>

    <div className="flex gap-2 w-full mt-8">
      <div className="h-10 bg-light/50 dark:bg-dark-light/10 rounded-2xl flex-1"></div>
      <div className="h-10 bg-light/50 dark:bg-dark-light/10 rounded-2xl w-12 shrink-0"></div>
    </div>
  </motion.div>
);

export default function Empleados() {
  // --- ESTADOS ---
  const [isLoading, setIsLoading] = useState(true); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCargo, setFilterCargo] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterHorario, setFilterHorario] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // --- SIMULAR CARGA DE BASE DE DATOS ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // --- DATOS MOCK ---
  const cargos = ['Administrador', 'Recursos Humanos', 'Desarrollador', 'Operario'];
  const estados = ['Presente', 'Ausente', 'Inactivo'];
  const horarios = ['Horario Normal', 'Seguridad', 'Flexible'];
  
  const [empleados, setEmpleados] = useState([
    { 
      id: 1, 
      nombre: 'Anurbe Martínez', 
      cedula: '25.123.456', 
      cargo: 'Administrador', 
      departamento: 'Tecnología', 
      correo: 'anurbe@empresa.com',
      telefono: '+1 234 567 8901',
      nfc_uid: 'A1:B2:C3:D4',
      ingreso: '12/01/2024', 
      horario: 'Horario Normal', 
      status: 'Presente', 
      foto: '/images/ANURBE.jpg' 
    },
  ]);

  // --- LÓGICA DE FILTROS ---
  const filteredEmpleados = useMemo(() => {
    return empleados
      .filter(emp => 
        emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterCargo === 'all' || emp.cargo === filterCargo) &&
        (filterStatus === 'all' || emp.status === filterStatus) &&
        (filterHorario === 'all' || emp.horario === filterHorario)
      )
      .sort((a, b) => {
        if (sortOrder === 'asc') return a.nombre.localeCompare(b.nombre);
        return b.nombre.localeCompare(a.nombre);
      });
  }, [empleados, searchTerm, filterCargo, filterStatus, filterHorario, sortOrder]);

  const handleDelete = (id: number, nombre: string) => {
    const isDark = document.documentElement.classList.contains('dark');
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Eliminarás a ${nombre} permanentemente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7380ec', // Color primario
      cancelButtonColor: '#ff7782', // Color danger
      confirmButtonText: 'Sí, eliminar',
      background: isDark ? '#181a1e' : '#fff',
      color: isDark ? '#fff' : '#363949',
      customClass: {
        popup: 'rounded-2xl border border-transparent dark:border-white/5'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setEmpleados(empleados.filter(e => e.id !== id));
        Swal.fire({ 
          title: 'Eliminado', 
          icon: 'success', 
          background: isDark ? '#181a1e' : '#fff',
          color: isDark ? '#fff' : '#363949',
          customClass: {
            popup: 'rounded-2xl border border-transparent dark:border-white/5'
          }
        });
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const selectClassName = "w-full pl-11 pr-4 py-2 bg-slate-50 dark:bg-dark-light/5 rounded-xl outline-none text-xs font-bold dark:text-white appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20 transition-all border border-transparent focus:border-primary/40";
  const optionClassName = "dark:bg-[#181a1e] dark:text-white";

  return (
    <>
      <main className="mt-[0.8rem] pr-4 pb-8">
        
        {/* --- HEADER --- */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-6 mb-8">
          <div className="flex justify-between items-end">
            <div className="pt-2"> 
              <h1 className="text-[2.5rem] md:text-[3.2rem] font-black tracking-tighter uppercase italic leading-[1.1] flex items-center gap-x-1">
                <span className="text-info-dark dark:text-white">Gestión de</span>
                <span className="bg-gradient-to-r from-primary via-indigo-900 to-primary dark:via-white bg-[length:200%_auto] bg-clip-text text-transparent inline-block NOT-italic py-1 ml-1">
                  Empleados
                </span>
              </h1>
              <p className="text-[10px] font-bold text-info-dark/40 dark:text-white/60 uppercase tracking-[0.4em] mt-2">Personal Administrativo y Operativo</p>
            </div>
            <button 
              onClick={() => { setModalMode('add'); setIsModalOpen(true); }} 
              className="bg-primary hover:bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2 transition-colors"
            >
              <Plus size={18} /> Registrar
            </button>
          </div>

          {/* --- BARRA DE FILTROS --- */}
          <div className="flex flex-wrap gap-4 bg-white dark:bg-dark-white p-3 rounded-[2rem] border border-transparent dark:border-dark-light/5 items-center shadow-sm">
            <div className="relative flex-[1.5] min-w-[200px]">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-info-dark/40 dark:text-white/40" />
              <input 
                type="text" 
                placeholder="Buscar por nombre..." 
                className="w-full pl-11 pr-4 py-2 bg-slate-50 dark:bg-dark-light/5 rounded-xl outline-none text-xs font-bold dark:text-white border border-transparent focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative flex-1 min-w-[140px]">
              <Activity size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-info-dark/40 dark:text-white/40" />
              <select className={selectClassName} onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus}>
                <option value="all" className={optionClassName}>Estados...</option>
                {estados.map(s => <option key={s} value={s} className={optionClassName}>{s}</option>)}
              </select>
            </div>

            <div className="relative flex-1 min-w-[140px]">
              <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-info-dark/40 dark:text-white/40" />
              <select className={selectClassName} onChange={(e) => setFilterCargo(e.target.value)} value={filterCargo}>
                <option value="all" className={optionClassName}>Cargos...</option>
                {cargos.map(c => <option key={c} value={c} className={optionClassName}>{c}</option>)}
              </select>
            </div>

            <div className="relative flex-1 min-w-[140px]">
              <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-info-dark/40 dark:text-white/40" />
              <select className={selectClassName} onChange={(e) => setFilterHorario(e.target.value)} value={filterHorario}>
                <option value="all" className={optionClassName}>Horarios...</option>
                {horarios.map(h => <option key={h} value={h} className={optionClassName}>{h}</option>)}
              </select>
            </div>

            <button 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-6 py-2 bg-slate-50 dark:bg-dark-light/5 rounded-xl font-black uppercase text-[10px] dark:text-white hover:bg-primary/10 dark:hover:bg-white/10 transition-colors flex items-center gap-2 whitespace-nowrap ml-auto"
            >
              <ArrowUpDown size={14} /> {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
            </button>
          </div>
        </motion.div>

        {/* --- GRID DE TARJETAS CON SKELETON --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <AnimatePresence>
              {filteredEmpleados.map((emp, index) => (
                <motion.div
                  key={emp.id}
                  {...animProps}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white dark:bg-dark-white p-6 rounded-[2.5rem] border border-transparent dark:border-dark-light/5 relative group cursor-default ${hoverEffect}`}
                >
                  <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[8px] font-black uppercase ${emp.status === 'Presente' || emp.status === 'Activo' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                    ● {emp.status}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-white dark:border-dark-light/5 shadow-sm">
                        <img 
                          src={emp.foto || `https://ui-avatars.com/api/?name=${emp.nombre}&background=7380ec&color=fff`} 
                          alt={emp.nombre} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h3 className="text-md font-black text-info-dark dark:text-white uppercase tracking-tighter leading-tight">{emp.nombre}</h3>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{emp.cargo}</p>
                        <p className="text-[9px] font-bold text-info-dark/40 dark:text-white/40 uppercase">{emp.departamento}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-3 text-[10px] font-bold text-info-dark/60 dark:text-white/60">
                        <Mail size={14} className="text-primary/70" /> {emp.correo}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-info-dark/60 dark:text-white/60">
                        <Phone size={14} className="text-primary/70" /> {emp.telefono}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-info-dark/60 dark:text-white/60">
                        <IdCard size={14} className="text-primary/70" /> {emp.cedula}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-info-dark/60 dark:text-white/60 uppercase">
                        <CreditCard size={14} className="text-primary/70" /> {emp.nfc_uid}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 py-4 border-t border-slate-50 dark:border-dark-light/5 mb-6">
                      <div>
                        <p className="text-[7px] uppercase font-black text-info-dark/40 dark:text-white/40 mb-1">Horario</p>
                        <p className="text-[10px] font-bold dark:text-white">{emp.horario}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[7px] uppercase font-black text-info-dark/40 dark:text-white/40 mb-1">Ingreso</p>
                        <p className="text-[10px] font-bold dark:text-white">{emp.ingreso}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full">
                      <button 
                        onClick={() => { setModalMode('edit'); setIsModalOpen(true); }} 
                        className="flex-1 flex justify-center items-center gap-2 bg-slate-50 dark:bg-dark-light/5 text-info-dark dark:text-white py-3 rounded-2xl text-[9px] font-black uppercase hover:bg-primary hover:text-white dark:hover:bg-primary transition-all duration-150 border border-transparent hover:border-primary/20"
                      >
                        <Edit size={14} /> Editar
                      </button>
                      <button onClick={() => handleDelete(emp.id, emp.nombre)} className="p-3 bg-danger/10 text-danger rounded-2xl hover:bg-danger hover:text-white transition-all border border-transparent hover:border-danger/20">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* --- MODAL DE REGISTRO / EDICIÓN --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 z-[200] flex justify-center items-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white dark:bg-[#181a1e] p-8 rounded-[3.5rem] w-full max-w-[750px] relative shadow-2xl border border-transparent dark:border-white/5"
            >
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-1 dark:text-white">
                {modalMode === 'add' ? 'Registrar' : 'Actualizar'} <span className="text-primary">Empleado</span>
              </h2>
              <p className="text-[9px] font-bold text-info-dark/40 dark:text-white/40 uppercase tracking-widest mb-8">Información institucional y acceso biométrico</p>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center justify-center border-r border-slate-50 dark:border-white/5 pr-6 space-y-6">
                  <div className="w-36 h-36 rounded-[2.5rem] bg-slate-50 dark:bg-dark-light/5 border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden relative group">
                    {selectedImage ? (
                      <img src={selectedImage} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <ImagePlus size={36} className="text-primary/50" />
                    )}
                    <label className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
                      <span className="text-[9px] font-black text-white uppercase">Subir Foto</span>
                      <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                    </label>
                  </div>

                  <div className="w-full p-4 bg-primary/10 rounded-3xl border border-primary/20">
                    <label className="text-[8px] font-black uppercase text-primary block mb-2 text-center">Vínculo Tarjeta NFC (UID)</label>
                    <div className="flex items-center justify-center gap-2 text-primary">
                       <CreditCard size={18} />
                       <span className="font-mono text-[11px] font-bold">--- --- --- ---</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <IdCard size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-info-dark/40 dark:text-white/40" />
                    <input type="text" placeholder="Cédula / DNI" className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-dark-light/5 rounded-2xl outline-none text-xs font-bold dark:text-white border border-transparent focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-info-dark/40 dark:text-white/40" />
                      <input type="text" placeholder="Nombre" className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-dark-light/5 rounded-2xl outline-none text-xs font-bold dark:text-white border border-transparent focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all" />
                    </div>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-info-dark/40 dark:text-white/40" />
                      <input type="text" placeholder="Apellido" className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-dark-light/5 rounded-2xl outline-none text-xs font-bold dark:text-white border border-transparent focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all" />
                    </div>
                  </div>

                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-info-dark/40 dark:text-white/40" />
                    <input type="email" placeholder="Correo electrónico" className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-dark-light/5 rounded-2xl outline-none text-xs font-bold dark:text-white border border-transparent focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all" />
                  </div>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-info-dark/40 dark:text-white/40" />
                    <input type="text" placeholder="Teléfono" className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-dark-light/5 rounded-2xl outline-none text-xs font-bold dark:text-white border border-transparent focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <select className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-light/5 rounded-2xl outline-none text-[10px] font-bold dark:text-white appearance-none cursor-pointer border border-transparent focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all">
                      <option value="" className={optionClassName}>Cargo...</option>
                      {cargos.map(c => <option key={c} value={c} className={optionClassName}>{c}</option>)}
                    </select>
                    <select className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-light/5 rounded-2xl outline-none text-[10px] font-bold dark:text-white appearance-none cursor-pointer border border-transparent focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all">
                      <option value="" className={optionClassName}>Horario...</option>
                      {horarios.map(h => <option key={h} value={h} className={optionClassName}>{h}</option>)}
                    </select>
                  </div>
                </div>

                <div className="col-span-2 flex gap-4 mt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-2xl font-black uppercase text-[10px] text-info-dark/60 dark:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">Cancelar</button>
                  <button type="submit" className="flex-[2] py-4 bg-primary hover:bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 transition-colors">Confirmar Registro</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}