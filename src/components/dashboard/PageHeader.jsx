export default function PageHeader({ title, subtitle, lastUpdated }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#4A0E2E]">
        {title}
      </h1>
      {subtitle && (
        <p className="text-[#4A0E2E]/60 mt-1 text-sm">{subtitle}</p>
      )}
      {lastUpdated && (
        <p className="text-xs text-[#4A0E2E]/35 mt-1">Atualizado às {lastUpdated}</p>
      )}
    </div>
  );
}
