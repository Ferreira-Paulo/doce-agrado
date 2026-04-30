"use client";

import { useState } from "react";
import { MessageCircle, Copy, Check, RefreshCw } from "lucide-react";

const WHATSAPP = "5512988199718";
const PIX_KEY = "48944721807";
const PIX_DISPLAY = "489.447.218-07";

function buildWhatsappUrl(text) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

export default function QuickActions({ username }) {
  const [copied, setCopied] = useState(false);

  function copyPix() {
    navigator.clipboard.writeText(PIX_KEY).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const reposicaoUrl = buildWhatsappUrl(
    `Olá! Sou ${username} e gostaria de solicitar uma reposição de trufas.`
  );
  const pagamentoUrl = buildWhatsappUrl(
    `Olá! Sou ${username} e acabei de fazer um PIX referente ao pagamento das trufas.`
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5 mb-6">
      <h3 className="text-sm font-bold text-[#4A0E2E]/60 uppercase tracking-wide mb-4">
        Ações rápidas
      </h3>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <a
          href={reposicaoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 flex-1 bg-[#D9418C] hover:bg-[#A12C66] text-white font-semibold text-sm rounded-xl px-4 py-3 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Solicitar reposição
        </a>

        <a
          href={pagamentoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold text-sm rounded-xl px-4 py-3 transition"
        >
          <MessageCircle className="w-4 h-4" />
          Já fiz o PIX
        </a>
      </div>

      <div className="flex items-center justify-between bg-[#FFF9FB] rounded-xl px-4 py-3">
        <div>
          <p className="text-xs text-[#4A0E2E]/50 mb-0.5">Chave PIX</p>
          <p className="font-semibold text-[#4A0E2E] text-sm">{PIX_DISPLAY}</p>
        </div>
        <button
          type="button"
          onClick={copyPix}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#D9418C] hover:text-[#A12C66] transition"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copiado!" : "Copiar"}
        </button>
      </div>
    </div>
  );
}
