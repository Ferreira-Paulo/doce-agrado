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


    // <div className="min-h-screen flex flex-col bg-background text-foreground">
    //   <Header />

    //   <main className="flex-1">
    //     {/* HERO */}
    //     <section className="relative overflow-hidden bg-gradient-to-br from-white via-purple-50 to-pink-50 py-20 md:py-32">
    //       <div className="container grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    //         {/* Texto */}
    //         <div className="space-y-6">
    //           <span className="text-primary font-semibold text-sm">
    //             BEM-VINDO À DOCE AGRADO
    //           </span>

    //           <h1 className="text-5xl md:text-6xl font-bold">
    //             Trufas Artesanais de Luxo
    //           </h1>

    //           <p className="text-lg text-foreground/70 max-w-lg">
    //             Cada trufa é uma obra de arte criada com ingredientes premium
    //             e paixão. Descubra o sabor sofisticado que transforma momentos
    //             especiais em memórias inesquecíveis.
    //           </p>

    //           <div className="flex gap-4 pt-4">
    //             <Button size="lg">Conheça Nossos Sabores</Button>
    //             <Button size="lg" variant="outline">
    //               Seja um Parceiro
    //             </Button>
    //           </div>
    //         </div>

    //         {/* Imagem */}
    //         <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
    //           <img
    //             src="/images/hero-trufa.jpg"
    //             alt="Trufas Artesanais"
    //             className="w-full h-full object-cover"
    //           />
    //         </div>
    //       </div>
    //     </section>

    //     {/* SOBRE */}
    //     <section id="sobre" className="py-20 bg-white">
    //       <div className="container grid md:grid-cols-3 gap-8">
    //         {[
    //           {
    //             icon: Sparkles,
    //             title: "Ingredientes Premium",
    //             desc: "Chocolate selecionado e ingredientes de alta qualidade.",
    //           },
    //           {
    //             icon: Heart,
    //             title: "Feito com Paixão",
    //             desc: "Cada trufa é feita manualmente.",
    //           },
    //           {
    //             icon: Package,
    //             title: "Parceria Inteligente",
    //             desc: "Modelo de consignação sem risco.",
    //           },
    //         ].map((item, i) => (
    //           <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
    //             <CardHeader className="space-y-2">
    //               <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
    //                 <item.icon className="w-6 h-6 text-primary" />
    //               </div>
    //               <CardTitle>{item.title}</CardTitle>
    //             </CardHeader>
    //             <CardContent>{item.desc}</CardContent>
    //           </Card>
    //         ))}
    //       </div>
    //     </section>

    //     {/* PROGRAMA DE PARCERIA */}
    //     <section id="parceria" className="py-20 bg-purple-50">
    //       <div className="container grid md:grid-cols-2 gap-12 items-center">
    //         <div className="space-y-6">
    //           <h2 className="text-4xl font-bold">Programa de Parceria</h2>
    //           <p className="text-foreground/70">
    //             Traga as delícias da Doce Agrado para seu estabelecimento através do nosso modelo de consignação.
    //           </p>

    //           <ul className="list-decimal list-inside text-foreground/70 space-y-2">
    //             <li>Receba as trufas em consignação, sem custo inicial</li>
    //             <li>Venda para seus clientes com margem atrativa</li>
    //             <li>Reponha o estoque conforme necessário</li>
    //             <li>Receba suporte e materiais de marketing</li>
    //           </ul>

    //           <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
    //             Quero Ser Parceiro
    //           </Button>
    //         </div>

    //         <div className="h-96 rounded-2xl overflow-hidden shadow-2xl">
    //           <img
    //             src="/images/parceria-background.jpg"
    //             alt="Programa de Parceria"
    //             className="w-full h-full object-cover"
    //           />
    //         </div>
    //       </div>
    //     </section>

    //     {/* CONTATO */}
    //     <section id="contato" className="py-20 bg-white">
    //       <div className="container max-w-3xl">
    //         <h2 className="text-4xl font-bold text-center mb-8">Entre em Contato</h2>
    //         <form onSubmit={handleSubmit} className="space-y-4">
    //           <div className="grid md:grid-cols-2 gap-4">
    //             <Input
    //               name="name"
    //               placeholder="Nome"
    //               value={formData.name}
    //               onChange={handleInputChange}
    //               required
    //             />
    //             <Input
    //               name="email"
    //               placeholder="Email"
    //               value={formData.email}
    //               onChange={handleInputChange}
    //               required
    //             />
    //           </div>

    //           <div className="grid md:grid-cols-2 gap-4">
    //             <Input
    //               name="phone"
    //               placeholder="Telefone"
    //               value={formData.phone}
    //               onChange={handleInputChange}
    //             />
    //             <Input
    //               name="business"
    //               placeholder="Tipo de Negócio"
    //               value={formData.business}
    //               onChange={handleInputChange}
    //             />
    //           </div>

    //           <Textarea
    //             name="message"
    //             placeholder="Mensagem"
    //             value={formData.message}
    //             onChange={handleInputChange}
    //             required
    //             rows={5}
    //           />

    //           <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90">
    //             Enviar Mensagem
    //           </Button>
    //         </form>
    //       </div>
    //     </section>
    //   </main>

    //   <Footer />
    // </div>
  );
}
