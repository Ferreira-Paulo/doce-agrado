"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  ChevronLeft, ChevronRight, Plus, Pencil, Trash2, TrendingUp,
  TrendingDown, Minus, Wallet,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import { apiFetch } from "@/lib/auth/apiFetch";
import { calcEntrega } from "@/components/utils/calc";
import { moneyBR, toBRDate } from "@/components/utils/format";

// ─── Constantes ──────────────────────────────────────────────────────────────

const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
               "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const MESES_CURTO = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
                     "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const CATEGORIAS = [
  { value: "materia-prima", label: "Matéria-prima" },
  { value: "embalagem",     label: "Embalagem" },
  { value: "transporte",    label: "Transporte" },
  { value: "marketing",     label: "Marketing" },
  { value: "outros",        label: "Outros" },
];

function labelCategoria(v) {
  return CATEGORIAS.find((c) => c.value === v)?.label ?? v;
}

function round2(n) { return Math.round(n * 100) / 100; }

// ─── Cálculos ─────────────────────────────────────────────────────────────────

function calcReceita(entregas, mesAno) {
  let total = 0;
  const lista = [];
  for (const { parceiro, entregas: ents } of entregas) {
    for (const e of ents || []) {
      for (const p of e.pagamentos || []) {
        if (String(p.data || "").slice(0, 7) === mesAno) {
          const v = Number(p.valor || 0);
          total += v;
          lista.push({ valor: v, data: p.data, parceiro });
        }
      }
    }
  }
  return { total: round2(total), lista: lista.sort((a, b) => String(b.data).localeCompare(String(a.data))) };
}

function calcGastosMes(gastos, mesAno) {
  return (gastos || []).filter((g) => String(g.data || "").slice(0, 7) === mesAno);
}

function calcAReceber(entregas) {
  let total = 0;
  for (const { entregas: ents } of entregas) {
    for (const e of ents || []) {
      const { saldo } = calcEntrega(e);
      if (saldo > 0) total += saldo;
    }
  }
  return round2(total);
}

function calcAnual(entregas, gastos, ano) {
  return Array.from({ length: 12 }, (_, i) => {
    const mesAno = `${ano}-${String(i + 1).padStart(2, "0")}`;
    const receita = calcReceita(entregas, mesAno).total;
    const gastosTotal = calcGastosMes(gastos, mesAno)
      .reduce((acc, g) => acc + Number(g.valor || 0), 0);
    return {
      label: MESES_CURTO[i],
      receita: round2(receita),
      gastos: round2(gastosTotal),
      lucro: round2(receita - gastosTotal),
    };
  });
}

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function SummaryCard({ label, value, icon: Icon, cor }) {
  const cores = {
    green:  { bg: "bg-green-50",  text: "text-green-700",  icon: "text-green-500"  },
    red:    { bg: "bg-red-50",    text: "text-red-700",    icon: "text-red-400"    },
    purple: { bg: "bg-[#D1328C]/8", text: "text-[#4A0E2E]", icon: "text-[#D1328C]" },
    yellow: { bg: "bg-yellow-50", text: "text-yellow-700", icon: "text-yellow-500" },
  };
  const c = cores[cor] ?? cores.purple;

  return (
    <div className={`rounded-2xl ${c.bg} p-5`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${c.icon}`} />
        <p className={`text-xs font-semibold uppercase tracking-wide ${c.icon} opacity-70`}>{label}</p>
      </div>
      <p className={`text-xl font-bold ${c.text}`}>{value}</p>
    </div>
  );
}

const inputCls =
  "px-4 py-3 border border-black/10 rounded-xl w-full text-[#4A0E2E] bg-white focus:outline-none focus:ring-2 focus:ring-[#D1328C]/30 focus:border-[#D1328C] transition text-sm";

const GASTO_VAZIO = { data: "", categoria: "materia-prima", descricao: "", valor: "" };

// ─── Componente principal ─────────────────────────────────────────────────────

export default function FinanceiroTab({ entregas }) {
  const toast = useToast();

  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth() + 1);

  const [gastos, setGastos] = useState([]);
  const [loadingGastos, setLoadingGastos] = useState(true);
  const [modalGasto, setModalGasto] = useState(null); // null | { mode, dados }
  const [submitting, setSubmitting] = useState(false);

  const mesAno = `${ano}-${String(mes).padStart(2, "0")}`;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchGastos(); }, []);

  async function fetchGastos() {
    setLoadingGastos(true);
    try {
      const res = await apiFetch("/api/admin/gastos");
      const data = await res.json();
      setGastos(Array.isArray(data) ? data : []);
    } catch {
      toast("Erro ao carregar gastos.", "error");
    } finally {
      setLoadingGastos(false);
    }
  }

  // ─── Navegação de mês ──────────────────────────────────────────────────────

  function prevMes() {
    if (mes === 1) { setMes(12); setAno((a) => a - 1); }
    else setMes((m) => m - 1);
  }
  function nextMes() {
    if (mes === 12) { setMes(1); setAno((a) => a + 1); }
    else setMes((m) => m + 1);
  }

  // ─── Dados calculados ──────────────────────────────────────────────────────

  const receitaMes = useMemo(() => calcReceita(entregas, mesAno), [entregas, mesAno]);
  const gastosDoMes = useMemo(() => calcGastosMes(gastos, mesAno), [gastos, mesAno]);
  const totalGastosMes = useMemo(
    () => round2(gastosDoMes.reduce((acc, g) => acc + Number(g.valor || 0), 0)),
    [gastosDoMes]
  );
  const lucroMes = useMemo(() => round2(receitaMes.total - totalGastosMes), [receitaMes, totalGastosMes]);
  const aReceber = useMemo(() => calcAReceber(entregas), [entregas]);
  const dadosAnuais = useMemo(() => calcAnual(entregas, gastos, ano), [entregas, gastos, ano]);

  const gastosOrdenados = useMemo(
    () => [...gastosDoMes].sort((a, b) => String(b.data).localeCompare(String(a.data))),
    [gastosDoMes]
  );

  // ─── CRUD gastos ──────────────────────────────────────────────────────────

  function abrirNovoGasto() {
    setModalGasto({ mode: "create", dados: { ...GASTO_VAZIO, data: `${mesAno}-01` } });
  }

  function abrirEditarGasto(g) {
    setModalGasto({ mode: "edit", dados: { ...g, valor: String(g.valor) } });
  }

  async function salvarGasto() {
    const { mode, dados } = modalGasto;
    const valor = Number(dados.valor);

    if (!dados.data) { toast("Informe a data.", "error"); return; }
    if (!dados.descricao?.trim()) { toast("Informe a descrição.", "error"); return; }
    if (!Number.isFinite(valor) || valor <= 0) { toast("Informe um valor válido.", "error"); return; }

    setSubmitting(true);
    try {
      const isEdit = mode === "edit";
      const body = isEdit
        ? { id: dados.id, data: dados.data, categoria: dados.categoria, descricao: dados.descricao.trim(), valor }
        : { data: dados.data, categoria: dados.categoria, descricao: dados.descricao.trim(), valor };

      const res = await apiFetch("/api/admin/gastos", {
        method: isEdit ? "PATCH" : "POST",
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (!result.success) { toast(result.error || "Erro ao salvar.", "error"); return; }

      await fetchGastos();
      setModalGasto(null);
      toast(isEdit ? "Gasto atualizado!" : "Gasto registrado!", "success");
    } catch {
      toast("Erro inesperado.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function excluirGasto(g) {
    if (!window.confirm(`Excluir "${g.descricao}"? Isso não pode ser desfeito.`)) return;
    try {
      const res = await apiFetch("/api/admin/gastos", { method: "DELETE", body: JSON.stringify({ id: g.id }) });
      const result = await res.json();
      if (!result.success) { toast(result.error || "Erro ao excluir.", "error"); return; }
      await fetchGastos();
      toast("Gasto excluído.", "success");
    } catch {
      toast("Erro inesperado.", "error");
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8">
      {/* Seletor de mês */}
      <div className="flex items-center gap-4">
        <button
          onClick={prevMes}
          className="p-2 rounded-xl border border-black/10 text-[#4A0E2E] hover:bg-black/5 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-[#4A0E2E] text-lg min-w-48 text-center">
          {MESES[mes - 1]} de {ano}
        </span>
        <button
          onClick={nextMes}
          className="p-2 rounded-xl border border-black/10 text-[#4A0E2E] hover:bg-black/5 transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          label="Receita do mês"
          value={moneyBR(receitaMes.total)}
          icon={TrendingUp}
          cor="green"
        />
        <SummaryCard
          label="Gastos do mês"
          value={moneyBR(totalGastosMes)}
          icon={TrendingDown}
          cor="red"
        />
        <SummaryCard
          label="Lucro líquido"
          value={moneyBR(lucroMes)}
          icon={lucroMes >= 0 ? TrendingUp : TrendingDown}
          cor={lucroMes >= 0 ? "purple" : "red"}
        />
        <SummaryCard
          label="A receber (total)"
          value={moneyBR(aReceber)}
          icon={Wallet}
          cor="yellow"
        />
      </div>

      {/* Gastos do mês */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#4A0E2E]">
            Gastos — {MESES[mes - 1]}
            {gastosOrdenados.length > 0 && (
              <span className="ml-2 text-sm font-semibold text-red-600">
                {moneyBR(totalGastosMes)}
              </span>
            )}
          </h3>
          <button
            onClick={abrirNovoGasto}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#4A0E2E] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition"
          >
            <Plus className="w-4 h-4" />
            Novo gasto
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 shadow-sm divide-y divide-black/5">
          {loadingGastos ? (
            <div className="p-6 text-center text-sm text-[#4A0E2E]/40">Carregando...</div>
          ) : gastosOrdenados.length === 0 ? (
            <div className="p-8 text-center">
              <Minus className="w-8 h-8 text-[#4A0E2E]/15 mx-auto mb-2" />
              <p className="text-sm text-[#4A0E2E]/40">Nenhum gasto registrado neste mês.</p>
            </div>
          ) : (
            gastosOrdenados.map((g) => (
              <div key={g.id} className="flex items-center gap-3 px-4 py-3.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#4A0E2E] truncate">{g.descricao}</p>
                  <p className="text-xs text-[#4A0E2E]/50">
                    {labelCategoria(g.categoria)} · {toBRDate(g.data)}
                  </p>
                </div>
                <p className="text-sm font-bold text-red-600 shrink-0">{moneyBR(g.valor)}</p>
                <button
                  onClick={() => abrirEditarGasto(g)}
                  className="p-1.5 rounded-lg text-[#4A0E2E]/40 hover:text-[#4A0E2E] hover:bg-black/5 transition shrink-0"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => excluirGasto(g)}
                  className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Receitas do mês (pagamentos recebidos) */}
      <div>
        <h3 className="text-base font-bold text-[#4A0E2E] mb-4">
          Receitas — {MESES[mes - 1]}
          {receitaMes.lista.length > 0 && (
            <span className="ml-2 text-sm font-semibold text-green-600">
              {moneyBR(receitaMes.total)}
            </span>
          )}
        </h3>

        <div className="bg-white rounded-2xl border border-black/5 shadow-sm divide-y divide-black/5">
          {receitaMes.lista.length === 0 ? (
            <div className="p-8 text-center">
              <Minus className="w-8 h-8 text-[#4A0E2E]/15 mx-auto mb-2" />
              <p className="text-sm text-[#4A0E2E]/40">Nenhum pagamento recebido neste mês.</p>
            </div>
          ) : (
            receitaMes.lista.map((p, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#4A0E2E] capitalize">{p.parceiro}</p>
                  <p className="text-xs text-[#4A0E2E]/50">{toBRDate(p.data)}</p>
                </div>
                <p className="text-sm font-bold text-green-600 shrink-0">{moneyBR(p.valor)}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Gráfico anual */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5">
        <h3 className="text-sm font-bold text-[#4A0E2E]/60 uppercase tracking-wide mb-6">
          Visão anual — {ano}
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dadosAnuais} barCategoryGap="25%" barGap={2}>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#4A0E2E99" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: "#D9418C08" }}
              contentStyle={{ borderRadius: 10, border: "none", fontSize: 12, boxShadow: "0 2px 12px #0001" }}
              formatter={(v, name) => [
                moneyBR(v),
                name === "receita" ? "Receita" : name === "gastos" ? "Gastos" : "Lucro",
              ]}
            />
            <Legend
              formatter={(v) => v === "receita" ? "Receita" : v === "gastos" ? "Gastos" : "Lucro"}
              wrapperStyle={{ fontSize: 12 }}
            />
            <Bar dataKey="receita" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="gastos"  fill="#f87171" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* Tabela anual resumida */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[#4A0E2E]/40 font-semibold">
                <th className="text-left pb-2">Mês</th>
                <th className="text-right pb-2">Receita</th>
                <th className="text-right pb-2">Gastos</th>
                <th className="text-right pb-2">Lucro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/4">
              {dadosAnuais.map((d, i) => (
                <tr
                  key={i}
                  className={`${i + 1 === mes && ano === hoje.getFullYear() ? "bg-[#D1328C]/5 font-semibold" : ""}`}
                >
                  <td className="py-2 text-[#4A0E2E]">{d.label}</td>
                  <td className="py-2 text-right text-green-700">
                    {d.receita > 0 ? moneyBR(d.receita) : "—"}
                  </td>
                  <td className="py-2 text-right text-red-600">
                    {d.gastos > 0 ? moneyBR(d.gastos) : "—"}
                  </td>
                  <td className={`py-2 text-right font-semibold ${d.lucro >= 0 ? "text-[#4A0E2E]" : "text-red-600"}`}>
                    {d.receita > 0 || d.gastos > 0 ? moneyBR(d.lucro) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-black/10 font-bold text-[#4A0E2E]">
              <tr>
                <td className="pt-3">Total</td>
                <td className="pt-3 text-right text-green-700">
                  {moneyBR(dadosAnuais.reduce((s, d) => s + d.receita, 0))}
                </td>
                <td className="pt-3 text-right text-red-600">
                  {moneyBR(dadosAnuais.reduce((s, d) => s + d.gastos, 0))}
                </td>
                <td className="pt-3 text-right">
                  {moneyBR(dadosAnuais.reduce((s, d) => s + d.lucro, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Modal de gasto */}
      <Modal
        open={!!modalGasto}
        title={modalGasto?.mode === "edit" ? "Editar Gasto" : "Novo Gasto"}
        onClose={() => setModalGasto(null)}
      >
        {modalGasto && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#4A0E2E]/70">Data</label>
              <input
                type="date"
                className={inputCls}
                value={modalGasto.dados.data}
                onChange={(e) =>
                  setModalGasto((m) => ({ ...m, dados: { ...m.dados, data: e.target.value } }))
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#4A0E2E]/70">Categoria</label>
              <select
                className={inputCls + " cursor-pointer"}
                value={modalGasto.dados.categoria}
                onChange={(e) =>
                  setModalGasto((m) => ({ ...m, dados: { ...m.dados, categoria: e.target.value } }))
                }
              >
                {CATEGORIAS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#4A0E2E]/70">Descrição</label>
              <input
                type="text"
                placeholder="Ex: Chocolate ao leite 2kg"
                className={inputCls}
                value={modalGasto.dados.descricao}
                onChange={(e) =>
                  setModalGasto((m) => ({ ...m, dados: { ...m.dados, descricao: e.target.value } }))
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#4A0E2E]/70">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Ex: 85,00"
                className={inputCls}
                value={modalGasto.dados.valor}
                onChange={(e) =>
                  setModalGasto((m) => ({ ...m, dados: { ...m.dados, valor: e.target.value } }))
                }
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setModalGasto(null)}
                disabled={submitting}
                className="w-full border border-black/10 text-[#4A0E2E] py-3 rounded-xl font-semibold hover:bg-black/3 transition disabled:opacity-50 text-sm"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={salvarGasto}
                disabled={submitting}
                className="w-full bg-[#4A0E2E] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60 text-sm"
              >
                {submitting ? "Salvando..." : modalGasto.mode === "edit" ? "Salvar" : "Registrar"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
