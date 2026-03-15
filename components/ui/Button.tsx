"use client";

import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white shadow-glow hover:-translate-y-0.5 hover:brightness-105",
  secondary:
    "bg-white/10 text-text ring-1 ring-white/15 hover:bg-white/14 hover:-translate-y-0.5",
  ghost:
    "bg-transparent text-textMuted ring-1 ring-white/10 hover:bg-white/8 hover:text-text",
  danger:
    "bg-danger/90 text-white hover:bg-danger hover:-translate-y-0.5",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      href,
      target,
      rel,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const classNames = cn(
      "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 disabled:cursor-not-allowed disabled:opacity-60",
      variantClasses[variant],
      sizeClasses[size],
      className,
    );

    if (href) {
      return (
        <Link href={href} target={target} rel={rel} className={classNames}>
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
              Loading
            </span>
          ) : (
            children
          )}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={classNames}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
            Loading
          </span>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
