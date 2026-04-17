import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ShieldCheck, Loader2, Sun, Moon } from 'lucide-react';
import * as api from '../services/api';

export default function RestablecerClave() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Extrae el token de la URL

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [toast, setToast] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('themePref');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false; 
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('themePref', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('themePref', 'light');
    }
  }, [isDark]);

  // Si alguien entra a la página sin un token en la URL, lo mandamos al login por seguridad
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const showToast = (text: string, type: 'error' | 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleRestablecer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      showToast('Por favor, completa ambos campos.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Las contraseñas no coinciden.', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('La contraseña debe tener al menos 6 caracteres.', 'error');
      return;
    }

    setIsAuthenticating(true);

    try {
      const response = await api.restablecerPasswordAPI(token!, password);
      showToast(response.message || 'Contraseña actualizada con éxito.', 'success');
      
      // Esperamos 2 segundos para que el usuario lea el mensaje y lo mandamos al login
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error: unknown) {
      let errorMessage = 'Error al actualizar la contraseña.';
      if (error instanceof Error) errorMessage = error.message;
      showToast(errorMessage, 'error');
      setIsAuthenticating(false);
    }
  };

  if (!token) return null; // Evita un parpadeo visual antes de redireccionar

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-200 font-sans selection:bg-blue-200 dark:selection:bg-blue-900 relative overflow-hidden transition-colors duration-300 px-4">
      
      <div className="absolute top-6 right-6 z-50">
        <button 
          onClick={() => setIsDark(!isDark)} 
          className="p-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur shadow-sm border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none transition-colors"
          title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="fixed top-4 w-full flex justify-center z-[100] pointer-events-none px-4">
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className={`flex items-center gap-3 px-6 py-3.5 rounded-xl shadow-lg border pointer-events-auto ${
                toast.type === 'error' 
                  ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400' 
                  : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
              }`}
            >
              {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
              <p className="text-sm font-semibold">{toast.text}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="w-full max-w-[420px] relative z-10">
        <div className="bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700/50 p-8 sm:p-10 transition-colors">
          
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-20 h-20 bg-white dark:bg-slate-700 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-600 flex items-center justify-center mb-5 p-2 transition-colors">
              <img src="/images/logo.png" alt="CMBT Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="font-extrabold text-[24px] text-slate-800 dark:text-white tracking-tight transition-colors text-center leading-tight">Crear Nueva Contraseña</h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2 transition-colors text-center px-2">
              Ingresa una nueva contraseña segura para tu cuenta.
            </p>
          </div>

          <form onSubmit={handleRestablecer} className="space-y-5">
            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Nueva Contraseña" 
                className="w-full rounded-xl py-3 pl-11 pr-11 text-sm font-medium border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none transition-colors">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="Confirmar Contraseña" 
                className="w-full rounded-xl py-3 pl-11 pr-11 text-sm font-medium border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" 
              />
            </div>
            
            <button disabled={isAuthenticating} type="submit" className="w-full rounded-xl text-white py-3.5 font-bold tracking-wide text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg shadow-blue-600/20 dark:shadow-none active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6">
              {isAuthenticating ? <><Loader2 size={18} className="animate-spin" /> Guardando...</> : <><ShieldCheck size={18}/> Actualizar y Entrar</>}
            </button>
          </form>

        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 flex flex-col items-center justify-center gap-1.5 cursor-default select-none">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 transition-colors">
            Desarrollado y Protegido por
          </p>
          <div className="flex items-center gap-1.5 opacity-90 transition-opacity">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600 dark:text-blue-500">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-extrabold text-[15px] tracking-tight text-slate-700 dark:text-slate-300 transition-colors">Sync<span className="text-blue-600 dark:text-blue-500">Logic</span></span>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}