/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saga: {
          primary: '#1E40AF',      // Azul profundo (sidebar)
          primaryDark: '#1E3A8A',  // Azul más oscuro (hover)
          primaryLight: '#3B82F6', // Azul claro (acentos)
          bg: '#F8FAFC',           // Fondo general (gris muy claro)
          card: '#FFFFFF',         // Fondo de tarjetas
          border: '#E2E8F0',       // Gris de bordes
          text: '#1E293B',         // Texto principal (gris oscuro)
          muted: '#64748B',        // Texto secundario (gris medio)
          success: '#10B981',      // Verde
          warning: '#F59E0B',      // Ámbar
          danger: '#EF4444',       // Rojo
          info: '#3B82F6',         // Azul info
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}