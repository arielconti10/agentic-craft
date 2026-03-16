"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUp02Icon, Add01Icon } from "@hugeicons/core-free-icons"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import { useComposer } from "./composer"

/* ── ComposerToolbar ── */

export function ComposerToolbar({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="composer-toolbar"
      className={cn("flex items-center gap-1 px-3 pt-0.5 pb-3", className)}
      {...props}
    >
      {children}
    </div>
  )
}

/* ── ComposerMenu ── */

export function ComposerMenu({
  className,
  children,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/50 transition-all duration-200 outline-none hover:bg-muted/60 hover:text-foreground",
          className,
        )}
      >
        <HugeiconsIcon icon={Add01Icon} size={16} strokeWidth={1.5} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        sideOffset={8}
        align="start"
        className="min-w-[200px]"
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* ── ComposerContextRing ── */

export function ComposerContextRing({
  used,
  total,
  label,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  used: number
  total: number
  label?: string
}) {
  const [hover, setHover] = React.useState(false)
  const pct = total > 0 ? used / total : 0
  const r = 6
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct)
  const displayLabel = label ?? `${used}k / ${total}k tokens`
  const pctLabel = `${Math.round(pct * 100)}%`

  return (
    <div
      data-slot="composer-context-ring"
      className={cn("relative mr-1 flex items-center gap-1.5", className)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...props}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" className="opacity-50">
        <circle
          cx="8"
          cy="8"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.15"
        />
        <circle
          cx="8"
          cy="8"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 8 8)"
          className="text-muted-foreground"
        />
      </svg>
      {hover && (
        <div className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-xs text-background shadow-sm">
          <span>{displayLabel} ({pctLabel})</span>
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-foreground" />
        </div>
      )}
    </div>
  )
}

/* ── ComposerSend ── */

export function ComposerSend({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { value, isSending, send } = useComposer()
  const [arrowAnim, setArrowAnim] = React.useState(false)
  const hasContent = value.trim().length > 0

  const handleClick = React.useCallback(() => {
    setArrowAnim(true)
    send()
    setTimeout(() => setArrowAnim(false), 500)
  }, [send])

  return (
    <button
      data-slot="composer-send"
      type="button"
      onClick={handleClick}
      disabled={!hasContent}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200",
        hasContent
          ? "bg-foreground text-background hover:opacity-90"
          : "cursor-not-allowed bg-muted/60 text-muted-foreground/40",
        isSending ? "animate-composer-send" : "",
        className,
      )}
      {...props}
    >
      <span className={arrowAnim ? "animate-composer-arrow" : ""}>
        <HugeiconsIcon icon={ArrowUp02Icon} size={15} strokeWidth={2} />
      </span>
    </button>
  )
}
