"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import entregasData from "../../../data/entregas.json";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [entregas, setEntregas] = useState([]);
  const [novoPagamento, setNovoPagamento] = useState({
    parceiro: "",
    valor: "",
    data: new Date().toISOString().slice(0, 10)
  });
  const [novaEntrega, setNovaEntrega] = useState({
    parceiro: "",
    quantidade: "",
    valor_unitario: "3.5",
    data: new Date().toISOString().slice(0, 10)
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(savedUser);
    if (parsedUser.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    setUser(parsedUser);
    setEntregas(entregasData);
    setNovoPagamento(prev => ({ ...prev, parceiro: entregasData[0]?.parceiro || "" }));
    setNovaEntrega(prev => ({ ...prev, parceiro: entregasData[0]?.parceiro || "" }));
  }, [router]);

  if (!user) return <p>Carregando...</p>;

  // Função para registrar pagamento automático
  const registrarPagamento = async () => {
    if (!novoPagamento.valor || isNaN(novoPagamento.valor)) return;

    const res = await fetch("/api/pagamentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoPagamento)
    });

    const data = await res.json();

    if (data.success) {
      setEntregas(data.entregas);
      setNovoPagamento(prev => ({ ...prev, valor: "", data: new Date().toISOString().slice(0, 10) }));
    } else {
      alert("Erro ao registrar pagamento: " + data.error);
    }
  };

  // Função para registrar nova entrega
  const registrarEntrega = async () => {
    if (!novaEntrega.quantidade || isNaN(novaEntrega.quantidade)) return;

    const res = await fetch("/api/entregas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaEntrega)
    });
    
    const data = await res.json();
    
    if (data.success) {
      setEntregas(data.entregas);
      setNovaEntrega(prev => ({ ...prev, quantidade: "", data: new Date().toISOString().slice(0, 10)}));
    } else {
      alert("Erro ao registrar entrega: " + data.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9FB] p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#4A0E2E]">Bem-vindo, {user.nome} (Admin)</h1>
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

      {/* Registrar Pagamento */}
      <h2 className="text-2xl font-semibold mb-4">Registrar Pagamento</h2>
      <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
        <select
          className="px-4 py-2 border rounded-lg w-full md:w-1/4"
          value={novoPagamento.parceiro}
          onChange={e =>
            setNovoPagamento({ ...novoPagamento, parceiro: e.target.value })
          }
        >
          {entregas.map((p, idx) => (
            <option key={idx} value={p.parceiro}>
              {p.parceiro}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Valor pago"
          className="px-4 py-2 border rounded-lg w-full md:w-1/4"
          value={novoPagamento.valor}
          onChange={e => setNovoPagamento({ ...novoPagamento, valor: e.target.value })}
        />

        <input
          type="date"
          className="px-4 py-2 border rounded-lg w-full md:w-1/4"
          value={novoPagamento.data}
          onChange={e => setNovoPagamento({ ...novoPagamento, data: e.target.value })}
        />

        <button
          onClick={registrarPagamento}
          className="bg-[#D1328C] text-white px-6 py-2 rounded-lg hover:bg-[#b52a79] transition w-full md:w-auto"
        >
          Registrar
        </button>
      </div>

      {/* Registrar Entrega */}
      <h2 className="text-2xl font-semibold mb-4">Registrar Entrega</h2>
      <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
        <select
          className="px-4 py-2 border rounded-lg w-full md:w-1/4"
          value={novaEntrega.parceiro}
          onChange={e =>
            setNovaEntrega({ ...novaEntrega, parceiro: e.target.value })
          }
        >
          {entregas.map((p, idx) => (
            <option key={idx} value={p.parceiro}>
              {p.parceiro}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantidade"
          className="px-4 py-2 border rounded-lg w-full md:w-1/4"
          value={novaEntrega.quantidade}
          onChange={e => setNovaEntrega({ ...novaEntrega, quantidade: e.target.value })}
        />

        <input
          type="date"
          className="px-4 py-2 border rounded-lg w-full md:w-1/4"
          value={novaEntrega.data}
          onChange={e => setNovaEntrega({ ...novaEntrega, data: e.target.value })}
        />

        <button
          onClick={registrarEntrega}
          className="bg-[#D1328C] text-white px-6 py-2 rounded-lg hover:bg-[#b52a79] transition w-full md:w-auto"
        >
          Registrar
        </button>
      </div>

      {/* Entregas e Pagamentos */}
      <h2 className="text-2xl font-semibold mb-4">Entregas e Pagamentos</h2>
      <div className="space-y-6">
        {entregas.map((p, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">{p.parceiro}</h3>
            {p.entregas.map((e, i) => {
              const total = e.quantidade * e.valor_unitario;
              const totalPago = e.pagamentos.reduce((acc, pay) => acc + pay.valor, 0);
              const saldo = total - totalPago;
              let saldoColor = "text-red-600";
              if (saldo === 0) saldoColor = "text-green-600";
              else if (saldo < total) saldoColor = "text-yellow-600";

              return (
                <div key={i} className="flex justify-between items-center p-2 border-b">
                  <div>
                    <p>Data: {e.data}</p>
                    <p>Quantidade: {e.quantidade} trufas</p>
                    <p>Total: R$ {total.toFixed(2)}</p>
                    <p>Pagamentos:</p>
                    <ul className="list-disc list-inside">
                      {e.pagamentos.map((pay, j) => (
                        <li key={j}>
                          R$ {pay.valor.toFixed(2)} - {pay.data}
                        </li>
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
        ))}
      </div>

      {/* Resumo Financeiro Geral */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">Resumo Financeiro Geral</h2>
      <div className="flex space-x-8 flex-wrap">
        <div className="p-4 bg-white shadow rounded-lg w-1/4">
          <p className="font-bold">Total Entregue:</p>
          <p>
            R$ {entregas.reduce((acc, p) => acc + p.entregas.reduce((eAcc, e) => eAcc + e.quantidade * e.valor_unitario, 0), 0).toFixed(2)}
          </p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg w-1/4">
          <p className="font-bold">Total Pago:</p>
          <p>
            R$ {entregas.reduce((acc, p) => acc + p.entregas.reduce((eAcc, e) => eAcc + e.pagamentos.reduce((pAcc, pay) => pAcc + pay.valor, 0), 0), 0).toFixed(2)}
          </p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg w-1/4">
          <p className="font-bold">Saldo Geral:</p>
          <p>
            R$ {entregas.reduce((acc, p) => acc + p.entregas.reduce((eAcc, e) => eAcc + e.quantidade * e.valor_unitario - e.pagamentos.reduce((pAcc, pay) => pAcc + pay.valor, 0), 0), 0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
