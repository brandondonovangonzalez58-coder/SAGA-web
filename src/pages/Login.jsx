import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Eye, EyeOff, ArrowRight, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import LoadingScreen from '../components/LoadingScreen'; // Importamos la pantalla de carga

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Estados para el input con brillo
  const [focusCorreo, setFocusCorreo] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);

  // Estados para la pantalla de carga
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [rolLoading, setRolLoading] = useState('Administrador');

  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    
    try {
      const res = await api.post('/auth/login', { correo, password });
      
      // 1. Guardamos el usuario y token en Zustand
      login(res.data.usuario, res.data.access_token);
      
      // 2. Obtenemos el rol para pintar la pantalla de carga correcta
      setRolLoading(res.data.usuario.rol);
      
      // 3. Activamos la pantalla de carga
      setIsAuthenticating(true);

      // 4. Esperamos 5 segundos y mandamos al Dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 5000);

    } catch (err) {
      setError(err.response?.data?.detail || 'Correo o contraseña incorrectos');
      setCargando(false);
    } 
  };

  // SI ESTÁ EN MODO DE AUTENTICACIÓN, MOSTRAMOS LA PANTALLA DE CARGA
  if (isAuthenticating) {
    return <LoadingScreen rol={rolLoading} />;
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#020202] overflow-hidden font-sans">
      
      {/* Fondo de ondas simuladas con más brillo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/30 via-black to-black transform -rotate-12 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-black to-transparent transform rotate-45 blur-3xl"></div>
      </div>

      {/* Animación de entrada para el contenedor principal */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[420px] p-8 md:p-10 rounded-[2.5rem] bg-white/[0.02] backdrop-blur-[30px] shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] overflow-hidden"
      >
        
        {/* EL BRILLO DEL BORDE */}
        <div className="absolute inset-0 rounded-[2.5rem] border border-white/20 [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none"></div>
        
        {/* Brillo superior */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none"></div>

        {/* Encabezado con el icono centrado y flotante */}
        <div className="mb-8 relative z-20 flex flex-col items-center text-center mt-2">
          
          {/* ICONO ILUMINADO Y CENTRADO */}
          <motion.div 
            animate={{ y: [0, -8, 0] }} 
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="relative flex items-center justify-center mb-5"
          >
            {/* Resplandor (Glow) */}
            <div className="absolute inset-0 bg-[#3b82f6] blur-[25px] opacity-40 rounded-full"></div>
            
            {/* Contenedor del icono */}
            <div className="relative w-16 h-16 bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.6)] border border-blue-400/30">
              <GraduationCap className="text-white drop-shadow-md" size={32} />
            </div>
          </motion.div>

          <h2 className="text-[32px] font-bold text-white tracking-tight mb-2 drop-shadow-md">
            Bienvenido de nuevo
          </h2>
          <p className="text-[#a3a3a3] text-[13px] font-light max-w-[280px]">
            Ingresa tus credenciales para acceder al sistema.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-20">
          
          {/* ================= CAMPO CORREO ================= */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="space-y-2 relative"
          >
            <label className="block text-[13px] font-medium text-[#d4d4d4]">
              Correo Electrónico
            </label>
            <div className={`relative rounded-xl transition-all duration-300 ${focusCorreo ? 'shadow-[0_0_20px_rgba(59,130,246,0.5)] bg-[#3b82f6]/5' : 'shadow-inner'}`}>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                onFocus={() => setFocusCorreo(true)}
                onBlur={() => setFocusCorreo(false)}
                required
                placeholder="admin@saga.com"
                className={`w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3.5 pl-4 pr-10 text-white placeholder-[#737373] text-sm focus:outline-none transition-all ${focusCorreo ? 'border-[#3b82f6]/80 bg-white/[0.08]' : ''}`}
              />
              <Mail className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusCorreo ? 'text-[#3b82f6]' : 'text-[#737373]'}`} size={18} />
            </div>
          </motion.div>

          {/* ================= CAMPO CONTRASEÑA ================= */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className="space-y-2 relative"
          >
            <label className="block text-[13px] font-medium text-[#d4d4d4]">
              Contraseña
            </label>
            <div className={`relative rounded-xl transition-all duration-300 ${focusPassword ? 'shadow-[0_0_20px_rgba(59,130,246,0.5)] bg-[#3b82f6]/5' : 'shadow-inner'}`}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusPassword(true)}
                onBlur={() => setFocusPassword(false)}
                required
                placeholder="••••••••"
                className={`w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3.5 pl-4 pr-10 text-white placeholder-[#737373] text-sm focus:outline-none transition-all ${focusPassword ? 'border-[#3b82f6]/80 bg-white/[0.08]' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusPassword ? 'text-[#3b82f6]' : 'text-[#737373]'} hover:text-white`}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </motion.div>

          {/* ================= RECORDAR Y OLVIDAR ================= */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex items-center justify-between pt-1 pb-2"
          >
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="peer appearance-none w-4 h-4 border border-white/20 rounded-[4px] bg-white/[0.03] checked:bg-[#3b82f6] checked:border-[#3b82f6] transition-all cursor-pointer"
                />
                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 14 14" fill="none">
                  <path d="M3 8L6 11L11 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-[13px] text-[#a3a3a3] group-hover:text-white transition-colors">Recordarme</span>
            </label>
            <a href="#" className="text-[13px] text-[#a3a3a3] hover:text-[#3b82f6] transition-colors">
              ¿Olvidaste tu contraseña?
            </a>
          </motion.div>

          {/* Mensaje de Error Animado */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2.5 rounded-xl text-[13px] text-center mb-2 backdrop-blur-md"
            >
              {error}
            </motion.div>
          )}

          {/* ================= BOTÓN INICIAR SESIÓN ================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={cargando}
              className="w-full flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] disabled:opacity-70"
            >
              {cargando ? 'Validando credenciales...' : 'Iniciar Sesión'}
              {!cargando && <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}><ArrowRight size={18} /></motion.div>}
            </motion.button>
          </motion.div>
        </form>

        {/* Separador */}
        <div className="flex items-center my-6 relative z-20">
          <div className="flex-1 border-t border-white/[0.08]"></div>
          <span className="px-3 text-[11px] font-medium text-[#737373] tracking-wider uppercase">O continuar con</span>
          <div className="flex-1 border-t border-white/[0.08]"></div>
        </div>

        {/* Botones Sociales */}
        <div className="flex gap-3 relative z-20">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" className="flex-1 flex items-center justify-center gap-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] py-2.5 rounded-xl transition-colors text-[13px] text-[#d4d4d4]">
             <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
             Google
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" className="flex-1 flex items-center justify-center gap-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] py-2.5 rounded-xl transition-colors text-[13px] text-[#d4d4d4]">
             <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
               <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.06 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
             </svg>
             Apple
          </motion.button>
        </div>

        {/* Footer */}
        <p className="text-center text-[13px] text-[#a3a3a3] mt-8 relative z-20">
          ¿No tienes una cuenta? <a href="#" className="text-[#3b82f6] font-medium hover:underline transition-all ml-1">Contacta al administrador</a>
        </p>
      </motion.div>
    </div>
  );
}