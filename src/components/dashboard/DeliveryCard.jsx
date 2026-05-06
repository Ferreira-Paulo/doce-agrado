import { useState } from "react";
import { ChevronDown, Pencil, Trash2, Clock, Package, Banknote, CheckCircle2, X } from "lucide-react";
import { toBRDate, moneyBR } from "@/components/utils/format";
import { calcEntrega, round2 } from "@/components/utils/calc";

function diasDesde(dateStr) {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function PaymentTimeline({ entrega, total, saldo, quantidade, onEditPagamento, onDeletePagamento }) {
  const rawPagamentos = Array.isArray(entrega.pagamentos) ? entrega.pagamentos : [];
  const indexed = rawPagamentos.map((p, originalIndex) => ({ ...p, originalIndex }));
  const sorted = [...indexed].sort((a, b) => String(a.data).localeCompare(String(b.data)));

  const events = sorted.reduce(({ balance, items }, p) => {
    const newBalance = round2(balance - Number(p.valor || 0));
    return {
      balance: newBalance,
      items: [...items, { data: p.data, valor: Number(p.valor || 0), saldoApos: newBalance, originalIndex: p.originalIndex }],
    };
  }, { balance: total, items: [] }).items;

  const isQuitado = saldo === 0;

  return (
    <div className="relative pl-3">
      <div className="absolute left-2.75 top-5 bottom-5 w-px bg-black/8" />

      <div className="space-y-4">
        <div className="flex gap-3 items-start">
          <div className="w-5 h-5 rounded-full bg-[#D1328C]/15 flex items-center justify-center shrink-0 z-10 mt-0.5">
            <Package className="w-3 h-3 text-[#D1328C]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#4A0E2E]">Entrega registrada</p>
            <p className="text-xs text-[#4A0E2E]/50">
              {toBRDate(entrega.data)} · {quantidade} trufa{quantidade !== 1 ? "s" : ""} · {moneyBR(total)}
            </p>
          </div>
        </div>

        {events.map((ev, i) => (
          <div key={i} className="flex gap-3 items-start group">
            <div className="w-5 h-5 rounded-full bg-green-50 border border-green-200 flex items-center justify-center shrink-0 z-10 mt-0.5">
              <Banknote className="w-3 h-3 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-xs font-semibold text-green-700">{moneyBR(ev.valor)} recebido</p>
                <div className="flex items-center gap-1 shrink-0">
                  <p className="text-xs text-[#4A0E2E]/40">saldo: {moneyBR(ev.saldoApos)}</p>
                  {onEditPagamento && (
                    <button
                      type="button"
                      onClick={() => onEditPagamento(ev.originalIndex, { valor: ev.valor, data: ev.data })}
                      className="p-0.5 rounded text-[#4A0E2E]/30 hover:text-[#4A0E2E] hover:bg-black/5 transition opacity-0 group-hover:opacity-100"
                      title="Editar pagamento"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                  )}
                  {onDeletePagamento && (
                    <button
                      type="button"
                      onClick={() => onDeletePagamento(ev.originalIndex, ev.valor, ev.data)}
                      className="p-0.5 rounded text-red-300 hover:text-red-600 hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                      title="Excluir pagamento"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-[#4A0E2E]/50">{toBRDate(ev.data)}</p>
            </div>
          </div>
        ))}

        {isQuitado && events.length > 0 ? (
          <div className="flex gap-3 items-start">
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 z-10 mt-0.5">
              <CheckCircle2 className="w-3 h-3 text-green-600" />
            </div>
            <p className="text-xs font-semibold text-green-600 mt-0.5">Quitado</p>
          </div>
        ) : saldo > 0 ? (
          <div className="flex gap-3 items-start">
            <div className="w-5 h-5 rounded-full bg-orange-50 border border-dashed border-orange-300 flex items-center justify-center shrink-0 z-10 mt-0.5">
              <Clock className="w-3 h-3 text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-orange-600">Aguardando {moneyBR(saldo)}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

const STATUS = {
  pago:     { label: "PAGO",     cls: "bg-green-100 text-green-700" },
  parcial:  { label: "PARCIAL",  cls: "bg-yellow-100 text-yellow-800" },
  pendente: { label: "PENDENTE", cls: "bg-red-100 text-red-700" },
  vazio:    { label: "—",        cls: "bg-gray-100 text-gray-600" },
};

function getStatus(total, saldo) {
  if (total === 0) return STATUS.vazio;
  if (saldo === 0) return STATUS.pago;
  if (saldo < total) return STATUS.parcial;
  return STATUS.pendente;
}

export default function DeliveryCard({ entrega, onEdit, onDelete, onEditPagamento, onDeletePagamento }) {
  const [showPayments, setShowPayments] = useState(false);
  const { total, totalPago, saldo, quantidade } = calcEntrega(entrega);
  const status = getStatus(total, saldo);
  const percent = total > 0 ? Math.min(100, Math.round((totalPago / total) * 100)) : 0;

  const barColor =
    percent === 100 ? "bg-green-500" : percent > 0 ? "bg-yellow-400" : "bg-red-300";

  const pagamentos = Array.isArray(entrega.pagamentos) ? entrega.pagamentos : [];
  const isAdmin = !!(onEdit || onDelete);
  const dias = saldo > 0 ? diasDesde(entrega.data) : null;

  const itens = Array.isArray(entrega.itens) && entrega.itens.length > 0 ? entrega.itens : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-xs text-[#4A0E2E]/50 font-medium uppercase tracking-wide">Entrega</p>
          <p className="font-bold text-[#4A0E2E] text-base">{toBRDate(entrega.data)}</p>
          {entrega.data_validade && (
            <p className="text-xs text-[#4A0E2E]/50 mt-0.5">
              Validade: {toBRDate(entrega.data_validade)}
            </p>
          )}
          {dias !== null && (
            <p className={`flex items-center gap-1 text-xs font-semibold mt-0.5 ${dias > 30 ? "text-red-600" : "text-orange-500"}`}>
              <Clock className="w-3 h-3" />
              {dias === 0 ? "Hoje" : `${dias}d pendente`}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${status.cls}`}>
            {status.label}
          </span>

          {isAdmin && (
            <div className="flex gap-1">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(entrega)}
                  className="p-1.5 rounded-lg text-[#4A0E2E]/40 hover:text-[#4A0E2E] hover:bg-black/5 transition"
                  title="Editar entrega"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(entrega)}
                  className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition"
                  title="Excluir entrega"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chips de sabores */}
      {itens && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {itens.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FFF9FB] border border-[#D1328C]/10 rounded-full text-xs text-[#4A0E2E] font-medium"
            >
              {item.sabor} · {item.quantidade}
            </span>
          ))}
        </div>
      )}

      {/* Barra de progresso */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-[#4A0E2E]/50 mb-1.5">
          <span>Progresso de pagamento</span>
          <span className="font-semibold">{percent}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Três métricas */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
        <div className="bg-[#FFF9FB] rounded-xl p-2 sm:p-3">
          <p className="text-xs text-[#4A0E2E]/50 mb-0.5">Qtd.</p>
          <p className="font-bold text-[#4A0E2E] text-sm sm:text-base">{quantidade}</p>
        </div>
        <div className="bg-[#FFF9FB] rounded-xl p-2 sm:p-3">
          <p className="text-xs text-[#4A0E2E]/50 mb-0.5">Total</p>
          <p className="font-bold text-[#4A0E2E] text-sm sm:text-base truncate">{moneyBR(total)}</p>
        </div>
        <div className="bg-[#FFF9FB] rounded-xl p-2 sm:p-3">
          <p className="text-xs text-[#4A0E2E]/50 mb-0.5">Saldo</p>
          <p className={`font-bold text-sm sm:text-base truncate ${saldo === 0 ? "text-green-600" : saldo < total ? "text-yellow-600" : "text-red-600"}`}>
            {moneyBR(saldo)}
          </p>
        </div>
      </div>

      {/* Timeline de pagamentos */}
      <div className="mt-4 border-t border-black/5 pt-4">
        <button
          type="button"
          onClick={() => setShowPayments((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#4A0E2E]/60 hover:text-[#4A0E2E] transition mb-3"
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${showPayments ? "rotate-180" : ""}`}
          />
          {showPayments ? "Ocultar histórico" : "Ver histórico"}
          {pagamentos.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-black/5 text-[#4A0E2E]/50 font-bold text-[10px]">
              {pagamentos.length} pagamento{pagamentos.length > 1 ? "s" : ""}
            </span>
          )}
        </button>

        {showPayments && (
          <PaymentTimeline entrega={entrega} total={total} saldo={saldo} quantidade={quantidade} onEditPagamento={onEditPagamento} onDeletePagamento={onDeletePagamento} />
        )}
      </div>
    </div>
  );
}
