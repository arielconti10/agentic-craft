"use client"

import * as React from "react"

import {
  Composer,
  type ComposerSubmit,
} from "@/components/playground/compound-composer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  HumanGate,
  HumanGateBody,
  HumanGateCancel,
  HumanGateConfirm,
  HumanGateContent,
  HumanGateDescription,
  HumanGateFooter,
  HumanGateHeader,
  HumanGateTitle,
} from "@/components/ui/human-gate"
import { cn } from "@/lib/utils"
import {
  AUTONOMY_POSTURES,
  EXECUTION_OPTIONS,
  FIXTURE_PROMPT,
  evaluateDefensibility,
  parseDispatchPrompt,
  type ExecutionPosture,
} from "@/views/patterns/dispatch-moment-data"

// ---------------------------------------------------------------------------
// Dispatch-moment lab (B+C on the compound composer)
//
// The same B+C ideas the registry-composer sketch defends on
// /patterns/dispatch-moment, rebuilt as integrator-side slot fills on the
// compound API. The primitive is untouched: the defensibility strip rides in
// Composer.Before, the posture badge is a Composer.Controls chip, and the
// plan→execute gate intercepts onSubmit.
//
// Comparison note vs the registry composer: the registry composer exposes
// `beforeSend` for interception; the compound primitive does not, so the gate
// intercepts in `onSubmit`. With a controlled draft that works cleanly (the
// integrator owns clearing) — but with attachments enabled the primitive has
// already handed files over and revoked previews by onSubmit, so a real
// integration would gate earlier or re-own attachment state.
// ---------------------------------------------------------------------------

const PLAN_STEPS = [
  "Map session-chat-page imports against the shared adapter surface",
  "Move route wiring without touching dependency manifests",
  "Run test/auth until green; stop if spend exceeds $5",
] as const

type Dispatch = {
  readonly prompt: string
  readonly postureLabel: string
  readonly execution: ExecutionPosture
}

function DispatchMomentLabPanel() {
  const [draft, setDraft] = React.useState("")
  const [postureIndex, setPostureIndex] = React.useState(0)
  const [gateOpen, setGateOpen] = React.useState(false)
  const [pendingPrompt, setPendingPrompt] = React.useState<string | null>(null)
  const [execution, setExecution] =
    React.useState<ExecutionPosture>("auto-review")
  const [lastDispatch, setLastDispatch] = React.useState<Dispatch | null>(null)

  const posture = AUTONOMY_POSTURES[postureIndex]
  const parsed = React.useMemo(() => parseDispatchPrompt(draft), [draft])
  const gaps = React.useMemo(
    () => evaluateDefensibility(parsed, draft),
    [parsed, draft]
  )
  const openGaps = gaps.filter((gap) => !gap.met)
  const showStrip = draft.trim().length > 0

  const dispatch = React.useCallback(
    (prompt: string, chosenExecution: ExecutionPosture) => {
      setLastDispatch({
        prompt,
        postureLabel: posture.label,
        execution: chosenExecution,
      })
      setDraft("")
    },
    [posture.label]
  )

  // Plan→execute gate: the compound primitive has no beforeSend, so the
  // integrator intercepts in onSubmit and defers clearing until approval.
  const handleSubmit = ({ message }: ComposerSubmit<unknown>) => {
    if (parseDispatchPrompt(message).needsPlanGate) {
      setPendingPrompt(message)
      setGateOpen(true)
      return
    }
    dispatch(message, execution)
  }

  const handleApprovePlan = () => {
    if (pendingPrompt) {
      dispatch(pendingPrompt, execution)
    }
    setPendingPrompt(null)
    setGateOpen(false)
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setDraft(FIXTURE_PROMPT)}
        >
          Load fixture ask
        </Button>
        <p className="text-xs text-muted-foreground">
          Watch the gaps close as the ask names stop, scope, and budget.
        </p>
      </div>

      {lastDispatch && (
        <div
          className="mb-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs leading-5 text-muted-foreground"
          aria-live="polite"
        >
          <span className="font-medium text-foreground">Dispatched: </span>
          {lastDispatch.prompt.slice(0, 80)}
          {lastDispatch.prompt.length > 80 ? "…" : ""} —{" "}
          {lastDispatch.postureLabel} ·{" "}
          {
            EXECUTION_OPTIONS.find(
              (option) => option.id === lastDispatch.execution
            )?.label
          }
        </div>
      )}

      <Composer.Root
        autoFocus={false}
        onChange={setDraft}
        onSubmit={handleSubmit}
        onStop={() => {}}
        placeholder="Describe the task — include how you'll know it's done…"
        value={draft}
      >
        <Composer.Frame>
          {showStrip && (
            <Composer.Before>
              <div aria-live="polite">
                <p className="text-[11px] font-medium text-foreground">
                  {openGaps.length > 0
                    ? `Verification gap — "${posture.label}" may not be defensible yet`
                    : `Defensible — the ask covers all five checks for "${posture.label}"`}
                </p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5" role="list">
                  {gaps.map((gap) => (
                    <li key={gap.id}>
                      <Badge
                        variant={gap.met ? "secondary" : "outline"}
                        className={
                          gap.met
                            ? "text-muted-foreground"
                            : "border-[color-mix(in_oklch,var(--status-warn)_40%,var(--border))]"
                        }
                        title={gap.met ? undefined : gap.hint}
                      >
                        {gap.met ? "✓" : "—"} {gap.label}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </Composer.Before>
          )}
          <Composer.Input />
          <Composer.Footer>
            <Composer.Controls>
              <button
                type="button"
                data-compact-touch
                aria-label={`Autonomy posture: ${posture.label}. Click to cycle.`}
                onClick={() =>
                  setPostureIndex(
                    (index) => (index + 1) % AUTONOMY_POSTURES.length
                  )
                }
                className="rounded-lg focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <Badge variant="outline">{posture.label}</Badge>
              </button>
              <p className="hidden min-w-0 flex-1 truncate text-[11px] text-muted-foreground sm:block">
                {posture.description}
              </p>
            </Composer.Controls>
            <Composer.SubmitSlot>
              <Composer.Submit onStop={() => {}} />
            </Composer.SubmitSlot>
          </Composer.Footer>
        </Composer.Frame>
      </Composer.Root>

      <HumanGate.Root open={gateOpen} onOpenChange={setGateOpen}>
        <HumanGateContent className="sm:max-w-xl">
          <HumanGateHeader>
            <HumanGateTitle>Plan ready — pick execution posture</HumanGateTitle>
            <HumanGateDescription>
              Review the approach, then choose how much autonomy this run gets
              after approval.
            </HumanGateDescription>
          </HumanGateHeader>
          <HumanGateBody>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
              <p className="text-xs font-medium text-foreground">Draft plan</p>
              <ol className="mt-2 grid gap-1 pl-4 text-xs leading-5 text-muted-foreground">
                {PLAN_STEPS.map((step) => (
                  <li key={step} className="list-decimal">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <fieldset className="grid gap-2">
              <legend className="text-xs font-medium text-foreground">
                After approval
              </legend>
              {EXECUTION_OPTIONS.map((option) => {
                const selected = execution === option.id
                return (
                  <label
                    key={option.id}
                    className={cn(
                      "flex cursor-pointer gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                      selected
                        ? "border-foreground/25 bg-background ring-1 ring-border"
                        : "border-border/60 hover:bg-muted/30"
                    )}
                  >
                    <input
                      type="radio"
                      name="lab-execution-posture"
                      value={option.id}
                      checked={selected}
                      onChange={() => setExecution(option.id)}
                      className="mt-0.5"
                    />
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground">
                        {option.label}
                        {option.recommended && (
                          <Badge variant="secondary" className="text-[10px]">
                            Suggested
                          </Badge>
                        )}
                      </span>
                      <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                        {option.description}
                      </span>
                    </span>
                  </label>
                )
              })}
            </fieldset>
          </HumanGateBody>
          <HumanGateFooter>
            <HumanGateCancel>Cancel</HumanGateCancel>
            <HumanGateConfirm onClick={handleApprovePlan}>
              {execution === "keep-planning"
                ? "Return to planning"
                : "Approve plan"}
            </HumanGateConfirm>
          </HumanGateFooter>
        </HumanGateContent>
      </HumanGate.Root>
    </div>
  )
}

export { DispatchMomentLabPanel }
