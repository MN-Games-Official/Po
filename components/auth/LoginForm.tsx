"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { loginSchema } from "@/lib/validation";

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const { push } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login(values);
      push({
        title: "Signed in",
        description: "Redirecting to the dashboard.",
        tone: "success",
      });
    } catch (error) {
      push({
        title: "Unable to sign in",
        description: error instanceof Error ? error.message : "Unknown error",
        tone: "danger",
      });
    }
  });

  return (
    <Card className="w-full max-w-xl">
      <CardHeader
        title="Welcome back"
        subtitle="Access the Polaris Pilot control deck."
      />
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <div className="flex items-center justify-between text-sm">
          <Link
            href="/forgot-password"
            className="text-textMuted transition hover:text-text"
          >
            Forgot password?
          </Link>
          <Link href="/signup" className="text-accent transition hover:brightness-110">
            Create account
          </Link>
        </div>
        <Button type="submit" loading={isSubmitting} className="w-full">
          Sign In
        </Button>
      </form>
    </Card>
  );
}

