"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Renderiza filhos diretamente no document.body, escapando qualquer
 * stacking context criado por transform/filter/will-change (ex: Framer Motion).
 * OBRIGATÓRIO para modais e drawers com backdrop-filter.
 */
export function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;
  return createPortal(children, document.body);
}
