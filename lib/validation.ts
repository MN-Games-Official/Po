import { z } from "zod";

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(
    passwordRegex,
    "Password must include an uppercase letter, a number, and a special character.",
  );

export const signupSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, "Use letters, numbers, and underscores only."),
  password: passwordSchema,
  full_name: z.string().max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(8),
    new_password: passwordSchema,
    confirm_password: z.string().min(8),
  })
  .refine((value) => value.new_password === value.confirm_password, {
    message: "Passwords must match.",
    path: ["confirm_password"],
  });

export const questionSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["multiple_choice", "short_answer", "true_false"]),
  text: z.string().min(3).max(500),
  options: z.array(z.string().min(1).max(200)).optional(),
  correct_answer: z.union([z.number(), z.string(), z.boolean()]).optional(),
  max_score: z.number().min(1).max(100),
  grading_criteria: z.string().max(1000).optional(),
});

export const applicationSchema = z
  .object({
    name: z.string().min(3).max(100),
    description: z.string().max(500).optional().or(z.literal("")),
    group_id: z.string().regex(/^\d+$/),
    target_role: z.string().min(3).max(100),
    pass_score: z.number().min(0).max(100),
    style: z.object({
      primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      secondary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    }),
    questions: z.array(questionSchema).min(1).max(20),
  })
  .superRefine((value, ctx) => {
    const shortAnswers = value.questions.filter(
      (question) => question.type === "short_answer",
    );

    if (shortAnswers.length > 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Applications may contain at most 3 short-answer questions.",
        path: ["questions"],
      });
    }

    value.questions.forEach((question, index) => {
      if (
        question.type === "multiple_choice" &&
        (!question.options || question.options.length < 2)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Multiple choice questions need at least 2 options.",
          path: ["questions", index, "options"],
        });
      }
    });
  });

export const applicationGenerationSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  group_id: z.string().regex(/^\d+$/),
  rank: z.string().min(1).max(50),
  questions_count: z.number().min(3).max(12),
  vibe: z.enum(["professional", "strict", "welcoming", "elite", "friendly"]),
  primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  instructions: z.string().max(1000).optional(),
});

export const rankEntrySchema = z.object({
  id: z.string().min(1),
  rank_id: z.number().min(0).max(255),
  gamepass_id: z.number().min(0),
  name: z.string().min(2).max(100),
  description: z.string().max(500),
  price: z.number().min(0),
  is_for_sale: z.boolean(),
  regional_pricing: z.boolean(),
});

export const rankCenterSchema = z.object({
  name: z.string().min(3).max(100),
  group_id: z.string().regex(/^\d+$/),
  universe_id: z.string().regex(/^\d+$/).optional().or(z.literal("")),
  ranks: z.array(rankEntrySchema).min(1).max(25),
});

export const robloxApiKeySchema = z.object({
  api_key: z.string().min(20),
  validate: z.boolean().optional(),
});

export const polarisApiKeySchema = z.object({
  name: z.string().min(2).max(100),
  scopes: z.array(z.string()).min(1),
  expires_in: z.number().min(3600).max(60 * 60 * 24 * 365),
});

export const profileUpdateSchema = z.object({
  full_name: z.string().max(100).optional().or(z.literal("")),
  avatar_url: z.string().url().optional().or(z.literal("")),
});

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1),
    new_password: passwordSchema,
    confirm_password: z.string().min(8),
  })
  .refine((value) => value.new_password === value.confirm_password, {
    message: "Passwords must match.",
    path: ["confirm_password"],
  });

export const submissionSchema = z.object({
  app_id: z.string().uuid(),
  applicant_id: z.union([z.string(), z.number()]),
  membership_id: z.union([z.string(), z.number()]).optional(),
  answers: z.record(z.union([z.string(), z.number(), z.boolean()])),
});

export const robloxWebhookSchema = z.object({
  event: z.string(),
  group_id: z.string(),
  membership_id: z.string().optional(),
  payload: z.record(z.unknown()),
});
