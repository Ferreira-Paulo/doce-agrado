import Image from "next/image";
import Link from "next/link";

// ─── Contatos ──────────────────────────────────────────────────────────────────
const PHONE     = "5512988199718";
const INSTAGRAM = "https://instagram.com/doceagrado7";

const wa = (text) =>
  `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;

const WA_CONSIGNADO = wa("Oi! Tenho um estabelecimento e quero conhecer o consignado da Doce Agrado. Como funciona?");
const WA_PEDIDO     = wa("Oi! Quero fazer um pedido particular de trufas. Quais sabores e valores?");
const WA_KITS       = wa("Oi! Quero lembrancinhas e kits para uma data especial. Quais opções vocês fazem?");

// ─── Dados ─────────────────────────────────────────────────────────────────────
const BENEFICIOS = [
  {
    titulo: "Você paga só o que vende",
    desc: "Sem risco de encalhe. O produto vai para o seu balcão e você acerta conforme as vendas acontecem.",
    icon: "💰",
  },
  {
    titulo: "Reposição combinada",
    desc: "Quando o estoque cai, a gente repõe. Simples, sem burocracia, sem você precisar se preocupar.",
    icon: "🔄",
  },
  {
    titulo: "Alto giro, produto diferenciado",
    desc: "Trufa artesanal com rótulo próprio. Aumenta o ticket médio do seu caixa e fideliza o cliente.",
    icon: "📈",
  },
];

const GALERIA = [
  { src: "/img/trufa-editada-1.jpg",    alt: "Trufa artesanal Doce Agrado — acabamento caprichado" },
  { src: "/img/mini_panetone.jpg",       alt: "Mini panetone artesanal Doce Agrado" },
  { src: "/img/trufa-editada-2.png",    alt: "Trufa Doce Agrado embalada com rótulo" },
  { src: "/img/barra_preto_branco.jpg", alt: "Barras de chocolate Doce Agrado embaladas" },
];

const TAMBEM = [
  {
    tag: "Pedidos particulares",
    titulo: "Para consumo ou presente",
    desc: "Quer experimentar ou presentear alguém especial? Você pede pelo WhatsApp e a gente cuida do restante.",
    bullets: ["Sabores variados", "Sob encomenda", "Ideal para presentear"],
    cta: { label: "Fazer pedido", link: WA_PEDIDO },
    icon: "🍫",
  },
  {
    tag: "Kits & Lembrancinhas",
    titulo: "Eventos e datas especiais",
    desc: "Natal, Páscoa, Dia das Mães, casamentos, aniversários e eventos corporativos. Kits personalizados.",
    bullets: ["Personalização disponível", "Produção sob demanda", "Ótimo para brindes"],
    cta: { label: "Pedir kits", link: WA_KITS },
    icon: "🎁",
  },
];

const DEPOIMENTOS = [
  {
    nome: "Carlos M.",
    contexto: "Dono de lanchonete · São José dos Campos",
    texto:
      "Coloquei no balcão e acabou em poucos dias. Os clientes pedem de volta. Produto bem apresentado e com giro rápido.",
  },
  {
    nome: "Fernanda R.",
    contexto: "Padaria · Jacareí",
    texto:
      "Produto com marca própria, fácil de expor e os clientes adoram. Ajudou bastante no ticket médio do caixa.",
  },
  {
    nome: "Ana L.",
    contexto: "Encomenda para chá de bebê",
    texto:
      "Pedi como lembrancinha e as convidadas amaram. Embalagem bonita e sabor marcante. Com certeza pedirei de novo.",
  },
];

const PASSOS = [
  {
    n: "1",
    titulo: "Chame no WhatsApp",
    desc: "Diga que tem um estabelecimento e quer conhecer o consignado. Em minutos alinhamos os detalhes.",
  },
  {
    n: "2",
    titulo: "Combinamos tudo",
    desc: "Quantidade inicial, sabores, prazo de entrega e forma de acerto. Sem letra miúda.",
  },
  {
    n: "3",
    titulo: "Você vende, a gente repõe",
    desc: "O produto fica no seu balcão. Você vende e paga só o que saiu. Simples assim.",
  },
];

const FAQ = [
  {
    q: "Como funciona o consignado?",
    r: "Entregamos o produto no seu estabelecimento. Você vende e acerta o valor das vendas periodicamente. Sem pagamento adiantado.",
  },
  {
    q: "Qual o pedido mínimo para consignado?",
    r: "Combinamos a quantidade ideal para o seu fluxo de clientes. Chame no WhatsApp e ajustamos juntos.",
  },
  {
    q: "Vocês fazem pedidos particulares?",
    r: "Sim! Trabalhamos com pedidos sob encomenda para consumo ou presentear, com o mesmo padrão de qualidade.",
  },
  {
    q: "Fazem lembrancinhas e kits para eventos?",
    r: "Sim. Atendemos casamentos, aniversários, eventos corporativos, datas comemorativas e mais. Quanto antes entrar em contato, melhor para garantir a produção.",
  },
  {
    q: "Como é feita a reposição do consignado?",
    r: "Combinamos uma periodicidade que faz sentido para o seu estabelecimento. Quando o estoque cai, a gente repõe.",
  },
];

// ─── Componentes auxiliares ────────────────────────────────────────────────────
function BtnPrimary({ href, children, className = "" }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D1328C] px-6 py-3 text-sm font-bold text-white hover:bg-[#b52a79] transition ${className}`}
    >
      {children}
    </a>
  );
}

function BtnOutline({ href, children, className = "" }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border border-[#4A0E2E]/20 bg-white px-6 py-3 text-sm font-bold text-[#4A0E2E] hover:bg-[#4A0E2E]/5 transition ${className}`}
    >
      {children}
    </a>
  );
}

// ─── Página ────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFF9FB] text-[#4A0E2E]">

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-black/6 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 gap-4">
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-2.5 shrink-0">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-[#D1328C]/20">
              <Image src="/img/logo-doce-agrado.png" alt="Doce Agrado" fill className="object-contain p-0.5" priority />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-[#4A0E2E]">Doce Agrado</p>
              <p className="text-xs text-[#4A0E2E]/50 hidden sm:block">Trufas artesanais</p>
            </div>
          </a>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#4A0E2E]/70">
            <a href="#consignado" className="hover:text-[#D1328C] transition">Consignado</a>
            <a href="#produtos" className="hover:text-[#D1328C] transition">Produtos</a>
            <a href="#quem-somos" className="hover:text-[#D1328C] transition">Quem somos</a>
            <a href="#faq" className="hover:text-[#D1328C] transition">FAQ</a>
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/parceiro"
              className="hidden sm:inline-flex text-sm font-semibold text-[#4A0E2E]/60 hover:text-[#4A0E2E] transition px-3 py-2 rounded-xl hover:bg-black/5"
            >
              Área do parceiro
            </Link>
            <BtnPrimary href={WA_CONSIGNADO}>
              Falar no WhatsApp
            </BtnPrimary>
          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section id="inicio" className="relative overflow-hidden">
        {/* Blobs decorativos */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#D1328C]/8 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -right-24 w-72 h-72 rounded-full bg-[#F6E7D6]/60 blur-3xl" />

        <div className="mx-auto max-w-6xl px-4 py-14 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D1328C]/25 bg-[#D1328C]/8 px-4 py-1.5 text-xs font-semibold text-[#D1328C] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D1328C] animate-pulse" />
              Consignado · Pedidos · Kits & Lembrancinhas
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-[#4A0E2E]">
              Coloque nossas trufas{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10">no seu balcão.</span>
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 12" fill="none" aria-hidden>
                  <path d="M2 9 Q75 2 150 9 Q225 16 298 9" stroke="#D1328C" strokeWidth="3" strokeLinecap="round" fill="none" />
                </svg>
              </span>
              <br />Pague só o que vender.
            </h1>

            <p className="mt-5 text-base md:text-lg text-[#4A0E2E]/70 leading-relaxed max-w-lg">
              A <strong className="text-[#4A0E2E]">Doce Agrado</strong> oferece trufas artesanais em{" "}
              <strong className="text-[#4A0E2E]">consignado</strong> para bares, restaurantes, padarias, lanchonetes e mercados.
              Sem risco, com produto diferenciado e de alto giro.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <BtnPrimary href={WA_CONSIGNADO} className="text-base py-3.5 px-8">
                Quero consignado
              </BtnPrimary>
              <BtnOutline href={WA_PEDIDO}>
                Fazer um pedido
              </BtnOutline>
            </div>

            {/* Micro-provas */}
            <div className="mt-10 flex items-center gap-6 text-sm text-[#4A0E2E]/60">
              <span className="flex items-center gap-1.5">
                <span className="text-green-500">✓</span> Sem pagamento antecipado
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-green-500">✓</span> Produto com marca própria
              </span>
            </div>
          </div>

          {/* Foto hero */}
          <div className="relative flex justify-center">
            <div className="relative w-72 md:w-80 aspect-[3/4] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white ring-1 ring-black/5">
              <Image
                src="/img/trufa-editada.jpg"
                alt="Trufa artesanal Doce Agrado — recheio cremoso e viciante"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
            {/* Badge flutuante */}
            <div className="absolute -bottom-4 -left-4 md:-left-8 bg-white rounded-2xl shadow-lg border border-black/5 px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D1328C]/10 flex items-center justify-center text-lg">🍫</div>
              <div>
                <p className="text-xs text-[#4A0E2E]/50 font-medium">Consignado</p>
                <p className="text-sm font-bold text-[#4A0E2E]">Pague conforme vende</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ────────────────────────────────────────────────────── */}
      <section className="border-y border-[#D1328C]/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {BENEFICIOS.map((b) => (
            <div key={b.titulo} className="flex items-start gap-4">
              <div className="text-2xl shrink-0">{b.icon}</div>
              <div>
                <p className="font-bold text-[#4A0E2E] text-sm">{b.titulo}</p>
                <p className="text-xs text-[#4A0E2E]/60 mt-0.5 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONSIGNADO (seção principal) ───────────────────────────────────── */}
      <section id="consignado" className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Fotos empilhadas */}
            <div className="relative hidden md:block">
              <div className="relative w-full aspect-[4/5] rounded-[28px] overflow-hidden shadow-xl border-4 border-white ring-1 ring-black/5">
                <Image
                  src="/img/trufa-juntas-2.jpg"
                  alt="Variedade de sabores — trufas Doce Agrado"
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-44 h-44 rounded-[20px] overflow-hidden shadow-xl border-4 border-white ring-1 ring-black/5">
                <Image
                  src="/img/expositor_2.jpg"
                  alt="Expositor Doce Agrado em ponto de venda"
                  fill
                  className="object-cover object-bottom"
                />
              </div>
            </div>

            {/* Texto */}
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#D1328C] mb-3">
                Para estabelecimentos
              </span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#4A0E2E]">
                Aumente o ticket do seu caixa sem nenhum risco
              </h2>
              <p className="mt-4 text-[#4A0E2E]/70 leading-relaxed">
                Nosso modelo de consignado foi pensado para facilitar a vida do dono de estabelecimento.
                Você não precisa investir adiantado — o produto fica no seu balcão e você paga conforme as vendas.
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  "Produto com marca própria, bem apresentado",
                  "Sabor que fideliza — o cliente pede de volta",
                  "Reposição organizada, sem complicação",
                  "Acerto simples e transparente",
                  "Funciona em bares, padarias, lanchonetes e mercados",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#4A0E2E]">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-[#D1328C]/10 flex items-center justify-center shrink-0">
                      <span className="text-[#D1328C] text-xs">✓</span>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <BtnPrimary href={WA_CONSIGNADO} className="text-base py-3.5 px-8">
                  Quero levar para meu estabelecimento
                </BtnPrimary>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GALERIA ────────────────────────────────────────────────────────── */}
      <section id="produtos" className="py-16 bg-white border-y border-black/5">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#D1328C] mb-3">
              Nossos produtos
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#4A0E2E]">
              Feito com cuidado, apresentado com carinho
            </h2>
            <p className="mt-3 text-[#4A0E2E]/60 max-w-xl mx-auto">
              Trufas artesanais com recheio saboroso, cobertura de qualidade e embalagem caprichada.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {GALERIA.map((foto, i) => (
              <div
                key={i}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5 hover:shadow-md transition hover:scale-[1.01]"
              >
                <Image
                  src={foto.src}
                  alt={foto.alt}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#D1328C] hover:text-[#b52a79] transition"
            >
              Ver mais no Instagram @doceagrado7
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── TAMBÉM FAZEMOS ─────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#D1328C] mb-3">
              Outros formatos
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#4A0E2E]">
              Também atendemos você assim
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {TAMBEM.map((t) => (
              <div
                key={t.titulo}
                className="bg-white rounded-3xl border border-black/6 p-8 shadow-sm hover:shadow-md transition hover:-translate-y-0.5"
              >
                <div className="text-3xl mb-4">{t.icon}</div>
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#D1328C] mb-2">
                  {t.tag}
                </span>
                <h3 className="text-xl font-black text-[#4A0E2E] mb-2">{t.titulo}</h3>
                <p className="text-sm text-[#4A0E2E]/70 leading-relaxed mb-5">{t.desc}</p>
                <ul className="space-y-2 mb-6">
                  {t.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-[#4A0E2E]/80">
                      <span className="text-[#D1328C]">✓</span> {b}
                    </li>
                  ))}
                </ul>
                <BtnOutline href={t.cta.link}>{t.cta.label}</BtnOutline>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUEM SOMOS ─────────────────────────────────────────────────────── */}
      <section id="quem-somos" className="py-16 md:py-24 bg-white border-y border-black/5">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-12 items-center">
          {/* Foto(s) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md ring-1 ring-black/5 col-span-1">
              <Image
                src="/img/trufa-1.jpg"
                alt="Trufa artesanal Doce Agrado"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md ring-1 ring-black/5 col-span-1 mt-6">
              <Image
                src="/img/expositor.jpg"
                alt="Expositor Doce Agrado em ponto de venda"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Texto */}
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#D1328C] mb-3">
              Quem somos
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#4A0E2E]">
              Paulo e Lyvia, juntos há 8 anos
            </h2>
            <p className="mt-4 text-[#4A0E2E]/70 leading-relaxed">
              A <strong className="text-[#4A0E2E]">Doce Agrado</strong> nasceu em 2025 como um projeto de casal,
              com o objetivo de fazer trufas artesanais de verdade — sem atalhos, com ingredientes de qualidade
              e atenção a cada detalhe.
            </p>
            <p className="mt-4 text-[#4A0E2E]/70 leading-relaxed">
              Hoje atendemos parceiros em consignado, clientes com pedidos particulares e eventos com kits personalizados.
              Tudo feito com o mesmo cuidado de quando começamos.
            </p>

            <div className="mt-6 inline-flex items-center gap-3 bg-[#FFF9FB] border border-[#D1328C]/15 rounded-2xl px-5 py-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#D1328C]/20 shrink-0">
                <Image src="/img/logo-doce-agrado.png" alt="Doce Agrado" fill className="object-contain p-1" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#4A0E2E]">@doceagrado7</p>
                <p className="text-xs text-[#4A0E2E]/50">Acompanhe no Instagram</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#D1328C] mb-3">
              O que dizem
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#4A0E2E]">
              Quando o produto é bom, ele gira
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {DEPOIMENTOS.map((d) => (
              <div
                key={d.nome}
                className="bg-white rounded-3xl border border-black/6 p-7 shadow-sm"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm text-[#4A0E2E]/80 leading-relaxed italic">
                  "{d.texto}"
                </p>
                <div className="mt-5 pt-4 border-t border-black/5">
                  <p className="text-sm font-bold text-[#4A0E2E]">{d.nome}</p>
                  <p className="text-xs text-[#4A0E2E]/50 mt-0.5">{d.contexto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ──────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white border-y border-black/5">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#D1328C] mb-3">
              Processo
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#4A0E2E]">
              Como começar o consignado
            </h2>
            <p className="mt-3 text-[#4A0E2E]/60 max-w-xl mx-auto">
              Do primeiro contato até o produto no seu balcão — é mais simples do que parece.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Linha conectora */}
            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-px bg-[#D1328C]/20" style={{ left: "16.66%", right: "16.66%" }} />

            {PASSOS.map((p) => (
              <div key={p.n} className="relative text-center bg-[#FFF9FB] rounded-3xl border border-[#D1328C]/10 p-8">
                <div className="w-14 h-14 rounded-2xl bg-[#D1328C] text-white text-xl font-black flex items-center justify-center mx-auto mb-5 shadow-md">
                  {p.n}
                </div>
                <h3 className="text-lg font-black text-[#4A0E2E]">{p.titulo}</h3>
                <p className="mt-2 text-sm text-[#4A0E2E]/60 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <BtnPrimary href={WA_CONSIGNADO} className="text-base py-3.5 px-10">
              Começar agora
            </BtnPrimary>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#D1328C] mb-3">
              Dúvidas
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#4A0E2E]">
              Perguntas frequentes
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ.map((item) => (
              <div
                key={item.q}
                className="bg-white rounded-2xl border border-black/6 px-6 py-5 shadow-sm"
              >
                <p className="font-bold text-[#4A0E2E]">{item.q}</p>
                <p className="mt-2 text-sm text-[#4A0E2E]/70 leading-relaxed">{item.r}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-[#4A0E2E]/50">
            Outra dúvida?{" "}
            <a href={WA_CONSIGNADO} target="_blank" rel="noreferrer" className="text-[#D1328C] font-semibold hover:underline">
              Chame no WhatsApp
            </a>
          </p>
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-[#4A0E2E]">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/20 mx-auto mb-6">
            <Image src="/img/logo-doce-agrado.png" alt="Doce Agrado" fill className="object-contain p-1" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Pronto para começar?
          </h2>
          <p className="mt-4 text-white/70 max-w-lg mx-auto leading-relaxed">
            Chame no WhatsApp agora. Em poucos minutos combinamos os detalhes
            e seu estabelecimento já pode ter nossas trufas no balcão.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={WA_CONSIGNADO}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D1328C] px-8 py-4 text-base font-bold text-white hover:bg-[#b52a79] transition shadow-lg"
            >
              Quero consignado
            </a>
            <a
              href={WA_KITS}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-base font-bold text-white hover:bg-white/15 transition"
            >
              Pedir kits / lembrancinhas
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-black/8 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-[#D1328C]/20">
              <Image src="/img/logo-doce-agrado.png" alt="Doce Agrado" fill className="object-contain p-0.5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#4A0E2E]">Doce Agrado</p>
              <p className="text-xs text-[#4A0E2E]/50">Trufas artesanais</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[#4A0E2E] hover:bg-black/5 transition"
            >
              Instagram
            </a>
            <BtnPrimary href={WA_CONSIGNADO}>
              WhatsApp
            </BtnPrimary>
          </div>
        </div>
        <div className="border-t border-black/5 text-center py-4 text-xs text-[#4A0E2E]/40">
          © {new Date().getFullYear()} Doce Agrado · Todos os direitos reservados
        </div>
      </footer>

    </div>
  );
}
