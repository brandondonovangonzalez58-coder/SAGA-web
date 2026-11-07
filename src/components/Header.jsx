import { Search, Bell, Settings } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Header() {
  const usuario = useAuthStore((s) => s.usuario);

  return (
    <header className="bg-white/[0.02] backdrop-blur-[30px] border-b border-white/[0.05] px-8 py-3.5 flex items-center justify-between sticky top-0 z-10">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" size={18} />
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full pl-10 pr-4 py-2 bg-white/[0.03] border border-white/[0.1] rounded-lg text-sm text-white placeholder-[#737373] focus:outline-none focus:border-white/30 transition-all shadow-inner"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-white/[0.05] rounded-lg transition">
          <Settings size={18} className="text-[#737373]" />
        </button>
        <button className="p-2 hover:bg-white/[0.05] rounded-lg transition relative">
          <Bell size={18} className="text-[#737373]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-white/[0.1]">
          <div className="w-9 h-9 bg-[#3b82f6] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-[0_0_10px_rgba(59,130,246,0.5)]">
            {usuario?.nombre?.[0]}{usuario?.apellidos?.[0]}
          </div>
          <div className="text-sm leading-tight hidden md:block">
            <p className="font-medium text-white">{usuario?.nombre} {usuario?.apellidos}</p>
            <p className="text-[#a3a3a3] text-xs">{usuario?.rol}</p>
          </div>
        </div>
      </div>
    </header>
  );
}