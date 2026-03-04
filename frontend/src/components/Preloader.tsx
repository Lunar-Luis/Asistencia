import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Preloader() {
  // Estado para el contador de carga falso
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 15) + 5;
        return next > 100 ? 100 : next;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#05070a] overflow-hidden"
    >
      {/* 1. Fondo de Cuadrícula Holográfica Animada */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e515_1px,transparent_1px),linear-gradient(to_bottom,#4f46e515_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] opacity-50" />

      {/* 2. Lluvia de Datos (Data Stream Ascendente) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[2px] h-12 bg-gradient-to-t from-transparent via-primary to-transparent blur-[1px]"
            initial={{ y: "100vh", x: `${Math.random() * 100}vw`, opacity: 0 }}
            animate={{ y: "-20vh", opacity: [0, 1, 0] }}
            transition={{ 
              duration: 2 + Math.random() * 3, 
              repeat: Infinity, 
              delay: Math.random() * 2, 
              ease: "linear" 
            }}
          />
        ))}
      </div>

      <div className="relative flex items-center justify-center mt-8">
        
        {/* 3. Anillos Orbitales 3D Mejorados (Estilo HUD Radar) */}
        {[
          { size: 180, border: 'border-dashed border-[2px] border-primary/40', duration: 8, dir: 1 },
          { size: 230, border: 'border-solid border-t-primary border-b-primary border-x-transparent border-[3px] opacity-60', duration: 5, dir: -1 },
          { size: 280, border: 'border-dotted border-[4px] border-indigo-500/30', duration: 12, dir: 1 },
          { size: 330, border: 'border-solid border-[1px] border-primary/10', duration: 15, dir: -1 }
        ].map((ring, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${ring.border}`}
            style={{ width: ring.size, height: ring.size }}
            animate={{ 
              rotateX: i % 2 === 0 ? [0, 360] : 0, 
              rotateY: i % 2 !== 0 ? [0, 360] : 0,
              rotateZ: [0, 360 * ring.dir] 
            }}
            transition={{ 
              duration: ring.duration, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        ))}

        {/* Gran Halo de Energía (Glow Central que palpita) */}
        <motion.div
          className="absolute w-64 h-64 bg-primary/20 rounded-full blur-[80px]"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* 4. Contenedor del Logo con Escaneo y Flotación */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: [0, -10, 0], opacity: 1 }}
          transition={{ 
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 1 }
          }}
          className="relative z-10 w-32 h-32"
        >
          {/* Línea de Escaneo Láser Vertical con rastro */}
          <motion.div 
            className="absolute left-0 right-0 h-[3px] bg-white z-30 shadow-[0_0_20px_#4f46e5,0_0_40px_#4f46e5]"
            animate={{ top: ["-10%", "110%", "-10%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          {/* Logo con brillo Shimmer */}
          <div className="relative w-full h-full">
            <motion.div 
              className="absolute inset-0 z-20"
              style={{
                maskImage: 'url(/images/SL.png)',
                WebkitMaskImage: 'url(/images/SL.png)',
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
                background: 'linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)',
              }}
              animate={{ backgroundPosition: ['0% -200%', '0% 200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <img 
              src="/images/SL.png" 
              alt="Logo" 
              className="w-full h-full object-contain relative z-10 brightness-110 drop-shadow-[0_0_15px_rgba(79,70,229,0.5)]"
            />
          </div>
        </motion.div>
      </div>

      {/* 5. Tipografía Digital y Contador */}
      <motion.div
        className="mt-24 text-center z-10"
        initial={{ letterSpacing: "0.1rem", opacity: 0 }}
        animate={{ letterSpacing: "0.5rem", opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <h2 className="text-white font-black text-4xl tracking-widest uppercase flex items-center justify-center drop-shadow-[0_0_10px_rgba(79,70,229,0.8)]">
          SYNC
          <span className="relative ml-3 text-primary">
            LOGIC
            {/* Subrayado animado tipo barra de progreso */}
            <motion.span 
              className="absolute -bottom-2 left-0 h-[4px] bg-primary shadow-[0_0_10px_#4f46e5]"
              animate={{ width: ["0%", "100%", "0%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </h2>
        
        {/* Contador de porcentaje Dinámico */}
        <div className="mt-6 flex flex-col items-center justify-center gap-2">
          <motion.p 
            className="text-primary/70 text-sm font-mono tracking-[0.4rem] animate-pulse"
          >
            INICIALIZANDO SISTEMA
          </motion.p>
          <div className="text-white/90 font-mono text-xl font-bold tracking-widest">
            [{progress}%]
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}