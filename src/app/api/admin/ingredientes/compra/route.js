import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req) {
  try {
    const gate = await requireAdmin(req);
    if (!gate.ok) return NextResponse.json({ success: false, error: gate.error }, { status: gate.status });

    const { ingredienteId, quantidade, valor, data, descricao } = await req.json();

    if (!ingredienteId) {
      return NextResponse.json({ success: false, error: "ingredienteId obrigatório" }, { status: 400 });
    }
    const qtd = Number(quantidade);
    if (!Number.isFinite(qtd) || qtd <= 0) {
      return NextResponse.json({ success: false, error: "Quantidade deve ser positiva" }, { status: 400 });
    }
    const v = Number(valor);
    if (!Number.isFinite(v) || v <= 0) {
      return NextResponse.json({ success: false, error: "Valor deve ser positivo" }, { status: 400 });
    }
    const dataStr = String(data || new Date().toISOString().slice(0, 10));
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataStr)) {
      return NextResponse.json({ success: false, error: "Data inválida (use YYYY-MM-DD)" }, { status: 400 });
    }

    const ingredienteRef = adminDb.collection("ingredientes").doc(ingredienteId);
    const ingredienteSnap = await ingredienteRef.get();
    if (!ingredienteSnap.exists) {
      return NextResponse.json({ success: false, error: "Ingrediente não encontrado" }, { status: 404 });
    }
    const ingrediente = ingredienteSnap.data();

    const descricaoFinal = String(descricao || `Compra de ${ingrediente.nome}`).trim();

    const batch = adminDb.batch();

    batch.update(ingredienteRef, { estoque: FieldValue.increment(qtd) });

    const gastoRef = adminDb.collection("gastos").doc();
    batch.set(gastoRef, {
      data: dataStr,
      categoria: "materia-prima",
      descricao: descricaoFinal,
      valor: v,
      ingredienteId,
      createdAt: new Date().toISOString(),
    });

    await batch.commit();

    return NextResponse.json({ success: true, gastoId: gastoRef.id });
  } catch (err) {
    return NextResponse.json({ success: false, error: err?.message || "Erro interno" }, { status: 500 });
  }
}
