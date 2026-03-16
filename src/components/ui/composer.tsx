"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { IconSvgElement } from "@hugeicons/react"

/* ── Types ── */

export interface ComposerTask {
  label: string
  done: boolean
  dimmed?: boolean
}

export interface ComposerFile {
  name: string
  size: string
  type: "file" | "image"
}

export interface ComposerScopeItem {
  id: string
  label: string
  icon: IconSvgElement
}

/* ── Context ── */

interface ComposerContextValue {
  value: string
  onValueChange: (value: string) => void
  isFocused: boolean
  setIsFocused: (focused: boolean) => void
  isSending: boolean
  send: () => void
  disabled: boolean
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
}

const ComposerContext = React.createContext<ComposerContextValue | null>(null)

export function useComposer(): ComposerContextValue {
  const ctx = React.useContext(ComposerContext)
  if (!ctx) {
    throw new Error("useComposer must be used within a <Composer />")
  }
  return ctx
}

/* ── Composer (root) ── */

export function Composer({
  value: valueProp,
  defaultValue = "",
  onValueChange: onValueChangeProp,
  onSend,
  disabled = false,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onSend?: (value: string) => void
  disabled?: boolean
}) {
  const [_value, _setValue] = React.useState(defaultValue)
  const value = valueProp ?? _value
  const onValueChange = React.useCallback(
    (v: string) => {
      if (onValueChangeProp) onValueChangeProp(v)
      else _setValue(v)
    },
    [onValueChangeProp],
  )

  const [isFocused, setIsFocused] = React.useState(false)
  const [isSending, setIsSending] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

  const send = React.useCallback(() => {
    if (disabled) return
    if (!value.trim()) return
    setIsSending(true)
    const currentValue = value
    setTimeout(() => {
      onValueChange("")
      setIsSending(false)
      if (textareaRef.current) textareaRef.current.style.height = "auto"
    }, 400)
    onSend?.(currentValue)
  }, [value, disabled, onValueChange, onSend])

  const ctx = React.useMemo<ComposerContextValue>(
    () => ({
      value,
      onValueChange,
      isFocused,
      setIsFocused,
      isSending,
      send,
      disabled,
      textareaRef,
    }),
    [value, onValueChange, isFocused, isSending, send, disabled],
  )

  return (
    <ComposerContext.Provider value={ctx}>
      <div
        data-slot="composer"
        className={cn(
          "mx-auto flex w-full max-w-[720px] flex-col items-center",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </ComposerContext.Provider>
  )
}

/* ── ComposerIslands ── */

export function ComposerIslands({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="composer-islands"
      className={cn("flex w-full flex-col items-center", className)}
      {...props}
    >
      {children}
    </div>
  )
}

/* ── ComposerCard ── */

export function ComposerCard({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { isFocused } = useComposer()

  return (
    <div
      data-slot="composer-card"
      className={cn(
        "relative z-1 w-full rounded-xl border bg-background transition-shadow duration-300 ease-out",
        isFocused
          ? "border-foreground/15 shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_12px_rgba(0,0,0,0.06),0_8px_32px_rgba(0,0,0,0.04)]"
          : "border-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/* ── Re-exports ── */

export { ComposerInput } from "./composer-input"
export {
  ComposerToolbar,
  ComposerMenu,
  ComposerContextRing,
  ComposerSend,
} from "./composer-toolbar"
export {
  ComposerScope,
  ComposerReply,
  ComposerPlan,
} from "./composer-islands"
export { ComposerAttachments } from "./composer-attachments"
export { ComposerSuggestions } from "./composer-suggestions"
