import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import type { ApplicationDraft } from "@/types/domain";

export function PreviewPanel({
  application,
}: {
  application: ApplicationDraft;
}) {
  return (
    <Card className="sticky top-6">
      <CardHeader
        title="Live Preview"
        subtitle="How your application will feel in the embedded experience"
      />
      <div
        className="overflow-hidden rounded-[28px] border border-white/10"
        style={{
          background: `linear-gradient(135deg, ${application.style.secondary_color}, ${application.style.primary_color})`,
        }}
      >
        <div className="bg-slate-950/35 p-6 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{application.group_id || "Group ID"}</Badge>
            <Badge tone="success">{application.target_role || "Role target"}</Badge>
          </div>
          <h3 className="mt-5 font-display text-3xl text-white">
            {application.name || "Untitled application"}
          </h3>
          <p className="mt-3 max-w-xl text-sm text-white/80">
            {application.description ||
              "Set the context for candidates and explain exactly what this assessment is evaluating."}
          </p>
          <div className="mt-6 grid gap-4">
            {application.questions.map((question, index) => (
              <div
                key={question.id}
                className="rounded-[24px] border border-white/12 bg-white/10 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs uppercase tracking-[0.28em] text-white/60">
                    Question {index + 1}
                  </div>
                  <Badge>{question.max_score} pts</Badge>
                </div>
                <div className="mt-3 text-base font-medium text-white">
                  {question.text}
                </div>
                <div className="mt-4 text-sm text-white/75">
                  {question.type === "multiple_choice"
                    ? question.options?.map((option, optionIndex) => (
                        <div key={`${question.id}-${option}`} className="mb-2">
                          {String.fromCharCode(65 + optionIndex)}. {option}
                        </div>
                      ))
                    : question.type === "true_false"
                      ? "True or False"
                      : question.grading_criteria || "Short answer response"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

