export default function PagamentoForm({
  entregas,
  novoPagamento,
  setNovoPagamento,
  onSubmit,
  onCancel,
  mode = "create",
  submitLabel
}) {
  const label = submitLabel || (mode === "edit" ? "Salvar alterações" : "Registrar");

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-[#4A0E2E]">
        {mode === "edit" ? "Editar Pagamento" : "Registrar Pagamento"}
      </h2>

      <div className="flex flex-col gap-4">
        <select
          className="px-4 py-3 border rounded-xl w-full"
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


        <input
          type="number"
          placeholder="Valor pago"
          className="px-4 py-3 border rounded-xl w-full"
          value={novoPagamento.valor}
          onChange={e => setNovoPagamento({ ...novoPagamento, valor: e.target.value })}
        />

        <input
          type="date"
          className="px-4 py-3 border rounded-xl w-full"
          value={novoPagamento.data}
          onChange={e => setNovoPagamento({ ...novoPagamento, data: e.target.value })}
        />

        <div className="flex gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full border border-black/10 text-[#4A0E2E] py-3 rounded-xl font-semibold hover:bg-black/[0.03] transition"
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
    </>
  );
}
