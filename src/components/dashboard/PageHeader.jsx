export default function PageHeader({ title, subtitle, onLogout }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#4A0E2E]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[#4A0E2E]/70 mt-1">{subtitle}</p>
        )}
      </div>

      {onLogout && (
        <button
          onClick={onLogout}
          className="bg-[#D1328C] text-white px-6 py-2 rounded-xl hover:bg-[#b52a79] transition w-full md:w-auto"
        >
          Sair
        </button>
      )}
    </div>
  );
}
