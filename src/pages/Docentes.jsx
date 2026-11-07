//modulo para docentes
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import api from '../api/axios';
import { Plus, X, Edit2, Trash2, Search, UserCheck, Hash, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { confirmDelete, showSuccess, showError } from '../utils/alerts';

export default function Docentes() {
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buscar, setBuscar] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({ 
    id_usuario: '', 
    numero_empleado: '', 
    especialidad: '' 
  });

  const fetchDocentes = async (termino = '') => {
    setLoading(true);
    try {
      const url = termino ? `/docentes/?buscar=${termino}` : '/docentes/';
      const res = await api.get(url);
      setDocentes(res.data);
    } catch (error) {
      console.error("Error al cargar docentes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    const timer = setTimeout(() => fetchDocentes(buscar), 500);
    return () => clearTimeout(timer);
  }, [buscar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { 
        id_usuario: parseInt(formData.id_usuario), 
        numero_empleado: formData.numero_empleado, 
        especialidad: formData.especialidad 
      };
      
      if (editingId) await api.put(`/docentes/${editingId}`, data);
      else await api.post('/docentes/', data);
      
      setIsModalOpen(false);
      setFormData({ id_usuario: '', numero_empleado: '', especialidad: '' });
      setEditingId(null);
      fetchDocentes(buscar);
      
      showSuccess(editingId ? 'Docente actualizado' : 'Docente registrado correctamente');
    } catch (error) {
      showError("Error al guardar", error.response?.data?.detail || "Revisa que el ID de usuario exista.");
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirmDelete();
    if (isConfirmed) {
      try {
        await api.delete(`/docentes/${id}`);
        fetchDocentes(buscar);
        showSuccess('Docente eliminado');
      } catch (error) {
        showError("No se puede eliminar", error.response?.data?.detail || "El docente tiene materias asignadas.");
      }
    }
  };

  const handleEdit = (docente) => {
    setFormData({ 
      id_usuario: docente.id_usuario, 
      numero_empleado: docente.numero_empleado, 
      especialidad: docente.especialidad || '' 
    });
    setEditingId(docente.id_docente);
    setIsModalOpen(true);
  };

  const columns = [
    { header: 'ID', accessor: 'id_docente' },
    { header: 'ID Usuario', accessor: 'id_usuario' },
    { header: 'No. Empleado', accessor: 'numero_empleado' },
    { header: 'Especialidad', accessor: 'especialidad', render: (r) => r.especialidad || '-' },
    { 
      header: 'Acciones', 
      render: (row) => (
        <div className="flex gap-2">
          <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleEdit(row)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20">
            <Edit2 size={16} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDelete(row.id_docente)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20">
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
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">Gestión de Docentes</h1>
          <p className="text-[#a3a3a3] mt-1 text-sm font-light">Administra al personal docente.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" size={18} />
            <input 
              type="text" placeholder="Buscar..." value={buscar} onChange={(e) => setBuscar(e.target.value)}
              className="bg-white/[0.03] border border-white/[0.1] rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-[#737373] text-sm focus:outline-none focus:border-white/30 shadow-inner w-64"
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => { setEditingId(null); setFormData({ id_usuario: '', numero_empleado: '', especialidad: '' }); setIsModalOpen(true); }} 
            className="flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] font-medium"
          >
            <Plus size={18} /> Nuevo Docente
          </motion.button>
        </div>
      </header>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <DataTable columns={columns} data={docentes} loading={loading} />
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white/[0.02] backdrop-blur-[30px] border border-white/20 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <UserCheck className="text-[#3b82f6]" /> {editingId ? 'Editar Docente' : 'Nuevo Docente'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-[#737373] hover:text-white"><X size={24} /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#d4d4d4] mb-2">ID del Usuario (ID de login)</label>
                  <input type="number" required value={formData.id_usuario} onChange={(e) => setFormData({...formData, id_usuario: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-white focus:outline-none" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-[13px] font-medium text-[#d4d4d4] mb-2"><Hash size={14}/> Número de Empleado</label>
                  <input type="text" required value={formData.numero_empleado} onChange={(e) => setFormData({...formData, numero_empleado: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-white focus:outline-none" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-[13px] font-medium text-[#d4d4d4] mb-2"><Briefcase size={14}/> Especialidad</label>
                  <input type="text" value={formData.especialidad} onChange={(e) => setFormData({...formData, especialidad: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-white focus:outline-none" />
                </div>
                <button type="submit" className="w-full bg-[#3b82f6] text-white font-medium py-3.5 rounded-xl shadow-lg mt-4">
                  Guardar Docente
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}