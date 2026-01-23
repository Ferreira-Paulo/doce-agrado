import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "entregas.json");

export async function POST(req) {
  try {
    const body = await req.json();
    const { parceiro, data, quantidade, valor_unitario } = body;

    console.log("Dados recebidos:", body);

    if (!parceiro || !data || !quantidade || !valor_unitario) {
      return new Response(JSON.stringify({ error: "Dados incompletos" }), { status: 400 });
    }

    // Lê o JSON atual
    const fileData = fs.readFileSync(filePath, "utf-8");
    const entregas = JSON.parse(fileData);

    let parceiroExiste = false;

    const novasEntregas = entregas.map(p => {
      if (p.parceiro === parceiro) {
        parceiroExiste = true;
        return {
          ...p,
          entregas: [
            ...p.entregas,
            { data: data, quantidade, valor_unitario, pagamentos: [] }
          ]
        };
      }
      return p;
    });

    // Se o parceiro não existe ainda, cria um novo registro
    if (!parceiroExiste) {
      novasEntregas.push({
        parceiro,
        entregas: [
          { data: data, quantidade, valor_unitario, pagamentos: [] }
        ]
      });
    }

    // Salva o JSON atualizado
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
