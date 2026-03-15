"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { GripVertical, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PreviewPanel } from "@/components/applications/PreviewPanel";
import { QuestionEditor } from "@/components/applications/QuestionEditor";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Loading } from "@/components/ui/Loading";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/hooks/useToast";
import { apiClient } from "@/lib/api-client";
import {
  DEFAULT_APPLICATION_QUESTIONS,
  DEFAULT_APPLICATION_STYLE,
} from "@/lib/constants";
import { applicationSchema } from "@/lib/validation";
import type { ApplicationDraft, Question } from "@/types/domain";

const PolarisWidget = dynamic(
  () =>
    import("@/components/applications/PolarisWidget").then(
      (mod) => mod.PolarisWidget,
    ),
  {
    loading: () => <Loading label="Loading Polaris AI tools" />,
    ssr: false,
  },
);

type FormValues = z.infer<typeof applicationSchema>;

const defaultDraft: ApplicationDraft = {
  name: "Moderator Intake",
  description:
    "Structured promotion intake for candidates applying to moderation roles.",
  group_id: "",
  target_role: "rank: 218",
  pass_score: 75,
  style: DEFAULT_APPLICATION_STYLE,
  questions: DEFAULT_APPLICATION_QUESTIONS,
};

function reorderQuestions(questions: Question[], draggedId: string, targetId: string) {
  const draggedIndex = questions.findIndex((question) => question.id === draggedId);
  const targetIndex = questions.findIndex((question) => question.id === targetId);

  if (draggedIndex === -1 || targetIndex === -1) {
    return questions;
  }

  const copy = [...questions];
  const [dragged] = copy.splice(draggedIndex, 1);
  copy.splice(targetIndex, 0, dragged);
  return copy;
}

export function ApplicationBuilder({
  applicationId,
}: {
  applicationId?: string | null;
}) {
  const { push } = useToast();
  const [loading, setLoading] = useState(Boolean(applicationId));
  const [questions, setQuestions] = useState<Question[]>(
    defaultDraft.questions as Question[],
  );
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [draggedQuestionId, setDraggedQuestionId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: defaultDraft,
  });

  useEffect(() => {
    async function loadApplication() {
      if (!applicationId) {
        return;
      }

      try {
        setLoading(true);
        const data = await apiClient<{ application: ApplicationDraft }>(
          `/api/applications/${applicationId}`,
        );
        reset(data.application);
        setQuestions(data.application.questions);
      } catch (error) {
        push({
          title: "Unable to load application",
          description: error instanceof Error ? error.message : "Unknown error",
          tone: "danger",
        });
      } finally {
        setLoading(false);
      }
    }

    void loadApplication();
  }, [applicationId, push, reset]);

  const values = watch();

  const onSubmit = handleSubmit(async (formValues) => {
    try {
      const payload = { ...formValues, questions };
      const data = await apiClient<{ application: ApplicationDraft }>(
        applicationId ? `/api/applications/${applicationId}` : "/api/applications",
        {
          method: applicationId ? "PUT" : "POST",
          body: JSON.stringify(payload),
        },
      );
      reset(data.application);
      setQuestions(data.application.questions);
      push({
        title: applicationId ? "Application updated" : "Application created",
        description: "Your builder state is now saved to the database.",
        tone: "success",
      });
    } catch (error) {
      push({
        title: "Unable to save application",
        description: error instanceof Error ? error.message : "Unknown error",
        tone: "danger",
      });
    }
  });

  if (loading) {
    return <Loading label="Loading application builder" />;
  }

  const preview: ApplicationDraft = {
    ...values,
    description: values.description || "",
    questions,
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader
            title={applicationId ? "Edit Application" : "Create Application"}
            subtitle="Define metadata, style, and scoring thresholds."
            action={
              <div className="flex gap-3">
                <Button variant="ghost" href="/dashboard/application-center">
                  Back to list
                </Button>
                <Button onClick={onSubmit} loading={isSubmitting}>
                  <Save className="h-4 w-4" />
                  Save application
                </Button>
              </div>
            }
          />
          <div className="grid gap-4 md:grid-cols-2">
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
            <Input
              label="Target role"
              hint='Use "rank: 218" or "groups/x/roles/y".'
              error={errors.target_role?.message}
              {...register("target_role")}
            />
            <Input
              label="Pass score"
              type="number"
              error={errors.pass_score?.message}
              {...register("pass_score", { valueAsNumber: true })}
            />
            <Input
              label="Primary color"
              error={errors.style?.primary_color?.message}
              {...register("style.primary_color")}
            />
            <Input
              label="Secondary color"
              error={errors.style?.secondary_color?.message}
              {...register("style.secondary_color")}
            />
            <Textarea
              className="md:col-span-2"
              label="Description"
              error={errors.description?.message}
              {...register("description")}
            />
          </div>
        </Card>

        <PolarisWidget
          applicationId={applicationId}
          current={{
            name: values.name || defaultDraft.name,
            description: values.description,
            group_id: values.group_id || "",
            primary_color:
              values.style?.primary_color || DEFAULT_APPLICATION_STYLE.primary_color,
            secondary_color:
              values.style?.secondary_color ||
              DEFAULT_APPLICATION_STYLE.secondary_color,
          }}
          onImport={(generatedQuestions) => setQuestions(generatedQuestions)}
        />

        <Card>
          <CardHeader
            title="Questions"
            subtitle="Drag to reorder. Keep short-answer prompts focused and rubric-driven."
            action={
              <Button
                onClick={() => {
                  setEditingQuestion(null);
                  setEditorOpen(true);
                }}
              >
                <Plus className="h-4 w-4" />
                Add question
              </Button>
            }
          />
          <div className="space-y-3">
            {questions.map((question, index) => (
              <div
                key={question.id}
                draggable
                onDragStart={() => setDraggedQuestionId(question.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (draggedQuestionId) {
                    setQuestions((current) =>
                      reorderQuestions(current, draggedQuestionId, question.id),
                    );
                    setDraggedQuestionId(null);
                  }
                }}
                className="rounded-[24px] border border-white/8 bg-white/5 p-4"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-4">
                    <div className="rounded-2xl bg-white/8 p-3 text-textMuted">
                      <GripVertical className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.28em] text-textMuted">
                        Question {index + 1} | {question.type.replace("_", " ")}
                      </div>
                      <div className="mt-2 text-lg font-medium text-text">
                        {question.text}
                      </div>
                      <div className="mt-2 text-sm text-textMuted">
                        {question.type === "multiple_choice"
                          ? `${question.options?.length || 0} options`
                          : question.type === "short_answer"
                            ? question.grading_criteria
                            : `Correct answer: ${String(question.correct_answer)}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setEditingQuestion(question);
                        setEditorOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() =>
                        setQuestions((current) =>
                          current.filter((item) => item.id !== question.id),
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <PreviewPanel application={preview} />

      <QuestionEditor
        open={editorOpen}
        initialValue={editingQuestion}
        onClose={() => setEditorOpen(false)}
        onSave={(question) => {
          setQuestions((current) => {
            const exists = current.some((item) => item.id === question.id);
            if (exists) {
              return current.map((item) =>
                item.id === question.id ? question : item,
              );
            }

            return [...current, question];
          });
        }}
      />
    </div>
  );
}
