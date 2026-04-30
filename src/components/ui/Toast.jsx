"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

let _id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = ++_id;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 w-full max-w-sm"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const config = {
  success: {
    Icon: CheckCircle,
    wrap: "bg-green-50 border-green-200 text-green-900",
    icon: "text-green-500",
  },
  error: {
    Icon: XCircle,
    wrap: "bg-red-50 border-red-200 text-red-900",
    icon: "text-red-500",
  },
  info: {
    Icon: Info,
    wrap: "bg-white border-black/10 text-[#4A0E2E]",
    icon: "text-[#D1328C]",
  },
};

function ToastItem({ toast, onClose }) {
  const { Icon, wrap, icon } = config[toast.type] ?? config.info;

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg text-sm font-medium ${wrap}`}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${icon}`} />
      <span className="flex-1 leading-snug">{toast.message}</span>
      <button
        onClick={onClose}
        className="shrink-0 opacity-50 hover:opacity-100 transition"
        aria-label="Fechar"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
