"use client";

import { useState } from "react";
import {
  Plus, Pencil, Trash2, Check, X, ShoppingCart, AlertTriangle,
  Package, FlaskConical, Sliders,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import { apiFetch } from "@/lib/auth/apiFetch";

const UNIDADES = ["g", "kg", "ml", "L", "un"];

function badgeEstoque(ing) {
  if (ing.estoque <= 0) return { label: "Zerado", cls: "bg-red-100 text-red-700" };
  if (ing.estoque <= ing.estoque_minimo) return { label: "Baixo", cls: "bg-amber-100 text-amber-700" };
  return { label: "OK", cls: "bg-green-100 text-green-700" };
}

export default function IngredientesTab({ ingredientes, onRecarregar }) {
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [modalNovo, setModalNovo] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novaUnidade, setNovaUnidade] = useState("g");
  const [novoMinimo, setNovoMinimo] = useState("");

  const [editandoId, setEditandoId] = useState(null);
  const [editNome, setEditNome] = useState("");
  const [editUnidade, setEditUnidade] = useState("g");
  const [editMinimo, setEditMinimo] = useState("");

  const [compraId, setCompraId] = useState(null);
  const [compraQtd, setCompraQtd] = useState("");
  const [compraValor, setCompraValor] = useState("");
  const [compraData, setCompraData] = useState(() => new Date().toISOString().slice(0, 10));
  const [compraDesc, setCompraDesc] = useState("");

  const [ajusteId, setAjusteId] = useState(null);
  const [ajusteQtd, setAjusteQtd] = useState("");

  const ingredienteCompra = ingredientes.find((i) => i.id === compraId);
  const ingredienteAjuste = ingredientes.find((i) => i.id === ajusteId);

  async function criarIngrediente() {
    const nome = novoNome.trim();
    if (nome.length < 2) { toast("Nome deve ter pelo menos 2 caracteres.", "error"); return; }
    const minimo = Number(novoMinimo || 0);
    if (isNaN(minimo) || minimo < 0) { toast("Estoque mínimo inválido.", "error"); return; }
    setSubmitting(true);
    try {
      const res = await apiFetch("/api/admin/ingredientes", {
        method: "POST",
        body: JSON.stringify({ nome, unidade: novaUnidade, estoque_minimo: minimo }),
      });
      const data = await res.json();
      if (!data.success) { toast(data.error || "Erro ao criar.", "error"); return; }
      setModalNovo(false);
      setNovoNome(""); setNovaUnidade("g"); setNovoMinimo("");
      toast("Ingrediente criado!", "success");
      onRecarregar();
    } catch { toast("Erro inesperado.", "error"); }
    finally { setSubmitting(false); }
  }

  function abrirEdicao(ing) {
    setEditandoId(ing.id);
    setEditNome(ing.nome);
    setEditUnidade(ing.unidade || "g");
    setEditMinimo(String(ing.estoque_minimo ?? ""));
  }

  async function salvarEdicao(id) {
    const nome = editNome.trim();
    if (nome.length < 2) { toast("Nome inválido.", "error"); return; }
    const minimo = Number(editMinimo || 0);
    if (isNaN(minimo) || minimo < 0) { toast("Estoque mínimo inválido.", "error"); return; }
    setSubmitting(true);
    try {
      const res = await apiFetch("/api/admin/ingredientes", {
        method: "PATCH",
        body: JSON.stringify({ id, nome, unidade: editUnidade, estoque_minimo: minimo }),
      });
      const data = await res.json();
      if (!data.success) { toast(data.error || "Erro.", "error"); return; }
      setEditandoId(null);
      toast("Ingrediente atualizado!", "success");
      onRecarregar();
    } catch { toast("Erro inesperado.", "error"); }
    finally { setSubmitting(false); }
  }

  async function excluir(ing) {
    if (!window.confirm(`Excluir "${ing.nome}"? Isso não pode ser desfeito.`)) return;
    try {
      const res = await apiFetch("/api/admin/ingredientes", {
        method: "DELETE",
        body: JSON.stringify({ id: ing.id }),
      });
      const data = await res.json();
      if (!data.success) { toast(data.error || "Erro.", "error"); return; }
      toast("Ingrediente excluído.", "success");
      onRecarregar();
    } catch { toast("Erro inesperado.", "error"); }
  }

  async function registrarCompra() {
    const qtd = Number(compraQtd);
    const valor = Number(compraValor);
    if (!Number.isFinite(qtd) || qtd <= 0) { toast("Quantidade inválida.", "error"); return; }
    if (!Number.isFinite(valor) || valor <= 0) { toast("Valor inválido.", "error"); return; }
    setSubmitting(true);
    try {
      const res = await apiFetch("/api/admin/ingredientes/compra", {
        method: "POST",
        body: JSON.stringify({
          ingredienteId: compraId,
          quantidade: qtd,
          valor,
          data: compraData,
          descricao: compraDesc.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) { toast(data.error || "Erro.", "error"); return; }
      setCompraId(null);
      setCompraQtd(""); setCompraValor(""); setCompraDesc("");
      toast("Compra registrada e estoque atualizado!", "success");
      onRecarregar();
    } catch { toast("Erro inesperado.", "error"); }
    finally { setSubmitting(false); }
  }

  async function registrarAjuste() {
    const e = Number(ajusteQtd);
    if (!Number.isFinite(e) || e < 0) { toast("Quantidade inválida.", "error"); return; }
    setSubmitting(true);
    try {
      const res = await apiFetch("/api/admin/ingredientes", {
        method: "PATCH",
        body: JSON.stringify({ id: ajusteId, estoque: e }),
      });
      const data = await res.json();
      if (!data.success) { toast(data.error || "Erro.", "error"); return; }
      setAjusteId(null); setAjusteQtd("");
      toast("Estoque ajustado!", "success");
      onRecarregar();
    } catch { toast("Erro inesperado.", "error"); }
    finally { setSubmitting(false); }
  }

  const baixoEstoque = ingredientes.filter(
    (i) => i.estoque <= i.estoque_minimo && i.estoque_minimo > 0
  );

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#4A0E2E] mb-1">Ingredientes</h2>
          <p className="text-sm text-[#4A0E2E]/60">
            Gerencie o estoque de ingredientes usados na produção.
          </p>
        </div>
        <button
          onClick={() => setModalNovo(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#D1328C] text-white rounded-xl text-sm font-semibold hover:bg-[#b52a79] transition"
        >
          <Plus className="w-4 h-4" />
          Novo ingrediente
        </button>
      </div>

      {baixoEstoque.length > 0 && (
        <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Estoque baixo</p>
            <p className="text-xs text-amber-700 mt-0.5">
              {baixoEstoque.map((i) => `${i.nome} (${i.estoque}${i.unidade})`).join(", ")}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-black/5 shadow-sm divide-y divide-black/5">
        {ingredientes.length === 0 ? (
          <div className="p-8 text-center">
            <FlaskConical className="w-8 h-8 text-[#4A0E2E]/20 mx-auto mb-2" />
            <p className="text-sm text-[#4A0E2E]/50">Nenhum ingrediente cadastrado ainda.</p>
          </div>
        ) : (
          ingredientes.map((ing) => {
            const badge = badgeEstoque(ing);
            return (
              <div key={ing.id} className="px-4 py-4">
                {editandoId === ing.id ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editNome}
                        onChange={(e) => setEditNome(e.target.value)}
                        placeholder="Nome"
                        className="flex-1 px-3 py-2 border border-[#D1328C]/40 rounded-xl text-sm text-[#4A0E2E] focus:outline-none focus:ring-2 focus:ring-[#D1328C]/30"
                      />
                      <select
                        value={editUnidade}
                        onChange={(e) => setEditUnidade(e.target.value)}
                        className="px-3 py-2 border border-black/10 rounded-xl text-sm text-[#4A0E2E] focus:outline-none focus:ring-2 focus:ring-[#D1328C]/30"
                      >
                        {UNIDADES.map((u) => <option key={u} value={u}>{u}</option>)}
                      </select>
                      <input
                        type="number"
                        min="0"
                        value={editMinimo}
                        onChange={(e) => setEditMinimo(e.target.value)}
                        placeholder="Mínimo"
                        className="w-28 px-3 py-2 border border-black/10 rounded-xl text-sm text-[#4A0E2E] focus:outline-none focus:ring-2 focus:ring-[#D1328C]/30"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => salvarEdicao(ing.id)} disabled={submitting} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition disabled:opacity-50">
                        <Check className="w-3.5 h-3.5" /> Salvar
                      </button>
                      <button onClick={() => setEditandoId(null)} className="flex items-center gap-1 px-3 py-1.5 border border-black/10 text-[#4A0E2E]/60 rounded-lg text-xs font-semibold hover:bg-black/5 transition">
                        <X className="w-3.5 h-3.5" /> Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#4A0E2E] truncate">{ing.nome}</p>
                      <p className="text-xs text-[#4A0E2E]/50 mt-0.5">
                        Estoque: <span className="font-semibold text-[#4A0E2E]/80">{ing.estoque ?? 0} {ing.unidade}</span>
                        {ing.estoque_minimo > 0 && <> · Mínimo: {ing.estoque_minimo} {ing.unidade}</>}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${badge.cls}`}>
                      {badge.label}
                    </span>
                    <button
                      onClick={() => { setCompraId(ing.id); setCompraQtd(""); setCompraValor(""); setCompraDesc(""); setCompraData(new Date().toISOString().slice(0, 10)); }}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-[#D1328C]/10 text-[#D1328C] rounded-lg text-xs font-semibold hover:bg-[#D1328C]/20 transition"
                      title="Registrar compra"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Compra
                    </button>
                    <button
                      onClick={() => { setAjusteId(ing.id); setAjusteQtd(String(ing.estoque ?? 0)); }}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-black/5 text-[#4A0E2E]/70 rounded-lg text-xs font-semibold hover:bg-black/10 transition"
                      title="Ajuste manual de estoque"
                    >
                      <Sliders className="w-3.5 h-3.5" /> Ajustar
                    </button>
                    <button onClick={() => abrirEdicao(ing)} className="p-1.5 rounded-lg text-[#4A0E2E]/40 hover:text-[#4A0E2E] hover:bg-black/5 transition" title="Editar">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => excluir(ing)} className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition" title="Excluir">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal novo ingrediente */}
      <Modal open={modalNovo} onClose={() => setModalNovo(false)} title="Novo ingrediente">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#4A0E2E]/70 mb-1.5">Nome</label>
            <input
              type="text"
              placeholder="Ex: Chocolate meio amargo"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              className="w-full px-3 py-2.5 border border-black/10 rounded-xl text-sm text-[#4A0E2E] focus:outline-none focus:ring-2 focus:ring-[#D1328C]/30 focus:border-[#D1328C] transition"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-[#4A0E2E]/70 mb-1.5">Unidade</label>
              <select
                value={novaUnidade}
                onChange={(e) => setNovaUnidade(e.target.value)}
                className="w-full px-3 py-2.5 border border-black/10 rounded-xl text-sm text-[#4A0E2E] focus:outline-none focus:ring-2 focus:ring-[#D1328C]/30 transition"
              >
                {UNIDADES.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-[#4A0E2E]/70 mb-1.5">Estoque mínimo</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={novoMinimo}
                onChange={(e) => setNovoMinimo(e.target.value)}
                className="w-full px-3 py-2.5 border border-black/10 rounded-xl text-sm text-[#4A0E2E] focus:outline-none focus:ring-2 focus:ring-[#D1328C]/30 transition"
              />
            </div>
          </div>
          <button
            onClick={criarIngrediente}
            disabled={submitting || novoNome.trim().length < 2}
            className="w-full py-2.5 bg-[#D1328C] text-white rounded-xl text-sm font-semibold hover:bg-[#b52a79] transition disabled:opacity-50"
          >
            {submitting ? "Criando..." : "Criar ingrediente"}
          </button>
        </div>
      </Modal>

      {/* Modal compra */}
      <Modal open={!!compraId} onClose={() => setCompraId(null)} title={`Registrar compra — ${ingredienteCompra?.nome ?? ""}`}>
        <div className="flex flex-col gap-4">
          <p className="text-xs text-[#4A0E2E]/60">
            Estoque atual: <strong>{ingredienteCompra?.estoque ?? 0} {ingredienteCompra?.unidade}</strong>
          </p>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-[#4A0E2E]/70 mb-1.5">Quantidade ({ingredienteCompra?.unidade})</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0"
                value={compraQtd}
                onChange={(e) => setCompraQtd(e.target.value)}
                className="w-full px-3 py-2.5 border border-black/10 rounded-xl text-sm text-[#4A0E2E] focus:outline-none focus:ring-2 focus:ring-[#D1328C]/30 transition"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-[#4A0E2E]/70 mb-1.5">Valor pago (R$)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0,00"
                value={compraValor}
                onChange={(e) => setCompraValor(e.target.value)}
                className="w-full px-3 py-2.5 border border-black/10 rounded-xl text-sm text-[#4A0E2E] focus:outline-none focus:ring-2 focus:ring-[#D1328C]/30 transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#4A0E2E]/70 mb-1.5">Data</label>
            <input
              type="date"
              value={compraData}
              onChange={(e) => setCompraData(e.target.value)}
              className="w-full px-3 py-2.5 border border-black/10 rounded-xl text-sm text-[#4A0E2E] focus:outline-none focus:ring-2 focus:ring-[#D1328C]/30 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#4A0E2E]/70 mb-1.5">Descrição (opcional)</label>
            <input
              type="text"
              placeholder={`Compra de ${ingredienteCompra?.nome ?? ""}`}
              value={compraDesc}
              onChange={(e) => setCompraDesc(e.target.value)}
              className="w-full px-3 py-2.5 border border-black/10 rounded-xl text-sm text-[#4A0E2E] focus:outline-none focus:ring-2 focus:ring-[#D1328C]/30 transition"
            />
          </div>
          <p className="text-xs text-[#4A0E2E]/50 bg-[#D1328C]/5 px-3 py-2 rounded-xl">
            O gasto será lançado automaticamente na aba Financeiro como &quot;Matéria-prima&quot;.
          </p>
          <button
            onClick={registrarCompra}
            disabled={submitting || !compraQtd || !compraValor}
            className="w-full py-2.5 bg-[#D1328C] text-white rounded-xl text-sm font-semibold hover:bg-[#b52a79] transition disabled:opacity-50"
          >
            {submitting ? "Registrando..." : "Confirmar compra"}
          </button>
        </div>
      </Modal>

      {/* Modal ajuste manual */}
      <Modal open={!!ajusteId} onClose={() => setAjusteId(null)} title={`Ajuste manual — ${ingredienteAjuste?.nome ?? ""}`}>
        <div className="flex flex-col gap-4">
          <p className="text-xs text-[#4A0E2E]/60">
            Defina o valor correto do estoque atual (use para corrigir contagem ou registrar perda).
          </p>
          <div>
            <label className="block text-xs font-semibold text-[#4A0E2E]/70 mb-1.5">
              Estoque real ({ingredienteAjuste?.unidade})
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={ajusteQtd}
              onChange={(e) => setAjusteQtd(e.target.value)}
              className="w-full px-3 py-2.5 border border-black/10 rounded-xl text-sm text-[#4A0E2E] focus:outline-none focus:ring-2 focus:ring-[#D1328C]/30 transition"
            />
          </div>
          <button
            onClick={registrarAjuste}
            disabled={submitting || ajusteQtd === ""}
            className="w-full py-2.5 bg-[#4A0E2E] text-white rounded-xl text-sm font-semibold hover:bg-[#3a0c24] transition disabled:opacity-50"
          >
            {submitting ? "Salvando..." : "Salvar ajuste"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
