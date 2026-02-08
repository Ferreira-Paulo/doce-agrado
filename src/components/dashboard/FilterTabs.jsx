export default function FilterTabs({ value, onChange, counts }) {
  const btnBase = "px-4 py-2 rounded-xl text-sm font-semibold transition border";
  const btnOn = "bg-[#4A0E2E] text-white border-[#4A0E2E]";
  const btnOff = "bg-white text-[#4A0E2E] border-black/10 hover:bg-black/[0.03]";

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
      <p className="text-sm text-[#4A0E2E]/70">
        Total: {counts.total} • Pendentes: {counts.pendentes} • Pagas: {counts.pagas}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => onChange("todas")}
          className={`${btnBase} ${value === "todas" ? btnOn : btnOff}`}
        >
          Todas
        </button>
        <button
          onClick={() => onChange("pendentes")}
          className={`${btnBase} ${value === "pendentes" ? btnOn : btnOff}`}
        >
          Pendentes
        </button>
        <button
          onClick={() => onChange("pagas")}
          className={`${btnBase} ${value === "pagas" ? btnOn : btnOff}`}
        >
          Pagas
        </button>
      </div>
    </div>
  );
}
