import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, BookOpen, ClipboardCheck, LogOut, GraduationCap,
  Library, Users2, Calendar, CalendarDays, Shield, UserCheck, UserPlus,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

export default function Sidebar() {
  const logout = useAuthStore((s) => s.logout);
  const usuario = useAuthStore((s) => s.usuario);
  const navigate = useNavigate();

  // Estados para los menús desplegables
  const [openMenus, setOpenMenus] = useState({ academico: true, seguridad: false });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = (menuKey) => {
    setOpenMenus((prev) => ({ ...prev, [menuKey]: !prev[menuKey] }));
  };

  // Estructura de menús agrupados (LIMPIA, SIN DUPLICADOS)
  const menuGroups = [
    {
      id: 'principal',
      title: null, 
      items: [
        { path: '/dashboard', name: 'Inicio', icon: Home, roles: ['Administrador', 'Docente', 'Estudiante'] },
      ]
    },
    {
      id: 'academico',
      title: 'Gestión Académica',
      items: [
        { path: '/estudiantes', name: 'Estudiantes', icon: GraduationCap, roles: ['Administrador'] },
        { path: '/docentes', name: 'Docentes', icon: UserCheck, roles: ['Administrador'] },
        { path: '/carreras', name: 'Carreras', icon: Library, roles: ['Administrador'] },
        { path: '/grupos', name: 'Grupos', icon: Users2, roles: ['Administrador', 'Docente'] },
        { path: '/materias', name: 'Materias', icon: BookOpen, roles: ['Administrador'] },
        { path: '/sesiones', name: 'Sesiones', icon: Calendar, roles: ['Administrador', 'Docente'] },
        { path: '/periodos', name: 'Periodos', icon: CalendarDays, roles: ['Administrador'] },
      ]
    },
    {
      id: 'operaciones',
      title: 'Operaciones',
      items: [
        { path: '/asistencias', name: 'Pasar Lista', icon: ClipboardCheck, roles: ['Administrador', 'Docente'] },
      ]
    },
    {
      id: 'seguridad',
      title: 'Seguridad',
      items: [
        { path: '/usuarios', name: 'Usuarios', icon: UserPlus, roles: ['Administrador'] },
        { path: '/roles', name: 'Roles', icon: Shield, roles: ['Administrador'] },
      ]
    }
  ];

  // Filtramos los menús según el rol
  const filteredGroups = menuGroups.map(group => ({
    ...group,
    items: group.items.filter(item => item.roles.includes(usuario?.rol))
  })).filter(group => group.items.length > 0);

  return (
    <aside className="w-64 bg-white/[0.02] backdrop-blur-[30px] border-r border-white/[0.08] text-white flex flex-col h-screen fixed left-0 top-0 z-20">
      
      {/* LOGO CON ANIMACIÓN DE PULSO */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/[0.08] shrink-0">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <GraduationCap size={32} className="text-[#3b82f6] drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
        </motion.div>
        <div>
          <h1 className="text-2xl font-bold tracking-wider leading-none drop-shadow-md">SAGA</h1>
          <p className="text-[10px] text-[#a3a3a3] mt-1 font-light">{usuario?.rol}</p>
        </div>
      </div>

      {/* MENÚS DESPLEGABLES */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto custom-scrollbar">
        {filteredGroups.map((group) => (
          <div key={group.id} className="mb-2">
            
            {/* Botón del acordeón (con flechita animada) */}
            {group.title && (
              <button 
                onClick={() => toggleMenu(group.id)}
                className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-[#737373] uppercase tracking-wider hover:text-white transition-colors"
              >
                {group.title}
                <motion.div
                  animate={{ rotate: openMenus[group.id] ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={14} />
                </motion.div>
              </button>
            )}

            {/* Items del menú con animación de despliegue */}
            <AnimatePresence initial={false}>
              {(openMenus[group.id] || !group.title) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden space-y-1"
                >
                  {group.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium group ${
                          isActive 
                            ? 'bg-[#3b82f6] text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' 
                            : 'text-[#a3a3a3] hover:bg-white/[0.05] hover:text-white'
                        }`
                      }
                    >
                      {/* Animación del icono al pasar el mouse */}
                      <motion.div 
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <item.icon size={18} />
                      </motion.div>
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* BOTÓN DE SALIR CON ANIMACIÓN */}
      <div className="p-3 border-t border-white/[0.08] shrink-0">
        <motion.button
          whileHover={{ x: 5 }} // Se mueve a la derecha al pasar el mouse
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors"
        >
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </motion.button>
      </div>
    </aside>
  );
}