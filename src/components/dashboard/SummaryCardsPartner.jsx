import { moneyBR } from "@/components/utils/format";

export default function SummaryCardsPartner({ resumo }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      <div className="bg-white rounded-2xl shadow p-5">
        <p className="text-sm text-[#4A0E2E]/60">Trufas vendidas</p>
        <p className="text-2xl font-bold text-[#4A0E2E]">
          {resumo?.trufasVendidas ?? 0}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow p-5">
        <p className="text-sm text-[#4A0E2E]/60">Trufas pendentes de pagamento</p>
        <p className="text-2xl font-bold text-[#4A0E2E]">
          {resumo?.trufasPendentes ?? 0}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow p-5">
        <p className="text-sm text-[#4A0E2E]/60">Valor a repassar</p>
        <p className="text-2xl font-bold text-yellow-600">
          {moneyBR(resumo?.valorARepassar ?? 0)}
        </p>
      </div>
    </div>
  );
}
