import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RefreshCcw, Wifi, Maximize2, ShieldCheck, Activity, Video, Signal } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// Reutilizamos las constantes de estilo para mantener la consistencia
const animProps = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.4 } };
const cardStyle = "bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-6 md:p-8 transition-colors";

const SkeletonCamara = () => (
  <div className="space-y-8 animate-pulse w-full">
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3">
        <div className="w-full aspect-video bg-slate-200 dark:bg-slate-800 rounded-[2.5rem]"></div>
      </div>
      <div className="lg:col-span-1 space-y-6">
        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-[2rem]"></div>
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-[2rem]"></div>
      </div>
    </div>
  </div>
);

export default function MonitoreoCamara() {
  const [isLoading, setIsLoading] = useState(true);
  const [timestamp, setTimestamp] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Referencia para el contenedor de video (para Pantalla Completa)
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    const clock = setInterval(() => setTimestamp(new Date()), 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(clock);
    };
  }, []);

  // Función para manejar la Pantalla Completa
  const handleFullscreen = () => {
    if (videoContainerRef.current) {
      if (!document.fullscreenElement) {
        videoContainerRef.current.requestFullscreen().catch(err => {
          console.error(`Error al intentar entrar en pantalla completa: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  // Función para simular el reinicio/refresco de la cámara
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulamos 2.5 segundos de reconexión
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2500);
  };

  return (
    <main className="pb-8 max-w-[1600px] mx-auto">
      {/* TÍTULO CON ESTILO DEL SISTEMA */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
        <div className="pt-2">
          <h1 className="text-[2.2rem] sm:text-[3rem] md:text-[3.5rem] font-black tracking-tighter uppercase italic leading-[1.1] flex flex-wrap items-center gap-x-2">
            <span className="text-slate-800 dark:text-white">Cámara de</span>
            <span className="bg-gradient-to-r from-primary via-indigo-900 to-primary dark:via-white bg-[length:200%_auto] bg-clip-text text-transparent inline-block not-italic py-1 px-2">
              Seguridad
            </span>
          </h1>
          <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] sm:tracking-[0.4em] mt-2">
            Monitoreo en tiempo real del punto de acceso
          </p>
        </div>
      </motion.div>

      {isLoading ? (
        <SkeletonCamara />
      ) : (
        <motion.div {...animProps} className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* FEED PRINCIPAL DE VIDEO */}
          <div className="lg:col-span-3">
            <div 
              ref={videoContainerRef}
              className={`${cardStyle} !p-2 overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl relative aspect-video group bg-slate-950`}
            >
              <AnimatePresence mode="wait">
                {isRefreshing ? (
                  // ESTADO DE RECONEXIÓN (AQUÍ USAMOS ANIMATEPRESENCE Y CAMERA)
                  <motion.div 
                    key="reconnecting"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 bg-slate-900"
                  >
                    <Camera size={48} className="animate-pulse mb-4 text-slate-600" />
                    <p className="text-xs font-bold tracking-widest uppercase text-slate-400">Reconectando Señal...</p>
                  </motion.div>
                ) : (
                  // FEED DE VIDEO NORMAL
                  <motion.div 
                    key="feed"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900 flex items-center justify-center"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=1200" 
                      alt="Feed"
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                    />
                    
                    {/* MIRA TELEMÉTRICA DECORATIVA */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-32 h-32 sm:w-48 sm:h-48 border border-white/10 rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 bg-primary/80 rounded-full"></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* OVERLAY DE INTERFAZ TÉCNICA (Siempre visible por encima) */}
              <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between pointer-events-none z-30">
                <div className="flex justify-between items-start">
                  <div className={`bg-red-600 text-white px-3 sm:px-4 py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-red-600/40 transition-opacity ${isRefreshing ? 'opacity-0' : 'animate-pulse opacity-100'}`}>
                    <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full"></div> REC 01
                  </div>
                  <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 text-sky-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-mono shadow-xl">
                    {timestamp.toLocaleDateString()} — {timestamp.toLocaleTimeString()}
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div className={`bg-slate-900/60 backdrop-blur-md border border-white/10 text-sky-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] shadow-xl transition-opacity ${isRefreshing ? 'opacity-0' : 'opacity-100'}`}>
                    Punto de Acceso: Terminal Principal A
                  </div>
                  
                  {/* BOTONES INTERACTIVOS */}
                  <div className="flex gap-2 pointer-events-auto">
                    <button 
                      onClick={handleFullscreen}
                      className="p-2.5 sm:p-3 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl text-white hover:bg-primary transition-colors border border-white/10 hover:border-transparent focus:outline-none"
                      title="Pantalla Completa"
                    >
                      <Maximize2 size={18} className="sm:w-5 sm:h-5" />
                    </button>
                    <button 
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className={`p-2.5 sm:p-3 backdrop-blur-md rounded-xl sm:rounded-2xl text-white transition-colors border border-white/10 hover:border-transparent focus:outline-none ${isRefreshing ? 'bg-primary/50 cursor-wait' : 'bg-white/10 hover:bg-primary'}`}
                      title="Reiniciar Conexión"
                    >
                      <RefreshCcw size={18} className={`sm:w-5 sm:h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PANEL DE ESTADO LATERAL */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* CARD DE CONEXIÓN */}
            <div className={`${cardStyle} flex flex-col`}>
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-5 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isRefreshing ? 'bg-amber-50 text-amber-500 dark:bg-warning/10 dark:text-warning' : 'bg-emerald-50 text-emerald-600 dark:bg-success/10 dark:text-success'}`}>
                  <Wifi size={16} />
                </div>
                Conectividad
              </h3>
              
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado</span>
                  <span className={`text-[10px] font-black uppercase flex items-center gap-1.5 ${isRefreshing ? 'text-amber-500' : 'text-emerald-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-ping ${isRefreshing ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                    {isRefreshing ? 'Conectando...' : 'Online'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Latencia</span>
                  <span className="text-xs font-black text-slate-700 dark:text-slate-200 font-mono">
                    {isRefreshing ? '-- ms' : '18 ms'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Señal</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`w-1 h-3 rounded-full ${isRefreshing ? 'bg-slate-200 dark:bg-slate-700' : (i < 4 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700')}`}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CARD DE DETALLES TÉCNICOS */}
            <div className={`${cardStyle} flex flex-col`}>
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Activity size={16} />
                </div>
                Rendimiento
              </h3>
              
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest flex items-center gap-1"><Video size={10} /> Resolución</p>
                  <p className="text-xs font-black text-slate-700 dark:text-slate-200">1080p FHD <span className="text-[10px] font-bold text-slate-400">@ 30fps</span></p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest flex items-center gap-1"><Signal size={10} /> Bitrate</p>
                  <p className="text-xs font-black text-slate-700 dark:text-slate-200">
                    {isRefreshing ? '0.0 Mbps' : '4.2 Mbps'}
                  </p>
                </div>
              </div>
            </div>

            {/* CARD DE SEGURIDAD AI */}
            <div className="bg-primary/5 dark:bg-primary/10 p-6 md:p-8 rounded-[2.5rem] border border-primary/20">
              <h3 className="text-sm font-black uppercase text-primary mb-3 flex items-center gap-2">
                <ShieldCheck size={18} /> Seguridad AI
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                El sistema de detección está activo. Las capturas fotográficas se asocian automáticamente al UID del NFC detectado en el terminal.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </main>
  );
}