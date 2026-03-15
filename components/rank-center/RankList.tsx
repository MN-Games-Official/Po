"use client";

import { useMemo, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import { useRankCenters } from "@/hooks/useRankCenters";
import { useToast } from "@/hooks/useToast";
import { formatDate } from "@/lib/formatters";

export function RankList() {
  const { rankCenters, loading, removeRankCenter } = useRankCenters();
  const { push } = useToast();
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      rankCenters.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [query, rankCenters],
  );

  return (
    <Card>
      <CardHeader
        title="Rank Center"
        subtitle="Configure rank bundles, gamepasses, prices, and purchase states."
        action={
          <Button href="/dashboard/rank-center/new">
            <Plus className="h-4 w-4" />
            New rank center
          </Button>
        }
      />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search rank centers"
        className="mb-5 h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-text outline-none placeholder:text-textMuted"
      />
      {loading ? (
        <Loading label="Loading rank centers" />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-[24px] border border-white/8 bg-white/4 p-5 lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-textMuted">
                  Group {item.group_id}
                </div>
                <h3 className="mt-2 text-xl font-semibold text-text">{item.name}</h3>
                <p className="mt-2 text-sm text-textMuted">
                  {item.rank_count} configured ranks | Created {formatDate(item.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" href={`/dashboard/rank-center/${item.id}`}>
                  <Edit3 className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={async () => {
                    try {
                      await removeRankCenter(item.id);
                      push({
                        title: "Rank center deleted",
                        description: `${item.name} was removed.`,
                        tone: "success",
                      });
                      window.location.reload();
                    } catch (error) {
                      push({
                        title: "Delete failed",
                        description:
                          error instanceof Error ? error.message : "Unknown error",
                        tone: "danger",
                      });
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
