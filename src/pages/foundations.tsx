import { useState, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { SparklesIcon } from "@hugeicons/core-free-icons"

/* ------------------------------------------------------------------ */
/*  Injected CSS animations                                            */
/* ------------------------------------------------------------------ */

const STYLE_ID = "foundations-page-styles"
function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement("style")
  style.id = STYLE_ID
  style.textContent = `
    @keyframes fnd-slide-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fnd-fade-in { from { opacity: 0; } to { opacity: 1; } }
    .fnd-slide-in { animation: fnd-slide-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
    .fnd-fade-in { animation: fnd-fade-in 0.2s ease forwards; }
  `
  document.head.appendChild(style)
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const paradigmShift = [
  { dimension: "Orientation", ux: "Screen-centric", ax: "Relationship-centric" },
  { dimension: "Task type", ux: "Single-shot, discrete", ax: "Ongoing goals, iterative loops" },
  { dimension: "Path planning", ux: "Designer pre-plans every flow", ax: "System plans own execution" },
  { dimension: "Context", ux: "User supplies all context", ax: "Context is learned, not re-asked" },
  { dimension: "Success metric", ux: "Fewer clicks, faster completion", ax: "Earned trust & compounding value" },
  { dimension: "Trust contract", ux: "Static (same behavior every time)", ax: "Dynamic (trust re-established as autonomy grows)" },
  { dimension: "Failure mode", ux: "User confusion", ax: "Agent doing the wrong thing confidently" },
  { dimension: "Design artifact", ux: "Screen flows, components", ax: "Constraint sets, guardrails, reasoning patterns" },
  { dimension: "Feedback loop", ux: "Immediate, synchronous", ax: "Async, multi-turn, cross-session" },
]

const principles = [
  {
    title: "Transparency Over Confidence",
    description: "Show your work. Expose reasoning, citations, and tool use so users can verify every claim.",
  },
  {
    title: "Control Is a Trust Signal",
    description: "Pause, override, kill switch, and feedback controls build trust faster than perfect accuracy.",
  },
  {
    title: "Progressive Autonomy",
    description: "Start at Level 2. Let users unlock higher autonomy levels as the agent proves reliable over time.",
  },
  {
    title: "Full Preview Before Action",
    description: "Render a full-fidelity preview of exactly what will happen before executing any irreversible action.",
  },
  {
    title: "Solve the Blank Canvas",
    description: "Provide suggestions, templates, and examples in every empty state — never leave users staring at nothing.",
  },
  {
    title: "Errors Are Diagnostic",
    description: "Never generic errors. Always show what failed, why it failed, and what the user can do next.",
  },
  {
    title: "Memory Requires Control",
    description: "Users must be able to see, edit, and delete anything the agent remembers about them.",
  },
  {
    title: "Granular Feedback",
    description: "Thumbs up/down is the floor. Enable typed corrections with behavioral consequence for the agent.",
  },
  {
    title: "Cost Should Be Visible",
    description: "Show token usage, elapsed time, and cost transparency so users can make informed decisions.",
  },
  {
    title: "Design the Relationship",
    description: "The fundamental unit is the ongoing user-agent relationship, not the individual session.",
  },
]

const taxonomy = [
  {
    category: "Wayfinders",
    patterns: "Example Gallery, Follow Up, Suggestions, Templates",
    purpose: "Help users discover AI capabilities and get started quickly",
    maps: "Conversation",
  },
  {
    category: "Prompt Actions",
    patterns: "Chained Action, Inline Action, Regenerate, Transform",
    purpose: "How users interact with and direct AI behavior",
    maps: "Agent Actions",
  },
  {
    category: "Tuners",
    patterns: "Attachments, Connectors, Filters, Modes, Parameters",
    purpose: "Context and configuration inputs that shape AI output",
    maps: "Agent Config",
  },
  {
    category: "Governors",
    patterns: "Action Plan, Citations, Controls, Memory, Verification",
    purpose: "Oversight, control, and accountability mechanisms",
    maps: "Rich Previews",
  },
  {
    category: "Trust Builders",
    patterns: "Caveat, Consent, Data Ownership, Disclosure, Footprints",
    purpose: "Transparency, safety, and confidence-building patterns",
    maps: "Trust & Governance",
  },
  {
    category: "Identifiers",
    patterns: "Avatar, Color, Iconography, Name, Personality",
    purpose: "AI brand presence and visual language cues",
    maps: "Trust & Governance",
  },
]

const autonomyLevels = [
  {
    level: 1,
    name: "Human-Augmented",
    description: "Human does everything; AI provides suggestions and information on demand.",
    uiPattern: "Ask AI pane",
  },
  {
    level: 2,
    name: "Human-in-Command",
    description: "AI drafts outputs and proposes actions; human approves every one before execution.",
    uiPattern: "Approval modal",
  },
  {
    level: 3,
    name: "Human-Delegated",
    description: "AI handles routine tasks autonomously; human reviews only flagged exceptions.",
    uiPattern: "Inbox of flagged items",
  },
  {
    level: 4,
    name: "Human-in-the-Loop",
    description: "AI executes freely but escalates when confidence drops below a set threshold.",
    uiPattern: "Confidence slider",
  },
  {
    level: 5,
    name: "Human-on-the-Loop",
    description: "AI operates fully autonomously; human monitors a dashboard and can override at any time.",
    uiPattern: "Monitoring dashboard + kill switch",
  },
  {
    level: 6,
    name: "Human-Out-of-the-Loop",
    description: "Full autonomy. Human is notified only on anomalies or periodic reports.",
    uiPattern: "Activity log + anomaly alerts",
  },
]

const colorTokens = [
  { name: "background", value: "oklch(0.145 0 0)", swatch: "bg-background" },
  { name: "foreground", value: "oklch(0.985 0 0)", swatch: "bg-foreground" },
  { name: "card", value: "oklch(0.205 0 0)", swatch: "bg-card" },
  { name: "primary", value: "oklch(0.922 0 0)", swatch: "bg-primary" },
  { name: "secondary", value: "oklch(0.269 0 0)", swatch: "bg-secondary" },
  { name: "muted", value: "oklch(0.269 0 0)", swatch: "bg-muted" },
  { name: "accent", value: "oklch(0.269 0 0)", swatch: "bg-accent" },
  { name: "destructive", value: "oklch(0.704 0.191 22.216)", swatch: "bg-destructive" },
  { name: "border", value: "oklch(1 0 0 / 10%)", swatch: "bg-border" },
]

const typographyTokens = [
  {
    name: "Sans (UI Text)",
    font: "Albert Sans",
    className: "font-sans",
    weights: "300–900",
    sample: "The quick brown fox jumps over the lazy dog",
  },
  {
    name: "Serif (Agent Prose)",
    font: "Source Serif 4",
    className: "font-serif",
    weights: "200–900, italic",
    sample: "The quick brown fox jumps over the lazy dog",
  },
]

const spacingTokens = [
  { name: "radius-sm", value: "calc(0.625rem × 0.6)", visual: "3.75px" },
  { name: "radius-md", value: "calc(0.625rem × 0.8)", visual: "5px" },
  { name: "radius-lg", value: "0.625rem", visual: "10px" },
  { name: "radius-xl", value: "calc(0.625rem × 1.4)", visual: "14px" },
]

const agentTokens = [
  { token: "Agent prose font-size", value: "16px", context: "Source Serif 4 body text" },
  { token: "Tool title font-size", value: "14px", context: "Albert Sans, tool call headers" },
  { token: "Tool detail font-size", value: "12px", context: "Albert Sans, tool metadata" },
  { token: "Prose line-height", value: "26px", context: "Generous leading for readability" },
  { token: "Prose letter-spacing", value: "-0.4px", context: "Tighter tracking for optical balance" },
  { token: "Prose color (light)", value: "oklch(0.2642 0.013 93.9)", context: "Warm near-black for print feel" },
  { token: "p + p spacing", value: "16px", context: "margin-top between paragraphs" },
  { token: "Max content width", value: "720px", context: "Agent message column" },
  { token: "Composer max width", value: "720px", context: "Input area matches content" },
  { token: "Banner max width", value: "690px", context: "Slightly narrower than content" },
]

/* ------------------------------------------------------------------ */
/*  Interactive data                                                    */
/* ------------------------------------------------------------------ */

const weightOptions = [
  { label: "Light", value: 300 },
  { label: "Regular", value: 400 },
  { label: "Medium", value: 500 },
  { label: "SemiBold", value: 600 },
  { label: "Bold", value: 700 },
]

const sizeOptions = [12, 14, 16, 20, 24, 32]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Foundations() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)
  const [hoveredColor, setHoveredColor] = useState<string | null>(null)
  const [selectedWeight, setSelectedWeight] = useState(400)
  const [selectedSize, setSelectedSize] = useState(16)

  useEffect(() => {
    ensureStyles()
  }, [])

  const activeLevel = selectedLevel !== null
    ? autonomyLevels.find((l) => l.level === selectedLevel)
    : null

  return (
    <article>
      {/* Page header — editorial, serif, generous spacing */}
      <header className="mb-20">
        <p className="section-label mb-4">Foundations</p>
        <h1 className="font-serif text-4xl font-light tracking-tight leading-[1.15]">
          Principles, patterns, and design tokens for agentic interfaces
        </h1>
        <p className="mt-5 max-w-[640px] text-[15px] leading-relaxed text-muted-foreground">
          These foundations define how we think about designing for AI agents —
          not as tools, but as autonomous actors in an ongoing relationship with
          humans.
        </p>
      </header>

      {/* ─── S1 — UX → AX Paradigm ─── */}
      <section id="ux-ax" className="page-section">
        <p className="section-label mb-3">Paradigm</p>
        <h2 className="text-xl font-semibold tracking-tight">
          UX → AX
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Agentic Experience represents a fundamental shift from traditional UX.
          Where UX optimizes screens and clicks, AX designs relationships, trust,
          and progressive autonomy.
        </p>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="whitespace-nowrap pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                  Dimension
                </th>
                <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">
                  Traditional UX
                </th>
                <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    Agentic Experience
                    <HugeiconsIcon icon={SparklesIcon} size={12} strokeWidth={1.5} />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paradigmShift.map((row, i) => (
                <tr
                  key={row.dimension}
                  className={i < paradigmShift.length - 1 ? "border-b border-border/50" : ""}
                >
                  <td className="whitespace-nowrap py-3 pr-6 font-medium">
                    {row.dimension}
                  </td>
                  <td className="py-3 pr-6 text-muted-foreground">{row.ux}</td>
                  <td className="py-3">{row.ax}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-8 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          AI agents are no longer tools — they are actors. Design the
          relationship, not the screen.
        </p>
      </section>

      {/* ─── S2 — Principles ─── */}
      <section id="principles" className="page-section">
        <p className="section-label mb-3">Principles</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Ten design principles for agentic interfaces
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Each principle addresses a distinct failure mode of autonomous systems.
          Use this list as a design review checklist before shipping any agentic
          feature.
        </p>

        <div className="mt-12 space-y-10">
          {principles.map((p, i) => (
            <div key={p.title} className="grid grid-cols-[48px_1fr] gap-4">
              <span className="principle-num">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-[15px] font-semibold leading-snug">
                  {p.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          Principles 1–4 address trust · 5–8 address usability · 9–10 address systemic design
        </p>
      </section>

      {/* ─── S3 — Pattern Taxonomy ─── */}
      <section id="taxonomy" className="page-section">
        <p className="section-label mb-3">Taxonomy</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Pattern categories
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Six taxonomy categories from the Shape of AI framework, adapted for
          agentic design. Each groups patterns by their role in the user-agent
          interaction.
        </p>

        <div className="mt-10 space-y-6">
          {taxonomy.map((row) => (
            <div key={row.category} className="grid grid-cols-[120px_1fr] gap-6 items-baseline">
              <span className="text-sm font-semibold">{row.category}</span>
              <div>
                <p className="text-sm text-muted-foreground">{row.purpose}</p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  {row.patterns}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border/50 pt-6">
          <p className="section-label mb-4">Mapping to this system</p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {taxonomy.map((t) => (
              <p key={t.category} className="text-muted-foreground">
                <span className="font-medium text-foreground">{t.category}</span>
                {" → "}
                {t.maps}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ─── S4 — Autonomy Spectrum (Interactive) ─── */}
      <section id="autonomy-spectrum" className="page-section">
        <p className="section-label mb-3">Autonomy</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Autonomy spectrum
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Six levels of agent autonomy. The UI surface changes at each level —
          design for the level your users are ready for, and let them graduate
          upward.
        </p>

        {/* Spectrum bar — interactive */}
        <div className="mt-10 flex items-end gap-px">
          {autonomyLevels.map((l) => (
            <div
              key={l.level}
              className="flex-1 text-center cursor-pointer"
              onClick={() =>
                setSelectedLevel(selectedLevel === l.level ? null : l.level)
              }
            >
              <div
                className="mx-auto mb-2 h-8 rounded-sm transition-all duration-200 hover:scale-105"
                style={{
                  background: `oklch(0.75 0.12 ${160 + (l.level - 1) * 40})`,
                  opacity:
                    selectedLevel === null
                      ? 0.5 + l.level * 0.08
                      : selectedLevel === l.level
                        ? 1
                        : 0.25,
                  boxShadow:
                    selectedLevel === l.level
                      ? "0 0 0 2px oklch(0.985 0 0 / 60%)"
                      : "none",
                }}
              />
              <span
                className="text-[11px] font-medium tabular-nums transition-opacity duration-200"
                style={{
                  opacity:
                    selectedLevel === null
                      ? 1
                      : selectedLevel === l.level
                        ? 1
                        : 0.4,
                }}
              >
                {l.level}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground/60">
          <span>Human control</span>
          <span>Agent autonomy</span>
        </div>

        {/* Selected level description panel */}
        {activeLevel && (
          <div
            key={activeLevel.level}
            className="fnd-slide-in mt-6 rounded-md border border-border bg-card p-5"
          >
            <p className="text-xs font-medium text-muted-foreground">
              Level {activeLevel.level}
            </p>
            <h3 className="mt-1 text-[15px] font-semibold leading-snug">
              {activeLevel.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {activeLevel.description}
            </p>
            <p className="mt-3 text-xs text-muted-foreground/60">
              UI pattern: {activeLevel.uiPattern}
            </p>
          </div>
        )}

        {/* Level descriptions */}
        <div className="mt-10 space-y-6">
          {autonomyLevels.map((l) => (
            <div key={l.level} className="grid grid-cols-[48px_1fr] gap-4 items-baseline">
              <span className="principle-num">{l.level}</span>
              <div>
                <h3 className="text-[15px] font-semibold leading-snug">{l.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {l.description}
                </p>
                <p className="mt-1 text-xs text-muted-foreground/60">
                  UI pattern: {l.uiPattern}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-2">
          <p className="text-sm">
            <span className="font-medium">Default to Level 2</span>
            <span className="text-muted-foreground"> — Human-in-Command is the safest default for new users and high-stakes domains.</span>
          </p>
          <p className="text-sm">
            <span className="font-medium">Never skip levels</span>
            <span className="text-muted-foreground"> — Trust is earned incrementally. Users should experience each level sequentially.</span>
          </p>
          <p className="text-sm">
            <span className="font-medium">Always provide a kill switch</span>
            <span className="text-muted-foreground"> — Even at Level 6, users must be able to halt the agent instantly.</span>
          </p>
        </div>
      </section>

      {/* ─── S5 — Design Tokens ─── */}
      <section id="tokens" className="page-section">
        <p className="section-label mb-3">Tokens</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Design tokens
        </h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Color, typography, spacing, and agent-specific tokens defined as CSS
          custom properties via Tailwind CSS v4's{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">@theme inline</code>{" "}
          block.
        </p>

        {/* Colors — with hover tooltip */}
        <div className="mt-12">
          <p className="section-label mb-4">Color Palette (Dark Mode)</p>
          <div className="grid grid-cols-3 gap-x-4 gap-y-5 sm:grid-cols-5">
            {colorTokens.map((token) => (
              <div
                key={token.name}
                className="relative"
                onMouseEnter={() => setHoveredColor(token.name)}
                onMouseLeave={() => setHoveredColor(null)}
              >
                <div
                  className={`h-10 rounded-md border border-border/50 ${token.swatch}`}
                />
                <p className="mt-2 text-xs font-medium">{token.name}</p>
                <p className="text-[10px] text-muted-foreground/70">{token.value}</p>

                {/* Tooltip */}
                {hoveredColor === token.name && (
                  <div
                    className="fnd-fade-in absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-md bg-foreground px-3 py-2 text-xs text-background"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    <p className="font-medium">{token.name}</p>
                    <p className="mt-0.5 opacity-80">{token.value}</p>
                    {/* Caret */}
                    <div
                      className="absolute left-1/2 top-full -translate-x-1/2"
                      style={{
                        width: 0,
                        height: 0,
                        borderLeft: "5px solid transparent",
                        borderRight: "5px solid transparent",
                        borderTop: "5px solid var(--foreground)",
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Typography — with interactive controls */}
        <div className="mt-14">
          <p className="section-label mb-6">Typography</p>

          {/* Interactive controls */}
          <div className="mb-8 space-y-4 rounded-md border border-border bg-card p-4">
            {/* Weight selector */}
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Weight</p>
              <div className="flex flex-wrap gap-1.5">
                {weightOptions.map((w) => (
                  <button
                    key={w.value}
                    onClick={() => setSelectedWeight(w.value)}
                    className={`rounded-md px-3 py-1.5 text-xs transition-colors ${
                      selectedWeight === w.value
                        ? "bg-foreground text-background"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {w.label} {w.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Size</p>
              <div className="flex flex-wrap gap-1.5">
                {sizeOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`rounded-md px-3 py-1.5 text-xs transition-colors ${
                      selectedSize === s
                        ? "bg-foreground text-background"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s}px
                  </button>
                ))}
              </div>
            </div>

            {/* Live preview */}
            <div className="mt-2 border-t border-border/50 pt-4">
              <p className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground/60">
                Preview — {selectedWeight} · {selectedSize}px
              </p>
              <p
                className="font-sans"
                style={{ fontWeight: selectedWeight, fontSize: `${selectedSize}px` }}
              >
                The quick brown fox jumps over the lazy dog
              </p>
              <p
                className="mt-2 font-serif"
                style={{ fontWeight: selectedWeight, fontSize: `${selectedSize}px` }}
              >
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
          </div>

          <div className="space-y-10">
            {typographyTokens.map((token) => (
              <div key={token.name}>
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-sm font-medium">{token.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {token.font} · {token.weights}
                  </span>
                </div>
                <p className={`text-2xl font-light ${token.className}`}>{token.sample}</p>
                <p className={`mt-3 text-base ${token.className}`}>{token.sample}</p>
                <p className={`mt-2 text-sm text-muted-foreground ${token.className}`}>{token.sample}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Agent prose sample */}
        <div className="mt-14">
          <p className="section-label mb-6">Agent Prose Rendering</p>
          <div className="border-l-2 border-muted-foreground/15 pl-6">
            <div
              className="font-serif"
              style={{
                fontSize: "16px",
                lineHeight: "26px",
                letterSpacing: "-0.4px",
                fontVariationSettings: '"opsz" 12',
              }}
            >
              <p>
                Based on my analysis of the submitted Security Target, the TOE
                meets the requirements for EAL4+ augmented with ALC_FLR.2. The
                cryptographic module implements AES-256-GCM for data-at-rest
                encryption with NIST-validated key derivation.
              </p>
              <p className="mt-4">
                However, I identified two areas requiring evaluator attention:
                the audit log rotation policy references a deprecated hashing
                algorithm (SHA-1), and the secure boot chain does not account for
                firmware rollback scenarios described in AGD_OPE.1.
              </p>
            </div>
            <p className="mt-4 text-[10px] text-muted-foreground/60">
              Source Serif 4 · 16px / 26px · letter-spacing -0.4px ·
              font-variation-settings: "opsz" 12
            </p>
          </div>
        </div>

        {/* Spacing & Radius */}
        <div className="mt-14">
          <p className="section-label mb-4">Spacing & Radius</p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
            {spacingTokens.map((token) => (
              <div key={token.name}>
                <p className="text-sm font-medium">{token.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {token.value}
                </p>
                <p className="text-[10px] text-muted-foreground/60">
                  ≈ {token.visual}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Agent-specific tokens */}
        <div className="mt-14">
          <p className="section-label mb-4">Agent-Specific Tokens</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">Token</th>
                  <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">Value</th>
                  <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Context</th>
                </tr>
              </thead>
              <tbody>
                {agentTokens.map((t, i) => (
                  <tr
                    key={t.token}
                    className={i < agentTokens.length - 1 ? "border-b border-border/50" : ""}
                  >
                    <td className="whitespace-nowrap py-2.5 pr-6 font-medium">
                      {t.token}
                    </td>
                    <td className="py-2.5 pr-6">
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                        {t.value}
                      </code>
                    </td>
                    <td className="py-2.5 text-muted-foreground">
                      {t.context}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Type scale in context */}
        <div className="mt-14">
          <p className="section-label mb-6">Type Scale in Context</p>
          <div className="space-y-8">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
                Agent Prose — 16px / Source Serif 4
              </span>
              <p
                className="mt-2 font-serif"
                style={{
                  fontSize: "16px",
                  lineHeight: "26px",
                  letterSpacing: "-0.4px",
                  fontVariationSettings: '"opsz" 12',
                }}
              >
                The evaluation confirms conformance with Protection Profile PP-OS-v4.2.1.
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
                Tool Title — 14px / Albert Sans
              </span>
              <p className="mt-2 font-sans text-sm">
                Searching compliance database for matching requirements
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
                Tool Detail — 12px / Albert Sans
              </span>
              <p className="mt-2 font-sans text-xs text-muted-foreground">
                Found 14 matching SFRs across 3 protection profiles · 240ms
              </p>
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}
