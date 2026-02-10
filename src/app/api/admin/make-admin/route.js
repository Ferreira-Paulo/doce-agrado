import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

export async function POST(req) {
  try {
    const { setupKey, email } = await req.json();

    if (!setupKey || setupKey !== process.env.ADMIN_SETUP_KEY) {
      return NextResponse.json({ error: "Chave inválida" }, { status: 401 });
    }

    if (!email) {
      return NextResponse.json({ error: "Informe o email" }, { status: 400 });
    }

    const user = await adminAuth.getUserByEmail(email);

    await adminAuth.setCustomUserClaims(user.uid, { admin: true });

    return NextResponse.json({ success: true, uid: user.uid });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "Erro" },
      { status: 500 }
    );
  }
}
