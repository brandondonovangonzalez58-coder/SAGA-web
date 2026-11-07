import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import api from '../api/axios';
import { Plus, X, Edit2, Trash2, Search, User, Users, Calendar, Mail, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { confirmDelete, showSuccess, showError } from '../utils/alerts';

export default function Estudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buscar, setBuscar] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({ 
    id_usuario: '', 
    id_grupo: '', 
    fecha_ingreso: '',
    nombre: '',
    apellidos: '',
    correo: '',
    matricula: ''
  });

  const fetchEstudiantes = async (terminoBusqueda = '') => {
    setLoading(true);
    try {
      const url = terminoBusqueda ? `/estudiantes/?buscar=${terminoBusqueda}` : '/estudiantes/';
      const res = await api.get(url);
      setEstudiantes(res.data);
    } catch (error) {
      console.error("Error al cargar estudiantes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    const timeoutId = setTimeout(() => fetchEstudiantes(buscar), 500);
    return () => clearTimeout(timeoutId);
  }, [buscar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataEstudiante = {
        id_usuario: parseInt(formData.id_usuario),
        id_grupo: parseInt(formData.id_grupo),
        fecha_ingreso: formData.fecha_ingreso
      };
      
      if (editingId) {
        await api.put(`/estudiantes/${editingId}`, dataEstudiante);
        
        await api.put(`/usuarios/${formData.id_usuario}`, {
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          correo: formData.correo,
          matricula: formData.matricula || null
        });
      } else {
        await api.post('/estudiantes/', dataEstudiante);
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchEstudiantes(buscar);
      
      showSuccess(editingId ? 'Estudiante actualizado' : 'Estudiante inscrito correctamente');
      
    } catch (error) {
      showError("Error al guardar", error.response?.data?.detail || "Revisa que los IDs existan.");
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirmDelete();
    
    if (isConfirmed) {
      try {
        await api.delete(`/estudiantes/${id}`);
        fetchEstudiantes(buscar);
        showSuccess('Estudiante eliminado');
      } catch (error) {
        showError("No se puede eliminar", error.response?.data?.detail || "El estudiante tiene registros ligados.");
      }
    }
  };

  const handleEdit = (estudiante) => {
    setFormData({
      id_usuario: estudiante.id_usuario,
      id_grupo: estudiante.id_grupo,
      fecha_ingreso: estudiante.fecha_ingreso,
      nombre: estudiante.usuario?.nombre || '',
      apellidos: estudiante.usuario?.apellidos || '',
      correo: estudiante.usuario?.correo || '',
      matricula: estudiante.usuario?.matricula || ''
    });
    setEditingId(estudiante.id_estudiante);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ 
      id_usuario: '', 
      id_grupo: '', 
      fecha_ingreso: '',
      nombre: '',
      apellidos: '',
      correo: '',
      matricula: ''
    });
    setEditingId(null);
  };

  const columns = [
    { 
      header: 'Alumno', 
      accessor: 'usuario', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 font-semibold text-xs">
            {row.usuario?.nombre?.charAt(0)}{row.usuario?.apellidos?.charAt(0)}
          </div>
          <span className="font-medium text-white">
            {row.usuario ? `${row.usuario.nombre} ${row.usuario.apellidos}` : 'Sin nombre'}
          </span>
        </div>
      )
    },
    { 
      header: 'Matrícula', 
      render: (row) => row.usuario?.matricula || 'N/A' 
    },
    { 
      header: 'Correo', 
      render: (row) => row.usuario?.correo || 'N/A' 
    },
    // 🚨 AQUÍ ESTÁ EL CAMBIO: Ahora muestra el nombre del grupo
    { 
      header: 'Grupo', 
      accessor: 'grupo', 
      render: (row) => (
        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-sm font-medium border border-blue-500/20">
          {row.grupo ? row.grupo.nombre : 'Sin grupo'}
        </span>
      )
    },
    { 
      header: 'Fecha Ingreso', 
      accessor: 'fecha_ingreso' 
    },
    { 
      header: 'Acciones', 
      render: (row) => (
        <div className="flex gap-2">
          <motion.button 
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleEdit(row)} 
            className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
          >
            <Edit2 size={16} />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.15, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDelete(row.id_estudiante)} 
            className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
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
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">Directorio de Estudiantes</h1>
          <p className="text-[#a3a3a3] mt-1 text-sm font-light">Alumnos inscritos en el sistema.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" size={18} />
            <input 
              type="text" placeholder="Buscar por nombre o matrícula..." value={buscar} onChange={(e) => setBuscar(e.target.value)}
              className="bg-white/[0.03] border border-white/[0.1] rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-[#737373] text-sm focus:outline-none focus:border-white/30 shadow-inner w-64"
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { resetForm(); setIsModalOpen(true); }} 
            className="flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] font-medium"
          >
            <motion.div whileHover={{ rotate: 180, transition: { duration: 0.3 } }}>
              <Plus size={18} />
            </motion.div>
            Inscribir Alumno
          </motion.button>
        </div>
      </header>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <DataTable columns={columns} data={estudiantes} loading={loading} />
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative bg-white/[0.02] backdrop-blur-[30px] border border-white/20 p-8 rounded-[2.5rem] w-full max-w-md shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <User className="text-[#3b82f6]" />
                  {editingId ? 'Editar Estudiante' : 'Inscribir Estudiante'}
                </h2>
                <motion.button whileHover={{ rotate: 90 }} onClick={() => setIsModalOpen(false)} className="text-[#737373] hover:text-white transition">
                  <X size={24} />
                </motion.button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {editingId && (
                  <>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-[13px] font-medium text-[#d4d4d4] mb-2">Nombre(s)</label>
                        <input type="text" required value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-white focus:outline-none" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[13px] font-medium text-[#d4d4d4] mb-2">Apellidos</label>
                        <input type="text" required value={formData.apellidos} onChange={(e) => setFormData({...formData, apellidos: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-white focus:outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-[13px] font-medium text-[#d4d4d4] mb-2"><Mail size={14}/> Correo</label>
                      <input type="email" required value={formData.correo} onChange={(e) => setFormData({...formData, correo: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-white focus:outline-none" />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-[13px] font-medium text-[#d4d4d4] mb-2"><Hash size={14}/> Matrícula</label>
                      <input type="text" value={formData.matricula} onChange={(e) => setFormData({...formData, matricula: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-white focus:outline-none" />
                    </div>
                  </>
                )}

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="flex items-center gap-2 text-[13px] font-medium text-[#d4d4d4] mb-2"><Users size={14}/> ID Usuario</label>
                    <input type="number" required value={formData.id_usuario} onChange={(e) => setFormData({...formData, id_usuario: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-white focus:outline-none" disabled={editingId !== null} />
                  </div>
                  <div className="flex-1">
                    <label className="flex items-center gap-2 text-[13px] font-medium text-[#d4d4d4] mb-2"><Users size={14}/> ID Grupo</label>
                    <input type="number" required value={formData.id_grupo} onChange={(e) => setFormData({...formData, id_grupo: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-white focus:outline-none" />
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-[13px] font-medium text-[#d4d4d4] mb-2"><Calendar size={14}/> Fecha de Ingreso</label>
                  <input type="date" required value={formData.fecha_ingreso} onChange={(e) => setFormData({...formData, fecha_ingreso: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-white focus:outline-none" />
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="w-full flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.4)] mt-6"
                >
                  {editingId ? 'Actualizar Datos' : 'Guardar Estudiante'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}