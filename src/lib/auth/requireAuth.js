import { adminAuth } from "@/lib/firebase/admin";

export async function requireAuth(req) {
  try {
    const header = req.headers.get("authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";

    if (!token) return { ok: false, status: 401, error: "Sem token" };

    const decoded = await adminAuth.verifyIdToken(token);

    return { ok: true, decoded, uid: decoded.uid, email: decoded.email };
  } catch (err) {
    return { ok: false, status: 401, error: "Token inválido" };
  }
}
