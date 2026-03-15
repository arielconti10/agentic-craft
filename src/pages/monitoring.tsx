import { useState, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Activity01Icon,
  Alert01Icon,
  ArrowRight01Icon,
  Brain01Icon,
  Cancel01Icon,
  Clock01Icon,
  File01Icon,
  Shield01Icon,
  Tick01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"

/* ------------------------------------------------------------------ */
/*  CSS Keyframes                                                      */
/* ------------------------------------------------------------------ */

const STYLE_ID = "monitoring-page-styles"
function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement("style")
  style.id = STYLE_ID
  style.textContent = `
    @keyframes mon-slide-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes mon-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes mon-expand {
      from { max-height: 0; opacity: 0; }
      to { max-height: 600px; opacity: 1; }
    }
    @keyframes mon-progress {
      from { width: 0%; }
      to { width: var(--target-width); }
    }
    @keyframes mon-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    @keyframes mon-sparkline-draw {
      from { stroke-dashoffset: 200; }
      to { stroke-dashoffset: 0; }
    }
    .mon-slide-in {
      animation: mon-slide-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    .mon-fade-in {
      animation: mon-fade-in 0.2s ease forwards;
    }
    .mon-expand {
      animation: mon-expand 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      overflow: hidden;
    }
    .mon-pulse {
      animation: mon-pulse 1.5s ease-in-out infinite;
    }
    .mon-sparkline-draw {
      animation: mon-sparkline-draw 0.8s ease forwards;
      stroke-dasharray: 200;
    }
  `
  document.head.appendChild(style)
}

/* ------------------------------------------------------------------ */
/*  Controls                                                           */
/* ------------------------------------------------------------------ */

function Controls({
  options,
  active,
  onToggle,
}: {
  options: { key: string; label: string }[]
  active: Record<string, boolean>
  onToggle: (key: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pb-5">
      <span className="section-label mr-1">Controls</span>
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onToggle(opt.key)}
          className={`
            relative text-xs px-2.5 py-1 rounded-md border transition-all duration-200
            ${active[opt.key]
              ? "border-foreground/20 bg-foreground/[0.04] text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }
          `}
        >
          {opt.label}
          {active[opt.key] && (
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-foreground/40" />
          )}
        </button>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function makeToggle(
  setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  animSetter: React.Dispatch<React.SetStateAction<number>>,
) {
  return (key: string) => {
    setter((prev) => {
      const next: Record<string, boolean> = {}
      for (const k of Object.keys(prev)) next[k] = false
      next[key] = true
      return next
    })
    animSetter((n) => n + 1)
  }
}

function MiniSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 80
  const h = 24
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w
      const y = h - ((v - min) / range) * (h - 4) - 2
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
        className="mon-sparkline-draw text-muted-foreground"
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const ACTIVITY_LIVE = [
  { time: "Just now", action: "Checking FCS_COP.1 algorithm references", type: "tool" as const, icon: Search01Icon },
  { time: "12s ago", action: "Cross-referencing Security Target v3.1 against EN 18031-1", type: "tool" as const, icon: File01Icon },
  { time: "34s ago", action: "Identified 2 coverage gaps in FDP_ACC.1 requirements", type: "message" as const, icon: Brain01Icon },
  { time: "1m ago", action: "Started SFR gap analysis for ACME SmartCard Module", type: "message" as const, icon: Shield01Icon },
]

const ACTIVITY_HISTORY = [
  { time: "11:48 AM", action: "Completed SFR gap analysis — 4 gaps identified", type: "message" as const, icon: Tick01Icon },
  { time: "11:44 AM", action: "Generated coverage matrix for ADV_FSP.4", type: "tool" as const, icon: File01Icon },
  { time: "11:40 AM", action: "Parsed EN 18031-1 SFR catalogue — 47 requirements", type: "tool" as const, icon: Search01Icon },
  { time: "11:32 AM", action: "Evidence mapping complete for ALC_FLR.2", type: "message" as const, icon: Tick01Icon },
  { time: "11:14 AM", action: "Cross-referenced test case mappings — 87 cases", type: "tool" as const, icon: File01Icon },
]

const ACTIVITY_FILTERED = [
  { time: "12s ago", action: "Cross-referencing Security Target v3.1 against EN 18031-1", type: "tool" as const, icon: File01Icon },
  { time: "11:44 AM", action: "Generated coverage matrix for ADV_FSP.4", type: "tool" as const, icon: File01Icon },
  { time: "11:40 AM", action: "Parsed EN 18031-1 SFR catalogue — 47 requirements", type: "tool" as const, icon: Search01Icon },
  { time: "11:14 AM", action: "Cross-referenced test case mappings — 87 cases", type: "tool" as const, icon: File01Icon },
]

const STATUS_CONFIGS = {
  idle: {
    dot: "bg-muted-foreground/40",
    label: "Idle",
    detail: "Awaiting next instruction",
    description: "The agent is online and ready. No active tasks or pending operations.",
  },
  working: {
    dot: "bg-foreground",
    label: "Working",
    detail: "Analysing FCS_COP.1 algorithm suite",
    description: "Processing SFR gap analysis for ACME SmartCard Module — step 3 of 5: cross-referencing Security Target v3.1.",
  },
  error: {
    dot: "bg-foreground",
    label: "Error",
    detail: "Failed to access evaluation database",
    description: "Connection to the ITSEF document repository timed out after 30s. Last successful query: 11:44 AM.",
  },
  waiting: {
    dot: "bg-foreground",
    label: "Waiting for approval",
    detail: "Human review required",
    description: "The agent has prepared a vulnerability report for AVA_VAN.3 and needs evaluator sign-off before submitting to the certification body.",
  },
}

const TOKEN_CONFIGS = {
  low: { used: 12400, budget: 100000, label: "Well within budget", sessions: 3, costEstimate: "$0.86" },
  medium: { used: 68000, budget: 100000, label: "Approaching limit", sessions: 14, costEstimate: "$4.72" },
  high: { used: 97200, budget: 100000, label: "Near budget limit", sessions: 28, costEstimate: "$6.74" },
}

const SESSION_SINGLE = [
  { role: "user" as const, content: "Check if the Security Target covers all FCS_COP.1 requirements for the ACME SmartCard Module." },
  { role: "agent" as const, content: "I reviewed the Security Target v3.1 against FCS_COP.1 and found the cryptographic operation specification references AES-CBC-128, but the latest PP-CIMC-SLv3 expects AES-256. This is a gap that should be addressed before the ITSEF evaluation.", tool: "Searched document repository" },
]

const SESSION_MULTI = [
  { role: "user" as const, content: "Run a gap analysis on the SFR coverage for EN 18031-1." },
  { role: "agent" as const, content: "Starting the analysis. I'll cross-reference all 47 SFRs from EN 18031-1 against the current Security Target.", tool: "Loading SFR catalogue" },
  { role: "user" as const, content: "Focus on the network security requirements — FTP_ITC and FCS families." },
  { role: "agent" as const, content: "Narrowing scope to network-related SFRs. I found 2 gaps: FTP_ITC.1 lacks a rationale for the chosen trusted channel mechanism, and FCS_CKM.1 references a deprecated key size.", tool: "Cross-referencing Security Target" },
  { role: "user" as const, content: "Generate a remediation report for those gaps." },
  { role: "agent" as const, content: "Report generated with remediation steps for both gaps, including estimated effort and references to relevant PP sections. Saved as gap-remediation-2026-03.pdf.", tool: "Generating coverage report" },
]

const PERF_SUMMARY = [
  { label: "Avg. response time", value: "2.4s", trend: [2.8, 2.6, 2.5, 2.4, 2.3, 2.4, 2.4] },
  { label: "Task success rate", value: "96%", trend: [92, 94, 93, 95, 96, 95, 96] },
  { label: "Token efficiency", value: "84%", trend: [78, 80, 82, 81, 83, 84, 84] },
  { label: "Human escalations", value: "4%", trend: [8, 6, 7, 5, 4, 5, 4] },
]

const PERF_DETAILED = [
  { label: "Avg. response time", value: "2.4s", sub: "P95: 4.8s · P99: 8.1s" },
  { label: "Task success rate", value: "96%", sub: "142 of 148 tasks this week" },
  { label: "Token efficiency", value: "84%", sub: "Useful output / total tokens" },
  { label: "Human escalations", value: "4%", sub: "6 of 148 required review" },
  { label: "Avg. tool calls per task", value: "3.2", sub: "Range: 1–8 calls" },
  { label: "Cache hit rate", value: "62%", sub: "Saved ~18K tokens this week" },
  { label: "Error recovery rate", value: "71%", sub: "5 of 7 errors self-recovered" },
  { label: "Avg. cost per task", value: "$0.16", sub: "Down 12% from last week" },
]

const ERROR_LIST = [
  {
    time: "11:32 AM",
    severity: "warning" as const,
    title: "Document repository timeout",
    detail: "Connection to the ITSEF document repository timed out after 30s while fetching ADV_FSP.4 evidence package. Retried successfully on second attempt.",
  },
  {
    time: "10:15 AM",
    severity: "error" as const,
    title: "CRA conformity statement generation failed",
    detail: "Missing required field: TOE boundary description. The Security Target v3.1 does not include a compliant boundary diagram per CRA Annex I, Section 2.",
  },
  {
    time: "09:48 AM",
    severity: "warning" as const,
    title: "Rate limit approached",
    detail: "Token usage reached 85% of the daily budget during the vulnerability scan batch. Subsequent requests were throttled to stay within limits.",
  },
]

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function Monitoring() {
  useEffect(ensureStyles, [])

  // Section 1: Activity Timeline
  const [actCtrl, setActCtrl] = useState<Record<string, boolean>>({ live: true, history: false, filtered: false })
  const [actAnim, setActAnim] = useState(0)
  const toggleAct = makeToggle(setActCtrl, setActAnim)

  // Section 2: Status Indicators
  const [statusCtrl, setStatusCtrl] = useState<Record<string, boolean>>({ idle: true, working: false, error: false, waiting: false })
  const [statusAnim, setStatusAnim] = useState(0)
  const toggleStatus = makeToggle(setStatusCtrl, setStatusAnim)

  // Section 3: Token Usage
  const [tokenCtrl, setTokenCtrl] = useState<Record<string, boolean>>({ low: true, medium: false, high: false })
  const [tokenAnim, setTokenAnim] = useState(0)
  const toggleToken = makeToggle(setTokenCtrl, setTokenAnim)

  // Section 4: Session Timeline
  const [sessionCtrl, setSessionCtrl] = useState<Record<string, boolean>>({ single: true, multi: false })
  const [sessionAnim, setSessionAnim] = useState(0)
  const toggleSession = makeToggle(setSessionCtrl, setSessionAnim)

  // Section 5: Performance Metrics
  const [perfCtrl, setPerfCtrl] = useState<Record<string, boolean>>({ summary: true, detailed: false })
  const [perfAnim, setPerfAnim] = useState(0)
  const togglePerf = makeToggle(setPerfCtrl, setPerfAnim)

  // Section 6: Error Log
  const [errCtrl, setErrCtrl] = useState<Record<string, boolean>>({ empty: true, withErrors: false })
  const [errAnim, setErrAnim] = useState(0)
  const toggleErr = makeToggle(setErrCtrl, setErrAnim)

  // Expanded error index
  const [expandedErr, setExpandedErr] = useState<number | null>(null)

  // Derived state
  const activeAct = Object.keys(actCtrl).find((k) => actCtrl[k]) || "live"
  const activityItems = activeAct === "live" ? ACTIVITY_LIVE : activeAct === "history" ? ACTIVITY_HISTORY : ACTIVITY_FILTERED
  const activeStatus = Object.keys(statusCtrl).find((k) => statusCtrl[k]) || "idle"
  const statusCfg = STATUS_CONFIGS[activeStatus as keyof typeof STATUS_CONFIGS]
  const activeToken = Object.keys(tokenCtrl).find((k) => tokenCtrl[k]) || "low"
  const tokenCfg = TOKEN_CONFIGS[activeToken as keyof typeof TOKEN_CONFIGS]
  const activeSession = Object.keys(sessionCtrl).find((k) => sessionCtrl[k]) || "single"
  const sessionItems = activeSession === "single" ? SESSION_SINGLE : SESSION_MULTI
  const activePerf = Object.keys(perfCtrl).find((k) => perfCtrl[k]) || "summary"
  const activeErr = Object.keys(errCtrl).find((k) => errCtrl[k]) || "empty"

  const tokenPct = Math.min((tokenCfg.used / tokenCfg.budget) * 100, 100)
  const isHighUsage = tokenPct > 80

  return (
    <article>
      {/* Page header */}
      <header className="mb-20">
        <p className="section-label mb-4">Observability</p>
        <h1 className="font-serif text-4xl font-light tracking-tight leading-[1.15]">
          Monitoring
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Real-time activity streams, status indicators, token tracking, and
          performance dashboards for continuous agent oversight during evaluation
          workflows.
        </p>
      </header>

      {/* ============================================================ */}
      {/*  Section 1 — Activity Timeline                                */}
      {/* ============================================================ */}
      <section id="activity-timeline" className="page-section">
        <p className="section-label mb-3">Timeline</p>
        <h2 className="text-xl font-semibold tracking-tight">Activity Timeline</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          A chronological stream of agent actions — tool invocations, messages,
          and state transitions — for full auditability of evaluation workflows.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "live", label: "Live" },
              { key: "history", label: "History" },
              { key: "filtered", label: "Filtered" },
            ]}
            active={actCtrl}
            onToggle={toggleAct}
          />

          <div className="border border-border/40 rounded-lg p-6" key={actAnim}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <HugeiconsIcon icon={Activity01Icon} size={14} strokeWidth={1.5} />
                <span>
                  {activeAct === "live" ? "Live feed" : activeAct === "history" ? "Past actions — Mar 15, 2026" : "Filtered — Tool calls only"}
                </span>
              </div>
              {activeAct === "live" && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 mon-pulse" />
                  Streaming
                </span>
              )}
            </div>

            {/* Activity items */}
            <div className="space-y-2">
              {activityItems.map((item, i) => (
                <div
                  key={`${activeAct}-${i}`}
                  className="flex items-start gap-3 rounded-md border border-border/30 px-3 py-2.5 mon-slide-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted">
                    <HugeiconsIcon icon={item.icon} size={12} strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">{item.action}</p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{item.time}</span>
                      <span className="rounded-md bg-muted px-1.5 py-0.5">{item.type === "tool" ? "Tool call" : "Message"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 pr-6 text-xs font-medium text-muted-foreground">Element</th>
              <th className="pb-3 text-xs font-medium text-muted-foreground">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Entry animation</td>
              <td className="py-3">Slide-in from below, 250ms ease-out, staggered 60ms per item</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Live indicator</td>
              <td className="py-3">Pulsing dot with "Streaming" label when in live mode</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Action types</td>
              <td className="py-3">Tool call and Message — displayed as muted chip badges</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Filtering</td>
              <td className="py-3">Filtered view shows only tool call entries for focused audit</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          The activity timeline serves as the FAU_GEN audit log surface — every agent
          action is recorded with a timestamp, type classification, and human-readable
          description. Live mode streams entries as they occur; History and Filtered
          modes enable retrospective analysis during ITSEF evaluations.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 2 — Status Indicators                                */}
      {/* ============================================================ */}
      <section id="status-indicators" className="page-section">
        <p className="section-label mb-3">State</p>
        <h2 className="text-xl font-semibold tracking-tight">Status Indicators</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          A single-glance view of the agent's operational state — whether it's
          idle, actively processing, blocked on an error, or awaiting human
          approval.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "idle", label: "Idle" },
              { key: "working", label: "Working" },
              { key: "error", label: "Error" },
              { key: "waiting", label: "Waiting" },
            ]}
            active={statusCtrl}
            onToggle={toggleStatus}
          />

          <div className="border border-border/40 rounded-lg p-6" key={statusAnim}>
            <div className="mon-slide-in">
              {/* Status header */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <HugeiconsIcon icon={Shield01Icon} size={18} strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Compliance Assistant</p>
                    <span className="flex items-center gap-1.5 rounded-md bg-muted px-2 py-0.5 text-xs">
                      <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot} ${activeStatus === "working" ? "mon-pulse" : ""}`} />
                      {statusCfg.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{statusCfg.detail}</p>
                </div>
              </div>

              {/* Status detail card */}
              <div className={`mt-4 rounded-md border px-4 py-3 ${
                activeStatus === "error"
                  ? "border-foreground/20 bg-foreground/[0.02]"
                  : activeStatus === "waiting"
                    ? "border-foreground/10 bg-foreground/[0.01]"
                    : "border-border/40"
              }`}>
                <p className="text-sm text-muted-foreground">{statusCfg.description}</p>

                {activeStatus === "working" && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Step 3 of 5</span>
                      <span>60%</span>
                    </div>
                    <div className="h-1.5 rounded-md bg-muted">
                      <div
                        className="h-1.5 rounded-md bg-foreground/50"
                        style={{ width: "60%", "--target-width": "60%" } as React.CSSProperties}
                      />
                    </div>
                  </div>
                )}

                {activeStatus === "error" && (
                  <div className="mt-3 flex gap-2">
                    <button className="rounded-md border border-border px-3 py-1 text-xs transition-colors hover:bg-accent">
                      Retry connection
                    </button>
                    <button className="rounded-md border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent">
                      View logs
                    </button>
                  </div>
                )}

                {activeStatus === "waiting" && (
                  <div className="mt-3 flex gap-2">
                    <button className="rounded-md border border-border px-3 py-1 text-xs transition-colors hover:bg-accent">
                      Review and approve
                    </button>
                    <button className="rounded-md border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent">
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 pr-6 text-xs font-medium text-muted-foreground">State</th>
              <th className="pb-3 pr-6 text-xs font-medium text-muted-foreground">Indicator</th>
              <th className="pb-3 text-xs font-medium text-muted-foreground">Behavior</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Idle</td>
              <td className="py-3 pr-6">Muted dot</td>
              <td className="py-3 text-muted-foreground">Static, no progress bar</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Working</td>
              <td className="py-3 pr-6">Pulsing dot + progress bar</td>
              <td className="py-3 text-muted-foreground">Shows current step and completion %</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Error</td>
              <td className="py-3 pr-6">Solid dot + highlighted border</td>
              <td className="py-3 text-muted-foreground">Shows error detail with retry action</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Waiting</td>
              <td className="py-3 pr-6">Solid dot + subtle border</td>
              <td className="py-3 text-muted-foreground">Shows what's pending with approve/dismiss</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Status indicators map to Common Criteria assurance lifecycle states — an agent
          performing ALC_FLR analysis is "Working," while one blocked on missing evidence
          is "Waiting." The four-state model covers all operational modes without
          overwhelming evaluators with intermediate states.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 3 — Token Usage                                      */}
      {/* ============================================================ */}
      <section id="token-usage" className="page-section">
        <p className="section-label mb-3">Economics</p>
        <h2 className="text-xl font-semibold tracking-tight">Token Usage</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          A visual meter showing token consumption against the session or daily
          budget, with cost estimates and usage warnings.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "low", label: "Low" },
              { key: "medium", label: "Medium" },
              { key: "high", label: "High" },
            ]}
            active={tokenCtrl}
            onToggle={toggleToken}
          />

          <div className="border border-border/40 rounded-lg p-6" key={tokenAnim}>
            <div className="mon-slide-in">
              {/* Usage header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Activity01Icon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                  <span className="text-sm font-medium">Token budget</span>
                </div>
                <span className="text-xs text-muted-foreground">{tokenCfg.costEstimate} estimated</span>
              </div>

              {/* Main meter */}
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-semibold tracking-tight">
                    {tokenCfg.used.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    of {tokenCfg.budget.toLocaleString()} tokens
                  </span>
                </div>
                <div className="h-3 rounded-md bg-muted">
                  <div
                    className={`h-3 rounded-md transition-all duration-500 ${isHighUsage ? "bg-foreground/70" : "bg-foreground/40"}`}
                    style={{
                      width: `${tokenPct}%`,
                      "--target-width": `${tokenPct}%`,
                    } as React.CSSProperties}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{tokenCfg.label}</span>
                  <span>{Math.round(tokenPct)}% used</span>
                </div>
              </div>

              {/* Warning for high usage */}
              {isHighUsage && (
                <div className="mt-4 flex items-start gap-2 rounded-md border border-foreground/15 bg-foreground/[0.02] px-3 py-2.5 mon-fade-in">
                  <HugeiconsIcon icon={Alert01Icon} size={14} strokeWidth={1.5} className="mt-0.5 shrink-0 text-muted-foreground" />
                  <div className="text-xs text-muted-foreground">
                    <p>Token usage is approaching the daily budget. Subsequent requests may be
                    throttled. Consider completing the current evaluation task before starting
                    new analyses.</p>
                  </div>
                </div>
              )}

              {/* Stats row */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-md border border-border/30 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Sessions</p>
                  <p className="mt-0.5 text-sm font-medium">{tokenCfg.sessions}</p>
                </div>
                <div className="rounded-md border border-border/30 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Avg. per session</p>
                  <p className="mt-0.5 text-sm font-medium">{Math.round(tokenCfg.used / tokenCfg.sessions).toLocaleString()}</p>
                </div>
                <div className="rounded-md border border-border/30 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Remaining</p>
                  <p className="mt-0.5 text-sm font-medium">{(tokenCfg.budget - tokenCfg.used).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 pr-6 text-xs font-medium text-muted-foreground">Element</th>
              <th className="pb-3 text-xs font-medium text-muted-foreground">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Usage bar</td>
              <td className="py-3">Height 12px, rounded-md, darkens above 80% threshold</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Warning state</td>
              <td className="py-3">Appears above 80% with advisory text and subtle border highlight</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Cost estimate</td>
              <td className="py-3">Dollar amount shown alongside token count — primary metric for non-technical users</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Stats grid</td>
              <td className="py-3">3-column layout: sessions, average per session, remaining tokens</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Token meters translate raw API consumption into a budget metaphor that
          certification professionals understand. The 80% warning threshold provides
          time to prioritize remaining evaluation tasks before throttling begins —
          particularly important during time-bounded ITSEF evaluation sessions.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 4 — Session Timeline                                 */}
      {/* ============================================================ */}
      <section id="session-timeline" className="page-section">
        <p className="section-label mb-3">Conversation</p>
        <h2 className="text-xl font-semibold tracking-tight">Session Timeline</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          A vertical timeline showing the sequence of requests, tool calls, and
          agent responses within an evaluation session.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "single", label: "Single Turn" },
              { key: "multi", label: "Multi Turn" },
            ]}
            active={sessionCtrl}
            onToggle={toggleSession}
          />

          <div className="border border-border/40 rounded-lg p-6" key={sessionAnim}>
            <div className="space-y-0">
              {sessionItems.map((item, i) => (
                <div key={`${activeSession}-${i}`} className="relative mon-slide-in" style={{ animationDelay: `${i * 80}ms` }}>
                  {/* Connector line */}
                  {i < sessionItems.length - 1 && (
                    <div className="absolute left-3 top-8 bottom-0 w-px bg-border" />
                  )}

                  <div className="flex items-start gap-3 pb-4">
                    {/* Node */}
                    <div className={`mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                      item.role === "user" ? "bg-muted" : "bg-foreground/[0.06]"
                    }`}>
                      <HugeiconsIcon
                        icon={item.role === "user" ? ArrowRight01Icon : Brain01Icon}
                        size={12}
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground mb-1">
                        {item.role === "user" ? "Evaluator" : "Agent"}
                      </p>
                      {item.role === "user" ? (
                        <p className="text-sm">{item.content}</p>
                      ) : (
                        <>
                          {"tool" in item && item.tool && (
                            <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                              <HugeiconsIcon icon={Search01Icon} size={11} strokeWidth={1.5} />
                              <span>{item.tool}</span>
                            </div>
                          )}
                          <p
                            className="text-sm"
                            style={{
                              fontFamily: "'Source Serif 4', serif",
                              fontSize: "14px",
                              lineHeight: "22px",
                              letterSpacing: "-0.3px",
                              fontVariationSettings: '"opsz" 12',
                              color: "oklch(0.2642 0.013 93.9)",
                            }}
                          >
                            {item.content}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 pr-6 text-xs font-medium text-muted-foreground">Element</th>
              <th className="pb-3 text-xs font-medium text-muted-foreground">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Connector</td>
              <td className="py-3">1px vertical line between nodes, bg-border color</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Node icons</td>
              <td className="py-3">Arrow for evaluator, brain for agent — rounded-md 24px containers</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Agent prose</td>
              <td className="py-3">Source Serif 4, 14px/22px, oklch ink color</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Tool annotations</td>
              <td className="py-3">Shown above agent response as muted text with search icon</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Session timelines provide the conversation-level audit trail that ITSEF
          evaluators need when reviewing how an agent arrived at its conclusions. Multi-turn
          sessions show how iterative refinement (e.g., narrowing scope from all SFRs to
          just FTP/FCS families) leads to more targeted analysis.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 5 — Performance Metrics                              */}
      {/* ============================================================ */}
      <section id="performance-metrics" className="page-section">
        <p className="section-label mb-3">Analytics</p>
        <h2 className="text-xl font-semibold tracking-tight">Performance Metrics</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Key performance indicators for agent effectiveness — response times,
          success rates, token efficiency, and trend lines over the past week.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "summary", label: "Summary" },
              { key: "detailed", label: "Detailed" },
            ]}
            active={perfCtrl}
            onToggle={togglePerf}
          />

          <div className="border border-border/40 rounded-lg p-6" key={perfAnim}>
            {activePerf === "summary" ? (
              <div className="grid grid-cols-2 gap-3">
                {PERF_SUMMARY.map((kpi, i) => (
                  <div
                    key={kpi.label}
                    className="rounded-md border border-border/30 p-4 mon-slide-in"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">{kpi.label}</p>
                        <p className="mt-1 text-2xl font-semibold tracking-tight">{kpi.value}</p>
                      </div>
                      <MiniSparkline data={kpi.trend} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">7-day trend</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {PERF_DETAILED.map((metric, i) => (
                  <div
                    key={metric.label}
                    className="flex items-center justify-between rounded-md border border-border/30 px-4 py-3 mon-slide-in"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">{metric.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{metric.sub}</p>
                    </div>
                    <span className="text-lg font-semibold tracking-tight">{metric.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 pr-6 text-xs font-medium text-muted-foreground">Element</th>
              <th className="pb-3 text-xs font-medium text-muted-foreground">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Summary cards</td>
              <td className="py-3">2×2 grid with large value, mini sparkline, and "7-day trend" label</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Sparklines</td>
              <td className="py-3">SVG polyline, 80×24px, monochrome stroke, animated draw-in</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Detailed view</td>
              <td className="py-3">Stacked rows with label, subtitle, and right-aligned value</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Metrics count</td>
              <td className="py-3">Summary: 4 KPIs; Detailed: 8 metrics with contextual subtitles</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Performance metrics help evaluation teams track agent reliability over time.
          The summary view surfaces the four most important KPIs at a glance, while the
          detailed view provides the granularity needed for weekly status reports to
          certification body oversight committees.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 6 — Error Log                                        */}
      {/* ============================================================ */}
      <section id="error-log" className="page-section">
        <p className="section-label mb-3">Diagnostics</p>
        <h2 className="text-xl font-semibold tracking-tight">Error Log</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          A filterable log of errors, warnings, and operational anomalies from
          the current evaluation session with expandable detail views.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "empty", label: "Empty" },
              { key: "withErrors", label: "With Errors" },
            ]}
            active={errCtrl}
            onToggle={toggleErr}
          />

          <div className="border border-border/40 rounded-lg p-6" key={errAnim}>
            {activeErr === "empty" ? (
              <div className="mon-slide-in flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted mb-3">
                  <HugeiconsIcon icon={Tick01Icon} size={18} strokeWidth={1.5} className="text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">No errors in current session</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  All agent operations completed successfully since session start.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {ERROR_LIST.map((err, i) => (
                  <div
                    key={i}
                    className="rounded-md border border-border/40 mon-slide-in"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <button
                      onClick={() => setExpandedErr(expandedErr === i ? null : i)}
                      className="flex w-full items-start gap-3 px-4 py-3 text-left"
                    >
                      <div className="mt-0.5 shrink-0">
                        <HugeiconsIcon
                          icon={err.severity === "error" ? Cancel01Icon : Alert01Icon}
                          size={14}
                          strokeWidth={1.5}
                          className="text-muted-foreground"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm">{err.title}</p>
                          <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                            {err.severity}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{err.time}</p>
                      </div>
                      <HugeiconsIcon
                        icon={Clock01Icon}
                        size={12}
                        strokeWidth={1.5}
                        className="mt-1 shrink-0 text-muted-foreground"
                      />
                    </button>

                    {expandedErr === i && (
                      <div className="border-t border-border/30 px-4 py-3 mon-expand">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {err.detail}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 pr-6 text-xs font-medium text-muted-foreground">Element</th>
              <th className="pb-3 text-xs font-medium text-muted-foreground">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Empty state</td>
              <td className="py-3">Centered check icon with "No errors" message and subtitle</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Error entries</td>
              <td className="py-3">Clickable rows with severity badge, timestamp, and expand/collapse</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Severity levels</td>
              <td className="py-3">Warning and Error — shown as muted chip badges, no colors</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 text-muted-foreground">Expanded detail</td>
              <td className="py-3">Animated expand with full error description and context</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          The error log provides the diagnostic transparency required by FAU_SAR
          (Security Audit Review) — evaluators can inspect every operational anomaly,
          understand its context, and verify that the agent's error handling meets the
          TOE's claimed assurance level.
        </div>
      </section>
    </article>
  )
}
