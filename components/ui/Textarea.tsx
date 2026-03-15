"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const fieldId = id || props.name;

    return (
      <label className="flex flex-col gap-2">
        {label ? (
          <span className="text-sm font-medium text-text">{label}</span>
        ) : null}
        <textarea
          id={fieldId}
          ref={ref}
          className={cn(
            "min-h-[128px] rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-text outline-none transition placeholder:text-textMuted focus:border-accent/60 focus:bg-white/10",
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

Textarea.displayName = "Textarea";

