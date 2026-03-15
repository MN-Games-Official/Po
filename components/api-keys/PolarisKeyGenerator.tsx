"use client";

import { useState } from "react";
import { Copy, WandSparkles } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/hooks/useToast";
import { apiClient } from "@/lib/api-client";
import { POLARIS_SCOPES } from "@/lib/constants";
import { polarisApiKeySchema } from "@/lib/validation";

type PolarisKeyValues = z.infer<typeof polarisApiKeySchema>;

export function PolarisKeyGenerator() {
  const { push } = useToast();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PolarisKeyValues>({
    resolver: zodResolver(polarisApiKeySchema),
    defaultValues: {
      name: "Primary Integration",
      scopes: ["applications:read", "submissions:read"],
      expires_in: 60 * 60 * 24 * 30,
    },
  });
  const generatedScopes = watch("scopes");
  const [generatedKey, setGeneratedKey] = useState("");

  const onSubmit = handleSubmit(async (values) => {
    try {
      const data = await apiClient<{
        api_key: string;
        preview: string;
        message: string;
      }>("/api/api-keys/polaris", {
        method: "POST",
        body: JSON.stringify(values),
      });

      setGeneratedKey(data.api_key);
      push({
        title: "Polaris key issued",
        description: data.preview,
        tone: "success",
      });
    } catch (error) {
      push({
        title: "Key generation failed",
        description: error instanceof Error ? error.message : "Unknown error",
        tone: "danger",
      });
    }
  });

  return (
    <Card>
      <CardHeader
        title="Polaris service key"
        subtitle="Generate scoped integration credentials for internal services."
        action={
          <div className="rounded-full bg-accent/12 p-3 text-accent">
            <WandSparkles className="h-5 w-5" />
          </div>
        }
      />
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input
          label="Key name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Select
          label="Expiry"
          options={[
            { label: "7 days", value: String(60 * 60 * 24 * 7) },
            { label: "30 days", value: String(60 * 60 * 24 * 30) },
            { label: "90 days", value: String(60 * 60 * 24 * 90) },
          ]}
          {...register("expires_in", { valueAsNumber: true })}
        />
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-medium text-text">Scopes</div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {POLARIS_SCOPES.map((scope) => (
              <label
                key={scope}
                className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-textMuted"
              >
                <input
                  type="checkbox"
                  value={scope}
                  {...register("scopes")}
                  className="h-4 w-4"
                />
                {scope}
              </label>
            ))}
          </div>
          {errors.scopes?.message ? (
            <p className="mt-2 text-xs text-danger">{errors.scopes.message}</p>
          ) : null}
        </div>
        <Button type="submit" loading={isSubmitting}>
          Generate key
        </Button>
      </form>
      {generatedKey ? (
        <div className="mt-5 rounded-[24px] border border-success/20 bg-success/10 p-5">
          <div className="text-xs uppercase tracking-[0.28em] text-green-100/70">
            Copy now
          </div>
          <div className="mt-3 break-all font-mono text-sm text-green-50">
            {generatedKey}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-xs text-green-100/75">
              Selected scopes: {generatedScopes.join(", ")}
            </div>
            <Button
              variant="secondary"
              onClick={async () => {
                await navigator.clipboard.writeText(generatedKey);
                push({
                  title: "Copied",
                  description: "The key is now in your clipboard.",
                  tone: "success",
                });
              }}
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
