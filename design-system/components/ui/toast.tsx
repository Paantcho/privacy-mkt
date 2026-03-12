"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X, AlertTriangle, Info } from "lucide-react";
import { create } from "zustand";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  add: (toast: Omit<Toast, "id">) => void;
  remove: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (t) => {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [{ ...t, id }, ...s.toasts] }));
    setTimeout(
      () => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
      t.duration ?? 3500,
    );
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/**
 * API pública de toast.
 *
 * Paleta Privacy:
 *   success / info  → laranja #F68D3D, texto carvão #23201F
 *   error / warning → carvão #23201F, texto off-white #F4EEE5
 */
export const toast = {
  success: (message: string, duration?: number) =>
    useToastStore.getState().add({ message, type: "success", duration }),
  error: (message: string, duration?: number) =>
    useToastStore.getState().add({ message, type: "error", duration }),
  warning: (message: string, duration?: number) =>
    useToastStore.getState().add({ message, type: "warning", duration }),
  info: (message: string, duration?: number) =>
    useToastStore.getState().add({ message, type: "info", duration }),
};

const PALETTE: Record<ToastType, {
  bg: string; text: string; iconBg: string; iconColor: string; closeBg: string; icon: React.ReactNode;
}> = {
  success: {
    bg: "#F68D3D", text: "#23201F",
    iconBg: "#23201F", iconColor: "#F68D3D",
    closeBg: "rgba(35,32,31,0.12)",
    icon: <Check size={13} strokeWidth={3} />,
  },
  info: {
    bg: "#F68D3D", text: "#23201F",
    iconBg: "#23201F", iconColor: "#F68D3D",
    closeBg: "rgba(35,32,31,0.12)",
    icon: <Info size={13} strokeWidth={2.5} />,
  },
  error: {
    bg: "#23201F", text: "#F4EEE5",
    iconBg: "#E53935", iconColor: "#FFFFFF",
    closeBg: "rgba(244,238,229,0.12)",
    icon: <X size={13} strokeWidth={3} />,
  },
  warning: {
    bg: "#23201F", text: "#F4EEE5",
    iconBg: "#FB8C00", iconColor: "#FFFFFF",
    closeBg: "rgba(244,238,229,0.12)",
    icon: <AlertTriangle size={13} strokeWidth={2.5} />,
  },
};

function ToastItem({ toast: t }: { toast: Toast }) {
  const remove = useToastStore((s) => s.remove);
  const p = PALETTE[t.type];
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.88, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: 30, scale: 0.92 }}
      transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
      className="flex items-center gap-3 rounded-[16px] px-4 py-3.5 pr-3"
      style={{ backgroundColor: p.bg, minWidth: "260px", maxWidth: "380px" }}
    >
      <div
        className="flex-shrink-0 flex h-[22px] w-[22px] items-center justify-center rounded-full"
        style={{ backgroundColor: p.iconBg, color: p.iconColor }}
      >
        {p.icon}
      </div>
      <p className="flex-1 text-[13px] font-bold leading-snug" style={{ color: p.text }}>
        {t.message}
      </p>
      <motion.button
        type="button"
        onClick={() => remove(t.id)}
        aria-label="Fechar"
        className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full"
        style={{ backgroundColor: p.closeBg, color: p.text }}
        whileHover={{ rotate: 90, scale: 1.15 }}
        whileTap={{ rotate: 90, scale: 0.9 }}
        transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <X size={12} strokeWidth={2.5} />
      </motion.button>
    </motion.div>
  );
}

function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-2" aria-live="polite">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => <ToastItem key={t.id} toast={t} />)}
      </AnimatePresence>
    </div>
  );
}

export function ToastProvider() {
  if (typeof document === "undefined") return null;
  return createPortal(<ToastContainer />, document.body);
}
