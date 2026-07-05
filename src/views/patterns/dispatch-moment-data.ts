import type { ComposerDoneWhenItem } from "@/components/ui/composer"

// ---------------------------------------------------------------------------
// Canonical B+C dispatch-moment vocabulary.
//
// Ratified 2026-07-05 — see sessions/2026-07-03-eve-chat-composer-autonomy.md
// and docs/research.md §4.5. Single source of truth for the posture badge
// labels and the pre-Send defensibility checklist. Consumed by
// DispatchMomentDemo, the /patterns/dispatch-moment page, and the
// compound-composer playground.
// ---------------------------------------------------------------------------

const FIXTURE_PROMPT =
  "Migrate session-chat-page to the shared adapter — don't touch deps, stop when tests pass, keep it under $5"

type AutonomyPostureId = "asks-first" | "edits-freely" | "on-its-own"

type AutonomyPosture = {
  id: AutonomyPostureId
  label: string
  description: string
}

/**
 * Behavioral posture badge vocabulary. Levels (L0–L5) stay analysis
 * vocabulary; at Send the user sees behavior, not a number.
 */
const AUTONOMY_POSTURES: readonly AutonomyPosture[] = [
  {
    id: "asks-first",
    label: "Asks first",
    description: "Pauses before edits and external actions.",
  },
  {
    id: "edits-freely",
    label: "Edits freely",
    description: "Applies file edits without per-step approval.",
  },
  {
    id: "on-its-own",
    label: "On its own",
    description: "Runs until done or a gate fires.",
  },
] as const

type DefensibilityGapId = "stopping" | "proof" | "scope" | "budget" | "risk"

type DefensibilityGapDefinition = {
  id: DefensibilityGapId
  label: string
  /** What closes the gap — surfaced as guidance when the gap is open. */
  hint: string
}

/**
 * The five pre-Send defensibility gaps. A posture is defensible for a task
 * when the ask closes these; open gaps are surfaced before Send, not after
 * failure.
 */
const DEFENSIBILITY_GAPS: readonly DefensibilityGapDefinition[] = [
  {
    id: "stopping",
    label: "Stopping condition",
    hint: "Say when the agent should stop.",
  },
  {
    id: "proof",
    label: "Verification method",
    hint: "Name the proof — tests green, CI pass, a check that closes the task.",
  },
  {
    id: "scope",
    label: "Scope boundary",
    hint: "Mark what is out of bounds.",
  },
  {
    id: "budget",
    label: "Spend cap",
    hint: "Cap cost or time before the run starts.",
  },
  {
    id: "risk",
    label: "Risky actions",
    hint: "Constrain deploys, deletes, sends, and other hard-to-undo actions.",
  },
] as const

type ParsedDispatch = {
  summary: string
  doneWhen: ComposerDoneWhenItem[]
  exclusions: string[]
  budget?: string
  needsPlanGate: boolean
}

/**
 * Fixture-grade parse of a dispatch ask. Heuristics are intentionally simple:
 * good enough to drive the specimen and the playground fixtures, not a real
 * intent parser.
 */
function parseDispatchPrompt(text: string): ParsedDispatch {
  const trimmed = text.trim()
  const lower = trimmed.toLowerCase()

  const doneWhen: ComposerDoneWhenItem[] = []
  const exclusions: string[] = []
  let budget: string | undefined

  const stopMatch = lower.match(
    /(?:stop|done)\s+when\s+([^—–.;]+(?:pass|green|complete)[^—–.;]*)/i
  )
  if (stopMatch) {
    doneWhen.push({
      id: "stop",
      label: stopMatch[1].trim(),
    })
  }

  const budgetMatch = trimmed.match(
    /(?:under|below|keep\s+it\s+under)\s+\$?\d+/i
  )
  if (budgetMatch) {
    budget = budgetMatch[0].replace(/^keep it /i, "")
    doneWhen.push({ id: "budget", label: budget })
  }

  const dontTouchMatch = trimmed.match(/don't touch\s+([^—–.;]+)/i)
  if (dontTouchMatch) {
    exclusions.push(dontTouchMatch[1].trim())
    doneWhen.push({
      id: "exclude",
      label: `${dontTouchMatch[1].trim()} locked`,
    })
  }

  const summary =
    trimmed.length > 72 ? `${trimmed.slice(0, 69).trim()}…` : trimmed || "…"

  const needsPlanGate =
    /migrate|refactor|implement|across|shared adapter/i.test(trimmed) &&
    trimmed.length > 40

  return {
    summary,
    doneWhen,
    exclusions,
    budget,
    needsPlanGate,
  }
}

const RISKY_ACTION_PATTERN =
  /migrat|deploy|delete|drop|push|publish|prod|send|email/i

type DefensibilityGapStatus = DefensibilityGapDefinition & {
  met: boolean
}

/**
 * Evaluate the five defensibility gaps against a parsed ask. The risk gap is
 * met when the ask names no hard-to-undo action, or names one and also sets a
 * boundary (scope or stopping condition) around it.
 */
function evaluateDefensibility(
  parsed: ParsedDispatch,
  fullText: string
): DefensibilityGapStatus[] {
  const hasStop = parsed.doneWhen.some((item) => item.id === "stop")
  const hasBudget = Boolean(parsed.budget)
  const hasScope = parsed.exclusions.length > 0
  const namesRiskyAction = RISKY_ACTION_PATTERN.test(fullText)

  const met: Record<DefensibilityGapId, boolean> = {
    stopping: hasStop,
    proof: hasStop && /test|check|pass|green|ci/i.test(fullText),
    scope: hasScope,
    budget: hasBudget,
    risk: !namesRiskyAction || hasScope || hasStop,
  }

  return DEFENSIBILITY_GAPS.map((gap) => ({ ...gap, met: met[gap.id] }))
}

export {
  AUTONOMY_POSTURES,
  DEFENSIBILITY_GAPS,
  FIXTURE_PROMPT,
  evaluateDefensibility,
  parseDispatchPrompt,
  type AutonomyPosture,
  type AutonomyPostureId,
  type DefensibilityGapDefinition,
  type DefensibilityGapId,
  type DefensibilityGapStatus,
  type ParsedDispatch,
}
