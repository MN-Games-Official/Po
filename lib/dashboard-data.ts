import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { safePercentage } from "@/lib/utils";
import type { DashboardStats, RecentSubmission } from "@/types/domain";

export async function getDashboardOverview(userId: number): Promise<{
  stats: DashboardStats;
  recentSubmissions: RecentSubmission[];
}> {
  try {
    const [
      totalApplications,
      totalRankCenters,
      submissions,
      robloxKey,
      polarisKeys,
      recentSubmissionRows,
    ] = await Promise.all([
      db.application.count({ where: { userId } }),
      db.rankCenter.count({ where: { userId } }),
      db.applicationSubmission.findMany({
        where: {
          application: {
            userId,
          },
        },
        select: {
          id: true,
          score: true,
          maxScore: true,
          passed: true,
          robloxUserId: true,
          submittedAt: true,
          application: {
            select: {
              name: true,
            },
          },
        },
      }),
      db.apiKey.findFirst({
        where: { userId, type: "roblox", isActive: true },
      }),
      db.apiKey.count({
        where: { userId, type: "polaris", isActive: true },
      }),
      db.applicationSubmission.findMany({
        where: {
          application: {
            userId,
          },
        },
        take: 6,
        orderBy: { submittedAt: "desc" },
        select: {
          id: true,
          score: true,
          maxScore: true,
          passed: true,
          robloxUserId: true,
          submittedAt: true,
          application: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    const passCount = submissions.filter(
      (item: { passed: boolean }) => item.passed,
    ).length;

    return {
      stats: {
        totalApplications,
        totalRankCenters,
        totalSubmissions: submissions.length,
        passRate: safePercentage(passCount, submissions.length),
        robloxKeyActive: Boolean(robloxKey),
        polarisKeyCount: polarisKeys,
      },
      recentSubmissions: recentSubmissionRows.map((row) => ({
        id: row.id,
        application_name: row.application.name,
        roblox_user_id: row.robloxUserId,
        score: row.score,
        max_score: row.maxScore,
        passed: row.passed,
        submitted_at: row.submittedAt.toISOString(),
      })),
    };
  } catch (error) {
    logger.warn("Falling back to empty dashboard overview", error as Error);

    return {
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
  }
}
