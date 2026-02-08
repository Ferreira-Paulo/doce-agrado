import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "entregas.json");

export async function GET() {
  try {
    // Se o arquivo não existir ainda, devolve lista vazia
    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const fileData = fs.readFileSync(filePath, "utf-8");
    const entregas = fileData ? JSON.parse(fileData) : [];

    return new Response(JSON.stringify(entregas), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Erro no GET /api/entregas:", err);
    return new Response(JSON.stringify({ error: "Erro ao ler entregas" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

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

    const novasEntregas = entregas.map((p) => {
      if (p.parceiro === parceiro) {
        parceiroExiste = true;
        return {
          ...p,
          entregas: [
            ...p.entregas,
            { data, quantidade, valor_unitario, pagamentos: [] },
          ],
        };
      }
      return p;
    });

    // Se o parceiro não existe ainda, cria um novo registro
    if (!parceiroExiste) {
      novasEntregas.push({
        parceiro,
        entregas: [{ data, quantidade, valor_unitario, pagamentos: [] }],
      });
    }

    // Salva o JSON atualizado
    fs.writeFileSync(filePath, JSON.stringify(novasEntregas, null, 2));

    return new Response(JSON.stringify({ success: true, entregas: novasEntregas }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erro ao processar" }), { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { parceiro, entregaIndex, patch } = body;

    if (!parceiro && parceiro !== "") {
      return new Response(JSON.stringify({ error: "Parceiro obrigatório" }), { status: 400 });
    }
    if (entregaIndex === undefined || entregaIndex === null) {
      return new Response(JSON.stringify({ error: "entregaIndex obrigatório" }), { status: 400 });
    }
    if (!patch || typeof patch !== "object") {
      return new Response(JSON.stringify({ error: "patch obrigatório" }), { status: 400 });
    }

    const fileData = fs.readFileSync(filePath, "utf-8");
    const entregas = JSON.parse(fileData);

    const idxParceiro = entregas.findIndex((p) => p.parceiro === parceiro);
    if (idxParceiro < 0) {
      return new Response(JSON.stringify({ error: "Parceiro não encontrado" }), { status: 404 });
    }

    const lista = entregas[idxParceiro].entregas || [];
    if (!lista[entregaIndex]) {
      return new Response(JSON.stringify({ error: "Entrega não encontrada" }), { status: 404 });
    }

    // aplica patch (mantém pagamentos)
    lista[entregaIndex] = {
      ...lista[entregaIndex],
      ...patch,
      pagamentos: lista[entregaIndex].pagamentos || [],
    };

    entregas[idxParceiro].entregas = lista;

    fs.writeFileSync(filePath, JSON.stringify(entregas, null, 2));

    return new Response(JSON.stringify({ success: true, entregas }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erro ao editar entrega" }), { status: 500 });
  }
}
