import { Check } from "lucide-react";
import { btnBase, btnOn, btnOff } from "@/components/utils/styles";

const FILTERS = [
  { key: "todas",    label: "Todas",    count: (c) => c.total },
  { key: "pendentes", label: "Pendentes", count: (c) => c.pendentes },
  { key: "pagas",    label: "Pagas",    count: (c) => c.pagas },
];

export default function FilterTabs({ value, onChange, counts }) {
  const activeCount = value === "todas" ? counts.total : value === "pendentes" ? counts.pendentes : counts.pagas;
  const showContext = value !== "todas";

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
      <p className="text-sm text-[#4A0E2E]/70">
        {showContext
          ? `Mostrando ${activeCount} de ${counts.total} entrega${counts.total !== 1 ? "s" : ""}`
          : `${counts.total} entrega${counts.total !== 1 ? "s" : ""} no total`}
      </p>

      <div className="flex gap-2">
        {FILTERS.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`${btnBase} flex items-center gap-1.5 ${value === key ? btnOn : btnOff}`}
            aria-pressed={value === key}
          >
            {value === key && <Check className="w-3.5 h-3.5 shrink-0" />}
            {label}
            <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${value === key ? "bg-white/20 text-white" : "bg-black/5 text-[#4A0E2E]/60"}`}>
              {count(counts)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
