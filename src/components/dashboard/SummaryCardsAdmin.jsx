import { DollarSign, TrendingUp, AlertCircle, Clock, Package } from "lucide-react";
import { moneyBR } from "@/components/utils/format";

function StatCard({ icon: Icon, label, value, bg, iconColor, valueColor }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-3 sm:p-5 flex items-center gap-2 sm:gap-4">
      <div className={`${bg} rounded-xl p-2 sm:p-3 shrink-0`}>
        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-[#4A0E2E]/50 leading-tight">
          {label}
        </p>
        <p className={`text-base sm:text-xl font-extrabold mt-0.5 ${valueColor ?? "text-[#4A0E2E]"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default function SummaryCardsAdmin({ resumo }) {
  const saldoColor =
    (resumo?.saldoGeral ?? 0) === 0 ? "text-green-600" : "text-yellow-600";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
      <StatCard
        icon={DollarSign}
        label="Total entregue"
        value={moneyBR(resumo?.totalEntregue ?? 0)}
        bg="bg-violet-50"
        iconColor="text-violet-500"
      />
      <StatCard
        icon={TrendingUp}
        label="Total recebido"
        value={moneyBR(resumo?.totalPago ?? 0)}
        bg="bg-green-50"
        iconColor="text-green-500"
        valueColor="text-green-600"
      />
      <StatCard
        icon={AlertCircle}
        label="A receber"
        value={moneyBR(resumo?.saldoGeral ?? 0)}
        bg="bg-yellow-50"
        iconColor="text-yellow-500"
        valueColor={saldoColor}
      />
      <StatCard
        icon={Clock}
        label="Entregas pendentes"
        value={resumo?.entregasPendentes ?? 0}
        bg="bg-orange-50"
        iconColor="text-orange-500"
      />
      <StatCard
        icon={Package}
        label="Trufas entregues"
        value={resumo?.trufasEntregues ?? 0}
        bg="bg-pink-50"
        iconColor="text-pink-500"
      />
    </div>
  );
}
