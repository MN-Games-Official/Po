"use client";

import { useRouter } from "next/navigation";

import { apiClient } from "@/lib/api-client";
import { removeStoredValue, setStoredValue } from "@/lib/storage";
import { useAuthContext } from "@/components/providers/AuthProvider";
import type { SessionUser } from "@/types/domain";

const TOKEN_STORAGE_KEY = "polaris_access_token";

export function useAuth() {
  const router = useRouter();
  const auth = useAuthContext();

  return {
    ...auth,
    async login(payload: { email: string; password: string }) {
      auth.dispatch({ type: "AUTH_START" });

      const data = await apiClient<{
        user: SessionUser;
        access_token: string;
      }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setStoredValue(TOKEN_STORAGE_KEY, data.access_token);
      auth.dispatch({
        type: "AUTH_SUCCESS",
        user: data.user,
        accessToken: data.access_token,
      });
      router.push("/dashboard");
      router.refresh();
    },
    async logout() {
      await apiClient("/api/auth/logout", {
        method: "POST",
      });
      removeStoredValue(TOKEN_STORAGE_KEY);
      auth.dispatch({ type: "AUTH_LOGOUT" });
      router.push("/login");
      router.refresh();
    },
  };
}

