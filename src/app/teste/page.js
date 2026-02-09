import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const PHONE = "5512988199718";

  const WHATSAPP = (text) =>
    `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;

  const WHATSAPP_CONSIGNADO = WHATSAPP(
    "Oi! Quero levar as trufas da Doce Agrado no consignado. Como funciona a reposição e valores?"
  );
  const WHATSAPP_PEDIDO = WHATSAPP(
    "Oi! Quero fazer um pedido particular de trufas (para consumo ou presente). Quais sabores e valores?"
  );
  const WHATSAPP_LEMBRANCINHAS = WHATSAPP(
    "Oi! Quero lembrancinhas/kits para uma data/evento. Quais opções vocês fazem?"
  );

  const INSTAGRAM_LINK = "https://instagram.com/doceagrado7";

  const stats = [
    { label: "Consignado sem risco", value: "Você paga conforme vende" },
    { label: "Pedidos particulares", value: "Sob encomenda" },
    { label: "Datas & eventos", value: "Kits e lembrancinhas" },
  ];

  const pillars = [
    {
      title: "Consignado para estabelecimentos",
      desc: "Para bares, restaurantes, lanchonetes, padarias e mercados: produto de balcão com saída rápida.",
      bullets: [
        "Você paga conforme vende",
        "Reposição combinada (sem complicação)",
        "Aumenta ticket médio no caixa",
      ],
      tag: "Nosso foco principal",
      id: "consignado",
      cta: { label: "Quero consignado", link: WHATSAPP_CONSIGNADO },
    },
    {
      title: "Trufas para consumo (Pedidos particulares)",
      desc: "Quer experimentar, levar para casa ou presentear? Você pede pelo WhatsApp e a gente combina sabores e entrega/retirada.",
      bullets: [
        "Ideal pra matar a vontade",
        "Preço justo + sabor marcante",
        "Perfeito para presentear também",
      ],
      tag: "Pedido do dia a dia",
      id: "pedidos",
      cta: { label: "Quero fazer um pedido", link: WHATSAPP_PEDIDO },
    },
    {
      title: "Lembrancinhas, kits e datas comemorativas",
      desc: "Carnaval, Dia dos Namorados, aniversários, casamentos, Páscoa, Dia das Mães/Pais, Natal, Ano Novo e empresas.",
      bullets: [
        "Kits sob encomenda",
        "Opções personalizadas",
        "Ótimo para eventos e brindes",
      ],
      tag: "Sazonais & eventos",
      id: "datas",
      cta: { label: "Quero lembrancinhas/kits", link: WHATSAPP_LEMBRANCINHAS },
    },
  ];

  const steps = [
    { n: "1", title: "Chame no WhatsApp", desc: "Diga se é consignado, pedido particular ou kits/lembrancinhas." },
    { n: "2", title: "Montamos o formato ideal", desc: "Sabores, quantidade, validade, reposição e entrega." },
    { n: "3", title: "Entrega + acompanhamento", desc: "Consignado com controle simples e reposição combinada." },
  ];

  const testimonials = [
    {
      name: "Parceiro (lanchonete)",
      quote:
        "Colocamos no caixa e começou a girar. Ajuda a aumentar o ticket e não dá trabalho.",
    },
    {
      name: "Cliente",
      quote:
        "Sabor equilibrado e recheio muito bom. Dá vontade de levar mais de um!",
    },
    {
      name: "Eventos/Presente",
      quote:
        "Peguei para lembrancinha e fez sucesso. Bem apresentável e gostoso.",
    },
  ];

  const faq = [
    {
      q: "Como funciona o consignado?",
      a: "Você recebe a quantidade combinada e paga conforme as vendas. A reposição é combinada para manter giro e evitar sobra.",
    },
    {
      q: "Vocês fazem pedidos particulares?",
      a: "Sim! Trabalhamos com pedidos sob encomenda para consumo ou para presentear, mantendo o mesmo padrão de qualidade."
    },
    {
      q: "Fazem lembrancinhas e kits para datas e eventos?",
      a: "Sim! Fazemos kits e lembrancinhas para várias datas e eventos. Quanto antes chamar, melhor para garantir produção e personalização.",
    },
    {
      q: "Como eu peço?",
      a: "Pelo WhatsApp. Em poucos minutos alinhamos o melhor formato para você.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0A09] text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0A09]/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#inicio" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_10px_30px_-12px_rgba(255,255,255,0.18)]">
              <Image
                src="/img/logo-doce-agrado.png"
                alt="Logo Doce Agrado"
                fill
                className="object-contain p-0"
                priority
              />
            </div>

            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide">Doce Agrado</div>
              <div className="text-xs text-white/60">Trufas artesanais • Consignado • Kits</div>
            </div>
          </a>

          <div className="flex items-center gap-2">
            <Link
              href="/parceiro"
              className="inline-flex rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-extrabold text-white hover:bg-white/10"
            >
              Área de Parceiros
            </Link>

            <a
              href={WHATSAPP_CONSIGNADO}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#F6E7D6] to-[#D1328C] px-4 py-2 text-sm font-extrabold text-[#1B120C] hover:opacity-95"
            >
              <span className="hidden sm:inline">Falar no WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="inicio" className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#D1328C]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 right-[-80px] h-[520px] w-[520px] rounded-full bg-[#F6E7D6]/10 blur-3xl" />

        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80">
              <span className="h-2 w-2 rounded-full bg-[#F6E7D6]" />
              Consignado • Pedidos • Lembrancinhas & Kits
            </div>

            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Trufas artesanais para{" "}
              <span className="bg-gradient-to-r from-[#F6E7D6] to-[#D1328C] bg-clip-text text-transparent">
                vender
              </span>
              ,{" "}
              <span className="bg-gradient-to-r from-[#F6E7D6] to-[#D1328C] bg-clip-text text-transparent">
                presentear
              </span>{" "}
              e{" "}
              <span className="bg-gradient-to-r from-[#F6E7D6] to-[#D1328C] bg-clip-text text-transparent">
                se apaixonar
              </span>
              .
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
              A <strong className="text-white">Doce Agrado</strong> faz trufas recheadas com acabamento bonito e sabor marcante.
              Temos 3 formatos: <strong className="text-white">consignado</strong> (nosso foco),{" "}
              <strong className="text-white">pedidos particulares</strong> e{" "}
              <strong className="text-white">kits/lembrancinhas</strong> para datas e eventos.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={WHATSAPP_CONSIGNADO}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#F6E7D6] to-[#D1328C] px-7 py-3 text-sm font-extrabold text-[#1B120C] hover:opacity-95"
              >
                Quero consignado
              </a>
              <a
                href={WHATSAPP_PEDIDO}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-7 py-3 text-sm font-bold text-white/90 hover:bg-white/10"
              >
                Fazer pedido particular
              </a>
              <a
                href={WHATSAPP_LEMBRANCINHAS}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-7 py-3 text-sm font-bold text-white/90 hover:bg-white/10"
              >
                Lembrancinhas / Kits
              </a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {stats.map((s) => (
                <div key={s.label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs font-semibold text-white/60">{s.label}</div>
                  <div className="mt-1 text-sm font-extrabold text-white">{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* “Imagem”/mock premium */}
          <div className="relative">
            <div className="rounded-[28px] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-[0_25px_80px_-30px_rgba(0,0,0,0.8)]">
              <div className="flex items-center justify-between">
                <div className="text-sm font-extrabold">Doce Agrado</div>
                <div className="text-xs text-white/60">Trufas artesanais</div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="aspect-[4/3] rounded-2xl bg-white/10 ring-1 ring-white/10" />
                <div className="aspect-[4/3] rounded-2xl bg-white/10 ring-1 ring-white/10" />
                <div className="aspect-[4/3] rounded-2xl bg-white/10 ring-1 ring-white/10" />
                <div className="aspect-[4/3] rounded-2xl bg-white/10 ring-1 ring-white/10" />
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-[#0B0A09]/50 p-4">
                <div className="text-sm font-extrabold">3 formas de pedir</div>
                <div className="mt-1 text-sm text-white/70">
                  Consignado • Pedido particular • Kits & lembrancinhas
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                  <div className="text-xs text-white/60">Consignado</div>
                  <div className="mt-1 text-sm font-bold">No caixa/balcão, alto giro</div>
                </div>
                <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                  <div className="text-xs text-white/60">Datas</div>
                  <div className="mt-1 text-sm font-bold">Eventos, brindes e kits</div>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#F6E7D6]/10 blur-2xl" />
          </div>
        </div>
      </section>

      {/* QUEM SOMOS */}
      <section id="quem-somos" className="border-t border-white/10 bg-[#0B0A09]">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            {/* Texto */}
            <div>
              <h2 className="text-2xl font-black md:text-4xl">Quem somos</h2>

              <p className="mt-4 text-base leading-relaxed text-white/70">
                A <strong className="text-white">Doce Agrado</strong> é um projeto criado por{" "}
                <strong className="text-white">Paulo e Lyvia</strong>, um casal junto há 8 anos.
                Começamos em 2025 como uma renda extra e hoje levamos trufas artesanais para clientes e
                parceiros que valorizam qualidade.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/70">
                Não trabalhamos com atalhos: usamos <strong className="text-white">produtos de qualidade</strong>,{" "}
                <strong className="text-white">fruta de verdade</strong> e focamos em sabor, apresentação e confiança —
                seja no <strong className="text-white">consignado</strong>, em{" "}
                <strong className="text-white">pedidos particulares</strong> ou em{" "}
                <strong className="text-white">kits para datas especiais</strong>.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={WHATSAPP_PEDIDO}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-extrabold text-white hover:bg-white/10"
                >
                  Fazer pedido particular
                </a>
                <a
                  href={WHATSAPP_CONSIGNADO}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#F6E7D6] to-[#D1328C] px-6 py-3 text-sm font-extrabold text-[#1B120C] hover:opacity-95"
                >
                  Quero consignado
                </a>
              </div>
            </div>

            {/* Fotos (placeholders) */}
            <div className="relative">
              <div className="rounded-[28px] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-4 shadow-[0_25px_80px_-40px_rgba(0,0,0,0.8)]">
                <div className="grid grid-cols-2 gap-3">
                  <div className="aspect-[4/5] rounded-2xl bg-white/10 ring-1 ring-white/10" />
                  <div className="aspect-[4/5] rounded-2xl bg-white/10 ring-1 ring-white/10" />
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-[#0B0A09]/50 p-4">
                  <div className="text-sm font-extrabold">Paulo & Lyvia</div>
                  <div className="text-sm text-white/70">Criadores da Doce Agrado</div>
                </div>
              </div>

              <div className="pointer-events-none absolute -left-8 -bottom-8 h-40 w-40 rounded-full bg-[#D1328C]/20 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* PILARES */}
      <section className="border-t border-white/10 bg-[#0B0A09]">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-black md:text-4xl">Tudo que a Doce Agrado oferece</h2>
          <p className="mt-3 max-w-3xl text-white/70">
            Escolha o objetivo (consignado, pedido particular ou lembrancinhas). A gente cuida do restante.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {pillars.map((c) => (
              <div
                id={c.id}
                key={c.title}
                className="group rounded-[28px] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-[0_25px_70px_-40px_rgba(0,0,0,0.85)] transition hover:-translate-y-1 hover:border-white/20"
              >
                <div className="mb-3 inline-flex w-fit rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                  {c.tag}
                </div>
                <div className="text-lg font-extrabold md:text-xl">{c.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{c.desc}</p>

                <ul className="mt-5 space-y-2 text-sm text-white/80">
                  {c.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#F6E7D6]" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={c.cta.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-white/10 px-5 py-3 text-sm font-extrabold text-white ring-1 ring-white/10 transition hover:bg-white/15"
                >
                  {c.cta.label}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROVA SOCIAL */}
      <section className="border-t border-white/10 bg-gradient-to-b from-[#0B0A09] to-[#0F0D0B]">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-black md:text-4xl">Quando o produto é bom, ele gira.</h2>
              <p className="mt-3 max-w-3xl text-white/70">
                Sabor + apresentação + facilidade. Seja no consignado, no pedido particular ou em lembrancinhas.
              </p>
            </div>
            <a
              href={WHATSAPP_CONSIGNADO}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#F6E7D6] to-[#D1328C] px-6 py-3 text-sm font-extrabold text-[#1B120C] hover:opacity-95"
            >
              Quero consignado
            </a>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.85)]"
              >
                <div className="text-sm font-bold text-white">{t.name}</div>
                <p className="mt-3 text-sm leading-relaxed text-white/70">“{t.quote}”</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="border-t border-white/10 bg-[#0B0A09]">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-black md:text-4xl">Como funciona</h2>
          <p className="mt-3 max-w-3xl text-white/70">
            Processo simples — do primeiro contato até a reposição (ou a entrega do seu pedido).
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.n}
                className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.85)]"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F6E7D6] to-[#D1328C] text-sm font-black text-[#1B120C]">
                  {s.n}
                </div>
                <div className="text-lg font-extrabold">{s.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-[28px] border border-white/10 bg-gradient-to-r from-white/10 to-white/5 p-6 shadow-[0_25px_80px_-50px_rgba(0,0,0,0.9)] md:p-8">
            <div className="grid gap-6 md:grid-cols-[1.6fr_1fr] md:items-center">
              <div>
                <div className="text-xl font-black md:text-2xl">Quer falar com a gente agora?</div>
                <p className="mt-2 text-white/70">
                  Escolha o assunto e a gente já te atende no WhatsApp.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <a
                  href={WHATSAPP_CONSIGNADO}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#F6E7D6] to-[#D1328C] px-6 py-3 text-sm font-extrabold text-[#1B120C] hover:opacity-95"
                >
                  Consignado
                </a>
                <div className="grid gap-3 sm:grid-cols-2">
                  <a
                    href={WHATSAPP_PEDIDO}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-extrabold text-white hover:bg-white/10"
                  >
                    Pedido particular
                  </a>
                  <a
                    href={WHATSAPP_LEMBRANCINHAS}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-extrabold text-white hover:bg-white/10"
                  >
                    Kits / Lembrancinhas
                  </a>
                </div>
                <a
                  href={INSTAGRAM_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-extrabold text-white hover:bg-white/10"
                >
                  Ver Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-white/10 bg-[#0F0D0B]">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-black md:text-4xl">Dúvidas frequentes</h2>
          <p className="mt-3 max-w-3xl text-white/70">Se preferir, chama no WhatsApp e a gente te orienta.</p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {faq.map((item) => (
              <div
                key={item.q}
                className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.85)]"
              >
                <div className="text-base font-extrabold">{item.q}</div>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#0B0A09]">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <a href="#inicio" className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_10px_30px_-12px_rgba(255,255,255,0.18)]">
                  <Image
                    src="/img/logo-doce-agrado.png"
                    alt="Logo Doce Agrado"
                    fill
                    className="object-contain p-0"
                    priority
                  />
                </div>

                <div className="leading-tight">
                  <div className="text-sm font-semibold tracking-wide">Doce Agrado</div>
                  <div className="text-xs text-white/60">
                    Trufas artesanais • Consignado • Kits
                  </div>
                </div>
              </a>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-extrabold text-white hover:bg-white/10"
              >
                Instagram
              </a>
              <a
                href={WHATSAPP_CONSIGNADO}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#F6E7D6] to-[#D1328C] px-5 py-3 text-sm font-extrabold text-[#1B120C] hover:opacity-95"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div className="mt-8 text-xs text-white/40">
            © {new Date().getFullYear()} Doce Agrado. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
