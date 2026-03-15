import { useState, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CodeIcon,
  Copy01Icon,
  File01Icon,
  Download01Icon,
  Table01Icon,
  SourceCodeIcon,
  Note01Icon,
  Pdf01Icon,
  Shield01Icon,
  Tick01Icon,
  ArrowRight01Icon,
  EyeIcon,
  TextAlignLeft01Icon,
  LeftToRightBlockQuoteIcon,
  LeftToRightListBulletIcon,
  ArrowExpandIcon,
  ArrowShrinkIcon,
  StructureCheckIcon,
  DatabaseIcon,
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

const CODE_SNIPPET = `# SFR coverage analysis for Security Target v3.2
import cc_parser

def analyze_sfr_coverage(st_path, evidence_dir):
    st = cc_parser.load_security_target(st_path)
    sfrs = st.get_security_functional_requirements()

    results = []
    for sfr in sfrs:
        evidence = cc_parser.find_evidence(evidence_dir, sfr.id)
        verified = [e for e in evidence if e.status == "verified"]
        results.append({
            "sfr_id": sfr.id,
            "family": sfr.family,
            "coverage": len(verified) / max(len(evidence), 1),
            "status": "pass" if len(verified) == len(evidence) else "pending",
        })

    return {"results": results, "overall": compute_overall(results)}`

const SFR_DATA = [
  { family: "FCS", component: "FCS_COP.1", description: "Cryptographic Operation", status: "Pass" },
  { family: "FCS", component: "FCS_CKM.1", description: "Cryptographic Key Generation", status: "Pass" },
  { family: "FDP", component: "FDP_ACC.1", description: "Subset Access Control", status: "Pending" },
  { family: "FDP", component: "FDP_IFC.1", description: "Subset Information Flow Control", status: "Pass" },
  { family: "FIA", component: "FIA_UAU.2", description: "User Authentication Before Action", status: "Pass" },
  { family: "FPT", component: "FPT_FLS.1", description: "Failure with Preservation of Secure State", status: "Fail" },
]

const COMPARISON_V1 = [
  { field: "Component", v1: "FCS_COP.1", v2: "FCS_COP.1" },
  { field: "Algorithm", v1: "AES-128-CBC", v2: "AES-256-GCM" },
  { field: "Key Length", v1: "128-bit", v2: "256-bit" },
  { field: "Mode", v1: "CBC", v2: "GCM" },
  { field: "Standard", v1: "FIPS 197", v2: "FIPS 197 + SP 800-38D" },
  { field: "Status", v1: "Superseded", v2: "Active" },
]

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

  /* ── Section 1: Code Block ── */
  const [codeCtrl, setCodeCtrl] = useState<Record<string, boolean>>({
    default: true,
    lineNumbers: false,
    copy: false,
  })
  const [codeAnim, setCodeAnim] = useState(0)
  const codeToggle = makeToggle(setCodeCtrl, setCodeAnim)

  /* ── Section 2: Structured Data ── */
  const [dataCtrl, setDataCtrl] = useState<Record<string, boolean>>({
    table: true,
    json: false,
    keyValue: false,
  })
  const [dataAnim, setDataAnim] = useState(0)
  const dataToggle = makeToggle(setDataCtrl, setDataAnim)

  /* ── Section 3: Document Output ── */
  const [docCtrl, setDocCtrl] = useState<Record<string, boolean>>({
    inline: true,
    downloadCard: false,
  })
  const [docAnim, setDocAnim] = useState(0)
  const docToggle = makeToggle(setDocCtrl, setDocAnim)

  /* ── Section 4: Comparison Table ── */
  const [compCtrl, setCompCtrl] = useState<Record<string, boolean>>({
    highlightDiffs: true,
    plain: false,
  })
  const [compAnim, setCompAnim] = useState(0)
  const compToggle = makeToggle(setCompCtrl, setCompAnim)

  /* ── Section 5: Markdown Rendering ── */
  const [mdCtrl, setMdCtrl] = useState<Record<string, boolean>>({
    prose: true,
    withLists: false,
    withTable: false,
  })
  const [mdAnim, setMdAnim] = useState(0)
  const mdToggle = makeToggle(setMdCtrl, setMdAnim)

  /* ── Section 6: Artifact Preview ── */
  const [artifactCtrl, setArtifactCtrl] = useState<Record<string, boolean>>({
    collapsed: true,
    expanded: false,
  })
  const [artifactAnim, setArtifactAnim] = useState(0)
  const artifactToggle = makeToggle(setArtifactCtrl, setArtifactAnim)

  const codeLines = CODE_SNIPPET.split("\n")

  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-4">Patterns</p>
        <h1 className="font-serif text-4xl font-light tracking-tight leading-[1.15]">
          Output &amp; Rendering
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Patterns for presenting agent-generated content to CC evaluators
          &mdash; code blocks, structured data, documents, comparisons,
          prose rendering, and artifact previews.
        </p>
      </header>

      {/* ============================================================ */}
      {/*  Section 1 — Code Block                                       */}
      {/* ============================================================ */}
      <section id="code-block" className="page-section">
        <p className="section-label mb-3">Code</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Code Block
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Syntax-highlighted code output from agent analysis. Supports
          line numbers for referencing specific SFR processing logic and
          a copy action for transferring snippets to evaluation reports.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "default", label: "Default" },
              { key: "lineNumbers", label: "Line Numbers" },
              { key: "copy", label: "Copy" },
            ]}
            active={codeCtrl}
            onToggle={codeToggle}
          />

          <div key={codeAnim} className="border border-border/40 rounded-lg p-6 out-slide-in">
            {/* Code header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={CodeIcon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground" style={{ fontWeight: 400 }}>
                  sfr_coverage.py
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {codeCtrl.copy ? (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground out-fade-in">
                    <HugeiconsIcon icon={Tick01Icon} size={12} strokeWidth={1.5} />
                    Copied!
                  </span>
                ) : (
                  <button className="flex items-center gap-1 rounded-md border border-border/40 px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted/50">
                    <HugeiconsIcon icon={Copy01Icon} size={12} strokeWidth={1.5} />
                    Copy
                  </button>
                )}
              </div>
            </div>

            {/* Code body */}
            <div className="rounded-md border border-border/40 bg-foreground/[0.02] overflow-x-auto">
              <pre className="p-4 text-[13px] leading-[1.6]" style={{ fontFamily: "monospace" }}>
                <code>
                  {codeLines.map((line, i) => (
                    <div key={i} className="flex">
                      {codeCtrl.lineNumbers && (
                        <span className="select-none pr-4 text-right text-muted-foreground/40" style={{ minWidth: "2.5rem" }}>
                          {i + 1}
                        </span>
                      )}
                      <span>{line}</span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
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
                Feature
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Behavior
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Default", "Plain code block", "Monospace text with subtle background, no line numbers"],
              ["Line Numbers", "Numbered gutter", "Line numbers in muted color on the left for reference"],
              ["Copy", "Clipboard action", "Copy button replaced with checkmark and Copied! confirmation"],
            ].map(([variant, feature, behavior], i) => (
              <tr key={variant} className={i < 2 ? "border-b border-border/50" : ""}>
                <td className="py-2.5 pr-6 font-medium">{variant}</td>
                <td className="py-2.5 pr-6 text-muted-foreground">{feature}</td>
                <td className="py-2.5 text-muted-foreground">{behavior}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Code blocks use a monospace font at 13px for density without
          sacrificing readability. Line numbers are opt-in since most
          evaluation snippets are short enough that positional references
          are unnecessary. The copy confirmation auto-resets on control change.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 2 — Structured Data                                   */}
      {/* ============================================================ */}
      <section id="structured-data" className="page-section">
        <p className="section-label mb-3">Data</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Structured Data
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          The same SFR dataset rendered in three formats. Evaluators can
          switch between table, JSON, and key-value views depending on
          how they need to consume the data.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "table", label: "Table" },
              { key: "json", label: "JSON" },
              { key: "keyValue", label: "Key-Value" },
            ]}
            active={dataCtrl}
            onToggle={dataToggle}
          />

          <div key={dataAnim} className="border border-border/40 rounded-lg p-6 out-slide-in">
            {dataCtrl.table && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <HugeiconsIcon icon={Table01Icon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground" style={{ fontWeight: 400 }}>
                    SFR evaluation results
                  </span>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-2.5 pr-4 text-left text-xs font-medium text-muted-foreground">Family</th>
                      <th className="pb-2.5 pr-4 text-left text-xs font-medium text-muted-foreground">Component</th>
                      <th className="pb-2.5 pr-4 text-left text-xs font-medium text-muted-foreground">Description</th>
                      <th className="pb-2.5 text-left text-xs font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SFR_DATA.map((row, i) => (
                      <tr key={row.component} className={i < SFR_DATA.length - 1 ? "border-b border-border/50" : ""}>
                        <td className="py-2 pr-4 font-mono text-xs text-muted-foreground">{row.family}</td>
                        <td className="py-2 pr-4 font-medium text-sm">{row.component}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{row.description}</td>
                        <td className="py-2 text-sm">{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {dataCtrl.json && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <HugeiconsIcon icon={SourceCodeIcon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground" style={{ fontWeight: 400 }}>
                    SFR evaluation results (JSON)
                  </span>
                </div>
                <div className="rounded-md border border-border/40 bg-foreground/[0.02] p-4 overflow-x-auto">
                  <pre className="text-[13px] leading-[1.6]" style={{ fontFamily: "monospace" }}>
                    {JSON.stringify(SFR_DATA, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {dataCtrl.keyValue && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <HugeiconsIcon icon={DatabaseIcon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground" style={{ fontWeight: 400 }}>
                    SFR evaluation results (key-value)
                  </span>
                </div>
                <div className="space-y-4">
                  {SFR_DATA.map((row) => (
                    <div key={row.component} className="rounded-md border border-border/40 p-3">
                      <div className="grid grid-cols-2 gap-y-1.5 gap-x-6 text-sm">
                        <div>
                          <span className="text-xs text-muted-foreground/60">Family</span>
                          <p className="font-mono text-xs">{row.family}</p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground/60">Component</span>
                          <p className="font-medium">{row.component}</p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground/60">Description</span>
                          <p className="text-muted-foreground">{row.description}</p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground/60">Status</span>
                          <p>{row.status}</p>
                        </div>
                      </div>
                    </div>
                  ))}
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
                Format
              </th>
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Best For
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Table", "Scanning and comparing across entries", "Default view, sortable headers possible in future"],
              ["JSON", "Copy-pasting into tools or scripts", "Monospace, preserves structure for machine consumption"],
              ["Key-Value", "Reviewing individual entries in detail", "Card layout, one entry per card with labeled fields"],
            ].map(([format, bestFor, notes], i) => (
              <tr key={format} className={i < 2 ? "border-b border-border/50" : ""}>
                <td className="py-2.5 pr-6 font-medium">{format}</td>
                <td className="py-2.5 pr-6 text-muted-foreground">{bestFor}</td>
                <td className="py-2.5 text-muted-foreground">{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Three views of the same data set — the underlying model is
          identical, only the presentation changes. Table is default because
          evaluators spend most of their time scanning across rows.
          JSON is provided for interoperability with CC tooling.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 3 — Document Output                                   */}
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
      {/*  Section 4 — Comparison Table                                  */}
      {/* ============================================================ */}
      <section id="comparison-table" className="page-section">
        <p className="section-label mb-3">Comparison</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Comparison Table
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Side-by-side comparison of two versions of an SFR specification.
          Highlight mode draws attention to changed fields with a subtle
          background wash, making version deltas immediately scannable.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "highlightDiffs", label: "Highlight Diffs" },
              { key: "plain", label: "Plain" },
            ]}
            active={compCtrl}
            onToggle={compToggle}
          />

          <div key={compAnim} className="border border-border/40 rounded-lg p-6 out-slide-in">
            <div className="flex items-center gap-2 mb-4">
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground" style={{ fontWeight: 400 }}>
                FCS_COP.1 — ST v3.1 vs ST v3.2
              </span>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2.5 pr-4 text-left text-xs font-medium text-muted-foreground">Field</th>
                  <th className="pb-2.5 pr-4 text-left text-xs font-medium text-muted-foreground">ST v3.1</th>
                  <th className="pb-2.5 text-left text-xs font-medium text-muted-foreground">ST v3.2</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_V1.map((row, i) => {
                  const isDiff = row.v1 !== row.v2
                  const highlight = compCtrl.highlightDiffs && isDiff
                  return (
                    <tr
                      key={row.field}
                      className={i < COMPARISON_V1.length - 1 ? "border-b border-border/50" : ""}
                    >
                      <td className="py-2 pr-4 font-medium">{row.field}</td>
                      <td
                        className={`py-2 pr-4 text-muted-foreground ${highlight ? "rounded-sm" : ""}`}
                        style={highlight ? { backgroundColor: "oklch(0.85 0.05 15 / 0.2)" } : undefined}
                      >
                        {row.v1}
                      </td>
                      <td
                        className={`py-2 text-muted-foreground ${highlight ? "rounded-sm" : ""}`}
                        style={highlight ? { backgroundColor: "oklch(0.85 0.05 155 / 0.2)" } : undefined}
                      >
                        {row.v2}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Mode
              </th>
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                Visual
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Purpose
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Highlight Diffs", "Changed cells have a subtle colored wash", "Draws attention to what changed between versions"],
              ["Plain", "No highlighting on any cells", "Clean reading when differences are already known"],
            ].map(([mode, visual, purpose], i) => (
              <tr key={mode} className={i < 1 ? "border-b border-border/50" : ""}>
                <td className="py-2.5 pr-6 font-medium">{mode}</td>
                <td className="py-2.5 pr-6 text-muted-foreground">{visual}</td>
                <td className="py-2.5 text-muted-foreground">{purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          Diff highlighting uses warm tones for removed values and cool
          tones for added values, following the convention evaluators
          expect from document comparison tools. The highlight is
          deliberately subtle to avoid visual noise in dense tables.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 5 — Markdown Rendering                                */}
      {/* ============================================================ */}
      <section id="markdown-rendering" className="page-section">
        <p className="section-label mb-3">Prose</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Markdown Rendering
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Agent-generated prose rendered with the evaluation-tuned
          typographic style. Each variant demonstrates a different
          content structure: plain paragraphs, lists, and inline tables.
        </p>

        <div className="mt-10">
          <Controls
            options={[
              { key: "prose", label: "Prose" },
              { key: "withLists", label: "With Lists" },
              { key: "withTable", label: "With Table" },
            ]}
            active={mdCtrl}
            onToggle={mdToggle}
          />

          <div key={mdAnim} className="border border-border/40 rounded-lg p-6 out-slide-in">
            {mdCtrl.prose && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <HugeiconsIcon icon={TextAlignLeft01Icon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground" style={{ fontWeight: 400 }}>
                    Agent prose
                  </span>
                </div>
                <div style={{ ...AGENT_PROSE_STYLE, color: AGENT_PROSE_COLOR }}>
                  <p className="mb-3">
                    The Security Target for the ACME Cryptographic Module v2.4 claims
                    conformance to EAL4 augmented with ALC_FLR.1. This evaluation
                    assurance level requires the developer to provide a functional
                    specification (ADV_FSP.4), a TOE design (ADV_TDS.3), and an
                    implementation representation (ADV_IMP.1).
                  </p>
                  <p>
                    The evaluator has verified that all security functional requirements
                    are traced to the TSFI defined in the functional specification.
                    The cryptographic module&apos;s key management subsystem implements
                    FCS_CKM.1 for RSA-4096 key generation and FCS_COP.1 for
                    AES-256-GCM encryption, both backed by the FIPS 140-3 validated
                    entropy source.
                  </p>
                </div>
              </div>
            )}

            {mdCtrl.withLists && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <HugeiconsIcon icon={LeftToRightListBulletIcon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground" style={{ fontWeight: 400 }}>
                    Agent prose with lists
                  </span>
                </div>
                <div style={{ ...AGENT_PROSE_STYLE, color: AGENT_PROSE_COLOR }}>
                  <p className="mb-3">
                    The following assurance components require additional evaluator
                    action before the evaluation can proceed to the verdict phase:
                  </p>
                  <ul className="mb-3 ml-5 space-y-1" style={{ listStyleType: "disc" }}>
                    <li>ADV_ARC.1 &mdash; Security architecture description is incomplete for the key storage subsystem</li>
                    <li>ATE_COV.2 &mdash; Test coverage analysis does not address FPT_FLS.1 failure scenarios</li>
                    <li>AVA_VAN.3 &mdash; Penetration testing for the JTAG interface has not been documented</li>
                  </ul>
                  <p className="mb-3">
                    Recommended resolution order:
                  </p>
                  <ol className="ml-5 space-y-1" style={{ listStyleType: "decimal" }}>
                    <li>Complete the ADV_ARC.1 security architecture description</li>
                    <li>Extend ATE_COV.2 with FPT_FLS.1 test cases</li>
                    <li>Conduct and document AVA_VAN.3 penetration testing</li>
                  </ol>
                </div>
              </div>
            )}

            {mdCtrl.withTable && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <HugeiconsIcon icon={LeftToRightBlockQuoteIcon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground" style={{ fontWeight: 400 }}>
                    Agent prose with inline table
                  </span>
                </div>
                <div style={{ ...AGENT_PROSE_STYLE, color: AGENT_PROSE_COLOR }}>
                  <p className="mb-4">
                    The evaluation identified three SFR classes with incomplete
                    coverage. The table below summarizes the gap analysis
                    conducted against the Security Target v3.2 requirements:
                  </p>
                  <table className="mb-4 w-full text-sm" style={{ fontFamily: "inherit" }}>
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">SFR Class</th>
                        <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Required</th>
                        <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Verified</th>
                        <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Gap</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["FDP", "3", "2", "FDP_RIP.1"],
                        ["FPT", "3", "1", "FPT_FLS.1, FPT_RCV.1"],
                        ["FMT", "2", "2", "None"],
                      ].map(([cls, required, verified, gap], i) => (
                        <tr key={cls} className={i < 2 ? "border-b border-border/50" : ""}>
                          <td className="py-1.5 pr-4">{cls}</td>
                          <td className="py-1.5 pr-4 text-muted-foreground">{required}</td>
                          <td className="py-1.5 pr-4 text-muted-foreground">{verified}</td>
                          <td className="py-1.5 text-muted-foreground">{gap}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p>
                    Addressing the FPT class gaps is the highest priority, as
                    FPT_FLS.1 is a dependency for three other SFRs in the
                    Security Target.
                  </p>
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
                Structure
              </th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                Typography
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Prose", "Paragraphs only", "Source Serif 4, 16px/26px, -0.4px tracking"],
              ["With Lists", "Paragraphs + bullet/numbered lists", "Same serif base, lists inherit prose metrics"],
              ["With Table", "Paragraphs + inline data table", "Prose font for text, table uses inherited sizing"],
            ].map(([variant, structure, typography], i) => (
              <tr key={variant} className={i < 2 ? "border-b border-border/50" : ""}>
                <td className="py-2.5 pr-6 font-medium">{variant}</td>
                <td className="py-2.5 pr-6 text-muted-foreground">{structure}</td>
                <td className="py-2.5 text-muted-foreground">{typography}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          The serif typeface at optical size 12 creates a reading experience
          distinct from the UI chrome. Agent prose should feel like a
          document, not a chat message. Lists and inline tables preserve
          the typographic rhythm while adding structure.
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 6 — Artifact Preview                                  */}
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
