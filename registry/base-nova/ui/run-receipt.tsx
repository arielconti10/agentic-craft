"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type RunReceiptRootProps = React.ComponentProps<"section"> & {
  "aria-label": string
}

function RunReceiptRoot({ className, ...props }: RunReceiptRootProps) {
  return (
    <section
      data-slot="run-receipt"
      className={cn("rounded-lg border border-border bg-background", className)}
      {...props}
    />
  )
}

type RunReceiptHeaderProps = React.ComponentProps<"div"> & {
  title: React.ReactNode
  tag?: React.ReactNode
  summary?: React.ReactNode
  heading?: "h2" | "h3"
  summaryClassName?: string
}

function RunReceiptHeader({
  title,
  tag,
  summary,
  heading: Heading = "h3",
  summaryClassName,
  className,
  ...props
}: RunReceiptHeaderProps) {
  return (
    <div
      data-slot="run-receipt-header"
      className={cn("px-3 py-3 sm:px-4", className)}
      {...props}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <Heading className="text-sm font-medium text-foreground">
          {title}
        </Heading>
        {tag ? (
          <span className="text-xs text-muted-foreground">{tag}</span>
        ) : null}
      </div>
      {summary ? (
        <p
          className={cn(
            "mt-1 text-xs leading-5 text-muted-foreground",
            summaryClassName
          )}
        >
          {summary}
        </p>
      ) : null}
    </div>
  )
}

type RunReceiptSectionProps = React.ComponentProps<"div"> & {
  label: React.ReactNode
}

function RunReceiptSection({
  label,
  children,
  className,
  ...props
}: RunReceiptSectionProps) {
  return (
    <div
      data-slot="run-receipt-section"
      className={cn("border-t border-border/60 px-3 py-3 sm:px-4", className)}
      {...props}
    >
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  )
}

type RunReceiptRowProps<T extends React.ElementType = "div"> = {
  as?: T
  trailing?: React.ReactNode
} & React.ComponentPropsWithoutRef<T>

function RunReceiptRow<T extends React.ElementType = "div">({
  children,
  trailing,
  as,
  className,
  ...props
}: RunReceiptRowProps<T>) {
  const Component = as ?? "div"
  return (
    <Component
      data-slot="run-receipt-row"
      className={cn(
        "flex flex-wrap items-start justify-between gap-x-3 gap-y-1",
        className
      )}
      {...props}
    >
      <div className="min-w-0">{children}</div>
      {trailing}
    </Component>
  )
}

type RunReceiptChipVariant = "muted" | "deviation" | "positive"

type RunReceiptChipProps = React.ComponentProps<"span"> & {
  variant?: RunReceiptChipVariant
}

function RunReceiptChip({
  variant = "muted",
  className,
  children,
  ...props
}: RunReceiptChipProps) {
  return (
    <span
      data-slot="run-receipt-chip"
      className={cn(
        "shrink-0 rounded-md border px-2 py-0.5 text-[11px] leading-4 font-medium",
        variant === "muted" &&
          "border-border/60 bg-muted/30 text-muted-foreground",
        variant === "deviation" &&
          "border-foreground/25 bg-background text-foreground",
        variant === "positive" &&
          "border-border/60 bg-muted/20 text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

function RunReceiptFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="run-receipt-footer"
      className={cn(
        "flex flex-wrap gap-2 border-t border-border/60 px-3 py-3 sm:px-4",
        className
      )}
      {...props}
    />
  )
}

const RunReceipt = {
  Root: RunReceiptRoot,
  Header: RunReceiptHeader,
  Section: RunReceiptSection,
  Row: RunReceiptRow,
  Chip: RunReceiptChip,
  Footer: RunReceiptFooter,
}

export {
  RunReceipt,
  RunReceiptRoot,
  RunReceiptHeader,
  RunReceiptSection,
  RunReceiptRow,
  RunReceiptChip,
  RunReceiptFooter,
  type RunReceiptChipVariant,
}
