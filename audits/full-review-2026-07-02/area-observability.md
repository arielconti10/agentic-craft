# INVENTORY

# Claim Inventory — Observability (agentic-craft)

**Files audited:** `/Users/arielconti/workspace/agentic-craft/src/views/observability-content.tsx`, `/Users/arielconti/workspace/agentic-craft/src/views/observability/{activity-timeline,token-usage,session-timeline,error-log}-section.tsx`, plus supporting components in `/Users/arielconti/workspace/agentic-craft/src/components/ui/` (`run-trace.tsx`, `agent-status-table.tsx`, `usage-meter.tsx`, `status-indicator.tsx`).

Note on format: this area is demo-heavy and prose-light. Claims live in section intros, "spec tables" rendered below each demo, and doc-comments/fixture strings inside components. There is **no external citation and no named product anywhere in the area** (verified by grep across all four section files + content file: zero hits for product names, research, or guidelines).

## Patterns asserted

1. **Activity Timeline** (`activity-timeline-section.tsx`)
   - Claim: a chronological stream of agent actions — tool invocations, messages, state transitions — gives "full auditability of review workflows."
   - Prescription: offer three views (Live / History / Filtered); live view carries a pulsing "Streaming" indicator; entries slide in from below at 250ms ease-out with 60ms stagger; action type ("Tool call" / "Message") is quiet text after the timestamp with the row icon carrying the type; filtered view shows tool calls only "for focused audit"; a threshold-warning banner sits above the timeline naming the gap and the resolution path.

2. **Run-state table** (embedded in the same section; backed by `agent-status-table.tsx`)
   - Claim: an active run should expose per-agent state — status, current task, progress %, cost, last-updated — in one glanceable table.
   - Prescription: six statuses (working/idle/blocked/handoff/complete/error) each mapped to a distinct shape (never color-alone, per `status-indicator.tsx`); rows expand to model/tokens/tool-count/elapsed/returned-value detail; per-agent dollar cost as a first-class column; table degrades to a card list below `md`.

3. **Run Trace** (embedded; backed by `run-trace.tsx`)
   - Claim (in fixture `detail` text): "The trace records touched source objects and completion state, not hidden reasoning."
   - Claim 2 (fixture): "Warnings should include the affected object, source, and recovery path before escalation."
   - Prescription: each event = title, status glyph, source object, timestamp, duration (revealed on hover/focus on desktop — encoded both in the component CSS and in the literal fixture string `duration: "visible on hover"`), optional expandable detail via `<details>`.

4. **Token Usage** (`token-usage-section.tsx`)
   - Claim: a visual meter of token consumption against a session/daily budget, with cost estimate, keeps spend legible.
   - Prescription: warning state appears **above 80%** usage "with advisory text and subtle border highlight"; dollar amount shown alongside token count as the "primary metric for non-technical users"; stats row for sessions / avg-per-session / remaining. (A separate reusable `usage-meter.tsx` component exists but this section does not use it — see evidence status.)

5. **Session Timeline** (`session-timeline-section.tsx`)
   - Claim: a vertical timeline of requests, tool calls, and agent responses reconstructs a session's sequence.
   - Prescription: user vs agent nodes on a connector line; tool-call labels rendered as small muted rows *above* the agent's response; single-turn and multi-turn variants. No spec table — the thinnest section.

6. **Error Log** (`error-log-section.tsx`)
   - Claim: a filterable log of errors, warnings, and "operational anomalies" with expandable detail supports diagnostics.
   - Prescription: severity badge (warning/error) with shape-coded icon; collapsed row = title + time, expanded = cause and outcome ("Retried successfully on second attempt"); empty state is a positive confirmation ("No anomalies since session start · 11:32 AM") rather than a blank panel.

**Code-backed vs prose-only:**
- Backed by real reusable components: run-state table (`agent-status-table.tsx`, the most engineered artifact in the area — responsive collapse, ResizeObserver-gated focusability, aria-expanded disclosure), run trace (`run-trace.tsx`), status vocabulary (`status-indicator.tsx`), usage meter (`usage-meter.tsx`, but only consumed by the *Sources* page, not this section).
- Demo-only (inline JSX in the section file, no reusable component): the activity feed list itself, the token-budget meter (uses raw `Progress`; diverges from the `UsageMeter` component), the session timeline, and the error log. Anyone installing the registry gets the table/trace/meter primitives but **not** the activity feed, session timeline, or error log as components.

## Evidence status per claim

Every claim in this area is **(c) ASSERTED**. Specifics:

| Claim | Status | Note |
|---|---|---|
| Activity stream gives "full auditability" | ASSERTED | No product or audit-standard referenced. |
| Live/History/Filtered as the three canonical views | ASSERTED | Invented taxonomy; no grounding. |
| 250ms ease-out entry, 60ms stagger | ASSERTED | Self-generated spec presented as normative. |
| Filter to tool-calls-only "for focused audit" | ASSERTED | |
| Per-agent cost column in run-state table | ASSERTED | |
| Trace records touched objects, "not hidden reasoning" | ASSERTED | A real design stance, stated only in fixture data. |
| Warnings must carry affected object + source + recovery path | ASSERTED | Plausible, echoes incident-management practice, but uncited. |
| Duration visible on hover only | ASSERTED | Contradicts common practice (see verification). |
| Token warning at >80% | ASSERTED | Arbitrary threshold, no source. |
| Dollar cost is "primary metric for non-technical users" | ASSERTED | The strongest-worded and least-supported claim in the area. |
| Session timeline node/connector layout | ASSERTED | Generic. |
| Positive-confirmation empty state for error logs | ASSERTED | Plausible; matches monitoring-tool convention but uncited. |

Zero PRODUCT-GROUNDED claims. Zero CITED claims. Internal inconsistency: `src/views/principles-data.ts:212` promises the error log shows "Failure rows with cause, owner, and recovery," but the error-log demo has no owner field and only one of three fixtures shows a recovery.

## Verification list

1. **Live activity feed with streaming indicator + type filtering.** Check: Devin (session timeline/procedure log), Manus (computer/activity panel), ChatGPT agent-mode activity log, Claude Code (transcript/activity), Cursor background-agent panel. Look at: whether any ships a Live/History/Filtered toggle (likely none do — most show one continuous collapsible stream), and whether "message vs tool call" is a filterable axis.
2. **"Trace shows touched objects, not hidden reasoning."** Check: ChatGPT and Claude both surface *reasoning summaries* in agent runs; Devin shows a plan/procedure narration. Look at: whether top products actually exclude reasoning from traces — mid-2026 practice arguably contradicts this claim, so it needs to be defended as a deliberate stance or corrected.
3. **Duration revealed only on hover.** Check: GitHub Actions, Vercel build logs, LangSmith/Braintrust traces — all show per-step durations persistently. Hover-only is a deviation; verify whether any real product hides durations behind hover before prescribing it.
4. **Token meter with dollar estimate during a session.** Check: Claude Code (`/cost`, context-percentage meter), Cursor (usage dashboard + in-IDE limits), Devin (ACUs), Manus (credits), OpenRouter. Look at: whether consumer/prosumer agents show *tokens* at all — most abstract to credits/ACUs or show *context-window %*, not spend-budget tokens. The section conflates spend budget and context budget.
5. **"Dollar cost is the primary metric for non-technical users."** Check the same products: several deliberately hide dollar figures behind abstract units (ACUs, credits). This claim is directly refutable.
6. **80% warning threshold with throttling advisory.** Check: Claude Code context-limit warnings (fires around similar percentages), Cursor usage-limit notices, provider rate-limit UX. Look at: actual thresholds and whether the warning proposes an action (the demo's "finish current task before starting new analyses" is a good verifiable convention).
7. **Per-agent cost/progress in a multi-agent status table.** Check: Claude Code subagent/Task display, Devin multi-session view, LangSmith/AgentOps dashboards. Look at: whether per-agent *dollar* attribution is surfaced anywhere user-facing.
8. **Error-log empty state with positive confirmation.** Check: Sentry ("No new issues"), Datadog monitors, Claude Code/Devin error surfacing. Low-risk, likely confirmable.

## Staleness risks

- **Token-denominated budgets** (March–June 2026 framing): the market has been moving toward abstracted credits/ACUs and context-window meters; a "92,500-token daily budget" UI may already read as API-console-era rather than product-era.
- **"Not hidden reasoning"**: written before/while visible reasoning summaries became table stakes in ChatGPT/Claude agent runs; without acknowledging reasoning summaries the stance risks reading as unaware rather than opinionated.
- **`model: "sonnet"` doc-comment** in `agent-status-table.tsx` — model-tier naming churns quickly.
- **"Subsequent requests may be throttled"** — provider rate-limit behavior is a moving target; fine as fiction, risky as prescription.
- Fixture dates ("Mar 15, 2026", "gap-remediation-2026-03.pdf") will read stale within months of publication; cosmetic but worth refreshing at publish time.
- No staleness risk from named products — because none are named, which is itself the bigger problem.

## Quality read

The engineering is stronger than the argument: `agent-status-table.tsx`, `run-trace.tsx`, and `status-indicator.tsx` are genuinely careful components (shape-coded status never relying on color, responsive table-to-card collapse, a11y-gated scroll regions), but the surrounding claims are 100% asserted — not one product observation or citation in the entire area, and the Session Timeline and Error Log sections are generic pattern-catalog filler. The single strongest idea is the Run Trace stance — *traces record touched source objects and completion state, not hidden reasoning, and every warning carries the affected object, its source, and a recovery path* — which is distinctive and defensible, but it is currently buried in fixture strings instead of stated as a principle, and it needs to be argued against the now-standard practice of showing reasoning summaries.

# PRODUCT CHECK

All verification items are researched. Here is the fact-check report.

# Fact-Check Report — Observability Area (agentic-craft)

Method note: evidence dates given per item. Products checked: Claude Code, OpenAI Codex app, Cursor 3, Vercel eve (core four), plus ChatGPT agent mode, Devin, Manus, Linear AIG, LangSmith, Sentry, GitHub Actions.

## CONFIRMED

**1. Chronological activity stream of agent actions as a core surface.**
Universally confirmed across the panel — this is the one claim with the broadest grounding, even though the guide cites nobody.
- **ChatGPT agent mode** / in-conversation run view: "on-screen narration provides visibility into exactly what ChatGPT is doing"; a running step log, toggleable to a visual browser view. Sources: [OpenAI launch post](https://openai.com/index/introducing-chatgpt-agent/) (July 2025, still current per 2026 reviews), [AI Operator hands-on](https://www.aioperator.com/blog/chatgpt-agent-mode-your-new-ai-assistant/) (2026).
- **Manus** / "Manus's Computer" side panel: real-time view of every click, tab, file write; plus full session replay. Sources: [MIT Tech Review](https://www.technologyreview.com/2025/03/11/1113133/manus-ai-review/), [Trickle review](https://trickle.so/blog/manus-ai-review) (2025–2026).
- **Devin** / worklog + replay timeline: "full replay timeline of every command, file diff, and browser tab"; Slack tool actions appear in the worklog with dedicated icons ([release note May 6, 2026](https://docs.devin.ai/release-notes/2026)).
- **Claude Code** / transcript viewer (Ctrl+O): "Shows detailed tool usage and execution" ([interactive-mode docs](https://code.claude.com/docs/en/interactive-mode), fetched July 2026).
- **eve** / Vercel dashboard Agent Runs: per-turn breakdown of tool calls in order with args and results ([eve observability docs](https://vercel.com/docs/eve/observability), last_updated 2026-06-19).

**2. Filtering activity by type "for focused audit" — grounded, but as search, not a toggle.**
- **Devin** / sessions page + session analysis: "Analyze past sessions with full search across shell, file, browser, git, and MCP activity"; filter sessions by tags/playbook/origin/time; "Sub-Devin" filter for child sessions ([release notes March 19 & May 17, 2026](https://docs.devin.ai/release-notes/2026)). This is the only panel product with a type-segmented activity axis, and it's post-hoc search, not a live-view toggle.

**3. Per-agent status table for parallel runs (status, current task, progress).**
- **Claude Code** / Agent View (`\` or `claude agents`): "one screen showing every session, its state, and which ones need your input… each background agent's status, token usage, and progress" ([Claude Code agents docs](https://code.claude.com/docs/en/agents); [MindStudio walkthrough](https://www.mindstudio.ai/blog/claude-code-agent-view-multiple-agents), 2026). `/agents` has a Running tab of live subagents.
- **Cursor 3** / Agents Window sidebar (launched April 2, 2026): "every agent currently running: the task that started it, the repo it targets, and whether it runs locally or in the cloud," with real-time progress like "searching codebase," inspectable plans, and context pills for touched files ([Cursor 3 changelog](https://cursor.com/changelog/3-0); [digitalapplied guide](https://www.digitalapplied.com/blog/cursor-3-agents-window-design-mode-complete-guide)).
- Caveat: **status vocabulary** exists but nobody ships the guide's exact six (working/idle/blocked/handoff/complete/error). The closest public canon is **Linear AIG's six session states: pending, active, error, awaitingInput, complete, stale** ([linear.app/developers/agents](https://linear.app/developers/agents), [AIG](https://linear.app/developers/aig), July 2025–current). The guide should map to or argue against this.

**4. "Trace records touched source objects" (half of the Run Trace stance).**
- **Cursor 3** / Agents Window: "context pills indicating which files and code sections each agent is working with" (April 2026 sources above).
- **Devin** / replay timeline: records every file diff, command, browser tab; worklog group headers show clickable +N/−M diff stats ([release note May 13, 2026](https://docs.devin.ai/release-notes/2026)).
- **eve** / Agent Runs: tool calls with arguments and results per turn.
The "touched objects" half is genuinely product-grounded. The other half is contradicted — see below.

**5. Positive-confirmation empty state for error/issue logs.**
- **Sentry** / Issues stream, verified in source (`static/app/views/issueList/noGroupsHandler/index.tsx`, getsentry/sentry main, fetched July 2026): with the default unresolved query the empty state renders a zero-inbox illustration + "We couldn't find any issues that matched your filters." / "Get out there and write some broken code!"; the For Review tab shows "Well, would you look at that. No more issues to review…". Convention confirmed. The guide's timestamp detail ("since session start · 11:32 AM") is its own invention — harmless, but not Sentry's pattern.

**6. Context-budget warning near ~80% (context half only).**
- **Claude Code** / auto-compact + statusline: auto-compact fires around 77–78% of the context window (≈22.5% reserved buffer); "Context left until auto-compact" names the consequence; statusline context meter shifts green→yellow→red. Sources: [GitHub issue #18264](https://github.com/anthropics/claude-code/issues/18264) ("compaction triggers at ~78%"), [#6123](https://github.com/anthropics/claude-code/issues/6123), [zenn hook writeup](https://zenn.dev/trust_delta/articles/claude-code-context-warning-001?locale=en), [statusline docs](https://code.claude.com/docs/en/statusline) (2025–2026). So ">80% warning with advisory" is directionally right **for context budget**. The guide's "advisory naming the resolution path" also matches Claude Code's pattern (the warning names auto-compact as the consequence). But see the conflation entry under CONTRADICTED.

## CONTRADICTED / STALE

**1. "Duration revealed on hover/focus only." — CONTRADICTED, the clearest miss in the area.**
Every panel product that shows durations shows them persistently:
- **eve** / Agent Runs table: duration is a standing column ("triggering message, trigger type, tokens in and out, turn count, duration, and time"); run detail shows "Timings for each step in the turn, including skill loads and individual tool calls" ([eve observability docs](https://vercel.com/docs/eve/observability), 2026-06-19). This is the author's own core-four framework contradicting the spec.
- **LangSmith** / trace tree: latency, time-to-first-token, tokens, cost per step, persistently ([langchain.com/langsmith/observability](https://www.langchain.com/langsmith/observability), 2026).
- **GitHub Actions** / workflow run page: per-job/per-step execution times in the UI ([GitHub docs](https://docs.github.com/en/actions/how-tos/monitor-workflows/view-job-execution-time)).
No product found that hides duration behind hover. If kept, it must be reframed as a deliberate de-emphasis choice, not described as convention (`duration: "visible on hover"` fixture reads as normative).

**2. "Trace shows… not hidden reasoning." — CONTRADICTED as written; mid-2026 practice shows reasoning summaries in traces.**
- **eve** / Agent Runs run detail explicitly lists "**Reasoning** the model produced along the way" as a first-class section ([docs](https://vercel.com/docs/eve/observability), 2026-06-19).
- **ChatGPT agent mode** / activity view "displays the logic step-by-step, similar to how reasoning models explain their thinking" ([AI Operator](https://www.aioperator.com/blog/chatgpt-agent-mode-your-new-ai-assistant/), 2026); OpenAI shows model-generated reasoning summaries rather than raw CoT ([OpenAI reasoning docs](https://developers.openai.com/api/docs/guides/reasoning)).
- **Linear AIG** / agent activity model: agents "can expose detailed activity like their reasoning steps, tool usage, prompts for clarification" ([linear.app/developers/agent-interaction](https://linear.app/developers/agent-interaction), 2025–current).
The stance is defensible only if rewritten as an argued position against reasoning summaries (e.g., "summaries narrate intent, traces should record verifiable effects") — currently it reads as unaware. The claim inventory's own suspicion is correct.

**3. "Dollar cost is the primary metric for non-technical users." — CONTRADICTED; the market abstracts away from dollars, especially for non-technical users.**
- **Devin** / billing: denominated in **ACUs** ($2.00–2.25/ACU); per-session usage shown in Session Insights, in ACUs ([docs.devin.ai/admin/billing](https://docs.devin.ai/admin/billing), [usage page](https://docs.devin.ai/admin/billing/usage), 2026).
- **Manus** / **credits**; famously doesn't even show predicted credit cost before a task ([Manus help center](https://help.manus.im/en/articles/13185575-is-there-a-way-to-check-how-many-credits-a-task-will-cost-before-i-begin), 2026).
- **ChatGPT agent mode** / quota is messages-per-month; no dollar display at all ([OpenAI help/launch materials](https://openai.com/index/introducing-chatgpt-agent/)).
- **OpenAI Codex app** / Profile + `/usage`: **token activity** daily/weekly/cumulative, not dollars ([Codex changelog](https://developers.openai.com/codex/changelog), June 2026).
- The one true dollar-first product is **Cursor** (included-usage dollars per tier: Pro $20, Pro+ $70, Ultra $400 — [cursor.com usage-limits](https://cursor.com/help/models-and-usage/usage-limits), [Vantage breakdown](https://www.vantage.sh/blog/cursor-pricing-explained), 2026) and **Claude Code for API-key users** (`total_cost_usd` in statusline JSON, `/cost`) — both developer audiences. The claim is exactly backwards: dollars are the *engineer's* metric; non-technical products use credits/ACUs/message quotas.

**4. Per-agent dollar cost column in a multi-agent run table. — No panel product does this; prescription presented as pattern.**
- **Claude Code** / Agent View: per-agent status, **token usage**, progress — no dollars ([MindStudio](https://www.mindstudio.ai/blog/claude-code-agent-view-multiple-agents), 2026).
- **Cursor 3** / Agents Window: went the other way — users complain the **total usage indicator was removed** in 3.0 ([Cursor forum, "Where did the total usage indicator go?"](https://forum.cursor.com/t/agents-window-where-did-the-total-usage-indicator-go/160320), 2026).
- **Devin** / per-session ACUs exist (Session Insights) but per-sub-agent dollar attribution is not surfaced.
Nearest real-world: LangSmith cost-per-trace (a developer observability tool, not an agent product). Reframe as "tokens per agent is the shipped practice; dollar attribution is an opportunity, not a convention."

**5. Live / History / Filtered as three canonical views. — Invented taxonomy; no product ships it.**
Shipped reality is two-axis, not three-view:
- **ChatGPT agent**: toggle between visual (desktop) view and activity (step log) view — a *representation* toggle, not live/history.
- **Claude Code**: collapsed stream ↔ Ctrl+O transcript ↔ Ctrl+E show-all — *disclosure levels*, not views ([interactive-mode docs](https://code.claude.com/docs/en/interactive-mode)).
- **Devin/Manus**: live view + post-hoc replay/search — live vs history is real, but "Filtered" as a peer view is not observed anywhere.
Also "pulsing Streaming indicator" and the 250ms/60ms entry animation are self-generated house style; no product evidence exists or could exist. Label them as house spec, not pattern.

**6. Token-budget meter with dollar estimate against a session/daily token budget. — STALE framing; conflates two budgets that products keep separate.**
- Context budget → shown as **% of context window** (Claude Code statusline/auto-compact).
- Spend budget → shown as **plan-quota % + reset time** (Claude Code 5-hour session window "1% used, resets in 4:54" — [voitanos statusline guide](https://www.voitanos.io/blog/claude-code-cli-statusline/); Cursor included-usage dollars with notification **at the cap**, not at 80% — [cursor.com usage-limits](https://cursor.com/help/models-and-usage/usage-limits), fetched July 2026: "You'll see a notification in the editor" at the limit, with pay-as-you-go or upgrade options; no documented graduated threshold).
A "92,500-token daily budget" meter matches neither; it reads API-console-era, as the staleness note suspected. The 80% figure survives only as a context-budget convention (see CONFIRMED #6).

## NEEDS HANDS-ON

1. **ChatGPT agent activity view details** (help.openai.com blocked fetch, 403): open ChatGPT → agent mode → start a browsing task → three-dot menu → switch between visual and activity views. Record: is there any filter control; is there a streaming/live indicator; are reasoning lines visually distinguished from actions; can you scroll history mid-run.
2. **Claude Code Agent View columns**: run a task that spawns 2–3 subagents, press `\`. Record the exact per-agent fields (status, current action, token count, elapsed?) and whether any dollar figure appears anywhere. Also note the subagent completion summary line format (tool-use count · tokens · elapsed) — if it shows duration persistently, it's another counterexample to hover-only.
3. **Cursor 3 Agents Window**: start one local + one worktree agent. Record per-agent sidebar contents (status text, context pills, plan disclosure), whether any usage/cost/context-% indicator exists post-3.0, and what the run history view looks like after completion.
4. **Manus credit visibility during a run**: run a small task; check whether credit consumption is visible live, per-task after completion, or only in account settings. (Docs confirm no *pre-task* estimate; live display is unverified.)
5. **Devin Session Insights**: open any completed session → Session Insights. Confirm per-session ACU figure placement and whether worklog entries are filterable by type (shell/file/browser/git/MCP) in the UI or only via search.
6. **Error retry surfacing**: in Claude Code and Devin, force a failing tool call that succeeds on retry; record whether the UI shows cause + outcome ("retried successfully") the way the guide's error-log fixture claims. No public doc describes this level of detail anywhere.
7. **eve Agent Runs warning states**: deploy an eve agent, open Agent Runs, check whether failed runs/turns get any severity badge or warning treatment (docs describe the happy path only).

## MISSED BY THE GUIDE

1. **Linear's Agent Interaction Guidelines — the only published, citable spec in this space.** Six session states (pending/active/error/awaitingInput/complete/stale), automatic lifecycle inference from emitted activities, "immediate but unobtrusive feedback" on invocation, mandatory agent-identity signaling. The guide's six-status vocabulary should be mapped against it or it will look like it doesn't know AIG exists. [linear.app/developers/aig](https://linear.app/developers/aig), [changelog July 30, 2025](https://linear.app/changelog/2025-07-30-agent-interaction-guidelines-and-sdk).
2. **Zero-config, always-on observability as a product property.** eve's Agent Runs "appears automatically… no instrumentation file required" ([docs](https://vercel.com/docs/eve/observability), 2026-06-19; [changelog](https://vercel.com/changelog/eve-agent-observability)). The guide treats observability as UI components; the market is treating it as a default-on platform surface. Also eve's developer mode (raw tool names, I/O JSON, per-step tokens) vs user mode is a two-audience disclosure pattern the guide never mentions.
3. **Session replay as the product-era session timeline.** Devin's full replay timeline and Manus's shareable session replays make the guide's static vertical timeline look like a wireframe of the weakest version. Replay + scrubbing + share link is the shipped pattern.
4. **Quota-window UX (percent + reset countdown).** Claude Code's 5-hour session window and weekly limits, Codex's `/usage` daily/weekly/cumulative views, ChatGPT agent's messages/month — time-windowed quota with reset time is the dominant consumer spend surface, entirely absent from the guide.
5. **Observability coupled to control.** ChatGPT agent's pause/stop/take-over-browser interleaved with the narration; Claude Code's Ctrl+B backgrounding and per-agent "needs your input" flags. The guide's surfaces are read-only; every shipped activity feed is also an intervention surface.
6. **Outcome-denominated progress.** Devin's clickable +N/−M diff stats in worklog headers (May 13, 2026) — progress measured in artifacts changed, not progress %. Directly relevant to (and arguably better than) the guide's progress-% column.
7. **Cached-token breakdown.** eve splits token usage into input/output/**cached**; caching economics are now first-class in usage displays. The guide's token meter has no cache dimension.
8. **Attention/notification management for long runs.** Codex "reduced unread notifications while an active goal continues running" (changelog, June 2026) — notification suppression during active runs is an emerging observability-adjacent pattern.

**Cross-cutting correction for the synthesis step:** the area's single distinctive stance (Run Trace: touched objects + recovery-path warnings) is *half right* — the touched-objects half is confirmable via Cursor context pills, Devin replay, and eve tool-call records, and should be promoted from fixture text to a stated principle; the "not reasoning" half must be rewritten as an argued position against the now-standard reasoning-summary sections (eve literally has a "Reasoning" section in every run detail). The internal inconsistency flagged at `src/views/principles-data.ts:212` (owner field promised, never rendered) remains unaddressed by any external evidence and is a straight bug to fix.