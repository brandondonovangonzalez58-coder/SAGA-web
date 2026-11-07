import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import api from '../api/axios';
import { Plus, X, Edit2, Trash2, Search, UserPlus, Mail, Shield, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { confirmDelete, showSuccess, showError } from '../utils/alerts';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buscar, setBuscar] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Estado inicial del formulario
  const [formData, setFormData] = useState({ 
    id_rol: '', 
    nombre: '', 
    apellidos: '', 
    correo: '', 
    password_hash: '', 
    matricula: '', 
    activo: true 
  });

  const fetchUsuarios = async (terminoBusqueda = '') => {
    setLoading(true);
    try {
      const url = terminoBusqueda ? `/usuarios/?buscar=${terminoBusqueda}` : '/usuarios/';
      const res = await api.get(url);
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error al cargar usuarios", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    const timeoutId = setTimeout(() => fetchUsuarios(buscar), 500);
    return () => clearTimeout(timeoutId);
  }, [buscar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { 
        id_rol: parseInt(formData.id_rol), 
        nombre: formData.nombre, 
        apellidos: formData.apellidos, 
        correo: formData.correo, 
        password_hash: formData.password_hash, 
        matricula: formData.matricula || null, 
        activo: formData.activo 
      };
      
      if (editingId) await api.put(`/usuarios/${editingId}`, data);
      else await api.post('/usuarios/', data);
      
      setIsModalOpen(false);
      setFormData({ id_rol: '', nombre: '', apellidos: '', correo: '', password_hash: '', matricula: '', activo: true });
      setEditingId(null);
      fetchUsuarios(buscar);
      
      showSuccess(editingId ? 'Usuario actualizado' : 'Usuario creado correctamente');
    } catch (error) {
      showError("Error al guardar", error.response?.data?.detail || "El correo o matrícula ya están en uso.");
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirmDelete();
    if (isConfirmed) {
      try {
        await api.delete(`/usuarios/${id}`);
        fetchUsuarios(buscar);
        showSuccess('Usuario eliminado');
      } catch (error) {
        showError("No se puede eliminar", error.response?.data?.detail || "El usuario tiene registros ligados.");
      }
    }
  };

  const handleEdit = (usuario) => {
    setFormData({ 
      id_rol: usuario.id_rol, 
      nombre: usuario.nombre, 
      apellidos: usuario.apellidos, 
      correo: usuario.correo, 
      password_hash: usuario.password_hash, // Nota: normalente no se envía el hash al front, pero lo dejamos para actualizar
      matricula: usuario.matricula || '', 
      activo: usuario.activo 
    });
    setEditingId(usuario.id_usuario);
    setIsModalOpen(true);
  };

  const columns = [
    { header: 'ID', accessor: 'id_usuario' },
    { header: 'Nombre Completo', render: (row) => `${row.nombre} ${row.apellidos}` },
    { header: 'Correo', accessor: 'correo' },
    { header: 'Matrícula', accessor: 'matricula', render: (r) => r.matricula || '-' },
    { header: 'ID Rol', accessor: 'id_rol' },
    { 
      header: 'Estado', 
      accessor: 'activo',
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${row.activo ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
          {row.activo ? 'Activo' : 'Inactivo'}
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
            onClick={() => handleDelete(row.id_usuario)} 
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
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">Gestión de Usuarios</h1>
          <p className="text-[#a3a3a3] mt-1 text-sm font-light">Administra alumnos, docentes y administradores.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" size={18} />
            <input 
              type="text" placeholder="Buscar por nombre o correo..." value={buscar} onChange={(e) => setBuscar(e.target.value)}
              className="bg-white/[0.03] border border-white/[0.1] rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-[#737373] text-sm focus:outline-none focus:border-white/30 shadow-inner w-64"
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => { setEditingId(null); setFormData({ id_rol: '', nombre: '', apellidos: '', correo: '', password_hash: '', matricula: '', activo: true }); setIsModalOpen(true); }} 
            className="flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-2.5 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] font-medium"
          >
            <motion.div whileHover={{ rotate: 180, transition: { duration: 0.3 } }}>
              <Plus size={18} />
            </motion.div>
            Nuevo Usuario
          </motion.button>
        </div>
      </header>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <DataTable columns={columns} data={usuarios} loading={loading} />
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
              className="relative bg-white/[0.02] backdrop-blur-[30px] border border-white/20 p-8 rounded-[2.5rem] w-full max-w-md shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <UserPlus className="text-[#3b82f6]" />
                  {editingId ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h2>
                <motion.button whileHover={{ rotate: 90 }} onClick={() => setIsModalOpen(false)} className="text-[#737373] hover:text-white transition">
                  <X size={24} />
                </motion.button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="flex items-center gap-2 text-[13px] font-medium text-[#d4d4d4] mb-2">
                      <Shield size={14} className="text-[#3b82f6]" /> ID Rol
                    </label>
                    <input type="number" required value={formData.id_rol} onChange={(e) => setFormData({...formData, id_rol: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-white focus:outline-none" placeholder="Ej. 1" />
                  </div>
                  <div className="flex-1">
                    <label className="flex items-center gap-2 text-[13px] font-medium text-[#d4d4d4] mb-2">
                      Matrícula
                    </label>
                    <input type="text" value={formData.matricula} onChange={(e) => setFormData({...formData, matricula: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-white focus:outline-none" placeholder="Opcional" />
                  </div>
                </div>

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
                  <label className="flex items-center gap-2 text-[13px] font-medium text-[#d4d4d4] mb-2">
                    <Mail size={14} className="text-[#3b82f6]" /> Correo Electrónico
                  </label>
                  <input type="email" required value={formData.correo} onChange={(e) => setFormData({...formData, correo: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-white focus:outline-none" placeholder="correo@ejemplo.com" />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#d4d4d4] mb-2">Contraseña (Hash)</label>
                  <input type="text" required value={formData.password_hash} onChange={(e) => setFormData({...formData, password_hash: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-white focus:outline-none" placeholder="Pega el hash generado" />
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
                    Usuario Activo
                  </label>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="w-full flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium py-3.5 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] mt-6"
                >
                  {editingId ? 'Actualizar Usuario' : 'Guardar Usuario'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}