"use client"

import * as React from "react"

import { ActionPreview } from "@/components/ui/action-preview"
import { Button } from "@/components/ui/button"
import {
  RunTrace,
  type RunTraceEvent,
  type RunTraceStatus,
} from "@/components/ui/run-trace"
import { UsageMeter } from "@/components/ui/usage-meter"
import { cn } from "@/lib/utils"
import { FIXTURE_ASK } from "@/views/playground/composer-dressing-data"
import {
  ACTION_CLASS_LABELS,
  CHECKPOINT_KIND_LABELS,
  countInFlightCheckpoints,
  FIX_VARIANTS,
  POLICY,
  POSTURES,
  RUN_SCRIPT,
  SPEND_CAP,
  type ActionClass,
  type EscalationChoiceId,
  type PostureId,
  type RunStep,
} from "@/views/playground/run-surface-data"

const EXEC_MS = 900

type Phase = "idle" | "running" | "stopped" | "done"

type Current = { index: number; stage: "checkpoint" | "executing" } | null

/* ── Posture switch ── */

function PostureSwitch({
  posture,
  onPostureChange,
}: {
  posture: PostureId
  onPostureChange: (posture: PostureId) => void
}) {
  return (
    <div
      role="group"
      aria-label="Autonomy posture"
      className="flex flex-wrap gap-1.5"
    >
      {POSTURES.map((option) => {
        const selected = option.id === posture
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onPostureChange(option.id)}
            className={cn(
              "rounded-md border px-2.5 py-1.5 text-xs transition-colors",
              selected
                ? "border-foreground/25 bg-muted text-foreground"
                : "border-border/60 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

/* ── Policy strip: the posture as an explicit checkpoint policy ── */

function PolicyStrip({ posture }: { posture: PostureId }) {
  return (
    <dl className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] leading-4">
      {(Object.keys(ACTION_CLASS_LABELS) as ActionClass[]).map(
        (actionClass) => {
          const kind = POLICY[posture][actionClass]
          return (
            <div key={actionClass} className="flex items-baseline gap-1.5">
              <dt className="text-muted-foreground">
                {ACTION_CLASS_LABELS[actionClass]}
              </dt>
              <dd
                className={cn(
                  "font-medium",
                  kind === "auto" ? "text-muted-foreground" : "text-foreground"
                )}
              >
                {CHECKPOINT_KIND_LABELS[kind]}
              </dd>
            </div>
          )
        }
      )}
    </dl>
  )
}

/* ── In-flight checkpoint cards ── */

function GateCard({
  step,
  onApprove,
  onStop,
}: {
  step: RunStep
  onApprove: () => void
  onStop: () => void
}) {
  const gate = step.gate
  if (!gate) return null
  return (
    <div className="animate-[route-expand_200ms_ease-out] rounded-lg border border-border bg-background">
      <ActionPreview
        title={gate.title}
        description={gate.description}
        items={gate.items}
        status="locked"
        className="border-l-0 bg-transparent"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" onClick={onApprove}>
            Approve
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onStop}>
            Stop run
          </Button>
        </div>
      </ActionPreview>
    </div>
  )
}

function EscalationCard({
  step,
  onChoose,
  onStop,
}: {
  step: RunStep
  onChoose: (choice: EscalationChoiceId) => void
  onStop: () => void
}) {
  const escalation = step.escalation
  if (!escalation) return null
  return (
    <div className="animate-[route-expand_200ms_ease-out] rounded-lg border border-foreground/25 bg-background px-3 py-3 sm:px-4">
      <p className="text-[11px] font-medium text-muted-foreground">
        Escalation — boundary in the ask
      </p>
      <p className="mt-2 text-sm leading-5 font-medium text-foreground">
        {escalation.question}
      </p>
      <p className="mt-2 text-sm leading-5 text-muted-foreground">
        {escalation.detail}
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {escalation.choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            onClick={() => onChoose(choice.id)}
            className="rounded-lg border border-border/60 px-3 py-2.5 text-left transition-colors hover:bg-muted/40"
          >
            <span className="block text-sm font-medium text-foreground">
              {choice.label}
            </span>
            <span className="mt-0.5 block text-[11px] leading-4 text-muted-foreground">
              {choice.consequence}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-3">
        <Button type="button" variant="ghost" size="sm" onClick={onStop}>
          Stop run
        </Button>
      </div>
    </div>
  )
}

/* ── The receipt: the run's account of itself ── */

function ReceiptSection({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="border-t border-border/60 px-3 py-3 sm:px-4">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  )
}

function RunReceipt({
  phase,
  posture,
  stoppedAt,
  escalationChoice,
  spend,
  completedIds,
}: {
  phase: Phase
  posture: PostureId
  stoppedAt: number | null
  escalationChoice: EscalationChoiceId | null
  spend: number
  completedIds: readonly string[]
}) {
  const stopped = phase === "stopped"

  const editSteps = RUN_SCRIPT.filter(
    (step) => step.actionClass === "edit" && completedIds.includes(step.id)
  )
  const unreviewedEdits = editSteps.filter(
    (step) => POLICY[posture][step.actionClass] === "auto"
  )
  const inFlightDecisions = RUN_SCRIPT.filter(
    (step) =>
      completedIds.includes(step.id) &&
      POLICY[posture][step.actionClass] !== "auto"
  ).length

  const filesTouched = [
    completedIds.includes("edit-page") && "src/pages/session-chat-page.tsx",
    completedIds.includes("edit-adapter") && "src/lib/composer-adapter.ts",
    completedIds.includes("fix") && "src/pages/session-chat-page.test.tsx",
    completedIds.includes("fix") &&
      escalationChoice === "allow" &&
      "package.json · package-lock.json",
  ].filter((file): file is string => Boolean(file))

  return (
    <section
      aria-label="Run receipt"
      className="animate-[route-expand_240ms_ease-out] rounded-lg border border-border bg-background"
    >
      <div className="px-3 py-3 sm:px-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-sm font-medium text-foreground">
            {stopped ? "Run stopped" : "Run complete"}
          </h3>
          <span className="text-xs text-muted-foreground">Receipt</span>
        </div>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {stopped
            ? `Stopped by you at step ${(stoppedAt ?? 0) + 1} of ${RUN_SCRIPT.length}. Completed work is preserved; nothing was pushed.`
            : "Stopping condition met — the ask said stop when tests pass."}
        </p>
      </div>

      {!stopped ? (
        <ReceiptSection label="Evidence">
          <p className="text-sm leading-5 text-foreground">
            npm test — 42 passed · 0 failed
          </p>
          <p className="mt-1 text-xs leading-4 text-muted-foreground">
            Second run, after the boundary fix. First run had 2 failures.
          </p>
        </ReceiptSection>
      ) : null}

      <ReceiptSection label="Scope touched">
        {filesTouched.length > 0 ? (
          <ul className="flex flex-col gap-1 font-mono text-xs leading-5 text-foreground">
            {filesTouched.map((file) => (
              <li key={file}>{file}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm leading-5 text-muted-foreground">
            No files were changed.
          </p>
        )}
        {completedIds.includes("boundary") ? (
          <p className="mt-2 text-xs leading-4 text-muted-foreground">
            Boundary honored: the ask excluded deps —{" "}
            {escalationChoice === "allow"
              ? "you allowed one devDependency at the escalation."
              : "worked around it without touching deps, per your choice."}
          </p>
        ) : null}
      </ReceiptSection>

      <ReceiptSection label="Spend">
        <p className="text-sm leading-5 text-foreground tabular-nums">
          ${spend.toFixed(2)} of ${SPEND_CAP.toFixed(2)} cap
        </p>
      </ReceiptSection>

      <ReceiptSection label="Checkpoint ledger">
        <p className="text-sm leading-5 text-foreground">
          {inFlightDecisions} decision{inFlightDecisions === 1 ? "" : "s"} made
          in-flight · {unreviewedEdits.length} edit
          {unreviewedEdits.length === 1 ? "" : "s"} applied without review
        </p>
        {unreviewedEdits.length > 0 ? (
          <ul className="mt-2 flex flex-col gap-1.5">
            {unreviewedEdits.map((step) => (
              <li
                key={step.id}
                className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-xs leading-4"
              >
                <span className="text-foreground">
                  {step.id === "fix" && escalationChoice
                    ? FIX_VARIANTS[escalationChoice].title
                    : step.title}
                </span>
                <span className="text-muted-foreground">review pending</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-xs leading-4 text-muted-foreground">
            Nothing left to review — every edit was approved before it applied.
          </p>
        )}
      </ReceiptSection>
    </section>
  )
}

/* ── Lab root ── */

function RunSurfaceLabContent() {
  const [posture, setPosture] = React.useState<PostureId>("asks-first")
  const [phase, setPhase] = React.useState<Phase>("idle")
  const [current, setCurrent] = React.useState<Current>(null)
  const [completedIds, setCompletedIds] = React.useState<readonly string[]>([])
  const [stoppedAt, setStoppedAt] = React.useState<number | null>(null)
  const [escalationChoice, setEscalationChoice] =
    React.useState<EscalationChoiceId | null>(null)

  const stageFor = React.useCallback(
    (index: number): "checkpoint" | "executing" => {
      const step = RUN_SCRIPT[index]
      return POLICY[posture][step.actionClass] === "auto"
        ? "executing"
        : "checkpoint"
    },
    [posture]
  )

  /* Drives the simulated run: while a step is executing, complete it after
     EXEC_MS and advance to the next step or finish. Checkpoints pause the
     chain until the user acts. (Timer = external system; effect justified.) */
  React.useEffect(() => {
    if (phase !== "running" || !current || current.stage !== "executing") return
    const timer = setTimeout(() => {
      const step = RUN_SCRIPT[current.index]
      setCompletedIds((ids) => [...ids, step.id])
      const nextIndex = current.index + 1
      if (nextIndex >= RUN_SCRIPT.length) {
        setPhase("done")
        setCurrent(null)
      } else {
        setCurrent({ index: nextIndex, stage: stageFor(nextIndex) })
      }
    }, EXEC_MS)
    return () => clearTimeout(timer)
  }, [phase, current, stageFor])

  const reset = (nextPosture?: PostureId) => {
    if (nextPosture) setPosture(nextPosture)
    setPhase("idle")
    setCurrent(null)
    setCompletedIds([])
    setStoppedAt(null)
    setEscalationChoice(null)
  }

  const start = () => {
    setCompletedIds([])
    setStoppedAt(null)
    setEscalationChoice(null)
    setPhase("running")
    setCurrent({ index: 0, stage: stageFor(0) })
  }

  const stop = () => {
    setStoppedAt(current?.index ?? null)
    setPhase("stopped")
    setCurrent(null)
  }

  const approve = () => {
    if (current) setCurrent({ index: current.index, stage: "executing" })
  }

  const choose = (choice: EscalationChoiceId) => {
    setEscalationChoice(choice)
    approve()
  }

  const spend = RUN_SCRIPT.filter((step) =>
    completedIds.includes(step.id)
  ).reduce((sum, step) => sum + step.cost, 0)

  const currentStep = current ? RUN_SCRIPT[current.index] : null
  const atCheckpoint = current?.stage === "checkpoint"

  const traceEvents: RunTraceEvent[] = RUN_SCRIPT.map((step, index) => {
    let status: RunTraceStatus = "queued"
    if (completedIds.includes(step.id)) {
      status = step.result === "warning" ? "warning" : "complete"
    } else if (current?.index === index) {
      status = current.stage === "checkpoint" ? "blocked" : "running"
    }

    const kind = POLICY[posture][step.actionClass]
    const seen = completedIds.includes(step.id) || current?.index === index
    const variant =
      step.id === "fix" && escalationChoice
        ? FIX_VARIANTS[escalationChoice]
        : null

    return {
      id: step.id,
      title: variant?.title ?? step.title,
      description:
        status === "queued"
          ? undefined
          : (step.resultNote ?? variant?.description ?? step.description),
      status,
      source:
        status === "blocked"
          ? "waiting on you"
          : seen
            ? kind === "auto"
              ? "auto"
              : kind === "escalate"
                ? "escalated to you"
                : "approved by you"
            : undefined,
      duration: completedIds.includes(step.id)
        ? `$${step.cost.toFixed(2)}`
        : undefined,
    }
  })

  const inFlightCount = countInFlightCheckpoints(posture)
  const activePosture = POSTURES.find((option) => option.id === posture)

  const statusLine =
    phase === "idle"
      ? "Idle — dispatch the run to start."
      : phase === "running" && atCheckpoint
        ? `Paused at step ${(current?.index ?? 0) + 1} of ${RUN_SCRIPT.length} — waiting on you.`
        : phase === "running"
          ? `Running step ${(current?.index ?? 0) + 1} of ${RUN_SCRIPT.length}.`
          : phase === "stopped"
            ? "Stopped by you."
            : "Complete — receipt below."

  return (
    <article>
      <header className="mb-10">
        <p className="section-label mb-3">Playground · Lab</p>
        <h1 className="font-serif text-4xl leading-[1.15] font-light tracking-tight">
          The run surface
        </h1>
        <p className="mt-4 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          An autonomy posture is a policy for where the human checkpoint goes,
          not how much oversight exists. Same nine-step run, three postures:
          watch the checkpoints relocate from in-flight approvals to the
          post-run receipt — never disappear.
        </p>
        <p className="mt-3 max-w-[640px] rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs leading-5 text-muted-foreground">
          Continues the composer-dressing verdict: the composer stayed bare, so
          the constraints in the ask are honored here instead. The fixture ask
          is the same one:{" "}
          <span className="text-foreground">{FIXTURE_ASK}</span>
        </p>
      </header>

      <section className="page-section">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PostureSwitch
            posture={posture}
            onPostureChange={(next) => reset(next)}
          />
          <p className="text-xs text-muted-foreground tabular-nums">
            {inFlightCount} in-flight checkpoint{inFlightCount === 1 ? "" : "s"}{" "}
            under this posture
          </p>
        </div>
        {activePosture ? (
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {activePosture.tagline}
          </p>
        ) : null}
        <div className="mt-3">
          <PolicyStrip posture={posture} />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {phase === "idle" ? (
            <Button type="button" size="sm" onClick={start}>
              Dispatch run
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => reset()}
            >
              Reset
            </Button>
          )}
          {phase === "running" && !atCheckpoint ? (
            <Button type="button" variant="ghost" size="sm" onClick={stop}>
              Stop run
            </Button>
          ) : null}
          <p aria-live="polite" className="text-xs text-muted-foreground">
            {statusLine}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {atCheckpoint && currentStep?.escalation ? (
            <EscalationCard
              step={currentStep}
              onChoose={choose}
              onStop={stop}
            />
          ) : atCheckpoint && currentStep?.gate ? (
            <GateCard step={currentStep} onApprove={approve} onStop={stop} />
          ) : null}

          <RunTrace
            title="Run trace"
            description="Costs accrue per step; the source column records who decided."
            events={traceEvents}
          />

          <UsageMeter
            title="Spend"
            description="The cap is binding — the harness enforces it, the ask merely stated it."
            items={[
              {
                id: "spend",
                label: "This run",
                value: Math.min(100, (spend / SPEND_CAP) * 100),
                valueLabel: `$${spend.toFixed(2)}`,
                limitLabel: `$${SPEND_CAP.toFixed(2)} cap`,
              },
            ]}
          />

          {phase === "done" || phase === "stopped" ? (
            <RunReceipt
              phase={phase}
              posture={posture}
              stoppedAt={stoppedAt}
              escalationChoice={escalationChoice}
              spend={spend}
              completedIds={completedIds}
            />
          ) : null}
        </div>
      </section>

      <div className="mt-8 rounded-lg border border-border/60 bg-muted/20 p-4 text-xs leading-5 text-muted-foreground">
        <p className="font-medium text-foreground">What to compare</p>
        <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-4">
          <li>
            Run it at all three postures. Count your interruptions, then read
            the receipt&apos;s checkpoint ledger — the total accountability is
            conserved; only its location moves.
          </li>
          <li>
            The boundary escalation fires at every posture: &quot;don&apos;t
            touch deps&quot; is the user&apos;s line, and no autonomy grant
            crosses it silently. Risk is orthogonal to autonomy.
          </li>
          <li>
            The push gate also fires at every posture — external side effects
            are the other invariant interrupt.
          </li>
          <li>
            Stop the run mid-flight: the receipt still renders, partial. A
            receipt you only get on success is a trophy, not an account.
          </li>
          <li>
            At &quot;On its own&quot; the receipt carries the whole burden —
            evidence, scope, spend, review queue. This is why high autonomy with
            a weak receipt is the worst feeling in the genre.
          </li>
        </ul>
      </div>
    </article>
  )
}

export { RunSurfaceLabContent }
