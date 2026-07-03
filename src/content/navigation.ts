import {
  Brain01Icon,
  CheckListIcon,
  Comment01Icon,
  DashboardSpeed01Icon,
  Database01Icon,
  EyeIcon,
  File01Icon,
  GitForkIcon,
  GridIcon,
  Home01Icon,
  Layers01Icon,
  Message01Icon,
  PencilEdit01Icon,
  SquareLock01Icon,
  Task01Icon,
  UserCheck01Icon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

export type NavigationSubsection = {
  title: string
  id: string
}

export type NavigationSection = {
  title: string
  path: string
  icon: IconSvgElement
  subs: NavigationSubsection[]
}

export type NavigationGroup = {
  label: string | null
  sections: NavigationSection[]
}

// The guide is organized at three altitudes:
//   Surfaces — the anatomy of ONE session (Thread, Composer, Run Panel,
//     Human Gate, Review Surface), routed by the surface routing rule.
//   Operations — containers for MANY sessions; each session, opened,
//     decomposes into the five surfaces.
//   Contracts — invariants (autonomy, memory, feedback) that render across
//     surfaces rather than living on any single one.
// Existing pages are re-homed under this frame; content files have not moved.
export const groups: NavigationGroup[] = [
  {
    label: null,
    sections: [
      {
        title: "Thesis",
        path: "/",
        icon: Home01Icon,
        subs: [],
      },
      {
        title: "Principles",
        path: "/principles",
        icon: Brain01Icon,
        subs: [
          { title: "Progressive Disclosure", id: "progressive-disclosure" },
          { title: "Control Signal", id: "control-signal" },
          { title: "Risk-Tier Gates", id: "risk-tier-gates" },
          { title: "Locked Previews", id: "locked-previews" },
          { title: "Provenance", id: "provenance" },
          { title: "Memory Ledger", id: "memory-ledger" },
          { title: "Blank Canvas", id: "blank-canvas" },
          { title: "Diagnostic Errors", id: "diagnostic-errors" },
          { title: "Visible Cost", id: "visible-cost" },
          { title: "Relationship", id: "relationship" },
        ],
      },
    ],
  },
  {
    label: "Surfaces",
    sections: [
      {
        title: "Thread",
        path: "/thread",
        icon: Message01Icon,
        subs: [],
      },
      {
        title: "Composer",
        path: "/conversation",
        icon: PencilEdit01Icon,
        subs: [
          { title: "Composer Input", id: "composer" },
          { title: "Messages", id: "messages" },
          { title: "Progress Steps", id: "progress-steps" },
          { title: "Citations", id: "citations" },
        ],
      },
      {
        title: "Run Panel",
        path: "/observability",
        icon: DashboardSpeed01Icon,
        subs: [
          { title: "Activity Timeline", id: "activity-timeline" },
          { title: "Token Usage", id: "token-usage" },
          { title: "Session Timeline", id: "session-timeline" },
          { title: "Error Log", id: "error-log" },
        ],
      },
      {
        title: "Human Gate",
        path: "/actions",
        icon: UserCheck01Icon,
        subs: [
          { title: "Approval Gate", id: "approval-gate" },
          { title: "Ask Blocks", id: "ask-blocks" },
          { title: "Decisions", id: "decisions" },
          { title: "Tool Calls", id: "tool-calls" },
          { title: "Plans", id: "plans" },
          { title: "Subagents", id: "subagents" },
          { title: "Parallel", id: "parallel" },
        ],
      },
      {
        title: "Review Surface",
        path: "/sources",
        icon: EyeIcon,
        subs: [
          { title: "Artifact Document", id: "artifact-document" },
          { title: "Contextual Workbench", id: "contextual-workbench" },
          { title: "Source List", id: "source-list" },
          { title: "Citations", id: "citations" },
          { title: "Usage Meter", id: "usage-meter" },
          { title: "Implementation", id: "implementation" },
        ],
      },
    ],
  },
  {
    label: "Operations",
    sections: [
      {
        title: "Operations",
        path: "/operational-surfaces",
        icon: Layers01Icon,
        subs: [
          { title: "Inbox", id: "inbox" },
          { title: "Kanban", id: "kanban" },
          { title: "Manager Surface", id: "manager-surface" },
          { title: "Run Monitor Rollup", id: "run-monitor-rollup" },
          { title: "Background Tasks", id: "background-tasks" },
        ],
      },
      {
        title: "Multi-Agent",
        path: "/multi-agent",
        icon: GitForkIcon,
        subs: [
          { title: "Agent Cards", id: "agent-cards" },
          { title: "Handoff Flow", id: "handoff-flow" },
          { title: "Parallel Agents", id: "parallel-agents" },
          { title: "Routing", id: "agent-routing" },
          { title: "Communication", id: "agent-communication" },
          { title: "Workflow Runs", id: "workflow-runs" },
        ],
      },
    ],
  },
  {
    label: "Contracts",
    sections: [
      {
        title: "Autonomy & Trust",
        path: "/trust",
        icon: SquareLock01Icon,
        subs: [
          { title: "Autonomy", id: "autonomy-level" },
          { title: "Settings Templates", id: "settings-templates" },
          { title: "Mode Toggles", id: "mode-toggles" },
          { title: "Context Scope", id: "context-scope" },
          { title: "Consent Flow", id: "consent-flow" },
          { title: "Confidence", id: "confidence-display" },
          { title: "Kill Switch", id: "kill-switch" },
          { title: "Cost Transparency", id: "cost-transparency" },
          { title: "Provenance", id: "data-provenance" },
          { title: "Audit Trail", id: "audit-trail" },
        ],
      },
      {
        title: "Memory",
        path: "/memory",
        icon: Database01Icon,
        subs: [
          { title: "Memory Panel", id: "memory-panel" },
          { title: "Ledger CRUD", id: "memory-crud" },
          { title: "Auto-Memory", id: "auto-memory" },
          { title: "Context Ring", id: "context-ring" },
          { title: "Privacy Controls", id: "privacy-controls" },
        ],
      },
      {
        title: "Feedback",
        path: "/feedback",
        icon: Comment01Icon,
        subs: [
          { title: "Thumbs Feedback", id: "thumbs-feedback" },
          { title: "Inline Correction", id: "inline-correction" },
          { title: "Rating Scale", id: "rating-scale" },
          { title: "Behavioral Consequence", id: "behavioral-consequence" },
          { title: "History", id: "feedback-history" },
        ],
      },
    ],
  },
  {
    label: "Method",
    sections: [
      {
        title: "Templates",
        path: "/templates",
        icon: CheckListIcon,
        subs: [
          { title: "Review", id: "review-workflow" },
          { title: "Approval", id: "approval-workflow" },
          { title: "Clarifying", id: "clarifying-workflow" },
          { title: "Source-Backed Artifact", id: "source-backed-artifact" },
          { title: "Memory Review", id: "memory-review" },
          { title: "Run Monitor", id: "run-monitor" },
          { title: "Handoff", id: "multi-agent-handoff" },
          { title: "Agent Settings", id: "agent-settings" },
        ],
      },
      {
        title: "Recipes",
        path: "/patterns/autonomy-contract",
        icon: GridIcon,
        subs: [
          { title: "Autonomy Contract", id: "autonomy-contract" },
          { title: "Why It Matters", id: "why-it-matters" },
          { title: "Principles", id: "principles-defended" },
          { title: "Components Used", id: "components-used" },
          { title: "Composition Recipe", id: "composition-recipe" },
        ],
      },
      {
        title: "Use Cases",
        path: "/use-cases",
        icon: Task01Icon,
        subs: [
          { title: "Thread", id: "thread" },
          { title: "Context Blocks", id: "context-blocks" },
          { title: "Side Panel", id: "contextual-side-panel" },
          { title: "Fixture Convention", id: "fixture-convention" },
        ],
      },
      {
        title: "Registry",
        path: "/registry",
        icon: File01Icon,
        subs: [
          { title: "Install", id: "install" },
          { title: "Primitives", id: "primitives" },
          { title: "Workflow Blocks", id: "blocks" },
          { title: "Quality Gates", id: "quality-gates" },
        ],
      },
    ],
  },
]

// Flat view for consumers that don't care about grouping (command palette,
// sitemap).
export const sections: NavigationSection[] = groups.flatMap(
  (group) => group.sections
)
