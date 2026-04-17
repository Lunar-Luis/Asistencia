import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Mail, AlertCircle, CheckCircle2, ArrowRight, Loader2, ArrowLeft, Sun, Moon } from 'lucide-react';
// IMPORTANTE: Aseguramos importar tanto loginAPI como todo el módulo api
import { loginAPI } from '../services/api';
import * as api from '../services/api';

const LoginSkeleton = () => (
  <div className="w-full max-w-[400px] p-6 relative z-10 animate-pulse">
    <div className="bg-white dark:bg-slate-800/90 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 p-8 sm:p-10">
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-2xl mb-5"></div>
        <div className="w-40 h-7 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
        <div className="w-32 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
      <div className="space-y-5">
        <div className="w-full h-12 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
        <div className="w-full h-12 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
        <div className="flex justify-between items-center px-1">
          <div className="w-20 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
        <div className="w-full h-12 bg-slate-300 dark:bg-slate-600 rounded-xl mt-4"></div>
      </div>
    </div>
  </div>
);

export default function Login() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ text: string, type: 'error' | 'success' } | null>(null);
  
  // Estado para el modo oscuro independiente del localStorage del usuario logueado
  const [isDark, setIsDark] = useState(() => {
    // Revisa si ya hay preferencia guardada o si el sistema prefiere oscuro
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('themePref');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false; 
    }
    return false;
  });

  const navigate = useNavigate();

  // Efecto para aplicar el tema oscuro
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('themePref', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('themePref', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 500); 
    return () => clearTimeout(timer);
  }, []);

  const showToast = (text: string, type: 'error' | 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      showToast('Por favor, ingrese sus credenciales.', 'error');
      return;
    }
    
    setIsAuthenticating(true);
    
    try {
      const data = await loginAPI(email, password);

      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('rol', data.rol);
      localStorage.setItem('lastActivity', Date.now().toString()); 

      if (data.avatarUrl) {
        localStorage.setItem('avatar', data.avatarUrl);
      } else {
        localStorage.removeItem('avatar');
      }

      showToast('¡Bienvenido!', 'success');
      navigate('/');
      
    } catch {
      showToast('Usuario o contraseña incorrectos.', 'error');
      setIsAuthenticating(false); 
    }
  };

  const handleRecoverPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { 
      showToast('Ingrese su correo.', 'error'); 
      return; 
    }
    
    // Ponemos el botón en estado de carga (opcional, pero da buen feedback)
    setIsAuthenticating(true); 

    try {
      // 1. Llamamos a nuestra nueva función de la API
      const response = await api.solicitarRecuperacionPassword(email);
      
      // 2. Mostramos éxito
      showToast(response.message || `Instrucciones enviadas a ${email}`, 'success');
      
      // 3. Limpiamos y volvemos al login normal
      setIsForgotPassword(false); 
      setPassword(''); 

    // CORRECCIÓN ESLINT: En lugar de usar (error: any), usamos unknown y verificamos el tipo
    } catch (error: unknown) {
      // Si el backend falla, mostramos el error
      let errorMessage = 'Error al procesar la solicitud.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      showToast(errorMessage, 'error');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    // Fondo agradable: Gradiente suave que se adapta a claro/oscuro
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-200 font-sans selection:bg-blue-200 dark:selection:bg-blue-900 relative overflow-hidden transition-colors duration-300">
      
      {/* Botón de cambio de tema superior derecho */}
      <div className="absolute top-6 right-6 z-50">
        <button 
          onClick={() => setIsDark(!isDark)} 
          className="p-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur shadow-sm border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none transition-colors"
          title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="fixed top-4 w-full flex justify-center z-[100] pointer-events-none">
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

      {isPageLoading ? (
        <LoginSkeleton />
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="w-full max-w-[420px] p-6 relative z-10">
          
          <div className="bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700/50 p-8 sm:p-10 transition-colors">
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="w-20 h-20 bg-white dark:bg-slate-700 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-600 flex items-center justify-center mb-5 p-2 transition-colors">
                <img src="/images/logo.png" alt="CMBT Logo" className="w-full h-full object-contain" />
              </div>
              <h2 className="font-extrabold text-[26px] text-slate-800 dark:text-white tracking-tight transition-colors">CMBT</h2>
              <p className="text-[11px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-1 transition-colors">Control de Asistencia</p>
            </div>

            <AnimatePresence mode="wait">
              {!isForgotPassword ? (
                <motion.form key="login-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onSubmit={handleLogin} className="space-y-5">
                  <div className="relative group">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                    <input 
                      type="text" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="Usuario o Correo" 
                      className="w-full rounded-xl py-3 pl-11 pr-4 text-sm font-medium border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                    />
                  </div>
                  <div className="relative group">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      placeholder="Contraseña" 
                      className="w-full rounded-xl py-3 pl-11 pr-11 text-sm font-medium border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs px-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 dark:bg-slate-900 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors cursor-pointer" />
                      <span className="text-slate-500 dark:text-slate-400 font-medium group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">Recordarme</span>
                    </label>
                    <button type="button" onClick={() => setIsForgotPassword(true)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold hover:underline focus:outline-none transition-colors">¿Olvidó su clave?</button>
                  </div>
                  
                  <button disabled={isAuthenticating} type="submit" className="w-full rounded-xl text-white py-3.5 font-bold tracking-wide text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg shadow-blue-600/20 dark:shadow-none active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6">
                    {isAuthenticating ? <><Loader2 size={18} className="animate-spin" /> Verificando...</> : <>Ingresar <ArrowRight size={18} /></>}
                  </button>
                </motion.form>
              ) : (
                <motion.form key="recover-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onSubmit={handleRecoverPassword} className="space-y-5">
                  <p className="text-[13px] font-medium text-center text-slate-500 dark:text-slate-400 mb-6 px-2 transition-colors">Ingrese su correo institucional para recuperar el acceso.</p>
                  
                  <div className="relative group">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="Correo Electrónico" 
                      className="w-full rounded-xl py-3 pl-11 pr-4 text-sm font-medium border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                    />
                  </div>
                  
                  <button type="submit" className="w-full rounded-xl text-white py-3.5 font-bold tracking-wide text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg shadow-blue-600/20 dark:shadow-none active:scale-[0.98] transition-all mt-4">
                    Enviar Enlace
                  </button>
                  
                  <button type="button" onClick={() => setIsForgotPassword(false)} className="w-full text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-semibold flex items-center justify-center gap-1.5 mt-2 transition-colors focus:outline-none">
                    <ArrowLeft size={16} /> Volver al inicio
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* MARCA DE AGUA SYNCLOGIC AJUSTADA */}
          {/* Se eliminó el cursor-pointer y los estilos de hover para que sea puramente decorativa y discreta */}
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
      )}
    </div>
  );
}