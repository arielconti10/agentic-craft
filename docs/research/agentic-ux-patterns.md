# Agentic UX Design Patterns

> A position document and field map for designing agent interfaces.
> Compiled March 2026 · revised June 2026.
> Canonical research backing for [agentic-craft](https://github.com/bitcomplete/agentic-craft).

## How to read this document

This is the canonical research artifact behind agentic-craft. It is two things at once and labels each clearly:

1. **A position document** (sections 1–9). What we believe agentic UI should be, what patterns the registry encodes, and what we explicitly reject. Opinionated. Driven by the product.
2. **A field map appendix** (sections 10–13). What the field looks like in mid-2026: who is shipping what, where conventions have settled, where they have not, and what we don't yet know. Descriptive. Honest about gaps.

The previous draft of this document tried to be a neutral pattern catalog. That hid the design choices behind the registry and made the doc less useful as product backing. This version takes positions in the body and keeps the survey-style material in the appendix where it belongs.

### Evidence tiers

Every claim about a pattern is tagged with a confidence tier:

- **[Convention]** — Three or more major products ship it; the pattern is settled.
- **[Emerging]** — One or two products ship it; recent (2025–2026); industry is still feeling out the shape.
- **[Speculative]** — Proposed in standards, papers, or single-vendor previews; not yet validated at scale.

Tiers are how this document signals what is safe to copy versus what is a bet.

### Citations

Primary sources first. Where a primary source is unavailable, secondary sources are cited explicitly. Where a claim has no citation it is the authors' own position and should be read as such.

---

## Table of contents

**Position (what we believe)**

1. [The UX → AX shift](#1-the-ux--ax-shift)
2. [Foundational pattern frameworks](#2-foundational-pattern-frameworks)
3. [Visible work, locked consequences](#3-visible-work-locked-consequences)
4. [Autonomy as a contract](#4-autonomy-as-a-contract)
5. [Trust through provenance](#5-trust-through-provenance)
6. [Memory as ledger, not magic](#6-memory-as-ledger-not-magic)
7. [Operational surfaces beyond chat](#7-operational-surfaces-beyond-chat)
8. [Agent-authored UI: the third layer](#8-agent-authored-ui-the-third-layer)
9. [Dynamic Workflows as a product surface](#9-dynamic-workflows-as-a-product-surface)

**Field map (what exists)**

10. [Product inventories: how the leaders ship in mid-2026](#10-product-inventories)
11. [Anti-patterns and what we explicitly reject](#11-anti-patterns)
12. [Open questions the field has not answered](#12-open-questions)
13. [How this maps to the agentic-craft registry](#13-registry-mapping)

**Principles**

14. [Ten principles, defended](#14-ten-principles-defended)

---

## 1. The UX → AX shift

The shift from traditional UX to Agentic Experience (AX) is structural, not cosmetic. Designers who treat agents as "smarter forms" ship the wrong thing.

| Dimension | Traditional UX | Agentic Experience |
|-----------|----------------|-------------------|
| Unit of design | A screen flow | An ongoing relationship |
| Path planning | Designer pre-plans every flow | Agent plans its own execution |
| Context | User re-supplies on each session | Context is learned across sessions |
| Success metric | Task completed quickly | Trust accumulated and value compounded |
| Failure mode | User picks the wrong path | Agent confidently does the wrong thing |
| Trust contract | Static (same behavior always) | Dynamic (must be re-earned as autonomy grows) |
| Designer's role | Drawing flows | Defining constraints |
| Feedback loop | Immediate, synchronous | Async, multi-turn, cross-session |

**The reframe that matters.** Generative UI shifts designers from designing for the average user to designing constraints — *what must be shown / should be shown / never shown* — and letting the system compose the rest. ([NN/g: Generative UI](https://www.nngroup.com/articles/generative-ui/))

**The shift in agent role.** Agents are no longer tools; they are actors. Service design must now account for personal agents that act for users and organizational agents that act for businesses. Agent-to-agent compatibility is becoming a competitive metric. ([NN/g: Service Design with AI Agents](https://www.nngroup.com/articles/service-design-evolve-ai-agents/))

**Why this section is short.** The framing is settled. The disagreements in the field are about what to do *with* this framing — those are the next eight sections.

---

## 2. Foundational pattern frameworks

Five frameworks form the canon. None is complete; each captures something the others miss. We treat them as inputs, not authorities — the position the rest of this document takes is informed by them but is not bound by them.

### 2.1 Shape of AI — the pattern library

Emily Campbell's [shapeof.ai](https://www.shapeof.ai) is the most thorough taxonomy of chat-and-generative patterns in production. Six categories, ~45 named patterns:

- **Wayfinders** — onboarding, suggestions, templates, example galleries
- **Prompt Actions** — how users submit and refine (regenerate, expand, inline action, restructure)
- **Tuners** — context inputs (attachments, connectors, filters, modes)
- **Governors** — oversight (action plans, citations, controls, stream of thought, cost estimates)
- **Trust Builders** — caveats, consent, disclosure, footprints, watermarks
- **Identifiers** — avatar, color, naming, personality

**What it gets right.** Comprehensive, observed-in-the-wild, vendor-neutral.

**What it misses.** The frame assumes a chat-shaped product. It under-represents orchestration, scheduled work, multi-agent operations, and the operational layer beyond a single conversation.

### 2.2 Microsoft HAX — 18 evidence-based guidelines

Published at [CHI 2019](https://www.microsoft.com/en-us/research/wp-content/uploads/2019/01/Guidelines-for-Human-AI-Interaction-camera-ready.pdf), validated through a user study of 49 design practitioners across 20 AI-infused products. Four phases:

- **Initially** (G1–G2): make clear what the system can do, how well
- **During interaction** (G3–G8): context sensitivity, efficient invocation/dismissal
- **When wrong** (G9–G11): efficient correction, scoping in doubt, explaining behavior
- **Over time** (G12–G18): remember interactions, learn cautiously, encourage granular feedback, convey consequences, provide global controls, notify on changes

**What it gets right.** Empirically validated. The "over time" phase is the most useful framing for agentic products specifically.

**What it misses.** Predates the modern agentic surface. Has no model of tool use, no notion of agent-authored UI, no autonomy spectrum. Treats AI mostly as suggestion/inference, not as actor.

### 2.3 Google PAIR — product lifecycle

[pair.withgoogle.com/guidebook](https://pair.withgoogle.com/guidebook) — six chapters mapped to product development lifecycle (user needs → data → expectations → explanation → feedback → errors).

**Highest-value contribution.** Show confidence in human-understandable categories, not raw numbers. Use semantic categories (likely, possible, uncertain) or ranked ordering, never `0.73`.

**What it misses.** Lifecycle framing, not pattern framing — useful for product managers, less useful for designers actively choosing components.

### 2.4 Apple HIG for Machine Learning

[Apple's HIG for ML](https://developer.apple.com/design/human-interface-guidelines/machine-learning) defines five role dimensions (criticality, data scope, initiative, visibility, changeability) and patterns for input (explicit/implicit feedback, calibration) and output (corrections, mistakes, multiple options, confidence, attribution, limitations).

**Highest-value contribution.** The role-dimension framing. Before designing for an agent, name where it sits on each axis — that determines which patterns are appropriate.

### 2.5 AgenticUI — the design-system attempt

Alex Gilev's [AgenticUI](https://agenticui.net) bills itself as "the world's first enterprise-grade design system for building scalable agentic experiences." v1 shipped Q1 2026 as a Figma DS; v1.1 (Q2) adds AI integration; v2 (Q4) ships React components. Templates organized around three workflows: **Orchestrate**, **Create**, **Monitor**.

**Position.** AgenticUI is closer to what this document and agentic-craft are trying to do than any of the other four. Its three-workflow taxonomy is good. agentic-craft differs in being shadcn-installable, registry-driven, and open-source.

### 2.6 What's missing across all five

None of these frameworks handle:

- **Agent-authored UI** at runtime (MCP Apps, generative UI via tool parts, A2UI)
- **Workflow-as-product**: the user surface for declarative, multi-agent orchestration (Dynamic Workflows, AG-UI)
- **Multi-agent operations** beyond simple handoff
- **Cost as a first-class design dimension** with budgets, meters, and visible spend
- **Recovery semantics** beyond "retry / fail"

This document treats those gaps as the work to be done in sections 3–9.

---

## 3. Visible work, locked consequences

> **Position.** Two patterns sit at the center of credible agent UI: *visible work* (the user sees what the agent is doing while it does it) and *locked consequence previews* (before any action with real-world impact, the user sees the exact artifact that will be created). Everything else in this document supports these two.

### 3.1 Visible work

The agent does its job in front of the user — not behind a spinner.

**What "visible" means concretely.**

| Layer | What it shows | Pattern |
|-------|---------------|---------|
| **Step** | The current action ("Reading the support thread") | Step row with status glyph |
| **Tool calls** | The tools invoked, their inputs at a glance, their state | Tool call rows; tool tree for parallel |
| **Sources touched** | Documents, pages, APIs the agent consulted | Source preview cards |
| **Outcome state** | Done / running / pending / blocked | One-shape-per-state status vocabulary |

**[Convention]** Some form of visible work now ships in Claude, ChatGPT, Perplexity, Cursor, GitHub Copilot Workspace, and v0. The pattern is settled; the *shape* of visible work is still being argued.

**Our position on what visible work is *not*.**

- It is not "stream of thought." Showing raw chain-of-thought tokens is a different pattern — useful in some research surfaces, harmful in product surfaces, because the prose reads more confidently than the result deserves. Anthropic's "summarized thinking" pattern (a condensed view, expandable) is the right compromise. ([Anthropic: Extended Thinking](https://platform.claude.com/docs/en/build-with-claude/extended-thinking))
- It is not a spinner. A spinner on a tool call is the canonical AI-demo chrome failure — it implies progress without showing any.
- It is not theater. If a step ran in 40ms, do not animate it for 600ms.

**Honest disclosure.** Empty disclosure rows that pretend to expand are a violation: nothing should look interactive that isn't. ([agentic-craft DESIGN.md](https://github.com/bitcomplete/agentic-craft/blob/main/DESIGN.md))

### 3.2 Locked consequence previews

Before any action with side effects, the agent renders a *locked preview*: a fully-structured representation of the artifact that will be created, in the format of the target system, with explicit approve/reject controls.

**Why "locked."** Once the preview is shown, the parameters are committed: hitting approve produces *exactly* the artifact shown. No re-prompting, no slight differences. The preview *is* the contract.

**What it shows.**

- The exact artifact (a calendar event card, a Linear ticket, an email draft) — not a text summary
- Structured fields matching the target system
- The reason this action was chosen ("Because the bug meets your P0 criteria")
- Three-way controls: **Approve / Modify / Reject** (not just yes/no)
- Time-to-live for blocked decisions ("Waiting 14 min — expires in 6 min")

**[Convention]** The pattern is settled across Claude, Cursor, GitHub Copilot Workspace, and most agent platforms. Anthropic's Claude Code popularized the inline-preview-then-approve loop; the rest of the industry followed.

**Our position on what locked previews are *not*.**

- They are not the same as a confirm dialog ("Are you sure?"). A confirm asks the user to remember what they were doing; a preview *shows* what's about to happen.
- They are not optional for low-stakes actions. Even reads can have consequences (rate limits, observation effects, cost). The preview is a contract about *what will happen*; whether it's high- or low-stakes is decided by the user, not the designer.

**Composition.** Visible work and locked previews compose: the agent shows work *until* it reaches an action gate, then renders the preview, then waits. The trace continues after approval.

---

## 4. Autonomy as a contract

> **Position.** Autonomy is not a slider on a settings page. It is a contract between user and agent, expressed across at least three dimensions, and re-negotiated whenever the agent's behavior changes.

### 4.1 The 5-level autonomy spectrum (our canonical model)

Many sources offer competing taxonomies — 5-level, 6-mode, 8-level. After comparing them, the 5-level model (analogous to self-driving classifications) is the cleanest fit for product use, and we adopt it as the canonical agentic-craft model. The 6-mode variant is documented in the appendix for cross-reference.

| Level | Name | What the agent does | What the user does | UI surface |
|-------|------|---------------------|---------------------|------------|
| **L1** | Directed assistance | Single-step responses to narrow commands. No memory, no plan. | Initiates every action | Inline composer; suggestion chips |
| **L2** | Task-oriented | Plans a sequence of steps; user initiates each | Triggers the plan; supervises each step | Plan card; observable work; per-step approve |
| **L3** | Evaluative (HITL) | Plans and executes; pauses before flagged actions | Approves at action gates | Locked consequence preview; decision surface |
| **L4** | Supervised (HOTL) | Acts autonomously within a sandbox; user can intervene at any time | Monitors; intervenes when needed | Run monitor; kill switch; live trace |
| **L5** | Full autonomy | Self-directed; manages its own goals | Reviews after the fact | Activity log; anomaly alerts |

**Default position.** Ship at L2 by default. Earn the right to L3 with the user. Never start at L4. Never default to L5.

**Why "earn."** Autonomy is delegated trust. A new user has no basis to extend it. Products that auto-default to L4 ("background mode is on") fail the trust contract before the user understands what was delegated.

### 4.2 Autonomy is more than one number

A single "autonomy level" setting is a usability lie. Real autonomy is a matrix:

- **Per-action-type** — Read CRM (autonomous OK) ≠ Send email to customer (always ask).
- **Per-confidence** — Below threshold → escalate; above → act.
- **Per-cost** — A $0.01 action and a $50 action need different approval flows even if both are "send_email."
- **Per-rate** — "Auto-archive tickets" is fine at 10/day, alarming at 1,000/day.

**Pattern.** Surface the *effective policy* — the actual behavior the matrix produces — as a separate preview. agentic-craft calls this the **effective-policy-preview**: a compact summary that takes the autonomy, approval, notification, and memory settings and shows the user what they actually produced ("Will ask: emails to external addresses, any action > $10. Will not ask: internal reads, archival."). This is the single piece of agent UI most often missing in shipping products.

### 4.3 Renegotiation

Autonomy contracts are not set-and-forget. The agent should re-confirm autonomy when:

- The agent updates (new model, new tools, new behaviors) — per Microsoft HAX G14, G18
- The user reviews their own history and sees an outcome they didn't expect
- An action's blast radius changes (rate, cost, recipient set)

**[Emerging]** Most products do not yet handle renegotiation well. ChatGPT and Claude notify on major changes; almost no product re-asks autonomy questions after a surprising outcome.

---

## 5. Trust through provenance

> **Position.** Trust in agentic systems is not earned through confident prose. It is earned through *provenance* — visible links between every claim and its source. An agent that says less but cites everything beats an agent that says more without sources.

### 5.1 Provenance as the universal pattern

Provenance generalizes citations, source previews, and footprints into one concept: every claim, output, and action should be traceable to its inputs.

**The three layers.**

| Layer | What's traced | Pattern |
|-------|---------------|---------|
| **Claims** | Prose statements → source documents | Inline citations with source-preview hover |
| **Outputs** | Generated artifacts (reports, code, drafts) → which sections came from which sources | Source-backed artifact with cited sections |
| **Actions** | External actions → which inputs justified them | "Why this action" inside the locked preview |

### 5.2 Confidence done right

- **Never** show raw probabilities (`0.73`) outside technical/expert tools.
- **Prefer** semantic categories: "high chance," "likely," "possible," "uncertain."
- **Or** convey confidence through ranking: the top result is the most confident, full stop.
- **Withhold** low-confidence results for proactive/ambient features. ([Apple HIG: Confidence](https://developer.apple.com/design/human-interface-guidelines/machine-learning))

### 5.3 What honest disclosure looks like

- Every AI-generated artifact carries a visible label.
- Every memory entry shows where it came from.
- Every external action shows whose data it touched.
- Incognito modes exist and are visible when active.
- Nothing pretends to be deterministic that isn't.

**[Convention]** Citation patterns are settled (Perplexity and Claude shipped the canonical implementations). Provenance for *actions* and *memory* is **[Emerging]** — most products do not yet show "this action was justified by these inputs."

---

## 6. Memory as ledger, not magic

> **Position.** If an agent remembers anything about the user, the user must be able to see, edit, and delete each memory individually. "The model just learns" is not a UI; it's a violation.

### 6.1 The ledger model

Memory is not a personality. It is a ledger of entries. Each entry has:

| Field | Purpose |
|-------|---------|
| **Content** | What is remembered |
| **Source** | Where it came from (which conversation, which document) |
| **Scope** | Personal / project / org |
| **Created** | When |
| **Last used** | When the agent last applied this memory |
| **Expiry** | When it expires (some memories should sunset) |
| **Status** | Active / muted / archived |

The user surface is a row per memory with edit, mute, expire, and delete affordances. agentic-craft ships this as **memory-ledger-item**.

### 6.2 Memory taxonomy (working set)

- **Preferences** — explicit ("I prefer concise responses") and implicit (learned from usage)
- **Facts** — about the user, their team, their projects
- **Semantic** — meaning-based retrieval anchors
- **Procedural** — workflows the agent has learned to repeat

### 6.3 Memory is reviewable, not just visible

**Pattern.** Periodic memory reviews — a queue surfaces newly captured memories for explicit confirmation before they take effect. Like an inbox of provisional memories. agentic-craft ships this as **memory-review**.

**[Emerging]** ChatGPT and Claude show their memory lists; almost no product runs a periodic review queue. We think they should.

### 6.4 Memory controls

- **Forget this** — delete one memory
- **Forget this thread** — delete everything from a session
- **Never remember category X** — block whole categories
- **Incognito** — turn recording off for the current session, visibly
- **Export / import** — portability is part of trust

---

## 7. Operational surfaces beyond chat

> **Position.** Chat is one interface model among many. The operational surfaces — dashboards, inboxes, task lists, calendars, monitors — carry the weight of agentic products at scale. Designing a chat-only agent is designing a toy.

### 7.1 The five operational layouts

After [LukeW's analysis](https://www.lukew.com/ff/entry.asp?2106) and observation across shipping products, five layouts cover most operational needs. Each has trade-offs; the right choice depends on what the user is trying to do.

| Layout | Best when | Strengths | Weaknesses |
|--------|-----------|-----------|------------|
| **Kanban** | Work moves through defined stages | At-a-glance state for many agents; drag-to-reorder familiar | Implies workflow; weak on dependencies |
| **Dashboard** | High-level status across many agents/sources | Dense; flexible; no implied sequence | Easily overwhelming; weak on dependencies |
| **Inbox** | Approvals and questions one at a time | Familiar mental model; satisfying "zero" state | Scales poorly with volume; weak on parallel state |
| **Task list (hierarchical)** | Complex plans with sub-tasks and dependencies | Shows dependencies clearly; checkbox completion | Less visual; nesting hides parallel state |
| **Calendar** | Scheduled and time-bounded agents | Native time framing; integrates with real meetings | Variable-duration tasks hard to render; weak on event-triggered |

**[Convention]** All five ship across the market. Inbox is the most common default for HITL-heavy products; dashboards dominate ops-heavy products; kanban is common in agent-building tools (each agent is a card moving through stages).

### 7.2 Observability is product surface, not infra

For any agent the user trusts to act, the user must be able to see:

- A reverse-chronological **activity log** of every run
- For each run: trigger, duration, outcome, cost, human involvement
- A **mission detail** showing each step (trigger → reasoning → tool calls → HITL → output) with duration and cost per step (the Datadog-trace pattern)
- Filters by date, outcome, action type
- Export and search

agentic-craft ships these as **run-trace** (the dense per-run view) and **run-monitor** (the operational rollup).

### 7.3 Background tasks are first-class

Agents now spend most of their time off-screen. The UI surface for background work is the difference between a useful agent and an anxiety machine.

- **Scheduled tasks** — cron-style or event-based triggers with human-readable preview ("Every Monday at 9am" / "When a new issue is filed").
- **Background task panel** — persistent surface showing active background work, with quick inspect.
- **Notifications** — when background tasks complete, fail, or need attention. Calibrated; not every event needs a ping.
- **Cost meters** — visible budget for background runs (see section 9).

**[Convention]** Cursor, Claude Code (since Dynamic Workflows in May 2026), and Devin all ship background-task panels. The shape is settling.

---

## 8. Agent-authored UI: the third layer

> **Position.** The most important architectural shift in agentic UI since 2024 is the move from *agents that inhabit interfaces* to *agents that author interfaces at runtime*. This is a separate layer of the stack, with its own patterns, and it is not yet well-handled by existing frameworks.

### 8.1 What "agent-authored UI" means

Traditional pattern: the designer ships a UI; the agent operates inside it.

New pattern: the agent picks (or generates) UI components dynamically — a chart when a chart is the right answer, a form when a form is, a custom widget for a niche decision — and streams that UI to the user as a tool output. The designer ships the *primitives* and the *constraints*; the agent assembles them.

### 8.2 Why it matters

- **The right UI per question.** "Show me last quarter's revenue" deserves a chart, not paragraphs. The agent should pick.
- **Bidirectional state.** Agent-authored UI is interactive — the user clicks a date range, the agent re-queries, the UI updates. State flows both ways.
- **Reduced cognitive overhead.** Generated UI is purpose-built for one decision, not a general-purpose form the user has to translate.

### 8.3 The four shipping implementations (mid-2026)

| Implementation | Vendor | Model | Status |
|---|---|---|---|
| **MCP Apps** | Anthropic + the MCP community | MCP server returns UI as a tool result; client renders it inside chat with bidirectional context | **[Convention-forming]** — announced January 2026; widely adopted by mid-2026 ([MCP Apps announcement](https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/)) |
| **AI SDK 6 generative UI** | Vercel | Tool parts in `useChat`; server streams React components from LLM tool calls; type-safe end to end | **[Convention-forming]** — replaced the legacy `streamUI`/RSC `render()` API ([AI SDK 6 generative UI](https://v6.ai-sdk.dev/docs/ai-sdk-ui/generative-user-interfaces)) |
| **Visual Layout / Dynamic View** | Google (Gemini) | Model-decided layouts inside Gemini responses | **[Emerging]** ([Gemini Visual Layout](https://support.google.com/gemini/answer/16741341)) |
| **AG-UI / A2UI** | Google + community | Open protocols for agent-rendered UI; AG-UI in Google ADK, A2UI as a roadmap standard | **[Speculative]** — protocols in early adoption ([AG-UI in ADK](https://google.github.io/adk-docs/tutorials/ag-ui/), [A2UI roadmap](https://a2ui.org/roadmap/)) |

### 8.4 Design patterns for agent-authored UI

**Constraint surfaces.** The designer's job is no longer to lay out every screen; it is to define what the agent is *allowed* to render, in what slots, with what budget. This is closer to a CSS-grid template + component allow-list than a Figma file.

**Slot architecture.** Pages reserve named slots ("primary visualization," "secondary detail," "action gate"). The agent fills each slot with one of a registered set of components. The user's spatial mental model survives because the slots are stable.

**Bidirectional state via the tool.** The component is the surface; the underlying tool is the API. User interaction on the component updates the tool's state; the model re-reads the tool state on its next turn.

**Streaming progressive rendering.** Components stream field-by-field as the model produces them. Loading states per-component, not per-page. ([AI SDK structured output progressive rendering](https://v6.ai-sdk.dev/docs/ai-sdk-ui/generative-user-interfaces))

**Fallback to text.** Every agent-authored UI must degrade to text gracefully when the client cannot render it (assistive tech, low-bandwidth, headless contexts).

### 8.5 Anti-patterns specific to agent-authored UI

- **Unbounded generation.** Letting the agent produce arbitrary HTML/JS at runtime. The component allow-list is the safety boundary.
- **Layout drift between turns.** The same question on Tuesday rendering completely differently from Monday — destroys the user's spatial memory.
- **Decorative components masquerading as informational.** A 3-D pie chart instead of a sparkline because the agent thought it looked cooler.
- **No textual alternative.** Cuts off accessibility and search.

### 8.6 What agentic-craft contributes

agentic-craft is not yet a renderer for agent-authored UI — but it is the *primitives library* such a renderer would draw from. Items like `action-preview`, `clarifying-questions`, `decision-surface`, `source-preview`, `agent-status-table`, and `usage-meter` are the kind of well-typed components an agent-authored UI runtime should reach for. The position to take: ship the primitives now; the renderer integration is a 2027 problem.

---

## 9. Dynamic Workflows as a product surface

> **Position.** Anthropic's Dynamic Workflows (May 2026) is the most concrete shipping example of *workflow-as-product* — a user surface for declarative multi-agent orchestration that is neither chat nor dashboard. It deserves first-class treatment in this document because the UI patterns it introduces are likely to become conventions across the industry.

### 9.1 What Dynamic Workflows is

A research preview in Claude Code that lets users (or agents) declare a workflow as a script, then run it across a fleet of subagents. The workflow is *plan-as-code* — explicit phases, agent definitions, and dependencies — and the UI is purpose-built for monitoring, pausing, resuming, and re-running it. ([Anthropic: Introducing Dynamic Workflows in Claude Code](https://claude.com/blog/introducing-dynamic-workflows-in-claude-code), [Claude Code Workflows docs](https://code.claude.com/docs/en/workflows))

### 9.2 The UX surface (full inventory)

This is the most detailed product UI we've seen for multi-agent operations, and we catalog the full surface because it sets a reference point.

**The `/workflows` command.** Opens the workflow inspector. Lists all runs with status, agent count, token usage, and elapsed time.

**The progress view.** A phase rail showing each phase's status. Per-phase rollup: number of agents, tokens consumed, elapsed time. Click into a phase to see per-agent state.

**Keyboard navigation.**

| Key | Action |
|-----|--------|
| `↑` `↓` | Navigate runs / phases / agents |
| `Enter` / `→` | Drill into the selected item |
| `Esc` | Back up one level |
| `p` | Pause / resume the run |
| `x` | Stop the run |
| `r` | Restart the run |
| `s` | Save current run as a reusable slash command |

**Effort levels.** A separate `/effort` menu lets the user dial reasoning intensity per task: `low`, `medium`, `high`, `xhigh`, `max`, and `ultracode`. The last is a session-only "xhigh + automatic orchestration" mode. ([Claude Code model-config](https://code.claude.com/docs/en/model-config))

**Approval card.** When a workflow is about to run an external script, an approval card appears: `Yes, run it / Yes, don't ask again for X / View raw script / No`. `Ctrl+G` opens the script in the editor. `Tab` lets the user adjust the prompt before approval.

**Background tasks.** A one-line summary of background work appears below the input box, expandable to the full background-task pane. The desktop client has a dedicated side pane for background tasks.

**Saved workflows.** Workflows can be saved to `.claude/workflows/` (project) or `~/.claude/workflows/` (home). Saved workflows become slash commands: `/my-workflow` invokes them.

**Resume semantics.** Within the same session, cached results from completed agents are preserved; resuming re-runs only the unfinished portion. Across sessions, resume is not supported.

**Scale.** Up to 1,000 total agents per workflow run, with at most 16 running concurrently.

**Availability.** Pro tier (opt-in via `/config`), Max & Team tier (default on), Enterprise (admin opt-in). Requires Claude Code v2.1.154+.

### 9.3 What's new about this UI

Two patterns are genuinely novel:

1. **Phase rail as the primary surface.** Not a kanban, not a list, not a graph — a horizontal rail of phases with rollup metrics per phase. agentic-craft mirrors this in **workflow-phases**.

2. **Plan-as-code with a UI layer.** The user can both write the workflow as a script and operate it through the keyboard-driven UI. The UI doesn't hide the script; it *exposes* it (`Ctrl+G` opens the raw script). This is a refusal of the false choice between "no-code workflow builders" and "raw CLI."

### 9.4 Where Dynamic Workflows leaves things underspecified

- **Cross-session resume.** Not supported. Most production use cases need it.
- **Workflow versioning.** Saved workflows live in files but there's no UI for version history.
- **Cost meters per phase.** Tokens are shown, but actual dollar cost is not.
- **Sharing.** Saved workflows are local; team-wide sharing is informal.

These are open questions for the field, not flaws of the preview.

### 9.5 What agentic-craft contributes

agentic-craft ships two components inspired directly by Dynamic Workflows:

- **workflow-phases** — the phase rail UI primitive, with the same status-vocabulary the rest of the system uses (check / spinner / dashed / clock / alert).
- **workflow-run-monitor** — the full multi-phase fleet monitor: phase rail, plan-as-code inset, per-phase fleet table with density collapse, run-budget meter, pause/resume/stop, failed-phase recovery.

These are the registry's only items that explicitly target multi-agent orchestration. They are intentionally aligned with the Dynamic Workflows shape because we expect that shape to become the convention.

---

## 10. Product inventories

> **Field map.** What the leaders ship in mid-2026. Inventories are descriptive, not prescriptive — they document conventions, not endorse them.

### 10.1 Anthropic Claude

**Models.** Opus 4.6 → 4.7 (April 16, 2026) → 4.8 (May 28, 2026). Sonnet 4.6 with 1M-token context and context compaction. Effort levels: low / medium / high / xhigh / max / ultracode. ([Anthropic news: Claude Opus 4.6](https://www.anthropic.com/news/claude-opus-4-6), [Sonnet 4.6 announcement](https://www.anthropic.com/news/claude-sonnet-4-6), [Opus 4.8 release](https://wavespeed.ai/blog/posts/opus-4-8/))

**Artifacts.** Dedicated side-panel workspace for generated content (HTML apps, React components, code, documents, Mermaid, SVGs). Persistent, shareable via link, remixable; can call Claude's API directly for intelligent micro-apps.

**Extended thinking.** Adaptive thinking automatically scales reasoning depth; summarized thinking shows users a condensed view while the model retains the full reasoning internally. ([Anthropic: Extended Thinking](https://platform.claude.com/docs/en/build-with-claude/extended-thinking))

**Incognito mode.** Ghost-icon toggle; conversations don't save to history or training data; clear visual indicator when active.

**MCP Apps (January 2026).** First official MCP extension enabling interactive UI (charts, forms, dashboards) inside Claude's chat. Agent stays in control; user gets purpose-built UI for specific decisions; context flows bidirectionally. ([MCP Apps announcement](https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/))

**Dynamic Workflows (May 2026).** See section 9.

**Tooling surface.** Tool switching in composer (Code Interpreter, Web Search, file analysis); model switcher with hierarchy; context chip management for attachments.

### 10.2 OpenAI ChatGPT

**Models.** GPT-5.5 is the flagship in mid-2026 (post-May 28). GPT-5.4 remains available. o3 sunset August 26, 2026; GPT-4.5 sunset June 27, 2026. ([OpenAI release notes](https://help.openai.com/en/articles/9624314-model-release-notes))

**Canvas — retired May 28–30, 2026.** Canvas was OpenAI's two-pane writing/coding workspace from October 2024 to May 2026. It was removed in the GPT-5.5 rollout and replaced by inline writing and code blocks inside the main conversation. ([OpenAI removes Canvas, May 2026](https://www.krasa.ai/news/openai-gpt-5-5-instant-writing-coding-blocks-canvas-removed-may-2026))

**Position on the Canvas retirement.** This is the single most surprising product decision in the space in 2026. Canvas was the canonical example of a dedicated artifact surface; removing it suggests OpenAI now believes inline artifact rendering wins over a separate pane. Anthropic's Artifacts continues to ship the opposite bet. Both can't be right; the industry will pick one over the next 18 months.

**Code Interpreter.** Python execution in sandboxed environment; file upload/download; data analysis; visualizations; ML capabilities. Shows code alongside result.

**Web browsing.** Inline citations with sources; "think longer" option.

**Tool switcher.** Composer-level capability picker.

**Response refinement menu.** Contextual menu on AI responses (Try again / Add details / More concise / Search the web / Think longer).

**Personalization.** Dedicated interface for conversation style, response format, and contextual preferences.

### 10.3 Perplexity

**Models.** GPT-5.4 and GPT-5.5, Claude Opus 4.7, Kimi K2 Thinking, plus Sonar models. The lineup has shifted significantly in 2026. ([Perplexity advanced models](https://www.perplexity.ai/help-center/en/articles/10354919-what-advanced-ai-models-are-included-in-my-subscription))

**Search modes.** Research mode (formerly Pro Search) — multi-step research with broader source set. Standard search for one-shot lookups.

**APIs.** Sonar API (standard), Search API, Agentic Research API. Search as Code (SaC) launched June 1, 2026 — programmatic search-and-answer pipelines.

**Citations.** Numbered superscripts inline; on hover, preview of cited content; on click, full source view. The canonical inline-citation implementation in the industry.

**Focus modes.** Web, Academic, Social, Video, Writing, Math.

**Pricing.** Standard Pro tier plus a new $200/month Max tier (introduced 2026) with extended agentic capabilities.

**Incognito mode.** Search without saving query history.

**Source browser / sidebar.** Search history, Collections, Discover feed.

**Shopping tab.** Product discovery feed with prices, ratings, one-click purchase.

### 10.4 Vercel AI SDK and v0

**AI SDK 6.** Current stable (replacing the 5.x line; the original 3.0 generative-UI doc is now historical). `useChat` with tool parts is the primary surface for generative UI. End-to-end type safety from server tool definitions to client UI. The legacy `streamUI` / RSC `render()` API is deprecated. ([AI SDK 6 generative UI](https://v6.ai-sdk.dev/docs/ai-sdk-ui/generative-user-interfaces))

**Streaming.** `streamText` and `useChat` for token-by-token streaming. Server Actions integration eliminates separate API routes.

**Structured outputs.** `generateObject` / `streamObject` with Zod schema validation. Progressive rendering as fields stream.

**Tool calling.** Tools defined with typed Zod schemas and execute functions. `maxSteps` controls multi-step loops.

**v0.** Text/image prompts to React + Tailwind + shadcn/ui. Iterative refinement; Next.js integration.

**Provider-agnostic model routing.** Unified interface across providers.

### 10.5 Cursor, Claude Code, Devin, Cline, and the IDE-shaped agents

A distinct product category emerged in 2025–2026: agents that live inside an IDE or terminal, with a UI surface that fuses chat, code, tools, and operational monitoring. Key patterns:

- **Composer with file context chips** — the Cursor pattern; now near-universal.
- **Inline diff approvals** — agent proposes a change as a diff; user accepts/rejects per hunk.
- **Background mode** — async tasks running off-screen with notification on completion.
- **Plan-as-code visibility** — the user can see and edit the plan the agent is executing.

agentic-craft is positioned to support this category specifically.

---

## 11. Anti-patterns

> **Field map.** What to refuse, and why. This section is opinionated by design — a pattern catalog without an anti-pattern catalog is half a document.

### 11.1 AI-demo chrome

The visual signature of 2024–2025 AI startups: glowing gradients, sparkle icons, chat-bubble theater, spinners on tool calls, oversized rounded everything, animated gradients on every loading state.

**Why it's wrong.** It signals "we're an AI demo" instead of "we're a product." Users come to associate the visual language with toys.

**What to do instead.** Quiet, precise, instrument-panel design. Monochrome icons. Hairlines instead of shadows. State communicated through one shape per status. ([agentic-craft DESIGN.md](https://github.com/bitcomplete/agentic-craft/blob/main/DESIGN.md))

### 11.2 Fake streaming

Streaming a response token-by-token when the underlying call was synchronous. Or animating a "thinking…" state when the model already returned.

**Why it's wrong.** It's theater. It conditions users to wait when they shouldn't have to.

### 11.3 Spinners on tool calls

A spinner gives no information. A tool call has *state* (running / done / failed / blocked) and *content* (which tool, what input, what output). Show that.

**[agentic-craft enforcement]** No success/failure icons on tool calls; one status glyph per state; no spinners. Audited.

### 11.4 Honest-affordance violations

Anything that looks interactive but isn't:

- Cursor-pointer on a non-clickable row
- Expand chevron on an empty disclosure
- Hover treatments on non-links
- "Edit" buttons that open a read-only view

**Why it's wrong.** Destroys the user's predictive model of the interface. Every false affordance trains the user to distrust real ones.

### 11.5 Raw probability numbers

Showing `0.73 confidence` to a non-expert user. They cannot use this number — it is impressive precision that conveys nothing.

**What to do instead.** Semantic categories ("likely"), or ranked ordering, or withhold below a threshold.

### 11.6 Auto-default to high autonomy

Shipping at L4 or L5 by default. "Background mode is on" before the user knows what background mode does.

**What to do instead.** Default to L2. Earn L3. Make L4 and L5 explicit user choices with full disclosure.

### 11.7 Invisible memory

The agent "just learns about you" with no surface to see, edit, or delete. Or a memory list buried four settings panels deep.

**What to do instead.** Memory is a ledger, visible in the primary surface, reviewable in a queue. (Section 6.)

### 11.8 Generic errors

"Something went wrong." "An error occurred." "Please try again later."

**What to do instead.** Every failure shows: what failed, why, what the user can do next, and whether the agent can recover automatically.

### 11.9 Fabricated demo data

Round numbers (100, 1000, 50%). Identical timestamps. Placeholder names like "ACME" or "John Doe." Implausible cost values like "$0.00."

**Why it's wrong in a teaching artifact.** It signals the demo doesn't reflect reality, which makes the pattern look like a toy.

**What to do instead.** Plausible telemetry: staggered durations, odd numbers (92,500 not 100,000), believable product names. ([agentic-craft DESIGN.md](https://github.com/bitcomplete/agentic-craft/blob/main/DESIGN.md))

### 11.10 Unbounded agent-authored UI

Letting an agent render arbitrary HTML/JS at runtime with no component allow-list.

**Why it's wrong.** A security boundary and a design-system boundary at once. Both matter.

### 11.11 Decorative pattern proliferation

A new component for every variation: 14 button styles, 9 card types, 6 ways to show a status. The system bloats; consistency dies.

**What to do instead.** One shape per state. One affordance per behavior. New components must justify themselves against existing ones.

---

## 12. Open questions

> **Field map.** Where the field has not converged. We document these honestly because a research doc that pretends to have all the answers is the worst kind of research doc.

### 12.1 Inline vs. side-panel artifacts

Claude doubled down on Artifacts (a side panel); OpenAI removed Canvas (the side panel) in favor of inline rendering. One bet is wrong, or context determines which wins. We don't know which.

### 12.2 How much chain-of-thought to show

Full reasoning traces vs. summarized thinking vs. nothing at all. Anthropic settled on summarized thinking; others vary widely. The trade-off between transparency and overconfident-prose is real, and the answer probably depends on user expertise.

### 12.3 Cross-session resume

Dynamic Workflows doesn't support it. Most production agentic systems need it. What's the right UX surface for "you started a long-running workflow yesterday; here's where it is today"?

### 12.4 Multi-agent debugging

When 16 subagents are running and one of them is wrong, what's the UI for figuring out which one and why? Existing trace tools (Datadog-style) are designed for service architectures, not agent fleets.

### 12.5 Cost transparency in shared workspaces

Personal use: clear. Team use: who paid for the agent's work? What's the UI for "the workspace just consumed $400 in agent runs this week"? Most products under-handle this.

### 12.6 Agent identity at scale

When agents start collaborating with other agents (A2A protocols, MCP), how does the user surface convey *which agent did what*? Naming, avatars, and provenance are not yet enough.

### 12.7 Trust transfer across products

If I trust Claude with my calendar, does that trust transfer to a third-party agent that calls Claude as a sub-tool? What's the UI for explaining the trust graph?

### 12.8 Workflow versioning

Saved workflows in files (Dynamic Workflows pattern) is a starting point. What's the UI for "this workflow's behavior changed last Tuesday — here's the diff"?

### 12.9 The right default autonomy level for "background" agents

Cursor, Devin, and others ship background modes. The default is L4. We argued in section 4 that this is too aggressive. But the products are popular. The argument is unsettled.

### 12.10 When to refuse

What's the UX for "the agent could do this, but the operation is suspicious enough that it shouldn't"? Existing patterns are crude (block dialogs); the future is more nuanced.

---

## 13. Registry mapping

> **The bridge.** Every agentic-craft registry item is justified by one or more sections of this document. This table is the contract between research and product.

### 13.1 Primitives (registry:ui)

| Item | Sections | What it implements |
|------|----------|---------------------|
| **composer** | §3.1, §7.3 | The chat input with islands, attachments, suggestions, and context-usage visualization — the entry point for visible work. |
| **tool-call** | §3.1 | The universal tool-call row with running/completed/failed states. Visible work, base unit. |
| **tool-tree** | §3.1, §7.2 | Parallel tool call visualization with L-connectors. Visible work for multi-step or parallel execution. |
| **observable-work** | §3.1, §11.4 | Step disclosure for showing agent work, sources, state, completion — without exposing hidden reasoning. The "summarized thinking" position made concrete. |
| **status-indicator** | §3.1, §7.2, §11.3 | The product-wide status vocabulary: one shape per state. Refuses the spinner. Most-reused primitive. |
| **reference-item** | §5.1, §6.1 | The composable row for sources, memories, findings — the provenance row. |
| **source-preview** | §5.1, §5.3 | Citation preview with title, excerpt, location. Provenance for claims. |
| **artifact-document** | §5.1, §10.4 | Source-backed output document with cited sections and missing-source states. Provenance for outputs. |
| **decision-surface** | §3.2, §4.1 | The composable approval/clarification/rollback surface. The locked-preview pattern made composable. |
| **action-preview** | §3.2 | The locked consequence preview itself. Center of section 3.2. |
| **clarifying-questions** | §3.2, §4.2 | Structured question group — text, single-choice, multi-choice. Replaces freeform "what did you mean?" |
| **file-lifecycle** | §3.1, §11.8 | Drag/upload/validate/retry states. Visible work for the file path. |
| **agent-status-table** | §7.1, §7.2 | Rich operational table — status, active task, progress, confidence, cost, last activity. The operational dashboard primitive. |
| **usage-meter** | §4.2, §7.3, §12.5 | Token/cost/limit/coverage meter. Cost as design dimension. |
| **contextual-workbench** | §10.5, §8.4 | The responsive surface that keeps chat visible while opening browser/source/diff/artifact beside it. The IDE-shaped-agent layout primitive. |
| **effective-policy-preview** | §4.2 | Compact summary of what the autonomy + approval + notification + memory settings actually produce. The single piece of agent UI most often missing in shipping products. |
| **memory-ledger-item** | §6.1, §6.4 | Provenance-rich memory row with scope, expiry, last-used. Memory as ledger, made concrete. |
| **run-trace** | §7.2, §12.4 | Dense per-run trace with source touches, status, warnings, timing, expandable recovery. Datadog-style for agent runs. |
| **handoff-packet** | §10.5, §12.6 | Ownership-transfer surface for multi-agent flows. Agent-to-agent handoff with explicit payload and recovery path. |
| **workflow-phases** | §9.3, §9.5 | The phase rail — sequential phases with rollup metrics. Direct from Dynamic Workflows. |

### 13.2 Blocks (registry:block)

| Block | Sections | Composes |
|-------|----------|----------|
| **review-workflow** | §3.1, §3.2, §5 | observable-work + clarifying-questions + action-preview + decision-surface + reference-item |
| **approval-workflow** | §3.2, §4.1 | observable-work + action-preview + decision-surface |
| **clarifying-workflow** | §3.2, §4.2 | observable-work + clarifying-questions |
| **source-backed-artifact** | §5.1, §5.3 | artifact-document + source-preview + usage-meter |
| **memory-review** | §6.3, §6.4 | memory-ledger-item + source-preview + decision-surface |
| **run-monitor** | §7.2, §7.3 | run-trace + agent-status-table + usage-meter |
| **multi-agent-handoff** | §10.5, §12.6 | handoff-packet + agent-status-table + run-trace |
| **agent-settings** | §4.2, §4.3 | effective-policy-preview |
| **workflow-run-monitor** | §9.3, §9.5 | workflow-phases + agent-status-table + usage-meter |

### 13.3 Coverage check

| Section | Registry coverage | Gap |
|---------|------------------|-----|
| §3 Visible work + locked previews | Strong — 6 primitives | None |
| §4 Autonomy as contract | Medium — effective-policy-preview, agent-settings | No per-action-type matrix UI yet |
| §5 Provenance | Strong — source-preview, artifact-document, source-backed-artifact | None |
| §6 Memory as ledger | Strong — memory-ledger-item, memory-review | No incognito-mode primitive |
| §7 Operational surfaces | Medium — agent-status-table, run-trace, run-monitor | No inbox primitive; no calendar primitive |
| §8 Agent-authored UI | Weak — primitives exist but no renderer integration | The renderer is a 2027 problem (deliberate) |
| §9 Dynamic Workflows | Strong — workflow-phases, workflow-run-monitor | No plan-as-code editor UI |
| §11 Anti-patterns | N/A — enforced by `scripts/audit-ui.mjs` and DESIGN.md | None |

### 13.4 Roadmap implications

The coverage check above is the closest thing this document has to a roadmap. The four explicit gaps:

1. **Per-action-type autonomy matrix UI** — a real surface for the multi-axis autonomy contract from §4.2.
2. **Inbox primitive** — the most common operational layout (§7.1) is not yet in the registry.
3. **Incognito-mode primitive** — memory's negative space (§6.4) deserves its own component.
4. **Plan-as-code editor surface** — Dynamic Workflows exposes the raw script; agentic-craft does not yet have an editor primitive for it (§9.3).

Whether to ship these is a product decision; the research justifies all four.

---

## 14. Ten principles, defended

> **Principles.** What every section of this document agrees on. These are the design rules `agentic-craft` evaluates itself against.

1. **Transparency over confidence.** Users who can see why an agent did something trust it more than users who get a confident result with no trace. Expose reasoning, citations, and tool use — collapsed by default, expandable on demand. (HAX G11; §3, §5.)

2. **Control is a trust signal.** Pause, override, kill switch, feedback — these aren't just safety features. They're how trust is built. An agent that can be stopped is more trustworthy than one that can't be. (HAX G9, G17; §4.)

3. **Progressive autonomy, earned incrementally.** Default to L2. Earn L3. Never start at L4. Autonomy is delegated trust; users haven't delegated anything yet. (§4.)

4. **Locked previews before any external action.** Not a confirm dialog. A structured preview of exactly what will happen, in the format of the target system. The preview *is* the contract. (§3.2.)

5. **Provenance is universal.** Every claim, every output, every action — traceable to its inputs. An agent that says less but cites everything beats one that says more without sources. (§5.)

6. **Memory is a ledger.** Visible, reviewable, editable, deletable per entry. Invisible persistence destroys trust faster than anything. (§6.)

7. **The blank-canvas problem is always present.** Suggestions, templates, examples, prompt starters — every empty state in an agentic interface needs wayfinder patterns. (Shape of AI; §2.1, §7.)

8. **Errors are diagnostic opportunities.** Never a generic error. Every failure shows: what failed, why, what to do next, whether recovery is automatic. (HAX G10; §11.8.)

9. **Cost should never be invisible.** Tokens, time, money — visible at the surface of every long-running action. Cost transparency is part of trust. (Shape of AI "Cost Estimates"; §4.2, §7.3, §12.5.)

10. **Design the relationship, not the screen.** The fundamental unit of agentic experience is the ongoing relationship between user and agent. Design for trust accumulation over time, not task completion in the moment. (NN/g service design; §1.)

---

## Appendix A: Variant taxonomies (cross-reference)

For completeness, the autonomy taxonomies we considered but did not adopt:

**The 6-mode spectrum** ([Emergent Mind: six-mode spectrum](https://www.emergentmind.com/topics/six-mode-spectrum-of-human-agent-collaboration)) — Human-Augmented, Human-in-Command, Human-Delegated, Human-in-the-Loop, Human-on-the-Loop, Human-Out-of-the-Loop. More granular than our 5-level model; useful for academic discussion; over-specified for product use where the L2/L3/L4 distinctions carry most of the signal.

**Apple's role-dimension framing** — Criticality, Data scope, Initiative, Visibility, Changeability. Not a competing autonomy model; an orthogonal categorization useful before choosing patterns.

---

## Appendix B: Sources

Primary sources:

- [Anthropic: Introducing Dynamic Workflows in Claude Code](https://claude.com/blog/introducing-dynamic-workflows-in-claude-code)
- [Claude Code: Workflows documentation](https://code.claude.com/docs/en/workflows)
- [Claude Code: model-config (effort levels)](https://code.claude.com/docs/en/model-config)
- [Anthropic: Extended thinking](https://platform.claude.com/docs/en/build-with-claude/extended-thinking)
- [Anthropic: Claude Opus 4.6 announcement](https://www.anthropic.com/news/claude-opus-4-6)
- [Anthropic: Claude Sonnet 4.6 announcement](https://www.anthropic.com/news/claude-sonnet-4-6)
- [MCP Apps announcement (January 2026)](https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/)
- [Vercel AI SDK 6: Generative User Interfaces](https://v6.ai-sdk.dev/docs/ai-sdk-ui/generative-user-interfaces)
- [Google Gemini: Visual Layout / Dynamic View](https://support.google.com/gemini/answer/16741341)
- [Google ADK: AG-UI tutorial](https://google.github.io/adk-docs/tutorials/ag-ui/)
- [A2UI roadmap](https://a2ui.org/roadmap/)
- [OpenAI: Model release notes](https://help.openai.com/en/articles/9624314-model-release-notes)
- [Perplexity: Advanced models help](https://www.perplexity.ai/help-center/en/articles/10354919-what-advanced-ai-models-are-included-in-my-subscription)
- [Microsoft Research: Guidelines for Human-AI Interaction (CHI 2019)](https://www.microsoft.com/en-us/research/wp-content/uploads/2019/01/Guidelines-for-Human-AI-Interaction-camera-ready.pdf)
- [Apple: HIG for Machine Learning](https://developer.apple.com/design/human-interface-guidelines/machine-learning)
- [Google PAIR Guidebook](https://pair.withgoogle.com/guidebook)

Secondary sources:

- [Shape of AI pattern library](https://www.shapeof.ai)
- [AgenticUI design system](https://agenticui.net)
- [NN/g: Generative UI](https://www.nngroup.com/articles/generative-ui/)
- [NN/g: Service design with AI agents](https://www.nngroup.com/articles/service-design-evolve-ai-agents/)
- [LukeW: Agent management interfaces](https://www.lukew.com/ff/entry.asp?2106)
- [Benjamin Prigent: 7 UX patterns for human oversight in ambient AI agents](https://www.bprigent.com/article/7-ux-patterns-for-human-oversight-in-ambient-ai-agents)
- [Emergent Mind: Six-mode spectrum of human-agent collaboration](https://www.emergentmind.com/topics/six-mode-spectrum-of-human-agent-collaboration)
- [Krasa AI: OpenAI removes Canvas (May 2026)](https://www.krasa.ai/news/openai-gpt-5-5-instant-writing-coding-blocks-canvas-removed-may-2026)
- [WaveSpeed: Opus 4.8 release](https://wavespeed.ai/blog/posts/opus-4-8/)
