import { moneyBR } from "@/components/utils/format";

export default function SummaryCardsAdmin({ resumo }) {
  const saldoClass =
    (resumo?.saldoGeral ?? 0) === 0
      ? "text-green-600"
      : (resumo?.saldoGeral ?? 0) > 0
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
      <div className="bg-white rounded-2xl shadow p-5">
        <p className="text-sm text-[#4A0E2E]/60">Total entregue</p>
        <p className="text-2xl font-bold text-[#4A0E2E]">
          {moneyBR(resumo?.totalEntregue ?? 0)}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow p-5">
        <p className="text-sm text-[#4A0E2E]/60">Total recebido</p>
        <p className="text-2xl font-bold text-green-600">
          {moneyBR(resumo?.totalPago ?? 0)}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow p-5">
        <p className="text-sm text-[#4A0E2E]/60">A receber</p>
        <p className={`text-2xl font-bold ${saldoClass}`}>
          {moneyBR(resumo?.saldoGeral ?? 0)}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow p-5">
        <p className="text-sm text-[#4A0E2E]/60">Entregas pendentes</p>
        <p className="text-2xl font-bold text-[#4A0E2E]">
          {resumo?.entregasPendentes ?? 0}
        </p>
      </div>
      

      <div className="bg-white rounded-2xl shadow p-5">
        <p className="text-sm text-[#4A0E2E]/60">Trufas entregues</p>
        <p className="text-2xl font-bold text-[#4A0E2E]">
          {resumo?.trufasEntregues ?? 0}
        </p>
      </div>
    </div>
  );
}
