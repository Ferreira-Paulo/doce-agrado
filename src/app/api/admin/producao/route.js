import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(req) {
  try {
    const gate = await requireAdmin(req);
    if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

    const snap = await adminDb.collection("producao").orderBy("data", "desc").get();
    const producoes = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json(producoes);
  } catch (err) {
    return NextResponse.json({ error: err?.message || "Erro interno" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const gate = await requireAdmin(req);
    if (!gate.ok) return NextResponse.json({ success: false, error: gate.error }, { status: gate.status });

    const { data, itens } = await req.json();

    const dataStr = String(data || new Date().toISOString().slice(0, 10));
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataStr)) {
      return NextResponse.json({ success: false, error: "Data inválida (use YYYY-MM-DD)" }, { status: 400 });
    }
    if (!Array.isArray(itens) || itens.length === 0) {
      return NextResponse.json({ success: false, error: "itens obrigatório (array não vazio)" }, { status: 400 });
    }

    const itensProcessados = [];
    const consumoAgregado = {};

    for (const item of itens) {
      if (!item.saborId) return NextResponse.json({ success: false, error: "Cada item precisa de saborId" }, { status: 400 });
      const receitas = Number(item.receitas);
      const qtdTrufas = Number(item.quantidade);
      if (!Number.isFinite(receitas) || receitas <= 0 || !Number.isInteger(receitas)) {
        return NextResponse.json({ success: false, error: "Quantidade de receitas deve ser inteiro positivo" }, { status: 400 });
      }
      if (!Number.isFinite(qtdTrufas) || qtdTrufas <= 0 || !Number.isInteger(qtdTrufas)) {
        return NextResponse.json({ success: false, error: "Quantidade de trufas deve ser inteiro positivo" }, { status: 400 });
      }

      const saborSnap = await adminDb.collection("sabores").doc(item.saborId).get();
      if (!saborSnap.exists) {
        return NextResponse.json({ success: false, error: `Sabor não encontrado: ${item.saborId}` }, { status: 404 });
      }
      const sabor = saborSnap.data();
      const receita = Array.isArray(sabor.receita) ? sabor.receita : [];

      const ingredientes_consumidos = receita
        .filter((r) => r.quantidade_por_receita)
        .map((r) => ({
          ingredienteId: r.ingredienteId,
          nome: r.nome,
          unidade: r.unidade,
          quantidade: Number((r.quantidade_por_receita * receitas).toFixed(4)),
        }));

      for (const c of ingredientes_consumidos) {
        if (!consumoAgregado[c.ingredienteId]) {
          consumoAgregado[c.ingredienteId] = { ...c, quantidade: 0 };
        }
        consumoAgregado[c.ingredienteId].quantidade = Number(
          (consumoAgregado[c.ingredienteId].quantidade + c.quantidade).toFixed(4)
        );
      }

      itensProcessados.push({
        saborId: item.saborId,
        saborNome: sabor.nome,
        receitas,
        quantidade: qtdTrufas,
        ingredientes_consumidos,
      });
    }

    const batch = adminDb.batch();

    for (const item of itensProcessados) {
      batch.update(adminDb.collection("sabores").doc(item.saborId), {
        estoque: FieldValue.increment(item.quantidade),
      });
    }

    for (const c of Object.values(consumoAgregado)) {
      batch.update(adminDb.collection("ingredientes").doc(c.ingredienteId), {
        estoque: FieldValue.increment(-c.quantidade),
      });
    }

    const producaoRef = adminDb.collection("producao").doc();
    batch.set(producaoRef, {
      data: dataStr,
      itens: itensProcessados,
      ingredientes_consumidos: Object.values(consumoAgregado),
      createdAt: new Date().toISOString(),
    });

    await batch.commit();

    return NextResponse.json({ success: true, id: producaoRef.id });
  } catch (err) {
    return NextResponse.json({ success: false, error: err?.message || "Erro interno" }, { status: 500 });
  }
}
