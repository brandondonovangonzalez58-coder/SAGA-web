import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen relative flex bg-[#020202] overflow-hidden font-sans">
      {/* Fondo de ondas simuladas con más brillo (Glassmorphism) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/30 via-black to-black transform -rotate-12 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-black to-transparent transform rotate-45 blur-3xl"></div>
      </div>

      <Sidebar />
      
      <div className="ml-64 flex-1 flex flex-col relative z-10 h-screen overflow-y-auto">
        <Header />
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}