"use client";

import type { PropsWithChildren } from "react";

import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  title: string;
  className?: string;
}>) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-md">
      <div
        className={cn(
          "w-full max-w-2xl rounded-[28px] border border-white/10 bg-panel p-6 shadow-panel",
          className,
        )}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="font-display text-2xl text-text">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/6 p-2 text-textMuted transition hover:bg-white/10 hover:text-text"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

