import { useMemo, useState } from "react";
import { ChevronDown, Package, CreditCard } from "lucide-react";
import DeliveryCard from "@/components/dashboard/DeliveryCard";
import { resumoEntregas, calcEntrega } from "@/components/utils/calc";
import { moneyBR, toBRDate } from "@/components/utils/format";

export default function PartnerSection({ parceiro, entregas, onPagar, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);

  const resumo = useMemo(() => resumoEntregas(entregas), [entregas]);

  const pendentesCount = useMemo(
    () => entregas.filter((e) => calcEntrega(e).saldo > 0).length,
    [entregas]
  );

  const ultimaEntrega = useMemo(() => {
    if (!entregas.length) return null;
    return entregas.reduce((latest, e) =>
      !latest || String(e.data) > String(latest.data) ? e : latest
    , null);
  }, [entregas]);

  const initials = parceiro
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5">
      <div className="flex items-center gap-4 p-5">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl bg-[#D1328C]/10 flex items-center justify-center shrink-0">
          {initials ? (
            <span className="text-sm font-bold text-[#D1328C]">{initials}</span>
          ) : (
            <Package className="w-4 h-4 text-[#D1328C]" />
          )}
        </div>

        {/* Info — clicável para expandir */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex-1 min-w-0 text-left"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-[#4A0E2E] capitalize">{parceiro}</h3>
            {pendentesCount > 0 ? (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                {pendentesCount} pendente{pendentesCount > 1 ? "s" : ""}
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
                tudo pago
              </span>
            )}
          </div>
          <p className="text-xs text-[#4A0E2E]/50 mt-0.5">
            Saldo:{" "}
            <span className={resumo.saldoGeral === 0 ? "text-green-600 font-semibold" : "text-yellow-600 font-semibold"}>
              {moneyBR(resumo.saldoGeral)}
            </span>
            {" · "}Entregue: {moneyBR(resumo.totalEntregue)} · Pago: {moneyBR(resumo.totalPago)}
            {ultimaEntrega && (
              <span className="ml-2 text-[#4A0E2E]/40">
                · Última entrega: {toBRDate(ultimaEntrega.data)}
              </span>
            )}
          </p>
        </button>

        {/* Ações */}
        <div className="flex items-center gap-2 shrink-0">
          {onPagar && resumo.saldoGeral > 0 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onPagar(parceiro); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D1328C]/10 text-[#D1328C] text-xs font-bold hover:bg-[#D1328C]/20 transition"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Pagar
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded-xl text-[#4A0E2E]/40 hover:bg-black/5 hover:text-[#4A0E2E] transition"
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Lista de entregas */}
      {open && (
        <div className="border-t border-black/5 p-5 pt-4 space-y-4">
          {entregas.length === 0 ? (
            <p className="text-sm text-[#4A0E2E]/40 text-center py-4">
              Nenhuma entrega registrada.
            </p>
          ) : (
            entregas.map((e) => (
              <DeliveryCard
                key={e.id}
                entrega={e}
                onEdit={onEdit ? (entrega) => onEdit(parceiro, entrega) : undefined}
                onDelete={onDelete ? (entrega) => onDelete(parceiro, entrega) : undefined}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
