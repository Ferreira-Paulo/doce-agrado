import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAuth } from "@/lib/auth/requireAuth";

export async function GET(req) {
  try {
    const gate = await requireAuth(req);
    if (!gate.ok) {
      return NextResponse.json({ error: gate.error }, { status: gate.status });
    }

    // o parceiro logado é o uid dele (doc id em partners)
    const uid = gate.uid;

    const delSnap = await adminDb
      .collection("partners")
      .doc(uid)
      .collection("deliveries")
      .orderBy("data", "desc")
      .get();

    const entregas = delSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return NextResponse.json(entregas);
  } catch (err) {
    console.error("PARCEIRO ENTREGAS GET ERROR:", err);
    return NextResponse.json({ error: err?.message || "Erro interno" }, { status: 500 });
  }
}
