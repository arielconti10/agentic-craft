import { useState, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  GitBranchIcon,
  CodeIcon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  Shield01Icon,
  File01Icon,
  SentIcon,
  Brain01Icon,
} from "@hugeicons/core-free-icons"

/* ------------------------------------------------------------------ */
/*  CSS Keyframes                                                      */
/* ------------------------------------------------------------------ */

const STYLE_ID = "demo-page-styles"
function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement("style")
  style.id = STYLE_ID
  style.textContent = `
    @keyframes demo-shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes demo-slide-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes demo-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .demo-slide-in {
      animation: demo-slide-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    .demo-fade-in {
      animation: demo-fade-in 0.2s ease forwards;
    }
    .demo-shimmer-overlay {
      background: linear-gradient(
        90deg,
        transparent 0%,
        oklch(0.55 0.02 260 / 0.06) 50%,
        transparent 100%
      );
      background-size: 200% 100%;
      animation: demo-shimmer 2s linear infinite;
    }
  `
  document.head.appendChild(style)
}

/* ------------------------------------------------------------------ */
/*  Agent prose style                                                  */
/* ------------------------------------------------------------------ */

const PROSE_STYLE: React.CSSProperties = {
  fontFamily: "'Source Serif 4', serif",
  fontSize: "16px",
  lineHeight: "26px",
  letterSpacing: "-0.4px",
  fontVariationSettings: '"opsz" 12',
  WebkitFontSmoothing: "antialiased",
  color: "oklch(0.2642 0.013 93.9)",
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const THINKING_TEXT =
  "Let me pull up the Security Target document and cross-reference it against CC Part 2 and Part 3 requirements. I'll need to check the SFR mappings, the TOE boundary definition, and the conformance claims..."

const PARALLEL_TASKS = [
  { label: "Analyzing SFR mapping completeness", duration: "2.1s" },
  { label: "Checking TOE boundary definition", duration: "1.8s" },
  { label: "Validating conformance claims", duration: "3.4s" },
]

const TASK_DETAILS: Record<number, string> = {
  0: "Compared 47 SFRs from PP-Configuration against Security Target claims. Found 2 unmapped requirements.",
  1: "Verified physical and logical boundaries. HSM module missing from physical perimeter diagram.",
  2: "Checked EAL4+ conformance claim against ASE_CCL.1 requirements. Claims are consistent.",
}

const FINDINGS = [
  { id: "FCS_CKM.4", text: "Missing from SFR mapping (key destruction)" },
  { id: "FDP_ACF.1", text: "Dropped in v3.1 rewrite (likely editing error)" },
  { id: "TOE Boundary", text: "HSM module omitted from physical boundary diagram" },
]

const CONTEXT_SOURCES = [
  "Security Target v3.1",
  "PP-Configuration for Network Devices",
  "CC Part 2 (SFR catalog)",
  "Previous evaluation notes",
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Demo() {
  useEffect(() => { ensureStyles() }, [])

  /* Thinking block state */
  const [thinkingState, setThinkingState] = useState<"collapsed" | "expanded" | "completed">("collapsed")

  /* Streaming cursor */
  const [showCursor, setShowCursor] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setShowCursor(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  /* Tool call expansion */
  const [toolTreeOpen, setToolTreeOpen] = useState(true)
  const [expandedTask, setExpandedTask] = useState<number | null>(null)

  /* Approval gate */
  const [approvalState, setApprovalState] = useState<"pending" | "approved" | "denied">("pending")

  /* Feedback */
  const [feedback, setFeedback] = useState<"none" | "up" | "down">("none")

  /* Context ring hover */
  const [contextHover, setContextHover] = useState(false)

  return (
    <article>
      <header className="mb-16">
        <h1 className="font-serif text-4xl font-light tracking-tight leading-[1.15]">
          Agentic Craft
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          An open-source component library for building agent interfaces.
          Every pattern below is interactive — click, expand, approve.
        </p>
      </header>

      <div className="mx-auto max-w-[720px] space-y-6">
        {/* -------------------------------------------------------- */}
        {/*  Message 1: User message                                  */}
        {/* -------------------------------------------------------- */}
        <div className="flex justify-end">
          <div className="max-w-[75%] rounded-lg bg-primary px-4 py-3 text-sm text-primary-foreground">
            Can you review the latest Security Target and check it against the
            Common Criteria requirements?
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  Message 2: Thinking block                                */}
        {/* -------------------------------------------------------- */}
        <div className="flex justify-start">
          <div className="max-w-[85%]">
            <button
              type="button"
              onClick={() => {
                setThinkingState(prev =>
                  prev === "collapsed" ? "expanded" : "completed"
                )
              }}
              className="relative w-full cursor-pointer rounded-lg border border-dashed border-border/60 px-4 py-3 text-left transition-colors hover:border-border"
            >
              {/* Shimmer overlay — only while collapsed */}
              {thinkingState === "collapsed" && (
                <div className="demo-shimmer-overlay pointer-events-none absolute inset-0 rounded-lg" />
              )}

              {thinkingState === "collapsed" && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <HugeiconsIcon icon={Brain01Icon} size={14} strokeWidth={1.5} />
                  <span>Thinking</span>
                  <span className="flex gap-0.5">
                    <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground/40" style={{ animation: "demo-fade-in 0.6s ease infinite alternate" }} />
                    <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground/40" style={{ animation: "demo-fade-in 0.6s ease 0.2s infinite alternate" }} />
                    <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground/40" style={{ animation: "demo-fade-in 0.6s ease 0.4s infinite alternate" }} />
                  </span>
                </div>
              )}

              {thinkingState === "expanded" && (
                <div className="demo-slide-in">
                  <p className="text-sm italic text-muted-foreground" style={{ lineHeight: "22px" }}>
                    {THINKING_TEXT}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground/60">
                    Click to collapse
                  </p>
                </div>
              )}

              {thinkingState === "completed" && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                  <HugeiconsIcon icon={Brain01Icon} size={12} strokeWidth={1.5} />
                  <span>Thought for 3.2s</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  Message 3: Agent response with citations                 */}
        {/* -------------------------------------------------------- */}
        <div className="flex justify-start">
          <div className="max-w-[85%]" style={PROSE_STYLE}>
            <p>
              I've completed the initial review. The Security Target covers the
              required ASE class components
              <sup className="ml-0.5 font-sans text-xs font-medium text-primary">1</sup>
              , but I found three areas that need attention before submission to
              the evaluation facility
              <sup className="ml-0.5 font-sans text-xs font-medium text-primary">2</sup>
              .
            </p>
            {showCursor && (
              <span
                className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-foreground align-middle"
              />
            )}
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  Message 4: Tool call — parallel execution tree           */}
        {/* -------------------------------------------------------- */}
        <div className="flex justify-start">
          <div className="w-full max-w-[85%]">
            {/* Parent header */}
            <button
              type="button"
              onClick={() => setToolTreeOpen(prev => !prev)}
              className="flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50"
            >
              <HugeiconsIcon icon={GitBranchIcon} size={14} strokeWidth={1.5} />
              <span>Running 3 tasks in parallel</span>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={12}
                strokeWidth={1.5}
                style={{
                  transform: toolTreeOpen ? "rotate(0deg)" : "rotate(-90deg)",
                  transition: "transform 0.15s ease",
                }}
              />
            </button>

            {/* Children */}
            {toolTreeOpen && (
              <div className="demo-slide-in ml-3 mt-1">
                {PARALLEL_TASKS.map((task, i) => {
                  const isLast = i === PARALLEL_TASKS.length - 1
                  const isExpanded = expandedTask === i
                  return (
                    <div key={i} className="relative">
                      {/* Vertical connector */}
                      <div
                        className="absolute left-0 top-0 w-px bg-border"
                        style={{
                          height: isLast ? "16px" : "100%",
                          borderBottomLeftRadius: isLast ? "4px" : "0px",
                        }}
                      />
                      {/* Horizontal tick */}
                      <div className="absolute left-0 top-[16px] h-px w-3 bg-border" />

                      <div className="ml-5">
                        <button
                          type="button"
                          onClick={() => setExpandedTask(isExpanded ? null : i)}
                          className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted/50"
                        >
                          <HugeiconsIcon
                            icon={CodeIcon}
                            size={13}
                            strokeWidth={1.5}
                            className="shrink-0 text-muted-foreground"
                          />
                          <span className="text-foreground">{task.label}</span>
                          <span className="ml-auto text-xs text-muted-foreground/60">
                            {task.duration}
                          </span>
                          <HugeiconsIcon
                            icon={ArrowRight01Icon}
                            size={11}
                            strokeWidth={1.5}
                            className="shrink-0 text-muted-foreground/40"
                            style={{
                              transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                              transition: "transform 0.15s ease",
                            }}
                          />
                        </button>

                        {isExpanded && (
                          <div className="demo-slide-in mb-1 ml-7 mt-0.5 rounded-md bg-muted/30 px-3 py-2 text-xs text-muted-foreground" style={{ lineHeight: "18px" }}>
                            {TASK_DETAILS[i]}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  Message 5: Agent response with findings                  */}
        {/* -------------------------------------------------------- */}
        <div className="flex justify-start">
          <div className="max-w-[85%]" style={PROSE_STYLE}>
            <p>Based on the analysis, here are the findings:</p>
            <ul className="mt-3 space-y-2">
              {FINDINGS.map((f) => (
                <li key={f.id} className="flex items-start gap-2 text-sm" style={{ lineHeight: "22px" }}>
                  <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-foreground/30" />
                  <span>
                    <span className="font-sans text-sm font-medium text-foreground">{f.id}</span>
                    <span className="text-muted-foreground"> — {f.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  Message 6: Approval gate                                 */}
        {/* -------------------------------------------------------- */}
        <div className="flex justify-start">
          <div className="w-full max-w-[85%]">
            <div style={PROSE_STYLE}>
              <p>I'd like to generate a findings report and send it to the evaluation team.</p>
            </div>

            <div className="mt-3 rounded-lg border border-border/40 p-4">
              {approvalState === "pending" && (
                <>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <HugeiconsIcon icon={File01Icon} size={14} strokeWidth={1.5} />
                    <span>Generate ST Review Report and email to evaluation@bsi.bund.de</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setApprovalState("approved")}
                      className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => setApprovalState("denied")}
                      className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/50"
                    >
                      Deny
                    </button>
                  </div>
                </>
              )}

              {approvalState === "approved" && (
                <div className="demo-slide-in flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <HugeiconsIcon icon={SentIcon} size={14} strokeWidth={1.5} />
                    <span>Report sent to evaluation@bsi.bund.de</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setApprovalState("pending")}
                    className="text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground"
                  >
                    Reset
                  </button>
                </div>
              )}

              {approvalState === "denied" && (
                <div className="demo-slide-in flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={1.5} />
                    <span>Action cancelled</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setApprovalState("pending")}
                    className="text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  Message 7: Feedback                                      */}
        {/* -------------------------------------------------------- */}
        <div className="flex justify-start">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground/60">Was this helpful?</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setFeedback(prev => prev === "up" ? "none" : "up")}
                className={`rounded-md p-1.5 transition-colors ${
                  feedback === "up"
                    ? "bg-foreground/[0.06] text-foreground"
                    : "text-muted-foreground/40 hover:text-muted-foreground"
                }`}
              >
                <HugeiconsIcon icon={ThumbsUpIcon} size={14} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => setFeedback(prev => prev === "down" ? "none" : "down")}
                className={`rounded-md p-1.5 transition-colors ${
                  feedback === "down"
                    ? "bg-foreground/[0.06] text-foreground"
                    : "text-muted-foreground/40 hover:text-muted-foreground"
                }`}
              >
                <HugeiconsIcon icon={ThumbsDownIcon} size={14} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  Context ring + Memory indicator                          */}
        {/* -------------------------------------------------------- */}
        <div className="mt-8 flex items-center gap-4 border-t border-border/30 pt-4">
          {/* Context ring */}
          <div
            className="relative"
            onMouseEnter={() => setContextHover(true)}
            onMouseLeave={() => setContextHover(false)}
          >
            <svg width="28" height="28" viewBox="0 0 28 28">
              <circle
                cx="14"
                cy="14"
                r="11"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-border"
              />
              <circle
                cx="14"
                cy="14"
                r="11"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray={`${(4 / 6) * 2 * Math.PI * 11} ${2 * Math.PI * 11}`}
                strokeDashoffset="0"
                strokeLinecap="round"
                className="text-foreground/50"
                style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-medium text-muted-foreground">
              4
            </span>

            {/* Tooltip */}
            {contextHover && (
              <div className="demo-fade-in absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-md bg-foreground px-3 py-2 text-xs text-background shadow-sm">
                <p className="mb-1 font-medium">Sources used</p>
                {CONTEXT_SOURCES.map((s) => (
                  <p key={s} className="text-background/70">{s}</p>
                ))}
                {/* Caret */}
                <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-foreground" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/50">
            <HugeiconsIcon icon={Shield01Icon} size={12} strokeWidth={1.5} />
            <span>2 memories used</span>
          </div>
        </div>
      </div>
    </article>
  )
}
