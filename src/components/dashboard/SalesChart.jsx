"use client";

import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function buildMonthlyData(entregas) {
  const map = {};
  for (const e of entregas) {
    const d = String(e.data || "");
    if (!d) continue;
    const key = d.slice(0, 7); // "YYYY-MM"
    const qtd = Array.isArray(e.itens) && e.itens.length > 0
      ? e.itens.reduce((acc, i) => acc + Number(i.quantidade || 0), 0)
      : Number(e.quantidade || 0);
    map[key] = (map[key] || 0) + qtd;
  }
  const sorted = Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).slice(-8);
  return sorted.map(([key, qtd]) => {
    const [year, month] = key.split("-");
    return { label: `${MESES[Number(month) - 1]}/${year.slice(2)}`, qtd };
  });
}

export default function SalesChart({ entregas }) {
  const data = useMemo(() => buildMonthlyData(entregas), [entregas]);

  if (data.length === 0) return null;

  if (data.length < 2) return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5 mb-6">
      <h3 className="text-sm font-bold text-[#4A0E2E]/60 uppercase tracking-wide mb-4">
        Trufas por mês
      </h3>
      <p className="text-sm text-[#4A0E2E]/40 py-6 text-center">
        O gráfico estará disponível a partir do segundo mês de entregas.
      </p>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5 mb-6">
      <h3 className="text-sm font-bold text-[#4A0E2E]/60 uppercase tracking-wide mb-4">
        Trufas por mês
      </h3>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barCategoryGap="30%">
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#4A0E2E99" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: "#D9418C10" }}
            contentStyle={{ borderRadius: 10, border: "none", fontSize: 12 }}
            formatter={(v) => [`${v} trufas`, "Quantidade"]}
          />
          <Bar dataKey="qtd" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={i === data.length - 1 ? "#D9418C" : "#D9418C55"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
