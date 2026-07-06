import type { ActionPreviewItem } from "@/components/ui/action-preview"

/* The lab's thesis, as data: an autonomy posture is a policy for WHERE the
   human checkpoint goes, not how much oversight exists. Every step in the
   script belongs to an action class; the posture maps each class to a
   checkpoint kind. What the posture does NOT change: boundary violations
   always escalate, external side effects always gate. */

type PostureId = "asks-first" | "edits-freely" | "on-its-own"

type ActionClass = "read" | "edit" | "command" | "boundary" | "external"

type CheckpointKind = "auto" | "gate" | "escalate"

type Posture = {
  id: PostureId
  label: string
  tagline: string
}

const POSTURES: readonly Posture[] = [
  {
    id: "asks-first",
    label: "Asks first",
    tagline:
      "Every consequential step waits for you — the checkpoint is in-flight.",
  },
  {
    id: "edits-freely",
    label: "Edits freely",
    tagline: "Edits apply on their own; commands and side effects still ask.",
  },
  {
    id: "on-its-own",
    label: "On its own",
    tagline:
      "Only boundaries and external effects interrupt — the checkpoint moves to the receipt.",
  },
]

const POLICY: Record<PostureId, Record<ActionClass, CheckpointKind>> = {
  "asks-first": {
    read: "auto",
    edit: "gate",
    command: "gate",
    boundary: "escalate",
    external: "gate",
  },
  "edits-freely": {
    read: "auto",
    edit: "auto",
    command: "gate",
    boundary: "escalate",
    external: "gate",
  },
  "on-its-own": {
    read: "auto",
    edit: "auto",
    command: "auto",
    boundary: "escalate",
    external: "gate",
  },
}

const ACTION_CLASS_LABELS: Record<ActionClass, string> = {
  read: "Reads",
  edit: "Edits",
  command: "Commands",
  boundary: "Boundaries",
  external: "External",
}

const CHECKPOINT_KIND_LABELS: Record<CheckpointKind, string> = {
  auto: "auto",
  gate: "asks",
  escalate: "escalates",
}

type EscalationChoiceId = "allow" | "workaround"

type RunStep = {
  id: string
  actionClass: ActionClass
  title: string
  description: string
  cost: number
  /** Post-execution status; defaults to complete. */
  result?: "complete" | "warning"
  resultNote?: string
  /** Payload shown when this step gates under the active posture. */
  gate?: {
    title: string
    description: string
    items: ActionPreviewItem[]
  }
  escalation?: {
    question: string
    detail: string
    choices: readonly {
      id: EscalationChoiceId
      label: string
      consequence: string
    }[]
  }
}

const SPEND_CAP = 5

const RUN_SCRIPT: readonly RunStep[] = [
  {
    id: "scan",
    actionClass: "read",
    title: "Scan scope",
    description: "Read session-chat-page.tsx and 3 adapter call sites",
    cost: 0.35,
  },
  {
    id: "plan",
    actionClass: "read",
    title: "Draft plan",
    description:
      "4 steps — public props stay stable, adapter owns the send queue",
    cost: 0.28,
  },
  {
    id: "edit-page",
    actionClass: "edit",
    title: "Edit session-chat-page.tsx",
    description: "+41 −67 · swap local composer state for the adapter hook",
    cost: 0.62,
    gate: {
      title: "Apply edit to session-chat-page.tsx",
      description:
        "Replaces local composer state with the shared adapter hook. Public props unchanged.",
      items: [
        { label: "File", value: "src/pages/session-chat-page.tsx" },
        { label: "Change", value: "+41 −67" },
      ],
    },
  },
  {
    id: "edit-adapter",
    actionClass: "edit",
    title: "Edit composer-adapter.ts",
    description: "+18 −2 · add a session-scoped send queue",
    cost: 0.41,
    gate: {
      title: "Apply edit to composer-adapter.ts",
      description:
        "Adds a session-scoped send queue behind the existing interface.",
      items: [
        { label: "File", value: "src/lib/composer-adapter.ts" },
        { label: "Change", value: "+18 −2" },
      ],
    },
  },
  {
    id: "test-1",
    actionClass: "command",
    title: "Run npm test",
    description: "Workspace command · watch off",
    cost: 0.55,
    result: "warning",
    resultNote:
      "2 failures — session-chat-page.test.tsx still mocks the old composer",
    gate: {
      title: "Run npm test",
      description: "Executes the workspace test suite. No files are modified.",
      items: [
        { label: "Command", value: "npm test -- --run" },
        { label: "Scope", value: "Workspace only" },
      ],
    },
  },
  {
    id: "boundary",
    actionClass: "boundary",
    title: "Boundary hit",
    description:
      "Clean fix needs @testing-library/user-event bumped — the ask excludes deps",
    cost: 0.12,
    escalation: {
      question:
        "The clean fix bumps @testing-library/user-event to v15, but the ask says don't touch deps. How should I proceed?",
      detail:
        "The failing tests drive the composer through user-event APIs that changed shape. I can bump the one devDependency, or rewrite both tests with existing utilities.",
      choices: [
        {
          id: "allow",
          label: "Allow this one dep",
          consequence: "Bumps one devDependency · lockfile changes",
        },
        {
          id: "workaround",
          label: "Work around it",
          consequence: "Rewrites the two tests with existing utilities",
        },
      ],
    },
  },
  {
    id: "fix",
    actionClass: "edit",
    title: "Apply test fix",
    description: "Resolves the two failures per your escalation choice",
    cost: 0.48,
    gate: {
      title: "Apply test fix",
      description: "Applies the fix chosen at the boundary escalation.",
      items: [
        { label: "File", value: "src/pages/session-chat-page.test.tsx" },
        { label: "Change", value: "+22 −9" },
      ],
    },
  },
  {
    id: "test-2",
    actionClass: "command",
    title: "Re-run npm test",
    description: "Stopping condition check — the ask says stop when tests pass",
    cost: 0.51,
    resultNote: "42 passed · 0 failed",
    gate: {
      title: "Re-run npm test",
      description: "Executes the workspace test suite. No files are modified.",
      items: [
        { label: "Command", value: "npm test -- --run" },
        { label: "Scope", value: "Workspace only" },
      ],
    },
  },
  {
    id: "push",
    actionClass: "external",
    title: "Push branch and open draft PR",
    description: "Leaves the machine — external side effect",
    cost: 0.08,
    gate: {
      title: "Push feat/composer-adapter-migration",
      description:
        "Pushes the branch to origin and opens a draft PR. This is the run's only external side effect.",
      items: [
        { label: "Remote", value: "origin" },
        { label: "Action", value: "git push + draft PR" },
        {
          label: "Rollback",
          value: "Delete the remote branch and close the PR.",
          emphasis: true,
        },
      ],
    },
  },
]

/* Step 7's display depends on the escalation choice. */
const FIX_VARIANTS: Record<
  EscalationChoiceId,
  { title: string; description: string }
> = {
  allow: {
    title: "Bump @testing-library/user-event",
    description: "devDependency 14.6 → 15.0 · lockfile updated",
  },
  workaround: {
    title: "Rewrite tests without user-event",
    description: "+22 −9 in session-chat-page.test.tsx",
  },
}

function countInFlightCheckpoints(posture: PostureId): number {
  return RUN_SCRIPT.filter(
    (step) => POLICY[posture][step.actionClass] !== "auto"
  ).length
}

type PlanItem = {
  id: string
  label: string
  detail: string
}

type RunPlan = {
  approach: readonly string[]
  scope: readonly PlanItem[]
  stopping: string
  budget: string
  exclusions: readonly string[]
}

const RUN_PLAN: RunPlan = {
  approach: [
    "Read session-chat-page.tsx and adapter call sites — public props stay stable",
    "Swap local composer state for the shared adapter hook in session-chat-page.tsx",
    "Add a session-scoped send queue behind composer-adapter.ts",
    "Update session-chat-page.test.tsx mocks and verify with npm test",
  ],
  scope: [
    {
      id: "edit-page",
      label: "src/pages/session-chat-page.tsx",
      detail: "+41 −67 · swap local composer state for the adapter hook",
    },
    {
      id: "edit-adapter",
      label: "src/lib/composer-adapter.ts",
      detail: "+18 −2 · add a session-scoped send queue",
    },
    {
      id: "fix",
      label: "src/pages/session-chat-page.test.tsx",
      detail: "Update mocks after adapter migration",
    },
  ],
  stopping: "Stop when npm test passes",
  budget: "≤ $5.00",
  exclusions: ["deps"],
}

export {
  ACTION_CLASS_LABELS,
  CHECKPOINT_KIND_LABELS,
  countInFlightCheckpoints,
  FIX_VARIANTS,
  POLICY,
  POSTURES,
  RUN_PLAN,
  RUN_SCRIPT,
  SPEND_CAP,
  type ActionClass,
  type PlanItem,
  type RunPlan,
  type CheckpointKind,
  type EscalationChoiceId,
  type Posture,
  type PostureId,
  type RunStep,
}
