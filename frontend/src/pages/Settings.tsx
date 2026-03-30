import { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // <-- Aquí quitamos AnimatePresence
import { ShieldCheck, Bell, Save, RotateCcw, Clock, CalendarX, FileBarChart, Activity, type LucideIcon } from 'lucide-react';
import Swal from 'sweetalert2';

const animProps = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };
const cardStyle = "bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-5 sm:p-6 md:p-8 transition-colors";

const SettingToggle = ({ icon: Icon, title, desc, active, onClick }: { icon: LucideIcon, title: string, desc: string, active: boolean, onClick: () => void }) => (
  <div onClick={onClick} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl group hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer gap-4">
    <div className="flex items-start sm:items-center gap-4 text-left">
      <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 text-primary shadow-sm group-hover:scale-110 transition-transform shrink-0 border border-slate-100 dark:border-slate-800">
        <Icon size={20} className="sm:hidden" />
        <Icon size={24} className="hidden sm:block" />
      </div>
      <div>
        <h4 className="text-[13px] sm:text-[14px] font-bold text-slate-800 dark:text-white tracking-tight mb-0.5">{title}</h4>
        <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">{desc}</p>
      </div>
    </div>
    <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 shrink-0 self-end sm:self-auto ${active ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}>
      <motion.div animate={{ x: active ? 26 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm" />
    </div>
  </div>
);

// ==========================================
// COMPONENTE SKELETON PARA AJUSTES
// ==========================================
const SkeletonSettings = () => (
  <div className={`${cardStyle} space-y-10 w-full animate-pulse`}>
    {[1, 2, 3].map((section) => (
      <div key={section}>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-6 h-6 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
          <div className="w-48 h-6 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
        <div className="space-y-4">
          {[1, 2].map((item) => (
            <div key={item} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl gap-4 border border-transparent">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-200 dark:bg-slate-800 rounded-xl shrink-0"></div>
                <div className="w-full">
                  <div className="w-32 sm:w-48 h-4 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
                  <div className="w-48 sm:w-64 h-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
              </div>
              <div className="w-12 h-6 bg-slate-200 dark:bg-slate-800 rounded-full self-end sm:self-auto shrink-0"></div>
            </div>
          ))}
        </div>
      </div>
    ))}
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
      <div className="h-12 sm:h-14 bg-slate-200 dark:bg-slate-800 rounded-xl w-full sm:flex-1"></div>
      <div className="h-12 sm:h-14 bg-slate-200 dark:bg-slate-800 rounded-xl w-full sm:flex-[2]"></div>
    </div>
  </div>
);

export default function Settings() {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    cierreAutomatico: true,
    lateAlerts: true,
    weeklyReports: true,
    activityLog: true,
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleSetting = (id: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [id]: typeof prev[id] === 'boolean' ? !prev[id] : prev[id] }));
  };

  const handleConfirmSave = () => {
    const isDark = document.documentElement.classList.contains('dark');
    Swal.fire({
      title: '¿Guardar ajustes?',
      text: "Estas configuraciones afectarán el comportamiento del sistema.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#7380ec',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sí, guardar',
      background: isDark ? '#0f172a' : '#fff',
      color: isDark ? '#f8fafc' : '#334155',
      customClass: { popup: 'rounded-[2rem] border border-transparent dark:border-slate-800' }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({ title: '¡Guardado!', text: 'Parámetros del sistema actualizados.', icon: 'success', background: isDark ? '#0f172a' : '#fff', color: isDark ? '#f8fafc' : '#334155', customClass: { popup: 'rounded-[2rem] border border-transparent dark:border-slate-800' }});
      }
    });
  };

  const handleReset = () => {
    const isDark = document.documentElement.classList.contains('dark');
    Swal.fire({
      title: '¿Restablecer ajustes?',
      text: "Volverán los valores por defecto del sistema.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff7782',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sí, restablecer',
      background: isDark ? '#0f172a' : '#fff',
      color: isDark ? '#f8fafc' : '#334155',
      customClass: { popup: 'rounded-[2rem] border border-transparent dark:border-slate-800' }
    }).then((result) => {
      if (result.isConfirmed) {
        setSettings({ cierreAutomatico: true, lateAlerts: true, weeklyReports: true, activityLog: true });
        Swal.fire({ title: 'Restablecido', icon: 'success', background: isDark ? '#0f172a' : '#fff', color: isDark ? '#f8fafc' : '#334155', customClass: { popup: 'rounded-[2rem] border border-transparent dark:border-slate-800' }});
      }
    });
  };

  return (
    <main className="pb-8 max-w-[900px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
        <h1 className="text-[2.2rem] sm:text-[3rem] md:text-[3.5rem] font-black tracking-tighter uppercase italic leading-[1.1] flex flex-wrap items-center gap-x-2">
          <span className="text-slate-800 dark:text-white">Ajustes del</span>
          <span className="bg-gradient-to-r from-primary via-indigo-900 to-primary dark:via-white bg-[length:200%_auto] bg-clip-text text-transparent inline-block NOT-italic py-1">Sistema</span>
        </h1>
        <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] sm:tracking-[0.4em] mt-2">Parámetros globales de asistencia</p>
      </motion.div>

      {isLoading ? (
        <SkeletonSettings />
      ) : (
        <motion.div {...animProps} className={`${cardStyle} space-y-8 sm:space-y-10`}>
          {/* PARÁMETROS DE ASISTENCIA */}
          <section>
            <div className="flex items-center gap-3 mb-5 sm:mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <Clock className="text-primary" size={24} />
              <h3 className="text-lg sm:text-xl font-black uppercase italic tracking-tighter text-slate-800 dark:text-white">Parámetros de Asistencia</h3>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <SettingToggle icon={CalendarX} title="Cierre Automático de Ausencias" desc="Marcar ausente si no hay lectura 2 horas después de la entrada." active={settings.cierreAutomatico} onClick={() => toggleSetting('cierreAutomatico')} />
            </div>
          </section>

          {/* NOTIFICACIONES Y REPORTES */}
          <section>
            <div className="flex items-center gap-3 mb-5 sm:mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <Bell className="text-primary" size={24} />
              <h3 className="text-lg sm:text-xl font-black uppercase italic tracking-tighter text-slate-800 dark:text-white">Notificaciones y Reportes</h3>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <SettingToggle icon={Bell} title="Alertas de Retrasos" desc="Notificar por correo cuando un empleado llega tarde." active={settings.lateAlerts} onClick={() => toggleSetting('lateAlerts')} />
              <SettingToggle icon={FileBarChart} title="Envío de Reporte Semanal" desc="Generar y enviar el reporte de asistencia cada viernes." active={settings.weeklyReports} onClick={() => toggleSetting('weeklyReports')} />
            </div>
          </section>

          {/* SEGURIDAD */}
          <section>
            <div className="flex items-center gap-3 mb-5 sm:mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <ShieldCheck className="text-primary" size={24} />
              <h3 className="text-lg sm:text-xl font-black uppercase italic tracking-tighter text-slate-800 dark:text-white">Auditoría del Sistema</h3>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <SettingToggle icon={Activity} title="Registro de Actividad (Logs)" desc="Guardar un historial de quién modifica empleados y horarios." active={settings.activityLog} onClick={() => toggleSetting('activityLog')} />
            </div>
          </section>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button onClick={handleReset} className="w-full sm:flex-1 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold uppercase text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 hover:bg-red-50 hover:text-red-500 dark:hover:bg-danger/10 dark:hover:text-danger transition-all border border-transparent hover:border-red-200 dark:hover:border-danger/20 flex items-center justify-center gap-2">
              <RotateCcw size={16}/> Restablecer
            </button>
            <button onClick={handleConfirmSave} className="w-full sm:flex-[2] py-3.5 sm:py-4 bg-primary hover:bg-indigo-600 text-white rounded-xl sm:rounded-2xl font-bold uppercase text-[11px] sm:text-[12px] tracking-widest shadow-lg shadow-primary/30 transition-colors flex items-center justify-center gap-2">
              <Save size={18}/> Guardar Cambios
            </button>
          </div>
        </motion.div>
      )}
    </main>
  );
}