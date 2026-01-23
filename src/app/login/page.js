"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, senha })
    });

    const data = await res.json();

    if (!res.ok) {
      setErro(data.error);
      return;
    }

    localStorage.setItem("user", JSON.stringify(data));

    if (data.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF9FB] px-4 md:flex-row md:px-8">
      
      {/* Logo */}
      <img
        src="/img/logo-doce-agrado.png"
        alt="Doce Agrado"
        className="h-20 mb-8 md:mb-0 md:h-80 md:mr-12"
      />

      {/* Formulário */}
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center text-[#4A0E2E] mb-6">
          Área do Parceiro
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          className="w-full mb-4 px-4 py-3 border rounded-lg text-[#4A0E2E]"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value.toLowerCase())}
          className="w-full mb-4 px-4 py-3 border rounded-lg text-[#4A0E2E]"
        />

        {erro && (
          <p className="text-red-600 text-sm mb-4 text-center">{erro}</p>
        )}

        <button className="w-full bg-[#D1328C] text-white py-3 rounded-lg">
          Entrar
        </button>
      </form>
    </div>
  );
}
