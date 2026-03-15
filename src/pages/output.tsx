import { useState, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Copy01Icon,
  File01Icon,
  Download01Icon,
  Note01Icon,
  Pdf01Icon,
  Shield01Icon,
  EyeIcon,
  ArrowExpandIcon,
  ArrowShrinkIcon,
  StructureCheckIcon,
} from "@hugeicons/core-free-icons"

/* ------------------------------------------------------------------ */
/*  CSS Keyframes                                                      */
/* ------------------------------------------------------------------ */

const STYLE_ID = "output-page-styles"
function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement("style")
  style.id = STYLE_ID
  style.textContent = `
    @keyframes out-slide-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes out-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .out-slide-in {
      animation: out-slide-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    .out-fade-in {
      animation: out-fade-in 0.2s ease forwards;
    }
  `
  document.head.appendChild(style)
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const AGENT_PROSE_STYLE = {
  fontFamily: "'Source Serif 4', serif",
  fontSize: "16px",
  lineHeight: "26px",
  letterSpacing: "-0.4px",
  fontVariationSettings: '"opsz" 12',
  WebkitFontSmoothing: "antialiased" as const,
}

const AGENT_PROSE_COLOR = "oklch(0.2642 0.013 93.9)"

const COVERAGE_MATRIX = `Coverage Matrix: Security Target v3.2 — EAL4+

SFR Class     | Components | Tested | Coverage
------------- | ---------- | ------ | --------
FCS (Crypto)  |          4 |      4 |    100%
FDP (Data)    |          3 |      2 |     67%
FIA (Auth)    |          2 |      2 |    100%
FPT (Protect) |          3 |      1 |     33%
FMT (Manage)  |          2 |      2 |    100%

Overall: 14 SFRs, 11 verified, 78.6% coverage
Unresolved: FDP_RIP.1, FPT_FLS.1, FPT_RCV.1`

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

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Output() {
  useEffect(ensureStyles, [])

  /* ── Section 1: Document Output ── */
  const [docCtrl, setDocCtrl] = useState<Record<string, boolean>>({
    inline: true,
    downloadCard: false,
  })
  const [docAnim, setDocAnim] = useState(0)
  const docToggle = makeToggle(setDocCtrl, setDocAnim)

  /* ── Section 2: Artifact Preview ── */
  const [artifactCtrl, setArtifactCtrl] = useState<Record<string, boolean>>({
    collapsed: true,
    expanded: false,
  })
  const [artifactAnim, setArtifactAnim] = useState(0)
  const artifactToggle = makeToggle(setArtifactCtrl, setArtifactAnim)

  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-4">Patterns</p>
        <h1 className="font-serif text-4xl font-light tracking-tight leading-[1.15]">
          Output
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Patterns for previewing and reviewing agent-generated artifacts
          before they are finalized — inline document rendering and
          expandable artifact cards.
        </p>
      </header>

      {/* ============================================================ */}
      {/*  Section 1 — Document Output                                  */}
      {/* ============================================================ */}
      <section id="document-output" className="page-section">
        <p className="section-label mb-3">Documents</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Document Output
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Agent-generated documents rendered inline for review or as
          downloadable file cards. Inline view preserves reading flow;
          download cards are for artifacts that belong outside the conversation.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "inline", label: "Inline" },
              { key: "downloadCard", label: "Download Card" },
            ]}
            active={docCtrl}
            onToggle={docToggle}
          />

          <div key={docAnim} className="border border-border/40 rounded-lg p-6 out-slide-in">
            {docCtrl.inline && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <HugeiconsIcon icon={Note01Icon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground" style={{ fontWeight: 400 }}>
                    Evaluation Technical Report (draft)
                  </span>
                </div>
                <div className="rounded-md border border-border/40 p-5">
                  <div style={{ ...AGENT_PROSE_STYLE, color: AGENT_PROSE_COLOR }}>
                    <p className="mb-4" style={{ fontSize: "18px", fontWeight: 500 }}>
                      Evaluation Technical Report &mdash; ACME Crypto Module v2.4
                    </p>
                    <p className="mb-3">
                      This Evaluation Technical Report (ETR) documents the evaluation
                      of the ACME Cryptographic Module version 2.4 against the Common
                      Criteria for Information Technology Security Evaluation, Part 3,
                      at Evaluation Assurance Level 4 augmented with ALC_FLR.1.
                    </p>
                    <p className="mb-3">
                      The Target of Evaluation (TOE) is a hardware security module
                      providing cryptographic key generation (FCS_CKM.1), cryptographic
                      operation (FCS_COP.1), and secure key destruction (FCS_CKM.4)
                      services to authorized applications via a well-defined TSFI.
                    </p>
                    <p>
                      The evaluation was conducted in accordance with the Common
                      Evaluation Methodology (CEM) version 3.1 revision 5, and
                      all work units for the claimed assurance components have
                      been completed with a pass verdict unless otherwise noted
                      in the findings section below.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {docCtrl.downloadCard && (
              <div className="max-w-md">
                <div className="rounded-md border border-border/40 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border/40 bg-foreground/[0.02]">
                      <HugeiconsIcon icon={Pdf01Icon} size={18} strokeWidth={1.5} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        ETR_ACME_CryptoModule_v2.4_EAL4.pdf
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>PDF</span>
                        <span>2.4 MB</span>
                        <span>47 pages</span>
                      </div>
                    </div>
                    <button className="flex items-center gap-1.5 rounded-md border border-border/40 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/50">
                      <HugeiconsIcon icon={Download01Icon} size={12} strokeWidth={1.5} />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Variant
              </th>
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Content
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Use Case
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Inline", "Agent prose in serif font within bordered container", "Reading and reviewing draft content in context"],
              ["Download Card", "File metadata card with download action", "Exporting finalized documents for submission"],
            ].map(([variant, content, useCase], i) => (
              <tr key={variant} className={i < 1 ? "border-b border-border/50" : ""}>
                <td className="py-2.5 pr-6 font-medium">{variant}</td>
                <td className="py-2.5 pr-6 text-muted-foreground">{content}</td>
                <td className="py-2.5 text-muted-foreground">{useCase}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Inline rendering uses the agent prose style (Source Serif 4, 16px)
          to signal that this is generated narrative rather than UI chrome.
          Download cards are reserved for finalized artifacts that the evaluator
          will consume outside the agent interface.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 2 — Artifact Preview                                 */}
      {/* ============================================================ */}
      <section id="artifact-preview" className="page-section">
        <p className="section-label mb-3">Artifacts</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Artifact Preview
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Expandable artifact cards for generated documents and matrices.
          Collapsed view shows metadata only. Expanded view reveals the
          full content preview without leaving the conversation.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "collapsed", label: "Collapsed" },
              { key: "expanded", label: "Expanded" },
            ]}
            active={artifactCtrl}
            onToggle={artifactToggle}
          />

          <div key={artifactAnim} className="border border-border/40 rounded-lg p-6 out-slide-in">
            <div className="max-w-lg">
              {/* Artifact card */}
              <div className="rounded-md border border-border/40">
                {/* Card header — always visible */}
                <button
                  type="button"
                  onClick={() => {
                    if (artifactCtrl.collapsed) {
                      artifactToggle("expanded")
                    } else {
                      artifactToggle("collapsed")
                    }
                  }}
                  className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-muted/30 rounded-md"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/40 bg-foreground/[0.02]">
                    <HugeiconsIcon icon={Shield01Icon} size={16} strokeWidth={1.5} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      SFR Coverage Matrix
                    </p>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <HugeiconsIcon icon={StructureCheckIcon} size={10} strokeWidth={1.5} />
                        Coverage report
                      </span>
                      <span className="flex items-center gap-1">
                        <HugeiconsIcon icon={File01Icon} size={10} strokeWidth={1.5} />
                        1.2 KB
                      </span>
                    </div>
                  </div>
                  <HugeiconsIcon
                    icon={artifactCtrl.expanded ? ArrowShrinkIcon : ArrowExpandIcon}
                    size={14}
                    strokeWidth={1.5}
                    className="shrink-0 text-muted-foreground/40"
                  />
                </button>

                {/* Expanded content */}
                {artifactCtrl.expanded && (
                  <div className="border-t border-border/40 p-4 out-fade-in">
                    <div className="flex items-center gap-2 mb-3">
                      <HugeiconsIcon icon={EyeIcon} size={12} strokeWidth={1.5} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground" style={{ fontWeight: 400 }}>
                        Preview
                      </span>
                    </div>
                    <div className="rounded-md border border-border/40 bg-foreground/[0.02] p-4 overflow-x-auto">
                      <pre className="text-[12px] leading-[1.6]" style={{ fontFamily: "monospace" }}>
                        {COVERAGE_MATRIX}
                      </pre>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button className="flex items-center gap-1.5 rounded-md border border-border/40 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/50">
                        <HugeiconsIcon icon={Download01Icon} size={12} strokeWidth={1.5} />
                        Export
                      </button>
                      <button className="flex items-center gap-1.5 rounded-md border border-border/40 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/50">
                        <HugeiconsIcon icon={Copy01Icon} size={12} strokeWidth={1.5} />
                        Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                State
              </th>
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Content
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Collapsed", "Icon, title, type, and size metadata", "Click to expand"],
              ["Expanded", "Full content preview with monospace rendering", "Export, Copy, click header to collapse"],
            ].map(([state, content, actions], i) => (
              <tr key={state} className={i < 1 ? "border-b border-border/50" : ""}>
                <td className="py-2.5 pr-6 font-medium">{state}</td>
                <td className="py-2.5 pr-6 text-muted-foreground">{content}</td>
                <td className="py-2.5 text-muted-foreground">{actions}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Artifacts default to collapsed to keep the conversation scannable.
          The expand toggle lets evaluators preview content without navigating
          away. Export and copy actions appear only in the expanded state to
          reduce visual noise in the collapsed card.
        </div>
      </section>

    </article>
  )
}
