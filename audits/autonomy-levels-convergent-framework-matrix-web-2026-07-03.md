## Framework note (provenance)

Addy Osmani does **not** publish a single canonical ladder literally named “L0 Assist → L5 Managed-by-exception.” His public work combines three related frames:

1. **Dash0’s six levels of agentic software engineering** (L1 AI-Assisted → L5 Dark Factory), which he cites in [Loop Engineering](https://addyosmani.com/blog/loop-engineering/) and aligns with his “factory model.”
2. **Conductor ↔ Orchestrator** human-role shift ([Future of Agentic Coding](https://addyosmani.com/blog/future-agentic-coding/)).
3. **Steve Yegge’s eight developer-evolution levels** (L1–L8), which Addy promotes in [O’Reilly CodeCon 2026](https://talks.addy.ie/oreilly-codecon-march-2026/).

The mapping below uses the **convergent L0–L5 UX ladder** common across CSA, Dash0 (shifted), and agentic-UX literature — with **L4 = managed-by-exception** (human handles escalations, not per-action approval) and **L5 = lights-out / dark factory** (spec-only human role). This is the ladder Addy’s writing points toward, even when he names different rungs elsewhere.

### Axis definitions

| Axis | Low end | High end |
|------|---------|----------|
| **Human agency** | Human initiates and approves every consequential step (conductor) | Human sets goals/scope; intervenes only on exceptions (orchestrator) |
| **System orchestration** | Single turn, single agent, synchronous | Multi-agent, scheduled, event-driven, headless pipelines |

---

## The six levels (reference)

| Level | Name | AI does | Human does | Control surface |
|-------|------|---------|------------|-----------------|
| **L0** | Assist | Suggests snippets/completions | Writes code; accepts/rejects each suggestion | Inline editor, suggestion widget |
| **L1** | Co-pilot / Q&A | Answers, drafts fragments; no tool loop | Drives every change; copies or accepts piecemeal | Chat panel (read-only or copy-out) |
| **L2** | Supervised agent | Multi-step tool use (read/edit/run) | Approves each file edit, shell command, or fetch | Per-action permission prompts |
| **L3** | Plan-approved | Executes within an approved plan/scope | Reviews and approves plan (or spec) before execution | Plan review UI → execution |
| **L4** | Managed-by-exception | Full loop within guardrails; self-verifies | Monitors dashboards/logs; handles escalations only | Run-mode / autonomy dial + activity feed |
| **L5** | Lights-out / dark factory | End-to-end SDLC from spec (code, test, review, deploy) | Writes specs, boundaries, quality thresholds | Automation config + exception inbox |

**Sources:** [Dash0 Six Levels](https://www.dash0.com/knowledge/the-six-levels-of-agentic-software-engineering), [CSA Autonomy Framework L0–L5](https://labs.cloudsecurityalliance.org/wp-content/uploads/2026/03/agentic-ai-autonomy-levels-control-framework-v2-csa-styled.pdf), [Addy — Factory Model](https://addyosmani.com/blog/factory-model/)

---

## Cross-product mapping matrix

| Level | Claude Code | Codex | Cursor | Factory Droid | Devin |
|-------|-------------|-------|--------|---------------|-------|
| L0 | ⚠️ Weak | ⚠️ Weak | ✅ Tab | ⚠️ Weak | ⚠️ Weak |
| L1 | ✅ Ask / chat | ✅ Ask | ✅ Ask / Chat | ✅ Spec (read-only) | ✅ Ask |
| L2 | ✅ Default mode | ✅ `on-request` / `untrusted` | ✅ Ask run mode | ✅ Interactive default | ✅ Normal mode |
| L3 | ✅ Plan mode | ⚠️ Partial | ✅ Plan mode | ✅ Spec + `/missions` plan | ✅ Plan mode |
| L4 | ✅ Auto mode + Agent view | ✅ Automations + auto-review | ✅ Auto-review | ✅ `--auto` + hooks | ✅ Automations + Autonomous |
| L5 | ⚠️ Partial | ⚠️ Partial | ⚠️ Weak | ✅ Mission + `droid exec` | ⚠️ Partial |

---

## Per-level, per-product detail

### L0 — Assist

| Product | Feature | Where control renders | Agency ↑ / Orchestration ↑ | Source |
|---------|---------|----------------------|---------------------------|--------|
| **Claude Code** | No first-class inline completion; closest is IDE plugin context, not CC-native | N/A in terminal-first CC | — | [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works) |
| **Codex** | No inline Tab; product is agent-first | N/A | — | [Codex overview](https://developers.openai.com/codex) |
| **Cursor** | **Cursor Tab** (inline multi-line completion) | Editor gutter / ghost text; Tab to accept | **High agency / Low orchestration** | [Cursor Tab](https://cursor.com/docs/tab/overview) |
| **Factory Droid** | No inline assist; CLI is agent runtime | N/A | — | [Droid CLI Reference](https://docs.factory.ai/reference/cli-reference) |
| **Devin** | Legacy Cascade had completions; **Devin Local** is agent-first, no Tab equivalent | N/A for Local agent | — | [Devin Local](https://docs.devin.ai/desktop/devin-local) |

**No good embodiment:** Claude Code, Codex, Factory Droid, Devin (all agent-first by design).

---

### L1 — Co-pilot / informational assist

| Product | Feature | Where control renders | Agency ↑ / Orchestration ↑ | Source |
|---------|---------|----------------------|---------------------------|--------|
| **Claude Code** | Conversational Q&A without tool execution; read-only exploration | Terminal / IDE chat; no diff applied until promoted | **High / Low** | [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works) |
| **Codex** | **Ask** mode in ChatGPT sidebar | ChatGPT → Codex sidebar; “Ask” vs “Code” | **High / Low** | [Introducing Codex](https://openai.com/index/introducing-codex/) |
| **Cursor** | **Ask mode** | Agent panel mode picker (`Shift+Tab`); read-only, no file edits | **High / Low** | [Agent modes](https://cursor.com/help/ai-features/agent) |
| **Factory Droid** | **Spec mode** (default in `droid exec`; read-only reconnaissance) | CLI `Shift+Tab` → Spec; approval before any mutation | **High / Low** | [Droid Exec overview](https://docs.factory.ai/cli/droid-exec/overview) |
| **Devin** | **Ask mode** (`/ask`) | Devin CLI / Desktop; no writes | **High / Low** | [Essential Commands](https://docs.devin.ai/cli/essential-commands) |

---

### L2 — Supervised agent (per-action approval)

| Product | Feature | Where control renders | Agency ↑ / Orchestration ↑ | Source |
|---------|---------|----------------------|---------------------------|--------|
| **Claude Code** | **Default permission mode** | `Shift+Tab` cycle; inline prompt before each file edit + shell command | **High / Low** | [How Claude Code works — permissions](https://code.claude.com/docs/en/how-claude-code-works) |
| **Codex** | **`approval_policy = "untrusted"` or `on-request`** | Codex app permissions selector; `/permissions` in CLI | **High / Low** | [Agent approvals & security](https://developers.openai.com/codex/agent-approvals-security) |
| **Cursor** | **Run Mode: Ask** | Settings → Agents → Approvals & Execution → **Ask** | **High / Low** | [Auto-review changelog](https://cursor.com/changelog/auto-review) |
| **Factory Droid** | Interactive session with per-command approval | CLI approval overlay (`Ctrl+E` toggle details) | **High / Low** | [Droid CLI Reference](https://docs.factory.ai/reference/cli-reference) |
| **Devin** | **Normal permission mode** | CLI permission prompt per tool; Deny/Ask/Allow rule merge | **High / Low** | [Permissions](https://docs.devin.ai/cli/reference/permissions) |

---

### L3 — Plan-approved execution

| Product | Feature | Where control renders | Agency ↑ / Orchestration ↑ | Source |
|---------|---------|----------------------|---------------------------|--------|
| **Claude Code** | **Plan mode** + `ExitPlanMode` approval | `Shift+Tab` → Plan; plan markdown in chat; approve before edits | **Medium / Low** | [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works), [Tools: EnterPlanMode/ExitPlanMode](https://code.claude.com/docs/en/tools-reference) |
| **Codex** | Cloud task plan review (research preview: plan shown, limited mid-task steer) | ChatGPT Codex sidebar progress view | **Medium / Medium** | [Introducing Codex](https://openai.com/index/introducing-codex/) |
| **Cursor** | **Plan mode** | Agent panel `Shift+Tab`; saved plan markdown; “Build” CTA | **Medium / Low** | [Plan mode docs](https://cursor.com/docs/agent/modes) |
| **Factory Droid** | **`/missions` collaborative planning** → Mission Control handoff | CLI `/missions` conversation → approved milestone plan → orchestrator view (`Ctrl+T`) | **Medium / Medium** | [Factory Missions](https://docs.factory.ai/cli/features/missions) |
| **Devin** | **Plan mode** (`/plan`) + ticket scoping before autonomous run | Session UI plan phase; Jira/Linear scoping comments with confidence | **Medium / Medium** | [Essential Commands](https://docs.devin.ai/cli/essential-commands), [Jira integration](https://docs.devin.ai/integrations/jira) |

**Weakest L3:** Codex (explicitly lacks robust mid-task course-correction per official preview notes).

---

### L4 — Managed-by-exception

| Product | Feature | Where control renders | Agency ↑ / Orchestration ↑ | Source |
|---------|---------|----------------------|---------------------------|--------|
| **Claude Code** | **Auto mode** (classifier-gated) + **Agent view** background sessions + **`/goal` loops** | `Shift+Tab` → Auto; `claude agents` dashboard for exception attach; triage when classifier blocks | **Low–Medium / Medium–High** | [Auto mode config](https://code.claude.com/docs/en/auto-mode-config), [Agent view](https://code.claude.com/docs/en/agent-view), [Loop Engineering (Addy)](https://addyosmani.com/blog/loop-engineering/) |
| **Codex** | **Automations** + **`approvals_reviewer = "auto_review"`** + cloud background tasks | Codex app Automations tab → Triage inbox; notifications on approval needed | **Low–Medium / High** | [Automations](https://developers.openai.com/codex/app/automations), [Sandboxing / auto-review](https://developers.openai.com/codex/concepts/sandboxing) |
| **Cursor** | **Run Mode: Auto-review** (default for new installs) + **Cloud Agents** | Settings → Agents → **Auto-review**; classifier subagent; `cursor.com/agents` for background | **Low–Medium / Medium–High** | [Auto-review blog](https://cursor.com/blog/agent-autonomy-auto-review), [Agent help](https://cursor.com/help/ai-features/agent) |
| **Factory Droid** | **`--auto medium/high`** + **programmable hooks** + org `maxAutonomyLevel` | CLI `Ctrl+L` autonomy cycle; enterprise policy in org settings; hook enforcement points | **Low–Medium / High** | [Droid Exec autonomy tiers](https://docs.factory.ai/cli/droid-exec/overview), [Hierarchical settings](https://docs.factory.ai/enterprise/hierarchical-settings-and-org-control) |
| **Devin** | **Automations** (event triggers) + **Autonomous mode** (sandbox-gated) + **Triage Devin** | `app.devin.ai/automations`; email-on-failure; ACU/invocation caps; Session Manager for exceptions | **Low–Medium / High** | [Automations](https://docs.devin.ai/product-guides/automations), [Permissions — Autonomous](https://docs.devin.ai/cli/reference/permissions) |

**Managed-by-exception UX pattern (shared):** activity feed + exception inbox + kill switch — not per-diff approval. Addy warns this fails without earned trust ([80% Problem](https://addyo.substack.com/p/the-80-problem-in-agentic-coding)).

---

### L5 — Lights-out / dark factory

| Product | Feature | Where control renders | Agency ↑ / Orchestration ↑ | Source |
|---------|---------|----------------------|---------------------------|--------|
| **Claude Code** | **Scheduled tasks / `/loop` / GitHub Actions** + **Agent teams** (experimental) | Cron/hooks config; agent-team shared task list; human writes spec + reviews exception logs only | **Low / High** | [Loop Engineering](https://addyosmani.com/blog/loop-engineering/), [Agent teams](https://code.claude.com/docs/en/agent-teams) |
| **Codex** | **Standalone + thread automations** with `approval_policy = "never"` (org-permitted) | Automations tab; Triage archive; admin `requirements.toml` guardrails | **Low / High** | [Automations permissions](https://developers.openai.com/codex/app/automations) |
| **Cursor** | **Bugbot** (auto PR review) + Cloud Agents at scale — **no native scheduled SDLC factory** | PR checks; no first-class cron/CI orchestration layer in-product | **Low / Medium** (partial) | [Agent help — Bugbot](https://cursor.com/help/ai-features/agent) |
| **Factory Droid** | **`droid exec --mission`** headless multi-agent orchestrator | CI/CD invocation; Mission Control web dashboard; validator workers | **Low / Very High** | [Missions reference](https://docs.factory.ai/features/missions/reference), [Droid Exec — Mission mode](https://docs.factory.ai/cli/droid-exec/overview) |
| **Devin** | **Triage Devin** + scheduled automations (e.g. nightly CVE scan, weekly deps) | Automations templates; persistent triage session spawning child Devins | **Low / High** | [Automations templates](https://docs.devin.ai/product-guides/automations) |

**No product fully embodies L5 today** per Addy/Dash0 consensus: true lights-out requires spec precision, codified failure playbooks, and per-service trust measurement — skipping L3–L4 produces “bullshit factory” failure modes ([Dash0](https://www.dash0.com/knowledge/the-six-levels-of-agentic-software-engineering)).

**Closest to L5:** Factory Droid Mission mode (explicit orchestrator + validator + headless CI path).

**Weakest L5:** Cursor (no scheduled factory primitive; relies on external CI + Cloud Agents).

---

## Agency vs orchestration — product positioning

```
Orchestration →
Low                                                    High
Agency  ┌─────────────────────────────────────────────────┐
  High  │ L0–L2: Conductor territory                      │
        │  Cursor Tab/Ask, CC Default, Devin Normal       │
        ├─────────────────────────────────────────────────┤
 Medium │ L3: Plan gate                                   │
        │  Plan modes, Factory /missions planning         │
        ├─────────────────────────────────────────────────┤
  Low   │ L4–L5: Orchestrator territory                 │
        │  CC Auto+loops, Codex Automations, Factory      │
        │  Mission, Devin Automations/Triage            │
        └─────────────────────────────────────────────────┘
```

Addy’s inflection point: crossing from **conductor** (L0–L2) to **orchestrator** (L4+) requires restructuring verification — “your job is to ship code you confirmed works” ([Agentic Code Review](https://addyosmani.com/blog/agentic-code-review/)).

---

## Levels with weak or missing embodiment (summary)

| Level | Gap |
|-------|-----|
| **L0 Assist** | Claude Code, Codex, Factory, Devin — all agent-first; only **Cursor Tab** is a clean L0 |
| **L3 Plan-approved** | Codex cloud tasks lack robust mid-task steering (official preview limitation) |
| **L5 Lights-out** | **All five** — none ship full dark-factory SDLC (spec → deploy → maintain) with earned auto-merge; Factory Mission is nearest but still requires human spec authorship and exception handling |
| **L4 Managed-by-exception** | Best supported across all five in 2026; still immature as a *governance* primitive (classifier ≠ security boundary per Cursor and Claude docs) |

---

## Addy-aligned UX design implications

1. **Control should move up the abstraction stack** — from diff approval (L2) → intent/proof approval (L3) → escalation inbox (L4) → spec authoring (L5). ([Dash0 terminology](https://www.dash0.com/knowledge/agentic-software-engineering-terminology))
2. **Run-mode UI is the autonomy dial** — Cursor Auto-review, Claude Auto mode, Factory `Ctrl+L`, Devin permission tiers, Codex `approval_policy` are the primary L4 control surfaces.
3. **Orchestration primitives are converging** — automations, headless exec, mission orchestrators, triage agents (Addy’s [five loop pieces](https://addyosmani.com/blog/loop-engineering/): schedule, worktree, skills, connectors, subagents).
4. **Do not market L5 before L4 discipline** — Addy and Dash0 both warn that skipping rungs produces volume without validation.

---

*Research date: July 3, 2026. Primary sources: official product docs (Anthropic, OpenAI, Cursor, Factory, Devin) + Addy Osmani blog/talk + Dash0/CSA autonomy taxonomies.*

[REDACTED]