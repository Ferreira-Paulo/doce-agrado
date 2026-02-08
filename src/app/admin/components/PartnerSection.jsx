import { useMemo, useState } from "react";
import DeliveryCard from "@/components/dashboard/DeliveryCard";
import { resumoEntregas, calcEntrega } from "@/components/utils/calc";
import { moneyBR } from "@/components/utils/format";

export default function PartnerSection({ parceiro, entregas }) {
  const [open, setOpen] = useState(false);

  const resumo = useMemo(() => resumoEntregas(entregas), [entregas]);

  const pendentesCount = useMemo(() => {
    let c = 0;
    for (const e of entregas) {
      if (calcEntrega(e).saldo > 0) c++;
    }
    return c;
  }, [entregas]);

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-[#4A0E2E]">{parceiro}</h3>

            {pendentesCount > 0 ? (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                {pendentesCount} pendente(s)
              </span>
            ) : (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                tudo pago
              </span>
            )}
          </div>

          <p className="text-sm text-[#4A0E2E]/70 mt-1">
            Entregue: {moneyBR(resumo.totalEntregue)} • Pago: {moneyBR(resumo.totalPago)} • Saldo:{" "}
            <span className={resumo.saldoGeral === 0 ? "text-green-600 font-semibold" : "text-yellow-700 font-semibold"}>
              {moneyBR(resumo.saldoGeral)}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="px-4 py-2 rounded-xl border border-black/10 text-[#4A0E2E] font-semibold hover:bg-black/[0.03] transition w-full md:w-auto"
        >
          {open ? "Ocultar entregas" : "Mostrar entregas"}
        </button>
      </div>

      {open && (
        <div className="mt-5 space-y-4">
          {entregas.map((e, i) => (
            <DeliveryCard key={i} entrega={e} />
          ))}
        </div>
      )}
    </div>
  );
}
