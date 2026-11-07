import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import api from '../api/axios';
import { Plus, X, Edit2, Trash2, Search, CalendarDays, Calendar, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { confirmDelete, showSuccess, showError } from '../utils/alerts';

export default function Periodos() {
  const [periodos, setPeriodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buscar, setBuscar] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Estado inicial del formulario
  const [formData, setFormData] = useState({ 
    nombre: '', 
    fecha_inicio: '', 
    fecha_fin: '', 
    activo: false 
  });

  const fetchPeriodos = async (terminoBusqueda = '') => {
    setLoading(true);
    try {
      const url = terminoBusqueda ? `/periodos/?buscar=${terminoBusqueda}` : '/periodos/';
      const res = await api.get(url);
      setPeriodos(res.data);
    } catch (error) {
      console.error("Error al cargar periodos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    const timeoutId = setTimeout(() => fetchPeriodos(buscar), 500);
    return () => clearTimeout(timeoutId);
  }, [buscar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { 
        nombre: formData.nombre, 
        fecha_inicio: formData.fecha_inicio, 
        fecha_fin: formData.fecha_fin, 
        activo: formData.activo 
      };
      
      if (editingId) await api.put(`/periodos/${editingId}`, data);
      else await api.post('/periodos/', data);
      
      setIsModalOpen(false);
      setFormData({ nombre: '', fecha_inicio: '', fecha_fin: '', activo: false });
      setEditingId(null);
      fetchPeriodos(buscar);
      
      showSuccess(editingId ? 'Periodo actualizado' : 'Periodo creado correctamente');
    } catch (error) {
      showError("Error al guardar", error.response?.data?.detail || "Revisa que el nombre no esté duplicado o las fechas sean correctas.");
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirmDelete();
    if (isConfirmed) {
      try {
        await api.delete(`/periodos/${id}`);
        fetchPeriodos(buscar);
        showSuccess('Periodo eliminado');
      } catch (error) {
        showError("No se puede eliminar", error.response?.data?.detail || "El periodo tiene registros ligados.");
      }
    }
  };

  const handleEdit = (periodo) => {
    setFormData({ 
      nombre: periodo.nombre, 
      fecha_inicio: periodo.fecha_inicio, 
      fecha_fin: periodo.fecha_fin, 
      activo: periodo.activo 
    });
    setEditingId(periodo.id_periodo);
    setIsModalOpen(true);
  };

  const columns = [
    { header: 'ID', accessor: 'id_periodo' },
    { header: 'Nombre del Periodo', accessor: 'nombre' },
    { header: 'Fecha Inicio', accessor: 'fecha_inicio' },
    { header: 'Fecha Fin', accessor: 'fecha_fin' },
    { 
      header: 'Estado', 
      accessor: 'activo',
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${row.activo ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
          {row.activo ? 'Activo' : 'Finalizado'}
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
            onClick={() => handleDelete(row.id_periodo)} 
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
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">Periodos Académicos</h1>
          <p className="text-[#a3a3a3] mt-1 text-sm font-light">Administración de los ciclos escolares.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" size={18} />
            <input 
              type="text" placeholder="Buscar por nombre..." value={buscar} onChange={(e) => setBuscar(e.target.value)}
              className="bg-white/[0.03] border border-white/[0.1] rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-[#737373] text-sm focus:outline-none focus:border-white/30 shadow-inner w-64"
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => { setEditingId(null); setFormData({ nombre: '', fecha_inicio: '', fecha_fin: '', activo: false }); setIsModalOpen(true); }} 
            className="flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-2.5 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] font-medium"
          >
            <motion.div whileHover={{ rotate: 180, transition: { duration: 0.3 } }}>
              <Plus size={18} />
            </motion.div>
            Nuevo Periodo
          </motion.button>
        </div>
      </header>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <DataTable columns={columns} data={periodos} loading={loading} />
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
                  <CalendarDays className="text-[#3b82f6]" />
                  {editingId ? 'Editar Periodo' : 'Nuevo Periodo'}
                </h2>
                <motion.button whileHover={{ rotate: 90 }} onClick={() => setIsModalOpen(false)} className="text-[#737373] hover:text-white transition">
                  <X size={24} />
                </motion.button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-[13px] font-medium text-[#d4d4d4] mb-2">
                    <CalendarDays size={14} className="text-[#3b82f6]" /> Nombre del Periodo
                  </label>
                  <input type="text" required value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-white/30 shadow-inner" placeholder="Ej. 2026-2027" />
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="flex items-center gap-2 text-[13px] font-medium text-[#d4d4d4] mb-2">
                      <Calendar size={14} className="text-[#3b82f6]" /> Fecha Inicio
                    </label>
                    <input type="date" required value={formData.fecha_inicio} onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-white focus:outline-none" />
                  </div>
                  <div className="flex-1">
                    <label className="flex items-center gap-2 text-[13px] font-medium text-[#d4d4d4] mb-2">
                      <Calendar size={14} className="text-[#3b82f6]" /> Fecha Fin
                    </label>
                    <input type="date" required value={formData.fecha_fin} onChange={(e) => setFormData({...formData, fecha_fin: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-white focus:outline-none" />
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/[0.03] p-3 rounded-xl border border-white/[0.1]">
                  <input 
                    type="checkbox" 
                    checked={formData.activo} 
                    onChange={(e) => setFormData({...formData, activo: e.target.checked})} 
                    className="w-5 h-5 accent-[#3b82f6] cursor-pointer" 
                  />
                  <label className="flex items-center gap-2 text-[13px] font-medium text-[#d4d4d4] cursor-pointer">
                    <CheckCircle size={16} className={formData.activo ? "text-green-400" : "text-gray-500"} /> 
                    ¿Es el periodo activo?
                  </label>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="w-full flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium py-3.5 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] mt-6"
                >
                  {editingId ? 'Actualizar Periodo' : 'Guardar Periodo'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}