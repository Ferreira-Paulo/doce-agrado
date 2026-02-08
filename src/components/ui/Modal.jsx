"use client";

import { useEffect } from "react";

export default function Modal({ open, title, onClose, children }) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 opacity-100 transition-opacity"
        aria-label="Fechar modal"
      />

      {/* modal */}
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-xl border border-black/10
                      opacity-100 scale-100 translate-y-0 transition-transform duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-bold text-[#4A0E2E]">{title}</h3>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded-xl hover:bg-black/[0.05] transition text-[#4A0E2E]"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
