import Swal from 'sweetalert2';

// Configuración base para que todas las alertas se vean oscuras y elegantes
const swalWithStyle = Swal.mixin({
  customClass: {
    popup: 'bg-[#0a1420] border border-white/10 text-white rounded-3xl shadow-2xl',
    title: 'text-2xl font-bold text-white',
    htmlContainer: 'text-gray-400',
    confirmButton: 'bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium px-6 py-2.5 rounded-xl mx-2 transition-colors',
    cancelButton: 'bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2.5 rounded-xl mx-2 transition-colors'
  },
  buttonsStyling: false, // Quitamos el estilo por defecto para usar Tailwind
  background: '#0a1420',
});

// 1. Alerta para confirmar eliminación
export const confirmDelete = async (title = '¿Estás seguro?', text = '¡Se borrará de forma permanente!') => {
  const result = await swalWithStyle.fire({
    title: title,
    text: text,
    icon: 'warning',
    iconColor: '#f59e0b', // Color naranja para el icono
    showCancelButton: true,
    confirmButtonText: 'Sí, ¡bórralo!',
    cancelButtonText: 'Cancelar',
    reverseButtons: true, // Pone el botón de cancelar a la izquierda
  });
  return result.isConfirmed;
};

// 2. Alerta de éxito (ej. al guardar)
export const showSuccess = (title) => {
  swalWithStyle.fire({
    title: title,
    icon: 'success',
    iconColor: '#10b981',
    timer: 2000,
    showConfirmButton: false,
  });
};

// 3. Alerta de error (ej. no se puede borrar por llave foránea)
export const showError = (title, text = '') => {
  swalWithStyle.fire({
    title: title,
    text: text,
    icon: 'error',
    iconColor: '#ef4444',
    confirmButtonText: 'Entendido'
  });
};