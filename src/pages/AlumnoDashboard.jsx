import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import Layout from '../components/Layout';
import { GraduationCap, TrendingUp, BookOpen, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';

export default function AlumnoDashboard() {
  const usuario = useAuthStore((s) => s.usuario);
  
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí traemos las asistencias de la BD real
    const fetchAsistencias = async () => {
      try {
        const res = await api.get('/asistencias/');
        setAsistencias(res.data);
      } catch (error) {
        console.error("Error cargando asistencias", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAsistencias();
  }, []);

  // Calculamos el % de asistencia (simulado con los datos reales)
  const totalAsistencias = asistencias.length;
  const faltas = asistencias.filter(a => a.estado === 'Falta').length;

  return (
    <Layout>
      <motion.header 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center bg-white/[0.02] backdrop-blur-[30px] border border-purple-500/20 p-8 rounded-[2rem] shadow-[0_8px_32px_0_rgba(139,92,246,0.1)] relative z-20"
      >
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">
            ¡Hola, {usuario?.nombre}! 🎓
          </h1>
          <p className="text-[#a3a3a3] mt-2 text-sm font-light">
            Matrícula: <strong className="text-purple-400">{usuario?.matricula || 'Sin asignar'}</strong>
          </p>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-20 mb-8">
        <motion.div className="bg-white/[0.02] backdrop-blur-[30px] p-8 rounded-[2rem] border border-white/10 shadow-lg flex flex-col items-center justify-center text-center">
          <CheckCircle size={48} className="text-purple-400 mb-4" />
          <p className="text-4xl font-bold text-white">{totalAsistencias}</p>
          <p className="text-[#a3a3a3] mt-2 text-sm">Clases Registradas</p>
        </motion.div>
        
        <motion.div className="bg-white/[0.02] backdrop-blur-[30px] p-8 rounded-[2rem] border border-white/10 shadow-lg flex flex-col items-center justify-center text-center">
          <Clock size={48} className="text-red-400 mb-4" />
          <p className="text-4xl font-bold text-white">{faltas}</p>
          <p className="text-[#a3a3a3] mt-2 text-sm">Faltas Registradas</p>
        </motion.div>

        <motion.div className="bg-white/[0.02] backdrop-blur-[30px] p-8 rounded-[2rem] border border-white/10 shadow-lg flex flex-col items-center justify-center text-center">
          <BookOpen size={48} className="text-blue-400 mb-4" />
          <p className="text-4xl font-bold text-white">6</p>
          <p className="text-[#a3a3a3] mt-2 text-sm">Materias en Curso</p>
        </motion.div>
      </div>
    </Layout>
  );
}