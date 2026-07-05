"use client"

import * as React from "react"

import {
  Composer,
  type ComposerSubmit,
  type ComposerSubmitPhase,
} from "@/components/playground/compound-composer"
import { Badge } from "@/components/ui/badge"

// ---------------------------------------------------------------------------
// Compound composer playground
//
// Fixture rig for the eve-chat compound composer port
// (src/components/playground/compound-composer/). Rebuilt from the snapshot
// rig in references/eve-chat/playgrounds/composer-playground.tsx, with the
// external ui.sh picker replaced by plain local panels.
//
// This is a lab surface: it exists to compare slot compositions, exercise the
// submit lifecycle, and inspect controls payloads — not to ship UI. B+C
// dispatch-moment compositions build on top of this rig.
// ---------------------------------------------------------------------------

const NOOP = () => {}

const FIXTURE_ASK =
  "Migrate session-chat-page to the shared adapter — don't touch deps, stop when tests pass, keep it under $5"

function PanelSection({
  title,
  description,
  children,
}: {
  readonly title: string
  readonly description: string
  readonly children: React.ReactNode
}) {
  return (
    <section className="border-t border-border/60 py-8 first:border-t-0 first:pt-0">
      <h2 className="text-sm font-medium text-foreground">{title}</h2>
      <p className="mt-1 max-w-prose text-xs leading-5 text-muted-foreground">
        {description}
      </p>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function LastSent({ message }: { readonly message: string | null }) {
  return (
    <p
      className="mt-2 min-h-4 text-[11px] text-muted-foreground"
      aria-live="polite"
    >
      {message ? `Sent: ${message}` : "\u00A0"}
    </p>
  )
}

// -- 1. Slot composition matrix ---------------------------------------------

function BareComposer() {
  const [sent, setSent] = React.useState<string | null>(null)

  return (
    <div className="min-w-0">
      <p className="section-label mb-2">Bare</p>
      <Composer.Root
        autoFocus={false}
        onSubmit={({ message }) => setSent(message)}
        onStop={NOOP}
        placeholder="Frame · Input · Footer · Submit"
      >
        <Composer.Frame>
          <Composer.Input />
          <Composer.Footer>
            <Composer.Controls />
            <Composer.SubmitSlot>
              <Composer.Submit onStop={NOOP} />
            </Composer.SubmitSlot>
          </Composer.Footer>
        </Composer.Frame>
      </Composer.Root>
      <LastSent message={sent} />
    </div>
  )
}

function FullStackComposer() {
  const [sent, setSent] = React.useState<string | null>(null)

  return (
    <div className="min-w-0">
      <p className="section-label mb-2">Full stack</p>
      <Composer.Root
        autoFocus={false}
        onSubmit={({ message }) => setSent(message)}
        onStop={NOOP}
        placeholder="InfoBar · Before · Input · Controls · Submit"
      >
        <Composer.Frame>
          <Composer.InfoBar
            title="Preview model"
            description="Responses may be slower this week."
            action={{ label: "Switch", onClick: NOOP }}
          />
          <Composer.Before>
            <p className="text-[11px] text-muted-foreground">
              Before slot — free-form banner space above the textarea.
            </p>
          </Composer.Before>
          <Composer.Input />
          <Composer.Footer>
            <Composer.Controls>
              <Badge variant="outline">Agent</Badge>
              <Badge variant="outline">Fast</Badge>
            </Composer.Controls>
            <Composer.SubmitSlot>
              <Composer.Submit onStop={NOOP} />
            </Composer.SubmitSlot>
          </Composer.Footer>
        </Composer.Frame>
      </Composer.Root>
      <LastSent message={sent} />
    </div>
  )
}

// -- 2. Submit lifecycle ------------------------------------------------------

const PHASE_SEQUENCE: Record<ComposerSubmitPhase, string> = {
  idle: "Input editable, submit armed",
  preparing: "Turn starting — input locked, spinner",
  busy: "Turn in flight — submit becomes Stop",
}

function LifecyclePanel() {
  const [phase, setPhase] = React.useState<ComposerSubmitPhase>("idle")
  const [lastRun, setLastRun] = React.useState<string | null>(null)
  const timersRef = React.useRef<number[]>([])

  const clearTimers = React.useCallback(() => {
    for (const timer of timersRef.current) {
      window.clearTimeout(timer)
    }
    timersRef.current = []
  }, [])

  // Timers outlive the event handler that starts them; clear on unmount.
  React.useEffect(() => clearTimers, [clearTimers])

  const handleSubmit = ({ message }: ComposerSubmit<unknown>) => {
    clearTimers()
    setLastRun(message)
    setPhase("preparing")
    timersRef.current.push(
      window.setTimeout(() => setPhase("busy"), 700),
      window.setTimeout(() => setPhase("idle"), 3400)
    )
  }

  const handleStop = () => {
    clearTimers()
    setPhase("idle")
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-2" aria-live="polite">
        <Badge variant={phase === "idle" ? "secondary" : "default"}>
          {phase}
        </Badge>
        <p className="text-[11px] text-muted-foreground">
          {PHASE_SEQUENCE[phase]}
        </p>
      </div>
      <Composer.Root
        autoFocus={false}
        defaultValue={FIXTURE_ASK}
        onSubmit={handleSubmit}
        onStop={handleStop}
        phase={phase}
        placeholder="Send to walk idle → preparing → busy → idle"
      >
        <Composer.Frame>
          <Composer.Input />
          <Composer.Footer>
            <Composer.Controls />
            <Composer.SubmitSlot>
              <Composer.Submit onStop={handleStop} />
            </Composer.SubmitSlot>
          </Composer.Footer>
        </Composer.Frame>
      </Composer.Root>
      <LastSent message={lastRun} />
    </div>
  )
}

// -- 3. Attachments -----------------------------------------------------------

const MAX_ATTACHMENTS = 3

function AttachmentsPanel() {
  const [count, setCount] = React.useState(0)
  const [sent, setSent] = React.useState<string | null>(null)

  const handleSubmit = ({ message, attachments }: ComposerSubmit<unknown>) => {
    const files = attachments.map((attachment) => attachment.name)
    setSent(
      [message || "(no text)", files.length > 0 ? files.join(", ") : null]
        .filter(Boolean)
        .join(" + ")
    )
  }

  return (
    <div>
      <Composer.Root
        autoFocus={false}
        maxAttachments={MAX_ATTACHMENTS}
        onAttachmentsChange={(attachments) => setCount(attachments.length)}
        onSubmit={handleSubmit}
        onStop={NOOP}
        placeholder="Pick, drop, or paste files — attachments-only sends allowed"
      >
        <Composer.Frame>
          <Composer.Attachments />
          <Composer.Input />
          <Composer.Footer>
            <Composer.Controls>
              <Composer.Attach />
              <span className="text-[11px] text-muted-foreground tabular-nums">
                {count}/{MAX_ATTACHMENTS}
              </span>
            </Composer.Controls>
            <Composer.SubmitSlot>
              <Composer.Submit onStop={NOOP} />
            </Composer.SubmitSlot>
          </Composer.Footer>
        </Composer.Frame>
      </Composer.Root>
      <LastSent message={sent} />
    </div>
  )
}

// -- 4. Controls payload inspector --------------------------------------------

type InspectorMode = "agent" | "plan"
type InspectorModel = "fast" | "max"

type InspectorControls = {
  readonly mode: InspectorMode
  readonly model: InspectorModel
}

type InspectorLogEntry = {
  readonly id: number
  readonly payload: string
}

const MODES: readonly InspectorMode[] = ["agent", "plan"]
const MODELS: readonly InspectorModel[] = ["fast", "max"]

function cycle<T>(items: readonly T[], current: T): T {
  const index = items.indexOf(current)
  return items[(index + 1) % items.length]
}

function ControlsInspectorPanel() {
  const [draft, setDraft] = React.useState("")
  const [controls, setControls] = React.useState<InspectorControls>({
    mode: "agent",
    model: "fast",
  })
  const [log, setLog] = React.useState<InspectorLogEntry[]>([])

  const handleSubmit = (submit: ComposerSubmit<InspectorControls>) => {
    const payload = JSON.stringify(
      {
        message: submit.message,
        controls: submit.controls,
        attachments: submit.attachments.map((attachment) => attachment.name),
      },
      null,
      2
    )
    setLog((current) => [{ id: Date.now(), payload }, ...current].slice(0, 3))
    // Controlled mode does not self-clear; the integrator owns the draft.
    setDraft("")
  }

  return (
    <div>
      <Composer.Root<InspectorControls>
        autoFocus={false}
        controls={controls}
        onChange={setDraft}
        onSubmit={handleSubmit}
        onStop={NOOP}
        placeholder="Controlled draft — controls ride into onSubmit"
        value={draft}
      >
        <Composer.Frame>
          <Composer.Input />
          <Composer.Footer>
            <Composer.Controls>
              <button
                type="button"
                data-compact-touch
                aria-label={`Mode: ${controls.mode}. Click to cycle.`}
                onClick={() =>
                  setControls((current) => ({
                    ...current,
                    mode: cycle(MODES, current.mode),
                  }))
                }
                className="rounded-lg focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <Badge variant="outline">{controls.mode}</Badge>
              </button>
              <button
                type="button"
                data-compact-touch
                aria-label={`Model: ${controls.model}. Click to cycle.`}
                onClick={() =>
                  setControls((current) => ({
                    ...current,
                    model: cycle(MODELS, current.model),
                  }))
                }
                className="rounded-lg focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <Badge variant="outline">{controls.model}</Badge>
              </button>
            </Composer.Controls>
            <Composer.SubmitSlot>
              <Composer.Submit onStop={NOOP} />
            </Composer.SubmitSlot>
          </Composer.Footer>
        </Composer.Frame>
      </Composer.Root>

      <div className="mt-3" aria-live="polite">
        <p className="section-label mb-2">Last dispatches</p>
        {log.length === 0 ? (
          <p className="text-[11px] text-muted-foreground">
            Nothing dispatched yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-2" role="list">
            {log.map((entry) => (
              <li key={entry.id}>
                <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/20 p-3 text-[11px] leading-4 text-muted-foreground">
                  {entry.payload}
                </pre>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// -- Page ----------------------------------------------------------------------

function CompoundComposerPlayground() {
  return (
    <div>
      <header className="mb-10">
        <h1 className="font-serif text-3xl font-light tracking-tight text-balance">
          Compound composer
        </h1>
        <p className="mt-2 max-w-prose text-sm leading-6 text-muted-foreground">
          Port of the eve-chat compound composer primitive (snapshot:{" "}
          <code className="text-xs">
            references/eve-chat/compound-composer/
          </code>
          ). Slot-based API, phase lifecycle, integrator-owned controls. Icons
          default to this repo&apos;s shadcn iconLibrary and are injectable via
          the <code className="text-xs">icons</code> prop.
        </p>
      </header>

      <PanelSection
        title="1 · Slot composition"
        description="Same Root, different slot fill. The primitive owns capture and lifecycle; everything else is integrator composition."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <BareComposer />
          <FullStackComposer />
        </div>
      </PanelSection>

      <PanelSection
        title="2 · Submit lifecycle"
        description="phase is the only lifecycle surface: idle → preparing → busy → idle, simulated with timers. Uncontrolled draft self-clears on submit; Stop aborts back to idle."
      >
        <LifecyclePanel />
      </PanelSection>

      <PanelSection
        title="3 · Attachments"
        description="File picker, drag-and-drop, and paste-image feed one list. The primitive owns preview URLs and hands raw Files to onSubmit; Attach disables at the max."
      >
        <AttachmentsPanel />
      </PanelSection>

      <PanelSection
        title="4 · Controls payload"
        description="controls is opaque to the primitive and typed by the integrator. Cycle the chips, send, and read the exact payload onSubmit received. Controlled draft — clearing is the integrator's job."
      >
        <ControlsInspectorPanel />
      </PanelSection>
    </div>
  )
}

export { CompoundComposerPlayground }
