"use client";

import type { ApiKeyRecord } from "@/types/domain";
import { apiClient } from "@/lib/api-client";
import { useFetch } from "@/hooks/useFetch";

export function useApiKeys() {
  const state = useFetch<{ api_keys: ApiKeyRecord[] }>("/api/api-keys/polaris");

  return {
    ...state,
    apiKeys: state.data?.api_keys || [],
    generatePolarisKey(payload: {
      name: string;
      scopes: string[];
      expires_in: number;
    }) {
      return apiClient<{
        api_key: string;
        preview: string;
      }>("/api/api-keys/polaris", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    saveRobloxKey(payload: { api_key: string; validate: boolean }) {
      return apiClient<{
        preview: string;
        message: string;
      }>("/api/api-keys/roblox", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
  };
}

