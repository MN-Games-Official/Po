export const APP_NAME = "Polaris Pilot";
export const ACCESS_TOKEN_COOKIE = "polaris_access_token";
export const REFRESH_TOKEN_COOKIE = "polaris_refresh_token";
export const AUTH_HEADER_PREFIX = "Bearer ";

export const PUBLIC_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export const DEFAULT_APPLICATION_STYLE = {
  primary_color: "#ff5d52",
  secondary_color: "#0f172a",
};

export const DEFAULT_APPLICATION_QUESTIONS = [
  {
    id: "foundation-values",
    type: "multiple_choice" as const,
    text: "Which trait matters most for a dependable group moderator?",
    options: ["Speed", "Patience", "Popularity", "Gamepasses"],
    correct_answer: 1,
    max_score: 10,
  },
  {
    id: "scenario-resolution",
    type: "short_answer" as const,
    text: "A player is upset after being warned twice. How do you de-escalate while still enforcing policy?",
    max_score: 10,
    grading_criteria:
      "Mentions empathy, clarity, policy adherence, and next-step guidance.",
  },
  {
    id: "policy-compliance",
    type: "true_false" as const,
    text: "A staff member should ignore written SOPs if a higher rank is offline.",
    correct_answer: false,
    max_score: 10,
  },
];

export const DEFAULT_RANKS = [
  {
    id: "member",
    rank_id: 1,
    gamepass_id: 0,
    name: "Member",
    description: "Base entry rank for approved applicants.",
    price: 0,
    is_for_sale: false,
    regional_pricing: false,
  },
];

export const POLARIS_SCOPES = [
  "applications:read",
  "applications:write",
  "submissions:read",
  "submissions:write",
  "rank-centers:read",
  "rank-centers:write",
];
