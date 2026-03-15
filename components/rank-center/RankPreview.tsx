import { Card, CardHeader } from "@/components/ui/Card";
import type { RankCenterDraft } from "@/types/domain";

export function RankPreview({
  rankCenter,
}: {
  rankCenter: RankCenterDraft;
}) {
  return (
    <Card className="sticky top-6">
      <CardHeader
        title="Live preview"
        subtitle="Quick scan of your rank storefront structure"
      />
      <div className="space-y-4">
        <div className="rounded-[24px] border border-white/8 bg-gradient-to-br from-accent/10 via-white/4 to-sky-400/10 p-5">
          <div className="text-xs uppercase tracking-[0.28em] text-textMuted">
            Group {rankCenter.group_id}
          </div>
          <h3 className="mt-3 font-display text-3xl text-text">
            {rankCenter.name || "Untitled rank center"}
          </h3>
          <p className="mt-2 text-sm text-textMuted">
            Universe ID: {rankCenter.universe_id || "Not connected"}
          </p>
        </div>
        {rankCenter.ranks.map((rank) => (
          <div
            key={rank.id}
            className="rounded-[22px] border border-white/8 bg-white/4 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-lg font-medium text-text">{rank.name}</div>
              <div className="text-sm text-textMuted">Rank {rank.rank_id}</div>
            </div>
            <p className="mt-2 text-sm text-textMuted">{rank.description}</p>
            <div className="mt-3 text-xs uppercase tracking-[0.24em] text-textMuted">
              {rank.is_for_sale
                ? `${rank.price} Robux | ${rank.regional_pricing ? "Regional pricing" : "Flat pricing"}`
                : "Internal-only rank"}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
