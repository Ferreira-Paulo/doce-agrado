import { auth } from "@/lib/firebase/client";

export async function apiFetch(url, options = {}, fbUserOverride) {
  const u = fbUserOverride || auth.currentUser;
  const token = u ? await u.getIdToken() : "";

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
}
