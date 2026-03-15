"use client";

import { CheckCircle2, Info, OctagonAlert } from "lucide-react";

import { cn } from "@/lib/utils";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  tone?: "info" | "success" | "danger";
}

const iconMap = {
  info: Info,
  success: CheckCircle2,
  danger: OctagonAlert,
};

export function Toast({ message }: { message: ToastMessage }) {
  const tone = message.tone || "info";
  const Icon = iconMap[tone];

  return (
    <div
      className={cn(
        "min-w-[280px] rounded-2xl border px-4 py-3 shadow-panel backdrop-blur-xl",
        tone === "info" && "border-sky-500/25 bg-sky-500/10 text-sky-50",
        tone === "success" &&
          "border-success/25 bg-success/10 text-emerald-50",
        tone === "danger" && "border-danger/25 bg-danger/10 text-rose-50",
      )}
    >
      <div className="flex gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <div className="font-medium">{message.title}</div>
          {message.description ? (
            <div className="mt-1 text-sm opacity-80">{message.description}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
