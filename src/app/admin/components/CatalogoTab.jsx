"use client";

import { useState } from "react";
import { Pencil, Trash2, Check, X, Plus, Tag } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { apiFetch } from "@/lib/auth/apiFetch";

export default function CatalogoTab({ sabores, onRecarregar }) {
  const toast = useToast();
  const [novoNome, setNovoNome] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [editandoNome, setEditandoNome] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
    } catch {
      toast("Erro inesperado.", "error");
    } finally {
      setSubmitting(false);
    }
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
    } catch {
      toast("Erro inesperado.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleAtivo(sabor) {
    try {
      const res = await apiFetch("/api/admin/sabores", { method: "PATCH", body: JSON.stringify({ id: sabor.id, ativo: !sabor.ativo }) });
      const data = await res.json();
      if (!data.success) { toast(data.error || "Erro.", "error"); return; }
      toast(sabor.ativo ? "Sabor desativado." : "Sabor ativado.", "success");
      onRecarregar();
    } catch {
      toast("Erro inesperado.", "error");
    }
  }

  async function excluirSabor(sabor) {
    if (!window.confirm(`Excluir "${sabor.nome}"? Isso não pode ser desfeito.`)) return;
    try {
      const res = await apiFetch("/api/admin/sabores", { method: "DELETE", body: JSON.stringify({ id: sabor.id }) });
      const data = await res.json();
      if (!data.success) { toast(data.error || "Erro ao excluir.", "error"); return; }
      toast("Sabor excluído.", "success");
      onRecarregar();
    } catch {
      toast("Erro inesperado.", "error");
    }
  }

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-bold text-[#4A0E2E] mb-1">Catálogo de Sabores</h2>
      <p className="text-sm text-[#4A0E2E]/60 mb-6">
        Gerencie os sabores disponíveis para seleção nas entregas.
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
          sabores.map((s) => (
            <div key={s.id} className="flex items-center gap-3 px-4 py-3.5">
              {editandoId === s.id ? (
                <>
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
                  <button
                    onClick={() => salvarEdicao(s.id)}
                    disabled={submitting}
                    className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition"
                    title="Salvar"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditandoId(null)}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 transition"
                    title="Cancelar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className={`flex-1 text-sm font-semibold ${s.ativo === false ? "text-[#4A0E2E]/30 line-through" : "text-[#4A0E2E]"}`}>
                    {s.nome}
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
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
