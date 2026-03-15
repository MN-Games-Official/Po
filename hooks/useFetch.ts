"use client";

import { useEffect, useState } from "react";

import { apiClient } from "@/lib/api-client";

export function useFetch<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(url));

  useEffect(() => {
    let active = true;

    async function run() {
      if (!url) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const payload = await apiClient<T>(url);
        if (active) {
          setData(payload);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Request failed");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void run();

    return () => {
      active = false;
    };
  }, [url]);

  return { data, error, loading, setData };
}

