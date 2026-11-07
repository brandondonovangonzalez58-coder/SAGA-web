import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import Layout from '../components/Layout';
import { BookOpen, Users, ClipboardCheck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function DocenteDashboard() {
  const usuario = useAuthStore((s) => s.usuario);
  const navigate = useNavigate();

  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const res = await api.get('/grupos/');
        setGrupos(res.data);
      } catch (error) {
        console.error("Error cargando grupos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGrupos();
  }, []);

  return (
    <Layout>
      <motion.header 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center bg-white/[0.02] backdrop-blur-[30px] border border-emerald-500/20 p-8 rounded-[2rem] shadow-[0_8px_32px_0_rgba(16,185,129,0.1)] relative z-20"
      >
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">
            Hola, Profe {usuario?.nombre} 👨‍🏫
          </h1>
          <p className="text-[#a3a3a3] mt-2 text-sm font-light">
            Tienes <strong className="text-emerald-400">{grupos.length} grupos</strong> registrados en el sistema.
          </p>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-20">
        
        {/* Botón de Acción Rápida */}
        <motion.div 
          onClick={() => navigate('/asistencias')}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="lg:col-span-1 bg-gradient-to-br from-emerald-500/20 to-emerald-900/20 border border-emerald-500/30 p-8 rounded-[2rem] flex flex-col items-center justify-center text-center cursor-pointer backdrop-blur-xl group"
        >
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
            <ClipboardCheck size={40} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Pasar Lista</h2>
          <p className="text-[#a3a3a3] text-sm">Ir al módulo de asistencias.</p>
        </motion.div>

        {/* Lista de Grupos Reales */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white/[0.02] backdrop-blur-[30px] p-8 rounded-[2rem] border border-white/10 shadow-lg"
        >
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Users className="text-emerald-400" size={20} /> Tus Grupos Asignados
          </h3>
          
          {loading ? (
            <p className="text-gray-400">Cargando...</p>
          ) : grupos.length === 0 ? (
            <p className="text-gray-400">Aún no tienes grupos asignados.</p>
          ) : (
            <div className="space-y-4">
              {grupos.slice(0, 4).map((grupo, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center font-bold text-lg">
                      {grupo.nombre}
                    </div>
                    <div>
                      <p className="text-white font-medium">Cuatrimestre {grupo.cuatrimestre || '-'}</p>
                      <p className="text-[#a3a3a3] text-sm">Turno: {grupo.turno}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}