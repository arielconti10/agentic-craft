"use client"

import * as React from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

type ThreadMessageRole = "assistant" | "user" | "system"

type ThreadToolCallState = "pending" | "running" | "done" | "error"

type ThreadStatusState =
  | "idle"
  | "thinking"
  | "working"
  | "streaming"
  | "complete"
  | "error"

type ThreadStreamChunk =
  | string
  | {
      content: string
      replace?: boolean
    }

type ThreadStreamSource =
  | AsyncIterable<ThreadStreamChunk>
  | (() => AsyncIterable<ThreadStreamChunk>)

type ThreadStreamRenderState = {
  role: ThreadMessageRole
  label?: string
  streaming: boolean
}

type ThreadRootProps = React.ComponentProps<"section"> & {
  stream?: ThreadStreamSource | null
  streamRole?: ThreadMessageRole
  streamLabel?: string
  renderStream?: (
    content: string,
    state: ThreadStreamRenderState
  ) => React.ReactNode
  onStreamComplete?: (content: string) => void
  onStreamError?: (error: unknown) => void
}

type ThreadMessageProps = React.ComponentProps<"article"> & {
  role?: ThreadMessageRole
  name?: string
  timestamp?: React.ReactNode
  streaming?: boolean
}

type ThreadStatusProps = React.ComponentProps<"div"> & {
  state?: ThreadStatusState
  label: React.ReactNode
  detail?: React.ReactNode
}

type ThreadToolCallProps = Omit<React.ComponentProps<"div">, "title"> & {
  title: React.ReactNode
  state?: ThreadToolCallState
  duration?: React.ReactNode
  summary?: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function isReducedMotion() {
  if (typeof window === "undefined") {
    return false
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function streamChunkText(chunk: ThreadStreamChunk) {
  return typeof chunk === "string" ? chunk : chunk.content
}

function streamChunkReplaces(chunk: ThreadStreamChunk) {
  return typeof chunk === "string" ? false : chunk.replace === true
}

function resolveStreamSource(stream: ThreadStreamSource) {
  return typeof stream === "function" ? stream() : stream
}

function useControllableOpen({
  open,
  defaultOpen,
  onOpenChange,
}: {
  open?: boolean
  defaultOpen: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const controlled = open !== undefined
  const currentOpen = controlled ? open : uncontrolledOpen

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!controlled) {
        setUncontrolledOpen(nextOpen)
      }
      onOpenChange?.(nextOpen)
    },
    [controlled, onOpenChange]
  )

  return [currentOpen, setOpen] as const
}

function ThreadRoot({
  stream,
  streamRole = "assistant",
  streamLabel,
  renderStream,
  onStreamComplete,
  onStreamError,
  className,
  children,
  ...props
}: ThreadRootProps) {
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const sentinelRef = React.useRef<HTMLDivElement>(null)
  const stickToBottomRef = React.useRef(true)
  const programmaticScrollRef = React.useRef(false)
  const programmaticScrollFrameRef = React.useRef<number | null>(null)
  const programmaticScrollTimerRef = React.useRef<number | null>(null)
  const [anchored, setAnchored] = React.useState(true)
  const [streamText, setStreamText] = React.useState("")
  const [streaming, setStreaming] = React.useState(false)
  const onStreamCompleteRef = React.useRef(onStreamComplete)
  const onStreamErrorRef = React.useRef(onStreamError)

  const scrollToBottom = React.useCallback((behavior: ScrollBehavior) => {
    const viewport = viewportRef.current

    if (!viewport) {
      return
    }

    programmaticScrollRef.current = true

    if (programmaticScrollFrameRef.current) {
      window.cancelAnimationFrame(programmaticScrollFrameRef.current)
      programmaticScrollFrameRef.current = null
    }

    if (programmaticScrollTimerRef.current) {
      window.clearTimeout(programmaticScrollTimerRef.current)
      programmaticScrollTimerRef.current = null
    }

    function performScroll() {
      const currentViewport = viewportRef.current

      if (!currentViewport) {
        programmaticScrollRef.current = false
        return
      }

      if (typeof currentViewport.scrollTo === "function") {
        currentViewport.scrollTo({
          top: currentViewport.scrollHeight,
          behavior,
        })
      } else {
        currentViewport.scrollTop = currentViewport.scrollHeight
      }

      programmaticScrollTimerRef.current = window.setTimeout(
        () => {
          programmaticScrollRef.current = false
          programmaticScrollTimerRef.current = null
        },
        behavior === "smooth" ? 360 : 120
      )
    }

    if (behavior === "auto") {
      programmaticScrollFrameRef.current = window.requestAnimationFrame(() => {
        programmaticScrollFrameRef.current = null
        performScroll()
      })
    } else {
      performScroll()
    }
  }, [])

  React.useEffect(() => {
    onStreamCompleteRef.current = onStreamComplete
  }, [onStreamComplete])

  React.useEffect(() => {
    onStreamErrorRef.current = onStreamError
  }, [onStreamError])

  React.useEffect(() => {
    const viewport = viewportRef.current
    const sentinel = sentinelRef.current

    if (!viewport || !sentinel || !("IntersectionObserver" in window)) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nextAnchored = entry?.isIntersecting ?? true

        setAnchored(nextAnchored)

        if (nextAnchored) {
          stickToBottomRef.current = true
        }
      },
      {
        root: viewport,
        threshold: 1,
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [])

  React.useEffect(() => {
    const viewport = viewportRef.current

    if (!viewport) {
      return
    }

    const currentViewport = viewport

    function handleScroll() {
      const distanceFromBottom =
        currentViewport.scrollHeight -
        currentViewport.scrollTop -
        currentViewport.clientHeight
      const nextAnchored = distanceFromBottom <= 8

      setAnchored(nextAnchored)

      if (!programmaticScrollRef.current) {
        stickToBottomRef.current = nextAnchored
      }
    }

    currentViewport.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      currentViewport.removeEventListener("scroll", handleScroll)
    }
  }, [])

  React.useEffect(() => {
    if (!stickToBottomRef.current) {
      return
    }

    scrollToBottom("auto")
  }, [scrollToBottom, streaming, streamText])

  React.useEffect(() => {
    return () => {
      if (programmaticScrollFrameRef.current) {
        window.cancelAnimationFrame(programmaticScrollFrameRef.current)
      }

      if (programmaticScrollTimerRef.current) {
        window.clearTimeout(programmaticScrollTimerRef.current)
      }
    }
  }, [])

  React.useEffect(() => {
    if (!stream) {
      setStreaming(false)
      setStreamText("")
      return
    }

    let cancelled = false
    let nextText = ""
    const currentStream = resolveStreamSource(stream)

    setStreaming(true)
    setStreamText("")

    async function readStream() {
      try {
        for await (const chunk of currentStream) {
          if (cancelled) {
            return
          }

          nextText = streamChunkReplaces(chunk)
            ? streamChunkText(chunk)
            : nextText + streamChunkText(chunk)
          setStreamText(nextText)
        }

        if (!cancelled) {
          onStreamCompleteRef.current?.(nextText)
        }
      } catch (error) {
        if (!cancelled) {
          onStreamErrorRef.current?.(error)
        }
      } finally {
        if (!cancelled) {
          setStreaming(false)
        }
      }
    }

    void readStream()

    return () => {
      cancelled = true
    }
  }, [stream])

  return (
    <section
      data-slot="thread"
      className={cn(
        "relative isolate flex min-h-[420px] flex-col overflow-hidden rounded-lg border border-border bg-background text-foreground shadow-sm",
        className
      )}
      {...props}
    >
      <div
        ref={viewportRef}
        data-slot="thread-viewport"
        tabIndex={0}
        aria-label="Thread messages"
        className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:px-4"
      >
        <div
          data-slot="thread-content"
          className="flex min-h-full flex-col gap-4"
        >
          {children}
          {streamText ? (
            renderStream ? (
              renderStream(streamText, {
                role: streamRole,
                label: streamLabel,
                streaming,
              })
            ) : (
              <ThreadMessage
                role={streamRole}
                name={streamLabel}
                streaming={streaming}
              >
                {streamText}
              </ThreadMessage>
            )
          ) : null}
          <div
            ref={sentinelRef}
            data-slot="thread-bottom-sentinel"
            aria-hidden="true"
            className="h-px"
          />
        </div>
      </div>
      {!anchored ? (
        <button
          type="button"
          data-slot="thread-scroll-bottom"
          aria-label="Scroll to bottom"
          className="absolute bottom-3 left-1/2 z-10 grid size-9 -translate-x-1/2 place-items-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-[background-color,color,box-shadow,transform] outline-none after:absolute after:-inset-1 after:content-[''] focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-muted [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
          onClick={() => {
            stickToBottomRef.current = true
            scrollToBottom(isReducedMotion() ? "auto" : "smooth")
          }}
        >
          <ArrowDownIcon />
        </button>
      ) : null}
    </section>
  )
}

function ThreadMessage({
  role = "assistant",
  name,
  timestamp,
  streaming,
  className,
  children,
  ...props
}: ThreadMessageProps) {
  const hasMeta = Boolean(name || timestamp || streaming)

  return (
    <article
      data-slot="thread-message"
      data-role={role}
      aria-live={streaming ? "polite" : undefined}
      aria-atomic={streaming ? "false" : undefined}
      className={cn(
        "flex min-w-0 gap-3",
        role === "user" && "justify-end",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "max-w-[min(100%,40rem)] min-w-0",
          role === "user" && "text-right"
        )}
      >
        {hasMeta ? (
          <div
            data-slot="thread-message-meta"
            className={cn(
              "mb-1.5 flex items-center gap-2 text-xs text-muted-foreground",
              role === "user" && "justify-end"
            )}
          >
            {name ? (
              <span className="font-medium text-foreground">{name}</span>
            ) : null}
            {streaming ? (
              <span
                aria-label="Streaming"
                className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
              >
                streaming
              </span>
            ) : null}
            {timestamp ? (
              <span className="text-muted-foreground tabular-nums">
                {timestamp}
              </span>
            ) : null}
          </div>
        ) : null}
        <div
          data-slot="thread-message-content"
          className={cn(
            "text-sm leading-6 [overflow-wrap:anywhere] break-words text-foreground",
            role === "user" &&
              "rounded-md bg-muted px-3 py-2 text-left text-foreground",
            role === "system" &&
              "rounded-md border border-dashed border-border bg-muted/30 px-3 py-2 text-muted-foreground"
          )}
        >
          {children}
        </div>
      </div>
    </article>
  )
}

const statusLabels: Record<ThreadStatusState, string> = {
  idle: "Idle",
  thinking: "Thinking",
  working: "Working",
  streaming: "Streaming",
  complete: "Complete",
  error: "Error",
}

function ThreadStatus({
  state = "idle",
  label,
  detail,
  className,
  ...props
}: ThreadStatusProps) {
  return (
    <div
      data-slot="thread-status"
      data-state={state}
      role="status"
      aria-label={statusLabels[state]}
      className={cn(
        "sticky top-0 z-10 -mx-3 border-b border-border bg-background/95 px-3 py-2 backdrop-blur sm:-mx-4 sm:px-4",
        className
      )}
      {...props}
    >
      <div className="flex min-h-8 items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {label}
          </p>
          {detail ? (
            <p className="truncate text-xs text-muted-foreground">{detail}</p>
          ) : null}
        </div>
        <span
          className={cn(
            "shrink-0 rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground",
            state === "error" && "text-destructive"
          )}
        >
          {statusLabels[state]}
        </span>
      </div>
    </div>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn(
        "shrink-0 transition-transform duration-150",
        open && "rotate-90"
      )}
    >
      <path d="m6 4 4 4-4 4" />
    </svg>
  )
}

function ArrowDownIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 3.5v8" />
      <path d="m4.5 8.5 3.5 3.5 3.5-3.5" />
    </svg>
  )
}

function ToolCallIcon({ state }: { state: ThreadToolCallState }) {
  if (state === "done") {
    return (
      <svg
        viewBox="0 0 16 16"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="1.5" y="1.5" width="13" height="13" rx="3" />
        <path d="M5 8.2l2.1 2.1L11 6.2" />
      </svg>
    )
  }

  if (state === "error") {
    return (
      <svg
        viewBox="0 0 16 16"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M8 1.8 1.6 13h12.8L8 1.8Z" />
        <path d="M8 6.4v3.1" />
        <path d="M8 11.4h.01" />
      </svg>
    )
  }

  if (state === "running") {
    return (
      <span
        aria-hidden="true"
        className="size-3.5 animate-spin rounded-full border border-foreground/70 border-t-transparent motion-reduce:animate-none"
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className="size-3 animate-[thread-pending-pulse_1.8s_cubic-bezier(0.45,0,0.55,1)_infinite] rounded-full border border-dashed border-muted-foreground motion-reduce:animate-none"
    />
  )
}

const toolCallStateLabel: Record<ThreadToolCallState, string> = {
  pending: "Pending",
  running: "Running",
  done: "Done",
  error: "Error",
}

function toolCallToggleLabel(title: React.ReactNode) {
  return typeof title === "string"
    ? `Toggle ${title} details`
    : "Toggle tool call details"
}

function ThreadToolCallHeader({
  title,
  state,
  duration,
  summary,
  open,
  hasDetails,
}: {
  title: React.ReactNode
  state: ThreadToolCallState
  duration?: React.ReactNode
  summary?: React.ReactNode
  open: boolean
  hasDetails: boolean
}) {
  return (
    <>
      <span
        className={cn(
          "grid size-5 shrink-0 place-items-center rounded-sm bg-background text-muted-foreground shadow-[0_0_0_1px_var(--border)]",
          state === "done" && "text-foreground/70",
          state === "error" && "text-destructive"
        )}
      >
        <ToolCallIcon state={state} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">
          {title}
        </span>
        {summary ? (
          <span className="block truncate text-xs text-muted-foreground">
            {summary}
          </span>
        ) : null}
      </span>
      <span
        className={cn(
          "shrink-0 text-xs text-muted-foreground",
          duration && "tabular-nums"
        )}
      >
        {duration ?? toolCallStateLabel[state]}
      </span>
      {hasDetails ? <ChevronIcon open={open} /> : null}
    </>
  )
}

function ThreadToolCall({
  title,
  state = "pending",
  duration,
  summary,
  defaultOpen,
  open: openProp,
  onOpenChange,
  className,
  children,
  ...props
}: ThreadToolCallProps) {
  const hasDetails = Boolean(children)
  const [open, setOpen] = useControllableOpen({
    open: openProp,
    defaultOpen: defaultOpen ?? state === "error",
    onOpenChange,
  })

  if (!hasDetails) {
    return (
      <div
        data-slot="thread-tool-call"
        data-state={state}
        className={cn(
          "overflow-hidden rounded-md border border-border bg-muted/20",
          className
        )}
        {...props}
      >
        <div className="flex min-h-11 w-full min-w-0 items-center gap-2.5 px-3 py-2 text-left">
          <ThreadToolCallHeader
            title={title}
            state={state}
            duration={duration}
            summary={summary}
            open={open}
            hasDetails={hasDetails}
          />
        </div>
      </div>
    )
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div
        data-slot="thread-tool-call"
        data-state={state}
        className={cn(
          "overflow-hidden rounded-md border border-border bg-muted/20",
          className
        )}
        {...props}
      >
        <CollapsibleTrigger
          type="button"
          disabled={!hasDetails}
          render={(triggerProps) => (
            <button
              {...triggerProps}
              aria-expanded={hasDetails ? open : undefined}
              aria-label={hasDetails ? toolCallToggleLabel(title) : undefined}
              className={cn(
                "flex min-h-11 w-full min-w-0 items-center gap-2.5 px-3 py-2 text-left transition-[background-color,box-shadow] outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                hasDetails &&
                  "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-muted/60"
              )}
            >
              <ThreadToolCallHeader
                title={title}
                state={state}
                duration={duration}
                summary={summary}
                open={open}
                hasDetails={hasDetails}
              />
            </button>
          )}
        />
        {hasDetails ? (
          <CollapsibleContent className="border-t border-border bg-background/45 px-3 py-3 text-sm leading-6 text-muted-foreground">
            {children}
          </CollapsibleContent>
        ) : null}
      </div>
    </Collapsible>
  )
}

function ThreadEmpty({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="thread-empty"
      className={cn(
        "grid min-h-40 place-items-center rounded-lg border border-dashed border-border bg-muted/20 px-4 text-center text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const Thread = Object.assign(ThreadRoot, {
  Message: ThreadMessage,
  Status: ThreadStatus,
  ToolCall: ThreadToolCall,
  Empty: ThreadEmpty,
})

export {
  Thread,
  ThreadRoot,
  ThreadMessage,
  ThreadStatus,
  ThreadToolCall,
  ThreadEmpty,
}
export type {
  ThreadMessageProps,
  ThreadMessageRole,
  ThreadRootProps,
  ThreadStatusProps,
  ThreadStatusState,
  ThreadStreamChunk,
  ThreadStreamRenderState,
  ThreadStreamSource,
  ThreadToolCallProps,
  ThreadToolCallState,
}
