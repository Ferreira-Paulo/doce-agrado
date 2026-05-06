import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { FieldValue } from "firebase-admin/firestore";

const UNIDADES_VALIDAS = ["g", "kg", "ml", "L", "un"];

export async function GET(req) {
  try {
    const gate = await requireAdmin(req);
    if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

    const snap = await adminDb.collection("ingredientes").get();
    const ingredientes = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    ingredientes.sort((a, b) => String(a.nome).localeCompare(String(b.nome)));
    return NextResponse.json(ingredientes);
  } catch (err) {
    return NextResponse.json({ error: err?.message || "Erro interno" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const gate = await requireAdmin(req);
    if (!gate.ok) return NextResponse.json({ success: false, error: gate.error }, { status: gate.status });

    const { nome, unidade, estoque_minimo } = await req.json();
    const nomeClean = String(nome || "").trim();
    if (nomeClean.length < 2) {
      return NextResponse.json({ success: false, error: "Nome deve ter pelo menos 2 caracteres" }, { status: 400 });
    }
    if (!UNIDADES_VALIDAS.includes(unidade)) {
      return NextResponse.json({ success: false, error: `Unidade inválida. Use: ${UNIDADES_VALIDAS.join(", ")}` }, { status: 400 });
    }
    const minimo = Number(estoque_minimo ?? 0);
    if (!Number.isFinite(minimo) || minimo < 0) {
      return NextResponse.json({ success: false, error: "Estoque mínimo deve ser >= 0" }, { status: 400 });
    }

    const ref = adminDb.collection("ingredientes").doc();
    await ref.set({
      nome: nomeClean,
      unidade,
      estoque: 0,
      estoque_minimo: minimo,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ success: true, id: ref.id });
  } catch (err) {
    return NextResponse.json({ success: false, error: err?.message || "Erro interno" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const gate = await requireAdmin(req);
    if (!gate.ok) return NextResponse.json({ success: false, error: gate.error }, { status: gate.status });

    const { id, nome, unidade, estoque_minimo, estoque } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: "id obrigatório" }, { status: 400 });

    const updates = {};
    if (nome !== undefined) {
      const nomeClean = String(nome).trim();
      if (nomeClean.length < 2) return NextResponse.json({ success: false, error: "Nome inválido" }, { status: 400 });
      updates.nome = nomeClean;
    }
    if (unidade !== undefined) {
      if (!UNIDADES_VALIDAS.includes(unidade)) {
        return NextResponse.json({ success: false, error: `Unidade inválida. Use: ${UNIDADES_VALIDAS.join(", ")}` }, { status: 400 });
      }
      updates.unidade = unidade;
    }
    if (estoque_minimo !== undefined) {
      const m = Number(estoque_minimo);
      if (!Number.isFinite(m) || m < 0) return NextResponse.json({ success: false, error: "Estoque mínimo inválido" }, { status: 400 });
      updates.estoque_minimo = m;
    }
    if (estoque !== undefined) {
      const e = Number(estoque);
      if (!Number.isFinite(e) || e < 0) return NextResponse.json({ success: false, error: "Estoque inválido" }, { status: 400 });
      updates.estoque = e;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, error: "Nada para atualizar" }, { status: 400 });
    }

    await adminDb.collection("ingredientes").doc(id).update(updates);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err?.message || "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const gate = await requireAdmin(req);
    if (!gate.ok) return NextResponse.json({ success: false, error: gate.error }, { status: gate.status });

    const { id } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: "id obrigatório" }, { status: 400 });

    await adminDb.collection("ingredientes").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err?.message || "Erro interno" }, { status: 500 });
  }
}
