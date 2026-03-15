import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.24em]",
        tone === "default" && "bg-white/10 text-textMuted",
        tone === "success" && "bg-success/15 text-success",
        tone === "warning" && "bg-warning/15 text-warning",
        tone === "danger" && "bg-danger/15 text-danger",
      )}
    >
      {children}
    </span>
  );
}
