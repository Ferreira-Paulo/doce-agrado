"use client";

import { useState, useMemo } from "react";
import { Plus, ChefHat, AlertTriangle, ChevronDown, ChevronUp, X } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import { apiFetch } from "@/lib/auth/apiFetch";
import { toBRDate } from "@/components/utils/format";

function badgeEstoqueTrufa(estoque) {
  if (!estoque || estoque <= 0) return { label: "Zerado", cls: "bg-red-100 text-red-700" };
  if (estoque <= 10) return { label: "Baixo", cls: "bg-amber-100 text-amber-700" };
  return { label: `${estoque} un`, cls: "bg-green-100 text-green-700" };
}

export default function ProducaoTab({ sabores, ingredientes, producoes, onRecarregar }) {
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10));
  const [itens, setItens] = useState([{ saborId: "", receitas: "", trufas: "" }]);
  const [historicoAberto, setHistoricoAberto] = useState(false);

  const saboresAtivos = sabores.filter((s) => s.ativo !== false);

  function abrirModal() {
    setItens([{ saborId: "", receitas: "", trufas: "" }]);
    setData(new Date().toISOString().slice(0, 10));
    setModalAberto(true);
  }

  function addItem() {
    setItens([...itens, { saborId: "", receitas: "", trufas: "" }]);
  }

  function removeItem(idx) {
    const novo = itens.filter((_, i) => i !== idx);
    setItens(novo.length > 0 ? novo : [{ saborId: "", receitas: "", trufas: "" }]);
  }

  function updateItem(idx, field, value) {
    setItens(itens.map((it, i) => i === idx ? { ...it, [field]: value } : it));
  }

  const previewConsumo = useMemo(() => {
    const agregado = {};
    for (const item of itens) {
      const sabor = sabores.find((s) => s.id === item.saborId);
      const receitas = Number(item.receitas) || 0;
      if (!sabor || receitas <= 0) continue;
      for (const r of sabor.receita ?? []) {
        if (!r.quantidade_por_receita) continue;
        const necessario = r.quantidade_por_receita * receitas;
        if (!agregado[r.ingredienteId]) {
          const ing = ingredientes.find((i) => i.id === r.ingredienteId);
          agregado[r.ingredienteId] = {
            nome: r.nome,
            unidade: r.unidade,
            necessario: 0,
            disponivel: ing?.estoque ?? 0,
          };
        }
        agregado[r.ingredienteId].necessario = Number(
          (agregado[r.ingredienteId].necessario + necessario).toFixed(4)
        );
      }
    }
    return Object.values(agregado).map((c) => ({
      ...c,
      insuficiente: c.necessario > c.disponivel,
    }));
  }, [itens, sabores, ingredientes]);

  const algumInsuficiente = previewConsumo.some((r) => r.insuficiente);
  const itensPreenchidos = itens.filter((it) => it.saborId && Number(it.receitas) > 0 && Number(it.trufas) > 0);
  const temPreview = itensPreenchidos.length > 0;

  async function registrarProducao() {
    const validos = itens.filter((it) => it.saborId && Number(it.receitas) > 0 && Number(it.trufas) > 0);
    if (validos.length === 0) { toast("Adicione ao menos um sabor com receitas e trufas preenchidas.", "error"); return; }
    for (const it of validos) {
      if (!Number.isInteger(Number(it.receitas)) || !Number.isInteger(Number(it.trufas))) {
        toast("Receitas e trufas devem ser números inteiros.", "error"); return;
      }
    }
    setSubmitting(true);
    try {
      const res = await apiFetch("/api/admin/producao", {
        method: "POST",
        body: JSON.stringify({
          data,
          itens: validos.map((it) => ({
            saborId: it.saborId,
            receitas: Number(it.receitas),
            quantidade: Number(it.trufas),
          })),
        }),
      });
      const result = await res.json();
      if (!result.success) { toast(result.error || "Erro ao registrar.", "error"); return; }
      setModalAberto(false);
      toast("Produção registrada! Estoque atualizado.", "success");
      onRecarregar();
    } catch { toast("Erro inesperado.", "error"); }
    finally { setSubmitting(false); }
  }

  const producoesSorted = [...(producoes || [])].sort((a, b) =>
    String(b.data).localeCompare(String(a.data))
  );

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#4A0E2E] mb-1">Produção</h2>
          <p className="text-sm text-[#4A0E2E]/60">
            Registre lotes de trufas produzidas e acompanhe o estoque por sabor.
          </p>
        </div>
        <button
          onClick={abrirModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#D1328C] text-white rounded-xl text-sm font-semibold hover:bg-[#b52a79] transition"
        >
          <Plus className="w-4 h-4" />
          Registrar produção
        </button>
      </div>

      {/* Estoque de trufas por sabor */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 mb-6">
        <p className="text-sm font-semibold text-[#4A0E2E]/70 mb-4">Estoque atual de trufas</p>
        {saboresAtivos.length === 0 ? (
          <p className="text-sm text-[#4A0E2E]/40">Nenhum sabor ativo.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {saboresAtivos.map((s) => {
              const badge = badgeEstoqueTrufa(s.estoque);
              return (
                <div key={s.id} className="flex flex-col gap-1 p-3 bg-[#D1328C]/5 rounded-xl">
                  <p className="text-xs font-semibold text-[#4A0E2E] truncate">{s.nome}</p>
                  <span className={`self-start text-xs px-2 py-0.5 rounded-full font-semibold ${badge.cls}`}>
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Histórico de produções */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm">
        <button
          className="w-full flex items-center justify-between px-5 py-4 text-left"
          onClick={() => setHistoricoAberto((v) => !v)}
        >
          <p className="text-sm font-semibold text-[#4A0E2E]/70">
            Histórico de produções
            <span className="ml-2 text-xs font-normal text-[#4A0E2E]/40">({producoes?.length ?? 0})</span>
          </p>
          {historicoAberto ? (
            <ChevronUp className="w-4 h-4 text-[#4A0E2E]/40" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#4A0E2E]/40" />
          )}
        </button>

        {historicoAberto && (
          <div className="divide-y divide-black/5 border-t border-black/5">
            {producoesSorted.length === 0 ? (
              <div className="p-6 text-center">
                <ChefHat className="w-7 h-7 text-[#4A0E2E]/20 mx-auto mb-2" />
                <p className="text-sm text-[#4A0E2E]/50">Nenhuma produção registrada ainda.</p>
              </div>
            ) : (
              producoesSorted.map((p) => {
                // suporte ao formato antigo (saborNome/quantidade no topo) e novo (itens[])
                const linhasSabores = Array.isArray(p.itens) && p.itens.length > 0
                  ? p.itens
                  : [{ saborNome: p.saborNome, quantidade: p.quantidade }];
                const ingredientesConsumidos = p.ingredientes_consumidos ?? [];

                return (
                  <div key={p.id} className="px-5 py-3.5">
                    <p className="text-xs text-[#4A0E2E]/50 mb-1.5">{toBRDate(p.data)}</p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {linhasSabores.map((it, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 bg-[#D1328C]/10 text-[#D1328C] rounded-full font-semibold">
                          {it.saborNome} · {it.receitas ? `${it.receitas} rec. → ` : ""}{it.quantidade} un
                        </span>
                      ))}
                    </div>
                    {ingredientesConsumidos.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {ingredientesConsumidos.map((ic, idx) => (
                          <span key={idx} className="text-xs px-2 py-0.5 bg-black/5 text-[#4A0E2E]/60 rounded-full">
                            {ic.nome}: {ic.quantidade} {ic.unidade}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Modal registrar produção */}
      <Modal open={modalAberto} onClose={() => setModalAberto(false)} title="Registrar produção">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#4A0E2E]/70 mb-1.5">Data</label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full px-3 py-2.5 border border-black/10 rounded-xl text-sm text-[#4A0E2E] focus:outline-none focus:ring-2 focus:ring-[#D1328C]/30 transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#4A0E2E]/70">Sabores produzidos</label>
              <button
                onClick={addItem}
                className="flex items-center gap-1 text-xs font-semibold text-[#D1328C] hover:text-[#b52a79] transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar sabor
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {itens.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <select
                    value={item.saborId}
                    onChange={(e) => updateItem(idx, "saborId", e.target.value)}
                    className="flex-1 px-3 py-2.5 border border-black/10 rounded-xl text-sm text-[#4A0E2E] focus:outline-none focus:ring-2 focus:ring-[#D1328C]/30 transition"
                  >
                    <option value="">Selecione...</option>
                    {saboresAtivos.map((s) => (
                      <option key={s.id} value={s.id}>{s.nome}</option>
                    ))}
                  </select>
                  <div className="flex flex-col items-center gap-0.5">
                    <input
                      type="number"
                      min="1"
                      step="1"
                      placeholder="0"
                      value={item.receitas}
                      onChange={(e) => updateItem(idx, "receitas", e.target.value)}
                      className="w-20 px-2 py-2.5 border border-black/10 rounded-xl text-sm text-[#4A0E2E] text-center focus:outline-none focus:ring-2 focus:ring-[#D1328C]/30 transition"
                    />
                    <span className="text-xs text-[#4A0E2E]/40">receitas</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <input
                      type="number"
                      min="1"
                      step="1"
                      placeholder="0"
                      value={item.trufas}
                      onChange={(e) => updateItem(idx, "trufas", e.target.value)}
                      className="w-20 px-2 py-2.5 border border-black/10 rounded-xl text-sm text-[#4A0E2E] text-center focus:outline-none focus:ring-2 focus:ring-[#D1328C]/30 transition"
                    />
                    <span className="text-xs text-[#4A0E2E]/40">trufas</span>
                  </div>
                  {itens.length > 1 && (
                    <button
                      onClick={() => removeItem(idx)}
                      className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition shrink-0 mt-0.5"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {temPreview && (
            <div className={`rounded-xl p-3 text-xs ${algumInsuficiente ? "bg-amber-50 border border-amber-200" : "bg-[#D1328C]/5 border border-[#D1328C]/10"}`}>
              <p className={`font-semibold mb-2 ${algumInsuficiente ? "text-amber-800" : "text-[#4A0E2E]/70"}`}>
                Ingredientes que serão consumidos:
              </p>
              {previewConsumo.length === 0 ? (
                <p className="text-[#4A0E2E]/50 italic">Nenhuma receita cadastrada para os sabores selecionados.</p>
              ) : (
                <ul className="space-y-1">
                  {previewConsumo.map((r, i) => (
                    <li key={i} className={`flex items-center justify-between gap-2 ${r.insuficiente ? "text-amber-700" : "text-[#4A0E2E]/70"}`}>
                      <span>{r.nome}</span>
                      <span className="font-semibold">
                        {r.necessario} {r.unidade}
                        {r.insuficiente && (
                          <span className="ml-1 text-amber-600">(disponível: {r.disponivel})</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {algumInsuficiente && (
                <div className="flex items-center gap-1.5 mt-2 text-amber-700">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Estoque de alguns ingredientes é insuficiente.</span>
                </div>
              )}
            </div>
          )}

          <button
            onClick={registrarProducao}
            disabled={submitting || itensPreenchidos.length === 0}
            className="w-full py-2.5 bg-[#D1328C] text-white rounded-xl text-sm font-semibold hover:bg-[#b52a79] transition disabled:opacity-50"
          >
            {submitting ? "Registrando..." : `Confirmar produção${itensPreenchidos.length > 1 ? ` (${itensPreenchidos.length} sabores)` : ""}`}
          </button>
        </div>
      </Modal>
    </div>
  );
}
