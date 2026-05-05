import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function GET(req) {
  try {
    const gate = await requireAdmin(req);
    if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

    const snap = await adminDb.collection("gastos").orderBy("data", "desc").get();
    const gastos = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json(gastos);
  } catch (err) {
    console.error("GASTOS GET ERROR:", err);
    return NextResponse.json({ error: err?.message || "Erro interno" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const gate = await requireAdmin(req);
    if (!gate.ok) return NextResponse.json({ success: false, error: gate.error }, { status: gate.status });

    const { data, categoria, descricao, valor } = await req.json();

    if (!data || !/^\d{4}-\d{2}-\d{2}$/.test(String(data))) {
      return NextResponse.json({ success: false, error: "Data inválida (use YYYY-MM-DD)" }, { status: 400 });
    }
    if (!categoria || String(categoria).trim().length === 0) {
      return NextResponse.json({ success: false, error: "Categoria obrigatória" }, { status: 400 });
    }
    if (!descricao || String(descricao).trim().length === 0) {
      return NextResponse.json({ success: false, error: "Descrição obrigatória" }, { status: 400 });
    }
    const v = Number(valor);
    if (!Number.isFinite(v) || v <= 0) {
      return NextResponse.json({ success: false, error: "Valor deve ser positivo" }, { status: 400 });
    }

    const ref = adminDb.collection("gastos").doc();
    await ref.set({
      data: String(data),
      categoria: String(categoria).trim(),
      descricao: String(descricao).trim(),
      valor: v,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id: ref.id });
  } catch (err) {
    console.error("GASTOS POST ERROR:", err);
    return NextResponse.json({ success: false, error: err?.message || "Erro interno" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const gate = await requireAdmin(req);
    if (!gate.ok) return NextResponse.json({ success: false, error: gate.error }, { status: gate.status });

    const { id, data, categoria, descricao, valor } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: "id obrigatório" }, { status: 400 });

    const updates = {};
    if (data !== undefined) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data))) {
        return NextResponse.json({ success: false, error: "Data inválida" }, { status: 400 });
      }
      updates.data = String(data);
    }
    if (categoria !== undefined) updates.categoria = String(categoria).trim();
    if (descricao !== undefined) {
      if (String(descricao).trim().length === 0) {
        return NextResponse.json({ success: false, error: "Descrição não pode ser vazia" }, { status: 400 });
      }
      updates.descricao = String(descricao).trim();
    }
    if (valor !== undefined) {
      const v = Number(valor);
      if (!Number.isFinite(v) || v <= 0) {
        return NextResponse.json({ success: false, error: "Valor inválido" }, { status: 400 });
      }
      updates.valor = v;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, error: "Nada para atualizar" }, { status: 400 });
    }

    await adminDb.collection("gastos").doc(id).update(updates);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("GASTOS PATCH ERROR:", err);
    return NextResponse.json({ success: false, error: err?.message || "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const gate = await requireAdmin(req);
    if (!gate.ok) return NextResponse.json({ success: false, error: gate.error }, { status: gate.status });

    const { id } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: "id obrigatório" }, { status: 400 });

    await adminDb.collection("gastos").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("GASTOS DELETE ERROR:", err);
    return NextResponse.json({ success: false, error: err?.message || "Erro interno" }, { status: 500 });
  }
}
