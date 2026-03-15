import { parseJson } from "@/lib/utils";
import type {
  ApiKeyRecord,
  ApplicationDraft,
  ApplicationListItem,
  RankCenterDraft,
  RankCenterListItem,
  UserProfile,
} from "@/types/domain";

export function serializeUser(user: {
  id: number;
  email: string;
  username: string;
  fullName?: string | null;
  avatarUrl?: string | null;
  emailVerified: boolean;
  createdAt: Date;
}): UserProfile {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    full_name: user.fullName || null,
    avatar_url: user.avatarUrl || null,
    email_verified: user.emailVerified,
    created_at: user.createdAt.toISOString(),
  };
}

export function serializeApiKey(item: {
  id: number;
  type: string;
  name?: string | null;
  keyPrefix: string;
  createdAt: Date;
  updatedAt: Date;
  lastUsed?: Date | null;
  isActive: boolean;
  scopesJson?: string | null;
  expiresAt?: Date | null;
}): ApiKeyRecord {
  return {
    id: item.id,
    type: item.type as "roblox" | "polaris",
    name: item.name || null,
    key_prefix: item.keyPrefix,
    created_at: item.createdAt.toISOString(),
    updated_at: item.updatedAt.toISOString(),
    last_used: item.lastUsed?.toISOString() || null,
    is_active: item.isActive,
    scopes: parseJson(item.scopesJson, [] as string[]),
    expires_at: item.expiresAt?.toISOString() || null,
  };
}

export function serializeApplication(item: {
  id: string;
  name: string;
  description?: string | null;
  groupId: string;
  targetRole: string;
  passScore: number;
  primaryColor: string;
  secondaryColor: string;
  questionsJson: string;
  styleJson?: string | null;
  createdAt: Date;
  updatedAt: Date;
}): ApplicationDraft {
  return {
    id: item.id,
    name: item.name,
    description: item.description || "",
    group_id: item.groupId,
    target_role: item.targetRole,
    pass_score: item.passScore,
    style: parseJson(item.styleJson, {
      primary_color: item.primaryColor,
      secondary_color: item.secondaryColor,
    }),
    questions: parseJson(item.questionsJson, []),
  };
}

export function serializeApplicationListItem(item: {
  id: string;
  name: string;
  description?: string | null;
  groupId: string;
  targetRole: string;
  createdAt: Date;
  updatedAt: Date;
  submissions?: Array<{ passed: boolean }>;
  _count?: { submissions: number };
}): ApplicationListItem {
  const submissions = item.submissions || [];
  return {
    id: item.id,
    name: item.name,
    description: item.description || null,
    group_id: item.groupId,
    target_role: item.targetRole,
    created_at: item.createdAt.toISOString(),
    updated_at: item.updatedAt.toISOString(),
    submission_count: item._count?.submissions ?? submissions.length,
    pass_count: submissions.filter((submission) => submission.passed).length,
  };
}

export function serializeRankCenter(item: {
  id: string;
  name: string;
  groupId: string;
  universeId?: string | null;
  ranksJson: string;
}): RankCenterDraft {
  return {
    id: item.id,
    name: item.name,
    group_id: item.groupId,
    universe_id: item.universeId || "",
    ranks: parseJson(item.ranksJson, []),
  };
}

export function serializeRankCenterListItem(item: {
  id: string;
  name: string;
  groupId: string;
  universeId?: string | null;
  ranksJson: string;
  createdAt: Date;
  updatedAt: Date;
}): RankCenterListItem {
  const ranks = parseJson(item.ranksJson, [] as unknown[]);
  return {
    id: item.id,
    name: item.name,
    group_id: item.groupId,
    universe_id: item.universeId || null,
    rank_count: ranks.length,
    created_at: item.createdAt.toISOString(),
    updated_at: item.updatedAt.toISOString(),
  };
}
