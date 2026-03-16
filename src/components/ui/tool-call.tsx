"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"

/* ── Types ── */

type ToolCallStatus = "running" | "completed" | "failed"

/* ── Context ── */

interface ToolCallContextValue {
  expanded: boolean
  onExpandedChange: (expanded: boolean) => void
  status: ToolCallStatus
}

const ToolCallContext = React.createContext<ToolCallContextValue | null>(null)

function useToolCall(): ToolCallContextValue {
  const ctx = React.useContext(ToolCallContext)
  if (!ctx) throw new Error("useToolCall must be used within a <ToolCall />")
  return ctx
}

/* ── ToolCall ── */

function ToolCall({
  icon,
  status = "completed",
  timestamp,
  error,
  onRetry,
  defaultExpanded = false,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  icon: IconSvgElement
  status?: ToolCallStatus
  timestamp?: string
  error?: string
  onRetry?: () => void
  defaultExpanded?: boolean
}) {
  const [expanded, setExpanded] = React.useState(
    defaultExpanded || status === "failed",
  )
  const [hover, setHover] = React.useState(false)

  const hasContent = React.Children.toArray(children).some(
    (child) =>
      React.isValidElement(child) &&
      (child.props as Record<string, unknown>)?.["data-slot"] === "tool-call-content",
  )

  const canExpand = status !== "running" && (hasContent || !!error)

  const ctx = React.useMemo(
    () => ({ expanded, onExpandedChange: setExpanded, status }),
    [expanded, status],
  )

  return (
    <ToolCallContext.Provider value={ctx}>
      <div
        data-slot="tool-call"
        className={cn("flex flex-col gap-3 min-w-0 text-muted-foreground relative", className)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        {...props}
      >
        <div className="flex items-center gap-2 relative group/tool-wrapper">
          <button
            type="button"
            onClick={canExpand ? () => setExpanded(!expanded) : undefined}
            className={cn(
              "min-w-0 flex items-center gap-2 w-fit max-w-full",
              canExpand ? "cursor-pointer" : "cursor-default",
            )}
          >
            <div className="relative rounded-full size-5 flex items-center justify-center shrink-0">
              <div className="absolute bg-background inset-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full size-6" />
              <HugeiconsIcon
                icon={icon}
                size={16}
                strokeWidth={1.5}
                className={cn(
                  "relative",
                  status === "running" && "animate-tool-call-pulse",
                  status === "failed"
                    ? "text-destructive"
                    : "text-muted-foreground group-hover/tool-wrapper:text-foreground",
                )}
              />
            </div>
            {children}
            {canExpand && (
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={14}
                strokeWidth={1.5}
                className={cn(
                  "shrink-0 transition-transform duration-200",
                  status === "failed"
                    ? "text-destructive"
                    : "group-hover/tool-wrapper:text-foreground",
                  expanded && "rotate-90",
                )}
              />
            )}
          </button>
          {timestamp && hover && (
            <span className="shrink-0 ml-auto text-xs select-none truncate text-muted-foreground">
              {timestamp}
            </span>
          )}
        </div>

        {/* Expanded content */}
        {expanded && hasContent && (
          <div className="animate-composer-slide">
            {React.Children.map(children, (child) =>
              React.isValidElement(child) &&
              (child.props as Record<string, unknown>)?.["data-slot"] === "tool-call-content"
                ? child
                : null,
            )}
          </div>
        )}

        {/* Error state */}
        {expanded && error && (
          <div className="animate-composer-slide pl-7 -mt-1 pb-1">
            <p className="text-xs text-destructive/80">{error}</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-2 rounded-md border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent"
              >
                Retry
              </button>
            )}
          </div>
        )}
      </div>
    </ToolCallContext.Provider>
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
        "min-w-0 text-sm select-none truncate",
        status === "failed"
          ? "text-destructive"
          : "group-hover/tool-wrapper:text-foreground",
        className,
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
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tool-call-content"
      className={cn("pl-7 -mt-1 pb-1", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { ToolCall, ToolCallLabel, ToolCallContent, useToolCall }
export type { ToolCallStatus }
