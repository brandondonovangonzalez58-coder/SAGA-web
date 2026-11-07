//pagina del administrador 

import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import Layout from '../components/Layout';
import { Users, BookOpen, ClipboardCheck, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';

export default function AdminDashboard() {
  const usuario = useAuthStore((s) => s.usuario);
  
  const [stats, setStats] = useState({
    alumnos: 0,
    docentes: 0,
    materias: 0,
    asistencias: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Usamos Promise.allSettled para que si una falla, las demás no se caigan
      const results = await Promise.allSettled([
        api.get('/estudiantes/'),
        api.get('/docentes/'),
        api.get('/materias/'),
        api.get('/asistencias/')
      ]);

      // Revisamos cada resultado. Si tuvo éxito, sacamos los datos. Si falló, ponemos 0.
      const alumnos = results[0].status === 'fulfilled' ? results[0].value.data.length : 0;
      const docentes = results[1].status === 'fulfilled' ? results[1].value.data.length : 0;
      const materias = results[2].status === 'fulfilled' ? results[2].value.data.length : 0;
      const asistencias = results[3].status === 'fulfilled' ? results[3].value.data.length : 0;

      setStats({ alumnos, docentes, materias, asistencias });
      setLoading(false);
    };
    
    fetchData();
  }, []);

  const kpis = [
    { title: 'Total Alumnos', value: stats.alumnos, trend: 'Activos', trendUp: true, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { title: 'Docentes', value: stats.docentes, trend: 'En plantilla', trendUp: true, icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { title: 'Materias', value: stats.materias, trend: 'Registradas', trendUp: true, icon: BookOpen, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { title: 'Asistencias', value: stats.asistencias, trend: 'Historial', trendUp: true, icon: ClipboardCheck, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  if (loading) return <Layout><div className="text-white text-center mt-20">Cargando datos reales...</div></Layout>;

  return (
    <Layout>
      <motion.header 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center bg-white/[0.02] backdrop-blur-[30px] border border-white/20 p-8 rounded-[2rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] relative z-20 overflow-hidden"
      >
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">
            ¡Hola de nuevo, {usuario?.nombre}! 👋
          </h1>
          <p className="text-[#a3a3a3] mt-2 text-sm font-light">
            Bienvenido al panel de <span className="text-[#3b82f6] font-semibold">Administrador</span>. Estos son los datos en tiempo real.
          </p>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-20">
        {kpis.map((stat, index) => (
          <motion.div 
            key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
            className="bg-white/[0.02] backdrop-blur-[30px] p-6 rounded-[2rem] border border-white/20 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#a3a3a3] text-sm font-medium">{stat.title}</p>
                <p className="text-4xl font-bold text-white mt-2 drop-shadow-md">{stat.value}</p>
              </div>
              <div className={`${stat.bg} p-4 rounded-2xl ${stat.color} border border-white/5`}>
                <stat.icon size={28} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Layout>
  );
}