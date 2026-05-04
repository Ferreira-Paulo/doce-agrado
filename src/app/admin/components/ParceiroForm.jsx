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

export default function ParceiroForm({ novoParceiro, setNovoParceiro, onSubmit, onCancel, isLoading = false }) {
  return (
    <div className="flex flex-col gap-5">
      <Field label="Nome de usuário (login)">
        <input
          type="text"
          placeholder="Ex: mercado-central"
          className={inputCls}
          value={novoParceiro.username}
          onChange={(e) =>
            setNovoParceiro({ ...novoParceiro, username: e.target.value })
          }
          autoComplete="off"
        />
        <p className="text-xs text-[#4A0E2E]/40 -mt-1">
          O login será: <strong>{novoParceiro.username || "usuario"}@doceagrado.local</strong>
        </p>
      </Field>

      <Field label="Senha inicial">
        <input
          type="password"
          placeholder="Mínimo 6 caracteres"
          className={inputCls}
          value={novoParceiro.password}
          onChange={(e) =>
            setNovoParceiro({ ...novoParceiro, password: e.target.value })
          }
          autoComplete="new-password"
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
          {isLoading ? "Criando..." : "Criar parceiro"}
        </button>
      </div>
    </div>
  );
}
