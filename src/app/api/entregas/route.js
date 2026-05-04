import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";

async function findPartnerUid(parceiro) {
  const ps = await adminDb
    .collection("partners")
    .where("username", "==", parceiro)
    .limit(1)
    .get();
  return ps.empty ? null : ps.docs[0].id;
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
    const parceiro = String(body.parceiro || "").toLowerCase().trim();
    const quantidade = Number(body.quantidade);
    const valor_unitario = Number(body.valor_unitario);
    const data = String(body.data || new Date().toISOString().slice(0, 10));

    if (!parceiro) return NextResponse.json({ success: false, error: "parceiro obrigatório" }, { status: 400 });
    if (!Number.isFinite(quantidade) || quantidade <= 0 || !Number.isInteger(quantidade)) {
      return NextResponse.json({ success: false, error: "quantidade deve ser um inteiro positivo" }, { status: 400 });
    }
    if (!Number.isFinite(valor_unitario) || valor_unitario <= 0) {
      return NextResponse.json({ success: false, error: "valor_unitario deve ser positivo" }, { status: 400 });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      return NextResponse.json({ success: false, error: "data inválida (use YYYY-MM-DD)" }, { status: 400 });
    }

    const uid = await findPartnerUid(parceiro);
    if (!uid) return NextResponse.json({ success: false, error: `Parceiro não encontrado: ${parceiro}` }, { status: 404 });

    const ref = adminDb.collection("partners").doc(uid).collection("deliveries").doc();
    await ref.set({ data, quantidade, valor_unitario, pagamentos: [], createdAt: new Date().toISOString() });

    return NextResponse.json({ success: true, id: ref.id });
  } catch (err) {
    console.error("ENTREGAS POST ERROR:", err);
    return NextResponse.json({ success: false, error: err?.message || "Erro interno" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const gate = await requireAdmin(req);
    if (!gate.ok) return NextResponse.json({ success: false, error: gate.error }, { status: gate.status });

    const { parceiro, deliveryId, quantidade, valor_unitario, data } = await req.json();

    if (!parceiro || !deliveryId) {
      return NextResponse.json({ success: false, error: "parceiro e deliveryId são obrigatórios" }, { status: 400 });
    }

    const uid = await findPartnerUid(String(parceiro).toLowerCase().trim());
    if (!uid) return NextResponse.json({ success: false, error: `Parceiro não encontrado: ${parceiro}` }, { status: 404 });

    const updates = {};
    if (quantidade !== undefined) {
      const q = Number(quantidade);
      if (!Number.isFinite(q) || q <= 0 || !Number.isInteger(q)) {
        return NextResponse.json({ success: false, error: "quantidade deve ser um inteiro positivo" }, { status: 400 });
      }
      updates.quantidade = q;
    }
    if (valor_unitario !== undefined) {
      const v = Number(valor_unitario);
      if (!Number.isFinite(v) || v <= 0) {
        return NextResponse.json({ success: false, error: "valor_unitario deve ser positivo" }, { status: 400 });
      }
      updates.valor_unitario = v;
    }
    if (data !== undefined) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data))) {
        return NextResponse.json({ success: false, error: "data inválida (use YYYY-MM-DD)" }, { status: 400 });
      }
      updates.data = String(data);
    }

    await adminDb.collection("partners").doc(uid).collection("deliveries").doc(deliveryId).update(updates);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("ENTREGAS PATCH ERROR:", err);
    return NextResponse.json({ success: false, error: err?.message || "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const gate = await requireAdmin(req);
    if (!gate.ok) return NextResponse.json({ success: false, error: gate.error }, { status: gate.status });

    const { parceiro, deliveryId } = await req.json();

    if (!parceiro || !deliveryId) {
      return NextResponse.json({ success: false, error: "parceiro e deliveryId são obrigatórios" }, { status: 400 });
    }

    const uid = await findPartnerUid(String(parceiro).toLowerCase().trim());
    if (!uid) return NextResponse.json({ success: false, error: `Parceiro não encontrado: ${parceiro}` }, { status: 404 });

    await adminDb.collection("partners").doc(uid).collection("deliveries").doc(deliveryId).delete();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("ENTREGAS DELETE ERROR:", err);
    return NextResponse.json({ success: false, error: err?.message || "Erro interno" }, { status: 500 });
  }
}
