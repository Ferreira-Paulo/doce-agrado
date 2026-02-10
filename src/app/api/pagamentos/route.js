import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";

function totalEntrega(e) {
  return Number(e.quantidade || 0) * Number(e.valor_unitario || 0);
}
function totalPago(e) {
  return (e.pagamentos || []).reduce((acc, p) => acc + Number(p.valor || 0), 0);
}

export async function POST(req) {
  try {
    const gate = await requireAdmin(req);
    if (!gate.ok) {
      return NextResponse.json({ success: false, error: gate.error }, { status: gate.status });
    }

    const body = await req.json();

    const parceiro = String(body.parceiro || "").toLowerCase().trim(); // username
    const valor = Number(body.valor);
    const data = String(body.data || new Date().toISOString().slice(0, 10));

    if (!parceiro) {
      return NextResponse.json({ success: false, error: "parceiro obrigatório" }, { status: 400 });
    }
    if (!Number.isFinite(valor) || valor <= 0) {
      return NextResponse.json({ success: false, error: "valor inválido" }, { status: 400 });
    }

    // encontra partner por username
    const ps = await adminDb
      .collection("partners")
      .where("username", "==", parceiro)
      .limit(1)
      .get();

    if (ps.empty) {
      return NextResponse.json(
        { success: false, error: `Parceiro não encontrado: ${parceiro}` },
        { status: 404 }
      );
    }

    const uid = ps.docs[0].id;

    // pega entregas mais antigas primeiro (FIFO)
    const delRef = adminDb.collection("partners").doc(uid).collection("deliveries");
    const delSnap = await delRef.orderBy("data", "asc").get();

    let restante = valor;
    let aplicado = 0;
    let entregasAfetadas = 0;

    for (const d of delSnap.docs) {
      if (restante <= 0) break;

      const entrega = d.data();
      const aberto = totalEntrega(entrega) - totalPago(entrega);

      if (aberto <= 0) continue;

      const pagar = Math.min(aberto, restante);

      const pagamentos = Array.isArray(entrega.pagamentos) ? [...entrega.pagamentos] : [];
      pagamentos.push({ valor: pagar, data });

      await d.ref.update({ pagamentos });

      restante -= pagar;
      aplicado += pagar;
      entregasAfetadas += 1;
    }

    if (aplicado === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Nenhuma entrega em aberto para aplicar esse pagamento (ou não existem entregas).",
          debug: { parceiro, deliveries: delSnap.size },
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, aplicado, restante, entregasAfetadas });
  } catch (err) {
    console.error("PAGAMENTOS ROUTE ERROR:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Erro interno" },
      { status: 500 }
    );
  }
}
