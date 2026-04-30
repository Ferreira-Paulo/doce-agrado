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
  novaEntrega,
  setNovaEntrega,
  onSubmit,
  onCancel,
  mode = "create",
  submitLabel,
}) {
  const label = submitLabel || (mode === "edit" ? "Salvar alterações" : "Registrar entrega");

  return (
    <div className="flex flex-col gap-5">
      <Field label="Parceiro">
        <select
          className={inputCls}
          value={novaEntrega.parceiro}
          onChange={(e) =>
            setNovaEntrega({ ...novaEntrega, parceiro: e.target.value })
          }
          disabled={mode === "edit"}
        >
          {entregas.map((p) => (
            <option key={p.parceiro} value={p.parceiro}>
              {p.parceiro}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Quantidade de trufas">
        <input
          type="number"
          min="1"
          placeholder="Ex: 50"
          className={inputCls}
          value={novaEntrega.quantidade}
          onChange={(e) =>
            setNovaEntrega({ ...novaEntrega, quantidade: e.target.value })
          }
        />
      </Field>

      <Field label="Valor unitário (R$)">
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Ex: 3,50"
          className={inputCls}
          value={novaEntrega.valor_unitario}
          onChange={(e) =>
            setNovaEntrega({ ...novaEntrega, valor_unitario: e.target.value })
          }
        />
      </Field>

      <Field label="Data da entrega">
        <input
          type="date"
          className={inputCls}
          value={novaEntrega.data}
          onChange={(e) =>
            setNovaEntrega({ ...novaEntrega, data: e.target.value })
          }
        />
      </Field>

      <div className="flex gap-3 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full border border-black/10 text-[#4A0E2E] py-3 rounded-xl font-semibold hover:bg-black/3 transition"
          >
            Cancelar
          </button>
        )}
        <button
          type="button"
          onClick={onSubmit}
          className="w-full bg-[#D1328C] text-white py-3 rounded-xl font-semibold hover:bg-[#b52a79] transition"
        >
          {label}
        </button>
      </div>
    </div>
  );
}
