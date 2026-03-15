"use client";

import { useMemo, useState } from "react";
import { Edit3, Plus, Search, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import { useApplications } from "@/hooks/useApplications";
import { useToast } from "@/hooks/useToast";
import { formatDate, formatPercent } from "@/lib/formatters";

export function ApplicationList() {
  const { applications, loading, removeApplication } = useApplications();
  const { push } = useToast();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"updated" | "created">("updated");

  const filtered = useMemo(() => {
    return [...applications]
      .filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) =>
        sort === "updated"
          ? new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
  }, [applications, query, sort]);

  const totals = useMemo(() => {
    const totalSubmissions = applications.reduce(
      (sum, item) => sum + item.submission_count,
      0,
    );
    const totalPasses = applications.reduce((sum, item) => sum + item.pass_count, 0);

    return {
      totalApps: applications.length,
      totalSubmissions,
      passRate:
        totalSubmissions === 0 ? 0 : (totalPasses / totalSubmissions) * 100,
    };
  }, [applications]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="text-xs uppercase tracking-[0.28em] text-textMuted">
            Total applications
          </div>
          <div className="mt-3 text-4xl font-semibold text-text">
            {totals.totalApps}
          </div>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-[0.28em] text-textMuted">
            Total submissions
          </div>
          <div className="mt-3 text-4xl font-semibold text-text">
            {totals.totalSubmissions}
          </div>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-[0.28em] text-textMuted">
            Pass rate
          </div>
          <div className="mt-3 text-4xl font-semibold text-text">
            {formatPercent(totals.passRate)}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Application Center"
          subtitle="Create, refine, and monitor graded promotion intake forms."
          action={
            <Button href="/dashboard/application-center/new">
              <Plus className="h-4 w-4" />
              New application
            </Button>
          }
        />
        <div className="mb-5 flex flex-col gap-3 md:flex-row">
          <label className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4">
            <Search className="h-4 w-4 text-textMuted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search application names"
              className="h-12 w-full bg-transparent text-sm text-text outline-none placeholder:text-textMuted"
            />
          </label>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as "updated" | "created")}
            className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-text"
          >
            <option value="updated">Sort by last updated</option>
            <option value="created">Sort by created date</option>
          </select>
        </div>
        {loading ? (
          <Loading label="Loading applications" />
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
                  <p className="mt-2 max-w-2xl text-sm text-textMuted">
                    {item.description || "No description provided."}
                  </p>
                  <div className="mt-3 text-xs text-textMuted">
                    Created {formatDate(item.created_at)} | Updated{" "}
                    {formatDate(item.updated_at)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/8 px-4 py-3 text-sm text-textMuted">
                    {item.submission_count} submissions
                  </div>
                  <Button
                    variant="ghost"
                    href={`/dashboard/application-center/${item.id}`}
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={async () => {
                      try {
                        await removeApplication(item.id);
                        push({
                          title: "Application deleted",
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
    </div>
  );
}
