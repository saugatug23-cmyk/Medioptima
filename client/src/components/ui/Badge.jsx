import * as React from "react"
import { cn } from "../../lib/utils"

function Badge({ className, variant = "neutral", ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        {
          "border-transparent bg-gray-100 text-[var(--color-text-secondary)]": variant === "neutral",
          "border-transparent bg-[var(--color-soft-green)] text-[var(--color-emerald-accent)]": variant === "available" || variant === "success",
          "border-transparent bg-[var(--color-warning-bg)] text-[var(--color-warning)]": variant === "partial" || variant === "warning",
          "border-transparent bg-[var(--color-danger-bg)] text-[var(--color-danger)]": variant === "unavailable" || variant === "critical",
          "border-transparent bg-[var(--color-primary)] text-white": variant === "primary",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
