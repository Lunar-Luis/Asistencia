import { useState, useMemo } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { 
  HiOutlinePlus, 
  HiOutlineUserCircle, 
  HiOutlineIdentification, 
  HiOutlineEnvelope,
  HiOutlinePhone,   
  HiOutlineClock, 
  HiOutlineRss,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineArrowsUpDown,
  HiOutlinePhoto,
  HiOutlineCreditCard
} from 'react-icons/hi2';
import Swal from 'sweetalert2';
import RightTopBar from '../components/RightTopBar';

export default function Empleados() {
  // --- ESTADOS ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCargo, setFilterCargo] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterHorario, setFilterHorario] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // --- ANIMACIONES (Estilo Inicio.tsx) ---
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3, 
        when: "beforeChildren", 
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      transition: { duration: 0.2 } 
    }
  };

  // --- DATOS ---
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
      confirmButtonColor: '#7380ec',
      cancelButtonColor: '#ff7782',
      confirmButtonText: 'Sí, eliminar',
      background: isDark ? '#181a1e' : '#fff',
      color: isDark ? '#edeffd' : '#363949'
    }).then((result) => {
      if (result.isConfirmed) {
        setEmpleados(empleados.filter(e => e.id !== id));
        Swal.fire({ title: 'Eliminado', icon: 'success', background: isDark ? '#181a1e' : '#fff' });
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const hoverEffect = "hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(115,128,236,0.15)] transition-all duration-300";
  const selectClassName = "w-full pl-11 pr-4 py-2 bg-light/40 dark:bg-dark-light/5 rounded-xl outline-none text-xs font-bold dark:text-white appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20 transition-all";
  const optionClassName = "dark:bg-[#181a1e] dark:text-white";

  return (
    <>
      {/* Reducido mt-[1.4rem] a mt-[0.8rem] para subir la posición del contenido */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mt-[0.8rem] pr-4 pb-8"
      >
        
        {/* --- HEADER --- */}
        <motion.div variants={itemVariants} className="flex flex-col gap-6 mb-8">
          <div className="flex justify-between items-end">
            <div className="pt-2"> 
              <h1 className="text-[2.5rem] md:text-[3.2rem] font-black tracking-tighter uppercase italic leading-[1.1] flex items-center gap-x-1">
                <span className="text-info-dark dark:text-white">Gestión de</span>
                <motion.span 
                  className="bg-gradient-to-r from-primary via-indigo-900 to-primary dark:via-white bg-[length:200%_auto] bg-clip-text text-transparent inline-block NOT-italic py-1 px-4 -ml-2"
                  animate={{ backgroundPosition: ["0% center", "200% center"] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                >
                  Empleados
                </motion.span>
              </h1>
              <p className="text-[10px] font-bold text-info-dark/40 dark:text-white/60 uppercase tracking-[0.4em] mt-2">Personal Administrativo y Operativo</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setModalMode('add'); setIsModalOpen(true); }} 
              className="bg-primary text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <HiOutlinePlus className="text-lg" /> Registrar
            </motion.button>
          </div>

          {/* --- BARRA DE FILTROS --- */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 bg-white dark:bg-dark-white p-3 rounded-[2rem] shadow-sm items-center">
            <div className="relative flex-[1.5] min-w-[200px]">
              <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-info-dark" />
              <input 
                type="text" 
                placeholder="Buscar por nombre..." 
                className="w-full pl-11 pr-4 py-2 bg-light/40 dark:bg-dark-light/5 rounded-xl outline-none text-xs font-bold dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative flex-1 min-w-[140px]">
              <HiOutlineRss className="absolute left-4 top-1/2 -translate-y-1/2 text-info-dark" />
              <select className={selectClassName} onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus}>
                <option value="all" className={optionClassName}>Estados...</option>
                {estados.map(s => <option key={s} value={s} className={optionClassName}>{s}</option>)}
              </select>
            </div>

            <div className="relative flex-1 min-w-[140px]">
              <HiOutlineFunnel className="absolute left-4 top-1/2 -translate-y-1/2 text-info-dark" />
              <select className={selectClassName} onChange={(e) => setFilterCargo(e.target.value)} value={filterCargo}>
                <option value="all" className={optionClassName}>Cargos...</option>
                {cargos.map(c => <option key={c} value={c} className={optionClassName}>{c}</option>)}
              </select>
            </div>

            <div className="relative flex-1 min-w-[140px]">
              <HiOutlineClock className="absolute left-4 top-1/2 -translate-y-1/2 text-info-dark" />
              <select className={selectClassName} onChange={(e) => setFilterHorario(e.target.value)} value={filterHorario}>
                <option value="all" className={optionClassName}>Horarios...</option>
                {horarios.map(h => <option key={h} value={h} className={optionClassName}>{h}</option>)}
              </select>
            </div>

            <button 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-6 py-2 bg-light/40 dark:bg-dark-light/5 rounded-xl font-black uppercase text-[10px] dark:text-white hover:bg-primary/10 transition-colors flex items-center gap-2 whitespace-nowrap ml-auto"
            >
              <HiOutlineArrowsUpDown /> {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
            </button>
          </motion.div>
        </motion.div>

        {/* --- GRID DE TARJETAS --- */}
        <motion.div 
          layout
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredEmpleados.map((emp) => (
              <motion.div
                key={emp.id}
                layout
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ y: -10 }}
                className={`bg-white dark:bg-dark-white p-6 rounded-[2.5rem] border border-transparent dark:border-dark-light/5 relative group ${hoverEffect}`}
              >
                <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[8px] font-black uppercase ${emp.status === 'Presente' || emp.status === 'Activo' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                  ● {emp.status}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-white dark:border-dark-white shadow-lg">
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
                    <div className="flex items-center gap-3 text-[10px] font-bold text-info-dark/60 dark:text-white/70">
                      <HiOutlineEnvelope className="text-primary text-base" /> {emp.correo}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-info-dark/60 dark:text-white/70">
                      <HiOutlinePhone className="text-primary text-base" /> {emp.telefono}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-info-dark/60 dark:text-white/70">
                      <HiOutlineIdentification className="text-primary text-base" /> {emp.cedula}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-info-dark/60 dark:text-white/70 uppercase">
                      <HiOutlineCreditCard className="text-primary text-base" /> {emp.nfc_uid}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 py-4 border-t border-light/50 dark:border-dark-light/10 mb-6">
                    <div>
                      <p className="text-[7px] uppercase font-black text-info-dark/40 dark:text-white/50 mb-1">Horario</p>
                      <p className="text-[10px] font-bold dark:text-white">{emp.horario}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[7px] uppercase font-black text-info-dark/40 dark:text-white/50 mb-1">Ingreso</p>
                      <p className="text-[10px] font-bold dark:text-white">{emp.ingreso}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full">
                    <button 
                      onClick={() => { setModalMode('edit'); setIsModalOpen(true); }} 
                      className="flex-1 flex justify-center items-center gap-2 bg-light dark:bg-dark-light/10 text-info-dark dark:text-white py-3 rounded-2xl text-[9px] font-black uppercase hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white transition-all duration-150"
                    >
                      <HiOutlinePencilSquare className="text-sm" /> Editar
                    </button>
                    <button onClick={() => handleDelete(emp.id, emp.nombre)} className="p-3 bg-danger/10 text-danger rounded-2xl hover:bg-danger hover:text-white transition-all">
                      <HiOutlineTrash className="text-lg" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.main>

      <div className="mt-[1.4rem]"><RightTopBar /></div>

      {/* --- MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 z-[200] flex justify-center items-center p-4 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-dark-bg p-8 rounded-[3.5rem] w-full max-w-[750px] relative shadow-2xl border dark:border-white/5"
            >
              <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-1 dark:text-white">
                {modalMode === 'add' ? 'Registrar' : 'Actualizar'} <span className="text-primary NOT-italic">Empleado</span>
              </h2>
              <p className="text-[9px] font-bold text-info-dark/40 uppercase tracking-widest mb-8">Información institucional y acceso biométrico</p>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center justify-center border-r dark:border-white/5 pr-6 space-y-6">
                  <div className="w-36 h-36 rounded-[2.5rem] bg-light/50 dark:bg-dark-light/5 border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden relative group">
                    {selectedImage ? (
                      <img src={selectedImage} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <HiOutlinePhoto className="text-4xl text-primary/20" />
                    )}
                    <label className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
                      <span className="text-[9px] font-black text-white uppercase">Subir Foto</span>
                      <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                    </label>
                  </div>

                  <div className="w-full p-4 bg-primary/5 rounded-3xl border border-primary/10">
                    <label className="text-[8px] font-black uppercase text-primary block mb-2 text-center">Vínculo Tarjeta NFC (UID)</label>
                    <div className="flex items-center justify-center gap-2 text-primary">
                       <HiOutlineCreditCard className="text-lg" />
                       <span className="font-mono text-[11px] font-bold">--- --- --- ---</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <HiOutlineIdentification className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                    <input type="text" placeholder="Cédula / DNI" className="w-full pl-11 pr-4 py-3 bg-light/50 dark:bg-dark-light/5 rounded-2xl outline-none text-xs font-bold dark:text-white border border-transparent focus:border-primary/40" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <HiOutlineUserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                      <input type="text" placeholder="Nombre" className="w-full pl-11 pr-4 py-3 bg-light/50 dark:bg-dark-light/5 rounded-2xl outline-none text-xs font-bold dark:text-white border border-transparent focus:border-primary/40" />
                    </div>
                    <div className="relative">
                      <HiOutlineUserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                      <input type="text" placeholder="Apellido" className="w-full pl-11 pr-4 py-3 bg-light/50 dark:bg-dark-light/5 rounded-2xl outline-none text-xs font-bold dark:text-white border border-transparent focus:border-primary/40" />
                    </div>
                  </div>

                  <div className="relative">
                    <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                    <input type="email" placeholder="Correo electrónico" className="w-full pl-11 pr-4 py-3 bg-light/50 dark:bg-dark-light/5 rounded-2xl outline-none text-xs font-bold dark:text-white border border-transparent focus:border-primary/40" />
                  </div>
                  <div className="relative">
                    <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                    <input type="text" placeholder="Teléfono" className="w-full pl-11 pr-4 py-3 bg-light/50 dark:bg-dark-light/5 rounded-2xl outline-none text-xs font-bold dark:text-white border border-transparent focus:border-primary/40" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <select className="w-full px-4 py-3 bg-light/50 dark:bg-dark-light/5 dark:bg-dark-bg rounded-2xl outline-none text-[10px] font-bold dark:text-white appearance-none cursor-pointer border border-transparent focus:border-primary/40">
                      <option value="" className={optionClassName}>Cargo...</option>
                      {cargos.map(c => <option key={c} value={c} className={optionClassName}>{c}</option>)}
                    </select>
                    <select className="w-full px-4 py-3 bg-light/50 dark:bg-dark-light/5 dark:bg-dark-bg rounded-2xl outline-none text-[10px] font-bold dark:text-white appearance-none cursor-pointer border border-transparent focus:border-primary/40">
                      <option value="" className={optionClassName}>Horario...</option>
                      {horarios.map(h => <option key={h} value={h} className={optionClassName}>{h}</option>)}
                    </select>
                  </div>
                </div>

                <div className="col-span-2 flex gap-4 mt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-2xl font-black uppercase text-[10px] text-info-dark dark:text-white bg-light/50 dark:bg-dark-light/10">Cancelar</button>
                  <button type="submit" className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/30">Confirmar Registro</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}