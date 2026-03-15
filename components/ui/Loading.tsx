import { cn } from "@/lib/utils";

export function Loading({
  label = "Loading",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 text-sm text-textMuted",
        className,
      )}
    >
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-accent" />
      <span>{label}</span>
    </div>
  );
}

