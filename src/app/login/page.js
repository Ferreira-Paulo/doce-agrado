"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import {
  signInWithEmailAndPassword,
  getIdTokenResult,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

import { auth } from "@/lib/firebase/client";

const inputCls =
  "px-4 py-3 border border-black/10 rounded-xl w-full text-[#4A0E2E] bg-white focus:outline-none focus:ring-2 focus:ring-[#D1328C]/30 focus:border-[#D1328C] transition";

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-[#4A0E2E]/70">{label}</label>
      {children}
    </div>
  );
}

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");

    const u = username.trim().toLowerCase();
    if (!u) { setErro("Digite o username."); return; }
    if (!senha) { setErro("Digite a senha."); return; }

    setLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      const cred = await signInWithEmailAndPassword(auth, `${u}@doceagrado.local`, senha);
      await cred.user.getIdToken(true);
      const token = await getIdTokenResult(cred.user, true);
      router.replace(token.claims.admin ? "/admin" : "/parceiro");
    } catch {
      setErro("Usuário ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF9FB] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo + título */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/img/logo-doce-agrado.png"
            alt="Doce Agrado"
            width={80}
            height={80}
            className="rounded-2xl object-contain mb-4 shadow-sm"
          />
          <h1 className="text-2xl font-extrabold text-[#4A0E2E] tracking-tight">
            Doce Agrado
          </h1>
          <p className="text-sm text-[#4A0E2E]/50 mt-1">
            Área exclusiva para parceiros
          </p>
        </div>

        {/* Card do formulário */}
        <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-8">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <Field label="Username">
              <input
                type="text"
                placeholder="Ex: mercado-central"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className={inputCls}
              />
            </Field>

            <Field label="Senha">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  autoComplete="current-password"
                  className={`${inputCls} pr-11`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A0E2E]/40 hover:text-[#4A0E2E] transition"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>

            {erro && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{erro}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D1328C] text-white py-3 rounded-xl font-semibold hover:bg-[#b52a79] active:scale-[0.98] disabled:opacity-60 transition mt-1"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
