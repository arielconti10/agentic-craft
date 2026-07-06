const FIXTURE_ASK =
  "migrate session-chat-page to the shared composer adapter — don't touch deps, stop when tests pass, keep it under $5"

type AppId = "claude-code" | "codex" | "cursor" | "eve"

type ModeDetent = {
  id: string
  label: string
  shortcut?: string
  gated?: boolean
  description?: string
}

type ParsedComposerAsk = {
  parseEcho: string
  receipt: string
  includeChips: readonly { id: string; label: string; count?: number }[]
  exclusionChips: readonly { id: string; label: string }[]
  defaultsLine: string
}

const APP_MODE_SETS: Record<
  AppId,
  { label: string; note?: string; detents: readonly ModeDetent[] }
> = {
  "claude-code": {
    label: "Claude Code",
    detents: [
      { id: "ask", label: "Ask before edits", shortcut: "1" },
      { id: "accept", label: "Accept edits", shortcut: "2" },
      { id: "plan", label: "Plan mode", shortcut: "3" },
      { id: "auto", label: "Auto", shortcut: "4" },
      {
        id: "bypass",
        label: "Bypass permissions",
        shortcut: "5",
        gated: true,
        description: "Enable in Settings after reading the warning.",
      },
    ],
  },
  codex: {
    label: "Codex",
    detents: [
      { id: "read", label: "Read only", shortcut: "1" },
      { id: "auto", label: "Auto", shortcut: "2" },
      {
        id: "full",
        label: "Full access",
        shortcut: "3",
        gated: true,
        description: "Requires explicit unlock in this lab.",
      },
    ],
  },
  cursor: {
    label: "Cursor",
    note: "Run Mode lives in Settings in the real product.",
    detents: [
      { id: "ask", label: "Ask every time", shortcut: "1" },
      { id: "sandbox", label: "Run in sandbox", shortcut: "2" },
      {
        id: "everything",
        label: "Run everything",
        shortcut: "3",
        gated: true,
        description: "Buried in Settings — shown gated here.",
      },
    ],
  },
  eve: {
    label: "eve",
    note: "Posture levers, not Claude Code modes.",
    detents: [
      { id: "asks-first", label: "Asks first", shortcut: "1" },
      { id: "edits-freely", label: "Edits freely", shortcut: "2" },
      { id: "on-its-own", label: "On its own", shortcut: "3" },
    ],
  },
}

function parseComposerAsk(text: string): ParsedComposerAsk {
  const trimmed = text.trim()
  const lower = trimmed.toLowerCase()

  const stopMatch = lower.match(
    /(?:stop|done)\s+when\s+([^—–.;,]+(?:pass|green|complete)[^—–.;,]*)/i
  )
  const stopLabel = stopMatch?.[1]?.trim() ?? "tests pass"

  const budgetMatch = trimmed.match(
    /(?:under|below|keep\s+it\s+under)\s+\$?\d+/i
  )
  const budget = budgetMatch?.[0].replace(/^keep it /i, "") ?? "≤ $5"

  const dontTouchMatch = trimmed.match(/don't touch\s+([^—–.;,]+)/i)
  const exclusion = dontTouchMatch?.[1]?.trim() ?? "deps"

  const taskMatch = trimmed.match(/migrate\s+([^—–]+?)(?:\s+to|\s+—)/i)
  const task = taskMatch?.[1]?.trim() ?? "session-chat-page"

  return {
    parseEcho: `Done when: ${stopLabel} · budget: ${budget}`,
    receipt: `Migrate ${task} to shared adapter · ${exclusion} locked · stop: ${stopLabel} · ${budget} · tap to edit`,
    includeChips: [
      { id: "session", label: "session-chat-page", count: 12 },
      { id: "adapter", label: "shared adapter", count: 4 },
    ],
    exclusionChips: [
      { id: "deps", label: `${exclusion} 🔒` },
      { id: "push", label: "git push 🔒" },
    ],
    defaultsLine: "Using eve-chat defaults · 2 changed for this run",
  }
}

export {
  APP_MODE_SETS,
  FIXTURE_ASK,
  parseComposerAsk,
  type AppId,
  type ModeDetent,
  type ParsedComposerAsk,
}
