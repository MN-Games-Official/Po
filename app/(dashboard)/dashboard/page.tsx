import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { getSessionUserFromCookies } from "@/lib/auth";
import { getDashboardOverview } from "@/lib/dashboard-data";

export default async function DashboardPage() {
  const user = await getSessionUserFromCookies();
  const overview = user
    ? await getDashboardOverview(user.id)
    : {
        stats: {
          totalApplications: 0,
          totalRankCenters: 0,
          totalSubmissions: 0,
          passRate: 0,
          robloxKeyActive: false,
          polarisKeyCount: 0,
        },
        recentSubmissions: [],
      };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] border border-white/10 bg-panel p-8 shadow-panel">
        <div className="max-w-3xl">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.32em] text-textMuted">
            Internal Control Layer
          </div>
          <h1 className="mt-6 font-display text-5xl text-text">
            Monitor applications, rank commerce, and promotion readiness.
          </h1>
          <p className="mt-4 text-base leading-7 text-textMuted">
            This dashboard surfaces the operator metrics that matter most: form
            output, submission quality, key availability, and recent grading flow.
          </p>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Applications"
          value={String(overview.stats.totalApplications)}
          trend="Forms currently deployed to your internal intake catalog."
        />
        <StatsCard
          label="Rank centers"
          value={String(overview.stats.totalRankCenters)}
          trend="Commercial and internal rank mappings saved for group use."
        />
        <StatsCard
          label="Submissions"
          value={String(overview.stats.totalSubmissions)}
          trend="Total graded attempts across all applications."
        />
        <StatsCard
          label="Pass rate"
          value={`${overview.stats.passRate}%`}
          trend={`Roblox key ${overview.stats.robloxKeyActive ? "connected" : "missing"} | ${overview.stats.polarisKeyCount} Polaris keys active`}
        />
      </div>

      <QuickActions />
      <ActivityFeed items={overview.recentSubmissions} />
    </div>
  );
}
