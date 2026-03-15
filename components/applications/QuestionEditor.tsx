"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { Question } from "@/types/domain";

const formSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["multiple_choice", "short_answer", "true_false"]),
  text: z.string().min(3).max(500),
  optionsText: z.string().optional(),
  correct_answer: z.union([z.number(), z.string(), z.boolean()]).optional(),
  max_score: z.number().min(1).max(100),
  grading_criteria: z.string().max(1000).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const emptyQuestion: Question = {
  id: "",
  type: "multiple_choice",
  text: "",
  options: ["", ""],
  correct_answer: 0,
  max_score: 10,
  grading_criteria: "",
};

export function QuestionEditor({
  open,
  initialValue,
  onClose,
  onSave,
}: {
  open: boolean;
  initialValue?: Question | null;
  onClose: () => void;
  onSave: (question: Question) => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...emptyQuestion,
      optionsText: emptyQuestion.options?.join("\n"),
    },
  });

  const type = watch("type");

  useEffect(() => {
    if (!open) {
      return;
    }

    const nextValue = initialValue || emptyQuestion;
    reset({
      ...nextValue,
      optionsText: nextValue.options?.join("\n") || "",
      grading_criteria: nextValue.grading_criteria || "",
      correct_answer:
        typeof nextValue.correct_answer === "boolean"
          ? String(nextValue.correct_answer)
          : nextValue.correct_answer ?? 0,
    } as unknown as FormValues);
  }, [initialValue, open, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const normalized: Question = {
      id: values.id || crypto.randomUUID(),
      type: values.type,
      text: values.text,
      max_score: Number(values.max_score),
      options:
        values.type === "multiple_choice"
          ? (values.optionsText || "")
              .split("\n")
              .map((option) => option.trim())
              .filter(Boolean)
          : undefined,
      correct_answer:
        values.type === "multiple_choice"
          ? Number(values.correct_answer)
          : values.type === "true_false"
            ? values.correct_answer === "true"
            : values.correct_answer,
      grading_criteria:
        values.type === "short_answer" ? values.grading_criteria : undefined,
    };

    onSave(normalized);
    onClose();
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialValue ? "Edit question" : "Add question"}
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input
          label="Question ID"
          hint="Leave blank to auto-generate a stable ID."
          error={errors.id?.message}
          {...register("id")}
        />
        <Select
          label="Question type"
          error={errors.type?.message}
          options={[
            { label: "Multiple choice", value: "multiple_choice" },
            { label: "Short answer", value: "short_answer" },
            { label: "True / False", value: "true_false" },
          ]}
          {...register("type")}
        />
        <Textarea
          label="Question text"
          error={errors.text?.message}
          {...register("text")}
        />
        <Input
          label="Max score"
          type="number"
          error={errors.max_score?.message}
          {...register("max_score", { valueAsNumber: true })}
        />
        {type === "multiple_choice" ? (
          <>
            <Textarea
              label="Options"
              hint="Enter one option per line."
              {...register("optionsText")}
            />
            <Input
              label="Correct answer index"
              type="number"
              hint="0-based option index"
              error={errors.correct_answer?.message}
              {...register("correct_answer")}
            />
          </>
        ) : null}
        {type === "true_false" ? (
          <Select
            label="Correct answer"
            options={[
              { label: "True", value: "true" },
              { label: "False", value: "false" },
            ]}
            {...register("correct_answer")}
          />
        ) : null}
        {type === "short_answer" ? (
          <Textarea
            label="Grading criteria"
            hint="Describe what the grader should look for."
            {...register("grading_criteria")}
          />
        ) : null}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Save Question
          </Button>
        </div>
      </form>
    </Modal>
  );
}
