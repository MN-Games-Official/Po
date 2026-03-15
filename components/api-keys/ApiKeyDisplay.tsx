import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/formatters";
import type { ApiKeyRecord } from "@/types/domain";

export function ApiKeyDisplay({
  title,
  keys,
}: {
  title: string;
  keys: ApiKeyRecord[];
}) {
  return (
    <Card>
      <CardHeader
        title={title}
        subtitle="Stored API credentials are encrypted and only shown by prefix."
      />
      <div className="space-y-3">
        {keys.length === 0 ? (
          <p className="text-sm text-textMuted">No keys available.</p>
        ) : (
          keys.map((key) => (
            <div
              key={key.id}
              className="rounded-[24px] border border-white/8 bg-white/4 p-5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-lg font-medium text-text">
                  {key.name || key.key_prefix}
                </div>
                <Badge tone={key.is_active ? "success" : "warning"}>
                  {key.is_active ? "Active" : "Inactive"}
                </Badge>
                <Badge>{key.type}</Badge>
              </div>
              <div className="mt-3 text-sm text-textMuted">
                Prefix: {key.key_prefix}
              </div>
              <div className="mt-2 text-xs text-textMuted">
                Created {formatDateTime(key.created_at)}
                {key.last_used ? ` | Last used ${formatDateTime(key.last_used)}` : ""}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
