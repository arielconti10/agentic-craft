import { useState, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Tick01Icon,
  Cancel01Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  Copy01Icon,
  File01Icon,
  Note01Icon,
  Comment01Icon,
  LinkSquare01Icon,
  Clock01Icon,
  SortByDownIcon,
  SortByUpIcon,
  Shield01Icon,
  Alert01Icon,
} from "@hugeicons/core-free-icons"

/* ------------------------------------------------------------------ */
/*  CSS Keyframes                                                      */
/* ------------------------------------------------------------------ */

const STYLE_ID = "previews-page-styles"
function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement("style")
  style.id = STYLE_ID
  style.textContent = `
    @keyframes previews-slide-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes previews-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes previews-press {
      0% { transform: scale(1); }
      50% { transform: scale(0.97); }
      100% { transform: scale(1); }
    }
    @keyframes previews-expand {
      from { max-height: 0; opacity: 0; }
      to { max-height: 800px; opacity: 1; }
    }
    @keyframes previews-highlight {
      0% { background-color: oklch(0.85 0.05 85); }
      100% { background-color: transparent; }
    }
    @keyframes previews-copied {
      0% { opacity: 0; transform: translateY(4px); }
      20% { opacity: 1; transform: translateY(0); }
      80% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-4px); }
    }
    .previews-slide-in {
      animation: previews-slide-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    .previews-fade-in {
      animation: previews-fade-in 0.2s ease forwards;
    }
    .previews-press {
      animation: previews-press 0.15s ease;
    }
    .previews-expand {
      animation: previews-expand 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      overflow: hidden;
    }
    .previews-highlight {
      animation: previews-highlight 1.5s ease forwards;
    }
    .previews-copied {
      animation: previews-copied 1.2s ease forwards;
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
/*  Agent prose style                                                  */
/* ------------------------------------------------------------------ */

const agentProseStyle: React.CSSProperties = {
  fontFamily: "'Source Serif 4', serif",
  fontSize: "16px",
  lineHeight: "26px",
  letterSpacing: "-0.4px",
  fontVariationSettings: '"opsz" 12',
  color: "oklch(0.2642 0.013 93.9)",
}

/* ------------------------------------------------------------------ */
/*  Section 1 — Approval Modal                                         */
/* ------------------------------------------------------------------ */

function ApprovalModalSection() {
  const [mode, setMode] = useState<Record<string, boolean>>({ pending: true, approved: false, rejected: false })
  const [animKey, setAnimKey] = useState(0)
  const [rejectionReason, setRejectionReason] = useState("")

  function toggle(key: string) {
    setMode({ pending: false, approved: false, rejected: false, [key]: true })
    setAnimKey((k) => k + 1)
    setRejectionReason("")
  }

  return (
    <section className="page-section">
      <p className="section-label mb-3">DECISIONS</p>
      <h2 className="text-xl font-semibold tracking-tight">Approval Modal</h2>
      <p className="mt-2 mb-6 text-sm text-muted-foreground max-w-[600px]">
        Captures evaluator decisions on proposed actions with clear accept/reject flows and optional rationale.
      </p>

      <Controls
        options={[
          { key: "pending", label: "Pending" },
          { key: "approved", label: "Approved" },
          { key: "rejected", label: "Rejected" },
        ]}
        active={mode}
        onToggle={toggle}
      />

      <div className="border border-border/40 rounded-lg p-6" key={animKey}>
        <div className="previews-slide-in max-w-md mx-auto">
          {/* Modal card */}
          <div className="rounded-lg border border-border bg-background shadow-sm">
            {/* Header */}
            <div className="px-5 py-4 border-b border-border/60">
              <p className="text-sm font-medium">Confirm Action</p>
              <p className="text-xs text-muted-foreground mt-1">
                Update conformance claim from EAL4+ to EAL5 for TOE network module
              </p>
            </div>

            {/* Body */}
            <div className="px-5 py-4">
              <div className="rounded-md bg-muted/30 p-3 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current level</span>
                  <span>EAL4+ augmented</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Proposed level</span>
                  <span>EAL5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Affected SFRs</span>
                  <span>12 requirements</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Impact</span>
                  <span>ADV_IMP.1, ALC_TAT.2 now required</span>
                </div>
              </div>

              {mode.approved && (
                <div className="mt-4 previews-fade-in flex items-center gap-2 rounded-md bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700">
                  <HugeiconsIcon icon={Tick01Icon} size={14} strokeWidth={1.5} />
                  <span>Approved — conformance claim updated to EAL5</span>
                </div>
              )}

              {mode.rejected && (
                <div className="mt-4 previews-fade-in space-y-3">
                  <div className="flex items-center gap-2 rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-700">
                    <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={1.5} />
                    <span>Rejected — no changes applied</span>
                  </div>
                  <textarea
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:ring-1 focus:ring-foreground/20"
                    placeholder="Optional: reason for rejection…"
                    rows={2}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-border/60 flex justify-end gap-2">
              {mode.pending && (
                <>
                  <button
                    onClick={() => toggle("rejected")}
                    className="px-3 py-1.5 rounded-md border border-border text-xs text-muted-foreground hover:bg-muted/50 transition-colors active:scale-[0.97]"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => toggle("approved")}
                    className="px-3 py-1.5 rounded-md bg-foreground text-background text-xs hover:opacity-90 transition-all active:scale-[0.97]"
                  >
                    Approve
                  </button>
                </>
              )}
              {(mode.approved || mode.rejected) && (
                <button
                  onClick={() => toggle("pending")}
                  className="px-3 py-1.5 rounded-md border border-border text-xs text-muted-foreground hover:bg-muted/50 transition-colors active:scale-[0.97]"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spec table */}
      <table className="w-full text-sm mt-6">
        <thead>
          <tr className="border-b border-border/40">
            <th className="text-left py-2 text-xs font-medium text-muted-foreground w-1/3">Property</th>
            <th className="text-left py-2 text-xs font-medium text-muted-foreground">Value</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          <tr className="border-b border-border/20">
            <td className="py-2 text-muted-foreground">States</td>
            <td className="py-2">Pending, Approved, Rejected</td>
          </tr>
          <tr className="border-b border-border/20">
            <td className="py-2 text-muted-foreground">Rejection reason</td>
            <td className="py-2">Optional textarea, freeform</td>
          </tr>
          <tr className="border-b border-border/20">
            <td className="py-2 text-muted-foreground">Confirmation style</td>
            <td className="py-2">Inline status with icon</td>
          </tr>
          <tr className="border-b border-border/20">
            <td className="py-2 text-muted-foreground">Animation</td>
            <td className="py-2">Fade in on state change</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
        Approval modals gate irreversible actions. The evaluator sees exactly what will change before committing,
        reducing accidental updates to conformance claims and SFR mappings.
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 2 — Document Preview                                       */
/* ------------------------------------------------------------------ */

function DocumentPreviewSection() {
  const [mode, setMode] = useState<Record<string, boolean>>({ collapsed: true, expanded: false, annotated: false })
  const [animKey, setAnimKey] = useState(0)

  function toggle(key: string) {
    setMode({ collapsed: false, expanded: false, annotated: false, [key]: true })
    setAnimKey((k) => k + 1)
  }

  const annotations = [
    { line: 2, text: "Verify this aligns with ST Section 6.1 claims" },
    { line: 5, text: "Missing rationale for FCS_COP.1 key size selection" },
  ]

  return (
    <section className="page-section">
      <p className="section-label mb-3">CONTENT</p>
      <h2 className="text-xl font-semibold tracking-tight">Document Preview</h2>
      <p className="mt-2 mb-6 text-sm text-muted-foreground max-w-[600px]">
        Inline preview of evaluation evidence with collapsible sections and agent annotations.
      </p>

      <Controls
        options={[
          { key: "collapsed", label: "Collapsed" },
          { key: "expanded", label: "Expanded" },
          { key: "annotated", label: "With Annotations" },
        ]}
        active={mode}
        onToggle={toggle}
      />

      <div className="border border-border/40 rounded-lg p-6" key={animKey}>
        <div className="previews-slide-in max-w-lg mx-auto">
          {/* Document card */}
          <div className="rounded-lg border border-border bg-background">
            {/* Card header — always visible */}
            <button
              onClick={() => {
                if (mode.collapsed) toggle("expanded")
                else if (mode.expanded) toggle("collapsed")
                else toggle("collapsed")
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors rounded-lg"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-md bg-muted/50 flex items-center justify-center">
                <HugeiconsIcon icon={File01Icon} size={14} strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Security Target — Network Module v2.3</p>
                <p className="text-xs text-muted-foreground">PDF · 47 pages · Updated 2 days ago</p>
              </div>
              <HugeiconsIcon
                icon={mode.collapsed ? ArrowRight01Icon : ArrowDown01Icon}
                size={14}
                strokeWidth={1.5}
                className="text-muted-foreground flex-shrink-0"
              />
            </button>

            {/* Expanded content */}
            {(mode.expanded || mode.annotated) && (
              <div className="previews-expand border-t border-border/40">
                <div className="px-4 py-4 space-y-3">
                  {/* Simulated document lines */}
                  {[
                    "1.1 ST Reference — This Security Target is identified as Network Module ST v2.3, prepared for CC evaluation at EAL4+.",
                    "1.2 TOE Reference — The Target of Evaluation is the NM-2300 Network Filtering Module, firmware version 4.1.7.",
                    "2.1 CC Conformance Claim — The TOE claims conformance to CC Part 2 extended and CC Part 3 conformant, with EAL4 augmented by ALC_FLR.2.",
                    "3.1 Security Problem Definition — The TOE operates in a network environment where unauthorized access to filtered traffic constitutes the primary threat.",
                    "4.1 Security Objectives — O.FILTER: The TOE shall enforce packet filtering rules based on configured policies for all ingress traffic.",
                  ].map((line, i) => (
                    <div key={i} className="relative group">
                      <p
                        style={agentProseStyle}
                        className={`text-sm leading-relaxed ${
                          mode.annotated && annotations.some((a) => a.line === i)
                            ? "bg-amber-500/10 -mx-2 px-2 py-0.5 rounded"
                            : ""
                        }`}
                      >
                        {line}
                      </p>
                      {mode.annotated && annotations.find((a) => a.line === i) && (
                        <div className="previews-fade-in mt-1 ml-4 flex items-start gap-2 text-xs text-amber-700">
                          <HugeiconsIcon icon={Comment01Icon} size={12} strokeWidth={1.5} className="mt-0.5 flex-shrink-0" />
                          <span className="italic">{annotations.find((a) => a.line === i)!.text}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spec table */}
      <table className="w-full text-sm mt-6">
        <thead>
          <tr className="border-b border-border/40">
            <th className="text-left py-2 text-xs font-medium text-muted-foreground w-1/3">Property</th>
            <th className="text-left py-2 text-xs font-medium text-muted-foreground">Value</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          <tr className="border-b border-border/20">
            <td className="py-2 text-muted-foreground">States</td>
            <td className="py-2">Collapsed, Expanded, Annotated</td>
          </tr>
          <tr className="border-b border-border/20">
            <td className="py-2 text-muted-foreground">Metadata shown</td>
            <td className="py-2">Type, page count, last modified</td>
          </tr>
          <tr className="border-b border-border/20">
            <td className="py-2 text-muted-foreground">Annotations</td>
            <td className="py-2">Inline highlights with agent comments</td>
          </tr>
          <tr className="border-b border-border/20">
            <td className="py-2 text-muted-foreground">Animation</td>
            <td className="py-2">Expand 300ms ease, fade in for annotations</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
        Document previews let evaluators verify referenced evidence without leaving the current context.
        Annotations surface agent observations directly alongside the source material.
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 3 — Diff Viewer                                            */
/* ------------------------------------------------------------------ */

type DiffLine = {
  type: "context" | "add" | "remove"
  content: string
}

const diffData: DiffLine[] = [
  { type: "context", content: "FCS_COP.1 Cryptographic Operation" },
  { type: "context", content: "" },
  { type: "remove", content: "The TSF shall perform encryption/decryption in accordance" },
  { type: "remove", content: "with AES-CBC-128 as specified in NIST SP 800-38A." },
  { type: "add", content: "The TSF shall perform authenticated encryption in accordance" },
  { type: "add", content: "with AES-GCM-256 as specified in NIST SP 800-38D." },
  { type: "context", content: "" },
  { type: "context", content: "Application note: The key size was increased to meet updated" },
  { type: "remove", content: "PP requirements for network filtering modules." },
  { type: "add", content: "PP requirements and ITSEF guidance for network filtering modules." },
  { type: "add", content: "The mode change from CBC to GCM provides AEAD capability." },
  { type: "context", content: "" },
  { type: "context", content: "FCS_COP.1.1 refinement: The TOE shall use validated" },
  { type: "context", content: "cryptographic implementations per FCS_COP.1/KeyedHash." },
]

function DiffViewerSection() {
  const [mode, setMode] = useState<Record<string, boolean>>({ sideBySide: true, inline: false })
  const [animKey, setAnimKey] = useState(0)

  function toggle(key: string) {
    setMode({ sideBySide: false, inline: false, [key]: true })
    setAnimKey((k) => k + 1)
  }

  return (
    <section className="page-section">
      <p className="section-label mb-3">COMPARISON</p>
      <h2 className="text-xl font-semibold tracking-tight">Diff Viewer</h2>
      <p className="mt-2 mb-6 text-sm text-muted-foreground max-w-[600px]">
        Side-by-side and inline views for comparing document revisions and SFR updates.
      </p>

      <Controls
        options={[
          { key: "sideBySide", label: "Side by Side" },
          { key: "inline", label: "Inline" },
        ]}
        active={mode}
        onToggle={toggle}
      />

      <div className="border border-border/40 rounded-lg p-6 overflow-x-auto" key={animKey}>
        <div className="previews-slide-in">
          {mode.sideBySide ? (
            <div className="grid grid-cols-2 gap-0 text-xs font-mono rounded-md border border-border overflow-hidden">
              {/* Headers */}
              <div className="px-3 py-2 bg-muted/40 border-b border-r border-border text-muted-foreground font-sans text-xs">
                Previous revision
              </div>
              <div className="px-3 py-2 bg-muted/40 border-b border-border text-muted-foreground font-sans text-xs">
                Current revision
              </div>
              {/* Lines */}
              {(() => {
                const oldLines = diffData.filter((l) => l.type !== "add")
                const newLines = diffData.filter((l) => l.type !== "remove")
                const maxLen = Math.max(oldLines.length, newLines.length)
                return Array.from({ length: maxLen }).map((_, i) => {
                  const ol = oldLines[i]
                  const nl = newLines[i]
                  return (
                    <div key={i} className="contents">
                      <div
                        className={`px-3 py-1 border-b border-r border-border/30 ${
                          ol?.type === "remove" ? "bg-red-500/8 text-red-800" : ""
                        }`}
                      >
                        {ol?.type === "remove" ? (
                          <span className="line-through opacity-70">{ol.content || "\u00A0"}</span>
                        ) : (
                          <span>{ol?.content || "\u00A0"}</span>
                        )}
                      </div>
                      <div
                        className={`px-3 py-1 border-b border-border/30 ${
                          nl?.type === "add" ? "bg-emerald-500/8 text-emerald-800" : ""
                        }`}
                      >
                        {nl?.content || "\u00A0"}
                      </div>
                    </div>
                  )
                })
              })()}
            </div>
          ) : (
            <div className="text-xs font-mono rounded-md border border-border overflow-hidden">
              <div className="px-3 py-2 bg-muted/40 border-b border-border text-muted-foreground font-sans text-xs">
                Inline diff — FCS_COP.1
              </div>
              {diffData.map((line, i) => (
                <div
                  key={i}
                  className={`px-3 py-1 border-b border-border/20 ${
                    line.type === "add"
                      ? "bg-emerald-500/8 text-emerald-800"
                      : line.type === "remove"
                        ? "bg-red-500/8 text-red-800"
                        : ""
                  }`}
                >
                  <span className="inline-block w-4 text-muted-foreground/60 select-none mr-2">
                    {line.type === "add" ? "+" : line.type === "remove" ? "−" : " "}
                  </span>
                  {line.type === "remove" ? (
                    <span className="line-through opacity-70">{line.content || "\u00A0"}</span>
                  ) : (
                    <span>{line.content || "\u00A0"}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Spec table */}
      <table className="w-full text-sm mt-6">
        <thead>
          <tr className="border-b border-border/40">
            <th className="text-left py-2 text-xs font-medium text-muted-foreground w-1/3">Property</th>
            <th className="text-left py-2 text-xs font-medium text-muted-foreground">Value</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          <tr className="border-b border-border/20">
            <td className="py-2 text-muted-foreground">Modes</td>
            <td className="py-2">Side by side, Inline</td>
          </tr>
          <tr className="border-b border-border/20">
            <td className="py-2 text-muted-foreground">Addition style</td>
            <td className="py-2">Green background, + prefix (inline)</td>
          </tr>
          <tr className="border-b border-border/20">
            <td className="py-2 text-muted-foreground">Removal style</td>
            <td className="py-2">Red background, strikethrough, − prefix</td>
          </tr>
          <tr className="border-b border-border/20">
            <td className="py-2 text-muted-foreground">Font</td>
            <td className="py-2">Monospace, text-xs</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
        Diff views are essential when the agent proposes edits to SFRs or evaluation evidence.
        Evaluators can verify each change before it modifies the Security Target.
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 4 — Code Block                                             */
/* ------------------------------------------------------------------ */

const codeContent = `<!-- ADV_FSP.4: Functional Specification -->
<security-function id="SF.FILTER">
  <interface name="packet_filter_apply">
    <param name="rule_set" type="FilterPolicy" />
    <param name="traffic" type="NetworkPacket" />
    <returns type="FilterResult" />
  </interface>
  <rationale>
    Implements O.FILTER objective per Section 4.1
    of the Security Target (NM-2300 v4.1.7).
  </rationale>
</security-function>`

const codeLines = codeContent.split("\n")

function CodeBlockSection() {
  const [mode, setMode] = useState<Record<string, boolean>>({ default: true, lineNumbers: false, withCopy: false })
  const [animKey, setAnimKey] = useState(0)
  const [copied, setCopied] = useState(false)

  function toggle(key: string) {
    setMode({ default: false, lineNumbers: false, withCopy: false, [key]: true })
    setAnimKey((k) => k + 1)
    setCopied(false)
  }

  function handleCopy() {
    navigator.clipboard.writeText(codeContent).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    }).catch(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    })
  }

  const showLineNumbers = mode.lineNumbers || mode.withCopy
  const showCopy = mode.withCopy

  return (
    <section className="page-section">
      <p className="section-label mb-3">CODE</p>
      <h2 className="text-xl font-semibold tracking-tight">Code Block</h2>
      <p className="mt-2 mb-6 text-sm text-muted-foreground max-w-[600px]">
        Formatted code and markup display with optional line numbers and clipboard integration.
      </p>

      <Controls
        options={[
          { key: "default", label: "Default" },
          { key: "lineNumbers", label: "With Line Numbers" },
          { key: "withCopy", label: "With Copy" },
        ]}
        active={mode}
        onToggle={toggle}
      />

      <div className="border border-border/40 rounded-lg p-6" key={animKey}>
        <div className="previews-slide-in max-w-2xl mx-auto">
          <div className="rounded-md border border-border overflow-hidden bg-muted/20">
            {/* Header bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-muted/40 border-b border-border">
              <span className="text-xs text-muted-foreground">adv_fsp_functional_spec.xml</span>
              {showCopy && (
                <button
                  onClick={handleCopy}
                  className="relative flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors active:scale-[0.97]"
                >
                  {copied ? (
                    <span className="previews-copied flex items-center gap-1">
                      <HugeiconsIcon icon={Tick01Icon} size={12} strokeWidth={1.5} />
                      Copied
                    </span>
                  ) : (
                    <>
                      <HugeiconsIcon icon={Copy01Icon} size={12} strokeWidth={1.5} />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>
            {/* Code body */}
            <div className="overflow-x-auto">
              <pre className="text-xs leading-5 p-3">
                {codeLines.map((line, i) => (
                  <div key={i} className="flex">
                    {showLineNumbers && (
                      <span className="inline-block w-8 text-right pr-3 text-muted-foreground/40 select-none flex-shrink-0">
                        {i + 1}
                      </span>
                    )}
                    <code>{line}</code>
                  </div>
                ))}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Spec table */}
      <table className="w-full text-sm mt-6">
        <thead>
          <tr className="border-b border-border/40">
            <th className="text-left py-2 text-xs font-medium text-muted-foreground w-1/3">Property</th>
            <th className="text-left py-2 text-xs font-medium text-muted-foreground">Value</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          <tr className="border-b border-border/20">
            <td className="py-2 text-muted-foreground">Font</td>
            <td className="py-2">Monospace, text-xs</td>
          </tr>
          <tr className="border-b border-border/20">
            <td className="py-2 text-muted-foreground">Line numbers</td>
            <td className="py-2">Optional, right-aligned, muted</td>
          </tr>
          <tr className="border-b border-border/20">
            <td className="py-2 text-muted-foreground">Copy feedback</td>
            <td className="py-2">"Copied" text with check icon, 1.2s</td>
          </tr>
          <tr className="border-b border-border/20">
            <td className="py-2 text-muted-foreground">Header</td>
            <td className="py-2">Filename label, muted background</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
        Code blocks display evaluation evidence markup, configuration fragments, and functional specifications
        that evaluators reference during CC assessments.
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 5 — Data Table                                             */
/* ------------------------------------------------------------------ */

type SfrRow = {
  id: string
  family: string
  component: string
  status: "Satisfied" | "Partially Met" | "Not Evaluated"
  details: string
}

const sfrData: SfrRow[] = [
  {
    id: "FCS_COP.1",
    family: "Cryptographic Operation",
    component: "FCS_COP.1/AES",
    status: "Satisfied",
    details: "AES-GCM-256 validated via CAVP certificate #A4821. Key generation per FCS_CKM.1.",
  },
  {
    id: "FDP_ACF.1",
    family: "Access Control Functions",
    component: "FDP_ACF.1/Filter",
    status: "Satisfied",
    details: "Packet filtering rules enforce security policy per O.FILTER. Test evidence in ATE_FUN.1 workunit 3.",
  },
  {
    id: "FAU_GEN.1",
    family: "Audit Data Generation",
    component: "FAU_GEN.1/Basic",
    status: "Partially Met",
    details: "Audit records generated for start/stop and filtering decisions. Missing: timestamp granularity below 1 second.",
  },
  {
    id: "FCS_CKM.2",
    family: "Cryptographic Key Distribution",
    component: "FCS_CKM.2/TLS",
    status: "Satisfied",
    details: "Key establishment via TLS 1.3 per RFC 8446. Ephemeral ECDHE with P-384 curve.",
  },
  {
    id: "ALC_FLR.2",
    family: "Flaw Remediation",
    component: "ALC_FLR.2/Procedures",
    status: "Not Evaluated",
    details: "Flaw remediation procedures documented but evaluation pending ITSEF review of developer process.",
  },
]

function DataTableSection() {
  const [mode, setMode] = useState<Record<string, boolean>>({ default: true, sortable: false, expandable: false })
  const [animKey, setAnimKey] = useState(0)
  const [sortCol, setSortCol] = useState<"id" | "family" | "status" | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  function toggle(key: string) {
    setMode({ default: false, sortable: false, expandable: false, [key]: true })
    setAnimKey((k) => k + 1)
    setSortCol(null)
    setSortDir("asc")
    setExpandedRow(null)
  }

  function handleSort(col: "id" | "family" | "status") {
    if (!mode.sortable) return
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortCol(col)
      setSortDir("asc")
    }
  }

  const sortedData = [...sfrData]
  if (sortCol) {
    sortedData.sort((a, b) => {
      const va = a[sortCol]
      const vb = b[sortCol]
      const cmp = va.localeCompare(vb)
      return sortDir === "asc" ? cmp : -cmp
    })
  }

  return (
    <section className="page-section">
      <p className="section-label mb-3">DATA</p>
      <h2 className="text-xl font-semibold tracking-tight">Data Table</h2>
      <p className="mt-2 mb-6 text-sm text-muted-foreground max-w-[600px]">
        Tabular display for SFR requirements, evaluation results, and structured evidence data.
      </p>

      <Controls
        options={[
          { key: "default", label: "Default" },
          { key: "sortable", label: "Sortable" },
          { key: "expandable", label: "Expandable Rows" },
        ]}
        active={mode}
        onToggle={toggle}
      />

      <div className="border border-border/40 rounded-lg p-6 overflow-x-auto" key={animKey}>
        <div className="previews-slide-in">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th
                  className={`text-left py-2 px-3 text-xs font-medium text-muted-foreground ${mode.sortable ? "cursor-pointer hover:text-foreground select-none" : ""}`}
                  onClick={() => handleSort("id")}
                >
                  <span className="flex items-center gap-1">
                    SFR ID
                    {mode.sortable && sortCol === "id" && (
                      <HugeiconsIcon icon={sortDir === "asc" ? SortByUpIcon : SortByDownIcon} size={12} strokeWidth={1.5} />
                    )}
                  </span>
                </th>
                <th
                  className={`text-left py-2 px-3 text-xs font-medium text-muted-foreground ${mode.sortable ? "cursor-pointer hover:text-foreground select-none" : ""}`}
                  onClick={() => handleSort("family")}
                >
                  <span className="flex items-center gap-1">
                    Family
                    {mode.sortable && sortCol === "family" && (
                      <HugeiconsIcon icon={sortDir === "asc" ? SortByUpIcon : SortByDownIcon} size={12} strokeWidth={1.5} />
                    )}
                  </span>
                </th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Component</th>
                <th
                  className={`text-left py-2 px-3 text-xs font-medium text-muted-foreground ${mode.sortable ? "cursor-pointer hover:text-foreground select-none" : ""}`}
                  onClick={() => handleSort("status")}
                >
                  <span className="flex items-center gap-1">
                    Status
                    {mode.sortable && sortCol === "status" && (
                      <HugeiconsIcon icon={sortDir === "asc" ? SortByUpIcon : SortByDownIcon} size={12} strokeWidth={1.5} />
                    )}
                  </span>
                </th>
                {mode.expandable && (
                  <th className="w-8" />
                )}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row) => (
                <TableRow
                  key={row.id}
                  row={row}
                  expandable={mode.expandable}
                  expanded={expandedRow === row.id}
                  onToggle={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Spec table */}
      <table className="w-full text-sm mt-6">
        <thead>
          <tr className="border-b border-border/40">
            <th className="text-left py-2 text-xs font-medium text-muted-foreground w-1/3">Property</th>
            <th className="text-left py-2 text-xs font-medium text-muted-foreground">Value</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          <tr className="border-b border-border/20">
            <td className="py-2 text-muted-foreground">Sorting</td>
            <td className="py-2">Click column header, toggles asc/desc</td>
          </tr>
          <tr className="border-b border-border/20">
            <td className="py-2 text-muted-foreground">Expandable rows</td>
            <td className="py-2">Click row to reveal details section</td>
          </tr>
          <tr className="border-b border-border/20">
            <td className="py-2 text-muted-foreground">Status indicators</td>
            <td className="py-2">Color-coded: green, amber, muted</td>
          </tr>
          <tr className="border-b border-border/20">
            <td className="py-2 text-muted-foreground">Animation</td>
            <td className="py-2">Expand 300ms ease for detail rows</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
        Data tables present evaluation verdicts at a glance. Sortable columns help evaluators prioritize
        by status, while expandable rows surface detailed rationale without leaving the summary view.
      </div>
    </section>
  )
}

function TableRow({
  row,
  expandable,
  expanded,
  onToggle,
}: {
  row: SfrRow
  expandable: boolean
  expanded: boolean
  onToggle: () => void
}) {
  const statusColor =
    row.status === "Satisfied"
      ? "text-emerald-700"
      : row.status === "Partially Met"
        ? "text-amber-700"
        : "text-muted-foreground"

  const statusIcon =
    row.status === "Satisfied"
      ? Tick01Icon
      : row.status === "Partially Met"
        ? Alert01Icon
        : Clock01Icon

  return (
    <>
      <tr
        className={`border-b border-border/20 ${expandable ? "cursor-pointer hover:bg-muted/20 transition-colors" : ""}`}
        onClick={expandable ? onToggle : undefined}
      >
        <td className="py-2.5 px-3 text-sm font-mono">{row.id}</td>
        <td className="py-2.5 px-3 text-sm">{row.family}</td>
        <td className="py-2.5 px-3 text-sm text-muted-foreground">{row.component}</td>
        <td className={`py-2.5 px-3 text-sm ${statusColor}`}>
          <span className="flex items-center gap-1.5">
            <HugeiconsIcon icon={statusIcon} size={12} strokeWidth={1.5} />
            {row.status}
          </span>
        </td>
        {expandable && (
          <td className="py-2.5 px-1">
            <HugeiconsIcon
              icon={expanded ? ArrowDown01Icon : ArrowRight01Icon}
              size={12}
              strokeWidth={1.5}
              className="text-muted-foreground"
            />
          </td>
        )}
      </tr>
      {expandable && expanded && (
        <tr>
          <td colSpan={5} className="px-3 py-0">
            <div className="previews-expand py-3 pl-4 border-l-2 border-foreground/10">
              <p className="text-xs text-muted-foreground leading-relaxed">{row.details}</p>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 6 — Rich Card                                              */
/* ------------------------------------------------------------------ */

function RichCardSection() {
  const [mode, setMode] = useState<Record<string, boolean>>({ compact: true, detailed: false })
  const [animKey, setAnimKey] = useState(0)

  function toggle(key: string) {
    setMode({ compact: false, detailed: false, [key]: true })
    setAnimKey((k) => k + 1)
  }

  const cards = [
    {
      title: "Protection Profile — Network Filtering v1.2",
      source: "CCRA Portal",
      icon: Shield01Icon,
      excerpt: "Defines security requirements for network packet filtering devices operating at EAL4+ with ALC_FLR.2 augmentation. Covers FCS_COP, FDP_ACF, and FAU_GEN families.",
      date: "Published 2025-11-14",
      relevance: 94,
    },
    {
      title: "ITSEF Guidance — Cryptographic Evaluation",
      source: "BSI Technical Reference",
      icon: File01Icon,
      excerpt: "Provides evaluation methodology for FCS family requirements including CAVP certificate validation, key management assessment, and entropy source testing procedures.",
      date: "Updated 2026-01-08",
      relevance: 87,
    },
    {
      title: "ALC_FLR.2 — Flaw Remediation Procedures",
      source: "Evaluation Evidence Library",
      icon: Note01Icon,
      excerpt: "Developer's flaw remediation process documentation including vulnerability intake, triage workflow, patch distribution timeline, and user notification procedures.",
      date: "Submitted 2026-02-20",
      relevance: 72,
    },
  ]

  return (
    <section className="page-section">
      <p className="section-label mb-3">REFERENCES</p>
      <h2 className="text-xl font-semibold tracking-tight">Rich Card</h2>
      <p className="mt-2 mb-6 text-sm text-muted-foreground max-w-[600px]">
        Preview cards for linked resources showing source, relevance, and excerpts.
      </p>

      <Controls
        options={[
          { key: "compact", label: "Compact" },
          { key: "detailed", label: "Detailed" },
        ]}
        active={mode}
        onToggle={toggle}
      />

      <div className="border border-border/40 rounded-lg p-6" key={animKey}>
        <div className="previews-slide-in space-y-3 max-w-lg mx-auto">
          {cards.map((card, i) => (
            <div
              key={i}
              className="rounded-md border border-border bg-background hover:border-foreground/20 transition-colors cursor-pointer group"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="px-4 py-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-md bg-muted/50 flex items-center justify-center mt-0.5">
                    <HugeiconsIcon icon={card.icon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-foreground transition-colors">
                      {card.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{card.source}</span>
                      {mode.detailed && (
                        <span className="text-xs text-muted-foreground/60">·</span>
                      )}
                      {mode.detailed && (
                        <span className="text-xs text-muted-foreground">{card.date}</span>
                      )}
                    </div>

                    {mode.detailed && (
                      <div className="previews-fade-in mt-2 space-y-2">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {card.excerpt}
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <div className="h-1 w-16 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-foreground/40"
                                style={{ width: `${card.relevance}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-muted-foreground">{card.relevance}%</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground">relevance</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <HugeiconsIcon
                    icon={LinkSquare01Icon}
                    size={12}
                    strokeWidth={1.5}
                    className="text-muted-foreground/40 flex-shrink-0 mt-1 group-hover:text-muted-foreground transition-colors"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spec table */}
      <table className="w-full text-sm mt-6">
        <thead>
          <tr className="border-b border-border/40">
            <th className="text-left py-2 text-xs font-medium text-muted-foreground w-1/3">Property</th>
            <th className="text-left py-2 text-xs font-medium text-muted-foreground">Value</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          <tr className="border-b border-border/20">
            <td className="py-2 text-muted-foreground">Compact</td>
            <td className="py-2">Title, source, icon</td>
          </tr>
          <tr className="border-b border-border/20">
            <td className="py-2 text-muted-foreground">Detailed</td>
            <td className="py-2">+ excerpt, date, relevance score bar</td>
          </tr>
          <tr className="border-b border-border/20">
            <td className="py-2 text-muted-foreground">Hover</td>
            <td className="py-2">Border darkens, link icon brightens</td>
          </tr>
          <tr className="border-b border-border/20">
            <td className="py-2 text-muted-foreground">Relevance</td>
            <td className="py-2">Progress bar + percentage label</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
        Rich cards surface linked documents inline so evaluators can gauge relevance before navigating away.
        The relevance score reflects how closely the resource matches the current evaluation context.
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PreviewsPage() {
  useEffect(() => { ensureStyles() }, [])

  return (
    <article>
      <header className="mb-20">
        <h1 className="font-serif text-4xl font-light tracking-tight leading-[1.15]">
          Previews &amp; Artifacts
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Rich content previews for documents, diffs, code, data, and linked resources
          that evaluators interact with during Common Criteria assessments.
        </p>
      </header>

      <ApprovalModalSection />
      <DocumentPreviewSection />
      <DiffViewerSection />
      <CodeBlockSection />
      <DataTableSection />
      <RichCardSection />
    </article>
  )
}
