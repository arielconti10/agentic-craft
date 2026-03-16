'use client'

import { useState, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  GitBranchIcon,
  CodeIcon,
  Cancel01Icon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  File01Icon,
  SentIcon,
} from "@hugeicons/core-free-icons"
import InteractiveComposer from "../components/InteractiveComposer"
import {
  ToolTree,
  ToolTreeTrigger,
  ToolTreeContent,
} from "@/components/ui/tool-tree"
import {
  ToolCall,
  ToolCallLabel,
  ToolCallContent,
} from "@/components/ui/tool-call"

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
    .demo-shimmer-text {
      background: linear-gradient(
        90deg,
        var(--color-muted-foreground) 0%,
        var(--color-muted-foreground) 35%,
        oklch(0.75 0.02 260) 50%,
        var(--color-muted-foreground) 65%,
        var(--color-muted-foreground) 100%
      );
      background-size: 200% 100%;
      animation: demo-shimmer 2.5s ease-in-out infinite;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  `
  document.head.appendChild(style)
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


/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DemoContent() {
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

  /* Approval gate */
  const [approvalState, setApprovalState] = useState<"pending" | "approved" | "denied">("pending")

  /* Feedback */
  const [feedback, setFeedback] = useState<"none" | "up" | "down">("none")

  /* Context ring hover */

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
              className="w-full cursor-pointer px-1 py-2 text-left"
            >
              {/* Shimmer overlay — only while collapsed */}
              {thinkingState === "collapsed" && (
                <span className="demo-shimmer-text text-sm">Thinking</span>
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
                <span className="text-xs text-muted-foreground/60">Thought for 3.2s</span>
              )}
            </button>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  Message 3: Agent response with citations                 */}
        {/* -------------------------------------------------------- */}
        <div className="flex justify-start">
          <div className="max-w-[85%] font-serif text-base" style={{ lineHeight: "26px", letterSpacing: "-0.4px", fontVariationSettings: '"opsz" 12' }}>
            <p className="text-foreground">
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
            <ToolTree open={toolTreeOpen} onOpenChange={setToolTreeOpen}>
              <ToolTreeTrigger icon={GitBranchIcon} timestamp="10:44 AM · 1s">
                Running 3 tasks in parallel
              </ToolTreeTrigger>
              <ToolTreeContent>
                {PARALLEL_TASKS.map((task, i) => (
                  <ToolCall key={task.label} icon={CodeIcon} status="completed" timestamp={task.duration}>
                    <ToolCallLabel>{task.label}</ToolCallLabel>
                    <ToolCallContent>
                      <p className="text-xs text-muted-foreground" style={{ lineHeight: "18px" }}>
                        {TASK_DETAILS[i]}
                      </p>
                    </ToolCallContent>
                  </ToolCall>
                ))}
              </ToolTreeContent>
            </ToolTree>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  Message 5: Agent response with findings                  */}
        {/* -------------------------------------------------------- */}
        <div className="flex justify-start">
          <div className="max-w-[85%] font-serif text-base text-foreground" style={{ lineHeight: "26px", letterSpacing: "-0.4px", fontVariationSettings: '"opsz" 12' }}>
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
            <div className="font-serif text-base text-foreground" style={{ lineHeight: "26px", letterSpacing: "-0.4px", fontVariationSettings: '"opsz" 12' }}>
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
        {/*  Composer                                                  */}
        {/* -------------------------------------------------------- */}
        <div className="mt-8">
          <InteractiveComposer showControls={false} />
        </div>

      </div>
    </article>
  )
}
