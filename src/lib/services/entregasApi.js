export async function fetchEntregas() {
  const res = await fetch("/api/entregas", { cache: "no-store" });
  return res.json();
}