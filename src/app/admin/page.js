"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Download, Truck, UserPlus } from "lucide-react";

import Topbar from "@/components/layout/Topbar";
import SummaryCardsAdmin from "@/components/dashboard/SummaryCardsAdmin";
import { SkeletonStatCard, SkeletonPartnerSection } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { resumoEntregas, calcEntrega } from "@/components/utils/calc";
import { moneyBR, toBRDate } from "@/components/utils/format";

import PagamentoForm from "./components/PagamentoForm";
import EntregaForm from "./components/EntregaForm";
import ParceiroForm from "./components/ParceiroForm";
import PartnersTable from "./components/PartnersTable";
import EstoquePanel from "./components/EstoquePanel";
import CatalogoTab from "./components/CatalogoTab";
import FinanceiroTab from "./components/FinanceiroTab";
import IngredientesTab from "./components/IngredientesTab";
import ProducaoTab from "./components/ProducaoTab";
import Modal from "@/components/ui/Modal";

import { auth } from "@/lib/firebase/client";
import { apiFetch } from "@/lib/auth/apiFetch";
import { onIdTokenChanged, signOut, getIdTokenResult } from "firebase/auth";

const TABS = [
  { id: "geral", label: "Geral" },
  { id: "producao", label: "Produção" },
  { id: "ingredientes", label: "Ingredientes" },
  { id: "catalogo", label: "Catálogo" },
  { id: "financeiro", label: "Financeiro" },
];

function TabBar({ active, onChange }) {
  return (
    <div className="border-b border-black/8 mb-8 overflow-x-auto">
      <div className="flex min-w-max">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`px-5 py-3 text-sm font-semibold transition border-b-2 -mb-px whitespace-nowrap ${
              active === t.id
                ? "border-[#D1328C] text-[#D1328C]"
                : "border-transparent text-[#4A0E2E]/50 hover:text-[#4A0E2E]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const toast = useToast();

  const [user, setUser] = useState(null);
  const [entregas, setEntregas] = useState([]);
  const [sabores, setSabores] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [producoes, setProducoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("geral");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [editDeliveryId, setEditDeliveryId] = useState(null);

  // Forms
  const [novoPagamento, setNovoPagamento] = useState({
    parceiro: "",
    valor: "",
    data: new Date().toISOString().slice(0, 10),
  });
  const [editPagamentoMeta, setEditPagamentoMeta] = useState(null); // { deliveryId, index }
  const [novaEntrega, setNovaEntrega] = useState({
    parceiro: "",
    itens: [{ sabor: "", saborId: "", quantidade: "" }],
    valor_unitario: "3.5",
    data: new Date().toISOString().slice(0, 10),
    data_validade: "",
  });
  const [novoParceiro, setNovoParceiro] = useState({ username: "", password: "" });

  const [submitting, setSubmitting] = useState(false);

  function closeModal() {
    setModalOpen(false);
    setModalType(null);
    setModalMode("create");
    setEditDeliveryId(null);
    setEditPagamentoMeta(null);
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
        const [entregasRes, saboresRes, ingredientesRes, producoesRes] = await Promise.all([
          apiFetch("/api/entregas", {}, fbUser),
          apiFetch("/api/admin/sabores", {}, fbUser),
          apiFetch("/api/admin/ingredientes", {}, fbUser),
          apiFetch("/api/admin/producao", {}, fbUser),
        ]);

        if (!entregasRes.ok) throw new Error(`HTTP ${entregasRes.status}`);
        const entregasData = await entregasRes.json();
        const arr = Array.isArray(entregasData) ? entregasData : [];
        setEntregas(arr);

        const saboresData = saboresRes.ok ? await saboresRes.json() : [];
        setSabores(Array.isArray(saboresData) ? saboresData : []);

        const ingredientesData = ingredientesRes.ok ? await ingredientesRes.json() : [];
        setIngredientes(Array.isArray(ingredientesData) ? ingredientesData : []);

        const producoesData = producoesRes.ok ? await producoesRes.json() : [];
        setProducoes(Array.isArray(producoesData) ? producoesData : []);

        const primeiro = arr?.[0]?.parceiro || "";
        setNovoPagamento((p) => ({ ...p, parceiro: p.parceiro || primeiro }));
        setNovaEntrega((e) => ({ ...e, parceiro: e.parceiro || primeiro }));
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        toast("Não foi possível carregar os dados. Recarregue a página.", "error");
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

  async function recarregarEntregas() {
    const fbUser = auth.currentUser;
    if (!fbUser) return;
    try {
      const res = await apiFetch("/api/entregas", {}, fbUser);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const list = await res.json();
      setEntregas(Array.isArray(list) ? list : []);
    } catch {
      toast("Erro ao atualizar os dados.", "error");
    }
  }

  async function recarregarSabores() {
    const fbUser = auth.currentUser;
    if (!fbUser) return;
    try {
      const res = await apiFetch("/api/admin/sabores", {}, fbUser);
      if (!res.ok) return;
      const data = await res.json();
      setSabores(Array.isArray(data) ? data : []);
    } catch { /* silently fail */ }
  }

  async function recarregarIngredientes() {
    const fbUser = auth.currentUser;
    if (!fbUser) return;
    try {
      const res = await apiFetch("/api/admin/ingredientes", {}, fbUser);
      if (!res.ok) return;
      const data = await res.json();
      setIngredientes(Array.isArray(data) ? data : []);
    } catch { /* silently fail */ }
  }

  async function recarregarProducoes() {
    const fbUser = auth.currentUser;
    if (!fbUser) return;
    try {
      const [saboresRes, ingredientesRes, producoesRes] = await Promise.all([
        apiFetch("/api/admin/sabores", {}, fbUser),
        apiFetch("/api/admin/ingredientes", {}, fbUser),
        apiFetch("/api/admin/producao", {}, fbUser),
      ]);
      if (saboresRes.ok) {
        const d = await saboresRes.json();
        setSabores(Array.isArray(d) ? d : []);
      }
      if (ingredientesRes.ok) {
        const d = await ingredientesRes.json();
        setIngredientes(Array.isArray(d) ? d : []);
      }
      if (producoesRes.ok) {
        const d = await producoesRes.json();
        setProducoes(Array.isArray(d) ? d : []);
      }
    } catch { /* silently fail */ }
  }

  // ─── Modais ──────────────────────────────────────────────────────────

  function openNovaEntrega(parceiro = "") {
    setNovaEntrega((e) => ({
      ...e,
      parceiro: parceiro || e.parceiro,
      itens: [{ sabor: "", saborId: "", quantidade: "" }],
      data: new Date().toISOString().slice(0, 10),
      data_validade: "",
    }));
    setModalMode("create");
    setModalType("entrega");
    setModalOpen(true);
  }

  function openEditEntrega(parceiro, entrega) {
    setNovaEntrega({
      parceiro,
      itens:
        Array.isArray(entrega.itens) && entrega.itens.length > 0
          ? entrega.itens.map((i) => {
              const s = sabores.find((s) => s.nome === i.sabor || s.id === i.saborId);
              return {
                sabor: i.sabor || "",
                saborId: i.saborId || s?.id || "",
                quantidade: String(i.quantidade || ""),
              };
            })
          : [{ sabor: "", saborId: "", quantidade: String(entrega.quantidade || "") }],
      valor_unitario: String(entrega.valor_unitario || ""),
      data: entrega.data || "",
      data_validade: entrega.data_validade || "",
    });
    setEditDeliveryId(entrega.id);
    setModalMode("edit");
    setModalType("entrega");
    setModalOpen(true);
  }

  function openPagar(parceiro = "", saldoSugerido = "") {
    setNovoPagamento((p) => ({
      ...p,
      parceiro: parceiro || p.parceiro,
      valor: saldoSugerido ? String(saldoSugerido) : "",
      data: new Date().toISOString().slice(0, 10),
    }));
    setEditPagamentoMeta(null);
    setModalType("pagamento");
    setModalMode("create");
    setModalOpen(true);
  }

  function openEditPagamento(parceiro, deliveryId, index, pagamento) {
    setNovoPagamento({
      parceiro,
      valor: String(pagamento.valor),
      data: pagamento.data,
    });
    setEditPagamentoMeta({ deliveryId, index });
    setModalMode("edit");
    setModalType("pagamento");
    setModalOpen(true);
  }

  // ─── Handlers ────────────────────────────────────────────────────────

  async function registrarPagamento() {
    if (!novoPagamento.parceiro) { toast("Selecione um parceiro.", "error"); return; }
    if (!novoPagamento.valor || isNaN(Number(novoPagamento.valor))) { toast("Informe um valor válido.", "error"); return; }

    setSubmitting(true);
    try {
      const isEdit = modalMode === "edit" && editPagamentoMeta;

      if (isEdit) {
        const res = await apiFetch("/api/pagamentos", {
          method: "PATCH",
          body: JSON.stringify({
            parceiro: novoPagamento.parceiro,
            deliveryId: editPagamentoMeta.deliveryId,
            index: editPagamentoMeta.index,
            valor: Number(novoPagamento.valor),
            data: novoPagamento.data,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data?.success) { toast(data?.error || "Falha ao editar pagamento.", "error"); return; }
        await recarregarEntregas();
        closeModal();
        toast("Pagamento atualizado!", "success");
      } else {
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
      }
    } catch {
      toast("Erro inesperado ao registrar pagamento.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function deletarPagamento(parceiro, deliveryId, index, valor, data) {
    if (!window.confirm(`Excluir pagamento de ${moneyBR(Number(valor))} (${toBRDate(data)})?\nEssa ação não pode ser desfeita.`)) return;
    try {
      const res = await apiFetch("/api/pagamentos", {
        method: "DELETE",
        body: JSON.stringify({ parceiro, deliveryId, index }),
      });
      const resData = await res.json();
      if (!res.ok || !resData?.success) { toast(resData?.error || "Falha ao excluir pagamento.", "error"); return; }
      await recarregarEntregas();
      toast("Pagamento excluído.", "success");
    } catch {
      toast("Erro inesperado ao excluir pagamento.", "error");
    }
  }

  async function registrarEntrega() {
    if (!novaEntrega.parceiro) { toast("Selecione um parceiro.", "error"); return; }

    const itensValidos = (novaEntrega.itens || []).filter(
      (i) => i.sabor && Number(i.quantidade) > 0
    );
    if (itensValidos.length === 0) {
      toast("Adicione pelo menos um sabor com quantidade válida.", "error");
      return;
    }
    if (!novaEntrega.valor_unitario || Number(novaEntrega.valor_unitario) <= 0) {
      toast("Informe um valor unitário válido.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const isEdit = modalMode === "edit";
      const payload = {
        parceiro: novaEntrega.parceiro,
        itens: itensValidos.map((i) => ({
          sabor: i.sabor,
          saborId: i.saborId || undefined,
          quantidade: Number(i.quantidade),
        })),
        valor_unitario: Number(novaEntrega.valor_unitario),
        data: novaEntrega.data,
        ...(novaEntrega.data_validade ? { data_validade: novaEntrega.data_validade } : {}),
      };
      if (isEdit) payload.deliveryId = editDeliveryId;

      const res = await apiFetch("/api/entregas", {
        method: isEdit ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) { toast(data.error || "Erro ao salvar entrega.", "error"); return; }

      await Promise.all([recarregarEntregas(), recarregarSabores()]);
      closeModal();
      toast(isEdit ? "Entrega atualizada!" : "Entrega registrada!", "success");
    } catch {
      toast("Erro inesperado ao salvar entrega.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(parceiro, entrega) {
    const { quantidade } = calcEntrega(entrega);
    const confirmMsg = `Excluir entrega de ${quantidade} trufas em ${toBRDate(entrega.data)}?\n\nEssa ação não pode ser desfeita.`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await apiFetch("/api/entregas", {
        method: "DELETE",
        body: JSON.stringify({ parceiro, deliveryId: entrega.id }),
      });
      const data = await res.json();
      if (!data.success) { toast(data.error || "Erro ao excluir.", "error"); return; }
      await Promise.all([recarregarEntregas(), recarregarSabores()]);
      toast("Entrega excluída.", "success");
    } catch {
      toast("Erro inesperado ao excluir entrega.", "error");
    }
  }

  async function criarParceiro() {
    if (!novoParceiro.username) { toast("Informe o nome de usuário.", "error"); return; }
    if (!novoParceiro.password || novoParceiro.password.length < 6) { toast("A senha precisa ter pelo menos 6 caracteres.", "error"); return; }

    setSubmitting(true);
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
    } finally {
      setSubmitting(false);
    }
  }

  function exportCSV() {
    const rows = [
      ["Parceiro", "Data", "Validade", "Sabores", "Qtd. Total", "Valor Unit.", "Total", "Total Pago", "Saldo", "Situação"],
    ];

    for (const { parceiro, entregas: ents } of entregas) {
      for (const e of ents || []) {
        const { total, totalPago, saldo, quantidade } = calcEntrega(e);
        const sit = saldo === 0 ? "Pago" : saldo < total ? "Parcial" : "Pendente";
        const saboresStr = Array.isArray(e.itens) && e.itens.length > 0
          ? e.itens.map((i) => `${i.sabor}(${i.quantidade})`).join(", ")
          : "-";

        rows.push([
          parceiro,
          e.data,
          e.data_validade || "-",
          saboresStr,
          quantidade,
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
    : modalType === "pagamento" ? (modalMode === "edit" ? "Editar Pagamento" : "Novo Pagamento")
    : modalType === "parceiro" ? "Novo Parceiro"
    : "";

  return (
    <>
      <Topbar user={user} onLogout={handleLogout} isAdmin />

      <div className="min-h-screen bg-[#FFF9FB] pt-14 px-4 py-8 md:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Cabeçalho + ações rápidas — sempre visíveis em qualquer tab */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#4A0E2E]">Dashboard Admin</h1>
              <p className="text-sm text-[#4A0E2E]/50">Doce Agrado</p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                onClick={() => openNovaEntrega()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4A0E2E] text-white text-sm font-semibold hover:opacity-90 transition"
              >
                <Truck className="w-4 h-4" />
                + Entrega
              </button>
              <button
                onClick={() => openPagar()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D1328C] text-white text-sm font-semibold hover:opacity-90 transition"
              >
                <CreditCard className="w-4 h-4" />
                Pagamento
              </button>
              <button
                onClick={() => { setModalType("parceiro"); setModalOpen(true); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-black/10 text-[#4A0E2E] text-sm font-semibold hover:bg-black/3 transition"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden xs:inline">Parceiro</span>
                <span className="xs:hidden">+</span>
              </button>
              <button
                onClick={exportCSV}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-black/10 text-[#4A0E2E] text-sm font-semibold hover:bg-black/3 transition"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exportar</span>
              </button>
            </div>
          </div>

          {/* Cards de resumo — sempre visíveis */}
          <SummaryCardsAdmin resumo={resumoGeral} />

          {/* Abas */}
          <TabBar active={activeTab} onChange={setActiveTab} />

          {/* ── Aba: Geral ── */}
          {activeTab === "geral" && (
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 min-w-0">
                <PartnersTable
                  partners={entregas}
                  onPagar={openPagar}
                  onNovaEntrega={openNovaEntrega}
                  onEditEntrega={openEditEntrega}
                  onDeleteEntrega={handleDelete}
                  onEditPagamento={openEditPagamento}
                  onDeletePagamento={deletarPagamento}
                />
              </div>
              <div className="lg:w-64 shrink-0">
                <EstoquePanel sabores={sabores} />
              </div>
            </div>
          )}

          {/* ── Aba: Produção ── */}
          {activeTab === "producao" && (
            <ProducaoTab
              sabores={sabores}
              ingredientes={ingredientes}
              producoes={producoes}
              onRecarregar={recarregarProducoes}
            />
          )}

          {/* ── Aba: Ingredientes ── */}
          {activeTab === "ingredientes" && (
            <IngredientesTab
              ingredientes={ingredientes}
              onRecarregar={recarregarIngredientes}
            />
          )}

          {/* ── Aba: Catálogo ── */}
          {activeTab === "catalogo" && (
            <CatalogoTab
              sabores={sabores}
              ingredientes={ingredientes}
              onRecarregar={recarregarSabores}
            />
          )}

          {/* ── Aba: Financeiro ── */}
          {activeTab === "financeiro" && (
            <FinanceiroTab entregas={entregas} />
          )}

        </div>
      </div>

      <Modal open={modalOpen} title={modalTitle} onClose={closeModal}>
        {modalType === "entrega" && (
          <EntregaForm
            entregas={entregas}
            sabores={sabores}
            novaEntrega={novaEntrega}
            setNovaEntrega={setNovaEntrega}
            onSubmit={registrarEntrega}
            onCancel={closeModal}
            mode={modalMode}
            isLoading={submitting}
          />
        )}
        {modalType === "pagamento" && (
          <PagamentoForm
            entregas={entregas}
            novoPagamento={novoPagamento}
            setNovoPagamento={setNovoPagamento}
            onSubmit={registrarPagamento}
            onCancel={closeModal}
            isLoading={submitting}
          />
        )}
        {modalType === "parceiro" && (
          <ParceiroForm
            novoParceiro={novoParceiro}
            setNovoParceiro={setNovoParceiro}
            onSubmit={criarParceiro}
            onCancel={closeModal}
            isLoading={submitting}
          />
        )}
      </Modal>
    </>
  );
}
