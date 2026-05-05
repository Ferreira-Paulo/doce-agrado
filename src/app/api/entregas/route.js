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

function validarItens(itens) {
  if (!Array.isArray(itens) || itens.length === 0) return "itens obrigatório (array não vazio)";
  for (const item of itens) {
    if (!item.sabor || String(item.sabor).trim().length === 0) return "Cada item deve ter um sabor";
    const q = Number(item.quantidade);
    if (!Number.isFinite(q) || q <= 0 || !Number.isInteger(q)) return "Cada item deve ter quantidade inteira positiva";
  }
  return null;
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
    const valor_unitario = Number(body.valor_unitario);
    const data = String(body.data || new Date().toISOString().slice(0, 10));
    const data_validade = body.data_validade ? String(body.data_validade) : null;
    const itens = body.itens;

    if (!parceiro) return NextResponse.json({ success: false, error: "parceiro obrigatório" }, { status: 400 });
    if (!Number.isFinite(valor_unitario) || valor_unitario <= 0) {
      return NextResponse.json({ success: false, error: "valor_unitario deve ser positivo" }, { status: 400 });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      return NextResponse.json({ success: false, error: "data inválida (use YYYY-MM-DD)" }, { status: 400 });
    }
    if (data_validade && !/^\d{4}-\d{2}-\d{2}$/.test(data_validade)) {
      return NextResponse.json({ success: false, error: "data_validade inválida (use YYYY-MM-DD)" }, { status: 400 });
    }

    const erroItens = validarItens(itens);
    if (erroItens) return NextResponse.json({ success: false, error: erroItens }, { status: 400 });

    const uid = await findPartnerUid(parceiro);
    if (!uid) return NextResponse.json({ success: false, error: `Parceiro não encontrado: ${parceiro}` }, { status: 404 });

    const docData = {
      data,
      valor_unitario,
      itens: itens.map((i) => ({ sabor: String(i.sabor).trim(), quantidade: Number(i.quantidade) })),
      pagamentos: [],
      createdAt: new Date().toISOString(),
    };
    if (data_validade) docData.data_validade = data_validade;

    const ref = adminDb.collection("partners").doc(uid).collection("deliveries").doc();
    await ref.set(docData);
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

    const { parceiro, deliveryId, itens, valor_unitario, data, data_validade } = await req.json();

    if (!parceiro || !deliveryId) {
      return NextResponse.json({ success: false, error: "parceiro e deliveryId são obrigatórios" }, { status: 400 });
    }

    const uid = await findPartnerUid(String(parceiro).toLowerCase().trim());
    if (!uid) return NextResponse.json({ success: false, error: `Parceiro não encontrado: ${parceiro}` }, { status: 404 });

    const updates = {};

    if (itens !== undefined) {
      const erroItens = validarItens(itens);
      if (erroItens) return NextResponse.json({ success: false, error: erroItens }, { status: 400 });
      updates.itens = itens.map((i) => ({ sabor: String(i.sabor).trim(), quantidade: Number(i.quantidade) }));
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
    if (data_validade !== undefined) {
      if (data_validade && !/^\d{4}-\d{2}-\d{2}$/.test(String(data_validade))) {
        return NextResponse.json({ success: false, error: "data_validade inválida (use YYYY-MM-DD)" }, { status: 400 });
      }
      updates.data_validade = data_validade || null;
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
