import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Settings() {
  const [settings, setSettings] = useState({
    twoFactor: true,
    activityLog: true,
    lateAlerts: true,
    weeklyReports: true,
    deviceAlerts: false,
  });

  // Estados para los Modales
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const toggleSetting = (id: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleConfirmSave = () => {
    setShowSaveModal(false);
    // Simulamos un pequeño retraso para el feedback
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 300);
  };

  const handleReset = () => {
    setSettings({
      twoFactor: true,
      activityLog: true,
      lateAlerts: true,
      weeklyReports: true,
      deviceAlerts: false,
    });
    setShowDiscardModal(false);
  };

  // Componente Modal Centrado Reutilizable
  const Modal = ({ isOpen, onClose, onConfirm, title, message, confirmText, icon, isDanger, isSuccess }: any) => (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-info-dark/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-dark-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl z-10 border border-gray-100 dark:border-dark-light/10 flex flex-col items-center text-center"
          >
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 
              ${isDanger ? 'bg-danger/10 text-danger' : isSuccess ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
              <span className="material-icons-sharp text-4xl">{icon}</span>
            </div>
            
            <h2 className="text-2xl font-black text-info-dark dark:text-dark-text tracking-tighter uppercase mb-3 leading-none">
              {title}
            </h2>
            
            <p className="text-sm text-info-dark/60 dark:text-dark-text-variant font-medium mb-10 px-2">
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

  const SettingItem = ({ icon, title, desc, active, onClick }: any) => (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-4 bg-light dark:bg-dark-light/30 rounded-2xl group hover:bg-white dark:hover:bg-dark-light transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-dark-light/20 cursor-pointer"
    >
      <div className="flex items-center gap-4 text-left">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-dark-white text-primary shadow-sm group-hover:scale-110 transition-transform">
          <span className="material-icons-sharp">{icon}</span>
        </div>
        <div>
          <h4 className="font-bold text-info-dark dark:text-dark-text tracking-tight">{title}</h4>
          <p className="text-[11px] text-info-dark/60 dark:text-dark-text-variant font-medium">{desc}</p>
        </div>
      </div>
      <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${active ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}>
        <motion.div animate={{ x: active ? 24 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm" />
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto py-4 md:py-8">
      <header className="mb-10 px-2">
        <h1 className="text-3xl font-black text-info-dark dark:text-dark-text tracking-tighter uppercase italic">
          AJUSTES DEL <span className="text-primary NOT-italic">SISTEMA</span>
        </h1>
        <p className="text-xs font-bold text-info-dark/50 dark:text-dark-text-variant uppercase tracking-widest mt-1">Configuración / SyncLogic</p>
      </header>

      <div className="space-y-8">
        <section>
          <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 ml-4">Privacidad y Seguridad</h3>
          <div className="bg-white dark:bg-dark-white p-4 rounded-[2.5rem] shadow-xl shadow-light/50 dark:shadow-none space-y-3 border border-gray-50 dark:border-dark-light/5">
            <SettingItem icon="security" title="Verificación en dos pasos" desc="Añade una capa extra de seguridad a tu cuenta maestra." active={settings.twoFactor} onClick={() => toggleSetting('twoFactor')} />
            <SettingItem icon="history" title="Registro de Actividad" desc="Guardar un log detallado de todas las acciones del sistema." active={settings.activityLog} onClick={() => toggleSetting('activityLog')} />
          </div>
        </section>

        <section>
          <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 ml-4">Notificaciones</h3>
          <div className="bg-white dark:bg-dark-white p-4 rounded-[2.5rem] shadow-xl shadow-light/50 dark:shadow-none space-y-3 border border-gray-50 dark:border-dark-light/5">
            <SettingItem icon="notifications_active" title="Alertas de Registro" desc="Notificar cuando un empleado llega fuera de horario." active={settings.lateAlerts} onClick={() => toggleSetting('lateAlerts')} />
            <SettingItem icon="email" title="Reportes Semanales" desc="Enviar resumen automático de asistencia al correo." active={settings.weeklyReports} onClick={() => toggleSetting('weeklyReports')} />
            <SettingItem icon="devices" title="Alertas de Dispositivos" desc="Avisar si se detecta un inicio de sesión inusual." active={settings.deviceAlerts} onClick={() => toggleSetting('deviceAlerts')} />
          </div>
        </section>

        <div className="flex justify-end gap-4 mt-12 px-2">
          <button onClick={() => setShowDiscardModal(true)} className="px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-info-dark/40 dark:text-dark-text-variant hover:bg-gray-100 dark:hover:bg-dark-light transition-all">
            Restablecer
          </button>
          <motion.button onClick={() => setShowSaveModal(true)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all">
            Guardar Cambios
          </motion.button>
        </div>
      </div>

      {/* MODAL 1: CONFIRMAR GUARDAR */}
      <Modal 
        isOpen={showSaveModal} 
        onClose={() => setShowSaveModal(false)} 
        onConfirm={handleConfirmSave}
        icon="save_as"
        title="¿Guardar cambios?"
        message="¿Estás seguro de que deseas aplicar estas nuevas configuraciones al sistema?"
        confirmText="Confirmar"
      />

      {/* MODAL 2: ÉXITO AL GUARDAR */}
      <Modal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
        onConfirm={() => setShowSuccessModal(false)}
        icon="check_circle"
        title="¡Completado!"
        message="Tus ajustes se han sincronizado correctamente en todos los nodos de SyncLogic."
        confirmText="Entendido"
        isSuccess={true}
      />

      {/* MODAL 3: ADVERTENCIA DESCARTAR */}
      <Modal 
        isOpen={showDiscardModal} 
        onClose={() => setShowDiscardModal(false)} 
        onConfirm={handleReset}
        icon="warning"
        title="¿Deseas descartar?"
        message="Hay cambios sin guardar que se perderán permanentemente si decides restablecer ahora."
        confirmText="Sí, Descartar"
        isDanger={true}
      />
    </motion.div>
  );
}