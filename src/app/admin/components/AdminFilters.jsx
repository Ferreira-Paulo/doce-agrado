export default function AdminFilters({
  parceiros,
  filtroParceiro,
  setFiltroParceiro,
  filtroStatus,
  setFiltroStatus,
  busca,
  setBusca,
}) {
  const btnBase = "px-4 py-2 rounded-xl text-sm font-semibold transition border";
  const btnOn = "bg-[#4A0E2E] text-white border-[#4A0E2E]";
  const btnOff = "bg-white text-[#4A0E2E] border-black/10 hover:bg-black/[0.03]";

  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Busca */}
        <div>
          <p className="text-sm text-[#4A0E2E]/70 mb-2">Buscar</p>
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Digite nome do parceiro ou data (ex: 2026-02)..."
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1328C]/40"
          />
        </div>

        {/* Parceiro */}
        <div>
          <p className="text-sm text-[#4A0E2E]/70 mb-2">Parceiro</p>
          <select
            value={filtroParceiro}
            onChange={(e) => setFiltroParceiro(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#D1328C]/40"
          >
            <option value="__all">Todos</option>
            {parceiros.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <p className="text-sm text-[#4A0E2E]/70 mb-2">Status</p>
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setFiltroStatus("todas")}
              className={`${btnBase} ${filtroStatus === "todas" ? btnOn : btnOff}`}
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => setFiltroStatus("pendentes")}
              className={`${btnBase} ${filtroStatus === "pendentes" ? btnOn : btnOff}`}
            >
              Pendentes
            </button>
            <button
              type="button"
              onClick={() => setFiltroStatus("pagas")}
              className={`${btnBase} ${filtroStatus === "pagas" ? btnOn : btnOff}`}
            >
              Pagas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
