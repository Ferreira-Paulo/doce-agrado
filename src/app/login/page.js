"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, getIdTokenResult, setPersistence, browserLocalPersistence } from "firebase/auth";

import { auth } from "@/lib/firebase/client";

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");

    const u = username.trim().toLowerCase();
    if (!u) {
      setErro("Digite o username");
      return;
    }
    if (!senha) {
      setErro("Digite a senha");
      return;
    }

    setLoading(true);

    try {
      await setPersistence(auth, browserLocalPersistence);
      
      const email = `${u}@doceagrado.local`;

      const cred = await signInWithEmailAndPassword(auth, email, senha);

      await cred.user.getIdToken(true);

      const token = await getIdTokenResult(cred.user, true);
      const isAdmin = !!token.claims.admin;

      router.replace(isAdmin ? "/admin" : "/parceiro");
    } catch (err) {
      console.log("FIREBASE LOGIN ERROR:", err?.code, err?.message);
      setErro("Usuário ou senha inválidos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF9FB] px-4 md:flex-row md:px-8">
      <img
        src="/img/logo-doce-agrado.png"
        alt="Doce Agrado"
        className="h-20 mb-8 md:mb-0 md:h-80 md:mr-12"
      />

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
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-3 border rounded-lg text-[#4A0E2E]"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full mb-4 px-4 py-3 border rounded-lg text-[#4A0E2E]"
        />

        {erro && <p className="text-red-600 text-sm mb-4 text-center">{erro}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#D1328C] text-white py-3 rounded-lg font-semibold transition hover:bg-[#b52a79] active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="mt-6 text-sm text-[#4A0E2E]/70 text-center">
          Doce Agrado • Área exclusiva para parceiros
        </p>
      </form>
    </div>
  );
}
