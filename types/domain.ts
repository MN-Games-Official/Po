export type QuestionType = "multiple_choice" | "short_answer" | "true_false";

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correct_answer?: number | string | boolean;
  max_score: number;
  grading_criteria?: string;
}

export interface ApplicationStyle {
  primary_color: string;
  secondary_color: string;
}

export interface ApplicationDraft {
  id?: string;
  name: string;
  description?: string;
  group_id: string;
  target_role: string;
  pass_score: number;
  style: ApplicationStyle;
  questions: Question[];
}

export interface ApplicationListItem {
  id: string;
  name: string;
  description?: string | null;
  group_id: string;
  target_role: string;
  created_at: string;
  updated_at: string;
  submission_count: number;
  pass_count: number;
}

export interface RankEntry {
  id: string;
  rank_id: number;
  gamepass_id: number;
  name: string;
  description: string;
  price: number;
  is_for_sale: boolean;
  regional_pricing: boolean;
}

export interface RankCenterDraft {
  id?: string;
  name: string;
  group_id: string;
  universe_id?: string;
  ranks: RankEntry[];
}

export interface RankCenterListItem {
  id: string;
  name: string;
  group_id: string;
  universe_id?: string | null;
  rank_count: number;
  created_at: string;
  updated_at: string;
}

export interface SubmissionBreakdown {
  type: QuestionType;
  score: number;
  max_score: number;
  feedback: string;
}

export interface DashboardStats {
  totalApplications: number;
  totalRankCenters: number;
  totalSubmissions: number;
  passRate: number;
  robloxKeyActive: boolean;
  polarisKeyCount: number;
}

export interface RecentSubmission {
  id: string;
  application_name: string;
  roblox_user_id: string;
  score: number;
  max_score: number;
  passed: boolean;
  submitted_at: string;
}

export interface ApiKeyRecord {
  id: number;
  type: "roblox" | "polaris";
  name?: string | null;
  key_prefix: string;
  created_at: string;
  updated_at: string;
  last_used?: string | null;
  is_active: boolean;
  scopes?: string[];
  expires_at?: string | null;
}

export interface UserProfile {
  id: number;
  email: string;
  username: string;
  full_name?: string | null;
  avatar_url?: string | null;
  email_verified: boolean;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface SessionUser {
  id: number;
  email: string;
  username: string;
  full_name?: string | null;
  avatar_url?: string | null;
  email_verified: boolean;
}

export interface AuthState {
  status: "idle" | "authenticated" | "anonymous" | "loading";
  user: SessionUser | null;
  accessToken: string | null;
}
