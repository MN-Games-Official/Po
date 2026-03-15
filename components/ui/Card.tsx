import type { PropsWithChildren, ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/10 bg-panel/90 p-6 shadow-panel backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="font-display text-2xl text-text">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-textMuted">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
