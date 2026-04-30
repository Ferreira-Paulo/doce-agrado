import { btnBase, btnOn, btnOff } from "@/components/utils/styles";

const selectCls =
  "w-full px-4 py-3 border border-black/10 rounded-xl bg-white text-[#4A0E2E] focus:outline-none focus:ring-2 focus:ring-[#D1328C]/30 focus:border-[#D1328C] transition";

export default function AdminFilters({
  parceiros,
  filtroParceiro,
  setFiltroParceiro,
  filtroStatus,
  setFiltroStatus,
  ordenacao,
  setOrdenacao,
  busca,
  setBusca,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Busca */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#4A0E2E]/50">
            Buscar
          </label>
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Parceiro ou data (ex: 2026-04)..."
            className={selectCls}
          />
        </div>

        {/* Parceiro */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#4A0E2E]/50">
            Parceiro
          </label>
          <select
            value={filtroParceiro}
            onChange={(e) => setFiltroParceiro(e.target.value)}
            className={selectCls}
          >
            <option value="__all">Todos</option>
            {parceiros.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Ordenação */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#4A0E2E]/50">
            Ordenar por
          </label>
          <select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
            className={selectCls}
          >
            <option value="saldo-desc">Maior saldo devedor</option>
            <option value="saldo-asc">Menor saldo devedor</option>
            <option value="recente">Entrega mais recente</option>
            <option value="nome">Nome (A–Z)</option>
          </select>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#4A0E2E]/50">
            Status
          </label>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: "todas", label: "Todas" },
              { value: "pendentes", label: "Pendentes" },
              { value: "pagas", label: "Pagas" },
            ].map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setFiltroStatus(value)}
                className={`${btnBase} ${filtroStatus === value ? btnOn : btnOff}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
