import type { ReactNode } from "react";

import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";

import { cn } from "@/lib/utils";

const toneMap = {
  info: {
    icon: Info,
    className: "border-sky-500/20 bg-sky-500/10 text-sky-100",
  },
  success: {
    icon: CheckCircle2,
    className: "border-success/20 bg-success/10 text-green-100",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-warning/20 bg-warning/10 text-amber-100",
  },
  danger: {
    icon: AlertCircle,
    className: "border-danger/20 bg-danger/10 text-rose-100",
  },
};

export function Alert({
  title,
  children,
  tone = "info",
}: {
  title: string;
  children: ReactNode;
  tone?: keyof typeof toneMap;
}) {
  const Icon = toneMap[tone].icon;

  return (
    <div
      className={cn(
        "flex gap-3 rounded-2xl border p-4 text-sm",
        toneMap[tone].className,
      )}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <div className="font-semibold">{title}</div>
        <div className="mt-1 opacity-85">{children}</div>
      </div>
    </div>
  );
}
