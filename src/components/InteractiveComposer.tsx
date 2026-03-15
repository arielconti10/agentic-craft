import { useState, useRef, useEffect, useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowUp02Icon,
  Cancel01Icon,
  MailReply01Icon,
  File01Icon,
  Image01Icon,
  Add01Icon,
  Attachment01Icon,
  Plug01Icon,
  Globe02Icon,
  Task01Icon,
  ArrowExpand01Icon,
  ArrowShrink01Icon,
  ComputerIcon,
  Shield01Icon,
} from "@hugeicons/core-free-icons"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

/* ─── Types ─── */
interface ComposerState {
  scopeBanner: boolean
  replyTo: boolean
  plan: boolean
  suggestions: boolean
  attachments: boolean
}

/* ─── Constants ─── */
const SUGGESTIONS = [
  "Check SFR coverage",
  "Compare with previous version",
  "List open findings",
  "Generate summary",
]

const REPLY_QUOTE =
  "The FCS_COP.1 instantiation also references an outdated algorithm suite — this will need updating before the evaluation facility review."

const PLACEHOLDER_MAP: Record<string, string> = {
  default: "Ask about this device...",
  reply: "Reply to this message...",
  scope: "Ask about the Security Target...",
}

const MOCK_ATTACHMENTS = [
  { name: "Security_Target_v3.1.pdf", size: "2.4 MB", icon: File01Icon },
  { name: "TOE_boundary_diagram.png", size: "340 KB", icon: Image01Icon },
]

interface ScopeItem {
  id: string
  label: string
  icon: typeof File01Icon
}

const INITIAL_SCOPE_ITEMS: ScopeItem[] = [
  { id: "st", label: "Security Target v3.1", icon: File01Icon },
  { id: "device", label: "ACME SmartCard Module", icon: ComputerIcon },
  { id: "pp", label: "PP-CIMC-SLv3", icon: Shield01Icon },
]

const PLAN_TASKS = [
  { label: "Patch PR1 branch for API formatting and webapp compile compatibility, then verify local checks", done: false },
  { label: "Patch PR2-specific formatting or backend issues and verify local checks", done: false },
  { label: "Restack PR3 on top, run targeted verification, and push updated branches", done: false, dimmed: true },
]

/* ─── CSS keyframes ─── */
const STYLE_ID = "interactive-composer-styles"
function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement("style")
  style.id = STYLE_ID
  style.textContent = `
    @keyframes composer-send-press {
      0% { transform: scale(1); }
      40% { transform: scale(0.82); }
      100% { transform: scale(1); }
    }
    @keyframes composer-island-enter {
      from {
        opacity: 0;
        transform: translateY(16px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes composer-arrow-up {
      0% { transform: translateY(0); opacity: 1; }
      50% { transform: translateY(-6px); opacity: 0; }
      51% { transform: translateY(6px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes composer-chip-fill {
      0% { background-color: transparent; }
      30% { background-color: var(--color-muted); }
      100% { background-color: transparent; }
    }
    @keyframes composer-slide-in {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .composer-send-anim {
      animation: composer-send-press 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .composer-arrow-anim {
      animation: composer-arrow-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .composer-island-enter {
      animation: composer-island-enter 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    .composer-slide-in {
      animation: composer-slide-in 0.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    .composer-chip-flash {
      animation: composer-chip-fill 0.4s ease;
    }
  `
  document.head.appendChild(style)
}

/* ────────────────────────────────────────────────
   Interactive Composer — Stacked Island Pattern
   
   Layout:
   - The composer lives in a viewport-height "stage".
   - Composer + islands are pinned to the bottom center.
   - Controls float at the top, completely out of flow.
   - Islands animate upward from behind — the composer NEVER moves.
   
   Stacking rules:
   - Island panels (plan, scope, reply-to) sit behind the composer (z:0).
   - Width: 95% of composer, centered.
   - All islands: border-bottom: 0, no bottom radius.
   - Only the TOPMOST island keeps rounded-t-xl.
   - Non-top islands: border-top-left-radius: 0, border-top-right-radius: 0.
   - All border colors consistent (border-border).
   - Composer sits on top at z:[1] with full rounded border.
   - Attachments live inside the composer card itself.
   ──────────────────────────────────────────────── */
export default function InteractiveComposer() {
  useEffect(ensureStyles, [])

  const [features, setFeatures] = useState<ComposerState>({
    scopeBanner: false,
    replyTo: false,
    plan: false,
    suggestions: true,
    attachments: false,
  })

  const [text, setText] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [arrowAnim, setArrowAnim] = useState(false)
  const [flashChip, setFlashChip] = useState<string | null>(null)
  const [planExpanded, setPlanExpanded] = useState(false)
  const [scopeItems, setScopeItems] = useState<ScopeItem[]>(INITIAL_SCOPE_ITEMS)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = "auto"
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px"
  }, [text])

  const getPlaceholder = useCallback(() => {
    if (features.replyTo) return PLACEHOLDER_MAP.reply
    if (features.scopeBanner) return PLACEHOLDER_MAP.scope
    return PLACEHOLDER_MAP.default
  }, [features.replyTo, features.scopeBanner])

  const handleSend = useCallback(() => {
    if (!text.trim() && !features.attachments) return
    setIsSending(true)
    setArrowAnim(true)
    setTimeout(() => {
      setText("")
      setIsSending(false)
      if (textareaRef.current) textareaRef.current.style.height = "auto"
    }, 400)
    setTimeout(() => setArrowAnim(false), 500)
  }, [text, features.attachments])

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setFlashChip(suggestion)
    setTimeout(() => {
      setText(suggestion)
      setFlashChip(null)
      textareaRef.current?.focus()
    }, 250)
  }, [])

  const toggle = useCallback((key: keyof ComposerState) => {
    setFeatures((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      if (key === "scopeBanner" && next.scopeBanner) next.replyTo = false
      if (key === "replyTo" && next.replyTo) next.scopeBanner = false
      return next
    })
    if (key === "plan") setPlanExpanded(false)
    if (key === "scopeBanner") setScopeItems(INITIAL_SCOPE_ITEMS)
  }, [])

  const removeScopeItem = useCallback((id: string) => {
    setScopeItems((prev) => {
      const next = prev.filter((item) => item.id !== id)
      if (next.length === 0) {
        setFeatures((f) => ({ ...f, scopeBanner: false }))
      }
      return next
    })
  }, [])

  const hasContent = text.trim().length > 0 || features.attachments

  /* ── Context ring (SVG) ── */
  const contextUsed = 66
  const contextMax = 75
  const contextPct = contextUsed / contextMax
  const ringR = 8
  const ringCirc = 2 * Math.PI * ringR
  const ringOffset = ringCirc * (1 - contextPct)

  /* ── Determine which island panels are active ──
     Islands slide up from behind the composer.
     Order: plan first (topmost), then scope/reply-to.
     Scope and reply-to are mutually exclusive.
     Attachments live INSIDE the composer. */
  const islandPanels: string[] = []
  if (features.plan) islandPanels.push("plan")
  if (features.scopeBanner) islandPanels.push("scope")
  if (features.replyTo) islandPanels.push("reply")

  return (
    <div className="relative flex min-h-[520px] flex-col">

      {/* ── Controls — float at top of stage ── */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pb-6">
        <span className="section-label mr-1">Controls</span>
        {(
          [
            ["scopeBanner", "Scope"],
            ["replyTo", "Reply-to"],
            ["plan", "Plan"],
            ["suggestions", "Suggestions"],
            ["attachments", "Attachments"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => toggle(key)}
            className={`
              relative text-xs px-2.5 py-1 rounded-md border transition-all duration-200
              ${features[key]
                ? "border-foreground/20 bg-foreground/[0.04] text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }
            `}
          >
            {label}
            {features[key] && (
              <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-foreground/40" />
            )}
          </button>
        ))}
      </div>

      {/* ── Spacer — pushes composer assembly to the bottom ── */}
      <div className="flex-1" />

      {/* ── Stacked Islands + Composer — pinned to bottom center ── */}
      <div className="mx-auto w-full max-w-[720px] flex flex-col items-center">

        {/* ── Island Panels ── 
            Each island is an independent card. They stack with slight overlap
            so the next element (either another island or the composer) covers
            the bottom portion, creating the "slide up from behind" look.
            
            Only the topmost island gets full visual prominence (shadow + border).
            Lower islands are partially obscured. */}
        {islandPanels.map((panel, index) => {
          const isTop = index === 0

          return (
            <div
              key={panel}
              className="composer-island-enter w-[95%]"
              style={{
                zIndex: 0,
                animationDelay: `${index * 40}ms`,
              }}
            >
              <div
                className={`
                  border border-b-0 border-border bg-background
                  ${isTop
                    ? "rounded-t-xl shadow-[0_-1px_6px_rgba(0,0,0,0.04),0_-4px_16px_rgba(0,0,0,0.03)]"
                    : ""
                  }
                `}
              >
                {/* ─ Plan panel ─ */}
                {panel === "plan" && (
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <HugeiconsIcon icon={Task01Icon} size={13} strokeWidth={1.5} />
                        <span>0 out of {PLAN_TASKS.length} tasks completed</span>
                      </div>
                      <button
                        onClick={() => setPlanExpanded(!planExpanded)}
                        className="text-muted-foreground/60 transition-colors hover:text-foreground"
                      >
                        <HugeiconsIcon
                          icon={planExpanded ? ArrowShrink01Icon : ArrowExpand01Icon}
                          size={14}
                          strokeWidth={1.5}
                        />
                      </button>
                    </div>

                    {/* Expanded task list */}
                    {planExpanded && (
                      <div className="composer-slide-in mt-3 space-y-2.5">
                        {PLAN_TASKS.map((task, i) => (
                          <div
                            key={i}
                            className={`flex items-start gap-2.5 text-sm leading-snug ${task.dimmed ? "text-muted-foreground/40" : "text-foreground"}`}
                          >
                            <span className={`mt-[3px] flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full border ${task.dimmed ? "border-muted-foreground/20" : "border-muted-foreground/40"}`} />
                            <span>{i + 1}. {task.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ─ Scope panel ─ */}
                {panel === "scope" && (
                  <div className="px-3 py-2.5 flex items-center gap-2">
                    <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
                      {scopeItems.map((item) => (
                        <span
                          key={item.id}
                          className="composer-slide-in inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-0.5 text-xs text-foreground group/scope"
                        >
                          <HugeiconsIcon icon={item.icon} size={12} strokeWidth={1.5} className="text-muted-foreground shrink-0" />
                          <span className="truncate max-w-[160px]">{item.label}</span>
                          <button
                            onClick={() => removeScopeItem(item.id)}
                            className="text-muted-foreground/40 transition-colors hover:text-foreground opacity-0 group-hover/scope:opacity-100"
                          >
                            <HugeiconsIcon icon={Cancel01Icon} size={10} strokeWidth={2} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => toggle("scopeBanner")}
                      className="shrink-0 text-muted-foreground/40 transition-colors hover:text-foreground"
                    >
                      <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                )}

                {/* ─ Reply panel ─ */}
                {panel === "reply" && (
                  <div className="px-4 py-2.5 flex items-center gap-2">
                    <HugeiconsIcon icon={MailReply01Icon} size={13} strokeWidth={1.5} className="shrink-0 text-muted-foreground/60" />
                    <span className="text-xs text-muted-foreground truncate flex-1">{REPLY_QUOTE}</span>
                    <button
                      onClick={() => toggle("replyTo")}
                      className="shrink-0 text-muted-foreground/60 transition-colors hover:text-foreground"
                    >
                      <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* ── The Composer Card ── 
            Always on top (z-1). Full rounded border + shadow.
            Overlaps island bottom edges so they appear behind. */}
        <div
          className={`
            relative z-[1] w-full rounded-xl border bg-background
            transition-shadow duration-300 ease-out
            ${isFocused
              ? "border-foreground/15 shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_12px_rgba(0,0,0,0.06),0_8px_32px_rgba(0,0,0,0.04)]"
              : "border-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)]"
            }
          `}
        >
          {/* Attachment preview — inside the composer */}
          {features.attachments && (
            <div className="composer-slide-in px-4 pt-3 pb-1 flex gap-2">
              {MOCK_ATTACHMENTS.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-2 group"
                >
                  <HugeiconsIcon icon={file.icon} size={14} strokeWidth={1.5} className="text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate max-w-[140px]">{file.name}</p>
                    <p className="text-[10px] text-muted-foreground">{file.size}</p>
                  </div>
                  <button
                    onClick={() => toggle("attachments")}
                    className="ml-0.5 text-muted-foreground/40 hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── Textarea area ── */}
          <div className={`px-4 ${features.attachments ? "pt-2" : "pt-3"} pb-1`}>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder={getPlaceholder()}
              rows={1}
              className="w-full min-h-[32px] max-h-[160px] resize-none bg-transparent text-sm leading-relaxed placeholder:text-muted-foreground/50 focus:outline-none"
            />
          </div>

          {/* ── Toolbar row ── */}
          <div className="flex items-center gap-1 px-3 pb-3 pt-0.5">
            {/* + dropdown button */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/50 transition-all duration-200 outline-none hover:text-foreground hover:bg-muted/60"
              >
                <HugeiconsIcon icon={Add01Icon} size={16} strokeWidth={1.5} />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" sideOffset={8} align="start" className="min-w-[200px]">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Add to message</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => toggle("attachments")}>
                    <HugeiconsIcon icon={File01Icon} size={14} strokeWidth={1.5} />
                    Upload file
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggle("attachments")}>
                    <HugeiconsIcon icon={Image01Icon} size={14} strokeWidth={1.5} />
                    Upload image
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={Attachment01Icon} size={14} strokeWidth={1.5} />
                    Paste from clipboard
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Connect</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={Plug01Icon} size={14} strokeWidth={1.5} />
                    Add connector
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={Globe02Icon} size={14} strokeWidth={1.5} />
                    Web search
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Context ring */}
            <div className="flex items-center gap-1.5 mr-1" title={`${contextUsed}k / ${contextMax}k tokens`}>
              <svg width="20" height="20" viewBox="0 0 20 20" className="opacity-50">
                <circle
                  cx="10" cy="10" r={ringR}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  opacity="0.15"
                />
                <circle
                  cx="10" cy="10" r={ringR}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray={ringCirc}
                  strokeDashoffset={ringOffset}
                  strokeLinecap="round"
                  transform="rotate(-90 10 10)"
                  className="text-muted-foreground"
                />
              </svg>
            </div>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!hasContent}
              className={`
                flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200
                ${hasContent
                  ? "bg-foreground text-background hover:opacity-90"
                  : "bg-muted/60 text-muted-foreground/40 cursor-not-allowed"
                }
                ${isSending ? "composer-send-anim" : ""}
              `}
            >
              <span className={arrowAnim ? "composer-arrow-anim" : ""}>
                <HugeiconsIcon icon={ArrowUp02Icon} size={15} strokeWidth={2} />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Suggestion chips — outside the islands, below composer */}
      {features.suggestions && (
        <div className="composer-slide-in mt-3 flex flex-wrap justify-center gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSuggestionClick(s)}
              className={`
                rounded-md border border-border/60 px-2.5 py-1 text-xs text-muted-foreground
                transition-all duration-200 hover:border-border hover:text-foreground hover:bg-muted/40
                ${flashChip === s ? "composer-chip-flash" : ""}
              `}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Interaction hints */}
      <div className="mt-3 mb-2 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-muted-foreground/40 justify-center">
        <span>Type to auto-expand</span>
        <span>Enter to send</span>
        <span>Shift+Enter for newline</span>
        <span>Click suggestions to fill</span>
      </div>
    </div>
  )
}
