import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function POST(req) {
  try {
    const gate = await requireAdmin(req);
    if (!gate.ok) return NextResponse.json({ success: false, error: gate.error }, { status: gate.status });

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "username e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const slug = String(username).toLowerCase().trim().replace(/\s+/g, "");
    if (!slug || !/^[a-z0-9_-]{2,30}$/.test(slug)) {
      return NextResponse.json(
        { success: false, error: "username inválido (use apenas letras, números, _ ou -, entre 2 e 30 caracteres)" },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "A senha precisa ter pelo menos 6 caracteres" },
        { status: 400 }
      );
    }

    const email = `${slug}@doceagrado.local`;

    const user = await adminAuth.createUser({ email, password, displayName: slug });

    await adminDb.collection("partners").doc(user.uid).set({
      username: slug,
      email,
      createdAt: new Date().toISOString(),
    });

    console.info(`[parceiros] Novo parceiro criado — uid=${user.uid} username=${slug}`);
    return NextResponse.json({ success: true, uid: user.uid, username: slug });
  } catch (err) {
    if (err.code === "auth/email-already-exists") {
      return NextResponse.json(
        { success: false, error: "Esse parceiro já existe." },
        { status: 409 }
      );
    }
    console.error("PARCEIROS POST ERROR:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Erro interno" },
      { status: 500 }
    );
  }
}
