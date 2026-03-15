import type { Question } from "@/types/domain";

import { AIFormGenerator } from "@/components/applications/AIFormGenerator";

export function PolarisWidget(props: {
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
  return <AIFormGenerator {...props} />;
}
