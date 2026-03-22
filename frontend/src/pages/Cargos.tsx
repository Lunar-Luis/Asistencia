import { useState, useMemo } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { 
  HiOutlinePlus, 
  HiOutlineBriefcase, 
  HiOutlineDocumentText, 
  HiOutlineUsers,
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineArrowsUpDown,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineCheckCircle,
} from 'react-icons/hi2';
import Swal from 'sweetalert2';
import RightTopBar from '../components/RightTopBar';

export default function Cargos() {
  // --- ESTADOS ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // --- VARIANTES DE ANIMACIÓN (Padre e Hijos) ---
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3, 
        when: "beforeChildren", 
        staggerChildren: 0.1 // Esto crea el efecto cascada
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" } 
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  // --- DATOS INICIALES ---
  const [cargos, setCargos] = useState([
    { id: 1, nombre: 'Administrador', descripcion: 'Gestión completa del sistema y control de accesos.', empleadosCount: 2, status: 'active' },
    { id: 2, nombre: 'Recursos Humanos', descripcion: 'Manejo de nómina, empleados y reportes de asistencia.', empleadosCount: 3, status: 'active' },
    { id: 3, nombre: 'Desarrollador', descripcion: 'Mantenimiento de la infraestructura técnica y biométrica.', empleadosCount: 4, status: 'active' },
    { id: 4, nombre: 'Operario', descripcion: 'Personal de planta con horarios rotativos.', empleadosCount: 15, status: 'inactive' },
  ]);

  // --- LÓGICA DE FILTROS ---
  const filteredCargos = useMemo(() => {
    return cargos
      .filter(cargo => 
        cargo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterStatus === 'all' || cargo.status === filterStatus)
      )
      .sort((a, b) => {
        if (sortOrder === 'asc') return a.nombre.localeCompare(b.nombre);
        return b.nombre.localeCompare(a.nombre);
      });
  }, [cargos, searchTerm, filterStatus, sortOrder]);

  const handleDelete = (nombre: string) => {
    const isDark = document.documentElement.classList.contains('dark');
    Swal.fire({
      title: '¿Eliminar cargo?',
      text: `Esta acción afectará a los empleados asignados a ${nombre}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff7782',
      cancelButtonColor: '#7380ec',
      confirmButtonText: 'Sí, eliminar',
      background: isDark ? '#181a1e' : '#fff',
      color: isDark ? '#edeffd' : '#363949'
    });
  };

  const selectClassName = "w-full pl-11 pr-4 py-2 bg-light/40 dark:bg-dark-light/5 rounded-xl outline-none text-xs font-bold dark:text-white appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20 transition-all";
  const optionClassName = "dark:bg-[#181a1e] dark:text-white";

  return (
    <>
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mt-[0.8rem] pr-4 pb-8"
      >
        {/* --- 1. HEADER (Título y Botón) --- */}
        <motion.div variants={itemVariants} className="flex flex-col gap-6 mb-8">
          <div className="flex justify-between items-end">
            <div className="pt-2">
              <h1 className="text-[2.5rem] md:text-[3.2rem] font-black tracking-tighter uppercase italic leading-[1.1] flex items-center">
                <span className="text-info-dark dark:text-white">Gestión de</span>
                <motion.span 
                  className="bg-gradient-to-r from-primary via-indigo-900 to-primary dark:via-white bg-[length:200%_auto] bg-clip-text text-transparent inline-block NOT-italic py-1 px-2 ml-2"
                  animate={{ backgroundPosition: ["0% center", "200% center"] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                >
                  Cargos
                </motion.span>
              </h1>
              <p className="text-[10px] font-bold text-info-dark/40 dark:text-white/60 uppercase tracking-[0.4em] mt-2">Estructura Organizacional y Roles</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setModalMode('add'); setIsModalOpen(true); }}
              className="bg-primary text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <HiOutlinePlus className="text-lg" /> Nuevo Cargo
            </motion.button>
          </div>

          {/* --- 2. BARRA DE FILTROS --- */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 bg-white dark:bg-dark-white p-3 rounded-[2rem] shadow-sm items-center">
            <div className="relative flex-[2] min-w-[250px]">
              <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-info-dark" />
              <input 
                type="text" 
                placeholder="Buscar cargos por nombre..." 
                className="w-full pl-11 pr-4 py-2 bg-light/40 dark:bg-dark-light/5 rounded-xl outline-none text-xs font-bold dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative flex-1 min-w-[160px]">
              <HiOutlineFunnel className="absolute left-4 top-1/2 -translate-y-1/2 text-info-dark" />
              <select 
                className={selectClassName}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all" className={optionClassName}>Todos los estados</option>
                <option value="active" className={optionClassName}>Activos</option>
                <option value="inactive" className={optionClassName}>Inactivos</option>
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

        {/* --- 3. GRID DE TARJETAS (CORREGIDO PARA ANIMAR) --- */}
        <motion.div 
          layout
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredCargos.map((cargo) => (
              <motion.div
                key={cargo.id}
                layout
                variants={itemVariants}
                // Al estar dentro de un motion.div con containerVariants, heredará hidden/visible automáticamente
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-dark-white p-7 rounded-[2.5rem] border border-transparent dark:border-dark-light/5 relative group hover:shadow-[0_20px_50px_rgba(115,128,236,0.15)] transition-all duration-300"
              >
                <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[8px] font-black uppercase ${cargo.status === 'active' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                  ● {cargo.status === 'active' ? 'Activo' : 'Inactivo'}
                </div>

                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl group-hover:scale-110 transition-transform">
                    <HiOutlineBriefcase />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-info-dark dark:text-white uppercase tracking-tighter leading-tight">{cargo.nombre}</h3>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase">
                      <HiOutlineUsers /> {cargo.empleadosCount} Empleados
                    </div>
                  </div>
                </div>

                <p className="text-[11px] font-medium text-info-dark/60 dark:text-white/50 leading-relaxed mb-6 h-12 overflow-hidden line-clamp-3">
                  {cargo.descripcion}
                </p>

                <div className="flex gap-2 pt-4 border-t border-light dark:border-dark-light/10">
                  <button 
                    onClick={() => { setModalMode('edit'); setIsModalOpen(true); }}
                    className="flex-1 flex justify-center items-center gap-2 bg-light dark:bg-dark-light/10 text-info-dark dark:text-white py-3 rounded-2xl text-[9px] font-black uppercase hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white transition-all duration-150"
                  >
                    <HiOutlinePencilSquare className="text-sm" /> Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(cargo.nombre)}
                    className="p-3 bg-danger/10 text-danger rounded-2xl hover:bg-danger hover:text-white transition-all"
                  >
                    <HiOutlineTrash className="text-lg" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.main>

      <div className="mt-[1.4rem]">
        <RightTopBar />
      </div>

      {/* --- 4. MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 z-[200] flex justify-center items-center p-4 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-dark-bg p-8 rounded-[3.5rem] w-full max-w-[550px] relative shadow-2xl border dark:border-white/5"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute right-8 top-8 text-2xl text-info-dark/20 hover:text-danger transition-colors"
              >
                &times;
              </button>

              <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-1 dark:text-white">
                {modalMode === 'add' ? 'Crear Nuevo' : 'Actualizar'} <span className="text-primary NOT-italic">Cargo</span>
              </h2>
              <p className="text-[9px] font-bold text-info-dark/40 uppercase tracking-widest mb-8">Definición de responsabilidades y jerarquía</p>

              <form className="space-y-5">
                <div className="relative">
                  <label className="text-[8px] font-black uppercase text-primary mb-2 block ml-4">Nombre del Cargo</label>
                  <div className="relative">
                    <HiOutlineBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                    <input 
                      type="text" 
                      placeholder="Ej: Supervisor de Planta" 
                      className="w-full pl-11 pr-4 py-4 bg-light/50 dark:bg-dark-light/5 rounded-2xl outline-none text-xs font-bold dark:text-white border border-transparent focus:border-primary/40 transition-all"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="text-[8px] font-black uppercase text-primary mb-2 block ml-4">Descripción de Funciones</label>
                  <div className="relative">
                    <HiOutlineDocumentText className="absolute left-4 top-4 text-primary" />
                    <textarea 
                      rows={4} 
                      placeholder="Describe las responsabilidades principales..." 
                      className="w-full pl-11 pr-4 py-4 bg-light/50 dark:bg-dark-light/5 rounded-2xl outline-none text-xs font-bold dark:text-white border border-transparent focus:border-primary/40 transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 text-center">
                    <label className="text-[8px] font-black uppercase text-primary mb-2 block">Estado Inicial</label>
                    <button type="button" className="flex items-center justify-center gap-2 text-[10px] font-black uppercase text-success w-full">
                      <HiOutlineCheckCircle className="text-lg"/> Activo
                    </button>
                  </div>
                  <div className="p-4 bg-light/30 dark:bg-dark-light/5 rounded-2xl flex flex-col items-center justify-center">
                    <span className="text-[18px] font-black dark:text-white">0</span>
                    <span className="text-[7px] font-bold uppercase text-info-dark/40">Empleados Iniciales</span>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="flex-1 py-4 rounded-2xl font-black uppercase text-[10px] text-info-dark dark:text-white bg-light/50 dark:bg-dark-light/10 hover:bg-danger/10 hover:text-danger transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/30 hover:scale-[1.02] transition-all"
                  >
                    Confirmar Registro
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