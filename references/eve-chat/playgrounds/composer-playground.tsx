"use client"

import { useMemo, useState, type ReactNode } from "react"
import { CheckIcon, CircleDashedIcon, FileIcon, PlusIcon } from "lucide-react"
import { Composer, useOpenFilePicker } from "@/primitives/composer"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { InputGroupButton } from "@/components/ui/input-group"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import { Message, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Composer playground
//
// Renders the decoupled Composer primitive (compound API) against a fixture
// controls payload, so we can iterate on the primitive without coupling it to
// any agent framework.
// ---------------------------------------------------------------------------

let eventId = 0
type PlaygroundEvent = {
  readonly id: number
  readonly label: string
  readonly payload?: unknown
  readonly at: string
}

// Fixture controls shape — demonstrates the primitive does not care what the
// integrator types `controls` as.
type Mode = "plan" | "auto" | "manual"
type PlaygroundControls = {
  readonly mode: Mode
  readonly verbosity: "brief" | "normal" | "thorough"
}

const MODES: readonly { readonly id: Mode; readonly label: string }[] = [
  { id: "plan", label: "Plan" },
  { id: "auto", label: "Auto" },
  { id: "manual", label: "Manual" },
]
const VERBOSITIES = ["brief", "normal", "thorough"] as const

export function ComposerPlayground() {
  const [draft, setDraft] = useState("")
  const [phase, setPhase] = useState<"idle" | "preparing" | "busy">("idle")
  const [showInfoBar, setShowInfoBar] = useState(true)
  const [attachmentsOn, setAttachmentsOn] = useState(true)
  const [maxAttachments, setMaxAttachments] = useState(6)
  const [acceptImagesOnly, setAcceptImagesOnly] = useState(false)
  const [autoFocus, setAutoFocus] = useState(true)
  const [placeholder, setPlaceholder] = useState("Ask anything...")
  const [mode, setMode] = useState<Mode>("plan")
  const [verbosity, setVerbosity] =
    useState<(typeof VERBOSITIES)[number]>("normal")
  const [events, setEvents] = useState<PlaygroundEvent[]>([])
  const [integrations, setIntegrations] = useState<Record<string, boolean>>({
    notion: false,
    linear: true,
    sentry: false,
  })

  const controls: PlaygroundControls = useMemo(
    () => ({ mode, verbosity }),
    [mode, verbosity]
  )

  const logEvent = (label: string, payload?: unknown) => {
    eventId += 1
    setEvents((current) =>
      [
        {
          at: new Date().toISOString().slice(11, 23),
          id: eventId,
          label,
          payload,
        },
        ...current,
      ].slice(0, 12)
    )
  }

  const handleSubmit = ({
    attachments,
    message,
    controls,
  }: Readonly<{
    attachments?: readonly {
      readonly name: string
      readonly type: string
      readonly size: number
    }[]
    message: string
    controls: PlaygroundControls
  }>) => {
    logEvent("submit", {
      message,
      controls,
      attachments: (attachments ?? []).map((a) => ({
        name: a.name,
        type: a.type,
        size: a.size,
      })),
    })
    setPhase("preparing")
    window.setTimeout(() => {
      setPhase("busy")
      window.setTimeout(() => setPhase("idle"), 1600)
    }, 600)
  }

  const handleStop = () => {
    logEvent("stop")
    setPhase("idle")
  }

  const playgroundIntegrations = useMemo(
    () =>
      [
        { id: "notion", label: "Notion" },
        { id: "linear", label: "Linear" },
        { id: "sentry", label: "Sentry" },
      ].map((i) => ({ ...i, enabled: integrations[i.id] ?? false })),
    [integrations]
  )

  const togglePlaygroundIntegration = (id: string) => {
    setIntegrations((current) => ({ ...current, [id]: !current[id] }))
    logEvent("toggle-integration", { id, next: !(integrations[id] ?? false) })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground md:flex-row">
      <div className="flex min-h-dvh flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border/70 px-5 py-3">
          <div className="min-w-0">
            <p className="text-sm font-medium">Composer primitive playground</p>
            <p className="truncate text-xs text-muted-foreground">
              Decoupled <code className="font-mono">primitives/composer</code>{" "}
              (compound API) with a fixture controls payload.
            </p>
          </div>
          <span className="rounded-full border border-border/70 px-2 py-0.5 text-[11px] text-muted-foreground">
            /playground/composer
          </span>
        </header>

        <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-10 sm:px-6">
          <div className="w-full max-w-2xl space-y-4">
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Home-style
              </p>
              <p className="text-xs text-muted-foreground/70">
                Centered, single composer in an empty conversation.
              </p>
            </div>
            <Composer.Root<PlaygroundControls>
              autoFocus={autoFocus}
              accept={acceptImagesOnly ? "image/*" : undefined}
              controls={controls}
              maxAttachments={attachmentsOn ? maxAttachments : 0}
              onChange={setDraft}
              onSubmit={handleSubmit}
              onStop={handleStop}
              phase={phase}
              placeholder={placeholder}
              value={draft}
            >
              <Composer.Frame>
                {showInfoBar ? (
                  <Composer.InfoBar
                    action={{
                      label: "Upgrade",
                      onClick: () => logEvent("infobar-action"),
                    }}
                    description="Your monthly balance is running out."
                    onClose={() => logEvent("infobar-close")}
                    title="Low credits"
                  />
                ) : null}
                {attachmentsOn ? <Composer.Attachments /> : null}
                <Composer.Input />
                <Composer.Footer>
                  <Composer.Controls>
                    {attachmentsOn ? <Composer.Attach /> : null}
                    <FixtureControlsSlot
                      mode={mode}
                      onModeChange={setMode}
                      onVerbosityChange={setVerbosity}
                      verbosity={verbosity}
                    />
                  </Composer.Controls>
                  <Composer.SubmitSlot>
                    <Composer.Submit onStop={handleStop} />
                  </Composer.SubmitSlot>
                </Composer.Footer>
              </Composer.Frame>
            </Composer.Root>

            <div className="space-y-3 pt-2">
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Plus menu
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Secondary actions consolidated into one trigger. Attach file
                  and mock integrations live behind a single{" "}
                  <code className="font-mono">+</code> using shadcn{" "}
                  <code className="font-mono">dropdown-menu</code>.
                </p>
              </div>
              <Composer.Root<PlaygroundControls>
                accept={acceptImagesOnly ? "image/*" : undefined}
                controls={controls}
                maxAttachments={attachmentsOn ? maxAttachments : 0}
                onChange={setDraft}
                onSubmit={handleSubmit}
                onStop={handleStop}
                phase={phase}
                placeholder="Try the + menu…"
                value={draft}
              >
                <Composer.Frame>
                  {attachmentsOn ? <Composer.Attachments /> : null}
                  <Composer.Input />
                  <Composer.Footer>
                    <Composer.Controls>
                      <PlaygroundPlusMenu
                        attachmentsOn={attachmentsOn}
                        integrations={playgroundIntegrations}
                        onToggleIntegration={togglePlaygroundIntegration}
                      />
                    </Composer.Controls>
                    <Composer.SubmitSlot>
                      <Composer.Submit onStop={handleStop} />
                    </Composer.SubmitSlot>
                  </Composer.Footer>
                </Composer.Frame>
              </Composer.Root>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Uncontrolled
                </p>
                <p className="text-xs text-muted-foreground/70">
                  No <code className="font-mono">value</code>/
                  <code className="font-mono">onChange</code> in the parent.
                  Seeded with <code className="font-mono">defaultValue</code>,
                  self-clears after submit. The parent never holds draft state.
                </p>
              </div>
              <Composer.Root<PlaygroundControls>
                controls={controls}
                defaultValue=""
                onSubmit={handleSubmit}
                onStop={handleStop}
                placeholder="Type and press Enter (parent owns nothing)"
              >
                <Composer.Frame>
                  <Composer.Input />
                  <Composer.Footer>
                    <Composer.Controls>
                      <span className="px-1 text-[11px] text-muted-foreground">
                        uncontrolled
                      </span>
                    </Composer.Controls>
                    <Composer.SubmitSlot>
                      <Composer.Submit onStop={handleStop} />
                    </Composer.SubmitSlot>
                  </Composer.Footer>
                </Composer.Frame>
              </Composer.Root>
            </div>

            <ThreadPrimitiveFixture />
          </div>
        </div>
      </div>

      <aside className="flex w-full shrink-0 flex-col gap-5 border-t border-border/70 bg-muted/30 p-5 text-sm md:w-80 md:border-t-0 md:border-l">
        <Section title="Lifecycle">
          <Toggle
            label="Show InfoBar"
            checked={showInfoBar}
            onChange={setShowInfoBar}
          />
          <Toggle
            label="phase: preparing"
            checked={phase === "preparing"}
            onChange={(v) => setPhase(v ? "preparing" : "idle")}
          />
          <Toggle
            label="phase: busy"
            checked={phase === "busy"}
            onChange={(v) => setPhase(v ? "busy" : "idle")}
          />
        </Section>

        <Section title="Attachments">
          <Toggle
            label="Enable attachments"
            checked={attachmentsOn}
            onChange={setAttachmentsOn}
          />
          <Toggle
            label="Accept images only"
            checked={acceptImagesOnly}
            onChange={setAcceptImagesOnly}
          />
          <Field label={`Max attachments (${maxAttachments})`}>
            <input
              className="w-full"
              max={20}
              min={1}
              onChange={(event) =>
                setMaxAttachments(
                  Math.max(1, Math.min(20, Number(event.target.value) || 1))
                )
              }
              type="range"
              value={maxAttachments}
            />
          </Field>
          <p className="text-[11px] leading-snug text-muted-foreground">
            Drop files anywhere on the frame, paste images into the input, or
            use the paperclip. Image-only sends are armed.
          </p>
        </Section>

        <Section title="Input">
          <Field label="Placeholder">
            <input
              className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-foreground/30"
              onChange={(event) => setPlaceholder(event.target.value)}
              value={placeholder}
            />
          </Field>
          <Toggle
            label="autoFocus"
            checked={autoFocus}
            onChange={setAutoFocus}
          />
        </Section>

        <Section title="Events">
          {events.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Submit or stop the composer to see callbacks fire here. The{" "}
              <code className="font-mono">submit</code> payload includes the
              opaque <code className="font-mono">controls</code> the slot
              produced.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="rounded-md border border-border/60 bg-background px-2 py-1.5 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-foreground">
                      {event.label}
                    </span>
                    <span className="text-muted-foreground">{event.at}</span>
                  </div>
                  {event.payload !== undefined ? (
                    <pre className="mt-1 overflow-auto font-mono text-[11px] text-muted-foreground">
                      {JSON.stringify(event.payload)}
                    </pre>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </Section>
      </aside>
    </div>
  )
}

function ThreadPrimitiveFixture() {
  return (
    <section className="space-y-3 pt-4">
      <div>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Thread primitives
        </p>
        <p className="text-xs text-muted-foreground/70">
          Static fixture for shadcn chat primitives:{" "}
          <code className="font-mono">MessageScroller</code>,{" "}
          <code className="font-mono">Message</code>,{" "}
          <code className="font-mono">Bubble</code>, and{" "}
          <code className="font-mono">Marker</code>.
        </p>
      </div>
      <div className="h-72 overflow-hidden rounded-[14px] border border-border bg-card/50">
        <MessageScrollerProvider autoScroll>
          <MessageScroller className="h-full">
            <MessageScrollerViewport>
              <MessageScrollerContent className="max-w-none gap-3 px-4 py-4">
                <MessageScrollerItem messageId="fixture-user" scrollAnchor>
                  <Message align="end">
                    <MessageContent>
                      <Bubble
                        variant="muted"
                        className="border border-border/40 bg-muted/70"
                      >
                        <BubbleContent>
                          Can you summarize what changed?
                        </BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>

                <MessageScrollerItem messageId="fixture-marker">
                  <Marker className="justify-start px-1">
                    <MarkerIcon>
                      <CircleDashedIcon className="size-3.5 animate-spin" />
                    </MarkerIcon>
                    <MarkerContent className="shimmer">
                      Reading changed files...
                    </MarkerContent>
                  </Marker>
                </MessageScrollerItem>

                <MessageScrollerItem messageId="fixture-assistant">
                  <Message align="start">
                    <MessageContent className="max-w-none text-sm leading-relaxed">
                      <p>
                        Added shadcn-style thread primitives and wired them into
                        the chat renderer while keeping the eve message parts
                        intact.
                      </p>
                      <Marker className="mt-3 justify-start px-1">
                        <MarkerIcon>
                          <CheckIcon className="size-3.5" />
                        </MarkerIcon>
                        <MarkerContent>Typecheck passed</MarkerContent>
                      </Marker>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Fixture slot content — demonstrates the slot is fully decoupled. Could be
// CC's mode dropdown, eve's connection toggles, or anything else.
// ---------------------------------------------------------------------------

function FixtureControlsSlot({
  mode,
  onModeChange,
  onVerbosityChange,
  verbosity,
}: {
  readonly mode: Mode
  readonly onModeChange: (mode: Mode) => void
  readonly onVerbosityChange: (v: (typeof VERBOSITIES)[number]) => void
  readonly verbosity: (typeof VERBOSITIES)[number]
}) {
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <SegmentedControl
        ariaLabel="Mode"
        onChange={(id) => onModeChange(id as Mode)}
        options={MODES.map((m) => ({ id: m.id, label: m.label }))}
        value={mode}
      />
      <SegmentedControl
        ariaLabel="Verbosity"
        onChange={(id) => onVerbosityChange(id as (typeof VERBOSITIES)[number])}
        options={VERBOSITIES.map((v) => ({
          id: v,
          label: v[0]!.toUpperCase(),
        }))}
        value={verbosity}
      />
    </div>
  )
}

function SegmentedControl({
  ariaLabel,
  onChange,
  options,
  value,
}: {
  readonly ariaLabel: string
  readonly onChange: (id: string) => void
  readonly options: readonly { readonly id: string; readonly label: string }[]
  readonly value: string
}) {
  return (
    <div
      aria-label={ariaLabel}
      className="inline-flex items-center rounded-md border border-border/70 bg-muted/40 p-0.5"
      role="radiogroup"
    >
      {options.map((option) => {
        const selected = option.id === value
        return (
          <button
            aria-checked={selected}
            className={cn(
              "rounded-[5px] px-2 py-1 text-[11px] font-medium transition-colors",
              selected
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            key={option.id}
            onClick={() => onChange(option.id)}
            role="radio"
            type="button"
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Small presentational helpers, local to the playground.
// ---------------------------------------------------------------------------

function Section({
  children,
  title,
}: {
  readonly children: ReactNode
  readonly title: string
}) {
  return (
    <section className="space-y-2">
      <h3 className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </section>
  )
}

function Toggle({
  checked,
  label,
  onChange,
}: {
  readonly checked: boolean
  readonly label: string
  readonly onChange: (next: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span className="text-sm text-foreground">{label}</span>
      <button
        aria-checked={checked}
        className={cn(
          "relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-emerald-500" : "bg-muted"
        )}
        onClick={(event) => {
          event.preventDefault()
          onChange(!checked)
        }}
        role="switch"
        type="button"
      >
        <span
          className={cn(
            "size-3 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-[15px]" : "translate-x-0.5"
          )}
        />
      </button>
    </label>
  )
}

function Field({
  children,
  label,
}: {
  readonly children: ReactNode
  readonly label: string
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}

type PlaygroundIntegration = {
  readonly id: string
  readonly label: string
  readonly enabled: boolean
}

function PlaygroundPlusMenu({
  attachmentsOn,
  integrations,
  onToggleIntegration,
}: {
  readonly attachmentsOn: boolean
  readonly integrations: readonly PlaygroundIntegration[]
  readonly onToggleIntegration: (id: string) => void
}) {
  const openFilePicker = useOpenFilePicker()
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild>
        <InputGroupButton
          aria-label="Add attachment or connection"
          className="shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground"
          onPointerDown={(event) => {
            event.preventDefault()
            setOpen((current) => !current)
          }}
          size="icon-sm"
          type="button"
          variant="outline"
        >
          <PlusIcon className="size-4" />
        </InputGroupButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-52 rounded-md border-border bg-popover p-1"
        sideOffset={4}
      >
        {attachmentsOn ? (
          <>
            <DropdownMenuLabel className="px-2 py-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              Add
            </DropdownMenuLabel>
            <DropdownMenuItem
              className="h-auto cursor-pointer gap-2 rounded-sm px-2 py-1.5 text-sm focus:bg-muted/70"
              onSelect={(event) => {
                event.preventDefault()
                openFilePicker()
              }}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-background text-foreground">
                <FileIcon className="size-4 text-foreground" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm text-foreground">
                  Attach file
                </span>
                <span className="block text-[11px] text-muted-foreground">
                  From device, drop, or paste
                </span>
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 bg-border/70" />
            <DropdownMenuLabel className="px-2 py-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              Connections
            </DropdownMenuLabel>
          </>
        ) : null}
        {integrations.map((i) => (
          <DropdownMenuItem
            aria-checked={i.enabled}
            className="h-9 cursor-pointer gap-2 rounded-sm px-2 py-1 text-sm focus:bg-muted/70"
            key={i.id}
            onSelect={(event) => {
              event.preventDefault()
              onToggleIntegration(i.id)
            }}
            role="menuitemcheckbox"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-background text-[11px] font-medium text-foreground uppercase">
              {i.label.slice(0, 2)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm text-foreground">
                {i.label}
              </span>
            </span>
            <span
              aria-hidden="true"
              className={cn(
                "relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors",
                i.enabled ? "bg-emerald-500" : "bg-muted"
              )}
            >
              <span
                className={cn(
                  "size-3 rounded-full bg-white shadow-sm transition-transform",
                  i.enabled ? "translate-x-[15px]" : "translate-x-0.5"
                )}
              />
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
