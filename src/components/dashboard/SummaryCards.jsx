import { moneyBR } from "@/components/utils/format";

export default function SummaryCards({ resumo }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
      {/* Trufas vendidas */}
      <div className="bg-white rounded-2xl shadow p-5">
        <p className="text-sm text-[#4A0E2E]/60">Trufas vendidas</p>
        <p className="text-2xl font-bold text-[#4A0E2E]">
          {resumo.trufasVendidas ?? 0}
        </p>
      </div>

      {/* Trufas pendentes */}
      <div className="bg-white rounded-2xl shadow p-5">
        <p className="text-sm text-[#4A0E2E]/60">Trufas pendentes</p>
        <p className="text-2xl font-bold text-[#4A0E2E]">
          {resumo.trufasPendentes ?? 0}
        </p>
      </div>

      {/* Faturamento gerado */}
      {/* <div className="bg-white rounded-2xl shadow p-5">
        <p className="text-sm text-[#4A0E2E]/60">Faturamento gerado</p>
        <p className="text-2xl font-bold text-green-600">
          {moneyBR(resumo.faturamentoGerado ?? 0)}
        </p>
      </div> */}

      {/* Valor a repassar */}
      <div className="bg-white rounded-2xl shadow p-5">
        <p className="text-sm text-[#4A0E2E]/60">Valor a repassar</p>
        <p className="text-2xl font-bold text-yellow-600">
          {moneyBR(resumo.valorARepassar ?? 0)}
        </p>
      </div>
    </div>
  );
}
