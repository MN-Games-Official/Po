"use client";

import type { ApplicationDraft, ApplicationListItem } from "@/types/domain";
import { apiClient } from "@/lib/api-client";
import { useFetch } from "@/hooks/useFetch";

export function useApplications() {
  const state = useFetch<{ applications: ApplicationListItem[] }>(
    "/api/applications",
  );

  return {
    ...state,
    applications: state.data?.applications || [],
    async saveApplication(id: string | null, payload: ApplicationDraft) {
      return apiClient<{ application: ApplicationDraft }>(
        id ? `/api/applications/${id}` : "/api/applications",
        {
          method: id ? "PUT" : "POST",
          body: JSON.stringify(payload),
        },
      );
    },
    async removeApplication(id: string) {
      return apiClient(`/api/applications/${id}`, {
        method: "DELETE",
      });
    },
  };
}

