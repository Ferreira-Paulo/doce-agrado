import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFF9FB] font-sans text-[#4A0E2E]">
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <img src="../../img/logo-doce-agrado.png" alt="Doce Agrado" className="h-16" />
        <div className="space-x-8 font-medium">
          <a href="#sobre" className="hover:text-[#D1328C]">Sobre</a>
          <a href="#parceiro" className="hover:text-[#D1328C]">Parceria</a>
          <Link href="/dashboard">
            <button className="bg-[#D1328C] text-white px-6 py-2 rounded-full hover:bg-[#b52a79] transition">
              Área do Parceiro
            </button>
          </Link>
        </div>
      </nav>

      <header className="max-w-7xl mx-auto px-8 py-16 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Mais sabor para seus clientes, <span className="text-[#D1328C]">zero risco</span> para você.
          </h1>
          <p className="text-xl text-gray-700">
            Torne-se um ponto de revenda Doce Agrado. Fornecemos trufas artesanais em regime de consignação com total controle digital.
          </p>
          <button className="bg-[#D1328C] text-white text-lg px-8 py-4 rounded-lg shadow-lg hover:scale-105 transition-transform">
            Seja um Parceiro Agora
          </button>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
          {/* Placeholder para uma foto real ou ilustração das trufas */}
          <div className="w-80 h-80 bg-pink-200 rounded-full flex items-center justify-center border-4 border-[#D1328C]">
             <span className="text-[#D1328C] font-bold">Foto das Trufas</span>
          </div>
        </div>
      </header>
    </div>
  );
}
