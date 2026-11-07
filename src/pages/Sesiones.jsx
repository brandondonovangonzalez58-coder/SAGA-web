import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import api from '../api/axios';
import { Plus, X, Edit2, Trash2, Search, Calendar, Clock, BookOpen, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { confirmDelete, showSuccess, showError } from '../utils/alerts';

export default function Sesiones() {
  const [sesiones, setSesiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buscar, setBuscar] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({ 
    id_grupo_materia: '', 
    fecha: '', 
    hora_inicio: '', 
    hora_fin: '', 
    tema: '', 
    estado: 'Abierta' 
  });

  const fetchSesiones = async (terminoBusqueda = '') => {
    setLoading(true);
    try {
      const url = terminoBusqueda ? `/sesiones/?buscar=${terminoBusqueda}` : '/sesiones/';
      const res = await api.get(url);
      setSesiones(res.data);
    } catch (error) {
      console.error("Error al cargar sesiones", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    const timeoutId = setTimeout(() => fetchSesiones(buscar), 500);
    return () => clearTimeout(timeoutId);
  }, [buscar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { 
        id_grupo_materia: parseInt(formData.id_grupo_materia), 
        fecha: formData.fecha, 
        hora_inicio: formData.hora_inicio || null, 
        hora_fin: formData.hora_fin || null, 
        tema: formData.tema, 
        estado: formData.estado 
      };
      
      if (editingId) await api.put(`/sesiones/${editingId}`, data);
      else await api.post('/sesiones/', data);
      
      setIsModalOpen(false);
      setFormData({ id_grupo_materia: '', fecha: '', hora_inicio: '', hora_fin: '', tema: '', estado: 'Abierta' });
      setEditingId(null);
      fetchSesiones(buscar);
      
      showSuccess(editingId ? 'Sesión actualizada' : 'Sesión creada correctamente');
    } catch (error) {
      showError("Error al guardar", error.response?.data?.detail || "Revisa que el ID de grupo-materia exista.");
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirmDelete();
    if (isConfirmed) {
      try {
        await api.delete(`/sesiones/${id}`);
        fetchSesiones(buscar);
        showSuccess('Sesión eliminada');
      } catch (error) {
        showError("No se puede eliminar", error.response?.data?.detail || "La sesión ya tiene asistencias registradas.");
      }
    }
  };

  const handleEdit = (sesion) => {
    setFormData({ 
      id_grupo_materia: sesion.id_grupo_materia, 
      fecha: sesion.fecha, 
      hora_inicio: sesion.hora_inicio || '', 
      hora_fin: sesion.hora_fin || '', 
      tema: sesion.tema || '', 
      estado: sesion.estado 
    });
    setEditingId(sesion.id_sesion);
    setIsModalOpen(true);
  };

  // Colores para el estado de la sesión
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Abierta': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Cerrada': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      case 'Cancelada': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id_sesion' },
    { header: 'ID Grupo-Materia', accessor: 'id_grupo_materia' },
    { header: 'Fecha', accessor: 'fecha' },
    { header: 'Horario', render: (row) => `${row.hora_inicio || '--:--'} a ${row.hora_fin || '--:--'}` },
    { header: 'Tema', accessor: 'tema', render: (r) => r.tema || '-' },
    { 
      header: 'Estado', 
      accessor: 'estado',
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(row.estado)}`}>
          {row.estado}
        </span>
      )
    },
    { 
      header: 'Acciones', 
      render: (row) => (
        <div className="flex gap-2">
          <motion.button 
            whileHover={{ scale: 1.15, rotate: 5 }} whileTap={{ scale: 0.9 }}
            onClick={() => handleEdit(row)} 
            className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20"
          >
            <Edit2 size={16} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.15, rotate: -5 }} whileTap={{ scale: 0.9 }}
            onClick={() => handleDelete(row.id_sesion)} 
            className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      )
    }
  ];

  return (
    <Layout>
      <header className="flex justify-between items-center mb-8 relative z-20">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">Registro de Sesiones</h1>
          <p className="text-[#a3a3a3] mt-1 text-sm font-light">Clases impartidas por los docentes.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" size={18} />
            <input 
              type="text" placeholder="Buscar por tema..." value={buscar} onChange={(e) => setBuscar(e.target.value)}
              className="bg-white/[0.03] border border-white/[0.1] rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-[#737373] text-sm focus:outline-none focus:border-white/30 shadow-inner w-64"
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => { setEditingId(null); setFormData({ id_grupo_materia: '', fecha: '', hora_inicio: '', hora_fin: '', tema: '', estado: 'Abierta' }); setIsModalOpen(true); }} 
            className="flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-2.5 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] font-medium"
          >
            <motion.div whileHover={{ rotate: 180, transition: { duration: 0.3 } }}>
              <Plus size={18} />
            </motion.div>
            Nueva Sesión
          </motion.button>
        </div>
      </header>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <DataTable columns={columns} data={sesiones} loading={loading} />
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative bg-white/[0.02] backdrop-blur-[30px] border border-white/20 p-8 rounded-[2.5rem] w-full max-w-md shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Calendar className="text-[#3b82f6]" />
                  {editingId ? 'Editar Sesión' : 'Nueva Sesión'}
                </h2>
                <motion.button whileHover={{ rotate: 90 }} onClick={() => setIsModalOpen(false)} className="text-[#737373] hover:text-white transition">
                  <X size={24} />
                </motion.button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-[13px] font-medium text-[#d4d4d4] mb-2">
                    <BookOpen size={14} className="text-[#3b82f6]" /> ID Grupo-Materia
                  </label>
                  <input type="number" required value={formData.id_grupo_materia} onChange={(e) => setFormData({...formData, id_grupo_materia: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-white/30 shadow-inner" placeholder="Ej. 1" />
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-[13px] font-medium text-[#d4d4d4] mb-2">
                    <Calendar size={14} className="text-[#3b82f6]" /> Fecha
                  </label>
                  <input type="date" required value={formData.fecha} onChange={(e) => setFormData({...formData, fecha: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-white/30 shadow-inner" />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="flex items-center gap-2 text-[13px] font-medium text-[#d4d4d4] mb-2">
                      <Clock size={14} className="text-[#3b82f6]" /> Inicio
                    </label>
                    <input type="time" value={formData.hora_inicio} onChange={(e) => setFormData({...formData, hora_inicio: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-white focus:outline-none" />
                  </div>
                  <div className="flex-1">
                    <label className="flex items-center gap-2 text-[13px] font-medium text-[#d4d4d4] mb-2">
                      <Clock size={14} className="text-[#3b82f6]" /> Fin
                    </label>
                    <input type="time" value={formData.hora_fin} onChange={(e) => setFormData({...formData, hora_fin: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-white focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[13px] font-medium text-[#d4d4d4] mb-2">
                    <MessageSquare size={14} className="text-[#3b82f6]" /> Tema de la Clase
                  </label>
                  <input type="text" value={formData.tema} onChange={(e) => setFormData({...formData, tema: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-white/30 shadow-inner" placeholder="Ej. Introducción a conjuntos" />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#d4d4d4] mb-2">Estado de la Sesión</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Abierta', 'Cerrada', 'Cancelada'].map((opcion) => (
                      <button
                        key={opcion}
                        type="button"
                        onClick={() => setFormData({...formData, estado: opcion})}
                        className={`py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.estado === opcion 
                            ? getEstadoColor(opcion).replace('/10', '/20') + ' ring-2 ring-white/30' 
                            : 'bg-white/[0.03] text-gray-400 hover:bg-white/[0.08]'
                        }`}
                      >
                        {opcion}
                      </button>
                    ))}
                  </div>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="w-full flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium py-3.5 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] mt-6"
                >
                  {editingId ? 'Actualizar Sesión' : 'Guardar Sesión'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}