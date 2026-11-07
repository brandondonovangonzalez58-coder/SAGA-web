import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import api from '../api/axios';
import { Plus, X, Edit2, Trash2, Search, Shield, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { confirmDelete, showSuccess, showError } from '../utils/alerts';

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buscar, setBuscar] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nombre: '' });

  const fetchRoles = async (terminoBusqueda = '') => {
    setLoading(true);
    try {
      // Nota: Si tu backend aún no tiene búsqueda para roles, esto igual funcionará
      // ya que enviará el parámetro pero el backend lo ignorará si no está configurado.
      const url = terminoBusqueda ? `/roles/?buscar=${terminoBusqueda}` : '/roles/';
      const res = await api.get(url);
      setRoles(res.data);
    } catch (error) {
      console.error("Error al cargar roles", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    const timeoutId = setTimeout(() => fetchRoles(buscar), 500);
    return () => clearTimeout(timeoutId);
  }, [buscar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.put(`/roles/${editingId}`, formData);
      else await api.post('/roles/', formData);
      
      setIsModalOpen(false);
      setFormData({ nombre: '' });
      setEditingId(null);
      fetchRoles(buscar);
      
      showSuccess(editingId ? 'Rol actualizado' : 'Rol creado correctamente');
    } catch (error) {
      showError("Error al guardar", error.response?.data?.detail || "El nombre del rol ya existe.");
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirmDelete();
    if (isConfirmed) {
      try {
        await api.delete(`/roles/${id}`);
        fetchRoles(buscar);
        showSuccess('Rol eliminado');
      } catch (error) {
        showError("No se puede eliminar", error.response?.data?.detail || "El rol tiene usuarios asignados.");
      }
    }
  };

  const handleEdit = (rol) => {
    setFormData({ nombre: rol.nombre });
    setEditingId(rol.id_rol);
    setIsModalOpen(true);
  };

  const columns = [
    { header: 'ID', accessor: 'id_rol' },
    { header: 'Nombre del Rol', accessor: 'nombre' },
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
            onClick={() => handleDelete(row.id_rol)} 
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
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">Gestión de Roles</h1>
          <p className="text-[#a3a3a3] mt-1 text-sm font-light">Catálogo de roles y permisos del sistema.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" size={18} />
            <input 
              type="text" placeholder="Buscar rol..." value={buscar} onChange={(e) => setBuscar(e.target.value)}
              className="bg-white/[0.03] border border-white/[0.1] rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-[#737373] text-sm focus:outline-none focus:border-white/30 shadow-inner w-64"
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => { setEditingId(null); setFormData({ nombre: '' }); setIsModalOpen(true); }} 
            className="flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-2.5 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] font-medium"
          >
            <motion.div whileHover={{ rotate: 180, transition: { duration: 0.3 } }}>
              <Plus size={18} />
            </motion.div>
            Nuevo Rol
          </motion.button>
        </div>
      </header>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <DataTable columns={columns} data={roles} loading={loading} />
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
                  <Shield className="text-[#3b82f6]" />
                  {editingId ? 'Editar Rol' : 'Nuevo Rol'}
                </h2>
                <motion.button whileHover={{ rotate: 90 }} onClick={() => setIsModalOpen(false)} className="text-[#737373] hover:text-white transition">
                  <X size={24} />
                </motion.button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-[13px] font-medium text-[#d4d4d4] mb-2">
                    <Shield size={14} className="text-[#3b82f6]" /> Nombre del Rol
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={formData.nombre} 
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
                    className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-white/30 shadow-inner" 
                    placeholder="Ej. Administrador, Docente..." 
                  />
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="w-full flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium py-3.5 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] mt-6"
                >
                  {editingId ? 'Actualizar Rol' : 'Guardar Rol'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}