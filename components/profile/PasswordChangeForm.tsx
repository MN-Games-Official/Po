"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/useToast";
import { apiClient } from "@/lib/api-client";
import { changePasswordSchema } from "@/lib/validation";

type PasswordValues = z.infer<typeof changePasswordSchema>;

export function PasswordChangeForm() {
  const { push } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await apiClient("/api/users/change-password", {
        method: "POST",
        body: JSON.stringify(values),
      });
      reset();
      push({
        title: "Password changed",
        description: "Other active sessions were invalidated.",
        tone: "success",
      });
    } catch (error) {
      push({
        title: "Password change failed",
        description: error instanceof Error ? error.message : "Unknown error",
        tone: "danger",
      });
    }
  });

  return (
    <Card>
      <CardHeader
        title="Change password"
        subtitle="Use a strong credential and rotate old sessions."
      />
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input
          label="Current password"
          type="password"
          error={errors.current_password?.message}
          {...register("current_password")}
        />
        <Input
          label="New password"
          type="password"
          error={errors.new_password?.message}
          {...register("new_password")}
        />
        <Input
          label="Confirm new password"
          type="password"
          error={errors.confirm_password?.message}
          {...register("confirm_password")}
        />
        <Button type="submit" loading={isSubmitting}>
          Update password
        </Button>
      </form>
    </Card>
  );
}
