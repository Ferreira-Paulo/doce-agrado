import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

// Rate limiter em memória: máximo 5 tentativas por IP a cada 15 minutos.
// Em ambiente serverless cada instância tem seu próprio Map, mas é suficiente
// para dificultar ataques de força bruta em desenvolvimento/produção de baixo tráfego.
const attempts = new Map(); // ip → { count, resetAt }
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_ATTEMPTS) return false;

  entry.count += 1;
  return true;
}

export async function POST(req) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: "Muitas tentativas. Tente novamente em 15 minutos." },
      { status: 429 }
    );
  }

  try {
    const { setupKey, email } = await req.json();

    if (!setupKey || setupKey !== process.env.ADMIN_SETUP_KEY) {
      console.warn(`[make-admin] Chave inválida — ip=${ip} email=${email}`);
      return NextResponse.json({ success: false, error: "Chave inválida" }, { status: 401 });
    }

    if (!email) {
      return NextResponse.json({ success: false, error: "Informe o email" }, { status: 400 });
    }

    const user = await adminAuth.getUserByEmail(email);
    await adminAuth.setCustomUserClaims(user.uid, { admin: true });

    console.info(`[make-admin] Admin concedido — uid=${user.uid} email=${email} ip=${ip}`);
    return NextResponse.json({ success: true, uid: user.uid });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err?.message || "Erro" },
      { status: 500 }
    );
  }
}
