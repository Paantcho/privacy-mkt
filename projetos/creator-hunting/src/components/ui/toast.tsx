"use client";

import { useState, useCallback, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => remove(id), 3500);
  }, [remove]);

  const value: ToastContextValue = {
    success: (msg) => add(msg, "success"),
    error: (msg) => add(msg, "error"),
    info: (msg) => add(msg, "info"),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 size={16} className="text-primary-500 shrink-0" />,
    error:   <AlertCircle  size={16} className="text-red-500 shrink-0" />,
    info:    <Info         size={16} className="text-ink-400 shrink-0" />,
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ duration: 0.22, ease: [0.34, 1.56, 0.64, 1] }}
      className="flex items-center gap-3 rounded-[14px] bg-white px-4 py-3 min-w-[280px] max-w-[360px]"
      style={{ border: "1px solid rgba(35,32,31,0.08)" }}
    >
      {icons[toast.type]}
      <span className="flex-1 text-[14px] font-semibold text-ink-500 leading-snug">
        {toast.message}
      </span>
      <motion.button
        onClick={onClose}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        className="shrink-0 text-ink-300 hover:text-ink-500"
      >
        <X size={14} />
      </motion.button>
    </motion.div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de <ToastProvider>");
  return ctx;
}
