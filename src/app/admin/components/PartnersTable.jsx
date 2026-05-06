import { Fragment, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  Package,
  Search,
  Truck,
} from "lucide-react";
import DeliveryCard from "@/components/dashboard/DeliveryCard";
import { resumoEntregas } from "@/components/utils/calc";
import { moneyBR, toBRDate } from "@/components/utils/format";

function SortIcon({ col, sortBy, sortDir }) {
  if (sortBy !== col)
    return <ChevronDown className="w-3 h-3 opacity-30 inline ml-0.5" />;
  return sortDir === "desc" ? (
    <ChevronDown className="w-3 h-3 inline ml-0.5 text-[#D1328C]" />
  ) : (
    <ChevronUp className="w-3 h-3 inline ml-0.5 text-[#D1328C]" />
  );
}

export default function PartnersTable({
  partners,
  onPagar,
  onNovaEntrega,
  onEditEntrega,
  onDeleteEntrega,
  onEditPagamento,
  onDeletePagamento,
}) {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todas");
  const [sortBy, setSortBy] = useState("saldo");
  const [sortDir, setSortDir] = useState("desc");
  const [expanded, setExpanded] = useState(null);

  function toggleSort(col) {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("desc");
    }
  }

  function toggleExpand(parceiro) {
    setExpanded((e) => (e === parceiro ? null : parceiro));
  }

  const parceirosProcessados = useMemo(
    () =>
      partners.map((p) => {
        const entregas = p.entregas || [];
        const resumo = resumoEntregas(entregas);
        const lastDate = entregas.reduce(
          (mx, e) => (String(e.data) > mx ? String(e.data) : mx),
          ""
        );
        return { ...p, _resumo: resumo, _lastDate: lastDate };
      }),
    [partners]
  );

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    let list = parceirosProcessados;

    if (q) list = list.filter((p) => p.parceiro.toLowerCase().includes(q));
    if (filtroStatus === "pendentes") list = list.filter((p) => p._resumo.saldoGeral > 0);
    else if (filtroStatus === "pagas") list = list.filter((p) => p._resumo.saldoGeral === 0);

    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "saldo") cmp = b._resumo.saldoGeral - a._resumo.saldoGeral;
      else if (sortBy === "nome") cmp = a.parceiro.localeCompare(b.parceiro);
      else if (sortBy === "data") cmp = b._lastDate.localeCompare(a._lastDate);
      return sortDir === "asc" ? -cmp : cmp;
    });
  }, [parceirosProcessados, busca, filtroStatus, sortBy, sortDir]);

  return (
    <div>
      {/* Busca + filtro de status */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A0E2E]/30 pointer-events-none" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar parceiro…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-black/10 text-sm text-[#4A0E2E] placeholder-[#4A0E2E]/30 bg-white focus:outline-none focus:ring-2 focus:ring-[#D1328C]/20"
          />
        </div>
        <div className="flex gap-1 bg-white rounded-xl border border-black/10 p-1 self-start sm:self-auto shrink-0">
          {[
            ["todas", "Todos"],
            ["pendentes", "Pendentes"],
            ["pagas", "Pagos"],
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFiltroStatus(val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filtroStatus === val
                  ? "bg-[#4A0E2E] text-white"
                  : "text-[#4A0E2E]/60 hover:text-[#4A0E2E]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        {filtrados.length === 0 ? (
          <div className="py-12 text-center">
            <Package className="w-8 h-8 text-[#4A0E2E]/20 mx-auto mb-2" />
            <p className="text-sm text-[#4A0E2E]/50">Nenhum parceiro encontrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[340px]">
              <thead>
                <tr className="border-b border-black/5">
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-[#4A0E2E]/50 uppercase tracking-wide cursor-pointer select-none hover:text-[#4A0E2E] transition"
                    onClick={() => toggleSort("nome")}
                  >
                    Parceiro{" "}
                    <SortIcon col="nome" sortBy={sortBy} sortDir={sortDir} />
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-[#4A0E2E]/50 uppercase tracking-wide cursor-pointer select-none hover:text-[#4A0E2E] transition hidden sm:table-cell"
                    onClick={() => toggleSort("data")}
                  >
                    Última entrega{" "}
                    <SortIcon col="data" sortBy={sortBy} sortDir={sortDir} />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#4A0E2E]/50 uppercase tracking-wide hidden md:table-cell">
                    Status
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-semibold text-[#4A0E2E]/50 uppercase tracking-wide cursor-pointer select-none hover:text-[#4A0E2E] transition"
                    onClick={() => toggleSort("saldo")}
                  >
                    Saldo{" "}
                    <SortIcon col="saldo" sortBy={sortBy} sortDir={sortDir} />
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[#4A0E2E]/50 uppercase tracking-wide">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/3">
                {filtrados.map((p) => {
                  const isExpanded = expanded === p.parceiro;
                  const { saldoGeral, entregasPendentes } = p._resumo;
                  const hasPending = saldoGeral > 0;
                  const entregas = [...(p.entregas || [])].sort((a, b) =>
                    String(b.data).localeCompare(String(a.data))
                  );

                  return (
                    <Fragment key={p.parceiro}>
                      <tr
                        className={`transition ${
                          hasPending ? "bg-[#FFF7FC]" : ""
                        } hover:bg-[#FFF4FA]`}
                      >
                        {/* Nome */}
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleExpand(p.parceiro)}
                            className="flex items-center gap-2 text-sm font-semibold text-[#4A0E2E] hover:text-[#D1328C] transition text-left"
                          >
                            <ChevronDown
                              className={`w-4 h-4 text-[#4A0E2E]/40 transition-transform duration-200 shrink-0 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                            <span className="capitalize">{p.parceiro}</span>
                          </button>
                        </td>

                        {/* Última entrega */}
                        <td className="px-4 py-3 text-sm text-[#4A0E2E]/60 hidden sm:table-cell">
                          {p._lastDate ? (
                            toBRDate(p._lastDate)
                          ) : (
                            <span className="text-[#4A0E2E]/30">—</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 hidden md:table-cell">
                          {entregasPendentes > 0 ? (
                            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                              {entregasPendentes} pendente
                              {entregasPendentes > 1 ? "s" : ""}
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
                              tudo pago
                            </span>
                          )}
                        </td>

                        {/* Saldo */}
                        <td className="px-4 py-3 text-right">
                          <span
                            className={`text-sm font-bold ${
                              hasPending ? "text-yellow-600" : "text-green-600"
                            }`}
                          >
                            {moneyBR(saldoGeral)}
                          </span>
                        </td>

                        {/* Ações */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            {hasPending && (
                              <button
                                onClick={() => onPagar(p.parceiro, saldoGeral)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#D1328C]/10 text-[#D1328C] text-xs font-bold hover:bg-[#D1328C]/20 transition"
                                title="Registrar pagamento"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Pagar</span>
                              </button>
                            )}
                            <button
                              onClick={() => onNovaEntrega(p.parceiro)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#4A0E2E]/8 text-[#4A0E2E] text-xs font-bold hover:bg-[#4A0E2E]/15 transition"
                              title="Nova entrega"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Entrega</span>
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Accordion: lista de entregas */}
                      {isExpanded && (
                        <tr>
                          <td
                            colSpan={99}
                            className="bg-[#FFF9FB] border-t border-black/5 px-3 py-4 sm:px-5"
                          >
                            {entregas.length === 0 ? (
                              <p className="text-sm text-center text-[#4A0E2E]/40 py-4">
                                Nenhuma entrega registrada.
                              </p>
                            ) : (
                              <div className="space-y-3">
                                {entregas.map((e) => (
                                  <DeliveryCard
                                    key={e.id}
                                    entrega={e}
                                    onEdit={
                                      onEditEntrega
                                        ? (entrega) =>
                                            onEditEntrega(p.parceiro, entrega)
                                        : undefined
                                    }
                                    onDelete={
                                      onDeleteEntrega
                                        ? (entrega) =>
                                            onDeleteEntrega(p.parceiro, entrega)
                                        : undefined
                                    }
                                    onEditPagamento={
                                      onEditPagamento
                                        ? (index, pagamento) =>
                                            onEditPagamento(p.parceiro, e.id, index, pagamento)
                                        : undefined
                                    }
                                    onDeletePagamento={
                                      onDeletePagamento
                                        ? (index, valor, data) =>
                                            onDeletePagamento(p.parceiro, e.id, index, valor, data)
                                        : undefined
                                    }
                                  />
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
