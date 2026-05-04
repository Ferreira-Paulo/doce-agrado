import { Package, Clock, AlertCircle, TrendingUp } from "lucide-react";
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

export default function SummaryCardsPartner({ resumo }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <StatCard
        icon={TrendingUp}
        label="Total acumulado"
        value={`${resumo?.trufasEntregues ?? 0} trufas`}
        bg="bg-pink-50"
        iconColor="text-pink-400"
        valueColor="text-[#D9418C]"
      />
      <StatCard
        icon={Package}
        label="Entregas abertas"
        value={resumo?.entregasPendentes ?? 0}
        bg="bg-purple-50"
        iconColor="text-purple-500"
      />
      <StatCard
        icon={Clock}
        label="Pendentes"
        value={resumo?.trufasPendentes ?? 0}
        bg="bg-orange-50"
        iconColor="text-orange-500"
      />
      <StatCard
        icon={AlertCircle}
        label="Valor a repassar"
        value={moneyBR(resumo?.valorARepassar ?? 0)}
        bg="bg-yellow-50"
        iconColor="text-yellow-500"
        valueColor="text-yellow-600"
      />
    </div>
  );
}
