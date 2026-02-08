"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/dashboard/PageHeader";
import SummaryCards from "@/components/dashboard/SummaryCards";
import FilterTabs from "@/components/dashboard/FilterTabs";
import DeliveryCard from "@/components/dashboard/DeliveryCard";

import { resumoEntregas, calcEntrega } from "@/components/utils/calc";

export default function ParceiroPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todas"); // todas | pendentes | pagas

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(savedUser);
    if (parsedUser.role !== "parceiro") {
      router.push("/admin");
      return;
    }

    setUser(parsedUser);

    (async () => {
      try {
        const res = await fetch("/api/entregas", { cache: "no-store" });
        const all = await res.json();

        const parceiroData =
          all.find((e) => e.parceiro === parsedUser.username) || { entregas: [] };

        const list = [...(parceiroData.entregas || [])].sort((a, b) =>
          String(b.data).localeCompare(String(a.data))
        );

        setEntregas(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const resumo = useMemo(() => resumoEntregas(entregas), [entregas]);

  const counts = useMemo(() => {
    let pendentes = 0;
    let pagas = 0;

    for (const e of entregas) {
      const { saldo } = calcEntrega(e);
      if (saldo === 0) pagas++;
      else pendentes++;
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

  if (!user || loading) return <p className="p-8">Carregando...</p>;

  return (
    <div className="min-h-screen bg-[#FFF9FB] px-4 py-8 md:px-8">
      <div className="max-w-5xl mx-auto">
        <PageHeader
          title={`Olá, ${user.nome}`}
          subtitle="Aqui você acompanha suas entregas e pagamentos."
          onLogout={() => {
            localStorage.removeItem("user");
            router.push("/login");
          }}
        />

        <SummaryCards resumo={resumo} />

        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-semibold text-[#4A0E2E]">Entregas</h2>
        </div>

        <FilterTabs value={filtro} onChange={setFiltro} counts={counts} />

        <div className="space-y-4">
          {entregasFiltradas.map((entrega, idx) => (
            <DeliveryCard key={idx} entrega={entrega} />
          ))}

          {entregasFiltradas.length === 0 && (
            <div className="bg-white rounded-2xl shadow p-6 text-center text-[#4A0E2E]/70">
              Nenhuma entrega encontrada para este filtro.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
