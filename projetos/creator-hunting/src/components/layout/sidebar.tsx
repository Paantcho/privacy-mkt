"use client";

import { useRef, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Table2,
  BarChart3,
  Target,
  Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  iconClass?: string;
}

const MENU_ITEMS: MenuItem[] = [
  { label: "Planilha",     href: "/planilha",   icon: Table2,   iconClass: "icon-pulse" },
  { label: "Dashboard",    href: "/dashboard",  icon: BarChart3, iconClass: "icon-grow" },
  { label: "Metas & Pace", href: "/metas",      icon: Target,   iconClass: "icon-spark" },
  { label: "Timeline",     href: "/timeline",   icon: Clock,    iconClass: "icon-wiggle" },
];

export function Sidebar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [pillTop, setPillTop] = useState(0);
  const [pillHeight, setPillHeight] = useState(44);

  function isActive(href: string) {
    if (href === "/planilha") return pathname === "/planilha" || pathname === "/";
    return pathname.startsWith(href);
  }

  useEffect(() => {
    const activeItem = MENU_ITEMS.find((item) => isActive(item.href));
    if (!activeItem) return;
    const el = itemRefs.current[activeItem.href];
    const nav = navRef.current;
    if (!el || !nav) return;
    const navRect = nav.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setPillTop(elRect.top - navRect.top + nav.scrollTop);
    setPillHeight(elRect.height);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[250px] flex-col bg-white rounded-tr-[40px] rounded-br-[40px]">
      {/* Logo */}
      <div className="px-7 pt-8 pb-10">
        <div className="flex flex-col gap-0.5">
          <span
            className="text-[22px] font-bold leading-none tracking-tight"
            style={{ color: "#23201F" }}
          >
            privacy
          </span>
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.4px]"
            style={{ color: "#A08E7E" }}
          >
            Creator Hunting
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav ref={navRef} className="relative flex-1 overflow-y-auto px-4">
        {/* Pill deslizante spring */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-4 right-4 rounded-[18px]"
          style={{ backgroundColor: "#F68D3D" }}
          animate={{ top: pillTop, height: pillHeight }}
          transition={{ type: "spring", stiffness: 380, damping: 28, mass: 1 }}
        />

        <div className="flex flex-col gap-0.5">
          {MENU_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                ref={(el) => { itemRefs.current[item.href] = el; }}
                className={`group relative z-10 flex items-center gap-3.5 rounded-[18px] px-4 py-3 text-[15px] font-semibold transition-colors duration-150 ${
                  active
                    ? "text-white"
                    : "text-[#A08E7E] hover:bg-[rgba(213,203,192,0.35)] hover:text-[#23201F]"
                }`}
              >
                <Icon
                  size={18}
                  strokeWidth={2}
                  className={`shrink-0 transition-colors duration-150 ${
                    active ? "text-white" : "text-[#A08E7E] group-hover:text-[#23201F]"
                  } ${item.iconClass ?? ""}`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Rodapé */}
      <div className="px-7 py-6">
        <p className="text-[11px] font-semibold text-[#A08E7E]">Privacy © 2026</p>
      </div>
    </aside>
  );
}
