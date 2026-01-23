"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// JSON fake
import entregasData from "../../../data/entregas.json";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [entregas, setEntregas] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(savedUser);
    if (parsedUser.role !== "parceiro") {
      router.push("/admin");
      return;
    }

    setUser(parsedUser);

    const parceiroData = entregasData.find(e => e.parceiro === parsedUser.username) || { entregas: [] };
    setEntregas(parceiroData.entregas);
  }, [router]);

  if (!user) return <p>Carregando...</p>;

  return (
    <div className="min-h-screen bg-[#FFF9FB] p-8" >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#4A0E2E]">
          Bem-vindo, {user.nome}
        </h1>
        <button
          onClick={() => {
            localStorage.removeItem("user");
            router.push("/login");
          }}
          className="bg-[#D1328C] text-white px-6 py-2 rounded-lg hover:bg-[#b52a79] transition"
        >
          Sair
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Entregas</h2>
      <div className="space-y-4">
        {entregas.map((entrega, idx) => {
          const total = entrega.quantidade * entrega.valor_unitario;
          const totalPago = entrega.pagamentos.reduce((acc, p) => acc + p.valor, 0);
          const saldo = total - totalPago;

          let saldoColor = "text-red-600";
          if (saldo === 0) saldoColor = "text-green-600";
          else if (saldo < total) saldoColor = "text-yellow-600";

          return (
            <div key={idx} className="flex justify-between items-center p-4 border rounded-lg bg-white shadow">
              <div>
                <p className="font-bold">Data: {entrega.data}</p>
                <p>Quantidade: {entrega.quantidade} trufas</p>
                <p>Total: R$ {total.toFixed(2)}</p>
                <p>Pagamentos:</p>
                <ul className="list-disc list-inside">
                  {entrega.pagamentos.map((p, i) => (
                    <li key={i}>R$ {p.valor.toFixed(2)} - {p.data}</li>
                  ))}
                </ul>
              </div>
              <div className="text-right">
                <p>Total Pago: R$ {totalPago.toFixed(2)}</p>
                <p>
                  Saldo: <span className={saldoColor}>R$ {saldo.toFixed(2)}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Resumo Financeiro</h2>
      <div className="flex space-x-8 flex-wrap">
        <div className="p-4 bg-white shadow rounded-lg w-1/4">
          <p className="font-bold">Total Entregue:</p>
          <p>
            R$ {entregas.reduce((acc, e) => acc + e.quantidade * e.valor_unitario, 0).toFixed(2)}
          </p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg w-1/4">
          <p className="font-bold">Total Pago:</p>
          <p>
            R$ {entregas.reduce((acc, e) => acc + e.pagamentos.reduce((pacc, p) => pacc + p.valor, 0), 0).toFixed(2)}
          </p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg w-1/4">
          <p className="font-bold">Saldo Geral:</p>
          <p>
            R$ {entregas.reduce((acc, e) => acc + e.quantidade * e.valor_unitario - e.pagamentos.reduce((pacc, p) => pacc + p.valor, 0), 0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
