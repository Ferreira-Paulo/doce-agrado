"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";

import Topbar from "@/components/layout/Topbar";
import PageHeader from "@/components/dashboard/PageHeader";
import SummaryCardsPartner from "@/components/dashboard/SummaryCardsPartner";
import FilterTabs from "@/components/dashboard/FilterTabs";
import DeliveryCard from "@/components/dashboard/DeliveryCard";
import SalesChart from "@/components/dashboard/SalesChart";
import QuickActions from "@/components/dashboard/QuickActions";
import { SkeletonStatCard, SkeletonDeliveryCard } from "@/components/ui/Skeleton";
import { resumoEntregas, calcEntrega } from "@/components/utils/calc";

import { auth } from "@/lib/firebase/client";
import { apiFetch } from "@/lib/auth/apiFetch";
import { onIdTokenChanged, signOut, getIdTokenResult } from "firebase/auth";

export default function ParceiroPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todas");

  useEffect(() => {
    const unsub = onIdTokenChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setLoading(false);
        router.replace("/login");
        return;
      }

      const token = await getIdTokenResult(fbUser, true);
      if (token.claims.admin) {
        setLoading(false);
        router.replace("/admin");
        return;
      }

      setUser({
        nome: fbUser.displayName || "Parceiro",
        email: fbUser.email,
        uid: fbUser.uid,
        username: (fbUser.email || "").split("@")[0],
      });

      try {
        const res = await apiFetch("/api/parceiro/entregas", {}, fbUser);

        if (!res.ok) {
          console.error("ERRO /api/parceiro/entregas:", res.status);
          setEntregas([]);
          return;
        }

        const list = await res.json();
        const sorted = [...(Array.isArray(list) ? list : [])].sort((a, b) =>
          String(b.data).localeCompare(String(a.data))
        );
        setEntregas(sorted);
      } catch (err) {
        console.error(err);
        setEntregas([]);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  const resumo = useMemo(() => resumoEntregas(entregas), [entregas]);

  const counts = useMemo(() => {
    let pendentes = 0;
    let pagas = 0;
    for (const e of entregas) {
      calcEntrega(e).saldo === 0 ? pagas++ : pendentes++;
    }
    return { total: entregas.length, pendentes, pagas };
  }, [entregas]);

  const entregasFiltradas = useMemo(() => {
    if (filtro === "todas") return entregas;
    return entregas.filter((e) => {
      const { saldo } = calcEntrega(e);
      if (filtro === "pendentes") return saldo > 0;
      if (filtro === "pagas") return saldo === 0;
      return true;
    });
  }, [entregas, filtro]);

  async function handleLogout() {
    await signOut(auth);
    router.replace("/login");
  }

  if (loading) {
    return (
      <>
        <Topbar user={null} onLogout={handleLogout} isAdmin={false} />
        <div className="min-h-screen bg-[#FFF9FB] pt-14 px-4 py-8 md:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="h-8 w-40 bg-gray-200 rounded-xl animate-pulse mb-10" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonStatCard key={i} />
              ))}
            </div>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonDeliveryCard key={i} />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <Topbar user={user} onLogout={handleLogout} isAdmin={false} />

      <div className="min-h-screen bg-[#FFF9FB] pt-14 px-4 py-8 md:px-8">
        <div className="max-w-5xl mx-auto">
          <PageHeader
            title={`Olá, ${user.username} 👋`}
            subtitle={
              resumo.trufasEntregues > 0
                ? `Você já recebeu ${resumo.trufasEntregues} trufas da Doce Agrado!`
                : "Acompanhe suas entregas e pagamentos."
            }
          />

          <SummaryCardsPartner resumo={resumo} />

          <QuickActions username={user.username} />

          <SalesChart entregas={entregas} />

          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-[#4A0E2E]">Entregas</h2>
          </div>

          <FilterTabs value={filtro} onChange={setFiltro} counts={counts} />

          <div className="space-y-4 mt-4">
            {entregasFiltradas.map((entrega) => (
              <DeliveryCard key={entrega.id} entrega={entrega} />
            ))}

            {entregasFiltradas.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-12 text-center">
                <Package className="w-10 h-10 text-[#4A0E2E]/20 mx-auto mb-3" />
                <p className="text-[#4A0E2E]/60 font-medium">
                  Nenhuma entrega encontrada.
                </p>
                <p className="text-sm text-[#4A0E2E]/40 mt-1">
                  {filtro !== "todas"
                    ? "Tente mudar o filtro acima."
                    : "Assim que houver entregas, elas aparecerão aqui."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
