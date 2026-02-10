import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { FieldValue } from "firebase-admin/firestore";

function normalizeEntrega(e) {
  return {
    id: e.id || `ent_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    data: String(e.data || "").slice(0, 10), // YYYY-MM-DD
    quantidade: Number(e.quantidade || 0),
    valor_unitario: Number(e.valor_unitario || 0),
    pagamentos: Array.isArray(e.pagamentos) ? e.pagamentos : [],
    observacoes: e.observacoes ? String(e.observacoes) : "",
  };
}

export async function GET(req) {
  try {
    const gate = await requireAdmin(req);
    if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

    const ps = await adminDb.collection("partners").get();
    const out = [];

    for (const p of ps.docs) {
      const partner = p.data();
      const parceiro = String(partner.username || p.id);

      const delSnap = await adminDb
        .collection("partners")
        .doc(p.id)
        .collection("deliveries")
        .get();

      const entregas = delSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

      out.push({ parceiro, entregas });
    }

    out.sort((a, b) => a.parceiro.localeCompare(b.parceiro));
    return NextResponse.json(out);
  } catch (err) {
    console.error("ENTREGAS GET ERROR:", err);
    return NextResponse.json({ error: err?.message || "Erro interno" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const gate = await requireAdmin(req);
    if (!gate.ok) return NextResponse.json({ success: false, error: gate.error }, { status: gate.status });

    const body = await req.json();

    const parceiro = String(body.parceiro || "").toLowerCase().trim(); // "fini"
    const quantidade = Number(body.quantidade);
    const valor_unitario = Number(body.valor_unitario);
    const data = String(body.data || new Date().toISOString().slice(0, 10));

    if (!parceiro) return NextResponse.json({ success: false, error: "parceiro obrigatório" }, { status: 400 });

    // 1) achar o UID do parceiro (doc em partners)
    const ps = await adminDb.collection("partners").where("username", "==", parceiro).limit(1).get();
    if (ps.empty) {
      return NextResponse.json({ success: false, error: `Parceiro não encontrado: ${parceiro}` }, { status: 404 });
    }
    const uid = ps.docs[0].id;

    // 2) criar a entrega dentro do parceiro
    const ref = adminDb.collection("partners").doc(uid).collection("deliveries").doc();

    await ref.set({
      data,
      quantidade,
      valor_unitario,
      pagamentos: [],        // começa vazio
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id: ref.id });
  } catch (err) {
    console.error("ENTREGAS POST ERROR:", err);
    return NextResponse.json({ success: false, error: err?.message || "Erro interno" }, { status: 500 });
  }
}
