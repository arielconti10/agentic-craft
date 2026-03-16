"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useComposer } from "./composer"

export function ComposerInput({
  placeholder = "Type a message...",
  maxHeight = 160,
  className,
  ...props
}: Omit<React.ComponentProps<"textarea">, "value" | "onChange"> & {
  maxHeight?: number
}) {
  const { value, onValueChange, setIsFocused, send, textareaRef } =
    useComposer()

  React.useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = "auto"
    ta.style.height = Math.min(ta.scrollHeight, maxHeight) + "px"
  }, [value, maxHeight, textareaRef])

  return (
    <div
      data-slot="composer-input"
      className={cn("px-4 pt-3 pb-1", className)}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            send()
          }
        }}
        placeholder={placeholder}
        rows={1}
        className="max-h-[160px] min-h-[32px] w-full resize-none bg-transparent text-sm leading-relaxed placeholder:text-muted-foreground/50 focus:outline-none"
        style={{ maxHeight }}
        {...props}
      />
    </div>
  )
}
