"use client";

import { useForm, type DefaultValues } from "react-hook-form";

export function usePolarisForm<T extends Record<string, unknown>>(options?: {
  defaultValues?: Partial<T>;
}) {
  return useForm<T>({
    defaultValues: options?.defaultValues as DefaultValues<T> | undefined,
    mode: "onBlur",
  });
}
