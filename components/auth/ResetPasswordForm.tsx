"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/useToast";
import { apiClient } from "@/lib/api-client";
import { resetPasswordSchema } from "@/lib/validation";

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const params = useSearchParams();
  const { push } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: params.get("token") || "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await apiClient("/api/password/reset", {
        method: "POST",
        body: JSON.stringify(values),
      });
      push({
        title: "Password updated",
        description: "You can now sign in with your new password.",
        tone: "success",
      });
    } catch (error) {
      push({
        title: "Password reset failed",
        description: error instanceof Error ? error.message : "Unknown error",
        tone: "danger",
      });
    }
  });

  return (
    <Card className="w-full max-w-xl">
      <CardHeader
        title="Choose a new password"
        subtitle="Reset tokens expire after one hour."
      />
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input
          label="Reset token"
          error={errors.token?.message}
          {...register("token")}
        />
        <Input
          label="New password"
          type="password"
          error={errors.new_password?.message}
          {...register("new_password")}
        />
        <Input
          label="Confirm password"
          type="password"
          error={errors.confirm_password?.message}
          {...register("confirm_password")}
        />
        <Button type="submit" loading={isSubmitting} className="w-full">
          Save Password
        </Button>
        <Link href="/login" className="text-sm text-textMuted transition hover:text-text">
          Return to sign in
        </Link>
      </form>
    </Card>
  );
}

