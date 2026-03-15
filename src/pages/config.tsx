import { useState, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Shield01Icon,
  Tick01Icon,
  Alert01Icon,
  Brain01Icon,
  Plug01Icon,
  Target01Icon,
  Clock01Icon,
  File01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  Search01Icon,
  Activity01Icon,
} from "@hugeicons/core-free-icons"

/* ------------------------------------------------------------------ */
/*  CSS Keyframes                                                      */
/* ------------------------------------------------------------------ */

const STYLE_ID = "config-page-styles"
function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement("style")
  style.id = STYLE_ID
  style.textContent = `
    @keyframes config-slide-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes config-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes config-expand {
      from { max-height: 0; opacity: 0; }
      to { max-height: 800px; opacity: 1; }
    }
    @keyframes config-progress {
      from { width: 0%; }
      to { width: var(--target-width); }
    }
    @keyframes config-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    .config-slide-in {
      animation: config-slide-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    .config-fade-in {
      animation: config-fade-in 0.2s ease forwards;
    }
    .config-expand {
      animation: config-expand 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      overflow: hidden;
    }
    .config-pulse {
      animation: config-pulse 1.5s ease-in-out infinite;
    }
  `
  document.head.appendChild(style)
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const AUTONOMY_LEVELS = [
  {
    level: 2,
    name: "Human-in-Command",
    description: "AI drafts outputs and proposes actions; human approves every one before execution.",
    uiPattern: "Approval modal",
    capabilities: [
      "Draft evaluation findings for review",
      "Propose SFR-to-test-case mappings",
      "Suggest evidence requests to developer",
    ],
    restrictions: [
      "Cannot send emails without approval",
      "Cannot modify evaluation records",
      "Cannot create or close findings",
    ],
  },
  {
    level: 3,
    name: "Human-Delegated",
    description: "AI handles routine tasks autonomously; human reviews only flagged exceptions.",
    uiPattern: "Inbox of flagged items",
    capabilities: [
      "Automatically cross-reference SFR coverage",
      "Generate routine status reports",
      "Send pre-approved notification templates",
    ],
    restrictions: [
      "Flags novel findings for human review",
      "Cannot submit evidence packages to lab",
      "Escalates if confidence drops below 70%",
    ],
  },
  {
    level: 4,
    name: "Human-in-the-Loop",
    description: "AI executes freely but escalates when confidence drops below a set threshold.",
    uiPattern: "Confidence slider",
    capabilities: [
      "Execute full evaluation workflows end-to-end",
      "Send emails and create findings autonomously",
      "Update Security Target revision history",
    ],
    restrictions: [
      "Escalates on confidence below threshold",
      "Cannot approve final ETR submission",
      "Human monitors via activity dashboard",
    ],
  },
]

const MODE_CONFIGS = {
  compliance: {
    label: "Compliance",
    focus: "Ensuring all evaluation evidence meets CEM requirements and PP conformance claims.",
    tools: [
      "Evidence completeness checker",
      "SFR coverage matrix generator",
      "PP conformance validator",
      "ALC lifecycle document scanner",
    ],
  },
  research: {
    label: "Research",
    focus: "Investigating technical aspects of the TOE, analyzing vulnerability reports, and reviewing cryptographic implementations.",
    tools: [
      "Vulnerability database search",
      "Cryptographic algorithm verifier",
      "Technical document analyzer",
      "CAVP certificate lookup",
    ],
  },
  review: {
    label: "Review",
    focus: "Reviewing evaluation deliverables, checking consistency across documents, and preparing for lab audits.",
    tools: [
      "Cross-document consistency checker",
      "ETR section reviewer",
      "Finding classification advisor",
      "Audit preparation checklist",
    ],
  },
}

const DEFAULT_PARAMS = {
  responseLength: { label: "Response length", value: 500, unit: "tokens", min: 100, max: 2000 },
  citationDepth: { label: "Citation depth", value: 2, unit: "levels", min: 1, max: 5 },
  confidenceThreshold: { label: "Confidence threshold", value: 70, unit: "%", min: 0, max: 100 },
}

const CUSTOM_PARAMS = {
  responseLength: { label: "Response length", value: 1200, unit: "tokens", min: 100, max: 2000 },
  citationDepth: { label: "Citation depth", value: 4, unit: "levels", min: 1, max: 5 },
  confidenceThreshold: { label: "Confidence threshold", value: 85, unit: "%", min: 0, max: 100 },
}

const CONNECTOR_CARDS = [
  {
    name: "Document Repository",
    description: "Access Security Targets, Protection Profiles, and evaluation evidence",
    category: "Storage",
  },
  {
    name: "Evaluation Database",
    description: "Query SAR status, SFR coverage, and finding history",
    category: "Data",
  },
  {
    name: "Certification Body Portal",
    description: "Submit evaluation reports, check scheme requirements",
    category: "External",
  },
]

const SCOPE_CONFIGS = {
  device: {
    label: "Device Only",
    scope: "ACME SmartCard Module v3.1",
    documents: [
      { name: "Security Target v3.1", section: "Full document" },
      { name: "Test Report TR-2026-003", section: "Device-specific tests" },
    ],
  },
  devicePP: {
    label: "Device + PP",
    scope: "ACME SmartCard + PP-CIMC-SLv3",
    documents: [
      { name: "Security Target v3.1", section: "Full document" },
      { name: "Test Report TR-2026-003", section: "All test results" },
      { name: "PP-CIMC-SLv3", section: "SFR requirements" },
      { name: "PP Evaluation Report", section: "Conformance claims" },
    ],
  },
  global: {
    label: "Global",
    scope: "All evaluation artifacts",
    documents: [
      { name: "Security Target v3.1", section: "Full document" },
      { name: "Test Report TR-2026-003", section: "All test results" },
      { name: "PP-CIMC-SLv3", section: "Full document" },
      { name: "Previous ETR (2025-08)", section: "Findings and conclusions" },
      { name: "CEM v3.1 Supplement", section: "Evaluator actions" },
      { name: "Vulnerability Analysis Report", section: "AVA_VAN results" },
    ],
  },
}

const EXPORT_OPTIONS = [
  { name: "PDF Report", description: "Formatted evaluation report with findings and recommendations", format: "PDF" },
  { name: "Evidence Package", description: "Complete evidence bundle for lab submission (ZIP)", format: "ZIP" },
  { name: "Compliance Matrix", description: "SFR-to-evidence mapping spreadsheet", format: "XLSX" },
]

/* ------------------------------------------------------------------ */
/*  Controls component                                                 */
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
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Config() {
  useEffect(() => { ensureStyles() }, [])

  /* — Autonomy Level — */
  const [autoCtrl, setAutoCtrl] = useState<Record<string, boolean>>({ level2: true, level3: false, level4: false })
  const [autoAnimKey, setAutoAnimKey] = useState(0)

  /* — Mode Toggles — */
  const [modeCtrl, setModeCtrl] = useState<Record<string, boolean>>({ compliance: true, research: false, review: false })
  const [modeAnimKey, setModeAnimKey] = useState(0)

  /* — Parameters — */
  const [paramCtrl, setParamCtrl] = useState<Record<string, boolean>>({ default: true, custom: false })
  const [paramAnimKey, setParamAnimKey] = useState(0)

  /* — Connector Cards — */
  const [connCtrl, setConnCtrl] = useState<Record<string, boolean>>({ connected: true, disconnected: false, error: false })
  const [connAnimKey, setConnAnimKey] = useState(0)

  /* — Context Scope — */
  const [scopeCtrl, setScopeCtrl] = useState<Record<string, boolean>>({ device: true, devicePP: false, global: false })
  const [scopeAnimKey, setScopeAnimKey] = useState(0)

  /* — Export & Sharing — */
  const [exportCtrl, setExportCtrl] = useState<Record<string, boolean>>({ default: true, exporting: false })
  const [exportAnimKey, setExportAnimKey] = useState(0)

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

  /* Resolve active autonomy level */
  const activeLevel = autoCtrl.level2 ? AUTONOMY_LEVELS[0] : autoCtrl.level3 ? AUTONOMY_LEVELS[1] : AUTONOMY_LEVELS[2]

  /* Resolve active mode */
  const activeMode = modeCtrl.compliance ? MODE_CONFIGS.compliance : modeCtrl.research ? MODE_CONFIGS.research : MODE_CONFIGS.review

  /* Resolve active params */
  const activeParams = paramCtrl.default ? DEFAULT_PARAMS : CUSTOM_PARAMS

  /* Resolve active scope */
  const activeScope = scopeCtrl.device ? SCOPE_CONFIGS.device : scopeCtrl.devicePP ? SCOPE_CONFIGS.devicePP : SCOPE_CONFIGS.global

  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-4">Patterns</p>
        <h1 className="font-serif text-4xl font-light tracking-tight leading-[1.15]">
          Configuration
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Agent setup workflows, autonomy controls, rule builders, and
          integration management. These patterns guide users through complex
          configuration without overwhelming them.
        </p>
      </header>

      {/* ============================================================ */}
      {/*  Section 1 — Autonomy Level                                   */}
      {/* ============================================================ */}
      <section id="autonomy-level" className="page-section">
        <p className="section-label mb-3">Governance</p>
        <h2 className="text-xl font-semibold tracking-tight">Autonomy Level</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Select how much independence the agent has. Higher levels increase speed
          but reduce oversight. Uses the 6-level autonomy scale from foundations.
        </p>

        <div className="mt-8">
          <Controls
            options={[
              { key: "level2", label: "Level 2" },
              { key: "level3", label: "Level 3" },
              { key: "level4", label: "Level 4" },
            ]}
            active={autoCtrl}
            onToggle={makeToggle(setAutoCtrl, setAutoAnimKey)}
          />

          <div className="border border-border/40 rounded-lg p-6" key={autoAnimKey}>
            <div className="config-slide-in">
              {/* Stepped indicator */}
              <div className="flex items-center gap-1 mb-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="flex-1 flex flex-col items-center gap-1.5">
                    <div
                      className={`h-2 w-full rounded-md transition-colors duration-200 ${
                        n <= activeLevel.level
                          ? "bg-foreground/20"
                          : "bg-muted"
                      }`}
                    />
                    <span className={`text-[10px] tabular-nums ${
                      n === activeLevel.level ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}>
                      {n}
                    </span>
                  </div>
                ))}
              </div>

              {/* Level details */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground">Level {activeLevel.level}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-sm font-medium">{activeLevel.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{activeLevel.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Capabilities</p>
                    <div className="space-y-1.5">
                      {activeLevel.capabilities.map((cap) => (
                        <div key={cap} className="flex items-start gap-2">
                          <HugeiconsIcon icon={Tick01Icon} size={12} strokeWidth={1.5} className="mt-0.5 shrink-0 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Restrictions</p>
                    <div className="space-y-1.5">
                      {activeLevel.restrictions.map((r) => (
                        <div key={r} className="flex items-start gap-2">
                          <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={1.5} className="mt-0.5 shrink-0 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <span className="rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    UI: {activeLevel.uiPattern}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spec table */}
        <div className="mt-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Property</th>
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Value</th>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Notes</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">Scale</td>
                <td className="py-2.5 pr-4">6 levels (1–6)</td>
                <td className="py-2.5">From Human-Augmented to Human-Out-of-the-Loop</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">Default</td>
                <td className="py-2.5 pr-4">Level 2</td>
                <td className="py-2.5">Start conservative, unlock higher levels over time</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-foreground">Indicator</td>
                <td className="py-2.5 pr-4">Stepped bar</td>
                <td className="py-2.5">Discrete steps, not a continuous slider</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Callout */}
        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Autonomy levels should be progressive — start at Level 2 for new evaluations and
          unlock higher levels only after the agent has demonstrated reliability. Never
          default to full autonomy for evaluation tasks that affect certification outcomes.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 2 — Mode Toggles                                     */}
      {/* ============================================================ */}
      <section id="mode-toggles" className="page-section">
        <p className="section-label mb-3">Behavior</p>
        <h2 className="text-xl font-semibold tracking-tight">Mode Toggles</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Switch the agent's operational mode to focus on different aspects of the
          evaluation workflow. Each mode changes available tools and priorities.
        </p>

        <div className="mt-8">
          <Controls
            options={[
              { key: "compliance", label: "Compliance" },
              { key: "research", label: "Research" },
              { key: "review", label: "Review" },
            ]}
            active={modeCtrl}
            onToggle={makeToggle(setModeCtrl, setModeAnimKey)}
          />

          <div className="border border-border/40 rounded-lg p-6" key={modeAnimKey}>
            <div className="config-slide-in">
              <div className="space-y-4">
                {/* Mode header */}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                    <HugeiconsIcon
                      icon={modeCtrl.compliance ? Shield01Icon : modeCtrl.research ? Search01Icon : Target01Icon}
                      size={14}
                      strokeWidth={1.5}
                      className="text-muted-foreground"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activeMode.label} mode</p>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </div>
                </div>

                {/* Focus */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Focus</p>
                  <p className="text-sm text-muted-foreground">{activeMode.focus}</p>
                </div>

                {/* Available tools */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Available tools</p>
                  <div className="grid grid-cols-2 gap-2">
                    {activeMode.tools.map((tool, i) => (
                      <div
                        key={tool}
                        className="flex items-center gap-2 rounded-md border border-border/60 px-3 py-2 config-slide-in"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <HugeiconsIcon icon={Brain01Icon} size={12} strokeWidth={1.5} className="shrink-0 text-muted-foreground" />
                        <span className="text-xs">{tool}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mode selector as toggle buttons */}
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-2">Switch mode</p>
                  <div className="inline-flex rounded-md border border-border bg-muted/30 p-0.5">
                    {(["compliance", "research", "review"] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => makeToggle(setModeCtrl, setModeAnimKey)(m)}
                        className={`rounded-md px-3 py-1.5 text-xs transition-all duration-150 ${
                          modeCtrl[m]
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {MODE_CONFIGS[m].label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spec table */}
        <div className="mt-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Mode</th>
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Focus</th>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Tools</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">Compliance</td>
                <td className="py-2.5 pr-4">Evidence and PP conformance</td>
                <td className="py-2.5">4 compliance-specific tools</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">Research</td>
                <td className="py-2.5 pr-4">Technical investigation</td>
                <td className="py-2.5">4 research-specific tools</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-foreground">Review</td>
                <td className="py-2.5 pr-4">Deliverable review and audit prep</td>
                <td className="py-2.5">4 review-specific tools</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Callout */}
        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Mode switching should be instant — no confirmation dialog needed since it only changes
          tool availability and focus, not data access. Evaluators typically switch modes
          multiple times during a single evaluation session.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 3 — Parameters                                       */}
      {/* ============================================================ */}
      <section id="parameters" className="page-section">
        <p className="section-label mb-3">Tuning</p>
        <h2 className="text-xl font-semibold tracking-tight">Parameters</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Fine-tune agent behavior through adjustable parameters. Default values
          work well for most evaluations; custom values are for specialized workflows.
        </p>

        <div className="mt-8">
          <Controls
            options={[
              { key: "default", label: "Default" },
              { key: "custom", label: "Custom" },
            ]}
            active={paramCtrl}
            onToggle={makeToggle(setParamCtrl, setParamAnimKey)}
          />

          <div className="border border-border/40 rounded-lg p-6" key={paramAnimKey}>
            <div className="config-slide-in">
              <div className="space-y-5">
                {Object.entries(activeParams).map(([key, param], i) => (
                  <div
                    key={key}
                    className="config-slide-in"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">{param.label}</span>
                      <span className="text-sm font-medium tabular-nums">
                        {param.value}{param.unit === "%" ? "%" : ` ${param.unit}`}
                      </span>
                    </div>
                    <div className="relative h-1.5 rounded-md bg-muted">
                      <div
                        className="absolute inset-y-0 left-0 rounded-md bg-foreground/20"
                        style={{
                          width: `${((param.value - param.min) / (param.max - param.min)) * 100}%`,
                          animation: "config-progress 0.4s ease forwards",
                          ["--target-width" as string]: `${((param.value - param.min) / (param.max - param.min)) * 100}%`,
                        }}
                      />
                      <div
                        className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-md border border-border bg-background shadow-sm"
                        style={{ left: `${((param.value - param.min) / (param.max - param.min)) * 100}%`, marginLeft: "-7px" }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-muted-foreground tabular-nums">{param.min}{param.unit === "%" ? "%" : ""}</span>
                      <span className="text-[10px] text-muted-foreground tabular-nums">{param.max}{param.unit === "%" ? "%" : ""}</span>
                    </div>
                  </div>
                ))}

                {/* Params state indicator */}
                <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                  <span className={`h-1.5 w-1.5 rounded-full ${paramCtrl.default ? "bg-foreground/30" : "bg-foreground/60"}`} />
                  <span className="text-xs text-muted-foreground">
                    {paramCtrl.default ? "Using default parameters" : "Custom parameters active"}
                  </span>
                  {paramCtrl.custom && (
                    <button
                      onClick={() => makeToggle(setParamCtrl, setParamAnimKey)("default")}
                      className="ml-auto text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
                    >
                      Reset to defaults
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spec table */}
        <div className="mt-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Parameter</th>
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Default</th>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Range</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">Response length</td>
                <td className="py-2.5 pr-4">500 tokens</td>
                <td className="py-2.5">100–2000 tokens</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">Citation depth</td>
                <td className="py-2.5 pr-4">2 levels</td>
                <td className="py-2.5">1–5 levels</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-foreground">Confidence threshold</td>
                <td className="py-2.5 pr-4">70%</td>
                <td className="py-2.5">0–100%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Callout */}
        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Most evaluators should never need to change parameters from defaults.
          The custom panel exists for power users and specific evaluation scenarios
          like high-assurance EAL5+ evaluations that require deeper citation chains.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 4 — Connector Cards                                  */}
      {/* ============================================================ */}
      <section id="connector-cards" className="page-section">
        <p className="section-label mb-3">Integrations</p>
        <h2 className="text-xl font-semibold tracking-tight">Connector Cards</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          External system integrations shown as status cards. Each card reflects
          the current connection state and provides actions for management.
        </p>

        <div className="mt-8">
          <Controls
            options={[
              { key: "connected", label: "Connected" },
              { key: "disconnected", label: "Disconnected" },
              { key: "error", label: "Error" },
            ]}
            active={connCtrl}
            onToggle={makeToggle(setConnCtrl, setConnAnimKey)}
          />

          <div className="border border-border/40 rounded-lg p-6" key={connAnimKey}>
            <div className="config-slide-in">
              <div className="space-y-3">
                {CONNECTOR_CARDS.map((card, i) => (
                  <div
                    key={card.name}
                    className="rounded-md border border-border/60 p-4 config-slide-in"
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                          <HugeiconsIcon
                            icon={card.category === "Storage" ? File01Icon : card.category === "Data" ? Activity01Icon : Plug01Icon}
                            size={14}
                            strokeWidth={1.5}
                            className="text-muted-foreground"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{card.name}</p>
                            <span className="rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                              {card.category}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">{card.description}</p>

                          {/* Connected state */}
                          {connCtrl.connected && (
                            <div className="mt-2 flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              <span className="text-xs text-muted-foreground">Connected</span>
                              <span className="text-xs text-muted-foreground">·</span>
                              <span className="text-[10px] text-muted-foreground">Last sync: 2 min ago</span>
                            </div>
                          )}

                          {/* Error state */}
                          {connCtrl.error && (
                            <div className="mt-2 flex items-center gap-2">
                              <HugeiconsIcon icon={Alert01Icon} size={12} strokeWidth={1.5} className="text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">Connection failed — timeout after 10s</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action button */}
                      <div className="shrink-0">
                        {connCtrl.connected && (
                          <button className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted">
                            Manage
                          </button>
                        )}
                        {connCtrl.disconnected && (
                          <button className="rounded-md bg-foreground px-2.5 py-1 text-xs text-background transition-all duration-150 hover:opacity-90 active:scale-[0.97]">
                            Connect
                          </button>
                        )}
                        {connCtrl.error && (
                          <button className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted active:scale-[0.97]">
                            Retry
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Spec table */}
        <div className="mt-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">State</th>
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Indicator</th>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">Connected</td>
                <td className="py-2.5 pr-4">Green dot + last sync time</td>
                <td className="py-2.5">Manage</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">Disconnected</td>
                <td className="py-2.5 pr-4">No indicator</td>
                <td className="py-2.5">Connect (primary button)</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-foreground">Error</td>
                <td className="py-2.5 pr-4">Alert icon + error message</td>
                <td className="py-2.5">Retry</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Callout */}
        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Connector cards should always show their current state without the user having to
          click into them. The green dot and sync time build confidence that data is fresh.
          Error states must include enough detail to diagnose the issue without opening logs.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 5 — Context Scope                                    */}
      {/* ============================================================ */}
      <section id="context-scope" className="page-section">
        <p className="section-label mb-3">Access</p>
        <h2 className="text-xl font-semibold tracking-tight">Context Scope</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Define which documents and evaluation artifacts the agent can access.
          Narrower scopes reduce noise; wider scopes enable cross-referencing.
        </p>

        <div className="mt-8">
          <Controls
            options={[
              { key: "device", label: "Device Only" },
              { key: "devicePP", label: "Device + PP" },
              { key: "global", label: "Global" },
            ]}
            active={scopeCtrl}
            onToggle={makeToggle(setScopeCtrl, setScopeAnimKey)}
          />

          <div className="border border-border/40 rounded-lg p-6" key={scopeAnimKey}>
            <div className="config-slide-in">
              <div className="space-y-4">
                {/* Scope indicator */}
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                    <HugeiconsIcon icon={Target01Icon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activeScope.label}</p>
                    <p className="text-xs text-muted-foreground">{activeScope.scope}</p>
                  </div>
                </div>

                {/* Document list */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Accessible documents</p>
                  <div className="space-y-2">
                    {activeScope.documents.map((doc, i) => (
                      <div
                        key={doc.name}
                        className="flex items-center gap-3 rounded-md border border-border/60 px-3 py-2 config-slide-in"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <HugeiconsIcon icon={File01Icon} size={12} strokeWidth={1.5} className="shrink-0 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-medium">{doc.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">— {doc.section}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scope size indicator */}
                <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">
                    {activeScope.documents.length} document{activeScope.documents.length !== 1 ? "s" : ""} in scope
                  </span>
                  <div className="flex items-center gap-1 ml-auto">
                    {["device", "devicePP", "global"].map((s) => (
                      <div
                        key={s}
                        className={`h-1.5 w-4 rounded-md transition-colors ${
                          (s === "device") ||
                          (s === "devicePP" && (scopeCtrl.devicePP || scopeCtrl.global)) ||
                          (s === "global" && scopeCtrl.global)
                            ? "bg-foreground/20"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spec table */}
        <div className="mt-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Scope</th>
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Documents</th>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Use case</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">Device Only</td>
                <td className="py-2.5 pr-4">2 documents</td>
                <td className="py-2.5">Focused work on a single TOE</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">Device + PP</td>
                <td className="py-2.5 pr-4">4 documents</td>
                <td className="py-2.5">Evaluating PP conformance claims</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-foreground">Global</td>
                <td className="py-2.5 pr-4">6 documents</td>
                <td className="py-2.5">Cross-referencing across full evaluation</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Callout */}
        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Context scope directly affects response quality and cost. A narrower scope
          produces faster, cheaper answers but may miss cross-document dependencies.
          For OR preparation, always use Global scope to ensure nothing is overlooked.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 6 — Export & Sharing                                 */}
      {/* ============================================================ */}
      <section id="export-sharing" className="page-section">
        <p className="section-label mb-3">Output</p>
        <h2 className="text-xl font-semibold tracking-tight">Export &amp; Sharing</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Generate evaluation deliverables in standard formats. Default shows
          available exports; the exporting state shows progress during generation.
        </p>

        <div className="mt-8">
          <Controls
            options={[
              { key: "default", label: "Default" },
              { key: "exporting", label: "Exporting" },
            ]}
            active={exportCtrl}
            onToggle={makeToggle(setExportCtrl, setExportAnimKey)}
          />

          <div className="border border-border/40 rounded-lg p-6" key={exportAnimKey}>
            <div className="config-slide-in">
              {/* Default — export options */}
              {exportCtrl.default && (
                <div className="space-y-2">
                  {EXPORT_OPTIONS.map((opt, i) => (
                    <button
                      key={opt.name}
                      onClick={() => makeToggle(setExportCtrl, setExportAnimKey)("exporting")}
                      className="w-full flex items-center gap-3 rounded-md border border-border/60 p-3 text-left transition-all duration-150 hover:border-border hover:bg-muted/30 active:scale-[0.99] config-slide-in"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                        <HugeiconsIcon icon={ArrowRight01Icon} size={12} strokeWidth={1.5} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{opt.name}</span>
                          <span className="rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                            {opt.format}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{opt.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Exporting — progress state */}
              {exportCtrl.exporting && (
                <div className="space-y-4">
                  {EXPORT_OPTIONS.map((opt, i) => {
                    const isActive = i === 0
                    const isDone = false
                    return (
                      <div
                        key={opt.name}
                        className="rounded-md border border-border/60 p-3 config-slide-in"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{opt.name}</span>
                            <span className="rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                              {opt.format}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {isActive ? "Generating…" : isDone ? "Complete" : "Queued"}
                          </span>
                        </div>
                        {isActive && (
                          <div>
                            <div className="h-1 w-full rounded-md bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-md bg-foreground/20"
                                style={{
                                  animation: "config-progress 2s ease forwards",
                                  ["--target-width" as string]: "68%",
                                }}
                              />
                            </div>
                            <div className="flex items-center justify-between mt-1.5">
                              <div className="flex items-center gap-1.5">
                                <HugeiconsIcon icon={Clock01Icon} size={11} strokeWidth={1.5} className="text-muted-foreground" />
                                <span className="text-[10px] text-muted-foreground">Compiling 23 SFR entries…</span>
                              </div>
                              <span className="text-[10px] tabular-nums text-muted-foreground">68%</span>
                            </div>
                          </div>
                        )}
                        {!isActive && (
                          <div className="h-1 w-full rounded-md bg-muted" />
                        )}
                      </div>
                    )
                  })}

                  <button
                    onClick={() => makeToggle(setExportCtrl, setExportAnimKey)("default")}
                    className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spec table */}
        <div className="mt-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Format</th>
                <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Content</th>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Audience</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">PDF Report</td>
                <td className="py-2.5 pr-4">Formatted findings and recommendations</td>
                <td className="py-2.5">Evaluators and certification body</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 font-medium text-foreground">Evidence Package</td>
                <td className="py-2.5 pr-4">Complete evidence bundle (ZIP)</td>
                <td className="py-2.5">Lab submission</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-foreground">Compliance Matrix</td>
                <td className="py-2.5 pr-4">SFR-to-evidence mapping</td>
                <td className="py-2.5">Internal tracking and OR prep</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Callout */}
        <div className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Export formats should match what certification bodies expect. The PDF report
          follows the ETR template structure. Evidence packages use the lab's required
          naming conventions. Always show progress for exports since they can take
          several seconds for large evaluations.
        </div>
      </section>
    </article>
  )
}
