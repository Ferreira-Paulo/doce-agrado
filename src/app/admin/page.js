"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/dashboard/PageHeader";
import SummaryCards from "@/components/dashboard/SummaryCards";
import { resumoEntregas, calcEntrega } from "@/components/utils/calc";

import PagamentoForm from "./components/PagamentoForm";
import EntregaForm from "./components/EntregaForm";
import AdminFilters from "./components/AdminFilters";
import PartnerSection from "./components/PartnerSection";

import Modal from "@/components/ui/Modal";

export default function AdminPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // "pagamento" | "entrega"

  const [novoPagamento, setNovoPagamento] = useState({
    parceiro: "",
    valor: "",
    data: new Date().toISOString().slice(0, 10),
  });

  const [novaEntrega, setNovaEntrega] = useState({
    parceiro: "",
    quantidade: "",
    valor_unitario: "3.5",
    data: new Date().toISOString().slice(0, 10),
  });

  // filtros
  const [busca, setBusca] = useState("");
  const [filtroParceiro, setFiltroParceiro] = useState("__all");
  const [filtroStatus, setFiltroStatus] = useState("todas"); // todas | pendentes | pagas

  function closeModal() {
    setModalOpen(false);
    setModalType(null);
  }

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(savedUser);
    if (parsedUser.role !== "admin") {
      router.push("/parceiro");
      return;
    }

    setUser(parsedUser);

    (async () => {
      try {
        const res = await fetch("/api/entregas", { cache: "no-store" });
        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];
        setEntregas(arr);

        const primeiroParceiro = arr?.[0]?.parceiro || "";
        setNovoPagamento((p) => ({ ...p, parceiro: primeiroParceiro }));
        setNovaEntrega((e) => ({ ...e, parceiro: primeiroParceiro }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  // resumo geral: soma todas as entregas de todos parceiros
  const resumoGeral = useMemo(() => {
    const todas = entregas.flatMap((p) => p.entregas || []);
    return resumoEntregas(todas);
  }, [entregas]);

  const parceiros = useMemo(
    () => entregas.map((p) => p.parceiro).sort((a, b) => a.localeCompare(b)),
    [entregas]
  );

  // aplica filtros + busca + status
  const entregasFiltradasPorParceiro = useMemo(() => {
    const q = busca.trim().toLowerCase();

    return entregas
      .filter((p) =>
        filtroParceiro === "__all" ? true : p.parceiro === filtroParceiro
      )
      .filter((p) => {
        if (!q) return true;

        const matchParceiro = p.parceiro.toLowerCase().includes(q);
        const matchData = (p.entregas || []).some((e) =>
          String(e.data).includes(q)
        );

        return matchParceiro || matchData;
      })
      .map((p) => {
        let list = [...(p.entregas || [])].sort((a, b) =>
          String(b.data).localeCompare(String(a.data))
        );

        if (filtroStatus !== "todas") {
          list = list.filter((e) => {
            const { saldo } = calcEntrega(e);
            if (filtroStatus === "pendentes") return saldo > 0;
            if (filtroStatus === "pagas") return saldo === 0;
            return true;
          });
        }

        return { ...p, entregas: list };
      })
      .filter((p) =>
        filtroStatus === "todas" ? true : (p.entregas || []).length > 0
      );
  }, [entregas, busca, filtroParceiro, filtroStatus]);

  async function registrarPagamento() {
    if (!novoPagamento.parceiro) return;
    if (!novoPagamento.valor || isNaN(Number(novoPagamento.valor))) return;

    const res = await fetch("/api/pagamentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...novoPagamento,
        valor: Number(novoPagamento.valor),
      }),
    });

    const data = await res.json();

    if (data.success) {
      setEntregas(data.entregas);
      setNovoPagamento((p) => ({
        ...p,
        valor: "",
        data: new Date().toISOString().slice(0, 10),
      }));

      // ✅ fecha modal ao salvar
      closeModal();
      return;
    }

    alert("Erro ao registrar pagamento: " + (data.error || "desconhecido"));
  }

  async function registrarEntrega() {
    if (!novaEntrega.parceiro) return;
    if (!novaEntrega.quantidade || isNaN(Number(novaEntrega.quantidade))) return;

    const res = await fetch("/api/entregas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...novaEntrega,
        quantidade: Number(novaEntrega.quantidade),
        valor_unitario: Number(novaEntrega.valor_unitario),
      }),
    });

    const data = await res.json();

    if (data.success) {
      setEntregas(data.entregas);
      setNovaEntrega((e) => ({
        ...e,
        quantidade: "",
        data: new Date().toISOString().slice(0, 10),
      }));

      // ✅ fecha modal ao salvar
      closeModal();
      return;
    }

    alert("Erro ao registrar entrega: " + (data.error || "desconhecido"));
  }

  if (!user || loading) return <p className="p-8">Carregando...</p>;

  const modalTitle =
    modalType === "entrega"
      ? "Nova Entrega"
      : modalType === "pagamento"
      ? "Novo Pagamento"
      : "";

  return (
    <div className="min-h-screen bg-[#FFF9FB] px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title={`Olá, ${user.nome} (Admin)`}
          subtitle="Gerencie entregas e pagamentos de todos os parceiros."
          onLogout={() => {
            localStorage.removeItem("user");
            router.push("/login");
          }}
        />

        <SummaryCards resumo={resumoGeral} />

        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <button
            onClick={() => {
              setModalType("entrega");
              setModalOpen(true);
            }}
            className="bg-[#4A0E2E] text-white px-5 py-3 rounded-2xl font-semibold hover:opacity-95 transition"
          >
            + Nova Entrega
          </button>

          <button
            onClick={() => {
              setModalType("pagamento");
              setModalOpen(true);
            }}
            className="bg-[#D1328C] text-white px-5 py-3 rounded-2xl font-semibold hover:bg-[#b52a79] transition"
          >
            + Novo Pagamento
          </button>
        </div>

        <AdminFilters
          parceiros={parceiros}
          filtroParceiro={filtroParceiro}
          setFiltroParceiro={setFiltroParceiro}
          filtroStatus={filtroStatus}
          setFiltroStatus={setFiltroStatus}
          busca={busca}
          setBusca={setBusca}
        />

        {/* Parceiros */}
        <h2 className="text-2xl font-semibold text-[#4A0E2E] mb-4">
          Parceiros
        </h2>

        <div className="space-y-6">
          {entregasFiltradasPorParceiro.map((p) => (
            <PartnerSection
              key={p.parceiro}
              parceiro={p.parceiro}
              entregas={p.entregas || []}
            />
          ))}

          {entregasFiltradasPorParceiro.length === 0 && (
            <div className="bg-white rounded-2xl shadow p-6 text-center text-[#4A0E2E]/70">
              Nenhum resultado para os filtros atuais.
            </div>
          )}
        </div>
      </div>

      <Modal open={modalOpen} title={modalTitle} onClose={closeModal}>
        {modalType === "entrega" && (
          <EntregaForm
            entregas={entregas}
            novaEntrega={novaEntrega}
            setNovaEntrega={setNovaEntrega}
            onSubmit={registrarEntrega}
            onCancel={closeModal}
          />
        )}

        {modalType === "pagamento" && (
          <PagamentoForm
            entregas={entregas}
            novoPagamento={novoPagamento}
            setNovoPagamento={setNovoPagamento}
            onSubmit={registrarPagamento}
            onCancel={closeModal}
          />
        )}
      </Modal>
    </div>
  );
}
