import { useMemo } from "react";
import { resumoEntregas } from "@/components/utils/calc";
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

export default function PagamentoForm({
  entregas,
  novoPagamento,
  setNovoPagamento,
  onSubmit,
  onCancel,
  mode = "create",
  submitLabel,
  isLoading = false,
}) {
  const label = submitLabel || (mode === "edit" ? "Salvar alterações" : "Registrar pagamento");

  const saldoParceiro = useMemo(() => {
    if (!novoPagamento.parceiro) return null;
    const p = entregas.find((e) => e.parceiro === novoPagamento.parceiro);
    if (!p) return null;
    return resumoEntregas(p.entregas || []).saldoGeral;
  }, [entregas, novoPagamento.parceiro]);

  return (
    <div className="flex flex-col gap-5">
      <Field label="Parceiro">
        <select
          className={inputCls}
          value={novoPagamento.parceiro || ""}
          onChange={(e) =>
            setNovoPagamento({ ...novoPagamento, parceiro: e.target.value })
          }
          disabled={mode === "edit"}
        >
          <option value="">Selecione um parceiro</option>
          {entregas.map((p) => (
            <option key={p.parceiro} value={p.parceiro}>
              {p.parceiro}
            </option>
          ))}
        </select>
      </Field>

      {/* Saldo devedor do parceiro selecionado */}
      {saldoParceiro !== null && (
        <div className={`rounded-xl px-4 py-3 text-sm font-semibold flex items-center justify-between ${
          saldoParceiro > 0
            ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
            : "bg-green-50 text-green-700 border border-green-200"
        }`}>
          <span>Saldo devedor</span>
          <span>{moneyBR(saldoParceiro)}</span>
        </div>
      )}

      <Field label="Valor pago (R$)">
        <input
          type="number"
          step="0.01"
          min="0.01"
          placeholder="Ex: 150,00"
          className={inputCls}
          value={novoPagamento.valor}
          onChange={(e) =>
            setNovoPagamento({ ...novoPagamento, valor: e.target.value })
          }
        />
      </Field>

      <Field label="Data do pagamento">
        <input
          type="date"
          className={inputCls}
          value={novoPagamento.data}
          onChange={(e) =>
            setNovoPagamento({ ...novoPagamento, data: e.target.value })
          }
        />
      </Field>

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
