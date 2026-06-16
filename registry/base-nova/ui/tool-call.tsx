"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import {
  Collapsible,
  CollapsibleContent as CollapsiblePanel,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

/* ── Types ── */

type ToolCallStatus = "running" | "completed" | "failed"

/* ── Context ── */

interface ToolCallContextValue {
  expanded: boolean
  icon: IconSvgElement
  status: ToolCallStatus
  timestamp?: string
}

const ToolCallContext = React.createContext<ToolCallContextValue | null>(null)

function useToolCall(): ToolCallContextValue {
  const ctx = React.use(ToolCallContext)
  if (!ctx) throw new Error("useToolCall must be used within a <ToolCall />")
  return ctx
}

/* ── ToolCall ── */

function ToolCall({
  icon,
  status = "completed",
  timestamp,
  defaultExpanded = false,
  expanded,
  onExpandedChange,
  className,
  children,
  ...props
}: Omit<
  React.ComponentProps<typeof Collapsible>,
  "defaultOpen" | "open" | "onOpenChange" | "render"
> & {
  icon: IconSvgElement
  status?: ToolCallStatus
  timestamp?: string
  defaultExpanded?: boolean
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
}) {
  return (
    <Collapsible
      data-slot="tool-call"
      defaultOpen={defaultExpanded || status === "failed"}
      open={expanded}
      onOpenChange={onExpandedChange}
      className={(state) =>
        cn(
          "relative flex min-w-0 flex-col gap-3 text-muted-foreground",
          typeof className === "function" ? className(state) : className
        )
      }
      render={(rootProps, state) => (
        <ToolCallContext
          value={{
            expanded: state.open,
            icon,
            status,
            timestamp,
          }}
        >
          <div {...rootProps}>{children}</div>
        </ToolCallContext>
      )}
      {...props}
    />
  )
}

/* ── ToolCallTrigger ── */

function ToolCallTrigger({
  className,
  children,
  expandable = true,
  onClick,
  ...props
}: Omit<React.ComponentProps<typeof CollapsibleTrigger>, "render"> & {
  expandable?: boolean
}) {
  const { expanded, icon, status, timestamp } = useToolCall()
  const canExpand = expandable && status !== "running"

  return (
    <div
      data-slot="tool-call-trigger-wrap"
      aria-busy={status === "running" || undefined}
      className="group/tool-wrapper relative flex items-center gap-2"
    >
      <CollapsibleTrigger
        type="button"
        data-compact-touch
        onClick={(event) => {
          if (!canExpand) {
            event.preventDefault()
            event.preventBaseUIHandler()
          }
          onClick?.(event)
        }}
        className={(state) =>
          cn(
            "flex min-h-8 w-fit max-w-full min-w-0 items-center gap-2 py-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            canExpand ? "cursor-pointer" : "cursor-default",
            typeof className === "function" ? className(state) : className
          )
        }
        render={(triggerProps) => (
          <button
            {...triggerProps}
            aria-expanded={canExpand ? expanded : undefined}
            aria-label={
              triggerProps["aria-label"] ??
              (canExpand ? "Toggle tool call details" : "Tool call")
            }
          >
            <div className="relative flex size-5 shrink-0 items-center justify-center rounded-full">
              <div className="absolute inset-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background" />
              <HugeiconsIcon
                icon={icon}
                size={16}
                className={cn(
                  "relative",
                  status === "running" && "animate-tool-call-pulse",
                  status === "failed"
                    ? "text-destructive"
                    : "text-muted-foreground group-hover/tool-wrapper:text-foreground"
                )}
              />
            </div>
            {children}
            {canExpand && (
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={14}
                className={cn(
                  "shrink-0 transition-transform duration-200",
                  status === "failed"
                    ? "text-destructive"
                    : "group-hover/tool-wrapper:text-foreground",
                  expanded && "rotate-90"
                )}
              />
            )}
          </button>
        )}
        {...props}
      />
      {status === "running" && <span className="sr-only">Running</span>}
      {status === "failed" && <span className="sr-only">Failed</span>}
      {timestamp && (
        <span className="ml-auto shrink-0 truncate text-xs text-muted-foreground select-none">
          {timestamp}
        </span>
      )}
    </div>
  )
}

/* ── ToolCallLabel ── */

function ToolCallLabel({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  const { status } = useToolCall()

  return (
    <span
      data-slot="tool-call-label"
      className={cn(
        "min-w-0 truncate text-sm select-none",
        status === "failed"
          ? "text-destructive"
          : "group-hover/tool-wrapper:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

/* ── ToolCallContent ── */

function ToolCallContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePanel>) {
  return (
    <CollapsiblePanel
      data-slot="tool-call-content"
      className={cn("animate-composer-slide -mt-1 pb-1 pl-7", className)}
      {...props}
    >
      {children}
    </CollapsiblePanel>
  )
}

/* ── ToolCallError ── */

function ToolCallError({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePanel>) {
  return (
    <CollapsiblePanel
      data-slot="tool-call-error"
      className={cn("animate-composer-slide -mt-1 pb-1 pl-7", className)}
      {...props}
    >
      <p className="text-xs text-destructive/80">{children}</p>
    </CollapsiblePanel>
  )
}

function ToolCallRetry({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="tool-call-retry"
      data-compact-touch
      className={cn(
        "mt-2 rounded-md border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent",
        className
      )}
      {...props}
    />
  )
}

export {
  ToolCall,
  ToolCallTrigger,
  ToolCallLabel,
  ToolCallContent,
  ToolCallError,
  ToolCallRetry,
  useToolCall,
}
export type { ToolCallStatus }
