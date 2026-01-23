import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "entregas.json");

export async function POST(req) {
  try {
    const body = await req.json();
    const { parceiro, valor, data } = body;

    if (!parceiro || !valor || !data) {
      return new Response(JSON.stringify({ error: "Dados incompletos" }), { status: 400 });
    }

    // Lê o JSON atual
    const fileData = fs.readFileSync(filePath, "utf-8");
    const entregas = JSON.parse(fileData);

    let valorPago = parseFloat(valor);

    const novasEntregas = entregas.map(p => {
      if (p.parceiro !== parceiro) return p;

      const entregasAtualizadas = p.entregas.map(e => {
        const total = e.quantidade * e.valor_unitario;
        const totalPagoEntrega = e.pagamentos.reduce((acc, pay) => acc + pay.valor, 0);
        let saldo = total - totalPagoEntrega;

        if (saldo <= 0 || valorPago <= 0) return e;

        const abatimento = Math.min(valorPago, saldo);
        valorPago -= abatimento;

        return {
          ...e,
          pagamentos: [...e.pagamentos, { valor: abatimento, data }]
        };
      });

      return { ...p, entregas: entregasAtualizadas };
    });

    // Salva novamente no arquivo
    fs.writeFileSync(filePath, JSON.stringify(novasEntregas, null, 2));

    return new Response(JSON.stringify({ success: true, entregas: novasEntregas }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erro ao processar" }), { status: 500 });
  }
}
