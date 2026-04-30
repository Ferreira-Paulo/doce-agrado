import { LogOut } from "lucide-react";

export default function Topbar({ user, onLogout, isAdmin = false }) {
  return (
    <header className="fixed top-0 inset-x-0 z-40 h-14 bg-white border-b border-black/8 flex items-center px-4 md:px-8 gap-4">
      <div className="flex-1" />

      <div className="flex items-center gap-3">
        {user && (
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="text-sm font-semibold text-[#4A0E2E]">
              {user.username}
            </span>
            <span className="text-xs text-[#4A0E2E]/50">
              {isAdmin ? "Administrador" : "Parceiro"}
            </span>
          </div>
        )}

        {isAdmin && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#D1328C]/10 text-[#D1328C]">
            Admin
          </span>
        )}

        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[#4A0E2E]/70 hover:bg-black/5 hover:text-[#4A0E2E] transition text-sm font-medium"
          title="Sair"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:block">Sair</span>
        </button>
      </div>
    </header>
  );
}
