"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import { ArrowDown01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"

/* ── Context ── */

interface ToolTreeContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ToolTreeContext = React.createContext<ToolTreeContextValue | null>(null)

function useToolTree(): ToolTreeContextValue {
  const ctx = React.useContext(ToolTreeContext)
  if (!ctx) {
    throw new Error("useToolTree must be used within a <ToolTree />")
  }
  return ctx
}

/* ── Item context (per-branch expand state) ── */

interface ToolTreeItemContextValue {
  expanded: boolean
  onExpandedChange: (expanded: boolean) => void
}

const ToolTreeItemContext =
  React.createContext<ToolTreeItemContextValue | null>(null)

function useToolTreeItem(): ToolTreeItemContextValue {
  const ctx = React.useContext(ToolTreeItemContext)
  if (!ctx) {
    throw new Error("useToolTreeItem must be used within a <ToolTreeItem />")
  }
  return ctx
}

/* ── Internal shared primitives ── */

function BranchCurve() {
  return (
    <svg
      width="19"
      height="12"
      viewBox="0 0 19 12"
      fill="none"
      className="absolute"
      style={{ left: -19, top: 0 }}
    >
      <path
        d="M 0,0 C 0,8 6,12 19,12"
        stroke="var(--color-border)"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  )
}

function TreeIcon({ icon, size = 16 }: { icon: IconSvgElement; size?: number }) {
  return (
    <div className="relative rounded-full size-5 flex items-center justify-center shrink-0">
      <div className="absolute bg-background inset-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full size-6" />
      <HugeiconsIcon icon={icon} size={size} strokeWidth={1.5} className="relative text-muted-foreground group-hover/tool-wrapper:text-foreground" />
    </div>
  )
}

function TreeTimestamp({ children }: { children: React.ReactNode }) {
  return (
    <span className="shrink-0 ml-auto transition-opacity duration-300 opacity-0 group-hover/tool-wrapper:opacity-100 hidden md:block text-xs select-none truncate">
      {children}
    </span>
  )
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

  const ctx = React.useMemo(
    () => ({ open, onOpenChange }),
    [open, onOpenChange],
  )

  return (
    <ToolTreeContext.Provider value={ctx}>
      <div
        data-slot="tool-tree"
        className={cn(
          "flex flex-col gap-3 min-w-0 text-muted-foreground relative",
          className,
        )}
        {...props}
      >
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
        {icon && <TreeIcon icon={icon} size={18} />}
        <span className="min-w-0 group-hover/tool-wrapper:text-foreground text-sm select-none truncate">{children}</span>
        <HugeiconsIcon icon={ArrowDown01Icon} size={14} strokeWidth={1.5} className={cn("shrink-0 group-hover/tool-wrapper:text-foreground transition-transform duration-200", !open && "-rotate-90")} />
      </button>
      {timestamp && <TreeTimestamp>{timestamp}</TreeTimestamp>}
    </div>
  )
}

/* ── ToolTreeContent ── */

function ToolTreeContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { open } = useToolTree()
  if (!open) return null

  return (
    <>
      {/* Vertical spine */}
      <span
        className="w-px absolute bg-border"
        style={{ left: 9, top: 10, bottom: 0 }}
      />
      <div
        data-slot="tool-tree-content"
        className={cn("pl-7 grid grid-cols-1", className)}
        {...props}
      >
        {children}
      </div>
    </>
  )
}

/* ── ToolTreeItem ── */

function ToolTreeItem({
  defaultExpanded = false,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultExpanded?: boolean
}) {
  const [expanded, setExpanded] = React.useState(defaultExpanded)

  const ctx = React.useMemo(
    () => ({ expanded, onExpandedChange: setExpanded }),
    [expanded],
  )

  return (
    <ToolTreeItemContext.Provider value={ctx}>
      <div
        data-slot="tool-tree-item"
        className={cn("relative min-w-0 pt-1.5", className)}
        {...props}
      >
        {/* Curvy SVG branch connector */}
        <BranchCurve />

        {/* Last-child spine mask (shown via CSS only on :last-child) */}
        <div
          data-spine-mask
          className="absolute w-px bg-background"
          style={{ top: 12, bottom: -24, left: -19 }}
        />

        <div className="flex flex-col gap-3 min-w-0 text-muted-foreground relative">
          {children}
        </div>
      </div>
    </ToolTreeItemContext.Provider>
  )
}

/* ── ToolTreeItemTrigger ── */

function ToolTreeItemTrigger({
  icon,
  timestamp,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  icon?: IconSvgElement
  timestamp?: string
}) {
  const { expanded, onExpandedChange } = useToolTreeItem()

  return (
    <div className="flex items-center gap-2 relative group/tool-wrapper">
      <button type="button" onClick={() => onExpandedChange(!expanded)} className={cn("min-w-0 flex items-center gap-2 w-fit max-w-full cursor-pointer", className)} {...props}>
        {icon && <TreeIcon icon={icon} />}
        <span className="min-w-0 group-hover/tool-wrapper:text-foreground text-sm select-none truncate">{children}</span>
        <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={1.5} className={cn("shrink-0 group-hover/tool-wrapper:text-foreground transition-transform duration-200", expanded && "rotate-90")} />
      </button>
      {timestamp && <TreeTimestamp>{timestamp}</TreeTimestamp>}
    </div>
  )
}

/* ── ToolTreeItemContent ── */

function ToolTreeItemContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { expanded } = useToolTreeItem()
  if (!expanded) return null

  return (
    <div
      data-slot="tool-tree-item-content"
      className={cn("animate-composer-slide pl-7 -mt-1 pb-1", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export {
  ToolTree,
  ToolTreeTrigger,
  ToolTreeContent,
  ToolTreeItem,
  ToolTreeItemTrigger,
  ToolTreeItemContent,
  useToolTree,
  useToolTreeItem,
}
