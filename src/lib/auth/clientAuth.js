export function requireAdmin(router) {
  const saved = localStorage.getItem("user");
  if (!saved) {
    router.push("/login");
    return null;
  }
  const u = JSON.parse(saved);
  if (u.role !== "admin") {
    router.push("/parceiro");
    return null;
  }
  return u;
}