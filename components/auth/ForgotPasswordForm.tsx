"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/useToast";
import { apiClient } from "@/lib/api-client";
import { forgotPasswordSchema } from "@/lib/validation";

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const { push } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await apiClient("/api/password/request-reset", {
        method: "POST",
        body: JSON.stringify(values),
      });
      push({
        title: "Reset email queued",
        description: "If the email exists, a reset link was sent.",
        tone: "success",
      });
    } catch (error) {
      push({
        title: "Reset request failed",
        description: error instanceof Error ? error.message : "Unknown error",
        tone: "danger",
      });
    }
  });

  return (
    <Card className="w-full max-w-xl">
      <CardHeader
        title="Reset your password"
        subtitle="We’ll email a time-limited secure reset link."
      />
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Button type="submit" loading={isSubmitting} className="w-full">
          Send Reset Link
        </Button>
        <Link href="/login" className="text-sm text-textMuted transition hover:text-text">
          Return to sign in
        </Link>
      </form>
    </Card>
  );
}

