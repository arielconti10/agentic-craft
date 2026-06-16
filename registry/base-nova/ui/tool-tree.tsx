"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

/* ── Context ── */

interface ToolTreeContextValue {
  open: boolean
}

const ToolTreeContext = React.createContext<ToolTreeContextValue | null>(null)

function useToolTree(): ToolTreeContextValue {
  const ctx = React.use(ToolTreeContext)
  if (!ctx) throw new Error("useToolTree must be used within a <ToolTree />")
  return ctx
}

/* ── ToolTree (root) ── */

function ToolTree({
  defaultOpen = true,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Collapsible>, "render"> & {
  defaultOpen?: boolean
}) {
  return (
    <Collapsible
      data-slot="tool-tree"
      defaultOpen={defaultOpen}
      className={(state) =>
        cn(
          "relative flex min-w-0 flex-col gap-3 text-muted-foreground",
          typeof className === "function" ? className(state) : className
        )
      }
      render={(rootProps, state) => (
        <div {...rootProps}>
          <ToolTreeContext.Provider value={{ open: state.open }}>
            {state.open && (
              <span
                aria-hidden="true"
                className="absolute w-px bg-border"
                style={{ left: 9, top: 10, bottom: 0 }}
              />
            )}
            {children}
          </ToolTreeContext.Provider>
        </div>
      )}
      {...props}
    />
  )
}

/* ── ToolTreeTrigger ── */

function ToolTreeTrigger({
  icon,
  timestamp,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof CollapsibleTrigger>, "render"> & {
  icon?: IconSvgElement
  timestamp?: string
}) {
  return (
    <div
      data-slot="tool-tree-trigger"
      className="group/tool-wrapper relative flex items-center gap-2"
    >
      <CollapsibleTrigger
        type="button"
        data-compact-touch
        className={(state) =>
          cn(
            "flex min-h-8 w-fit max-w-full min-w-0 cursor-pointer items-center gap-2 py-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            typeof className === "function" ? className(state) : className
          )
        }
        render={(triggerProps, state) => (
          <button
            {...triggerProps}
            aria-label={
              triggerProps["aria-label"] ??
              (state.open ? "Collapse tool group" : "Expand tool group")
            }
          >
            {icon && (
              <div className="relative flex size-5 shrink-0 items-center justify-center rounded-full">
                <div className="absolute inset-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background" />
                <HugeiconsIcon
                  icon={icon}
                  size={18}
                  className="relative text-muted-foreground group-hover/tool-wrapper:text-foreground"
                />
              </div>
            )}
            <span className="min-w-0 truncate text-sm select-none group-hover/tool-wrapper:text-foreground">
              {children}
            </span>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={14}
              className={cn(
                "shrink-0 transition-transform duration-200 group-hover/tool-wrapper:text-foreground",
                !state.open && "-rotate-90"
              )}
            />
          </button>
        )}
        {...props}
      />
      {timestamp && (
        <span className="ml-auto shrink-0 truncate text-xs opacity-100 select-none sm:opacity-0 sm:transition-opacity sm:duration-150 sm:group-focus-within/tool-wrapper:opacity-100 sm:group-hover/tool-wrapper:opacity-100">
          {timestamp}
        </span>
      )}
    </div>
  )
}

/* ── ToolTreeContent ──
   Wraps each child (ToolCall) with a flattened connector tick. */

function ToolTreeContent({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof CollapsibleContent>, "render">) {
  const items = React.Children.toArray(children)

  return (
    <CollapsibleContent
      data-slot="tool-tree-content"
      className={cn("pl-[28px]", className)}
      render={(contentProps) => (
        <div {...contentProps}>
          <div className="grid grid-cols-1 gap-1.5">
            {items.map((child, i) => {
              const isLast = i === items.length - 1
              return (
                <div
                  key={i}
                  data-slot="tool-tree-item"
                  className="relative min-w-0"
                >
                  {isLast && (
                    <span
                      aria-hidden="true"
                      className="absolute w-px bg-background"
                      style={{ top: 11, bottom: -24, left: -19 }}
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className="absolute h-px bg-border"
                    style={{ top: 11, left: -18, width: 29 }}
                  />
                  {child}
                </div>
              )
            })}
          </div>
        </div>
      )}
      {...props}
    />
  )
}

export { ToolTree, ToolTreeTrigger, ToolTreeContent, useToolTree }
