import { formatRelative } from "@/lib/formatters";
import type { RecentSubmission } from "@/types/domain";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function ActivityFeed({
  items,
}: {
  items: RecentSubmission[];
}) {
  return (
    <Card>
      <CardHeader
        title="Recent Submission Activity"
        subtitle="Latest grading and promotion decisions"
      />
      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-textMuted">
            No submissions yet. Connect your embedded form endpoint to start
            collecting grading activity.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 rounded-2xl border border-white/8 bg-white/4 p-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <div className="font-medium text-text">{item.application_name}</div>
                <div className="text-sm text-textMuted">
                  Roblox user {item.roblox_user_id} | {formatRelative(item.submitted_at)}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-textMuted">
                  {Math.round((item.score / item.max_score) * 100)}%
                </div>
                <Badge tone={item.passed ? "success" : "danger"}>
                  {item.passed ? "Passed" : "Failed"}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
