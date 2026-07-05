"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Task01Icon, AlertCircleIcon } from "@hugeicons/core-free-icons"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Composer,
  ComposerCard,
  ComposerInput,
  ComposerToolbar,
  ComposerSend,
  ComposerIslands,
  ComposerPlan,
  ComposerDoneWhen,
  ComposerReceipt,
  type ComposerTask,
} from "@/components/ui/composer"
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
  type AutonomyPosture,
  type ExecutionPosture,
} from "@/views/patterns/dispatch-moment-data"

const PLAN_TASKS: ComposerTask[] = [
  {
    label: "Map session-chat-page imports against the shared adapter surface",
    done: false,
  },
  {
    label: "Move route wiring without touching dependency manifests",
    done: false,
  },
  {
    label: "Run test/auth until green; stop if spend exceeds $5",
    done: false,
    dimmed: true,
  },
]

function DispatchMomentDemo() {
  const [draft, setDraft] = React.useState("")
  const [postureIndex, setPostureIndex] = React.useState(0)
  const [gateOpen, setGateOpen] = React.useState(false)
  const [selectedPosture, setSelectedPosture] =
    React.useState<ExecutionPosture>("auto-review")
  const [lastDispatch, setLastDispatch] = React.useState<{
    prompt: string
    posture: ExecutionPosture
    autonomy: AutonomyPosture
  } | null>(null)

  const parsed = React.useMemo(() => parseDispatchPrompt(draft), [draft])
  const verificationGaps = React.useMemo(
    () => evaluateDefensibility(parsed, draft),
    [parsed, draft]
  )
  const missingVerification = verificationGaps.filter((gap) => !gap.met)
  const autonomy = AUTONOMY_POSTURES[postureIndex]
  const canSend = draft.trim().length > 0

  const receiptLine = React.useMemo(() => {
    if (!draft.trim()) return null
    const parts = [
      parsed.summary,
      autonomy.label.toLowerCase(),
      parsed.doneWhen.length > 0
        ? `done when ${parsed.doneWhen.map((item) => item.label).join(", ")}`
        : "no stop condition yet",
    ]
    return parts.join(" · ")
  }, [autonomy.label, draft, parsed.doneWhen, parsed.summary])

  const handleRequestSend = React.useCallback(
    (sentValue: string) => {
      setLastDispatch({
        prompt: sentValue.trim(),
        posture: selectedPosture,
        autonomy,
      })
    },
    [autonomy, selectedPosture]
  )

  const handleBeforeSend = React.useCallback((sentValue: string) => {
    if (parseDispatchPrompt(sentValue).needsPlanGate) {
      setGateOpen(true)
      return false
    }
    return true
  }, [])

  const handleApprovePlan = () => {
    handleRequestSend(draft.trim())
    setDraft("")
    setGateOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setDraft(FIXTURE_PROMPT)}
        >
          Load fixture ask
        </Button>
        <p className="text-xs text-muted-foreground">
          Try the migration fixture, then send to see the plan→execute gate.
        </p>
      </div>

      {lastDispatch && (
        <div
          className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs leading-5 text-muted-foreground"
          aria-live="polite"
        >
          <span className="font-medium text-foreground">Dispatched: </span>
          {lastDispatch.prompt.slice(0, 80)}
          {lastDispatch.prompt.length > 80 ? "…" : ""} —{" "}
          {lastDispatch.autonomy.label} ·{" "}
          {
            EXECUTION_OPTIONS.find(
              (option) => option.id === lastDispatch.posture
            )?.label
          }
        </div>
      )}

      <Composer
        value={draft}
        onValueChange={setDraft}
        canSend={canSend}
        beforeSend={handleBeforeSend}
        onSend={handleRequestSend}
      >
        <ComposerIslands>
          {parsed.needsPlanGate && draft.trim().length > 0 && (
            <ComposerPlan tasks={PLAN_TASKS} defaultExpanded={false} />
          )}
          {parsed.doneWhen.length > 0 && (
            <ComposerDoneWhen items={parsed.doneWhen} />
          )}
          {draft.trim().length > 0 && parsed.doneWhen.length === 0 && (
            <ComposerDoneWhen
              items={[
                {
                  id: "missing",
                  label: "Add how you'll know it's done",
                  tone: "warning",
                },
              ]}
            />
          )}
        </ComposerIslands>

        <ComposerCard>
          {receiptLine && <ComposerReceipt>{receiptLine}</ComposerReceipt>}
          <ComposerInput placeholder="Describe the task — include how you'll know it's done…" />
          <ComposerToolbar>
            <button
              type="button"
              data-compact-touch
              aria-label={`Autonomy posture: ${autonomy.label}. Click to cycle.`}
              onClick={() =>
                setPostureIndex(
                  (index) => (index + 1) % AUTONOMY_POSTURES.length
                )
              }
              className="rounded-lg focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <Badge variant="outline">{autonomy.label}</Badge>
            </button>
            <p className="hidden min-w-0 flex-1 truncate text-[11px] text-muted-foreground sm:block">
              {autonomy.description}
            </p>
            <ComposerSend />
          </ComposerToolbar>
        </ComposerCard>
      </Composer>

      {draft.trim().length > 0 && missingVerification.length > 0 && (
        <div className="rounded-lg border border-[color-mix(in_oklch,var(--status-warn)_35%,var(--border))] bg-[color-mix(in_oklch,var(--status-warn)_6%,transparent)] px-3 py-2.5">
          <div className="flex items-start gap-2">
            <HugeiconsIcon
              icon={AlertCircleIcon}
              size={14}
              className="mt-0.5 shrink-0 text-[var(--status-warn)]"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground">
                Verification gap — this posture may not be defensible yet
              </p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5" role="list">
                {verificationGaps.map((gap) => (
                  <li key={gap.id}>
                    <Badge
                      variant={gap.met ? "secondary" : "outline"}
                      className={
                        gap.met
                          ? "text-muted-foreground"
                          : "border-[color-mix(in_oklch,var(--status-warn)_40%,var(--border))]"
                      }
                    >
                      {gap.met ? "✓" : "—"} {gap.label}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <HumanGate.Root open={gateOpen} onOpenChange={setGateOpen}>
        <HumanGateContent className="sm:max-w-xl">
          <HumanGateHeader>
            <HumanGateTitle>Plan ready — pick execution posture</HumanGateTitle>
            <HumanGateDescription>
              Review the approach, then choose how much autonomy this run gets
              after approval. Inspired by Claude Code&apos;s plan approval
              dialog.
            </HumanGateDescription>
          </HumanGateHeader>
          <HumanGateBody>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <HugeiconsIcon icon={Task01Icon} size={13} aria-hidden="true" />
                <span className="font-medium text-foreground">Draft plan</span>
              </div>
              <ol className="mt-2 grid gap-1 pl-4 text-xs leading-5 text-muted-foreground">
                {PLAN_TASKS.map((task) => (
                  <li key={task.label} className="list-decimal">
                    {task.label}
                  </li>
                ))}
              </ol>
            </div>

            <fieldset className="grid gap-2">
              <legend className="text-xs font-medium text-foreground">
                After approval
              </legend>
              {EXECUTION_OPTIONS.map((option) => {
                const selected = selectedPosture === option.id
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
                      name="execution-posture"
                      value={option.id}
                      checked={selected}
                      onChange={() => setSelectedPosture(option.id)}
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
              {selectedPosture === "keep-planning"
                ? "Return to planning"
                : "Approve plan"}
            </HumanGateConfirm>
          </HumanGateFooter>
        </HumanGateContent>
      </HumanGate.Root>
    </div>
  )
}

export { DispatchMomentDemo }
