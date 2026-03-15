"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, hint, error, options, id, ...props }, ref) => {
    const fieldId = id || props.name;

    return (
      <label className="flex flex-col gap-2">
        {label ? (
          <span className="text-sm font-medium text-text">{label}</span>
        ) : null}
        <select
          id={fieldId}
          ref={ref}
          className={cn(
            "h-12 rounded-2xl border border-white/10 bg-white/6 px-4 text-sm text-text outline-none transition focus:border-accent/60 focus:bg-white/10",
            error && "border-danger/60",
            className,
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error ? (
          <span className="text-xs text-danger">{error}</span>
        ) : hint ? (
          <span className="text-xs text-textMuted">{hint}</span>
        ) : null}
      </label>
    );
  },
);

Select.displayName = "Select";

