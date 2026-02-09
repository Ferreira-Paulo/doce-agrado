export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF9FB] px-4 md:px-8">
      <div className="w-full max-w-xl text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-[#2B1B1F]">
          Em breve
        </h1>

        <p className="mt-3 text-base md:text-lg text-[#5A3B44]/80">
          Estamos preparando algo especial. Enquanto isso, parceiros já podem acessar a área exclusiva.
        </p>

        <img
          src="/img/logo-doce-agrado.png"
          alt="Doce Agrado"
          className="mt-10 mb-8 h-24 md:h-80 mx-auto drop-shadow-sm
                 transition-transform duration-300 ease-out
                 motion-safe:animate-pulse hover:scale-[1.02]"
        />

        <a
          href="/parceiro"
          className="inline-flex items-center justify-center rounded-2xl px-6 py-3
                 font-semibold tracking-wide
                 bg-[#2B1B1F] text-white
                 shadow-md shadow-black/10
                 transition-all duration-200
                 hover:shadow-lg hover:-translate-y-0.5 hover:opacity-95
                 focus:outline-none focus:ring-2 focus:ring-[#2B1B1F]/40 focus:ring-offset-2 focus:ring-offset-[#FFF9FB]"
        >
          Acessar área do parceiro
        </a>

        <p className="mt-4 text-sm text-[#5A3B44]/70">
          Ou acesse diretamente: <span className="font-semibold">/login</span>
        </p>
      </div>
    </div>
  );
}
