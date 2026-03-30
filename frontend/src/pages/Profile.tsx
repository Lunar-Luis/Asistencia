import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion'; // <-- Aquí quitamos AnimatePresence
import { Camera, User, Mail, Lock, Shield, Save, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const animProps = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };
const cardStyle = "bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-5 sm:p-6 md:p-8 transition-colors relative";
const inputStyle = "w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none text-[13px] font-bold text-slate-700 dark:text-white border border-transparent focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all";

// ==========================================
// COMPONENTE SKELETON PARA PERFIL
// ==========================================
const SkeletonProfile = () => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 w-full animate-pulse">
    {/* Panel Izquierdo Skeleton */}
    <div className="lg:col-span-4">
      <div className={`${cardStyle} flex flex-col items-center text-center overflow-hidden h-full`}>
        <div className="absolute top-0 left-0 w-full h-32 bg-slate-200 dark:bg-slate-800 rounded-t-[2.5rem]"></div>
        <div className="relative mt-8 mb-4 w-32 h-32 rounded-[2rem] bg-slate-300 dark:bg-slate-700 border-4 border-white dark:border-slate-900 z-10"></div>
        <div className="w-32 h-6 bg-slate-200 dark:bg-slate-800 rounded mb-2 z-10"></div>
        <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded mb-8 z-10"></div>
        <div className="w-full mt-auto h-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800"></div>
      </div>
    </div>

    {/* Panel Derecho Skeleton */}
    <div className="lg:col-span-8">
      <div className={`${cardStyle} flex flex-col h-full`}>
        <div className="mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-48 h-8 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
          <div className="w-64 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
        <div className="space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50 dark:border-slate-800/50">
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl w-full sm:flex-1"></div>
          <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl w-full sm:flex-[2]"></div>
        </div>
      </div>
    </div>
  </div>
);

export default function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const [profileImg, setProfileImg] = useState<string>('/images/logo.png');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleImageClick = () => fileInputRef.current?.click();
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImg(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmUpdate = () => {
    const isDark = document.documentElement.classList.contains('dark');
    Swal.fire({
      title: '¿Actualizar Perfil?',
      text: "Tus credenciales y datos se sincronizarán en el sistema.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#7380ec',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sí, actualizar',
      background: isDark ? '#0f172a' : '#fff',
      color: isDark ? '#f8fafc' : '#334155',
      customClass: { popup: 'rounded-[2rem] border border-transparent dark:border-slate-800' }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({ title: '¡Perfil Actualizado!', icon: 'success', background: isDark ? '#0f172a' : '#fff', color: isDark ? '#f8fafc' : '#334155', customClass: { popup: 'rounded-[2rem] border border-transparent dark:border-slate-800' }});
      }
    });
  };

  const handleDiscard = () => {
    const isDark = document.documentElement.classList.contains('dark');
    Swal.fire({
      title: '¿Descartar cambios?',
      text: "Se perderán las modificaciones no guardadas.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff7782',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sí, descartar',
      background: isDark ? '#0f172a' : '#fff',
      color: isDark ? '#f8fafc' : '#334155',
      customClass: { popup: 'rounded-[2rem] border border-transparent dark:border-slate-800' }
    });
  };

  return (
    <main className="pb-8 max-w-[1200px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
        <h1 className="text-[2.2rem] sm:text-[3rem] md:text-[3.5rem] font-black tracking-tighter uppercase italic leading-[1.1] flex flex-wrap items-center gap-x-2">
          <span className="text-slate-800 dark:text-white">Mi</span>
          <span className="bg-gradient-to-r from-primary via-indigo-900 to-primary dark:via-white bg-[length:200%_auto] bg-clip-text text-transparent inline-block NOT-italic py-1">Perfil</span>
        </h1>
        <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] sm:tracking-[0.4em] mt-2">Gestión de Cuenta Administrador</p>
      </motion.div>

      {isLoading ? (
        <SkeletonProfile />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* PANEL IZQUIERDO: FOTO Y ROL */}
          <motion.div {...animProps} className="lg:col-span-4">
            <div className={`${cardStyle} flex flex-col items-center text-center overflow-hidden h-full`}>
              <div className="absolute top-0 left-0 w-full h-32 bg-primary/10 dark:bg-primary/5 rounded-t-[2.5rem]"></div>
              
              <div className="relative mt-8 mb-4 group cursor-pointer z-10" onClick={handleImageClick}>
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[2rem] border-4 border-white dark:border-slate-900 shadow-lg overflow-hidden flex items-center justify-center bg-slate-50 dark:bg-slate-800 transition-transform group-hover:scale-105">
                  <img src={profileImg} alt="Admin" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 rounded-[2rem] bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all border-4 border-transparent">
                  <Camera className="text-white" size={32} />
                </div>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
              </div>

              <h2 className="text-lg sm:text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight z-10">Admin CMBT</h2>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1 z-10">Administrador Principal</p>

              <div className="w-full mt-auto pt-8">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl flex items-center gap-4 border border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Shield size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Nivel de Privilegios</p>
                    <p className="text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-300">Acceso Total (Root)</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* PANEL DERECHO: FORMULARIO */}
          <motion.div {...animProps} transition={{ delay: 0.1 }} className="lg:col-span-8">
            <div className={`${cardStyle} flex flex-col h-full`}>
              <div className="mb-6 sm:mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-black uppercase italic tracking-tighter dark:text-white text-xl sm:text-2xl text-slate-800">Datos de la Cuenta</h3>
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Actualiza tus credenciales de acceso</p>
              </div>

              <div className="space-y-6 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  <div className="relative">
                    <label className="text-[10px] font-bold uppercase text-primary mb-2 block ml-2">Nombre de Usuario</label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                      <input type="text" defaultValue="Admin CMBT" className={inputStyle} />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="text-[10px] font-bold uppercase text-primary mb-2 block ml-2">Correo de Acceso</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                      <input type="email" defaultValue="admin@cmbt.com" className={inputStyle} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-4 border-t border-slate-50 dark:border-slate-800/50">
                  <div className="relative">
                    <label className="text-[10px] font-bold uppercase text-primary mb-2 block ml-2">Nueva Contraseña</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                      <input type="password" placeholder="••••••••" className={inputStyle} />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="text-[10px] font-bold uppercase text-primary mb-2 block ml-2">Confirmar Contraseña</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                      <input type="password" placeholder="••••••••" className={inputStyle} />
                    </div>
                  </div>
                </div>
                <p className="text-[9px] sm:text-[10px] font-medium text-slate-400 ml-2">* Deja los campos de contraseña en blanco si no deseas cambiarla.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button onClick={handleDiscard} className="w-full sm:flex-1 py-3.5 sm:py-4 rounded-xl font-bold uppercase text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 hover:bg-red-50 hover:text-red-500 dark:hover:bg-danger/10 dark:hover:text-danger transition-all border border-transparent hover:border-red-200 flex items-center justify-center gap-2">
                  <XCircle size={16}/> Descartar
                </button>
                <button onClick={handleConfirmUpdate} className="w-full sm:flex-[2] py-3.5 sm:py-4 bg-primary hover:bg-indigo-600 text-white rounded-xl font-bold uppercase text-[11px] sm:text-[12px] tracking-widest shadow-lg shadow-primary/30 transition-colors flex items-center justify-center gap-2">
                  <Save size={18}/> Guardar Cambios
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}