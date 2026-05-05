import { useMemo } from "react";
import { Plus, X } from "lucide-react";
import { moneyBR } from "@/components/utils/format";

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-[#4A0E2E]/70">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "px-4 py-3 border border-black/10 rounded-xl w-full text-[#4A0E2E] bg-white focus:outline-none focus:ring-2 focus:ring-[#D1328C]/30 focus:border-[#D1328C] transition";

export default function EntregaForm({
  entregas,
  sabores = [],
  novaEntrega,
  setNovaEntrega,
  onSubmit,
  onCancel,
  mode = "create",
  submitLabel,
  isLoading = false,
}) {
  const label = submitLabel || (mode === "edit" ? "Salvar alterações" : "Registrar entrega");

  const { totalQuantidade, previewTotal } = useMemo(() => {
    const qtd = (novaEntrega.itens || []).reduce((acc, i) => acc + (Number(i.quantidade) || 0), 0);
    const v = Number(novaEntrega.valor_unitario);
    return { totalQuantidade: qtd, previewTotal: qtd > 0 && v > 0 ? qtd * v : null };
  }, [novaEntrega.itens, novaEntrega.valor_unitario]);

  function addItem() {
    setNovaEntrega({ ...novaEntrega, itens: [...(novaEntrega.itens || []), { sabor: "", quantidade: "" }] });
  }

  function removeItem(idx) {
    const itens = (novaEntrega.itens || []).filter((_, i) => i !== idx);
    setNovaEntrega({ ...novaEntrega, itens: itens.length > 0 ? itens : [{ sabor: "", quantidade: "" }] });
  }

  function updateItem(idx, field, value) {
    const itens = (novaEntrega.itens || []).map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    setNovaEntrega({ ...novaEntrega, itens });
  }

  const saboresAtivos = sabores.filter((s) => s.ativo !== false);

  return (
    <div className="flex flex-col gap-5">
      <Field label="Parceiro">
        <select
          className={inputCls + " cursor-pointer"}
          value={novaEntrega.parceiro}
          onChange={(e) => setNovaEntrega({ ...novaEntrega, parceiro: e.target.value })}
          disabled={mode === "edit"}
        >
          {entregas.map((p) => (
            <option key={p.parceiro} value={p.parceiro}>
              {p.parceiro}
            </option>
          ))}
        </select>
      </Field>

      {/* Sabores */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-[#4A0E2E]/70">Sabores e quantidades</label>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1 text-xs font-semibold text-[#D1328C] hover:text-[#b52a79] transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Adicionar sabor
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {(novaEntrega.itens || []).map((item, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <select
                value={item.sabor}
                onChange={(e) => updateItem(idx, "sabor", e.target.value)}
                className="flex-1 px-3 py-2.5 border border-black/10 rounded-xl text-sm text-[#4A0E2E] bg-white focus:outline-none focus:ring-2 focus:ring-[#D1328C]/30 focus:border-[#D1328C] transition cursor-pointer"
              >
                <option value="">Selecione o sabor</option>
                {saboresAtivos.map((s) => (
                  <option key={s.id} value={s.nome}>
                    {s.nome}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                placeholder="Qtd"
                value={item.quantidade}
                onChange={(e) => updateItem(idx, "quantidade", e.target.value)}
                className="w-24 px-3 py-2.5 border border-black/10 rounded-xl text-sm text-[#4A0E2E] bg-white focus:outline-none focus:ring-2 focus:ring-[#D1328C]/30 focus:border-[#D1328C] transition text-center"
              />
              {(novaEntrega.itens || []).length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {saboresAtivos.length === 0 && (
          <p className="text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
            Nenhum sabor cadastrado. Adicione sabores no Catálogo primeiro.
          </p>
        )}
      </div>

      <Field label="Valor unitário (R$)">
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Ex: 3,50"
          className={inputCls}
          value={novaEntrega.valor_unitario}
          onChange={(e) => setNovaEntrega({ ...novaEntrega, valor_unitario: e.target.value })}
        />
      </Field>

      <Field label="Data da entrega">
        <input
          type="date"
          className={inputCls}
          value={novaEntrega.data}
          onChange={(e) => setNovaEntrega({ ...novaEntrega, data: e.target.value })}
        />
      </Field>

      <Field label="Data de validade (opcional)">
        <input
          type="date"
          className={inputCls}
          value={novaEntrega.data_validade || ""}
          onChange={(e) => setNovaEntrega({ ...novaEntrega, data_validade: e.target.value })}
        />
      </Field>

      {previewTotal !== null && (
        <div className="rounded-xl bg-[#D1328C]/8 px-4 py-3 text-sm font-semibold flex items-center justify-between text-[#D1328C]">
          <span>
            Total da entrega · {totalQuantidade} trufa{totalQuantidade !== 1 ? "s" : ""}
          </span>
          <span>{moneyBR(previewTotal)}</span>
        </div>
      )}

      <div className="flex gap-3 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full border border-black/10 text-[#4A0E2E] py-3 rounded-xl font-semibold hover:bg-black/3 transition disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="w-full bg-[#D1328C] text-white py-3 rounded-xl font-semibold hover:bg-[#b52a79] transition disabled:opacity-60"
        >
          {isLoading ? "Salvando..." : label}
        </button>
      </div>
    </div>
  );
}
