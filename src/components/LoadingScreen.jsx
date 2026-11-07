import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, ShieldCheck, Database, LayoutDashboard, BookOpen, Users } from 'lucide-react';

export default function LoadingScreen({ rol = 'Administrador' }) {
  
  // Configuración por Rol
  const config = {
    Administrador: {
      colorPrimario: '#3b82f6', // Azul
      colorSecundario: '#06b6d4', // Cyan
      pasos: [
        { texto: "Verificando credenciales de Admin...", icono: ShieldCheck },
        { texto: "Conectando con la base de datos...", icono: Database },
        { texto: "Cargando panel de control global...", icono: LayoutDashboard }
      ]
    },
    Docente: {
      colorPrimario: '#10b981', // Verde esmeralda
      colorSecundario: '#34d399',
      pasos: [
        { texto: "Verificando credenciales de Docente...", icono: ShieldCheck },
        { texto: "Cargando tus grupos y materias...", icono: BookOpen },
        { texto: "Preparando pase de lista...", icono: Users }
      ]
    },
    Estudiante: {
      colorPrimario: '#8b5cf6', // Morado
      colorSecundario: '#a78bfa',
      pasos: [
        { texto: "Verificando credenciales de Alumno...", icono: ShieldCheck },
        { texto: "Consultando tu historial académico...", icono: Database },
        { texto: "Preparando tu espacio...", icono: GraduationCap }
      ]
    }
  };

  // Si el rol no coincide, usa Administrador por defecto
  const currentConfig = config[rol] || config.Administrador;
  const { colorPrimario, colorSecundario, pasos } = currentConfig;

  const [pasoActual, setPasoActual] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPasoActual((prev) => (prev < pasos.length - 1 ? prev + 1 : prev));
    }, 1600);
    return () => clearInterval(interval);
  }, [pasos.length]);

  const IconoActual = pasos[pasoActual].icono;

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-[#020202] overflow-hidden font-sans">
      
      {/* FONDO ANIMADO: Partículas flotantes con el color del rol */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: colorPrimario }}
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 100,
              opacity: Math.random() * 0.5 + 0.1,
            }}
            animate={{
              y: -100,
              opacity: [0.2, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 3,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2,
            }}
          />
        ))}
        {/* Resplandor central dinámico */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px] opacity-20"
          style={{ backgroundColor: colorPrimario }}
        ></div>
      </div>

      {/* CONTENEDOR CENTRAL */}
      <div className="relative z-10 flex flex-col items-center">
        
        <div className="relative w-40 h-40 flex items-center justify-center mb-10">
          
          {/* Anillo exterior */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute inset-0 rounded-full border-t-2 border-r-2 border-dashed opacity-40"
            style={{ borderColor: colorPrimario }}
          />
          
          {/* Anillo interior */}
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute inset-4 rounded-full border-b-2 border-l-2 opacity-60"
            style={{ borderColor: colorSecundario }}
          />

          {/* Escáner Láser */}
          <motion.div 
            animate={{ top: ['10%', '90%', '10%'] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute left-0 right-0 h-1 z-20 opacity-70"
            style={{ 
              background: `linear-gradient(to right, transparent, ${colorPrimario}, transparent)`,
              boxShadow: `0 0 15px ${colorPrimario}`
            }}
          />

          {/* Icono Central */}
          <motion.div 
            animate={{ scale: [1, 1.05, 1], y: [0, -5, 0] }} 
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="relative w-20 h-20 rounded-2xl flex items-center justify-center z-10 border"
            style={{ 
              background: `linear-gradient(to bottom right, ${colorPrimario}, #1e1b4b)`,
              boxShadow: `0 0 40px ${colorPrimario}80`,
              borderColor: colorSecundario
            }}
          >
            <GraduationCap className="text-white drop-shadow-md" size={40} />
          </motion.div>
        </div>

        {/* Títulos */}
        <motion.h1 
          initial={{ opacity: 0, letterSpacing: "0.5em" }} 
          animate={{ opacity: 1, letterSpacing: "1em" }}
          transition={{ duration: 1.5 }}
          className="text-3xl font-bold text-white mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        >
          SAGA
        </motion.h1>
        
        {/* Textos dinámicos */}
        <div className="h-8 flex items-center justify-center mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pasoActual}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 text-[#a3a3a3] text-sm font-medium tracking-wide"
            >
              <IconoActual size={16} style={{ color: colorPrimario }} />
              {pasos[pasoActual].texto}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Barra de progreso */}
        <div className="relative w-72 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
          <motion.div 
            initial={{ width: "0%" }} 
            animate={{ width: "100%" }} 
            transition={{ duration: 5, ease: "easeInOut" }}
            className="absolute top-0 left-0 h-full rounded-full"
            style={{ background: `linear-gradient(to right, ${colorPrimario}, ${colorSecundario}, ${colorPrimario})` }}
          />
          <motion.div 
            initial={{ left: "-100%" }} 
            animate={{ left: "100%" }} 
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12"
          />
        </div>

        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-xs font-bold mt-4 tracking-widest uppercase"
          style={{ color: colorPrimario }}
        >
          Ingresando como {rol}
        </motion.p>

      </div>
    </div>
  );
}