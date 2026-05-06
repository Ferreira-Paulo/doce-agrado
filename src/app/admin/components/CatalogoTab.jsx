"use client";

import { useState } from "react";
import { Pencil, Trash2, Check, X, Plus, Tag, BookOpen } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import { apiFetch } from "@/lib/auth/apiFetch";

function badgeEstoque(estoque) {
  if (!estoque || estoque <= 0) return { label: "Zerado", cls: "bg-red-100 text-red-700" };
  if (estoque <= 10) return { label: `${estoque} un`, cls: "bg-amber-100 text-amber-700" };
  return { label: `${estoque} un`, cls: "bg-green-100 text-green-700" };
}

export default function CatalogoTab({ sabores, ingredientes = [], onRecarregar }) {
  const toast = useToast();
  const [novoNome, setNovoNome] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [editandoNome, setEditandoNome] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [receitaModal, setReceitaModal] = useState(null);
  const [receitaItens, setReceitaItens] = useState([]);

  function abrirReceita(sabor) {
    setReceitaModal(sabor);
    setReceitaItens(
      Array.isArray(sabor.receita) && sabor.receita.length > 0
        ? sabor.receita.map((r) => ({ ...r }))
        : []
    );
  }

  function addItemReceita() {
    setReceitaItens([...receitaItens, { ingredienteId: "", nome: "", unidade: "", quantidade_por_trufa: "" }]);
  }

  function removeItemReceita(idx) {
    setReceitaItens(receitaItens.filter((_, i) => i !== idx));
  }

  function updateItemReceita(idx, field, value) {
    setReceitaItens(receitaItens.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  }

  function selectIngredienteReceita(idx, ingredienteId) {
    const ing = ingredientes.find((i) => i.id === ingredienteId);
    setReceitaItens(receitaItens.map((r, i) =>
      i === idx
        ? { ...r, ingredienteId: ing?.id ?? "", nome: ing?.nome ?? "", unidade: ing?.unidade ?? "" }
        : r
    ));
  }

  async function salvarReceita() {
    if (!receitaModal) return;
    const receita = receitaItens
      .filter((r) => r.ingredienteId)
      .map((r) => ({
        ingredienteId: r.ingredienteId,
        nome: r.nome,
        unidade: r.unidade,
        quantidade_por_receita: r.quantidade_por_receita ? Number(r.quantidade_por_receita) : null,
      }));
    setSubmitting(true);
    try {
      const res = await apiFetch("/api/admin/sabores", {
        method: "PATCH",
        body: JSON.stringify({ id: receitaModal.id, receita }),
      });
      const data = await res.json();
      if (!data.success) { toast(data.error || "Erro ao salvar receita.", "error"); return; }
      setReceitaModal(null);
      toast("Receita salva!", "success");
      onRecarregar();
    } catch { toast("Erro inesperado.", "error"); }
    finally { setSubmitting(false); }
  }

  async function adicionarSabor() {
    const nome = novoNome.trim();
    if (nome.length < 2) { toast("Nome deve ter pelo menos 2 caracteres.", "error"); return; }
    setSubmitting(true);
    try {
      const res = await apiFetch("/api/admin/sabores", { method: "POST", body: JSON.stringify({ nome }) });
      const data = await res.json();
      if (!data.success) { toast(data.error || "Erro ao criar sabor.", "error"); return; }
      setNovoNome("");
      toast(`Sabor "${nome}" adicionado!`, "success");
      onRecarregar();
    } catch { toast("Erro inesperado.", "error"); }
    finally { setSubmitting(false); }
  }

  async function salvarEdicao(id) {
    const nome = editandoNome.trim();
    if (nome.length < 2) { toast("Nome inválido.", "error"); return; }
    setSubmitting(true);
    try {
      const res = await apiFetch("/api/admin/sabores", { method: "PATCH", body: JSON.stringify({ id, nome }) });
      const data = await res.json();
      if (!data.success) { toast(data.error || "Erro ao editar.", "error"); return; }
      setEditandoId(null);
      toast("Sabor atualizado!", "success");
      onRecarregar();
    } catch { toast("Erro inesperado.", "error"); }
    finally { setSubmitting(false); }
  }

  async function toggleAtivo(sabor) {
    try {
      const res = await apiFetch("/api/admin/sabores", { method: "PATCH", body: JSON.stringify({ id: sabor.id, ativo: !sabor.ativo }) });
      const data = await res.json();
      if (!data.success) { toast(data.error || "Erro.", "error"); return; }
      toast(sabor.ativo ? "Sabor desativado." : "Sabor ativado.", "success");
      onRecarregar();
    } catch { toast("Erro inesperado.", "error"); }
  }

  async function excluirSabor(sabor) {
    if (!window.confirm(`Excluir "${sabor.nome}"? Isso não pode ser desfeito.`)) return;
    try {
      const res = await apiFetch("/api/admin/sabores", { method: "DELETE", body: JSON.stringify({ id: sabor.id }) });
      const data = await res.json();
      if (!data.success) { toast(data.error || "Erro ao excluir.", "error"); return; }
      toast("Sabor excluído.", "success");
      onRecarregar();
    } catch { toast("Erro inesperado.", "error"); }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-[#4A0E2E] mb-1">Catálogo de Sabores</h2>
      <p className="text-sm text-[#4A0E2E]/60 mb-6">
        Gerencie os sabores, defina receitas e acompanhe o estoque de trufas.
      </p>

      {/* Adicionar novo sabor */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 mb-6">
        <p className="text-sm font-semibold text-[#4A0E2E]/70 mb-3">Adicionar sabor</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ex: Maracujá"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && adicionarSabor()}
            className="flex-1 px-4 py-2.5 border border-black/10 rounded-xl text-sm text-[#4A0E2E] bg-white focus:outline-none focus:ring-2 focus:ring-[#D1328C]/30 focus:border-[#D1328C] transition"
          />
          <button
            onClick={adicionarSabor}
            disabled={submitting || novoNome.trim().length < 2}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#D1328C] text-white rounded-xl text-sm font-semibold hover:bg-[#b52a79] transition disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </div>
      </div>

      {/* Lista de sabores */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm divide-y divide-black/5">
        {sabores.length === 0 ? (
          <div className="p-8 text-center">
            <Tag className="w-8 h-8 text-[#4A0E2E]/20 mx-auto mb-2" />
            <p className="text-sm text-[#4A0E2E]/50">Nenhum sabor cadastrado ainda.</p>
            <p className="text-xs text-[#4A0E2E]/35 mt-1">
              Adicione os sabores acima para usá-los nas entregas.
            </p>
          </div>
        ) : (
          sabores.map((s) => {
            const badge = badgeEstoque(s.estoque);
            const temReceita = Array.isArray(s.receita) && s.receita.length > 0;
            return (
              <div key={s.id} className="px-4 py-3.5">
                {editandoId === s.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editandoNome}
                      onChange={(e) => setEditandoNome(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") salvarEdicao(s.id);
                        if (e.key === "Escape") setEditandoId(null);
                      }}
                      autoFocus
                      className="flex-1 px-3 py-1.5 border border-[#D1328C]/40 rounded-lg text-sm text-[#4A0E2E] focus:outline-none focus:ring-2 focus:ring-[#D1328C]/30"
                    />
                    <button onClick={() => salvarEdicao(s.id)} disabled={submitting} className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition" title="Salvar">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditandoId(null)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 transition" title="Cancelar">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`flex-1 text-sm font-semibold min-w-0 truncate ${s.ativo === false ? "text-[#4A0E2E]/30 line-through" : "text-[#4A0E2E]"}`}>
                      {s.nome}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${badge.cls}`}>
                      {badge.label}
                    </span>
                    <button
                      onClick={() => toggleAtivo(s)}
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold transition ${
                        s.ativo !== false
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {s.ativo !== false ? "Ativo" : "Inativo"}
                    </button>
                    <button
                      onClick={() => abrirReceita(s)}
                      className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold transition ${
                        temReceita
                          ? "bg-[#D1328C]/10 text-[#D1328C] hover:bg-[#D1328C]/20"
                          : "bg-black/5 text-[#4A0E2E]/50 hover:bg-black/10"
                      }`}
                      title="Editar receita"
                    >
                      <BookOpen className="w-3 h-3" />
                      {temReceita ? "Receita" : "Sem receita"}
                    </button>
                    <button
                      onClick={() => { setEditandoId(s.id); setEditandoNome(s.nome); }}
                      className="p-1.5 rounded-lg text-[#4A0E2E]/40 hover:text-[#4A0E2E] hover:bg-black/5 transition"
                      title="Renomear"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => excluirSabor(s)}
                      className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal de receita */}
      <Modal open={!!receitaModal} onClose={() => setReceitaModal(null)} title={`Receita — ${receitaModal?.nome ?? ""}`}>
        <div className="flex flex-col gap-4">
          <p className="text-xs text-[#4A0E2E]/60">
            Liste os ingredientes usados. A quantidade por receita é opcional — se informada, o sistema desconta automaticamente ao registrar produção.
          </p>

          <div className="flex flex-col gap-2">
            {receitaItens.map((r, idx) => {
              const ing = ingredientes.find((i) => i.id === r.ingredienteId);
              return (
                <div key={idx} className="flex gap-2 items-center">
                  <select
                    value={r.ingredienteId}
                    onChange={(e) => selectIngredienteReceita(idx, e.target.value)}
                    className="flex-1 px-3 py-2 border border-black/10 rounded-xl text-sm text-[#4A0E2E] focus:outline-none focus:ring-2 focus:ring-[#D1328C]/30 transition"
                  >
                    <option value="">Selecione...</option>
                    {ingredientes.map((i) => (
                      <option key={i.id} value={i.id}>{i.nome}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0.001"
                      step="0.001"
                      placeholder="Qtd"
                      value={r.quantidade_por_receita ?? ""}
                      onChange={(e) => updateItemReceita(idx, "quantidade_por_receita", e.target.value)}
                      className="w-20 px-2 py-2 border border-black/10 rounded-xl text-sm text-[#4A0E2E] text-center focus:outline-none focus:ring-2 focus:ring-[#D1328C]/30 transition"
                    />
                    <span className="text-xs text-[#4A0E2E]/50 w-6">{ing?.unidade ?? ""}</span>
                  </div>
                  <button onClick={() => removeItemReceita(idx)} className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          <button
            onClick={addItemReceita}
            className="flex items-center gap-1.5 text-sm text-[#D1328C] font-semibold hover:text-[#b52a79] transition"
          >
            <Plus className="w-4 h-4" />
            Adicionar ingrediente
          </button>

          {ingredientes.length === 0 && (
            <p className="text-xs text-[#4A0E2E]/50 bg-black/5 px-3 py-2 rounded-xl">
              Nenhum ingrediente cadastrado. Adicione ingredientes na aba Ingredientes primeiro.
            </p>
          )}

          <button
            onClick={salvarReceita}
            disabled={submitting}
            className="w-full py-2.5 bg-[#D1328C] text-white rounded-xl text-sm font-semibold hover:bg-[#b52a79] transition disabled:opacity-50"
          >
            {submitting ? "Salvando..." : "Salvar receita"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
