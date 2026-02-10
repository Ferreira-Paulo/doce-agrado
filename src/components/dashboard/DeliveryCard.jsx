import { toBRDate, moneyBR } from "@/components/utils/format";
import { calcEntrega } from "@/components/utils/calc";

function getStatus(total, saldo) {
  const t = Number(total) || 0;
  const s = Number(saldo) || 0;

  if (t === 0) return { label: "—", cls: "bg-gray-100 text-gray-700" };
  if (s === 0) return { label: "PAGO", cls: "bg-green-100 text-green-700" };
  if (s < t) return { label: "PARCIAL", cls: "bg-yellow-100 text-yellow-800" };
  return { label: "PENDENTE", cls: "bg-red-100 text-red-700" };
}

function getUltimoPagamento(entrega) {
  const list = Array.isArray(entrega?.pagamentos) ? entrega.pagamentos : [];
  if (list.length === 0) return null;

  const sorted = [...list].sort((a, b) =>
    String(b?.data || "").localeCompare(String(a?.data || ""))
  );

  return sorted[0] || null;
}

export default function DeliveryCard({ entrega }) {
  const { total, totalPago, saldo, saldoColor } = calcEntrega(entrega);
  const status = getStatus(total, saldo);
  const ultimo = getUltimoPagamento(entrega);

  return (
    <div className="bg-white rounded-2xl shadow p-5 border border-black/5">
      {/* Topo: Data + Status */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-sm text-[#4A0E2E]/60">Entrega</p>
          <p className="font-bold text-[#4A0E2E]">{toBRDate(entrega.data)}</p>
        </div>

        <span
          className={`shrink-0 inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${status.cls}`}
        >
          {status.label}
        </span>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        {/* Coluna esquerda */}
        <div className="space-y-1">
          <p className="text-sm text-[#4A0E2E]/60">Quantidade</p>
          <p className="text-[#4A0E2E]">{entrega.quantidade} trufas</p>

          <p className="mt-3 text-sm text-[#4A0E2E]/60">Total</p>
          <p className="text-[#4A0E2E] font-semibold">{moneyBR(total)}</p>
        </div>

        {/* Coluna direita */}
        <div className="md:text-right space-y-1">
          <p className="text-sm text-[#4A0E2E]/60">Total pago</p>
          <p className="text-[#4A0E2E] font-semibold">{moneyBR(totalPago)}</p>

          <p className="mt-3 text-sm text-[#4A0E2E]/60">Saldo a repassar</p>
          <p className={`text-xl font-extrabold ${saldoColor}`}>
            {moneyBR(saldo)}
          </p>

          {/* Último pagamento (opcional) */}
          {ultimo && (
            <p className="mt-2 text-xs text-[#4A0E2E]/60">
              Último pagamento: {moneyBR(ultimo.valor)} • {toBRDate(ultimo.data)}
            </p>
          )}

          <p className="mt-3 text-sm text-[#4A0E2E]/60">Pagamentos</p>
          {!entrega.pagamentos || entrega.pagamentos.length === 0 ? (
            <p className="text-sm text-[#4A0E2E]/70">
              Nenhum pagamento registrado
            </p>
          ) : (
            <ul className="text-sm text-[#4A0E2E] space-y-1 md:text-right">
              {entrega.pagamentos.map((p, i) => (
                <li key={i}>
                  {moneyBR(p.valor)} • {toBRDate(p.data)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
