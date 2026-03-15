"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const fieldId = id || props.name;

    return (
      <label className="flex flex-col gap-2">
        {label ? (
          <span className="text-sm font-medium text-text">{label}</span>
        ) : null}
        <input
          id={fieldId}
          ref={ref}
          className={cn(
            "h-12 rounded-2xl border border-white/10 bg-white/6 px-4 text-sm text-text outline-none transition placeholder:text-textMuted focus:border-accent/60 focus:bg-white/10",
            error && "border-danger/60",
            className,
          )}
          {...props}
        />
        {error ? (
          <span className="text-xs text-danger">{error}</span>
        ) : hint ? (
          <span className="text-xs text-textMuted">{hint}</span>
        ) : null}
      </label>
    );
  },
);

Input.displayName = "Input";

