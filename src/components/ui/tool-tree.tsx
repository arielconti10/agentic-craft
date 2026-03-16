"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"

/* ── Context ── */

interface ToolTreeContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ToolTreeContext = React.createContext<ToolTreeContextValue | null>(null)

function useToolTree(): ToolTreeContextValue {
  const ctx = React.useContext(ToolTreeContext)
  if (!ctx) throw new Error("useToolTree must be used within a <ToolTree />")
  return ctx
}

/* ── ToolTree (root) ── */

function ToolTree({
  defaultOpen = true,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const onOpenChange = React.useCallback(
    (v: boolean) => {
      if (onOpenChangeProp) onOpenChangeProp(v)
      else _setOpen(v)
    },
    [onOpenChangeProp],
  )

  const ctx = React.useMemo(() => ({ open, onOpenChange }), [open, onOpenChange])

  return (
    <ToolTreeContext.Provider value={ctx}>
      <div data-slot="tool-tree" className={cn("flex flex-col gap-3 min-w-0 text-muted-foreground relative", className)} {...props}>
        {/* Spine: first child so trigger paints on top (DOM order) */}
        {open && (
          <span
            className="w-px absolute"
            style={{ left: 9, top: 10, bottom: 0, backgroundColor: "var(--tool-tree-connector)" }}
          />
        )}
        {children}
      </div>
    </ToolTreeContext.Provider>
  )
}

/* ── ToolTreeTrigger ── */

function ToolTreeTrigger({
  icon,
  timestamp,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  icon?: IconSvgElement
  timestamp?: string
}) {
  const { open, onOpenChange } = useToolTree()

  return (
    <div data-slot="tool-tree-trigger" className="flex items-center gap-2 relative group/tool-wrapper">
      <button type="button" onClick={() => onOpenChange(!open)} className={cn("min-w-0 flex items-center gap-2 w-fit max-w-full cursor-pointer", className)} {...props}>
        {icon && (
          <div className="relative rounded-full size-5 flex items-center justify-center shrink-0">
            <div className="absolute bg-background inset-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full size-6" />
            <HugeiconsIcon icon={icon} size={18} strokeWidth={1.5} className="relative text-muted-foreground group-hover/tool-wrapper:text-foreground" />
          </div>
        )}
        <span className="min-w-0 group-hover/tool-wrapper:text-foreground text-sm select-none truncate">{children}</span>
        <HugeiconsIcon icon={ArrowDown01Icon} size={14} strokeWidth={1.5} className={cn("shrink-0 group-hover/tool-wrapper:text-foreground transition-transform duration-200", !open && "-rotate-90")} />
      </button>
      {timestamp && (
        <span className="shrink-0 ml-auto transition-opacity duration-300 opacity-0 group-hover/tool-wrapper:opacity-100 hidden md:block text-xs select-none truncate">
          {timestamp}
        </span>
      )}
    </div>
  )
}

/* ── ToolTreeContent ──
   Wraps each child (ToolCall) with L-connector and spine mask for the last item. */

function ToolTreeContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { open } = useToolTree()
  if (!open) return null

  const items = React.Children.toArray(children)

  return (
    <div
      data-slot="tool-tree-content"
      className={cn("pl-[28px]", className)}
      {...props}
    >
      <div className="grid gap-1.5 grid-cols-1">
        {items.map((child, i) => {
          const isLast = i === items.length - 1
          return (
            <div key={i} className="relative min-w-0">
              {/* Last-child: mask FIRST so connector paints on top */}
              {isLast && (
                <div
                  className="absolute w-px bg-background"
                  style={{ top: 0, bottom: -24, left: -19 }}
                />
              )}
              {/* L-connector with rounded bottom-left corner */}
              <div
                className="absolute rounded-bl-lg border-l border-b"
                style={{ top: -5, left: -19, width: 30, height: 16, borderColor: "var(--tool-tree-connector)" }}
              />
              {child}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export {
  ToolTree,
  ToolTreeTrigger,
  ToolTreeContent,
  useToolTree,
}
