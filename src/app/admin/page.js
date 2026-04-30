"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Download, UserPlus } from "lucide-react";

import Topbar from "@/components/layout/Topbar";
import PageHeader from "@/components/dashboard/PageHeader";
import SummaryCardsAdmin from "@/components/dashboard/SummaryCardsAdmin";
import { SkeletonStatCard, SkeletonPartnerSection } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { resumoEntregas, calcEntrega } from "@/components/utils/calc";
import { moneyBR, toBRDate } from "@/components/utils/format";

import PagamentoForm from "./components/PagamentoForm";
import EntregaForm from "./components/EntregaForm";
import ParceiroForm from "./components/ParceiroForm";
import AdminFilters from "./components/AdminFilters";
import PartnerSection from "./components/PartnerSection";
import Modal from "@/components/ui/Modal";

import { auth } from "@/lib/firebase/client";
import { apiFetch } from "@/lib/auth/apiFetch";
import { onIdTokenChanged, signOut, getIdTokenResult } from "firebase/auth";

export default function AdminPage() {
  const router = useRouter();
  const toast = useToast();

  const [user, setUser] = useState(null);
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // "entrega" | "pagamento" | "parceiro"
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
  const [editDeliveryId, setEditDeliveryId] = useState(null);

  // Forms
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
  const [novoParceiro, setNovoParceiro] = useState({ username: "", password: "" });

  // Filtros e ordenação
  const [busca, setBusca] = useState("");
  const [filtroParceiro, setFiltroParceiro] = useState("__all");
  const [filtroStatus, setFiltroStatus] = useState("todas");
  const [ordenacao, setOrdenacao] = useState("saldo-desc");

  function closeModal() {
    setModalOpen(false);
    setModalType(null);
    setModalMode("create");
    setEditDeliveryId(null);
  }

  useEffect(() => {
    const unsub = onIdTokenChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setLoading(false);
        router.replace("/login");
        return;
      }

      const token = await getIdTokenResult(fbUser, true);
      if (!token.claims.admin) {
        setLoading(false);
        router.replace("/parceiro");
        return;
      }

      setUser({
        nome: fbUser.displayName || "Admin",
        email: fbUser.email,
        uid: fbUser.uid,
        username: (fbUser.email || "").split("@")[0],
      });

      try {
        const res = await apiFetch("/api/entregas", {}, fbUser);
        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];
        setEntregas(arr);

        const primeiro = arr?.[0]?.parceiro || "";
        setNovoPagamento((p) => ({ ...p, parceiro: p.parceiro || primeiro }));
        setNovaEntrega((e) => ({ ...e, parceiro: e.parceiro || primeiro }));
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  const resumoGeral = useMemo(() => {
    const todas = entregas.flatMap((p) => p.entregas || []);
    return resumoEntregas(todas);
  }, [entregas]);

  const parceiros = useMemo(
    () => entregas.map((p) => p.parceiro).sort((a, b) => a.localeCompare(b)),
    [entregas]
  );

  const entregasFiltradasPorParceiro = useMemo(() => {
    const q = busca.trim().toLowerCase();

    const filtered = entregas
      .filter((p) =>
        filtroParceiro === "__all" ? true : p.parceiro === filtroParceiro
      )
      .filter((p) => {
        if (!q) return true;
        return (
          p.parceiro.toLowerCase().includes(q) ||
          (p.entregas || []).some((e) => String(e.data).includes(q))
        );
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

    // Ordenação
    const withMeta = filtered.map((p) => {
      const r = resumoEntregas(p.entregas || []);
      const lastDate = (p.entregas || []).reduce(
        (mx, e) => (String(e.data) > mx ? String(e.data) : mx),
        ""
      );
      return { ...p, _saldo: r.saldoGeral, _lastDate: lastDate };
    });

    return withMeta.sort((a, b) => {
      if (ordenacao === "saldo-desc") return b._saldo - a._saldo;
      if (ordenacao === "saldo-asc") return a._saldo - b._saldo;
      if (ordenacao === "recente") return b._lastDate.localeCompare(a._lastDate);
      return a.parceiro.localeCompare(b.parceiro);
    });
  }, [entregas, busca, filtroParceiro, filtroStatus, ordenacao]);

  async function recarregarEntregas() {
    const fbUser = auth.currentUser;
    if (!fbUser) return;
    const res = await apiFetch("/api/entregas", {}, fbUser);
    const list = await res.json();
    setEntregas(Array.isArray(list) ? list : []);
  }

  // ─── Abrir modais ────────────────────────────────────────────────────
  function openNovaEntrega(parceiro = "") {
    setNovaEntrega((e) => ({ ...e, parceiro: parceiro || e.parceiro, quantidade: "", data: new Date().toISOString().slice(0, 10) }));
    setModalMode("create");
    setModalType("entrega");
    setModalOpen(true);
  }

  function openEditEntrega(parceiro, entrega) {
    setNovaEntrega({
      parceiro,
      quantidade: String(entrega.quantidade),
      valor_unitario: String(entrega.valor_unitario),
      data: entrega.data,
    });
    setEditDeliveryId(entrega.id);
    setModalMode("edit");
    setModalType("entrega");
    setModalOpen(true);
  }

  function openPagar(parceiro = "") {
    setNovoPagamento((p) => ({ ...p, parceiro: parceiro || p.parceiro, valor: "", data: new Date().toISOString().slice(0, 10) }));
    setModalType("pagamento");
    setModalMode("create");
    setModalOpen(true);
  }

  // ─── Handlers ────────────────────────────────────────────────────────
  async function registrarPagamento() {
    if (!novoPagamento.parceiro) { toast("Selecione um parceiro.", "error"); return; }
    if (!novoPagamento.valor || isNaN(Number(novoPagamento.valor))) { toast("Informe um valor válido.", "error"); return; }

    try {
      const res = await apiFetch("/api/pagamentos", {
        method: "POST",
        body: JSON.stringify({ ...novoPagamento, valor: Number(novoPagamento.valor) }),
      });
      const data = await res.json();

      if (!res.ok || !data?.success) { toast(data?.error || "Falha ao registrar pagamento.", "error"); return; }

      await recarregarEntregas();
      closeModal();

      const restante = Number(data.restante || 0);
      toast(
        restante > 0
          ? `Pagamento registrado. Restante não aplicado: ${moneyBR(restante)}`
          : "Pagamento registrado com sucesso!",
        restante > 0 ? "info" : "success"
      );
    } catch {
      toast("Erro inesperado ao registrar pagamento.", "error");
    }
  }

  async function registrarEntrega() {
    if (!novaEntrega.parceiro) { toast("Selecione um parceiro.", "error"); return; }
    if (!novaEntrega.quantidade || isNaN(Number(novaEntrega.quantidade))) { toast("Informe uma quantidade válida.", "error"); return; }

    try {
      const isEdit = modalMode === "edit";
      const method = isEdit ? "PATCH" : "POST";
      const body = isEdit
        ? { parceiro: novaEntrega.parceiro, deliveryId: editDeliveryId, quantidade: Number(novaEntrega.quantidade), valor_unitario: Number(novaEntrega.valor_unitario), data: novaEntrega.data }
        : { ...novaEntrega, quantidade: Number(novaEntrega.quantidade), valor_unitario: Number(novaEntrega.valor_unitario) };

      const res = await apiFetch("/api/entregas", { method, body: JSON.stringify(body) });
      const data = await res.json();

      if (!data.success) { toast(data.error || "Erro ao salvar entrega.", "error"); return; }

      await recarregarEntregas();
      closeModal();
      toast(isEdit ? "Entrega atualizada!" : "Entrega registrada!", "success");
    } catch {
      toast("Erro inesperado ao salvar entrega.", "error");
    }
  }

  async function handleDelete(parceiro, entrega) {
    const confirmMsg = `Excluir entrega de ${entrega.quantidade} trufas em ${toBRDate(entrega.data)}?\n\nEssa ação não pode ser desfeita.`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await apiFetch("/api/entregas", {
        method: "DELETE",
        body: JSON.stringify({ parceiro, deliveryId: entrega.id }),
      });
      const data = await res.json();

      if (!data.success) { toast(data.error || "Erro ao excluir.", "error"); return; }

      await recarregarEntregas();
      toast("Entrega excluída.", "success");
    } catch {
      toast("Erro inesperado ao excluir entrega.", "error");
    }
  }

  async function criarParceiro() {
    if (!novoParceiro.username) { toast("Informe o nome de usuário.", "error"); return; }
    if (!novoParceiro.password || novoParceiro.password.length < 6) { toast("A senha precisa ter pelo menos 6 caracteres.", "error"); return; }

    try {
      const res = await apiFetch("/api/admin/parceiros", {
        method: "POST",
        body: JSON.stringify(novoParceiro),
      });
      const data = await res.json();

      if (!data.success) { toast(data.error || "Erro ao criar parceiro.", "error"); return; }

      await recarregarEntregas();
      setNovoParceiro({ username: "", password: "" });
      closeModal();
      toast(`Parceiro "${data.username}" criado com sucesso!`, "success");
    } catch {
      toast("Erro inesperado ao criar parceiro.", "error");
    }
  }

  function exportCSV() {
    const rows = [["Parceiro", "Data", "Quantidade", "Valor Unitário", "Total", "Total Pago", "Saldo", "Situação"]];

    for (const { parceiro, entregas: ents } of entregas) {
      for (const e of ents || []) {
        const { total, totalPago, saldo } = calcEntrega(e);
        const sit = saldo === 0 ? "Pago" : saldo < total ? "Parcial" : "Pendente";
        rows.push([
          parceiro,
          e.data,
          e.quantidade,
          String(e.valor_unitario).replace(".", ","),
          total.toFixed(2).replace(".", ","),
          totalPago.toFixed(2).replace(".", ","),
          saldo.toFixed(2).replace(".", ","),
          sit,
        ]);
      }
    }

    const csv = rows.map((r) => r.join(";")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `doce-agrado-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Planilha exportada!", "success");
  }

  async function handleLogout() {
    await signOut(auth);
    router.push("/login");
  }

  // ─── Loading skeleton ─────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <Topbar user={null} onLogout={handleLogout} isAdmin />
        <div className="min-h-screen bg-[#FFF9FB] pt-14 px-4 py-8 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse mb-10" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
              {Array.from({ length: 5 }).map((_, i) => <SkeletonStatCard key={i} />)}
            </div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonPartnerSection key={i} />)}
            </div>
          </div>
        </div>
      </>
    );
  }

  const modalTitle =
    modalType === "entrega" ? (modalMode === "edit" ? "Editar Entrega" : "Nova Entrega")
    : modalType === "pagamento" ? "Novo Pagamento"
    : modalType === "parceiro" ? "Novo Parceiro"
    : "";

  const mostrados = entregasFiltradasPorParceiro.length;
  const total = entregas.length;

  return (
    <>
      <Topbar user={user} onLogout={handleLogout} isAdmin />

      <div className="min-h-screen bg-[#FFF9FB] pt-14 px-4 py-8 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            <PageHeader
              title="Dashboard Admin"
              subtitle="Gerencie entregas e pagamentos de todos os parceiros."
            />

            {/* Ações globais */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={exportCSV}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-black/10 text-[#4A0E2E] text-sm font-semibold hover:bg-black/3 transition"
              >
                <Download className="w-4 h-4" />
                Exportar CSV
              </button>
              <button
                onClick={() => { setModalType("parceiro"); setModalOpen(true); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-black/10 text-[#4A0E2E] text-sm font-semibold hover:bg-black/3 transition"
              >
                <UserPlus className="w-4 h-4" />
                Novo parceiro
              </button>
            </div>
          </div>

          <SummaryCardsAdmin resumo={resumoGeral} />

          {/* Ações rápidas */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <button
              onClick={() => openNovaEntrega()}
              className="bg-[#4A0E2E] text-white px-5 py-3 rounded-2xl font-semibold hover:opacity-90 transition"
            >
              + Nova Entrega
            </button>
            <button
              onClick={() => openPagar()}
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
            ordenacao={ordenacao}
            setOrdenacao={setOrdenacao}
            busca={busca}
            setBusca={setBusca}
          />

          {/* Cabeçalho da lista */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#4A0E2E]">Parceiros</h2>
            <p className="text-sm text-[#4A0E2E]/50">
              {mostrados === total
                ? `${total} parceiro${total !== 1 ? "s" : ""}`
                : `${mostrados} de ${total} parceiros`}
            </p>
          </div>

          <div className="space-y-4">
            {entregasFiltradasPorParceiro.map((p) => (
              <PartnerSection
                key={p.parceiro}
                parceiro={p.parceiro}
                entregas={p.entregas || []}
                onPagar={openPagar}
                onEdit={openEditEntrega}
                onDelete={handleDelete}
              />
            ))}

            {entregasFiltradasPorParceiro.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-12 text-center">
                <Package className="w-10 h-10 text-[#4A0E2E]/20 mx-auto mb-3" />
                <p className="text-[#4A0E2E]/60 font-medium">
                  Nenhum resultado para os filtros atuais.
                </p>
                <p className="text-sm text-[#4A0E2E]/40 mt-1">
                  Tente ajustar os filtros acima.
                </p>
              </div>
            )}
          </div>
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
            mode={modalMode}
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
        {modalType === "parceiro" && (
          <ParceiroForm
            novoParceiro={novoParceiro}
            setNovoParceiro={setNovoParceiro}
            onSubmit={criarParceiro}
            onCancel={closeModal}
          />
        )}
      </Modal>
    </>
  );
}
