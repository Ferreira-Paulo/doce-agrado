import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { calcEntrega } from "@/components/utils/calc";

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

    const delRef = adminDb.collection("partners").doc(uid).collection("deliveries");

    let aplicado = 0;
    let restante = valor;
    let entregasAfetadas = 0;

    // Transação garante consistência: sem race condition se dois pagamentos chegarem ao mesmo tempo
    await adminDb.runTransaction(async (t) => {
      aplicado = 0;
      restante = valor;
      entregasAfetadas = 0;

      const delSnap = await t.get(delRef.orderBy("data", "asc"));

      // Coleta writes separados para respeitar a regra reads-before-writes do Firestore
      const pendingWrites = [];

      for (const d of delSnap.docs) {
        if (restante <= 0) break;

        const entrega = d.data();
        const { saldo: aberto } = calcEntrega(entrega);

        if (aberto <= 0) continue;

        const pagar = Math.min(aberto, restante);
        const pagamentos = Array.isArray(entrega.pagamentos) ? [...entrega.pagamentos] : [];
        pagamentos.push({ valor: pagar, data });

        pendingWrites.push({ ref: d.ref, pagamentos });
        restante -= pagar;
        aplicado += pagar;
        entregasAfetadas += 1;
      }

      for (const { ref, pagamentos } of pendingWrites) {
        t.update(ref, { pagamentos });
      }
    });

    if (aplicado === 0) {
      return NextResponse.json(
        { success: false, error: "Nenhuma entrega em aberto para aplicar esse pagamento." },
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

export async function PATCH(req) {
  try {
    const gate = await requireAdmin(req);
    if (!gate.ok) return NextResponse.json({ success: false, error: gate.error }, { status: gate.status });

    const body = await req.json();
    const parceiro = String(body.parceiro || "").toLowerCase().trim();
    const { deliveryId, index } = body;
    const valor = Number(body.valor);
    const data = String(body.data || "");

    if (!parceiro || !deliveryId || typeof index !== "number") {
      return NextResponse.json({ success: false, error: "parceiro, deliveryId e index são obrigatórios" }, { status: 400 });
    }
    if (!Number.isFinite(valor) || valor <= 0) {
      return NextResponse.json({ success: false, error: "valor inválido" }, { status: 400 });
    }

    const ps = await adminDb.collection("partners").where("username", "==", parceiro).limit(1).get();
    if (ps.empty) return NextResponse.json({ success: false, error: `Parceiro não encontrado: ${parceiro}` }, { status: 404 });
    const uid = ps.docs[0].id;

    const delRef = adminDb.collection("partners").doc(uid).collection("deliveries").doc(deliveryId);
    const delSnap = await delRef.get();
    if (!delSnap.exists) return NextResponse.json({ success: false, error: "Entrega não encontrada" }, { status: 404 });

    const pagamentos = Array.isArray(delSnap.data().pagamentos) ? [...delSnap.data().pagamentos] : [];
    if (index < 0 || index >= pagamentos.length) {
      return NextResponse.json({ success: false, error: "Índice de pagamento inválido" }, { status: 400 });
    }

    pagamentos[index] = { valor, data };
    await delRef.update({ pagamentos });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PAGAMENTOS PATCH ERROR:", err);
    return NextResponse.json({ success: false, error: err?.message || "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const gate = await requireAdmin(req);
    if (!gate.ok) return NextResponse.json({ success: false, error: gate.error }, { status: gate.status });

    const body = await req.json();
    const parceiro = String(body.parceiro || "").toLowerCase().trim();
    const { deliveryId, index } = body;

    if (!parceiro || !deliveryId || typeof index !== "number") {
      return NextResponse.json({ success: false, error: "parceiro, deliveryId e index são obrigatórios" }, { status: 400 });
    }

    const ps = await adminDb.collection("partners").where("username", "==", parceiro).limit(1).get();
    if (ps.empty) return NextResponse.json({ success: false, error: `Parceiro não encontrado: ${parceiro}` }, { status: 404 });
    const uid = ps.docs[0].id;

    const delRef = adminDb.collection("partners").doc(uid).collection("deliveries").doc(deliveryId);
    const delSnap = await delRef.get();
    if (!delSnap.exists) return NextResponse.json({ success: false, error: "Entrega não encontrada" }, { status: 404 });

    const pagamentos = Array.isArray(delSnap.data().pagamentos) ? [...delSnap.data().pagamentos] : [];
    if (index < 0 || index >= pagamentos.length) {
      return NextResponse.json({ success: false, error: "Índice de pagamento inválido" }, { status: 400 });
    }

    pagamentos.splice(index, 1);
    await delRef.update({ pagamentos });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PAGAMENTOS DELETE ERROR:", err);
    return NextResponse.json({ success: false, error: err?.message || "Erro interno" }, { status: 500 });
  }
}
