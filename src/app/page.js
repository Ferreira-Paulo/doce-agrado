import Image from "next/image";
import Link from "next/link";

export default function EmBreve() {
  return (
    <div className="min-h-screen bg-[#FFF9FB] text-[#4A0E2E] flex flex-col items-center justify-center px-4">

      {/* Blob decorativo */}
      <div className="pointer-events-none fixed -top-40 -left-40 w-125 h-125 rounded-full bg-[#D1328C]/10 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 w-100 h-100 rounded-full bg-[#D1328C]/6 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">

        {/* Logo */}
        <div className="relative w-20 h-20 rounded-3xl overflow-hidden border-2 border-[#D1328C]/20 shadow-lg mb-8">
          <Image
            src="/img/logo-doce-agrado.png"
            alt="Doce Agrado"
            fill
            className="object-contain p-1.5"
            priority
          />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D1328C]/25 bg-[#D1328C]/8 px-4 py-1.5 text-xs font-semibold text-[#D1328C] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D1328C] animate-pulse" />
          Em breve
        </div>

        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-[#4A0E2E]">
          Doce Agrado
        </h1>
        <p className="mt-3 text-[#4A0E2E]/60 text-lg font-medium">
          Trufas artesanais
        </p>

        {/* Descrição */}
        <p className="mt-6 text-[#4A0E2E]/60 leading-relaxed">
          Nosso site está chegando. Em breve você vai poder conhecer tudo sobre
          nossos produtos, consignado e muito mais.
        </p>

        {/* Divisor */}
        <div className="w-16 h-px bg-[#D1328C]/20 my-8" />

        {/* Botão área do parceiro */}
        <Link
          href="/parceiro"
          className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#D1328C] px-7 py-3.5 text-sm font-bold text-white hover:bg-[#b52a79] transition shadow-md shadow-[#D1328C]/20 w-full sm:w-auto"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Área do parceiro
        </Link>

      </div>

      {/* Footer mínimo */}
      <p className="relative z-10 mt-16 text-xs text-[#4A0E2E]/30">
        © {new Date().getFullYear()} Doce Agrado
      </p>

    </div>
  );
}
