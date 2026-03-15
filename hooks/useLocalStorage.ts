"use client";

import { useEffect, useState } from "react";

import { getStoredValue, setStoredValue } from "@/lib/storage";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => getStoredValue(key, initialValue));

  useEffect(() => {
    setStoredValue(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}

