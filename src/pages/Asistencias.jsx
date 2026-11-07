import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import api from '../api/axios';
import { Plus, X, Edit2, Trash2, Search, ClipboardCheck, BookOpen, User, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { confirmDelete, showSuccess, showError } from '../utils/alerts';

export default function Asistencias() {
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buscar, setBuscar] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Estado inicial del formulario
  const [formData, setFormData] = useState({ 
    id_sesion: '', 
    id_estudiante: '', 
    estado: 'Presente', 
    observaciones: '', 
    registrado_por: 1 // Por defecto el Admin (ID 1)
  });

  const fetchAsistencias = async (terminoBusqueda = '') => {
    setLoading(true);
    try {
      const url = terminoBusqueda ? `/asistencias/?buscar=${terminoBusqueda}` : '/asistencias/';
      const res = await api.get(url);
      setAsistencias(res.data);
    } catch (error) {
      console.error("Error al cargar asistencias", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    const timeoutId = setTimeout(() => fetchAsistencias(buscar), 500);
    return () => clearTimeout(timeoutId);
  }, [buscar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { 
        id_sesion: parseInt(formData.id_sesion), 
        id_estudiante: parseInt(formData.id_estudiante), 
        estado: formData.estado, 
        observaciones: formData.observaciones, 
        registrado_por: parseInt(formData.registrado_por) 
      };
      
      if (editingId) await api.put(`/asistencias/${editingId}`, data);
      else await api.post('/asistencias/', data);
      
      setIsModalOpen(false);
      setFormData({ id_sesion: '', id_estudiante: '', estado: 'Presente', observaciones: '', registrado_por: 1 });
      setEditingId(null);
      fetchAsistencias(buscar);
      
      showSuccess(editingId ? 'Asistencia actualizada' : 'Asistencia registrada');
    } catch (error) {
      showError("Error al guardar", error.response?.data?.detail || "Revisa que la sesión y el alumno existan.");
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirmDelete();
    if (isConfirmed) {
      try {
        await api.delete(`/asistencias/${id}`);
        fetchAsistencias(buscar);
        showSuccess('Registro eliminado');
      } catch (error) {
        showError("No se puede eliminar", error.response?.data?.detail || "Error del servidor.");
      }
    }
  };

  const handleEdit = (asistencia) => {
    setFormData({ 
      id_sesion: asistencia.id_sesion, 
      id_estudiante: asistencia.id_estudiante, 
      estado: asistencia.estado, 
      observaciones: asistencia.observaciones || '', 
      registrado_por: asistencia.registrado_por 
    });
    setEditingId(asistencia.id_asistencia);
    setIsModalOpen(true);
  };

  // Función para pintar los colores del estado en la tabla
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Presente': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Falta': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Retardo': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Justificada': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id_asistencia' },
    { header: 'ID Sesión', accessor: 'id_sesion' },
    { header: 'ID Estudiante', accessor: 'id_estudiante' },
    { 
      header: 'Estado', 
      accessor: 'estado',
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(row.estado)}`}>
          {row.estado}
        </span>
      )
    },
    { header: 'Observaciones', accessor: 'observaciones', render: (r) => r.observaciones || '-' },
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
            onClick={() => handleDelete(row.id_asistencia)} 
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
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">Control de Asistencias</h1>
          <p className="text-[#a3a3a3] mt-1 text-sm font-light">Historial de registros de asistencia.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" size={18} />
            <input 
              type="text" placeholder="Buscar por estado..." value={buscar} onChange={(e) => setBuscar(e.target.value)}
              className="bg-white/[0.03] border border-white/[0.1] rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-[#737373] text-sm focus:outline-none focus:border-white/30 shadow-inner w-64"
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => { setEditingId(null); setFormData({ id_sesion: '', id_estudiante: '', estado: 'Presente', observaciones: '', registrado_por: 1 }); setIsModalOpen(true); }} 
            className="flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-2.5 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] font-medium"
          >
            <motion.div whileHover={{ rotate: 180, transition: { duration: 0.3 } }}>
              <Plus size={18} />
            </motion.div>
            Registrar Asistencia
          </motion.button>
        </div>
      </header>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <DataTable columns={columns} data={asistencias} loading={loading} />
      </motion.div>

      {/* MODAL */}
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
                  <ClipboardCheck className="text-[#3b82f6]" />
                  {editingId ? 'Editar Asistencia' : 'Registrar Asistencia'}
                </h2>
                <motion.button whileHover={{ rotate: 90 }} onClick={() => setIsModalOpen(false)} className="text-[#737373] hover:text-white transition">
                  <X size={24} />
                </motion.button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="flex items-center gap-2 text-[13px] font-medium text-[#d4d4d4] mb-2">
                      <BookOpen size={14} className="text-[#3b82f6]" /> ID Sesión
                    </label>
                    <input type="number" required value={formData.id_sesion} onChange={(e) => setFormData({...formData, id_sesion: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-white/30 shadow-inner" />
                  </div>
                  <div className="flex-1">
                    <label className="flex items-center gap-2 text-[13px] font-medium text-[#d4d4d4] mb-2">
                      <User size={14} className="text-[#3b82f6]" /> ID Alumno
                    </label>
                    <input type="number" required value={formData.id_estudiante} onChange={(e) => setFormData({...formData, id_estudiante: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-white/30 shadow-inner" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[13px] font-medium text-[#d4d4d4] mb-2">Estado de Asistencia</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Presente', 'Falta', 'Retardo', 'Justificada'].map((opcion) => (
                      <button
                        key={opcion}
                        type="button"
                        onClick={() => setFormData({...formData, estado: opcion})}
                        className={`py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.estado === opcion 
                            ? getEstadoColor(opcion).replace('bg-', 'bg-').replace('/10', '/20') + ' ring-2 ring-white/30' 
                            : 'bg-white/[0.03] text-gray-400 hover:bg-white/[0.08]'
                        }`}
                      >
                        {opcion}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[13px] font-medium text-[#d4d4d4] mb-2">
                    <MessageSquare size={14} className="text-[#3b82f6]" /> Observaciones (Opcional)
                  </label>
                  <input type="text" value={formData.observaciones} onChange={(e) => setFormData({...formData, observaciones: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-white/30 shadow-inner" placeholder="Ej. Llegó tarde, traía justificante..." />
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="w-full flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium py-3.5 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] mt-6"
                >
                  {editingId ? 'Actualizar Asistencia' : 'Guardar Registro'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}