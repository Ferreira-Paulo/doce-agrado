import { toBRDate, moneyBR } from "@/components/utils/format";
import { calcEntrega } from "@/components/utils/calc";

export default function DeliveryCard({ entrega }) {
  const { total, totalPago, saldo, saldoColor } = calcEntrega(entrega);

  return (
    <div className="bg-white rounded-2xl shadow p-5 border border-black/5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <p className="text-sm text-[#4A0E2E]/60">Data</p>
          <p className="font-bold text-[#4A0E2E]">
            {toBRDate(entrega.data)}
          </p>

          <p className="mt-3 text-sm text-[#4A0E2E]/60">Quantidade</p>
          <p className="text-[#4A0E2E]">{entrega.quantidade} trufas</p>

          <p className="mt-3 text-sm text-[#4A0E2E]/60">Total</p>
          <p className="text-[#4A0E2E] font-semibold">{moneyBR(total)}</p>
        </div>

        <div className="md:text-right space-y-1">
          <p className="text-sm text-[#4A0E2E]/60">Total pago</p>
          <p className="text-[#4A0E2E] font-semibold">{moneyBR(totalPago)}</p>

          <p className="mt-3 text-sm text-[#4A0E2E]/60">Saldo</p>
          <p className={`font-bold ${saldoColor}`}>{moneyBR(saldo)}</p>

          <p className="mt-3 text-sm text-[#4A0E2E]/60">Pagamentos</p>
          {(!entrega.pagamentos || entrega.pagamentos.length === 0) ? (
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
