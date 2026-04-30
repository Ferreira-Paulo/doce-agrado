export default function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#4A0E2E]">
        {title}
      </h1>
      {subtitle && (
        <p className="text-[#4A0E2E]/60 mt-1 text-sm">{subtitle}</p>
      )}
    </div>
  );
}
