import { useState, useEffect, useMemo } from 'react'; // Importamos useMemo
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Preloader from '../components/Preloader';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showPreloader, setShowPreloader] = useState(false); 
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [toast, setToast] = useState<{ text: string, type: 'error' | 'success' } | null>(null);
  const navigate = useNavigate();

  // Generamos los datos de las burbujas una sola vez usando useMemo
  // Esto evita que las partículas cambien de posición al escribir en los inputs
  const bubbleData = useMemo(() => {
    return [...Array(10)].map((_, i) => ({
      id: i,
      size: Math.random() * 8 + 4,
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.3 + 0.1,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 10,
      drift: Math.random() * 50 - 25
    }));
  }, []); // Array de dependencias vacío para que solo se ejecute al montar

  // Forzamos el fondo oscuro en el body al montar el componente
  useEffect(() => {
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#000814';

    return () => {
      document.body.style.backgroundColor = originalBg; 
    };
  }, []);

  const showToast = (text: string, type: 'error' | 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('ACCESO DENEGADO: Por favor, ingrese sus credenciales.', 'error');
      return;
    }
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setShowPreloader(true); 
      localStorage.setItem('syncLogic_auth', 'true');
      setTimeout(() => {
        navigate('/');
      }, 6000); 
    }, 1500);
  };

  const handleRecoverPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('ERROR: Ingrese su correo para recuperar el acceso.', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showToast('FORMATO INVÁLIDO: Ingrese un correo electrónico real.', 'error');
      return;
    }
    showToast(`PROTOCOLO ENVIADO: Instrucciones enviadas a ${email}`, 'success');
    setIsForgotPassword(false); 
    setPassword(''); 
  };

  return (
    <>
      {/* NOTIFICACIONES (TOAST) */}
      <div className="fixed top-0 left-0 w-full flex justify-center z-[100] pointer-events-none">
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 30, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl backdrop-blur-2xl border shadow-2xl pointer-events-auto ${
                toast.type === 'error' 
                  ? 'bg-red-950/40 border-red-500/30 text-red-200 shadow-[0_10px_30px_rgba(239,68,68,0.2)]'
                  : 'bg-cyan-950/40 border-cyan-500/30 text-cyan-200 shadow-[0_10px_30px_rgba(34,211,238,0.2)]'
              }`}
            >
              <span className={`material-icons-sharp text-[1.5rem] ${toast.type === 'error' ? 'text-red-400' : 'text-cyan-400'}`}>
                {toast.type === 'error' ? 'gpp_bad' : 'verified_user'}
              </span>
              <p className="text-sm font-semibold tracking-wider uppercase">{toast.text}</p>
              <button onClick={() => setToast(null)} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
                <span className="material-icons-sharp text-[1.2rem]">close</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showPreloader && <Preloader key="system-boot" />}
      </AnimatePresence>

      <div className="relative min-h-screen flex items-center justify-center lg:justify-end lg:pr-[4%] xl:pr-[6%] overflow-hidden font-sans bg-[#000814] selection:bg-cyan-500/30">
        
        {/* EFECTOS DE FONDO */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-40">
          <motion.div 
            className="absolute inset-0 bg-[linear-gradient(110deg,transparent_40%,rgba(34,211,238,0.1)_50%,transparent_60%)] bg-[length:200%_100%]"
            animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#4f46e515_0%,transparent_60%)]"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Burbujas Estabilizadas con useMemo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {bubbleData.map((bubble) => (
            <motion.div
              key={`bubble-${bubble.id}`}
              className="absolute rounded-full blur-[1px] bg-cyan-400"
              style={{ 
                width: `${bubble.size}px`, 
                height: `${bubble.size}px`,
                left: bubble.left,
                bottom: '-20px',
                opacity: bubble.opacity
              }}
              animate={{ y: '-110vh', x: [0, bubble.drift, 0] }}
              transition={{ 
                duration: bubble.duration, 
                repeat: Infinity, 
                ease: "linear", 
                delay: bubble.delay 
              }}
            />
          ))}
        </div>
        
        {/* Marca de agua SL */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center lg:justify-start lg:pl-[5%] pointer-events-none z-0 mix-blend-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <motion.img 
            src="/images/SL.png" 
            alt="SyncLogic Watermark" 
            className="w-[85vw] lg:w-[50vw] max-w-[900px] object-contain opacity-[0.03] shadow-[0_0_50px_rgba(34,211,238,0.1)]" 
            animate={{ y: [0, -25, 0], scale: [1, 1.02, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Luces marinas */}
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[120px] bg-cyan-950/30 pointer-events-none" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full blur-[120px] bg-blue-950/20 pointer-events-none" />

        {/* CONTENEDOR LOGIN */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 w-full max-w-[420px] p-6 mx-4 lg:mx-0"
        >
          <div className="backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-9 relative overflow-hidden bg-white/[0.01] shadow-[0_15px_35px_0_rgba(0,0,0,0.4)]">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />

            <div className="flex flex-col items-center justify-center mb-9 relative z-10">
              <motion.div 
                className="w-28 h-28 mb-5 relative rounded-full ring-[4px] ring-white/5 shadow-[0_0_40px_rgba(34,211,238,0.2)]"
                whileHover={{ scale: 1.05 }}
              >
                <div className="absolute inset-0 blur-xl rounded-full bg-cyan-500/10" />
                <img src="/images/logo.png" alt="CMBT Logo" className="w-full h-full object-contain rounded-full relative z-10 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]" />
              </motion.div>
              
              <h2 className="font-extrabold text-3xl tracking-wide text-center text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                Portal <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">CMBT</span>
              </h2>
              <p className="text-[0.7rem] font-bold tracking-[0.2em] mt-2 uppercase text-center text-gray-400 opacity-80">
                Gestión Integral de Asistencia
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!isForgotPassword ? (
                <motion.form 
                  key="login-form"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleLogin} 
                  className="space-y-6 relative z-10"
                >
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors material-icons-sharp text-[1.2rem] text-gray-500 group-focus-within:text-cyan-400">person</span>
                    <input 
                      type="text" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Usuario o Correo" 
                      className="w-full rounded-2xl py-4 pl-[3.25rem] pr-4 text-sm focus:outline-none focus:ring-1 transition-all duration-300 tracking-wide bg-white/[0.03] hover:bg-white/[0.05] border border-white/5 text-white placeholder:text-gray-600 focus:bg-white/[0.06] focus:border-cyan-500/50 focus:ring-cyan-500/50"
                    />
                  </div>

                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors material-icons-sharp text-[1.2rem] text-gray-500 group-focus-within:text-cyan-400">lock</span>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Contraseña" 
                      className="w-full rounded-2xl py-4 pl-[3.25rem] pr-12 text-sm focus:outline-none focus:ring-1 transition-all duration-300 tracking-wide bg-white/[0.03] hover:bg-white/[0.05] border border-white/5 text-white placeholder:text-gray-600 focus:bg-white/[0.06] focus:border-cyan-500/50 focus:ring-cyan-500/50"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[55%] -translate-y-1/2 text-gray-500 hover:text-cyan-400 focus:outline-none">
                      <span className="material-icons-sharp text-[1.05rem]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[0.75rem] pt-1 px-1">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-4.5 h-4.5 rounded border border-gray-600 bg-white/[0.04] group-hover:border-cyan-400 flex items-center justify-center relative overflow-hidden">
                        <input type="checkbox" className="hidden peer" />
                        <motion.span className="material-icons-sharp text-[0.9rem] text-cyan-400 opacity-0 peer-checked:opacity-100 transition-opacity absolute">check</motion.span>
                      </div>
                      <span className="text-gray-400 group-hover:text-gray-200 transition-colors font-medium">Recordarme</span>
                    </label>
                    <button type="button" onClick={() => setIsForgotPassword(true)} className="text-gray-400 hover:text-cyan-400 transition-colors font-medium hover:underline underline-offset-4 decoration-cyan-400/50">¿Olvidó su clave?</button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                    disabled={isAuthenticating}
                    type="submit"
                    className="relative w-full rounded-2xl text-white py-4 font-bold tracking-widest text-xs uppercase transition-all bg-gradient-to-r from-cyan-600 to-blue-700 shadow-[0_5px_15px_rgba(34,211,238,0.2)] hover:shadow-[0_8px_25px_rgba(34,211,238,0.4)] group overflow-hidden mt-8"
                  >
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                    <AnimatePresence mode="wait">
                      {isAuthenticating ? (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-3">
                          <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="material-icons-sharp">autorenew</motion.span>
                          Verificando...
                        </motion.div>
                      ) : (
                        <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-3">
                          Ingresar al Sistema <span className="material-icons-sharp text-[1.1rem]">arrow_forward</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.form>
              ) : (
                <motion.form 
                  key="recover-form"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleRecoverPassword}
                  className="space-y-6 relative z-10"
                >
                  <p className="text-sm text-center text-gray-400 tracking-wide">Ingresa tu correo institucional para recuperar el acceso.</p>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-icons-sharp text-[1.2rem] text-gray-500 group-focus-within:text-cyan-400">mail</span>
                    <input 
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="Correo Electrónico"
                      className="w-full rounded-2xl py-4 pl-[3.25rem] pr-4 text-sm bg-white/[0.03] border border-white/5 text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full rounded-2xl text-white py-4 font-bold text-xs uppercase bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg"
                  >
                    Enviar Enlace
                  </motion.button>
                  <button type="button" onClick={() => setIsForgotPassword(false)} className="w-full text-xs text-gray-500 hover:text-cyan-400 flex items-center justify-center gap-2 uppercase tracking-wider">
                    <span className="material-icons-sharp text-[1rem]">arrow_back</span> Volver al inicio
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-9 flex justify-center items-center gap-3 text-xs tracking-wider text-gray-600">
            <div className="w-6 h-[1px] bg-gray-700/50" />
            <span>Powered by <span className="font-bold text-gray-400">SyncLogic</span></span>
            <div className="w-6 h-[1px] bg-gray-700/50" />
          </div>
        </motion.div>
      </div>
    </>
  );
}