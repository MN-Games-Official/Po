import { ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/Card";

export function StatsCard({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend?: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent via-orange-300 to-sky-300" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-textMuted">
            {label}
          </p>
          <div className="mt-3 text-4xl font-semibold text-text">{value}</div>
        </div>
        <div className="rounded-full bg-white/8 p-2 text-accent">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
      {trend ? <p className="mt-4 text-sm text-textMuted">{trend}</p> : null}
    </Card>
  );
}

