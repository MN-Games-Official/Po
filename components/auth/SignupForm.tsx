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
import { signupSchema } from "@/lib/validation";

type SignupValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const { push } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await apiClient("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(values),
      });
      reset();
      push({
        title: "Account created",
        description: "Check your email for the verification link.",
        tone: "success",
      });
    } catch (error) {
      push({
        title: "Unable to create account",
        description: error instanceof Error ? error.message : "Unknown error",
        tone: "danger",
      });
    }
  });

  return (
    <Card className="w-full max-w-xl">
      <CardHeader
        title="Create your operator account"
        subtitle="Internal access only. Email verification is required."
      />
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Username"
          error={errors.username?.message}
          {...register("username")}
        />
        <Input
          label="Full name"
          error={errors.full_name?.message}
          {...register("full_name")}
        />
        <Input
          label="Password"
          type="password"
          hint="Minimum 8 characters, 1 uppercase, 1 number, 1 special character."
          error={errors.password?.message}
          {...register("password")}
        />
        <Button type="submit" loading={isSubmitting} className="w-full">
          Create Account
        </Button>
        <p className="text-sm text-textMuted">
          Already onboarded?{" "}
          <Link href="/login" className="text-accent transition hover:brightness-110">
            Sign in
          </Link>
        </p>
      </form>
    </Card>
  );
}

