"use client";

import type { UserProfile } from "@/types/domain";
import { apiClient } from "@/lib/api-client";
import { useFetch } from "@/hooks/useFetch";

export function useUser() {
  const state = useFetch<{ user: UserProfile }>("/api/users/profile");

  return {
    ...state,
    user: state.data?.user || null,
    updateProfile(payload: { full_name?: string; avatar_url?: string }) {
      return apiClient<{ user: UserProfile }>("/api/users/profile/update", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    },
  };
}

