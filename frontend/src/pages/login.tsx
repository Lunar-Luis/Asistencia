import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Mail, AlertCircle, CheckCircle2, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';

// --- COMPONENTE SKELETON PARA EL LOGIN ---
const LoginSkeleton = () => (
  <div className="w-full max-w-[400px] p-6 relative z-10 animate-pulse">
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
      {/* Logo y Título falso */}
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="w-20 h-20 bg-slate-200 rounded-full mb-4"></div>
        <div className="w-32 h-6 bg-slate-200 rounded mb-2"></div>
        <div className="w-24 h-3 bg-slate-200 rounded"></div>
      </div>
      {/* Inputs falsos */}
      <div className="space-y-5">
        <div className="w-full h-12 bg-slate-200 rounded-xl"></div>
        <div className="w-full h-12 bg-slate-200 rounded-xl"></div>
        <div className="flex justify-between items-center px-1">
          <div className="w-20 h-4 bg-slate-200 rounded"></div>
          <div className="w-24 h-4 bg-slate-200 rounded"></div>
        </div>
        {/* Botón falso */}
        <div className="w-full h-12 bg-slate-300 rounded-xl mt-4"></div>
      </div>
    </div>
  </div>
);

export default function Login() {
  const [isPageLoading, setIsPageLoading] = useState(true); // <-- ESTADO DEL SKELETON
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ text: string, type: 'error' | 'success' } | null>(null);
  
  const navigate = useNavigate();

  // Simula la verificación de sesión inicial al cargar la página
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 500); // Muestra el Skeleton por 1 segundo
    return () => clearTimeout(timer);
  }, []);

  const showToast = (text: string, type: 'error' | 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Por favor, ingrese sus credenciales.', 'error');
      return;
    }
    setIsAuthenticating(true);
    setTimeout(() => {
      localStorage.setItem('syncLogic_auth', 'true');
      navigate('/');
    }, 1000);
  };

  const handleRecoverPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { showToast('Ingrese su correo.', 'error'); return; }
    showToast(`Instrucciones enviadas a ${email}`, 'success');
    setIsForgotPassword(false); setPassword(''); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 font-sans selection:bg-blue-200 relative overflow-hidden">
      
      {/* Notificaciones */}
      <div className="fixed top-4 w-full flex justify-center z-[100] pointer-events-none">
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg shadow-lg border pointer-events-auto ${
                toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}
            >
              {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
              <p className="text-sm font-medium">{toast.text}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* LÓGICA DEL SKELETON VS FORMULARIO */}
      {isPageLoading ? (
        <LoginSkeleton />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-[400px] p-6 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
            <div className="flex flex-col items-center justify-center mb-8">
              <img src="/images/logo.png" alt="CMBT Logo" className="w-20 h-20 object-contain mb-4 rounded-full shadow-sm border border-slate-50" />
              <h2 className="font-bold text-2xl text-slate-800">Portal CMBT</h2>
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase mt-1">Control de Asistencia</p>
            </div>

            <AnimatePresence mode="wait">
              {!isForgotPassword ? (
                <motion.form key="login-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleLogin} className="space-y-5">
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Usuario o Correo" className="w-full rounded-xl py-3 pl-11 pr-4 text-sm border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="w-full rounded-xl py-3 pl-11 pr-11 text-sm border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs px-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-slate-500 font-medium">Recordarme</span>
                    </label>
                    <button type="button" onClick={() => setIsForgotPassword(true)} className="text-blue-600 hover:text-blue-800 font-medium hover:underline">¿Olvidó su clave?</button>
                  </div>
                  <button disabled={isAuthenticating} type="submit" className="w-full rounded-xl text-white py-3 font-semibold text-sm bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 mt-4">
                    {isAuthenticating ? <><Loader2 size={18} className="animate-spin" /> Verificando...</> : <>Ingresar <ArrowRight size={18} /></>}
                  </button>
                </motion.form>
              ) : (
                <motion.form key="recover-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleRecoverPassword} className="space-y-5">
                  <p className="text-sm text-center text-slate-500 mb-4">Ingrese su correo institucional para recuperar el acceso.</p>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo Electrónico" className="w-full rounded-xl py-3 pl-11 pr-4 text-sm border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                  <button type="submit" className="w-full rounded-xl text-white py-3 font-semibold text-sm bg-blue-600 hover:bg-blue-700 shadow-md transition-all">Enviar Enlace</button>
                  <button type="button" onClick={() => setIsForgotPassword(false)} className="w-full text-xs text-slate-500 hover:text-blue-600 flex items-center justify-center gap-1 font-medium"><ArrowLeft size={16} /> Volver al inicio</button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
          <div className="mt-8 text-center text-xs text-slate-400">Powered by <span className="font-bold text-slate-500">SyncLogic</span></div>
        </motion.div>
      )}
    </div>
  );
}