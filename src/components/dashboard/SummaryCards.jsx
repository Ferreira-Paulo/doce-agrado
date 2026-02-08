import { moneyBR } from "@/components/utils/format";

export default function SummaryCards({ resumo }) {
  const saldoClass =
    resumo.saldoGeral === 0
      ? "text-green-600"
      : resumo.saldoGeral > 0
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      <div className="bg-white rounded-2xl shadow p-5">
        <p className="text-sm text-[#4A0E2E]/60">Total entregue</p>
        <p className="text-2xl font-bold text-[#4A0E2E]">
          {moneyBR(resumo.totalEntregue)}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow p-5">
        <p className="text-sm text-[#4A0E2E]/60">Total pago</p>
        <p className="text-2xl font-bold text-[#4A0E2E]">
          {moneyBR(resumo.totalPago)}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow p-5">
        <p className="text-sm text-[#4A0E2E]/60">Saldo</p>
        <p className={`text-2xl font-bold ${saldoClass}`}>
          {moneyBR(resumo.saldoGeral)}
        </p>
      </div>
    </div>
  );
}
