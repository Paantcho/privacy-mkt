"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "./sidebar";

function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
        transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
        style={{
          background: "#F4EEE5",
          minHeight: "100%",
          willChange: "transform, opacity",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          marginLeft: "280px",
          padding: "32px 36px",
          background: "#F4EEE5",
          overflow: "hidden",
        }}
      >
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
