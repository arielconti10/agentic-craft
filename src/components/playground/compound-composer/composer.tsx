"use client"

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type ComponentProps,
  type DragEvent,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { cn } from "@/lib/utils"

import { DEFAULT_COMPOSER_ICONS, type ComposerIcons } from "./icons"

// ---------------------------------------------------------------------------
// Composer primitive — playground port
//
// Ported from references/eve-chat/compound-composer/composer.tsx (read-only
// snapshot of eve-chat's primitives/composer/). This copy is a lab surface
// for /playground/compound-composer, not the registry composer
// (src/components/ui/composer.tsx) and not a registry item.
//
// Intentional divergences from the snapshot:
//   1. Icons are injectable. The source hardcodes five lucide-react icons;
//      this port exposes an `icons` prop on Composer.Root (see ./icons.tsx)
//      so the primitive follows the consumer's shadcn iconLibrary. Defaults
//      here are Hugeicons per this repo's components.json.
//   2. The preparing spinner carries a `motion-reduce:animate-none` path.
//   3. Import paths point at this repo's shadcn ui directory.
// Everything else — API, lifecycle, attachment ownership, styling — matches
// the snapshot. Re-syncing against eve-chat should diff against these notes.
//
// Framework-agnostic chat input exposed as a compound component. Owns:
//   - text capture + auto-resize (Composer.Input)
//   - attachments: file picker, drag-and-drop, paste-image
//     (Composer.Attach, Composer.Attachments, Composer.AttachmentsItem)
//   - submit / stop / preparing lifecycle (Composer.Submit)
//   - optional banners (Composer.InfoBar, Composer.Before)
//   - a controls slot (Composer.Footer > Composer.Controls)
//
// It does NOT own what lives in those slots, and it does not know how a
// message is delivered. The integrator fills in `controls` (opaque, typed by
// them via the generic) and `onSubmit` receives `{ message, controls,
// attachments }`.
//
// Attachments are raw `File`s. The primitive never uploads anything; it hands
// the files to `onSubmit` and the integrator's backend decides what to do.
// Image preview URLs (`URL.createObjectURL`) are owned and revoked by the
// primitive so consumers never leak them.
//
// Lifecycle is expressed through `phase` only. There is no `disabled`/
// `disabledReason` mode: if setup isn't done, render a setup screen instead
// of a blocked composer; if the agent needs the user, render a Human Gate.
// ---------------------------------------------------------------------------

/**
 * A single attachment held by the composer. `file` is the raw browser `File`;
 * the primitive never uploads it. `previewUrl` is present for image types and
 * is revoked by the primitive on remove / submit / unmount.
 */
export type ComposerAttachment = {
  readonly id: string
  readonly file: File
  readonly name: string
  readonly type: string
  readonly size: number
  readonly previewUrl?: string
}

/**
 * Payload handed to `onSubmit`. `controls` is opaque to the primitive and
 * typed by the integrator via the `TControls` generic. `attachments` is empty
 * when attachment support is off (`maxAttachments` = 0).
 */
export type ComposerSubmit<TControls> = {
  readonly message: string
  readonly controls: TControls
  readonly attachments: readonly ComposerAttachment[]
}

/**
 * The lifecycle phase of the submit affordance. Exposed as an explicit
 * variant (not a boolean prop chain) per composition-patterns.
 *
 * - idle:      input is editable, submit is armed
 * - preparing: a turn is about to start; input locked, submit shows a spinner
 * - busy:      a turn is in flight; input locked, submit becomes a Stop button
 */
export type ComposerSubmitPhase = "idle" | "preparing" | "busy"

type ComposerContextValue<TControls> = {
  readonly composerId: string
  readonly value: string
  readonly onChange: (value: string) => void
  readonly onSubmit: () => void
  readonly phase: ComposerSubmitPhase
  readonly maxLength: number
  readonly placeholder: string
  readonly autoFocus: boolean
  readonly controls: TControls
  readonly icons: ComposerIcons
  readonly focusInput: () => void
  readonly setInputRef: (node: HTMLTextAreaElement | null) => void
  // Attachments
  readonly attachmentsEnabled: boolean
  readonly attachments: readonly ComposerAttachment[]
  readonly maxAttachments: number
  readonly accept: string | undefined
  readonly addFiles: (files: ReadonlyArray<File>) => void
  readonly removeAttachment: (id: string) => void
  readonly attachmentInputId: string
  readonly openFilePicker: () => void
}

const ComposerContext = createContext<ComposerContextValue<unknown> | null>(
  null
)

function useComposer<TControls = unknown>(): ComposerContextValue<TControls> {
  const value = use(ComposerContext)
  if (!value) {
    throw new Error("Composer parts must be used inside <Composer.Root>.")
  }
  return value as ComposerContextValue<TControls>
}

/**
 * Hook for adapter-level components that live inside `<Composer.Root>` but are
 * not `Composer.*` parts (e.g. a custom dropdown that wants to open the file
 * picker). Returns a no-op when attachments are disabled. Must be called from
 * a component rendered inside `<Composer.Root>`.
 */
export function useOpenFilePicker(): () => void {
  const ctx = use(ComposerContext)
  if (!ctx) {
    return () => {}
  }
  return ctx.attachmentsEnabled ? ctx.openFilePicker : () => {}
}

const IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/avif",
  "image/svg+xml",
])

function isImageType(type: string): boolean {
  return IMAGE_TYPES.has(type)
}

function formatAttachmentMeta(attachment: ComposerAttachment): string {
  const type = attachment.type.split("/").pop()?.toUpperCase() || "File"
  const size = formatBytes(attachment.size)
  return `${type} · ${size}`
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  const units = ["KB", "MB", "GB"] as const
  let value = bytes / 1024
  let unit: (typeof units)[number] = units[0]
  for (const next of units) {
    unit = next
    if (value < 1024 || next === units[units.length - 1]) {
      break
    }
    value /= 1024
  }
  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${unit}`
}

function newAttachmentId(): string {
  // crypto.randomUUID is available in all evergreen browsers and Node 19+.
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `att-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

// ---------------------------------------------------------------------------
// Root — owns state and the submit lifecycle
// ---------------------------------------------------------------------------

export type ComposerRootProps<TControls = unknown> = {
  /**
   * Controlled mode: current draft. When set together with `onChange`, the
   * parent owns the draft. Mutating this from the parent updates the editor.
   */
  readonly value?: string
  /**
   * Controlled mode: emits on every keystroke. Required when `value` is set.
   */
  readonly onChange?: (value: string) => void
  /**
   * Uncontrolled mode: seed for the draft on first render. The composer owns
   * its own state after that. Self-clears after a successful submit.
   */
  readonly defaultValue?: string
  /** Called with the trimmed message, controls payload, and attachments. */
  readonly onSubmit: (submit: ComposerSubmit<TControls>) => void | Promise<void>
  /** Abort the in-flight turn. Shown when phase="busy". */
  readonly onStop: () => void

  /** Lifecycle phase of the submit affordance. */
  readonly phase?: ComposerSubmitPhase

  /** Opaque, integrator-typed payload carried into `onSubmit.controls`. */
  readonly controls?: TControls

  /**
   * Icon overrides. Defaults follow this repo's shadcn iconLibrary
   * (Hugeicons); pass your own set to match a different icon family.
   */
  readonly icons?: Partial<ComposerIcons>

  readonly placeholder?: string
  readonly maxLength?: number
  readonly autoFocus?: boolean

  /**
   * Max number of attachments the composer will hold. 0 (default) disables
   * attachments entirely: the picker, drag-and-drop, and paste-image all
   * become no-ops, and `onSubmit.attachments` is always empty.
   */
  readonly maxAttachments?: number
  /** MIME types the file input accepts, e.g. "image/*". Default: any. */
  readonly accept?: string
  /** Observe attachment list changes (e.g. to mirror into parent state). */
  readonly onAttachmentsChange?: (
    attachments: readonly ComposerAttachment[]
  ) => void

  readonly children: ReactNode
}

function ComposerRoot<TControls = unknown>({
  accept,
  autoFocus = true,
  children,
  controls,
  defaultValue,
  icons,
  maxAttachments = 0,
  maxLength = 32_000,
  onChange,
  onAttachmentsChange,
  onSubmit,
  phase = "idle",
  placeholder = "Ask anything...",
  value,
}: Readonly<ComposerRootProps<TControls>>) {
  const composerId = useId()
  const attachmentInputId = `${composerId}-attach`
  const controlsRef = useRef(controls)
  controlsRef.current = controls
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const attachmentInputRef = useRef<HTMLInputElement>(null)

  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue ?? "")
  const draft = isControlled ? (value as string) : internalValue

  const attachmentsEnabled = maxAttachments > 0
  const [attachments, setAttachments] = useState<readonly ComposerAttachment[]>(
    []
  )

  if (process.env.NODE_ENV !== "production") {
    if (isControlled && !onChange) {
      console.warn(
        "Composer.Root received `value` without `onChange`. Provide `onChange` for controlled mode, or use `defaultValue` for uncontrolled mode."
      )
    }
    if (!isControlled && defaultValue !== undefined && value !== undefined) {
      console.warn(
        "Composer.Root received both `value` and `defaultValue`. `value` takes precedence (controlled mode); `defaultValue` is ignored."
      )
    }
    if (!attachmentsEnabled && onAttachmentsChange) {
      console.warn(
        "Composer.Root received `onAttachmentsChange` but attachments are disabled (`maxAttachments` <= 0). The callback will never fire."
      )
    }
  }

  const handleChange = useCallback(
    (next: string) => {
      if (!isControlled) {
        setInternalValue(next)
      }
      onChange?.(next)
    },
    [isControlled, onChange]
  )

  const focusInput = useCallback(() => {
    inputRef.current?.focus({ preventScroll: true })
  }, [])

  const setInputRef = useCallback((node: HTMLTextAreaElement | null) => {
    inputRef.current = node
  }, [])

  // -- Attachments ---------------------------------------------------------

  const addFiles = useCallback(
    (incoming: ReadonlyArray<File>) => {
      if (!attachmentsEnabled || incoming.length === 0) {
        return
      }
      setAttachments((current) => {
        const remaining = Math.max(0, maxAttachments - current.length)
        if (remaining === 0) {
          return current
        }
        const next: ComposerAttachment[] = []
        for (const file of incoming) {
          if (next.length >= remaining) {
            break
          }
          const isImage = isImageType(file.type)
          next.push({
            id: newAttachmentId(),
            file,
            name: file.name,
            type: file.type,
            size: file.size,
            previewUrl: isImage ? URL.createObjectURL(file) : undefined,
          })
        }
        if (next.length === 0) {
          return current
        }
        return [...current, ...next]
      })
    },
    [attachmentsEnabled, maxAttachments]
  )

  const removeAttachment = useCallback((id: string) => {
    setAttachments((current) => {
      const target = current.find((a) => a.id === id)
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl)
      }
      return current.filter((a) => a.id !== id)
    })
  }, [])

  const handleAttachmentInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? [])
      addFiles(files)
      // Reset so picking the same file again still fires onChange.
      event.target.value = ""
    },
    [addFiles]
  )

  const openFilePicker = useCallback(() => {
    attachmentInputRef.current?.click()
  }, [])

  // Notify on attachment changes (mirrors onChange for the draft).
  useEffect(() => {
    onAttachmentsChange?.(attachments)
  }, [attachments, onAttachmentsChange])

  // Revoke any outstanding object URLs on unmount.
  useEffect(() => {
    return () => {
      for (const a of attachments) {
        if (a.previewUrl) {
          URL.revokeObjectURL(a.previewUrl)
        }
      }
    }
    // We only want this to run on unmount, not on every attachment change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const submit = useCallback(() => {
    const message = draft.trim()
    const hasAttachments = attachments.length > 0
    if (phase !== "idle" || message.length > maxLength) {
      return
    }
    // Allow attachments-only sends (empty text + files), but not empty+empty.
    if (!message && !hasAttachments) {
      return
    }
    void onSubmit({
      attachments,
      controls: controlsRef.current as TControls,
      message,
    })
    if (!isControlled) {
      setInternalValue("")
    }
    if (hasAttachments) {
      // Revoking happens here because the submitted attachments are handed
      // off to the integrator; the primitive is done with their previews.
      for (const a of attachments) {
        if (a.previewUrl) {
          URL.revokeObjectURL(a.previewUrl)
        }
      }
      setAttachments([])
    }
  }, [attachments, draft, isControlled, maxLength, onSubmit, phase])

  const contextValue: ComposerContextValue<TControls> = {
    composerId,
    controls: controls as TControls,
    icons: { ...DEFAULT_COMPOSER_ICONS, ...icons },
    onChange: handleChange,
    onSubmit: submit,
    value: draft,
    phase,
    maxLength,
    placeholder,
    autoFocus,
    focusInput,
    setInputRef,
    attachmentsEnabled,
    attachments,
    maxAttachments,
    accept,
    addFiles,
    removeAttachment,
    attachmentInputId,
    openFilePicker,
  }

  return (
    <ComposerContext.Provider
      value={contextValue as ComposerContextValue<unknown>}
    >
      {children}
      {attachmentsEnabled ? (
        <input
          accept={accept}
          className="sr-only"
          id={attachmentInputId}
          multiple
          onChange={handleAttachmentInputChange}
          ref={attachmentInputRef}
          type="file"
        />
      ) : null}
    </ComposerContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Frame — the bordered form wrapper. Clicking anywhere focuses the input.
// When attachments are on, it is also a drag-and-drop target.
// ---------------------------------------------------------------------------

export type ComposerFrameProps = ComponentProps<"form"> & {
  readonly inputGroupClassName?: string
}

function ComposerFrame({
  children,
  className,
  inputGroupClassName,
  onClick,
  onDragOver,
  onDrop,
  ...props
}: ComposerFrameProps) {
  const { addFiles, attachmentsEnabled, focusInput, onSubmit, phase } =
    useComposer()
  const [dragging, setDragging] = useState(false)

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (phase !== "idle") {
        return
      }
      onSubmit()
    },
    [onSubmit, phase]
  )

  // Clicking empty space inside the frame focuses the textarea, but clicks
  // on interactive elements (buttons, the textarea itself) are left alone.
  const handleFrameClick = useCallback(
    (event: MouseEvent<HTMLFormElement>) => {
      onClick?.(event)
      if (event.defaultPrevented) {
        return
      }
      const target = event.target as HTMLElement | null
      if (
        target?.closest("button, textarea, a, input, select, [role='button']")
      ) {
        return
      }
      focusInput()
    },
    [focusInput, onClick]
  )

  const handleDragOver = useCallback(
    (event: DragEvent<HTMLFormElement>) => {
      onDragOver?.(event)
      if (!attachmentsEnabled || event.defaultPrevented) {
        return
      }
      // Only react to drags that carry files.
      if (!Array.from(event.dataTransfer.types).includes("Files")) {
        return
      }
      event.preventDefault()
      event.dataTransfer.dropEffect = "copy"
      if (!dragging) {
        setDragging(true)
      }
    },
    [attachmentsEnabled, dragging, onDragOver]
  )

  const handleDragLeave = useCallback((event: DragEvent<HTMLFormElement>) => {
    // Only clear when leaving the frame itself, not when moving between kids.
    if (
      event.relatedTarget &&
      event.currentTarget.contains(event.relatedTarget as Node)
    ) {
      return
    }
    setDragging(false)
  }, [])

  const handleDrop = useCallback(
    (event: DragEvent<HTMLFormElement>) => {
      onDrop?.(event)
      if (!attachmentsEnabled) {
        return
      }
      const files = Array.from(event.dataTransfer.files ?? [])
      if (files.length === 0) {
        return
      }
      event.preventDefault()
      setDragging(false)
      addFiles(files)
    },
    [addFiles, attachmentsEnabled, onDrop]
  )

  return (
    <form
      action="#"
      className={cn("w-full min-w-0", className)}
      data-composer=""
      data-composer-phase={phase}
      data-composer-dragging={dragging ? "" : undefined}
      onClick={handleFrameClick}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onSubmit={handleSubmit}
      {...props}
    >
      <InputGroup
        className={cn(
          "cursor-text rounded-[14px] bg-card/95 shadow-sm dark:bg-muted/45",
          attachmentsEnabled &&
            dragging &&
            "border-foreground/60 ring-[1.5px] ring-foreground/30 dark:border-white/60 dark:ring-white/30",
          inputGroupClassName
        )}
      >
        {children}
      </InputGroup>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Before — optional banner above the textarea (free-form slot)
// ---------------------------------------------------------------------------

function ComposerBefore({ children }: { readonly children: ReactNode }) {
  return <div className="w-full px-3 pt-3">{children}</div>
}

// ---------------------------------------------------------------------------
// InfoBar — a dismissible banner with optional action. Owns its own open
// state so consumers don't have to. Pass `onClose` to observe dismissal.
// ---------------------------------------------------------------------------

export type ComposerInfoBarProps = {
  readonly title?: ReactNode
  readonly description?: ReactNode
  readonly onClose?: () => void
  /** Optional primary action rendered on the right (e.g. "Upgrade"). */
  readonly action?: { readonly label: string; readonly onClick: () => void }
  readonly defaultOpen?: boolean
  readonly className?: string
}

function ComposerInfoBar({
  action,
  className,
  defaultOpen = true,
  description,
  onClose,
  title,
}: Readonly<ComposerInfoBarProps>) {
  const { icons } = useComposer()
  const [open, setOpen] = useState(defaultOpen)

  const handleClose = useCallback(() => {
    setOpen(false)
    onClose?.()
  }, [onClose])

  if (!open || (!title && !description)) {
    return null
  }

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-t-[14px] border-b border-border/60 bg-muted/40 px-3 py-2 text-xs dark:bg-muted/20",
        className
      )}
    >
      <div className="min-w-0 truncate text-muted-foreground">
        {title ? (
          <span className="font-medium text-foreground">{title}</span>
        ) : null}
        {description ? (
          <span
            className={title ? "ml-1.5 text-muted-foreground/80" : undefined}
          >
            {description}
          </span>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {action ? (
          <Button
            className="h-6 gap-1 px-2 text-xs"
            onClick={action.onClick}
            size="xs"
            type="button"
            variant="default"
          >
            {action.label}
          </Button>
        ) : null}
        <Button
          aria-label="Dismiss"
          className="size-6 text-muted-foreground hover:text-foreground"
          onClick={handleClose}
          size="icon-xs"
          type="button"
          variant="ghost"
        >
          <icons.Dismiss className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Attachments — preview list above the input. Renders nothing when
// attachments are disabled or empty. Composable via AttachmentsItem.
// ---------------------------------------------------------------------------

export type ComposerAttachmentsProps = {
  /** Override the default item renderer. Receives one attachment. */
  readonly renderItem?: (attachment: ComposerAttachment) => ReactNode
  readonly className?: string
}

function ComposerAttachments({
  className,
  renderItem,
}: Readonly<ComposerAttachmentsProps>) {
  const { attachments, attachmentsEnabled } = useComposer()

  if (!attachmentsEnabled || attachments.length === 0) {
    return null
  }

  return (
    <AttachmentGroup
      className={cn("w-full px-3 pt-3", className)}
      data-composer-attachments=""
    >
      {attachments.map((a) =>
        renderItem ? (
          renderItem(a)
        ) : (
          <ComposerAttachmentsItem key={a.id} attachment={a} />
        )
      )}
    </AttachmentGroup>
  )
}

export type ComposerAttachmentsItemProps = {
  readonly attachment: ComposerAttachment
  readonly className?: string
}

function ComposerAttachmentsItem({
  attachment,
  className,
}: Readonly<ComposerAttachmentsItemProps>) {
  const { icons, removeAttachment } = useComposer()
  const isImage = Boolean(attachment.previewUrl) || isImageType(attachment.type)
  const meta = formatAttachmentMeta(attachment)

  return (
    <Attachment className={cn("w-56", className)} size="sm" state="idle">
      {isImage && attachment.previewUrl ? (
        <AttachmentMedia variant="image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={attachment.name}
            draggable={false}
            src={attachment.previewUrl}
          />
        </AttachmentMedia>
      ) : (
        <AttachmentMedia>
          <icons.File />
        </AttachmentMedia>
      )}
      <AttachmentContent>
        <AttachmentTitle>{attachment.name}</AttachmentTitle>
        <AttachmentDescription>{meta}</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction
          aria-label={`Remove ${attachment.name}`}
          onClick={() => removeAttachment(attachment.id)}
        >
          <icons.Dismiss />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  )
}

// ---------------------------------------------------------------------------
// Attach — the trigger that opens the native file picker. Put it in the
// footer. Renders nothing when attachments are disabled.
// ---------------------------------------------------------------------------

export type ComposerAttachProps = {
  readonly className?: string
  readonly trigger?: ReactNode
  /** Disable the trigger (e.g. max reached) without touching the primitive. */
  readonly disabled?: boolean
}

function ComposerAttach({
  className,
  disabled = false,
  trigger,
}: Readonly<ComposerAttachProps>) {
  const {
    attachments,
    attachmentsEnabled,
    icons,
    maxAttachments,
    openFilePicker,
  } = useComposer()

  const atMax = attachments.length >= maxAttachments

  if (!attachmentsEnabled) {
    return null
  }

  return (
    <InputGroupButton
      aria-label="Attach files"
      className={cn(
        "shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground",
        className
      )}
      disabled={disabled || atMax}
      onClick={openFilePicker}
      size="icon-sm"
      type="button"
      variant="ghost"
    >
      {trigger ?? <icons.Attach className="size-4" />}
    </InputGroupButton>
  )
}

// ---------------------------------------------------------------------------
// Input — the textarea. Auto-resizes up to a max height, then scrolls.
// When attachments are on, pasted images are captured.
// ---------------------------------------------------------------------------

export type ComposerInputProps = Omit<
  ComponentProps<"textarea">,
  "value" | "onChange"
> & {
  /** Max height in pixels before the textarea scrolls. Default 160. */
  readonly maxHeight?: number
}

const INPUT_MIN_HEIGHT = 48

function ComposerInput({
  className,
  maxHeight = 160,
  ...props
}: ComposerInputProps) {
  const {
    autoFocus,
    composerId,
    focusInput,
    maxLength,
    onChange,
    phase,
    placeholder,
    setInputRef,
    value,
    addFiles,
    attachmentsEnabled,
  } = useComposer()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const locked = phase !== "idle"

  // Auto-resize: collapse then expand to scrollHeight, capped at maxHeight.
  useEffect(() => {
    const el = textareaRef.current
    if (!el) {
      return
    }
    el.style.height = "auto"
    const next = Math.max(
      INPUT_MIN_HEIGHT,
      Math.min(el.scrollHeight, maxHeight)
    )
    el.style.height = `${next}px`
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden"
  }, [maxHeight, value])

  useEffect(() => {
    if (!autoFocus || locked) {
      return
    }
    const frame = window.requestAnimationFrame(focusInput)
    return () => window.cancelAnimationFrame(frame)
  }, [autoFocus, focusInput, locked])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault()
        event.currentTarget.form?.requestSubmit()
      }
    },
    []
  )

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLTextAreaElement>) => {
      if (!attachmentsEnabled) {
        return
      }
      const items = event.clipboardData?.items
      if (!items) {
        return
      }
      const files: File[] = []
      for (const item of Array.from(items)) {
        if (item.kind === "file") {
          const file = item.getAsFile()
          if (file) {
            files.push(file)
          }
        }
      }
      if (files.length > 0) {
        event.preventDefault()
        addFiles(files)
      }
    },
    [addFiles, attachmentsEnabled]
  )

  return (
    <>
      <label className="sr-only" htmlFor={composerId}>
        Message
      </label>
      <InputGroupTextarea
        autoFocus={autoFocus}
        className={cn(
          "block max-h-40 min-h-12 w-full resize-none px-3 pt-3 pb-1 text-base leading-6 placeholder:text-muted-foreground/45 disabled:cursor-not-allowed disabled:opacity-60 md:text-[15px] dark:placeholder:text-muted-foreground/60",
          className
        )}
        data-composer-input=""
        disabled={locked}
        id={composerId}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder={placeholder}
        ref={(node) => {
          textareaRef.current = node
          setInputRef(node)
        }}
        rows={1}
        value={value}
        {...props}
      />
    </>
  )
}

// ---------------------------------------------------------------------------
// Footer — the row holding controls (left) and submit (right)
// ---------------------------------------------------------------------------

function ComposerFooter({ children }: { readonly children: ReactNode }) {
  return (
    <InputGroupAddon align="block-end" className="gap-2 pt-1 sm:gap-3">
      {children}
    </InputGroupAddon>
  )
}

function ComposerControls({ children }: { readonly children?: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
      {children ?? <span aria-hidden className="block h-8" />}
    </div>
  )
}

function ComposerSubmitSlot({ children }: { readonly children?: ReactNode }) {
  return <div className="flex shrink-0 items-center">{children}</div>
}

// ---------------------------------------------------------------------------
// Submit — explicit variants, one per phase. No boolean prop chain.
// ---------------------------------------------------------------------------

function ComposerSubmitIdle({
  className,
  trigger,
}: {
  readonly className?: string
  readonly trigger?: ReactNode
}) {
  const { attachments, icons, value } = useComposer()
  const message = value.trim()
  // Armed when there's text OR at least one attachment (image-only sends).
  const disabled = message.length === 0 && attachments.length === 0
  return (
    <InputGroupButton
      aria-label="Send message"
      className={cn(
        "ml-auto cursor-pointer disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-30",
        className
      )}
      disabled={disabled}
      size="icon-sm"
      type="submit"
      variant="default"
    >
      {trigger ?? <icons.Send className="size-3.5" />}
    </InputGroupButton>
  )
}

function ComposerSubmitPreparing({
  className,
  trigger,
}: {
  readonly className?: string
  readonly trigger?: ReactNode
}) {
  const { icons } = useComposer()
  return (
    <InputGroupButton
      aria-label="Preparing"
      className={cn("ml-auto bg-foreground/75 text-background", className)}
      disabled
      size="icon-sm"
      type="button"
      variant="default"
    >
      {trigger ?? (
        <icons.Spinner className="size-3 animate-spin motion-reduce:animate-none" />
      )}
    </InputGroupButton>
  )
}

function ComposerSubmitBusy({
  className,
  onStop,
  trigger,
}: {
  readonly className?: string
  readonly onStop: () => void
  readonly trigger?: ReactNode
}) {
  const { icons } = useComposer()
  return (
    <InputGroupButton
      aria-label="Stop"
      className={cn(
        "ml-auto cursor-default bg-foreground/15 text-foreground/55 shadow-none hover:bg-foreground/15 disabled:pointer-events-auto disabled:cursor-default disabled:opacity-100",
        className
      )}
      onClick={onStop}
      size="icon-sm"
      type="button"
      variant="ghost"
    >
      {trigger ?? <icons.Stop className="size-2.5 fill-current" />}
    </InputGroupButton>
  )
}

// ---------------------------------------------------------------------------
// Compound export
// ---------------------------------------------------------------------------

/**
 * Submit renders the correct variant from the composer phase. Explicit
 * variant components are also exported if an integrator wants direct control.
 */
function ComposerSubmit({
  className,
  onStop,
  triggers,
}: {
  readonly className?: string
  readonly onStop: () => void
  readonly triggers?: {
    readonly idle?: ReactNode
    readonly preparing?: ReactNode
    readonly busy?: ReactNode
  }
}) {
  const { phase } = useComposer()
  if (phase === "busy") {
    return (
      <ComposerSubmitBusy
        className={className}
        onStop={onStop}
        trigger={triggers?.busy}
      />
    )
  }
  if (phase === "preparing") {
    return (
      <ComposerSubmitPreparing
        className={className}
        trigger={triggers?.preparing}
      />
    )
  }
  return <ComposerSubmitIdle className={className} trigger={triggers?.idle} />
}

export const Composer = {
  Root: ComposerRoot,
  Frame: ComposerFrame,
  InfoBar: ComposerInfoBar,
  Before: ComposerBefore,
  Attachments: ComposerAttachments,
  AttachmentsItem: ComposerAttachmentsItem,
  Attach: ComposerAttach,
  Input: ComposerInput,
  Footer: ComposerFooter,
  Controls: ComposerControls,
  SubmitSlot: ComposerSubmitSlot,
  Submit: ComposerSubmit,
  // Explicit submit variants for direct use.
  SubmitIdle: ComposerSubmitIdle,
  SubmitPreparing: ComposerSubmitPreparing,
  SubmitBusy: ComposerSubmitBusy,
}

export type ComposerComponent = typeof Composer
