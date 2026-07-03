# INVENTORY

## Claim Inventory — Workflow Templates + Operational Surfaces (agentic-craft)

Files audited: `/Users/arielconti/workspace/agentic-craft/src/views/templates-content.tsx`, `/Users/arielconti/workspace/agentic-craft/src/content/templates.ts`, `/Users/arielconti/workspace/agentic-craft/src/views/operational-surfaces-content.tsx`, `/Users/arielconti/workspace/agentic-craft/src/views/operational-surfaces-data.ts`, `/Users/arielconti/workspace/agentic-craft/src/views/template-detail-content.tsx`, `/Users/arielconti/workspace/agentic-craft/src/views/registry-content.tsx`, plus `/Users/arielconti/workspace/agentic-craft/src/components/ui/` and `registry.json`.

## Patterns asserted

### A. Workflow backbone
1. **Collect → Inspect → Clarify → Approve → Deliver map** (`templates-content.tsx`, `templateFlowSteps`) — Core claim: every agentic workflow decomposes into these five phases with alternating agent/human ownership. Prescription: design templates around the whole job, not a single widget; make Clarify and Approve explicit human-owned steps.

### B. Eight workflow templates (`templates.ts` + `templates-content.tsx`)
Each ships with whenToUse / humanControl / failureMode / recovery / 3-row state matrix (userSees vs systemDoes).

2. **Review Workflow** — Claim: agent review output is only trustworthy when evidence-gathering is observable and every claim maps to a pinned source. Prescription: show touched sources and gaps live ("do not expose speculative hidden reasoning"), keep the draft blocked until conflicts are resolved.
3. **Approval Workflow** — Claim: irreversible/external/costly actions need a consequence preview (impact, affected objects, cost, rollback) that is *locked* at approval time. Prescription: execute only the exact approved payload; if scope changes after preview, invalidate the approval and require re-confirmation ("Revoked" state).
4. **Clarifying Workflow** — Claim: agents should ask only questions they would otherwise answer by guessing, via structured fields, not chat. Prescription: batch by decision type, show defaults, allow skip only when the fallback is safe, keep dependent work blocked meanwhile.
5. **Source-Backed Artifact** — Claim: durable outputs need per-section citation status (cited / needs-source / draft) and a sharing block on unverified sections. Prescription: keep artifact in review, mark uncited sections, keep cost/usage attached to the artifact.
6. **Memory Review** — Claim: proposed memories must wait in a review queue (with source, scope, expiry) before becoming durable context. Prescription: proposed-not-saved until provenance/scope/consent are explicit; user can edit, scope, expire, save, reject.
7. **Background Run Monitor** — Claim: work continuing after the user leaves needs a status table with progress, cost, blockers, and cancellation. Prescription: expose blocked state and partial output; stop spending on blocked downstream tasks; never stall silently.
8. **Multi-Agent Handoff** — Claim: agent-to-agent transfer needs an inspectable "handoff packet" showing sender, receiver, carried context, *omitted* context, and next action. Prescription: require the receiving agent to accept before downstream work starts; support rejection with reason.
9. **Agent Settings** — Claim: autonomy/approval boundaries should be durable settings, not per-action prompts. Prescription: safe defaults with rationale, confirmation + undo + audit trail for risky toggles, "Effective Policy Preview".

### C. Five operational layouts (`operational-surfaces-data.ts`, exactly five surfaces)
10. **Operating rule** — Claim: delegated agent work should be treated as "a queue of accountable objects," not chat transcripts. Prescription: rows show state, evidence, owner, next control before prose; color is supplementary; every autonomous action gets a returnable "receipt."
11. **Inbox** — Claim: an inbox turns agent uncertainty into a triageable queue instead of thread interruptions. Prescription: locked previews, status indicators, provenance snippets, ownership per row; "re-lock" when sources change post-approval.
12. **Kanban** — Claim: longer-running agent work is better sorted by state than by chat order. Prescription: task cards with phase, source count, owner, next control; "Do not color-code agents."
13. **Manager Surface** — Claim: delegation becomes accountable through a fleet control plane. Prescription: multi-agent identity, handoff packets, kill switches, compact traces; show who is blocked and what can be paused.
14. **Run Monitor Rollup** — Claim: long jobs need elapsed time, spend, phase, and failure state visible without opening every trace. Prescription: workflow phases + usage meters + expandable rows; keep blocked state in the rollup instead of presenting the run as ready.
15. **Background Tasks** — Claim: scheduled/deferred work "needs a receipt, a schedule, and a stop control." Prescription: effective policy previews, source scopes, run history, explicit cancellation/error-repair states.

### D. Template detail scaffolding (`template-detail-content.tsx`)
16. **State matrix as implementation contract** — Claim: a template is only useful when it documents normal, blocked, and recovery states. Prescription: ship the userSees/systemDoes matrix as the minimum contract; three universal build rules (Decision Surface before risky actions; provenance visible at the decision point; blocked states expose the needed input, not indefinite spinners).

### E. Registry (secondary — infrastructure)
17. **Patterns as shadcn registry items** — Claim: these patterns should install via shadcn CLI as primitives + workflow blocks. Prescription: four quality gates before publishing (state coverage, 390px mobile behavior, source/owner/cost visibility, install proof).

### Code backing (real components vs prose-only)
**Backed by real working code** in `src/components/ui/` and published in `registry.json` (31 items): Observable Work (178 loc), Decision Surface (174, wraps shadcn Dialog), Clarifying Questions (512), Artifact Document (170), Agent Status Table (495), Run Trace (169), Usage Meter (68), Handoff Packet (178, with real accept/reject + draft/sent/accepted/rejected/expired states), Memory Ledger Item (112), Effective Policy Preview (105), Workflow Phases (262), Reference Item (150), Status Indicator (103), Source Preview (436), Action Preview (110). All 8 templates also exist as `registry:block` items. These are genuine compound components, not stubs.
**Prose/mock-only**: the five operational layouts themselves. Inbox, Kanban, Manager Surface, and Background Tasks have **no dedicated components** — the operational-surfaces page renders static hardcoded rows through generic `StatusIndicator`/`RunTrace`/`UsageMeter`. Only Run Monitor Rollup is approximately backed (Agent Status Table, Workflow Phases, Run Trace). The five-layouts model is the least code-verified part of this area. Also prose-only: the Revoked/re-lock approval invalidation (Decision Surface has no lock/expiry mechanics), and Memory Review's scope/expiry metadata (Memory Ledger Item renders it but nothing enforces it).

## Evidence status per claim

**Zero PRODUCT-GROUNDED claims. Zero CITED claims.** A grep of all six files finds no product names (no Cursor, Devin, Claude, Copilot, ChatGPT, Linear, Notion, etc.) and no references to external guidelines, research, or design systems. `PatternGuidelines` is a UI component name, not a citation mechanism.

| # | Claim | Status |
|---|---|---|
| 1 | Five-phase Collect→Deliver backbone | ASSERTED |
| 2 | Review: observable evidence + pinned sources | ASSERTED |
| 3 | Approval: locked preview, invalidate on scope change | ASSERTED |
| 4 | Clarifying: structured, minimal, defaults-visible | ASSERTED |
| 5 | Artifact: per-section citation status, share-block on uncited | ASSERTED |
| 6 | Memory: review queue with scope + expiry before save | ASSERTED |
| 7 | Run monitor: progress/cost/blocked table | ASSERTED |
| 8 | Handoff packet with explicit acceptance | ASSERTED (most speculative in the set) |
| 9 | Durable agent settings over per-action prompts | ASSERTED |
| 10 | "Queue of accountable objects" rule + receipts | ASSERTED |
| 11–15 | Five operational layouts (inbox/kanban/manager/monitor/background) | ASSERTED |
| 16 | State matrix as minimum contract | ASSERTED |
| 17 | shadcn registry distribution + quality gates | ASSERTED (but partially self-verifying: registry.json exists and builds the listed items) |

The only evidence in this area is *internal*: the patterns are implemented as working components, which proves buildability, not that any shipping product works this way.

## Verification list

1. **Agent inbox as triage queue (claims 10, 11)** — Check Devin (session inbox / "waiting on you" states), OpenAI Codex (task list with review-ready diffs), GitHub Copilot coding agent (agents panel / PR queue), Cursor background agents list. Look at: whether review requests queue outside the thread, what row metadata is shown (owner, state, evidence), and whether anything resembles "re-lock after sources changed" (closest real analog: GitHub's stale-review dismissal on new commits).
2. **Approval with impact + cost + rollback preview (claim 3)** — Check Claude Code permission prompts, Cursor agent command approval, ChatGPT Agent/Operator confirmations before consequential actions, Devin action approvals. Look at: whether any shipping approval surface shows *cost estimate* and *rollback path* (the guide prescribes more than any product I know ships — worth confirming this is aspirational, and saying so in the guide).
3. **Structured clarifying questions with defaults and skip (claim 4)** — Check ChatGPT Deep Research and Gemini Deep Research clarifying steps, Claude Code plan-mode questions, Devin spec confirmation. Look at: chips/forms vs free-text, whether defaults are displayed, whether skipping states the assumption used.
4. **Per-section citation status and needs-source blocking (claim 5)** — Check NotebookLM, Perplexity Pages/Reports, ChatGPT deep-research reports, Claude Artifacts. Look at: does any product mark individual sections as uncited and *block sharing* on them? Likely none — this is the guide's invention and should be labeled a proposal.
5. **Memory review queue before saving (claim 6)** — Check ChatGPT memory (saves immediately, notifies after — the opposite flow), Claude memory management, Cursor Memories (which did ship an approval step for background-generated memories). Look at: proposed-vs-saved queue, scope controls, and especially *expiry* — expiry metadata appears in no major product and is likely invented.
6. **Run monitor with per-run cost and blocked state (claims 7, 14)** — Check Devin sessions dashboard (ACU spend per session), Cursor background agents, Claude Code cloud/task views, Manus task list (credits). Look at: is spend shown per run/agent, is "blocked, needs input" a first-class state distinct from "running."
7. **Handoff packet with accept/reject (claim 8)** — Check Devin multi-agent, Claude Code subagents, LangGraph/CrewAI observability UIs, Linear agent delegation. Look at: does any UI surface sender/receiver/carried-context/omissions with explicit acceptance? Almost certainly not shipping anywhere — the strongest candidate for "provocative proposal" framing rather than pattern.
8. **Kanban of agent work (claim 12)** — Check Linear (issues assigned to agents on boards — the strongest real confirmation available), GitHub Projects + Copilot agents, Devin parallel sessions. Also test the sub-claim "do not color-code agents" against Cursor/Zed multi-agent tabs and Linear agent avatars — some products *do* color/avatar-code agents, so this prescription is refutable and needs an argument.
9. **Durable autonomy settings (claim 9)** — Check Claude Code permission settings/allowlists, Cursor agent autonomy settings, ChatGPT Agent confirmation preferences, Copilot policy controls. Look at: settings-over-prompts direction is well supported; the "Effective Policy Preview" and audit-trail-on-toggle prescriptions are not — verify whether anything ships them.
10. **Background tasks with schedule + receipt + stop (claim 15)** — Check ChatGPT scheduled tasks, Claude Code scheduled/cloud routines, Gemini scheduled actions. Look at: run history ("receipt"), source-scope disclosure before scheduling, and error/repair states like the guide's "stopped after source permission changed."

## Staleness risks

- **No product anchoring means no dated claims — but also no protection.** The bigger risk is the *frame*: the model assumes chat-first products with operational surfaces bolted alongside. By mid-2026, Devin, Codex, and Copilot coding agent are already inbox/queue-first; the guide's "after it leaves the chat turn" framing may read as trailing rather than leading.
- **Terminology drift**: repeated references to "the composer" as the chat entry point echo Cursor's old Composer naming, which Cursor retired when it folded Composer into Agent. Any Cursor-adjacent reader will notice.
- **Per-run dollar costs** (`$0.18`, `$0.42 / $2.50 budget` in mock data) assume metered per-run pricing; major products shifted toward plan quotas, credits (Manus), and ACUs (Devin). The pattern is fine; the mock framing may look dated.
- **Memory UX**: memory features across ChatGPT/Claude/Cursor were revamped repeatedly through 2025–26; the review-queue prescription contradicts the dominant shipped flow (save-then-notify) and needs to be defended as deliberate divergence, not described as practice.
- **Registry install commands** point at `raw.githubusercontent.com/bitcomplete/agentic-craft/main/...` — these 404 until the repo is public, and pin `main`, so they are fragile at publish time.
- Anything asserted about background-agent surfaces (Cursor background agents, Codex tasks) is at high risk of specific-UI churn between the March–June 2026 writing window and publication.

## Quality read

This is not generic pattern-catalog filler: the userSees/systemDoes state matrices, the failure-mode/recovery pairing on every template, and the fact that nearly every primitive exists as working registry code give it real spine, and the "five operational layouts" taxonomy is a genuinely useful map even though it is the least code-backed part. Its critical weakness is uniform: zero product grounding and zero citations, so every claim currently reads at the same (asserted) confidence level, including a few that contradict shipped practice (memory review queue, no-color-coding) and a few that nothing ships (handoff acceptance, needs-source blocking). The single strongest idea is the approval-invalidation loop — an approval binds to a *locked preview payload* and is automatically revoked when scope or sources change ("Re-lock") — which is distinctive, defensible by analogy to stale PR reviews, and worth building the section's credibility around.

# PRODUCT CHECK

# Fact-Check Report — Templates + Operational Surfaces (agentic-craft)

All web evidence gathered 2026-07-02. Primary sources preferred; secondary sources flagged. Claim numbers refer to the inventory.

## CONFIRMED

**Claim 11 (inbox as triage queue outside the thread) — strongly confirmed as shipping practice.**
- **OpenAI Codex app** / shared review queue: the desktop app runs multiple agents in parallel (each in a sandboxed thread + git worktree) feeding "a shared review queue for approvals"; diff pane supports inline comments, stage/revert per chunk. Sources: https://openai.com/index/introducing-the-codex-app/, https://developers.openai.com/codex/app/features (app reviews dated 2026: https://www.verdent.ai/guides/codex-app-first-impressions-2026). Automations results also "land in a review queue for asynchronous inspection."
- **GitHub Copilot coding agent** / Agents panel + Agents page: launch and track sessions "from any page on github.com"; repo-level Agents tab dashboard (hands-on coverage Jan 29, 2026: https://visualstudiomagazine.com/articles/2026/01/29/hands-on-new-github-agents-tab-for-repo-level-copilot-coding-agent-workflows.aspx); sessions list with session log, token usage, session length (https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/track-copilot-sessions, https://github.blog/news-insights/product-news/agents-panel-launch-copilot-coding-agent-tasks-anywhere-on-github/). Agent "tags you for review when finished" — review requests queue as draft PRs, outside chat.
- **Devin** / sessions API + dashboard: running sessions expose detail statuses `working`, `waiting_for_user`, `waiting_for_approval` (safe mode), `finished` — i.e., "waiting on you" is a first-class machine-readable state (https://docs.devin.ai/api-reference/v3/sessions/post-organizations-sessions).

**Claim 3's "re-lock" mechanism — confirmed as a real analog, in GitHub code review (not agent products).**
- **GitHub** / branch protection "Dismiss stale pull request approvals": GitHub "records the state of the diff at the point when a pull request is approved"; if the diff changes (new commits, Update branch, or merge-base change since June 2023), "the approving review is dismissed as stale, and the pull request cannot be merged until someone approves the work again" (https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches, https://github.blog/changelog/2023-06-06-security-enhancements-to-required-approvals-on-pull-requests/). This is exactly "approval binds to a locked payload, invalidated on scope change." The guide's strongest idea has a citable precedent — cite it.

**Claim 4 (structured clarifying questions) — core direction confirmed.**
- **Claude Code** / AskUserQuestion tool (since v2.0.21): pauses execution and presents 1–4 structured multiple-choice questions with 2–4 options each; commonly paired with plan mode for spec-first workflows (https://code.claude.com/docs/en/agent-sdk/user-input). This is structured-fields-not-chat, shipping.
- **Gemini Deep Research** / editable research plan before execution — user reviews/edits scope before run. **ChatGPT Deep Research** asks clarifying questions before starting (https://www.androidauthority.com/chatgpt-vs-gemini-deep-research-3555202/ and similar comparisons — secondary but consistent).
- **ChatGPT agent** / clarification step "will auto-continue if you have nothing to add" (skip-with-safe-fallback behavior) (https://help.openai.com/en/articles/11752874-chatgpt-agent, summarized at https://www.threads.com/@btibor91/post/DMOASoeos9a/).
- **Linear** / Agent Interaction SDK: `elicitation` is one of only five server-validated activity types an agent may emit — clarification is a first-class typed event, not chat prose (https://linear.app/developers/agent-interaction).

**Claim 6 (memory review queue) — confirmed for exactly one product; see CONTRADICTED for the rest.**
- **Cursor** / Memories: a background "sidecar model" proposes memories; the user approves before saving; managed under Settings → Rules → Generate Memories (https://docs.cursor.com/context/memories). Proposed-not-saved is real — in Cursor only.
- Scope (not expiry) has an analog: **Claude.ai** memory is scoped per-project ("each project has its own separate memory space") and editable at Settings → Capabilities → Memory (https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context; launch-date claims of March 2026 come from secondary sources, e.g. https://www.shareuhack.com/en/posts/claude-memory-feature-guide-2026).

**Claims 7 & 14 (run monitor: progress, cost, blocked state) — confirmed.**
- **Devin** / Session Insights + Settings > Billing: per-session usage visible for any user; ACU consumption dashboards; users can set ACU limits per session (budget caps) (https://docs.devin.ai/admin/billing/usage). Blocked-vs-running distinction confirmed via session statuses (above).
- **Cursor** / Agents panel: each background agent shows "current step, elapsed time, and a live log" (https://docs.cursor.com/background-agent); iOS push notifications distinguish "finishes, needs input, or is ready for review" (changelog Jun 29, 2026: https://cursor.com/changelog) — three distinct terminal/blocked states, confirmed at notification level.
- **Manus** / credits: per-task consumption shown after the fact (https://help.manus.im/en/articles/11711097-what-are-the-rules-for-credits-consumption-and-how-can-i-obtain-them).
- **GitHub Copilot** / session log overview: token usage + session length per session (docs above).
- Caveat for the guide: **Codex** `/usage` (June 2026 changelog) is account-level daily/weekly/cumulative, not per-run (https://developers.openai.com/codex/changelog).

**Claim 9 (durable autonomy settings over per-action prompts) — confirmed, including a real Effective-Policy-Preview analog.**
- **Claude Code** / permissions: durable allow/ask/deny rules evaluated deny→ask→allow, permission modes (default, acceptEdits, plan, dontAsk, bypassPermissions), and `/permissions` — "an interactive view of every active allow/deny/ask rule… and review recent denials" (https://code.claude.com/docs/en/permissions). `/permissions` is a shipping effective-policy view; "recent denials" is a partial audit trail.
- **Codex** / MCP approvals with persistent choice storage: grant "in the current chat or across chats" (changelog, June 2026: https://developers.openai.com/codex/changelog) — the prompt-to-policy escalation path.
- **Codex** / multi-agent delegation modes: "disabled, explicit-request-only, or proactive at the thread and turn level" (same changelog) — durable autonomy levers for delegation itself.

**Claim 12 (kanban/board of agent work) — confirmed via Linear and GitHub.**
- **Linear** / delegation: issues stay assigned to humans and are *delegated* to agents ("issues can only be assigned to humans and delegated to agents… an agent cannot be held accountable"), so agent work lives on normal boards with human owners (https://linear.app/now/our-approach-to-building-the-agent-interaction-sdk, https://linear.app/changelog/2025-07-30-agent-interaction-guidelines-and-sdk).
- **GitHub** / Projects + Issues: assign Copilot from the Issues list or from GitHub Projects views; optional prompt field on assignment (https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/assign-copilot-to-an-issue).

**Claim 15 (background tasks: receipt + schedule + stop) — confirmed across three products.**
- **Claude Code** / Routines (shipped Apr 14, 2026, research preview): named scheduled cloud runs with cron presets, a per-routine *permission set*, run history with per-run logs, pause/modify from the Routines panel, plus API and GitHub-event triggers (https://code.claude.com/docs/en/scheduled-tasks; secondary: https://www.mindstudio.ai/blog/claude-code-routines-scheduled-agents). This is receipt + schedule + stop + scoped permissions — the closest shipping match to the whole template.
- **ChatGPT** / Scheduled tasks: Scheduled page lists active tasks, next run, past runs; pause/resume/edit/delete; plan-based caps (3–15); and tasks "may pause if… inactive or needs additional action from you" — a shipped error/repair state (https://help.openai.com/en/articles/10291617-scheduled-tasks-in-chatgpt).
- **Gemini** / Scheduled actions: management screen with list, pause, permanent delete, edit prompt/timing (coverage Nov 2025: https://www.neowin.net/news/google-gemini-challenges-chatgpt-with-new-scheduled-actions-feature/).

**Claim 16 (state matrix; blocked states as first-class) — corroborated by a shipped external vocabulary.**
- **Linear** / Agent sessions: exactly six lifecycle states (`pending, active, error, awaitingInput, complete, stale`) tracked server-side, and five validated activity types (thought, elicitation, action, response, error) (https://linear.app/developers/agent-interaction). AIG also requires: "Agents should clearly indicate whether they're thinking, waiting for input, executing, or finished" (https://linear.app/developers/aig). Cite this — it is the only shipping, formally validated state matrix in the panel.

**Claim 5 (citations pinned to source passages) — the citation half is confirmed; the blocking half is not (see CONTRADICTED).**
- **NotebookLM** / inline citations: every response carries numbered citations that jump to the exact source passage; hover previews the quoted text (https://servicecenter.fsu.edu/s/article/How-do-NotebookLM-s-inline-citations-work-and-why-are-they-important — university guide; NotebookLM official docs say the same).

## CONTRADICTED / STALE

**Claim 6 as stated ("proposed memories must wait in a review queue") — contradicts the dominant shipped flow, and the trend is moving further away.**
- **ChatGPT** / memory: saves automatically and notifies after ("Memory updated" toast you can hover to manage); and as of ~June 4, 2026 "Dreaming V3" background memory synthesis makes capture fully automatic with self-updating memories (https://help.openai.com/en/articles/8590148-memory-faq; Dreaming V3 via secondary: https://www.digitalapplied.com/blog/chatgpt-memory-dreaming-v3-openai-2026-guide — verify before citing). 
- **Claude.ai** / memory: automatic daily synthesis into an editable summary; no pre-save review queue (https://support.claude.com/en/articles/11817273).
- **Expiry metadata**: no evidence any panel product ships memory expiry. Invented.
- Required fix: present review-queue-plus-expiry as *deliberate divergence from shipped practice* (with Cursor Memories as the lone precedent), not as observed practice.

**Claim 3's full consequence preview (impact + cost + rollback, locked) — no product ships this; publishing it as practice would misstate every approval surface checked.**
- **Claude Code** permission prompts show the command/edit, not cost or rollback (https://code.claude.com/docs/en/permissions). **ChatGPT agent** asks confirmation "only when needed" before consequential actions, offers watch/takeover modes — no cost or rollback fields (https://openai.com/index/introducing-chatgpt-agent/, https://help.openai.com/en/articles/11752874). **Devin** `waiting_for_approval` gates the action in safe mode; budget control is a *pre-set ACU cap*, not per-approval cost display (https://docs.devin.ai). **Manus** explicitly states it cannot provide pre-task credit estimates and calls in-conversation predictions unreliable (https://help.manus.im/en/articles/13185575). Label the full preview aspirational; the *lock/revoke* half has the GitHub analog above.

**Claim 8 (handoff packet with explicit acceptance) — nothing ships it; adjacent mechanisms exist but none show carried/omitted context or accept/reject.**
- **Devin MultiDevin**: manager Devin distributes to up to 10 workers and merges results — no inspectable handoff packet, no acceptance step (https://cognition.ai/blog/devin-can-now-manage-devins). **Codex** June 2026: delegation *modes* (disabled/explicit/proactive), not packets. **Linear AIG**: silent on agent-to-agent handoff (https://linear.app/developers/aig). Must be framed as a proposal; closest shipped fragment is Linear's requirement of immediate acknowledgment on invocation + `pending` session state.

**Claim 5's share-block ("block sharing on unverified sections") — no product marks per-section citation status or blocks publishing on uncited sections.** NotebookLM cites per-statement but never blocks; Perplexity Pages publishes with citations attached, no gate. Guide invention — label as proposal.

**Claim 12's "Do not color-code agents" — refuted as an unqualified rule.** Linear AIG *requires* visual distinction: "Agents are clearly marked as agents with a small badge" and must "signal identity clearly so it can never be mistaken for a person" (https://linear.app/developers/aig). Products deliberately identity-mark agents (badges, avatars, app icons). If the guide means "distinguish agents by role/identity, not by arbitrary hue," it must say that and argue it; as written it reads as contradicting the panel's only published guideline set.

**Staleness confirmed — "Composer" terminology.** Cursor's current surface is the Agent/Agents Window; Composer survives only as the *model* name (Composer 1/2) and in historical changelogs (https://cursor.com/changelog, https://www.deployhq.com/guides/cursor). Using "the composer" generically for the chat entry point will read as 2024-era Cursor vocabulary.

**Staleness confirmed — per-run dollar pricing in mocks.** Panel reality: Devin = ACUs with per-session caps, Manus = credits (5–15 for chat, 500–900 for complex tasks), Copilot = premium requests/token counts, Codex = account-level token views, Claude/Cursor = plan quotas. Dollar-denominated per-run meters (`$0.18`) match none of them; recast mocks in abstract units or credits.

## NEEDS HANDS-ON

1. **GitHub Agents page row metadata**: open github.com → Agents tab on a repo with Copilot sessions; record exact per-row columns (status wording, repo, PR link, elapsed, premium-request count) and whether "waiting for review" renders differently from "in progress." Public docs do not enumerate the columns.
2. **Cursor 3 Agents Window**: start two local + one cloud agent; check (a) whether agents are visually distinguished by color vs name/icon; (b) whether any per-agent usage/cost figure appears; (c) whether Memories still show an approve-before-save step in the current build — the Jun 18, 2026 changelog mentions automation *memory files* deletable in UI, hinting the approval-queue design may have shifted.
3. **Codex desktop review queue**: run two parallel agents to completion; check whether queue rows carry any usage/cost figure and whether approval dialogs preview anything beyond the diff (impact summary? affected files count?).
4. **ChatGPT Deep Research clarifying step**: trigger it; record whether questions render as structured chips/select controls with visible defaults or plain chat text, and whether skipping states the assumption used.
5. **Devin approval moment**: in safe mode, reach `waiting_for_approval`; record exactly what the approval card shows (command only, or environment/impact context; any rollback affordance).
6. **Claude Code AskUserQuestion**: confirm whether any option is marked as recommended/default in the current CLI, and what happens on Esc/skip (does it state the assumption?).
7. **Perplexity Pages publish flow**: generate a Page, delete a citation from one section, publish; confirm there is no uncited-section warning or block (to safely assert "no product ships this").
8. **Linear board with a delegated agent**: verify how the delegated-agent chip renders on a board card (badge form, session state visibility) — needed to write the kanban section accurately.

## MISSED BY THE GUIDE

- **Delegation vs assignment accountability taxonomy (Linear)**: "issues can only be assigned to humans and delegated to agents"; "an agent cannot be held accountable." Directly upgrades the guide's "owner" column with a shipped, citable rule. https://linear.app/developers/aig
- **A shipped, server-validated state vocabulary (Linear Agent Interaction SDK)**: six session states incl. `awaitingInput` and `stale`, five typed activities incl. `elicitation` — external validation for the state-matrix claim and a naming scheme to map to. https://linear.app/developers/agent-interaction
- **Isolation as the precondition for queues (Codex worktrees)**: parallel-agent review queues are enabled by per-agent git worktree isolation; the templates never mention workspace isolation as a pattern. https://openai.com/index/introducing-the-codex-app/
- **The notification surface as a sixth operational layout**: Cursor iOS Live Activities/push distinguish "finished / needs input / ready for review" on the lock screen; Codex has mobile remote control. Agent state now ships at OS-notification granularity — absent from the five-layouts model. https://cursor.com/changelog (Jun 29, 2026)
- **Supervision gradient (ChatGPT agent watch mode / takeover mode)**: a middle state between approve-per-action and full autonomy — user watches execution or takes over the browser for sensitive input. The Approval template models a binary gate only. https://openai.com/index/introducing-chatgpt-agent/
- **Prompt-to-policy escalation (Codex persistent approvals)**: "allow in this chat / across chats" — the shipped bridge between per-action prompts and durable settings the guide's Agent Settings template jumps over. https://developers.openai.com/codex/changelog (June 2026)
- **Budget caps as control, not just display (Devin per-session ACU limits)**: the guide shows spend meters; products also ship *pre-set spend ceilings* per run. https://docs.devin.ai/admin/billing/usage
- **Dormancy/auto-pause lifecycle (ChatGPT scheduled tasks)**: tasks pause on inactivity or when they need user action — a background-task state the template's matrix lacks. https://help.openai.com/en/articles/10291617
- **Event-triggered routines (Claude Code Routines GitHub triggers)**: background work triggered by repo events, not just cron — broadens the Background Tasks template beyond schedules. https://code.claude.com/docs/en/scheduled-tasks
- **Delegation entry points everywhere (GitHub Agents panel)**: task launch from any page via a global overlay — the guide's model assumes the composer is the origin of delegation. https://github.blog/news-insights/product-news/agents-panel-launch-copilot-coding-agent-tasks-anywhere-on-github/

**Evidence-quality note for synthesis**: Dreaming V3 (ChatGPT memory) and Claude memory launch dates rest on secondary sources and should be re-verified against OpenAI/Anthropic release notes before citing; everything else above traces to official docs, changelogs, or product blogs.