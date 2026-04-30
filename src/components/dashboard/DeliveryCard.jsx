import { useState } from "react";
import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import { toBRDate, moneyBR } from "@/components/utils/format";
import { calcEntrega } from "@/components/utils/calc";

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

export default function DeliveryCard({ entrega, onEdit, onDelete }) {
  const [showPayments, setShowPayments] = useState(false);
  const { total, totalPago, saldo } = calcEntrega(entrega);
  const status = getStatus(total, saldo);
  const percent = total > 0 ? Math.min(100, Math.round((totalPago / total) * 100)) : 0;

  const barColor =
    percent === 100 ? "bg-green-500" : percent > 0 ? "bg-yellow-400" : "bg-red-300";

  const pagamentos = Array.isArray(entrega.pagamentos) ? entrega.pagamentos : [];
  const isAdmin = !!(onEdit || onDelete);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-xs text-[#4A0E2E]/50 font-medium uppercase tracking-wide">Entrega</p>
          <p className="font-bold text-[#4A0E2E] text-base">{toBRDate(entrega.data)}</p>
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
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-[#FFF9FB] rounded-xl p-3">
          <p className="text-xs text-[#4A0E2E]/50 mb-0.5">Quantidade</p>
          <p className="font-bold text-[#4A0E2E]">{entrega.quantidade}</p>
        </div>
        <div className="bg-[#FFF9FB] rounded-xl p-3">
          <p className="text-xs text-[#4A0E2E]/50 mb-0.5">Total</p>
          <p className="font-bold text-[#4A0E2E]">{moneyBR(total)}</p>
        </div>
        <div className="bg-[#FFF9FB] rounded-xl p-3">
          <p className="text-xs text-[#4A0E2E]/50 mb-0.5">Saldo</p>
          <p className={`font-bold ${saldo === 0 ? "text-green-600" : saldo < total ? "text-yellow-600" : "text-red-600"}`}>
            {moneyBR(saldo)}
          </p>
        </div>
      </div>

      {/* Histórico de pagamentos (colapsável) */}
      {pagamentos.length > 0 && (
        <div className="mt-4 border-t border-black/5 pt-4">
          <button
            type="button"
            onClick={() => setShowPayments((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#4A0E2E]/60 hover:text-[#4A0E2E] transition"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${showPayments ? "rotate-180" : ""}`}
            />
            {showPayments ? "Ocultar" : "Ver"} pagamentos ({pagamentos.length})
          </button>

          {showPayments && (
            <ul className="mt-3 space-y-1.5">
              {[...pagamentos]
                .sort((a, b) => String(b.data).localeCompare(String(a.data)))
                .map((p, i) => (
                  <li
                    key={i}
                    className="flex justify-between text-xs text-[#4A0E2E]/70 bg-[#FFF9FB] rounded-lg px-3 py-2"
                  >
                    <span>{toBRDate(p.data)}</span>
                    <span className="font-semibold">{moneyBR(p.valor)}</span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}

      {pagamentos.length === 0 && (
        <p className="mt-4 text-xs text-[#4A0E2E]/40 border-t border-black/5 pt-4">
          Nenhum pagamento registrado ainda.
        </p>
      )}
    </div>
  );
}
