"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

function HumanGateRoot({ ...props }: React.ComponentProps<typeof Dialog>) {
  return <Dialog {...props} />
}

function HumanGateTrigger({
  ...props
}: React.ComponentProps<typeof DialogTrigger>) {
  return <DialogTrigger {...props} />
}

function HumanGateContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogContent>) {
  return (
    <DialogContent
      data-slot="human-gate-content"
      className={cn("sm:max-w-lg", className)}
      {...props}
    >
      {children}
    </DialogContent>
  )
}

function HumanGateHeader({
  className,
  ...props
}: React.ComponentProps<typeof DialogHeader>) {
  return (
    <DialogHeader
      data-slot="human-gate-header"
      className={cn("pr-8", className)}
      {...props}
    />
  )
}

function HumanGateTitle({
  ...props
}: React.ComponentProps<typeof DialogTitle>) {
  return <DialogTitle {...props} />
}

function HumanGateDescription({
  ...props
}: React.ComponentProps<typeof DialogDescription>) {
  return <DialogDescription {...props} />
}

function HumanGateBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="human-gate-body"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  )
}

function HumanGateImpactList({
  className,
  ...props
}: React.ComponentProps<"dl">) {
  return (
    <dl
      data-slot="human-gate-impact-list"
      className={cn(
        "grid grid-cols-[minmax(96px,0.45fr)_1fr] gap-x-4 gap-y-2 rounded-lg border border-border/70 p-3 text-sm",
        className
      )}
      {...props}
    />
  )
}

function HumanGateImpactItem({
  label,
  children,
}: {
  label: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-foreground">{children}</dd>
    </>
  )
}

function HumanGateFooter({
  className,
  ...props
}: React.ComponentProps<typeof DialogFooter>) {
  return <DialogFooter className={cn("mt-1", className)} {...props} />
}

function HumanGateCancel({
  children = "Cancel",
  ...props
}: React.ComponentProps<typeof DialogClose>) {
  return (
    <DialogClose render={<Button variant="outline" />} {...props}>
      {children}
    </DialogClose>
  )
}

function HumanGateConfirm({
  variant = "default",
  children = "Confirm",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button variant={variant} {...props}>
      {children}
    </Button>
  )
}

const HumanGate = {
  Root: HumanGateRoot,
  Trigger: HumanGateTrigger,
  Content: HumanGateContent,
  Header: HumanGateHeader,
  Title: HumanGateTitle,
  Description: HumanGateDescription,
  Body: HumanGateBody,
  ImpactList: HumanGateImpactList,
  ImpactItem: HumanGateImpactItem,
  Footer: HumanGateFooter,
  Cancel: HumanGateCancel,
  Confirm: HumanGateConfirm,
}

export {
  HumanGate,
  HumanGateRoot,
  HumanGateTrigger,
  HumanGateContent,
  HumanGateHeader,
  HumanGateTitle,
  HumanGateDescription,
  HumanGateBody,
  HumanGateImpactList,
  HumanGateImpactItem,
  HumanGateFooter,
  HumanGateCancel,
  HumanGateConfirm,
}
