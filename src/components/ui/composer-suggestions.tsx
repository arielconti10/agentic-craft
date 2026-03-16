"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useComposer } from "./composer"

export function ComposerSuggestions({
  items,
  onSelect,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  items: string[]
  onSelect?: (suggestion: string) => void
}) {
  const { onValueChange, textareaRef } = useComposer()
  const [flashChip, setFlashChip] = React.useState<string | null>(null)

  const handleClick = React.useCallback(
    (suggestion: string) => {
      setFlashChip(suggestion)
      setTimeout(() => {
        onValueChange(suggestion)
        setFlashChip(null)
        textareaRef.current?.focus()
        onSelect?.(suggestion)
      }, 250)
    },
    [onValueChange, textareaRef, onSelect],
  )

  if (items.length === 0) return null

  return (
    <div
      data-slot="composer-suggestions"
      className={cn(
        "animate-composer-slide mt-3 flex flex-wrap justify-center gap-1.5",
        className,
      )}
      {...props}
    >
      {items.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => handleClick(s)}
          className={cn(
            "rounded-md border border-border/60 px-2.5 py-1 text-xs text-muted-foreground transition-all duration-200 hover:border-border hover:bg-muted/40 hover:text-foreground",
            flashChip === s ? "animate-composer-chip" : "",
          )}
        >
          {s}
        </button>
      ))}
    </div>
  )
}
