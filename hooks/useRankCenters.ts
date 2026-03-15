"use client";

import type { RankCenterDraft, RankCenterListItem } from "@/types/domain";
import { apiClient } from "@/lib/api-client";
import { useFetch } from "@/hooks/useFetch";

export function useRankCenters() {
  const state = useFetch<{ rank_centers: RankCenterListItem[] }>(
    "/api/rank-centers",
  );

  return {
    ...state,
    rankCenters: state.data?.rank_centers || [],
    async saveRankCenter(id: string | null, payload: RankCenterDraft) {
      return apiClient<{ rank_center: RankCenterDraft }>(
        id ? `/api/rank-centers/${id}` : "/api/rank-centers",
        {
          method: id ? "PUT" : "POST",
          body: JSON.stringify(payload),
        },
      );
    },
    async removeRankCenter(id: string) {
      return apiClient(`/api/rank-centers/${id}`, {
        method: "DELETE",
      });
    },
  };
}

