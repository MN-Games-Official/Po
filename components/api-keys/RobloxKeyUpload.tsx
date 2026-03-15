"use client";

import { KeyRound, Link2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/useToast";
import { apiClient } from "@/lib/api-client";
import { robloxApiKeySchema } from "@/lib/validation";

type RobloxKeyValues = z.infer<typeof robloxApiKeySchema>;

export function RobloxKeyUpload() {
  const { push } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RobloxKeyValues>({
    resolver: zodResolver(robloxApiKeySchema),
    defaultValues: {
      api_key: "",
      validate: true,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const data = await apiClient<{ message: string; preview: string }>(
        "/api/api-keys/roblox",
        {
          method: "POST",
          body: JSON.stringify(values),
        },
      );

      push({
        title: "Roblox key saved",
        description: `${data.message} (${data.preview})`,
        tone: "success",
      });
    } catch (error) {
      push({
        title: "Roblox key rejected",
        description: error instanceof Error ? error.message : "Unknown error",
        tone: "danger",
      });
    }
  });

  return (
    <Card>
      <CardHeader
        title="Roblox Cloud API key"
        subtitle="Store an encrypted key for live membership checks and promotions."
        action={
          <Button
            variant="ghost"
            href="https://create.roblox.com/dashboard/credentials"
            target="_blank"
            rel="noreferrer"
          >
            <Link2 className="h-4 w-4" />
            Open Roblox portal
          </Button>
        }
      />
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input
          label="API key"
          type="password"
          error={errors.api_key?.message}
          {...register("api_key")}
        />
        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-textMuted">
          <input
            type="checkbox"
            defaultChecked
            {...register("validate")}
            className="h-4 w-4 rounded border-white/20 bg-white/10"
          />
          Validate against Roblox before saving
        </label>
        <Button type="submit" loading={isSubmitting}>
          <KeyRound className="h-4 w-4" />
          Save key
        </Button>
      </form>
    </Card>
  );
}
