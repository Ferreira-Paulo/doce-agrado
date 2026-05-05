import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function GET(req) {
  try {
    const gate = await requireAdmin(req);
    if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

    const snap = await adminDb.collection("sabores").get();
    const sabores = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    sabores.sort((a, b) => String(a.nome).localeCompare(String(b.nome)));
    return NextResponse.json(sabores);
  } catch (err) {
    return NextResponse.json({ error: err?.message || "Erro interno" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const gate = await requireAdmin(req);
    if (!gate.ok) return NextResponse.json({ success: false, error: gate.error }, { status: gate.status });

    const { nome } = await req.json();
    const nomeClean = String(nome || "").trim();
    if (nomeClean.length < 2) {
      return NextResponse.json({ success: false, error: "Nome deve ter pelo menos 2 caracteres" }, { status: 400 });
    }

    const ref = adminDb.collection("sabores").doc();
    await ref.set({ nome: nomeClean, ativo: true, createdAt: new Date().toISOString() });
    return NextResponse.json({ success: true, id: ref.id, nome: nomeClean });
  } catch (err) {
    return NextResponse.json({ success: false, error: err?.message || "Erro interno" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const gate = await requireAdmin(req);
    if (!gate.ok) return NextResponse.json({ success: false, error: gate.error }, { status: gate.status });

    const { id, nome, ativo } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: "id obrigatório" }, { status: 400 });

    const updates = {};
    if (nome !== undefined) {
      const nomeClean = String(nome).trim();
      if (nomeClean.length < 2) return NextResponse.json({ success: false, error: "Nome inválido" }, { status: 400 });
      updates.nome = nomeClean;
    }
    if (ativo !== undefined) updates.ativo = Boolean(ativo);

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, error: "Nada para atualizar" }, { status: 400 });
    }

    await adminDb.collection("sabores").doc(id).update(updates);
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

    await adminDb.collection("sabores").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err?.message || "Erro interno" }, { status: 500 });
  }
}
