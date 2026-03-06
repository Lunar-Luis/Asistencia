import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Profile() {
  const [profileImg, setProfileImg] = useState<string>('/images/logo.png');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados para los Modales
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
    setShowUpdateModal(false);
    // Simulación de carga/proceso
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 300);
  };

  // Componente Modal Centrado (Misma estética que Settings)
  const Modal = ({ isOpen, onClose, onConfirm, title, message, confirmText, icon, isDanger, isSuccess }: any) => (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-info-dark/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-dark-white w-full max-w-sm rounded-[3.5rem] p-10 shadow-2xl z-10 border border-gray-100 dark:border-dark-light/10 flex flex-col items-center text-center"
          >
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 
              ${isDanger ? 'bg-danger/10 text-danger' : isSuccess ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
              <span className="material-icons-sharp text-4xl">{icon}</span>
            </div>
            
            <h2 className="text-2xl font-black text-info-dark dark:text-dark-text tracking-tighter uppercase mb-3 italic">
              {title}
            </h2>
            
            <p className="text-sm text-info-dark/60 dark:text-dark-text-variant font-medium mb-10 px-2 leading-relaxed">
              {message}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              {!isSuccess && (
                <button onClick={onClose} className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-info-dark/40 dark:text-dark-text-variant hover:bg-gray-100 dark:hover:bg-dark-light transition-all">
                  Cancelar
                </button>
              )}
              <button 
                onClick={onConfirm} 
                className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-lg transition-all 
                ${isSuccess ? 'w-full bg-success shadow-success/20' : isDanger ? 'flex-1 bg-danger shadow-danger/20' : 'flex-1 bg-primary shadow-primary/20'}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative w-full max-w-[1200px] mx-auto p-4 md:p-10 overflow-hidden font-sans">
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PANEL DE IDENTIDAD */}
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-4">
          <div className="bg-white dark:bg-dark-white rounded-[3rem] p-1 shadow-2xl overflow-hidden group border border-gray-100 dark:border-dark-light/10">
            <div className="bg-primary h-32 w-full rounded-t-[2.8rem] relative overflow-hidden">
               <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </div>
            
            <div className="px-8 pb-10 -mt-16 flex flex-col items-center">
              <div className="relative group cursor-pointer" onClick={handleImageClick}>
                <motion.div whileHover={{ scale: 1.05 }} className="w-32 h-32 rounded-full border-2 border-primary/50 shadow-2xl overflow-hidden flex items-center justify-center bg-light dark:bg-dark-light">
                  <img src={profileImg} alt="CMBT" className="w-full h-full object-cover" />
                </motion.div>
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                  <span className="material-icons-sharp text-white">photo_camera</span>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
              </div>

              <div className="text-center mt-4">
                <h2 className="text-2xl font-black text-info-dark dark:text-dark-text tracking-tighter uppercase italic">CMBT</h2>
                <div className="flex items-center gap-2 justify-center mt-1">
                  <img src="/images/logo.png" className="w-4 h-4 object-contain" alt="SL" />
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">SyncLogic Admin</p>
                </div>
              </div>

              <div className="w-full mt-8 space-y-3">
                <div className="bg-light dark:bg-dark-light/50 p-4 rounded-2xl flex items-center gap-4 border border-gray-100 dark:border-dark-light/10">
                  <span className="material-icons-sharp text-primary">verified</span>
                  <div>
                    <p className="text-[10px] font-black text-info-dark/60 dark:text-white/50 uppercase tracking-widest">Nivel de Cuenta</p>
                    <p className="text-xs font-bold text-info-dark dark:text-dark-text">Acceso Total (Root)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* PANEL DE DATOS */}
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="lg:col-span-8 space-y-6">
          <div className="bg-white/90 dark:bg-dark-white/60 backdrop-blur-xl border border-white dark:border-dark-light/10 rounded-[3rem] p-8 md:p-12 shadow-xl">
            <h3 className="text-xs font-black text-primary uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
              <span className="w-10 h-[2px] bg-primary" /> Información Maestra
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              {[
                { label: "Nombre Completo", type: "text", placeholder: "Ej. Christian BT" },
                { label: "Correo Corporativo", type: "email", placeholder: "admin@synclogic.com" },
                { label: "Contacto", type: "text", placeholder: "+56 9 ..." },
                { label: "Departamento / Área", type: "text", placeholder: "Sistemas / Dirección" }
              ].map((field, index) => (
                <div key={index} className="relative group">
                  <input type={field.type} placeholder=" " className="peer w-full bg-transparent border-b-2 border-gray-200 dark:border-dark-light/40 py-4 outline-none focus:border-primary transition-all text-info-dark dark:text-dark-text font-bold" />
                  <label className="absolute left-0 top-4 text-info-dark/50 dark:text-white/40 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-primary peer-focus:text-[10px] peer-focus:font-black peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-black peer-[:not(:placeholder-shown)]:text-primary">
                    {field.label}
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-12 space-y-2">
              <label className="text-[11px] font-black text-info-dark/70 dark:text-white/60 uppercase tracking-widest ml-1">Biografía de Usuario</label>
              <textarea rows={3} className="w-full bg-light/80 dark:bg-dark-light/30 rounded-2xl p-4 border border-gray-100 dark:border-dark-light/10 focus:ring-2 focus:ring-primary text-info-dark dark:text-dark-text font-medium resize-none" placeholder="Describe tus responsabilidades..." />
            </div>
          </div>

          <div className="flex justify-end gap-6 items-center">
            <button 
              onClick={() => setShowDiscardModal(true)}
              className="text-[11px] font-black text-info-dark/40 dark:text-white/40 hover:text-danger uppercase tracking-widest transition-all"
            >
              Descartar
            </button>
            <motion.button 
              onClick={() => setShowUpdateModal(true)}
              whileHover={{ scale: 1.05, boxShadow: "0 20px 30px -10px rgba(var(--primary-rgb), 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white px-12 py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-primary/20"
            >
              Actualizar Sistema
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* --- MODALES --- */}

      <Modal 
        isOpen={showUpdateModal} 
        onClose={() => setShowUpdateModal(false)} 
        onConfirm={handleConfirmUpdate}
        icon="cloud_upload"
        title="¿Sincronizar Datos?"
        message="Se actualizarán las credenciales y el perfil en el núcleo central de SyncLogic."
        confirmText="Confirmar"
      />

      <Modal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
        onConfirm={() => setShowSuccessModal(false)}
        icon="check_circle"
        title="¡Perfil Actualizado!"
        message="Los cambios se han propagado correctamente en todo el entorno administrativo."
        confirmText="Entendido"
        isSuccess={true}
      />

      <Modal 
        isOpen={showDiscardModal} 
        onClose={() => setShowDiscardModal(false)} 
        onConfirm={() => setShowDiscardModal(false)} // Aquí puedes resetear campos si quieres
        icon="delete_sweep"
        title="¿Ignorar Cambios?"
        message="Toda la información editada que no haya sido guardada se perderá definitivamente."
        confirmText="Sí, Ignorar"
        isDanger={true}
      />

    </div>
  );
}