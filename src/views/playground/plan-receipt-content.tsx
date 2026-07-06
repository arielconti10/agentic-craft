"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  RunTrace,
  type RunTraceEvent,
  type RunTraceStatus,
} from "@/components/ui/run-trace"
import { cn } from "@/lib/utils"
import { FIXTURE_ASK } from "@/views/playground/composer-dressing-data"
import {
  FIX_VARIANTS,
  RUN_PLAN,
  RUN_SCRIPT,
  type EscalationChoiceId,
  type RunStep,
} from "@/views/playground/run-surface-data"

const EXEC_MS = 700

type Phase = "plan" | "running" | "done"

type Current = { index: number; stage: "checkpoint" | "executing" } | null

function isCheckpoint(step: RunStep): boolean {
  return step.actionClass === "boundary"
}

function ClassificationChip({
  children,
  variant = "muted",
}: {
  children: React.ReactNode
  variant?: "muted" | "deviation" | "positive"
}) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-md border px-2 py-0.5 text-[11px] leading-4 font-medium",
        variant === "muted" &&
          "border-border/60 bg-muted/30 text-muted-foreground",
        variant === "deviation" &&
          "border-foreground/25 bg-background text-foreground",
        variant === "positive" && "border-border/60 bg-muted/20 text-foreground"
      )}
    >
      {children}
    </span>
  )
}

function EscalationCard({
  step,
  onChoose,
}: {
  step: RunStep
  onChoose: (choice: EscalationChoiceId) => void
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
    </div>
  )
}

function PlanCard({ onDispatch }: { onDispatch: () => void }) {
  return (
    <section
      aria-label="Run plan"
      className="animate-[route-expand_240ms_ease-out] rounded-lg border border-border bg-background"
    >
      <div className="border-b border-border/60 px-3 py-3 sm:px-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-medium text-foreground">Plan</h2>
          <span className="text-xs text-muted-foreground">Prospective</span>
        </div>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          The contract before dispatch — what will be touched, how, and when the
          run stops.
        </p>
      </div>

      <div className="border-b border-border/60 px-3 py-3 sm:px-4">
        <p className="text-[11px] font-medium text-muted-foreground">
          Approach
        </p>
        <ol className="mt-2 flex list-decimal flex-col gap-2 pl-4 text-sm leading-5 text-foreground">
          {RUN_PLAN.approach.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="border-b border-border/60 px-3 py-3 sm:px-4">
        <p className="text-[11px] font-medium text-muted-foreground">Scope</p>
        <ul className="mt-2 flex flex-col gap-2">
          {RUN_PLAN.scope.map((item) => (
            <li key={item.id}>
              <p className="font-mono text-xs leading-5 text-foreground">
                {item.label}
              </p>
              <p className="mt-0.5 text-xs leading-4 text-muted-foreground">
                {item.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-3 border-b border-border/60 px-3 py-3 sm:grid-cols-2 sm:px-4">
        <div>
          <p className="text-[11px] font-medium text-muted-foreground">
            Stopping condition
          </p>
          <p className="mt-1 text-sm leading-5 text-foreground">
            {RUN_PLAN.stopping}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-muted-foreground">
            Budget
          </p>
          <p className="mt-1 text-sm leading-5 text-foreground tabular-nums">
            {RUN_PLAN.budget}
          </p>
        </div>
      </div>

      <div className="px-3 py-3 sm:px-4">
        <p className="text-[11px] font-medium text-muted-foreground">
          Exclusions
        </p>
        <p className="mt-1 text-sm leading-5 text-foreground">
          {RUN_PLAN.exclusions.join(", ")}
        </p>
      </div>

      <div className="border-t border-border/60 px-3 py-3 sm:px-4">
        <Button type="button" size="sm" onClick={onDispatch}>
          Looks right — dispatch
        </Button>
        <p className="mt-2 text-[11px] leading-4 text-muted-foreground">
          Mirrors Cursor&apos;s plan mode: the contract as an editable artifact,
          not composer furniture.
        </p>
      </div>
    </section>
  )
}

function ReceiptDiffCard({
  escalationChoice,
  spend,
  onBackToPlan,
  onRunAgain,
}: {
  escalationChoice: EscalationChoiceId
  spend: number
  onBackToPlan: () => void
  onRunAgain: () => void
}) {
  const deviationCount = escalationChoice === "allow" ? 1 : 0
  const deliveredCount = RUN_PLAN.scope.length + deviationCount
  const asPlannedCount = RUN_PLAN.scope.length

  return (
    <section
      aria-label="Receipt diffed against plan"
      className="animate-[route-expand_240ms_ease-out] rounded-lg border border-border bg-background"
    >
      <div className="border-b border-border/60 px-3 py-3 sm:px-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-medium text-foreground">
            Receipt · diffed against plan
          </h2>
          <span className="text-xs text-muted-foreground">Retrospective</span>
        </div>
        <p className="mt-2 text-sm leading-5 text-foreground">
          {asPlannedCount} of {deliveredCount} delivered items as planned ·{" "}
          {deviationCount} deviation{deviationCount === 1 ? "" : "s"}, all
          traced to your decisions
        </p>
      </div>

      <div className="border-b border-border/60 px-3 py-3 sm:px-4">
        <p className="text-[11px] font-medium text-muted-foreground">Scope</p>
        <ul className="mt-2 flex flex-col gap-3">
          {RUN_PLAN.scope.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1"
            >
              <div className="min-w-0">
                <p className="font-mono text-xs leading-5 text-foreground">
                  {item.label}
                </p>
                <p className="mt-0.5 text-xs leading-4 text-muted-foreground">
                  {item.detail}
                </p>
              </div>
              <ClassificationChip variant="muted">
                as planned
              </ClassificationChip>
            </li>
          ))}
          {escalationChoice === "allow" ? (
            <li className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1 rounded-md border border-foreground/25 px-3 py-2">
              <div className="min-w-0">
                <p className="font-mono text-xs leading-5 text-foreground">
                  package.json · package-lock.json
                </p>
                <p className="mt-0.5 text-xs leading-4 text-muted-foreground">
                  You allowed one devDependency at the boundary escalation
                </p>
              </div>
              <ClassificationChip variant="deviation">
                deviation — escalation #1
              </ClassificationChip>
            </li>
          ) : (
            <li className="text-xs leading-4 text-muted-foreground">
              0 deviations — delivered scope matches planned scope
            </li>
          )}
        </ul>
      </div>

      <div className="border-b border-border/60 px-3 py-3 sm:px-4">
        <p className="text-[11px] font-medium text-muted-foreground">
          Stopping condition
        </p>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
          <div className="min-w-0">
            <p className="text-xs leading-4 text-muted-foreground">
              Planned: {RUN_PLAN.stopping}
            </p>
            <p className="mt-1 text-sm leading-5 text-foreground">
              npm test — 42 passed · 0 failed
            </p>
          </div>
          <ClassificationChip variant="positive">met</ClassificationChip>
        </div>
      </div>

      <div className="border-b border-border/60 px-3 py-3 sm:px-4">
        <p className="text-[11px] font-medium text-muted-foreground">Budget</p>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
          <div className="min-w-0">
            <p className="text-xs leading-4 text-muted-foreground">
              Planned: {RUN_PLAN.budget}
            </p>
            <p className="mt-1 text-sm leading-5 text-foreground tabular-nums">
              ${spend.toFixed(2)}
            </p>
          </div>
          <ClassificationChip variant="positive">under cap</ClassificationChip>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 px-3 py-3 sm:px-4">
        <Button type="button" size="sm" onClick={onRunAgain}>
          Run again
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onBackToPlan}
        >
          Back to plan
        </Button>
      </div>
    </section>
  )
}

function PlanReceiptLabContent() {
  const [phase, setPhase] = React.useState<Phase>("plan")
  const [current, setCurrent] = React.useState<Current>(null)
  const [completedIds, setCompletedIds] = React.useState<readonly string[]>([])
  const [escalationChoice, setEscalationChoice] =
    React.useState<EscalationChoiceId | null>(null)

  const stageFor = React.useCallback(
    (index: number): "checkpoint" | "executing" => {
      const step = RUN_SCRIPT[index]
      return isCheckpoint(step) ? "checkpoint" : "executing"
    },
    []
  )

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

  const reset = () => {
    setPhase("plan")
    setCurrent(null)
    setCompletedIds([])
    setEscalationChoice(null)
  }

  const dispatch = () => {
    setCompletedIds([])
    setEscalationChoice(null)
    setPhase("running")
    setCurrent({ index: 0, stage: stageFor(0) })
  }

  const choose = (choice: EscalationChoiceId) => {
    setEscalationChoice(choice)
    if (current) setCurrent({ index: current.index, stage: "executing" })
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

    const variant =
      step.id === "fix" && escalationChoice
        ? FIX_VARIANTS[escalationChoice]
        : null

    const seen = completedIds.includes(step.id) || current?.index === index

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
            ? isCheckpoint(step)
              ? "escalated to you"
              : "auto"
            : undefined,
      duration: completedIds.includes(step.id)
        ? `$${step.cost.toFixed(2)}`
        : undefined,
    }
  })

  const statusLine =
    phase === "plan"
      ? "Review the plan, then dispatch when it matches your intent."
      : phase === "running" && atCheckpoint
        ? `Paused at step ${(current?.index ?? 0) + 1} of ${RUN_SCRIPT.length} — boundary escalation.`
        : phase === "running"
          ? `Running step ${(current?.index ?? 0) + 1} of ${RUN_SCRIPT.length} — high autonomy.`
          : "Complete — receipt diffed against plan below."

  return (
    <article>
      <header className="mb-10">
        <p className="section-label mb-3">Playground · Lab</p>
        <h1 className="font-serif text-4xl leading-[1.15] font-light tracking-tight">
          Plan ↔ receipt
        </h1>
        <p className="mt-4 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          An agent run has two bookends with the same content model: the plan is
          the prospective account, the receipt the retrospective one. This lab
          diffs delivery against the plan — deviations are acceptable when
          traced to a human decision you approved.
        </p>
        <p className="mt-3 max-w-[640px] rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs leading-5 text-muted-foreground">
          Same fixture ask as the run-surface lab:{" "}
          <span className="text-foreground">{FIXTURE_ASK}</span>
        </p>
      </header>

      <section className="page-section">
        <p aria-live="polite" className="text-xs text-muted-foreground">
          {statusLine}
        </p>

        <div className="mt-6 flex flex-col gap-4">
          {phase === "plan" ? <PlanCard onDispatch={dispatch} /> : null}

          {phase === "running" ? (
            <>
              {atCheckpoint && currentStep?.escalation ? (
                <EscalationCard step={currentStep} onChoose={choose} />
              ) : null}
              <RunTrace
                title="Run trace"
                description="High autonomy — only the boundary escalation pauses; everything else auto-executes."
                events={traceEvents}
              />
            </>
          ) : null}

          {phase === "done" && escalationChoice ? (
            <ReceiptDiffCard
              escalationChoice={escalationChoice}
              spend={spend}
              onBackToPlan={reset}
              onRunAgain={dispatch}
            />
          ) : null}
        </div>
      </section>

      <div className="mt-8 rounded-lg border border-border/60 bg-muted/20 p-4 text-xs leading-5 text-muted-foreground">
        <p className="font-medium text-foreground">What to compare</p>
        <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-4">
          <li>
            The plan and receipt share one content model — scope, stopping
            condition, budget, exclusions — as bookends around the same run.
          </li>
          <li>
            Deviations are acceptable when traced to a human decision; the
            receipt proves the tracing, not just the delta.
          </li>
          <li>
            Try both escalation choices at the boundary and watch the receipt
            diff change — one extra file row vs zero deviations.
          </li>
          <li>
            A receipt without a plan can only list what happened; it can never
            reconcile delivery against intent.
          </li>
        </ul>
      </div>
    </article>
  )
}

export { PlanReceiptLabContent }
