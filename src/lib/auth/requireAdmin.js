import { adminAuth } from "@/lib/firebase/admin";

export async function requireAdmin(req) {
  try {
    const header = req.headers.get("authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";

    if (!token) return { ok: false, status: 401, error: "Sem token" };

    const decoded = await adminAuth.verifyIdToken(token);

    if (!decoded.admin) return { ok: false, status: 403, error: "Não é admin" };

    return { ok: true, decoded };
  } catch (err) {
    return { ok: false, status: 401, error: "Token inválido" };
  }
}
