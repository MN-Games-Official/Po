"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import type { RankEntry } from "@/types/domain";

export function RanksEditor({
  ranks,
  onAdd,
  onEdit,
  onRemove,
}: {
  ranks: RankEntry[];
  onAdd: () => void;
  onEdit: (rank: RankEntry) => void;
  onRemove: (rankId: string) => void;
}) {
  return (
    <Card>
      <CardHeader
        title="Configured ranks"
        subtitle="Every entry controls Roblox rank mapping and storefront behavior."
        action={
          <Button onClick={onAdd}>
            <Plus className="h-4 w-4" />
            Add rank
          </Button>
        }
      />
      <div className="space-y-3">
        {ranks.map((rank) => (
          <div
            key={rank.id}
            className="flex flex-col gap-4 rounded-[24px] border border-white/8 bg-white/4 p-5 lg:flex-row lg:items-center lg:justify-between"
          >
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-textMuted">
                Rank {rank.rank_id} | Gamepass {rank.gamepass_id || "None"}
              </div>
              <h3 className="mt-2 text-lg font-semibold text-text">{rank.name}</h3>
              <p className="mt-2 text-sm text-textMuted">{rank.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/8 px-4 py-3 text-sm text-textMuted">
                {rank.is_for_sale ? `${rank.price} Robux` : "Not for sale"}
              </div>
              <Button variant="ghost" onClick={() => onEdit(rank)}>
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button variant="danger" onClick={() => onRemove(rank.id)}>
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
