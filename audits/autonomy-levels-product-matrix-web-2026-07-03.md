# Agentic Autonomy Levels → Product Feature Matrix

**Research date:** July 3, 2026  
**Scope:** Map Addy Osmani's L0–L5 framework (as specified below) to Claude Code, OpenAI Codex, Cursor, Factory Droid, and Devin.

---

## 1. Framework source status

| Item | Status |
|------|--------|
| **L0–L5 definitions below** | **User-provided / design brief** — used as the mapping key |
| **Primary URL for this exact L0–L5 post (July 2026)** | **Not found** via web search or fetch on July 3, 2026 |
| **Verified related Addy material** | Different numbering: Steve Yegge's **8 developer-adoption levels** ([O'Reilly CodeCon talk](https://talks.addy.ie/oreilly-codecon-march-2026/), [Code Agent Orchestra write-up](https://addyosmani.com/blog/code-agent-orchestra/)); Addy's **4-level agent taxonomy** ([Lesson 1](https://addyosmani.com/agents/01-what-are-ai-agents/)); **conductor → orchestrator** framing ([blog](https://addyosmani.com/blog/future-agentic-coding/)) |

**Important:** Do not conflate this matrix with Addy's "run contract" paragraph or Yegge's L1–L8 ladder. Those are separate frameworks.

### Reference definitions (mapping key)

| Level | Name | Essence |
|-------|------|---------|
| **L0** | Assist | Suggestions; user always decides |
| **L1** | Supervised action | Edits/runs with approval before consequential actions |
| **L2** | Scoped task delegation | Bounded task with goal, constraints, done definition; user nearby |
| **L3** | Goal-driven autonomy | Works until a condition is met (`/goal`, Goal mode, `/loop`) |
| **L4** | Parallel delegation | Many agents on isolated slices |
| **L5** | Managed-by-exception orchestration | Manager agent; backlog → continuous work |

### Two axes (from brief)

- **Agency:** how far a *single* agent thread runs before human re-engagement (permissions, autonomy level, goal loops).
- **Orchestration:** one thread vs. many coordinated threads (teams, missions, automations, Symphony).

---

## 2. Master matrix (closest product embodiment per cell)

Legend: **✓ verified** from official docs/blog · **~ inferred** from product shape + partial docs · **✗ weak/none**

| Level | Claude Code | OpenAI Codex | Cursor | Factory Droid | Devin |
|-------|-------------|--------------|--------|---------------|-------|
| **L0 Assist** | ✗ | ✗ | ~ Tab autocomplete | ✗ | ✗ |
| **L1 Supervised** | ✓ `default` permission mode | ✓ interactive + approvals | ✓ Run Mode Auto-review | ✓ Autonomy Off/Low | ✓ manual session |
| **L2 Scoped delegation** | ✓ Plan mode + plan approval | ~ scoped thread + approvals | ✓ Plan mode | ✓ Spec Mode | ✓ Playbooks (manual) |
| **L3 Goal-driven** | ✓ `/goal`, `/loop` | ✓ `/goal` | ~ Long-running Cloud Agents | ✗ | ~ long session (no `/goal`) |
| **L4 Parallel** | ✓ agent view, `/batch`, teams | ✓ Worktrees + parallel threads | ✓ Agents Window + worktrees | ✓ Custom Droids + worktrees | ✓ Auto-triage child sub-devins |
| **L5 Managed-by-exception** | ~ dynamic workflows / routines | ✓ Automations + Symphony | ✓ Automations | ✓ Missions / Mission Control | ✓ Automations + Auto-triage |

---

## 3. Detailed cell mappings

### L0 — Assist (Agency: minimal)

| Product | Closest feature | Control surface | Axis | Source | Verified? |
|---------|-----------------|-----------------|------|--------|-----------|
| **Claude Code** | No dedicated assist-only surface; product is agent/CLI-first | — | — | [Permission modes](https://code.claude.com/docs/en/permission-modes) | ✗ **No good L0 embodiment** |
| **OpenAI Codex** | Chat without tool execution (not a first-class "mode") | Composer | Agency | [Follow a goal](https://developers.openai.com/codex/use-cases/follow-goals) (implies normal turns stop after one response) | ✗ |
| **Cursor** | **Tab** inline completions (outside Agent panel) | Editor inline | Agency | ~ Industry-standard Cursor behavior; Agent docs describe Agent/Ask/Plan/Debug only | ~ |
| **Factory Droid** | Autonomy **Off** still runs an agent session; not suggestion-only | `Ctrl+L`, `/settings` | Agency | [Autonomy Level](https://docs.factory.ai/cli/user-guides/auto-run) | ✗ |
| **Devin** | Product is session/agent-first; no autocomplete tier | — | — | [Automations](https://docs.devin.ai/product-guides/automations) | ✗ |

**Gap note:** Pure L0 is poorly represented in agent-native tools. Only Cursor has a credible assist surface (Tab), and it lives outside the agent/composer stack.

---

### L1 — Supervised action (Agency)

| Product | Feature | Control surface | Axis | Source | Verified? |
|---------|---------|-----------------|------|--------|-----------|
| **Claude Code** | **`default` permission mode** — reads auto; edits/commands prompt | **Status bar** (`Shift+Tab` cycle); **Settings** `permissions.defaultMode`; VS Code mode indicator | Agency | [Permission modes](https://code.claude.com/docs/en/permission-modes) | ✓ |
| **OpenAI Codex** | Interactive thread with per-action approval; **`approval_policy`** in config | Composer; **Settings** `config.toml` | Agency | [Using Goals](https://developers.openai.com/cookbook/examples/codex/using_goals_in_codex) (mentions approval gates); third-party ref to `approval_policy` | ~ (approvals verified in ecosystem; exact UI labels less documented) |
| **Cursor** | **Run Mode: Auto-review** (default in 3.6+) — classifier + sandbox before risky calls | **Settings → Agents → Approvals & Execution** | Agency | [Run Modes](https://cursor.com/docs/agent/security/run-modes) (shipped May 29, 2026) | ✓ |
| **Factory Droid** | **Autonomy Off** (read tools + allowlisted commands only) or **Low** (edits + low-risk) | **Status/input bar** `Ctrl+L`; **Settings** `sessionDefaultSettings.autonomyLevel` | Agency | [Autonomy Level](https://docs.factory.ai/cli/user-guides/auto-run) | ✓ |
| **Devin** | Standard **manual session** — user prompts; Devin acts with session-level oversight | **Web app composer** (app.devin.ai) | Agency | [Creating Playbooks](https://docs.devin.ai/product-guides/creating-playbooks) | ✓ |

Also L1-adjacent:
- **Cursor Ask mode** — read-only, no edits ([Agent mode help](https://cursor.com/help/ai-features/agent.md)) — closer to L0/L1 boundary.
- **Claude Code `dontAsk`** — inverse: auto-deny unless pre-approved ([Permissions](https://code.claude.com/docs/en/permissions)).

---

### L2 — Scoped task delegation (Agency; user nearby)

| Product | Feature | Control surface | Axis | Source | Verified? |
|---------|---------|-----------------|------|--------|-----------|
| **Claude Code** | **`plan` permission mode** + **`/plan` prefix** — research/plan, no source edits; approve plan → switch mode | **Status bar** / mode selector; plan approval prompt in **composer** | Agency | [Permission modes](https://code.claude.com/docs/en/permission-modes) | ✓ |
| **OpenAI Codex** | Single **scoped thread** with explicit task spec; user stays in foreground (**Local** checkout) | Composer; **Local vs Worktree** selector | Agency | [Worktrees](https://developers.openai.com/codex/app/worktrees) | ✓ |
| **Cursor** | **Plan mode** — implementation plan before edits; user approves approach | **Agent panel** mode picker (`Shift+Tab`) | Agency | [Agent mode help](https://cursor.com/help/ai-features/agent.md) | ✓ |
| **Factory Droid** | **Spec Mode** — plan before implementation; approval dialog gates execution | **`Shift+Tab`** (Auto ↔ Spec ↔ Mission); Spec approval UI | Agency | [Autonomy Level](https://docs.factory.ai/cli/user-guides/auto-run) (Spec vs Auto distinction) | ✓ |
| **Devin** | **Playbooks** — reusable bounded procedures for repeated tasks | **Web app** playbook picker; `@playbook-name` in prompt | Agency | [Creating Playbooks](https://docs.devin.ai/product-guides/creating-playbooks) | ✓ |

Also L2-adjacent:
- **Claude Code `acceptEdits`** — auto file edits but user still nearby reviewing diffs — sits between L1 and L2.
- **Claude Code subagent delegation** — bounded side task in one session ([Agents parallel doc](https://code.claude.com/docs/en/agents)) — L2 agency inside one thread.

---

### L3 — Goal-driven autonomy (Agency)

| Product | Feature | Control surface | Axis | Source | Verified? |
|---------|---------|-----------------|------|--------|-----------|
| **Claude Code** | **`/goal [condition]`** — session-scoped; independent evaluator after each turn; indicator **`◎ /goal active`** | **Composer** slash command; **status** indicator | Agency | [Keep Claude working toward a goal](https://code.claude.com/docs/en/goal) (requires v2.1.139+) | ✓ |
| **Claude Code** | **`/loop [interval] [prompt]`** — repeat until stopped | Composer | Agency | [Commands](https://code.claude.com/docs/en/commands) | ✓ |
| **Claude Code** | **`auto` permission mode** — auto-approves tools within a turn (complements `/goal`, does not start new turns) | Status bar / settings | Agency | [Permission modes](https://code.claude.com/docs/en/permission-modes) | ✓ |
| **OpenAI Codex** | **`/goal`** — durable thread-scoped objective until stopping condition | Composer; enable via **`features.goals`** in `config.toml` | Agency | [Follow a goal](https://developers.openai.com/codex/use-cases/follow-goals); [Using Goals cookbook](https://developers.openai.com/cookbook/examples/codex/using_goals_in_codex) (from v0.128.0) | ✓ |
| **Cursor** | **Long-running Cloud Agents** — plan-first, multi-step, hours/days; **not** a declarative `/goal` contract | **cursor.com/agents**; cloud agent UI | Agency | [Long-running agents blog](https://cursor.com/blog/long-running-agents) (Feb 12, 2026 changelog) | ~ **Partial L3** |
| **Cursor** | **Stop hooks + `followup_message`** — community/workaround for "until done" | `.cursor/hooks.json` | Agency | [Cursor forum](https://forum.cursor.com/t/add-autonomous-goal-mode-similar-to-claude-code-s-goal/160374) — staff confirms no official Goal Mode | ~ |
| **Factory Droid** | **Autonomy High** + Auto mode runs many steps, but **no verified `/goal`-style completion evaluator** | `Ctrl+L`; settings | Agency | [Autonomy Level](https://docs.factory.ai/cli/user-guides/auto-run) | ✗ **No native L3** |
| **Devin** | Long **manual/automation sessions** with prompt-defined done criteria; no first-class goal loop command | Web session composer | Agency | [Automations](https://docs.devin.ai/product-guides/automations) | ~ **Weak L3** |

**Gap note:** L3 is the sharpest product differentiator. Claude Code `/goal` and Codex `/goal` are the cleanest verified embodiments. Cursor explicitly lacks equivalent Goal Mode ([forum, May 2026](https://forum.cursor.com/t/add-autonomous-goal-mode-similar-to-claude-code-s-goal/160374)).

---

### L4 — Parallel delegation (Orchestration)

| Product | Feature | Control surface | Axis | Source | Verified? |
|---------|---------|-----------------|------|--------|-----------|
| **Claude Code** | **`/batch`** — decompose into 5–30 worktree-isolated subagents + PRs | Composer (after plan approval) | Orchestration | [Commands](https://code.claude.com/docs/en/commands) | ✓ |
| **Claude Code** | **Agent view** — `claude agents`, **`/background`** | CLI TUI / **`claude agents`** dashboard | Orchestration | [Run agents in parallel](https://code.claude.com/docs/en/agents) | ✓ |
| **Claude Code** | **Agent Teams** (experimental) — lead + teammates, shared task list | Env **`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`**; settings | Orchestration | [Agent teams](https://code.claude.com/docs/en/agent-teams) | ✓ |
| **Claude Code** | **Subagents** + **git worktrees** per session | In-session; worktree flags | Orchestration | [Agents parallel doc](https://code.claude.com/docs/en/agents) | ✓ |
| **OpenAI Codex** | **Worktrees** — parallel threads, background isolation | App composer **Local/Worktree**; **`--worktree`** CLI | Orchestration | [Worktrees](https://developers.openai.com/codex/app/worktrees) | ✓ |
| **OpenAI Codex** | **Subagents** (`.codex/agents/*.toml`) | Config files | Orchestration | Community/knowledge-base refs; OpenAI docs on goals/worktrees verified | ~ |
| **Cursor** | **Agents Window** — parallel local/cloud agents, worktrees | **Cmd+Shift+P → Open Agents Window** | Orchestration | [Agents Window](https://cursor.com/docs/agent/agents-window) (GA Cursor 3, Apr 2, 2026) | ✓ |
| **Cursor** | **`/worktree`**, **`/best-of-n`**, cloud subagents **`/in-cloud`**, **`/babysit`** | Agents Window / composer | Orchestration | Agents Window doc | ✓ |
| **Factory Droid** | **Custom Droids (subagents)** via Task tool | `.factory/droids/`; `/droids` | Orchestration | [Custom Droids](https://docs.factory.ai/cli/configuration/custom-droids) | ✓ |
| **Factory Droid** | **`--worktree`** / worktree dir flags | CLI | Orchestration | [Droid Exec](https://docs.factory.ai/cli/droid-exec/overview) | ✓ |
| **Devin** | **Auto-triage child sub-devins** — parent spawns focused investigators | Automation config in **web app** | Orchestration | [Auto-triage](https://docs.devin.ai/product-guides/auto-triage) | ✓ |
| **Devin** | **Child sessions** (2026 release notes) | Web app session management | Orchestration | [2026 release notes](https://docs.devin.ai/release-notes/2026) | ✓ |

L4 vs L5 boundary: L4 = human dispatches parallel slices; L5 = system continuously pulls from backlog/events.

---

### L5 — Managed-by-exception orchestration (Orchestration)

| Product | Feature | Control surface | Axis | Source | Verified? |
|---------|---------|-----------------|------|--------|-----------|
| **Claude Code** | **Dynamic workflows / Ultracode** — script-driven multi-subagent runs | **`/effort ultracode`**, **`/workflows`** | Orchestration | [Workflows](https://code.claude.com/docs/en/workflows) | ✓ |
| **Claude Code** | **Cloud routines** (scheduled, independent sessions) | Settings / cloud | Orchestration | [Goal doc scheduling comparison](https://code.claude.com/docs/en/goal) | ✓ |
| **Claude Code** | **Agent Teams lead** as manager — plan approval for teammates, shared backlog | Lead session + **`Ctrl+T`** task overlay | Orchestration | [Agent teams](https://code.claude.com/docs/en/agent-teams) | ~ **Partial L5** (experimental, human still lead) |
| **OpenAI Codex** | **Automations** — scheduled/event `.codex/automations/*.toml` | Config files + app | Orchestration | Referenced in ecosystem; worktrees doc confirms automation worktrees | ~ |
| **OpenAI Codex** | **Symphony** — issue-tracker-driven daemon; one agent per issue until done | **`WORKFLOW.md`** in repo; external orchestrator | Orchestration | [OpenAI Symphony blog](https://openai.com/index/open-source-codex-orchestration-symphony/) (Feb 2026); [SPEC.md](https://github.com/openai/symphony/blob/main/SPEC.md) | ✓ |
| **Cursor** | **Automations** — cron/GitHub/Slack/Linear/webhook → cloud agents | **Agents Window**, **cursor.com/automations**, **`/automate`** skill | Orchestration | [Automations docs](https://cursor.com/docs/cloud-agent/automations); [blog](https://cursor.com/blog/automations) | ✓ |
| **Factory Droid** | **Missions** + **Mission Control** — plan → orchestrated multi-agent execution | **`/missions`**, **`Ctrl+T`** overlay; **`droid exec --mission`** | Orchestration | [Missions](https://docs.factory.ai/cli/features/missions); [CLI ref](https://docs.factory.ai/reference/cli-reference) | ✓ |
| **Devin** | **Automations** — event/schedule → sessions | **Web app Automations tab** | Orchestration | [Automations](https://docs.devin.ai/product-guides/automations) | ✓ |
| **Devin** | **Auto-triage (Triage Devin)** — persistent monitor; dedupe; spawn children; routing scratchpad | Automation action **Triage Devin** | Orchestration | [Auto-triage](https://docs.devin.ai/product-guides/auto-triage) | ✓ **Strongest L5 embodiment** |

**Gap note:** No product offers a fully hands-off "manager agent owns backlog forever" with production-grade exception-only UX. Closest: Devin Auto-triage, Cursor Automations, Codex Symphony, Factory Missions — all still require human review/merge at exception points.

---

## 4. Levels with weak or no good product embodiment

| Level | Gap |
|-------|-----|
| **L0 Assist** | **All five agent-native products lack a clean L0.** Cursor Tab is the only credible mapping; agent stacks start at L1+. |
| **L3 Goal-driven** | **Cursor** — no `/goal`; Long-running Agents are approximate. **Factory Droid** — no verified goal-until-condition primitive. **Devin** — no `/goal`-equivalent. |
| **L5 Managed-by-exception** | **Partial everywhere.** Symphony/Codex Automations/Cursor Automations/Devin Auto-triage/Factory Missions cover *pieces* (backlog polling, event triggers, child spawning), but none document true exception-only human oversight as a first-class mode. **Claude Code Agent Teams** is experimental and lead-supervised, not backlog-native. |

---

## 5. Cross-product control-surface cheat sheet

| Control type | Typical location |
|--------------|------------------|
| **Agency (single thread)** | Composer slash commands (`/goal`, `/plan`); permission/autonomy toggles in **status bar** (`Shift+Tab`, `Ctrl+L`); **Settings** defaults |
| **Orchestration (many threads)** | Separate surfaces: **`claude agents`**, **Agents Window**, **Mission Control overlay**, **Devin Automations web UI**, **Symphony daemon**, **cursor.com/automations** |

---

## 6. Source bibliography (verified primary)

| Source | URL | Date (when stated) |
|--------|-----|-------------------|
| Claude Code permission modes | https://code.claude.com/docs/en/permission-modes | Docs current 2026 |
| Claude Code `/goal` | https://code.claude.com/docs/en/goal | Requires v2.1.139+ |
| Claude Code commands (`/batch`, `/background`, `/loop`) | https://code.claude.com/docs/en/commands | 2026 docs |
| Claude Code parallel agents | https://code.claude.com/docs/en/agents | 2026 docs |
| Claude Code agent teams | https://code.claude.com/docs/en/agent-teams | Experimental |
| Claude Code workflows | https://code.claude.com/docs/en/workflows | 2026 docs |
| Codex `/goal` | https://developers.openai.com/codex/use-cases/follow-goals | 2026 |
| Codex Goals cookbook | https://developers.openai.com/cookbook/examples/codex/using_goals_in_codex | From v0.128.0 |
| Codex worktrees | https://developers.openai.com/codex/app/worktrees | 2026 |
| OpenAI Symphony | https://openai.com/index/open-source-codex-orchestration-symphony/ | Feb 2026 |
| Symphony SPEC | https://github.com/openai/symphony/blob/main/SPEC.md | Feb 26, 2026 repo |
| Cursor Agent modes | https://cursor.com/help/ai-features/agent.md | 2026 |
| Cursor Run Modes | https://cursor.com/docs/agent/security/run-modes | **May 29, 2026** (v3.6) |
| Cursor Agents Window | https://cursor.com/docs/agent/agents-window | **Apr 2, 2026** (Cursor 3) |
| Cursor Automations | https://cursor.com/docs/cloud-agent/automations | 2026 |
| Cursor long-running agents | https://cursor.com/blog/long-running-agents | **Feb 12, 2026** |
| Cursor Goal Mode gap (staff) | https://forum.cursor.com/t/add-autonomous-goal-mode-similar-to-claude-code-s-goal/160374 | **May 12, 2026** |
| Factory Autonomy Level | https://docs.factory.ai/cli/user-guides/auto-run | 2026 |
| Factory Missions | https://docs.factory.ai/cli/features/missions | 2026 |
| Factory Custom Droids | https://docs.factory.ai/cli/configuration/custom-droids | 2026 |
| Devin Automations | https://docs.devin.ai/product-guides/automations | 2026 |
| Devin Auto-triage | https://docs.devin.ai/product-guides/auto-triage | 2026 |
| Devin Playbooks | https://docs.devin.ai/product-guides/creating-playbooks | 2026 |
| Addy — Code Agent Orchestra (Yegge 8 levels, orchestration tiers) | https://addyosmani.com/blog/code-agent-orchestra/ | 2026 |
| Addy — Conductors to Orchestrators | https://addyosmani.com/blog/future-agentic-coding/ | Prior essay |
| Swarmia 5-level taxonomy (cites Addy on L3 shift) | https://www.swarmia.com/blog/five-levels-ai-agent-autonomy/ | **Mar 19, 2026** |

---

## 7. Design implications for composer/autonomy UI

1. **Agency controls belong in the composer thread** (mode picker, `/goal`, autonomy cycle) — all products treat these as session-scoped.
2. **Orchestration controls belong in separate surfaces** (Agents Window, Mission Control, Automations admin, Symphony config) — mixing them into composer creates the "orchestration tax" Addy describes on LinkedIn.
3. **L3 is the highest-leverage gap in Cursor/Factory/Devin** relative to Claude/Codex — a declarative completion condition + independent evaluator is the distinguishing primitive.
4. **L0 may be intentionally out of scope** for agent composers; if the eve Composer primitive needs L0, it likely maps to a non-agent surface (inline suggest) rather than Agent mode.

---

*Framework definitions: user brief. Product mappings: verified against official docs where marked ✓; ~ entries need product confirmation or ship in adjacent docs not fully fetched (Codex automations TOML schema, Factory Spec Mode page timed out on fetch).*

[REDACTED]