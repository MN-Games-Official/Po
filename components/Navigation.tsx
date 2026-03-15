"use client";

import type { ReactNode } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function Navigation({
  items,
  vertical = false,
}: {
  items: Array<{ label: string; href: string; icon?: ReactNode }>;
  vertical?: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex gap-2",
        vertical ? "flex-col" : "flex-wrap items-center",
      )}
    >
      {items.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
              active
                ? "bg-white text-slate-950 shadow-panel"
                : "text-textMuted hover:bg-white/8 hover:text-text",
            )}
          >
            {item.icon ? (
              <span
                className={cn(
                  "transition",
                  active ? "text-accent" : "text-textMuted group-hover:text-text",
                )}
              >
                {item.icon}
              </span>
            ) : null}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
