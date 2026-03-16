"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  MailReply01Icon,
  Task01Icon,
  ArrowExpand01Icon,
  ArrowShrink01Icon,
} from "@hugeicons/core-free-icons"
import type { ComposerScopeItem } from "./composer"
import type { ComposerTask } from "./composer"

/* ── Island wrapper (used by each island primitive) ── */

function Island({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("animate-composer-island w-[95%]", className)}
      style={{ zIndex: 0 }}
      {...props}
    >
      <div
        data-slot="composer-island"
        className="border border-b-0 border-border bg-background first:rounded-t-xl first:shadow-[0_-1px_6px_rgba(0,0,0,0.04),0_-4px_16px_rgba(0,0,0,0.03)]"
      >
        {children}
      </div>
    </div>
  )
}

/* ── ComposerScope ── */

export function ComposerScope({
  items,
  onRemove,
  onDismiss,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  items: ComposerScopeItem[]
  onRemove?: (id: string) => void
  onDismiss?: () => void
}) {
  return (
    <Island className={className} {...props}>
      <div className="flex items-center gap-2 px-3 py-2.5">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {items.map((item) => (
            <span
              key={item.id}
              className="animate-composer-slide group/scope inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-0.5 text-xs text-foreground"
            >
              <HugeiconsIcon
                icon={item.icon}
                size={12}
                strokeWidth={1.5}
                className="shrink-0 text-muted-foreground"
              />
              <span className="max-w-[160px] truncate">{item.label}</span>
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="text-muted-foreground/40 opacity-0 transition-colors group-hover/scope:opacity-100 hover:text-foreground"
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={10}
                    strokeWidth={2}
                  />
                </button>
              )}
            </span>
          ))}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 text-muted-foreground/40 transition-colors hover:text-foreground"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </Island>
  )
}

/* ── ComposerReply ── */

export function ComposerReply({
  onDismiss,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  onDismiss?: () => void
}) {
  return (
    <Island className={className} {...props}>
      <div className="flex items-center gap-2 px-4 py-2.5">
        <HugeiconsIcon
          icon={MailReply01Icon}
          size={13}
          strokeWidth={1.5}
          className="shrink-0 text-muted-foreground/60"
        />
        <span className="flex-1 truncate text-xs text-muted-foreground">
          {children}
        </span>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 text-muted-foreground/60 transition-colors hover:text-foreground"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </Island>
  )
}

/* ── ComposerPlan ── */

export function ComposerPlan({
  tasks,
  defaultExpanded = false,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  tasks: ComposerTask[]
  defaultExpanded?: boolean
}) {
  const [expanded, setExpanded] = React.useState(defaultExpanded)
  const completedCount = tasks.filter((t) => t.done).length

  return (
    <Island className={className} {...props}>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <HugeiconsIcon icon={Task01Icon} size={13} strokeWidth={1.5} />
            <span>
              {completedCount} out of {tasks.length} tasks completed
            </span>
          </div>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-muted-foreground/60 transition-colors hover:text-foreground"
          >
            <HugeiconsIcon
              icon={expanded ? ArrowShrink01Icon : ArrowExpand01Icon}
              size={14}
              strokeWidth={1.5}
            />
          </button>
        </div>

        {expanded && (
          <div className="animate-composer-slide mt-3 space-y-2.5">
            {tasks.map((task, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-2.5 text-sm leading-snug",
                  task.dimmed
                    ? "text-muted-foreground/40"
                    : "text-foreground",
                )}
              >
                <span
                  className={cn(
                    "mt-[3px] flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full border",
                    task.dimmed
                      ? "border-muted-foreground/20"
                      : "border-muted-foreground/40",
                  )}
                />
                <span>
                  {i + 1}. {task.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Island>
  )
}
