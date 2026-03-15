"use client";

import { Sparkles } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/hooks/useToast";
import { apiClient } from "@/lib/api-client";
import { applicationGenerationSchema } from "@/lib/validation";
import type { Question } from "@/types/domain";

type GeneratorValues = z.infer<typeof applicationGenerationSchema>;

export function AIFormGenerator({
  current,
  applicationId,
  onImport,
}: {
  current: {
    name: string;
    description?: string;
    group_id: string;
    primary_color: string;
    secondary_color: string;
  };
  applicationId?: string | null;
  onImport: (questions: Question[]) => void;
}) {
  const { push } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GeneratorValues>({
    resolver: zodResolver(applicationGenerationSchema),
    defaultValues: {
      name: current.name || "Moderator Intake",
      description: current.description || "",
      group_id: current.group_id || "",
      rank: "218",
      questions_count: 6,
      vibe: "professional",
      primary_color: current.primary_color,
      secondary_color: current.secondary_color,
      instructions: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const endpoint = applicationId
        ? `/api/applications/${applicationId}/generate`
        : "/api/applications/temporary/generate";
      const data = await apiClient<{ questions: Question[] }>(endpoint, {
        method: "POST",
        body: JSON.stringify(values),
      });

      onImport(data.questions);
      push({
        title: "Questions generated",
        description: "Review them in the preview and builder before saving.",
        tone: "success",
      });
    } catch (error) {
      push({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Unknown error",
        tone: "danger",
      });
    }
  });

  return (
    <Card className="overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent via-orange-300 to-sky-300" />
      <CardHeader
        title="Polaris AI Generator"
        subtitle="Generate a structured question set tuned for your group and rank target."
        action={
          <div className="rounded-full bg-accent/12 p-3 text-accent">
            <Sparkles className="h-5 w-5" />
          </div>
        }
      />
      <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
        <Input
          label="Application name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Group ID"
          error={errors.group_id?.message}
          {...register("group_id")}
        />
        <Input label="Target rank" error={errors.rank?.message} {...register("rank")} />
        <Input
          label="Questions"
          type="number"
          error={errors.questions_count?.message}
          {...register("questions_count", { valueAsNumber: true })}
        />
        <Select
          label="Tone"
          error={errors.vibe?.message}
          options={[
            { label: "Professional", value: "professional" },
            { label: "Strict", value: "strict" },
            { label: "Welcoming", value: "welcoming" },
            { label: "Elite", value: "elite" },
            { label: "Friendly", value: "friendly" },
          ]}
          {...register("vibe")}
        />
        <Input
          label="Primary color"
          error={errors.primary_color?.message}
          {...register("primary_color")}
        />
        <Textarea
          label="Description"
          className="md:col-span-2"
          error={errors.description?.message}
          {...register("description")}
        />
        <Textarea
          label="Extra instructions"
          className="md:col-span-2"
          error={errors.instructions?.message}
          {...register("instructions")}
        />
        <div className="md:col-span-2">
          <Button type="submit" loading={isSubmitting}>
            Generate Questions
          </Button>
        </div>
      </form>
    </Card>
  );
}

