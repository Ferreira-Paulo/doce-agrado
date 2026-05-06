import { AlertTriangle } from "lucide-react";

function badgeCls(estoque) {
  if (estoque === 0) return "bg-red-100 text-red-700";
  if (estoque <= 10) return "bg-yellow-100 text-yellow-800";
  return "bg-green-100 text-green-700";
}

export default function EstoquePanel({ sabores }) {
  const ativos = [...sabores.filter((s) => s.ativo)].sort((a, b) =>
    a.nome.localeCompare(b.nome)
  );
  const zerados = ativos.filter((s) => s.estoque === 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5 h-fit">
      <h3 className="text-xs font-bold text-[#4A0E2E]/50 uppercase tracking-wide mb-4">
        Estoque de Trufas
      </h3>

      {zerados.length > 0 && (
        <div className="flex items-start gap-2 text-red-600 text-xs font-semibold mb-4 p-2.5 bg-red-50 rounded-xl border border-red-100">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>
            {zerados.map((s) => s.nome).join(", ")}{" "}
            {zerados.length > 1 ? "zerados" : "zerado"}
          </span>
        </div>
      )}

      {ativos.length === 0 ? (
        <p className="text-sm text-[#4A0E2E]/40 text-center py-6">
          Nenhum sabor ativo.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {ativos.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-3">
              <span className="text-sm text-[#4A0E2E] capitalize truncate">{s.nome}</span>
              <span
                className={`shrink-0 text-xs font-bold px-2.5 py-0.5 rounded-full ${badgeCls(s.estoque)}`}
              >
                {s.estoque === 0 ? "Zerado" : s.estoque}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
