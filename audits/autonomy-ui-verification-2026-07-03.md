# Autonomy-in-the-interface: product verification (2026-07-03)

Research run before replying to Addy Osmani's "Agentic Autonomy Levels" (X, 2026-07-03).
Evidence base for the autonomy/interface essay.

---

# Verification: draft reply to Addy Osmani's "Agentic Autonomy Levels"

## 1. Claim-by-claim verdict table

| # | Draft assertion | Verdict | Detail |
|---|---|---|---|
| 1 | "the interface side is just as unsettled" | **SAFE** | Fully supported: every product examined factors autonomy differently, and vocabularies conflict even within single products (Codex CLI vs IDE vs app). |
| 2 | "none of the products ship the ladder as an actual control" | **NEEDS PRECISION** | Factory's droid ships a live, ordered, four-position control literally named **"Autonomy Level"** (Off/Low/Medium/High, `Ctrl+L`, docs.factory.ai, verified 2026-07-03), and Replit shipped a user-facing "Autonomy Level" (Low/Medium/High) ~Sept 2025 before removing it. An unqualified "none" gets corrected with a Factory screenshot. Precise wording: "nobody ships a **numbered L0–L5 ladder** as a control" or name Factory as the exception that proves the rule (its dial only tiers command risk, one axis, no orchestration axis). |
| 3 | "Claude Code projects it onto **the composer's permission modes**" | **NEEDS PRECISION** | "Permission modes" is the right term, but "composer's" is wrong for the primary surface: in the CLI the mode renders in the **status bar** and is cycled with Shift+Tab; it sits near the composer only in VS Code ("mode indicator at the bottom of the prompt box"), desktop ("next to the send button"), and web (dropdown next to the prompt box). Worse for a pedant: the mode **set and labels differ per surface** (six modes total, only three in the default cycle; cloud silently ignores `bypassPermissions`/`dontAsk`), and autonomy is factored across at least four dials (mode, effort, execution locus, goal/loop continuation), not one. Precise wording: "permission modes whose lineup changes per surface" or "permission modes in the status bar / mode selector." |
| 4 | "Codex onto **run controls**" | **NEEDS PRECISION** | "Run controls" matches nothing in Codex's actual UI. The reality is stronger: Codex ships **three incompatible autonomy vocabularies at once** — CLI approval presets (Read Only / Auto / Full Access via `/permissions`), IDE mode selector (Chat / Agent / Agent (Full Access)), and an app whose primary composer selector is **placement** (Local / Worktree / Cloud) with autonomy demoted to per-action prompts plus an auto-review option. Precise wording: "Codex onto approval presets that don't even agree across its CLI, IDE, and app." |
| 5 | "Cursor onto **a mode switch**" | **WRONG (as stated)** | The composer mode picker (Agent/Ask/Plan/Debug) selects **conversation behavior, not permissions**. Execution autonomy is a separate global **Run Mode** (Auto-review / Allowlist / Run Everything) under Settings > Agents > Approvals & Execution (shipped 3.6, 2026-05-29), plus file-based rules (`permissions.json`, `sandbox.json`). Fix: "Cursor splits it between a composer mode picker and a run-mode setting buried in Settings." |
| 6 | "eve onto **runtime levers with no level at all**" | **SAFE** (one term landmine nearby) | Verified against eve 0.19.0 (npm 2026-07-02): zero hits for "autonomy" anywhere; no mode/level/preset in `defineAgent`; autonomy is emergent from per-tool/per-connection `approval` policies, tool availability, sandbox `networkPolicy`, per-turn `clientContext`. `responsible-use.md` explicitly puts aggregate policy on the developer. Only trap: the API is `approval`, not `needsApproval` (renamed 0.14.0, 2026-06-25, no compat alias) — fine as drafted since no API name is used. |
| 7 | "Everyone ships a different projection" | **SAFE** | Directly supported; also true *within* products (Codex ×3 surfaces, Claude Code per-surface mode sets, Cursor composer vs settings vs files). |
| 8 | "nobody renders the resolved policy in a way a human can actually read and configure" | **NEEDS PRECISION** | Two citable near-misses exist: Claude Code's `/permissions` (interactive viewer/editor of **merged** allow/ask/deny rules with per-file source attribution) and Codex's `/status` (prints active sandbox mode + approval policy + writable roots, CLI-only, read-only — with documented divergence from enforcement, GH issues #6667/#4152). Both are policy-**input** views, not a computed "this run may do X, not Z" projection. Precise wording: "nobody renders the **resolved effective** policy — the closest are merged rule lists and read-only status dumps." With that qualifier the thesis holds everywhere checked, including Devin CLI (5 precedence layers, no merged viewer) and Cursor (cross-file merge order undocumented). |

## 2. Corrected strongest reply

> I have been thinking about this a lot recently and the interface side is just as unsettled: nobody ships this ladder as a control (Factory's "Autonomy Level" dial comes closest, and it only tiers command risk). Claude Code projects autonomy onto permission modes whose lineup literally changes per surface, Codex ships three vocabularies that don't agree across its CLI, IDE, and app, Cursor splits it between a composer mode picker and a run-mode setting buried in Settings, and eve has no level anywhere, just per-tool approval policies and sandbox rules. And nobody renders the resolved effective policy, what this run may actually do right now, in a form a human can read and edit. The closest we get is Claude Code's merged rule list and Codex's read-only status dump, and the status dump has open issues where it disagrees with what's enforced.

(4 sentences; opener preserved; closing thesis survived the adversarial check in its qualified "resolved effective policy" form — the unqualified "resolved policy" version did not.)

## 3. Ammunition list (verified, dated)

1. **Claude Code's mode set is surface-dependent**: six permission modes exist, only three are in the default Shift+Tab cycle, VS Code renames them ("Ask before edits"), cloud sessions **silently ignore** `defaultMode: "bypassPermissions"`/`"dontAsk"` in checked-in settings, and since v2.1.142 repos can't grant themselves auto mode (official docs, fetched 2026-07-03).
2. **Invisible effective-policy mutation**: entering Claude Code's auto mode silently drops broad allow rules (`Bash(*)`, package-manager runs) and restores them on exit — a policy change rendered nowhere in the UI (permission-modes doc, fetched 2026-07-03). Also: v2.1.198 **removed** the interactive `/agents` config UI in favor of editing markdown files — configuration regressing from UI to files.
3. **Codex's rendered policy diverges from enforced policy**: `/status` is the only resolved readout, CLI-only and read-only, and open issues #6667 (sandbox reported read-only despite `workspace_write`) and #4152 (read-only bypassed by MCP edit tools) document it disagreeing with enforcement; the config reference doesn't even document precedence across its ~6 policy layers (fetched 2026-07-03).
4. **Cursor's own framing is anti-ladder**: "decisions around agent autonomy behave more like a dial than a switch" — Auto-review blog, June 11, 2026; ~7% of Auto-review chats hit an interruption, classifier blocks ~4% of actions; Run Mode is global, with no per-agent override in the Agents Window.
5. **The ladder-as-control was tried and retired**: Replit shipped a user-facing "Autonomy Level" (Low/Medium/High) with Agent 3 (~Sept 2025) and has since removed it entirely ("there's nothing to configure" per current docs, fetched 2026-07-03) — and it actually dialed self-code-review depth, not permissions. Numbered ladders survive only in frameworks and marketing (Swarmia, Tessl, CSA 2026-01-28), never as product controls.

## 4. Do-not-say list

- **"None of the products ship the ladder as a control"** unqualified — Factory's live "Autonomy Level" (Off/Low/Medium/High) and Replit's retired one refute it. Always say "numbered ladder" or name the exceptions.
- **"Composer's permission modes"** for Claude Code — the CLI control is the status bar + Shift+Tab cycle; composer-adjacent only in IDE/desktop/web.
- **"Nobody shows you the policy at all"** — Claude Code `/permissions` (merged rules, source attribution, editable) and Codex `/status` exist. Only the "resolved effective policy for a run" version holds.
- **Cursor's mode picker = autonomy control** — Agent/Ask/Plan/Debug is conversation behavior; permissions live in Run Mode (Settings) and JSON files. Also: Ask mode was **not** removed; Run Modes are **not** per-agent; Auto-review is explicitly **not** a security boundary; "YOLO mode" is stale naming (current: "Run Everything").
- **eve `needsApproval`** — stale since 0.14.0 (2026-06-25); the API is `approval` with no compat alias. Also don't say eve renders nothing per-request (it streams approval/denial events); the accurate claim is no aggregate standing-policy view.
- **Codex "Local / Worktree / Cloud" as an autonomy mode** — it's placement, not permissions. Also unverified: the `/approvals` → `/permissions` rename date, Goal mode GA date (~2026-05-21, third-party only), and any goal banner/pill UI (docs describe none).
- **Claude Code auto mode as GA** — it's a research preview (announced March 2026; don't cite a specific day). Agent teams are experimental and env-var-gated, not a shipped surface.
- **Google Antigravity "autonomy profiles"** (Secure/Review-driven/etc.) — third-party-reported only; official page unverifiable.

---

# Appendix: per-product research

## claudeCode

# Claude Code autonomy-control UI — research findings (all sources fetched 2026-07-03)

**Freshness anchor:** official changelog latest release is **v2.1.199** (github.com/anthropics/claude-code/blob/main/CHANGELOG.md, fetched 2026-07-03). All doc pages below are the live code.claude.com docs, fetched 2026-07-03.

---

## 1. Permission modes: exact names, count, and where the control renders

**Six modes** (docs table, https://code.claude.com/docs/en/permission-modes):

| Mode | What runs without asking | Notes |
|---|---|---|
| `default` | Reads only | prompts on first use of each tool |
| `acceptEdits` | Reads, file edits, common fs commands (`mkdir`, `touch`, `mv`, `cp`…) in cwd | |
| `plan` | Reads only | read/explore, no source edits |
| `auto` | "Everything, with background safety checks" | **research preview**; classifier model reviews each action; requires v2.1.83+; announced ~March 2026 (https://claude.com/blog/auto-mode; InfoQ coverage May 2026: https://www.infoq.com/news/2026/05/anthropic-claude-code-auto-mode/) |
| `dontAsk` | Only pre-approved tools | auto-DENIES anything that would prompt; for CI |
| `bypassPermissions` | Everything | ask rules + `rm -rf /`/`~` circuit-breaker still prompt |

**Where the control renders — this is surface-dependent, which is directly useful for the thesis:**

- **CLI:** `Shift+Tab` cycles `default` → `acceptEdits` → `plan`. Quote: "The current mode appears in the status bar." Optional modes slot in after `plan`: `bypassPermissions` (only after starting with `--permission-mode bypassPermissions` / `--dangerously-skip-permissions` / `--allow-dangerously-skip-permissions`) then `auto` (only if account meets requirements). **`dontAsk` never appears in the cycle** — flag-only (`--permission-mode dontAsk`). Status-bar strings are documented verbatim: `⏵⏵ accept edits on` (acceptEdits), `⏵⏵ don't ask on` (dontAsk).
- **VS Code:** clickable "mode indicator at the bottom of the prompt box" with **renamed labels**: "Ask before edits" (`default`), "Edit automatically" (`acceptEdits`), "Plan mode", "Auto mode", "Bypass permissions" (the last requires an extension-settings toggle to even appear).
- **Desktop app:** "mode selector next to the send button"; Auto and Bypass appear only after enabling in Desktop settings.
- **Web/mobile (claude.ai/code):** mode dropdown next to the prompt box. Cloud sessions offer only "Accept edits", "Plan mode", "Auto mode"; bypass unavailable; **`defaultMode: "bypassPermissions"` or `"dontAsk"` in checked-in settings is "ignored silently"**. Remote Control sessions offer a different trio: "Ask permissions", "Auto accept edits", "Plan mode".
- **Config plane:** `permissions.defaultMode` in settings files; `--permission-mode` flag; org kill-switches `permissions.disableBypassPermissionsMode` / `disableAutoMode`; since v2.1.142, `defaultMode: "auto"` in project/local settings is ignored "so a repository cannot grant itself auto mode."

So: the mode set is not even constant across surfaces, labels differ per surface, and two modes are deliberately excluded from the interactive cycle.

## 2. Real UI affordance vs slash-command/config (feature by feature)

| Feature | UI affordance status | Evidence |
|---|---|---|
| **`/plan` / plan mode** | Real UI: mode in Shift+Tab cycle + plan-approval dialog with 5 options: "Approve and start in auto mode / Approve and accept edits / Approve and review each edit manually / Keep planning with feedback / Refine with Ultraplan (browser-based review)". `Ctrl+G` opens the plan in your text editor. Approving a plan **switches the session's permission mode** per the option chosen. | permission-modes doc |
| **`/goal`** | Slash command + a live status indicator: "While the goal is active, a `◎ /goal active` indicator shows how long the goal has been running." `/goal` with no args shows condition, duration, turns evaluated, token spend, evaluator's latest reason. Under the hood it's "a wrapper around a session-scoped prompt-based Stop hook" judged by the small-fast model (Haiku default). Requires v2.1.139+. | https://code.claude.com/docs/en/goal |
| **`/loop`** | **Bundled Skill** (alias `/proactive`), no dedicated UI — runs a prompt on an interval or self-paced in the open session. | commands reference, https://code.claude.com/docs/en/commands |
| **`/background`** (`/bg`) | Command that detaches the session into a background agent; the UI surface is **Agent View**. `←` on empty prompt backgrounds + opens agent view in one step. | commands ref; agent-view doc |
| **`/batch`** | **Bundled Skill**: "decomposes the work into 5 to 30 independent units and presents a plan. Once approved, spawns one background subagent per unit in an isolated git worktree... opens a pull request." UI = plan presentation + approval; monitoring via `/tasks`. | commands ref |
| **`/code-review`** | **Bundled Skill** with effort arg `low\|medium\|high\|xhigh\|max\|ultra`, `--fix`, `--comment`; `ultra` = multi-agent cloud review ("ultrareview"). `--fix` landed v2.1.152. | commands ref; changelog |
| **`/security-review`** | Command, read-only security pass on branch diff. No dedicated UI. | commands ref |
| **`/schedule`** (`/routines`) | Command; "Claude walks you through the setup conversationally" — routines execute on **Anthropic-managed cloud infrastructure**. Conversational, not a form UI. | commands ref |
| **Subagents** | Notable regression-as-evidence: **the interactive `/agents` config UI was removed in v2.1.198** — it now "prints a reminder to ask Claude to create or manage subagents, or to edit `.claude/agents/`... directly." Config is markdown files + chat. Runtime affordances exist: subagents run in background by default (v2.1.198), `/tasks` lists them, `Ctrl+X Ctrl+K` stops all background subagents. | commands ref; changelog |
| **Hooks** | Config-only for editing: settings.json (user/project/local/managed), plugin `hooks/hooks.json`, skill/agent frontmatter. `/hooks` opens a **read-only browser**: "The menu is read-only: to add, modify, or remove hooks, edit the settings JSON directly or ask Claude to make the change." Events now include `PreToolUse`, `PermissionRequest`, `PermissionDenied`, `Stop`, `TaskCreated/Completed`, `TeammateIdle`. | https://code.claude.com/docs/en/hooks |
| **Checkpointing** | Real UI: rewind menu via `Esc Esc` or `/rewind` (aliases `/checkpoint`, `/undo`), listing every user prompt, with actions: Restore code and conversation / Restore conversation / Restore code / Summarize from here / Summarize up to here / Never mind. Auto-checkpoint per user prompt; does NOT track bash-command file changes. | https://code.claude.com/docs/en/checkpointing |
| **Background sessions / agent delegation** | Real UI: **Agent View** (`claude agents`), research preview, v2.1.139+, announced May 2026 (https://claude.com/blog/agent-view-in-claude-code). Full-screen table grouped "Needs input / Working / Completed" (+ Pinned, Ready for review), state icons, `Space` = peek panel + inline reply, `Enter`/`→` = attach, dispatch input at bottom. Hosted by a supervisor process. | https://code.claude.com/docs/en/agent-view |
| **Agent teams** | **Experimental, disabled by default**, gated on `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` env var (docs describe as of v2.1.178). UI: in-process "agent panel below the prompt input" (arrows select, Enter opens teammate transcript, Esc interrupts, `x` stops) or tmux/iTerm2 split panes (`teammateMode` setting). **Teammates are NOT rows in Agent View** ("Subagents and teammates a session spawns aren't listed as separate rows"). Teammate plan approval: "The lead makes approval decisions autonomously." Teammate permission prompts "bubble up to the lead session." Teammates inherit the lead's permission mode at spawn; no per-teammate mode at spawn time. | https://code.claude.com/docs/en/agent-teams |
| **Adjacent autonomy dials with UI** | `/effort` opens an interactive slider (`low`–`max`, `ultracode` = xhigh + automatic workflow orchestration); `Option+T` toggles extended thinking; `Option+O` toggles fast mode; `/workflows` opens a progress view to watch/pause/resume workflows; `Ctrl+T` toggles the task checklist; `/ultraplan` sends planning to a browser-reviewed cloud session. | commands ref; interactive-mode doc |

## 3. Does anything render a RESOLVED effective policy? **No.**

- `/permissions` is a raw-rule browser: "Opens an interactive dialog where you can view rules by scope, add or remove rules, manage working directories, and review recent auto mode denials" and "lists all permission rules and the `settings.json` file each rule comes from." It shows rules + provenance, **not** a computed "here is what this session may do right now."
- The resolution algorithm exists only in prose: deny → ask → allow, first match wins, specificity irrelevant; five-layer precedence (managed > CLI args > `.claude/settings.local.json` > `.claude/settings.json` > `~/.claude/settings.json`); mode sets the baseline; hooks evaluated at runtime (a PreToolUse block "takes precedence over allow rules"); sandbox merges Read/Edit deny rules into the OS boundary. The user must compute the intersection mentally.
- Invisible policy mutations strengthen the point: **entering auto mode silently drops broad allow rules** (`Bash(*)`, wildcarded interpreters, package-manager run commands, `Agent` allow rules) and "Dropped rules are restored when you leave auto mode" — an effective-policy change rendered nowhere. Auto mode's classifier ruleset is server-side; the closest artifact is `claude auto-mode defaults`, which "see[s] the full rule lists" as a CLI text dump — generic defaults, not this-session resolution. Conversational boundaries ("don't push") act as classifier block signals but "are not stored as rules" and can be silently lost to context compaction. Cloud sessions silently ignore certain `defaultMode` values.
- Closest existing surfaces (all partial): the per-action permission prompt; denial toasts + the "Recently denied" tab in `/permissions` (v2.1.193 added denial reasons; `r` retries with manual approval); startup warnings for typo'd rules; `--verbose` showing exact tool parameters; `/context` (context composition, not policy).

## 4. Any numbered autonomy level anywhere? **No.**

No numeric ladder appears anywhere in the product. Permission modes are named words (`default`/`acceptEdits`/`plan`/`auto`/`dontAsk`/`bypassPermissions`); VS Code re-labels them as phrases ("Ask before edits"); effort levels are named (`low`→`max`, `ultracode`); code-review depth is named (`low`…`ultra`). The only ordinal structures are the Shift+Tab cycle order and the `/effort` arrow-key slider — ordered but unnumbered. Nothing maps to an L0–L5 scale, and autonomy is factored across at least four orthogonal dials (permission mode, effort, execution locus [foreground/background/cloud], continuation [goal/loop/hooks/routines]) rather than one axis. The `/goal` doc itself frames auto mode and `/goal` as **complementary axes**: "auto mode removes per-tool prompts, and `/goal` removes per-turn prompts."

## Source list

- Permission modes (modes table, Shift+Tab cycle, per-surface selectors, auto-mode classifier, status-bar strings): https://code.claude.com/docs/en/permission-modes (fetched 2026-07-03)
- Permissions / rules / `/permissions` behavior / precedence / managed settings: https://code.claude.com/docs/en/permissions (fetched 2026-07-03)
- Interactive mode (Shift+Tab row, Ctrl+B backgrounding, Ctrl+T, Esc Esc, /btw, task list): https://code.claude.com/docs/en/interactive-mode (fetched 2026-07-03)
- Commands reference (full slash-command table; Skill vs command vs Workflow taxonomy): https://code.claude.com/docs/en/commands (fetched 2026-07-03)
- Checkpointing / rewind menu: https://code.claude.com/docs/en/checkpointing (fetched 2026-07-03)
- Agent view: https://code.claude.com/docs/en/agent-view (fetched 2026-07-03); announcement https://claude.com/blog/agent-view-in-claude-code (May 2026)
- Agent teams: https://code.claude.com/docs/en/agent-teams (fetched 2026-07-03)
- `/goal`: https://code.claude.com/docs/en/goal (fetched 2026-07-03)
- Hooks (read-only `/hooks` browser, event list): https://code.claude.com/docs/en/hooks (fetched 2026-07-03)
- Changelog (v2.1.199 latest; v2.1.198 `/agents` UI removal + background-default subagents; v2.1.193 denial reasons in `/permissions`; v2.1.152 `/code-review --fix`): https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md (fetched 2026-07-03; changelog entries are versioned, not dated)
- Auto mode announcement: https://claude.com/blog/auto-mode (March 2026; auto mode requires v2.1.83+ per docs); third-party corroboration https://www.infoq.com/news/2026/05/anthropic-claude-code-auto-mode/ (May 2026)

## Caveats for the synthesis step

- Changelog entries carry version numbers but no dates; date claims should lean on the two blog posts and doc "min-version" annotations (docs annotate v2.1.x per feature).
- Auto mode announcement date: blog is March 2026 (secondary sources say March 12–24); say "March 2026" rather than a specific day.
- "Six permission modes" is correct per the official modes table today, but `auto` is explicitly a research preview and `dontAsk`/`bypassPermissions` are gated — a precise claim is "six modes, of which only three are in the default Shift+Tab cycle."
- Agent teams are experimental and env-var-gated — do not describe them as a shipped UI surface; the accurate claim is "agent panel below the prompt input, behind an experimental flag, with plan-approval decisions made autonomously by the lead agent."

## codex

# OpenAI Codex — autonomy-control UI research (as of 2026-07-03)

All "official docs" claims below were fetched from developers.openai.com on 2026-07-03. Third-party claims are flagged. Codex's autonomy surface is genuinely three different UIs (CLI, IDE extension, desktop app) plus a cloud settings dashboard — the mode vocabularies do NOT match across them, which directly supports the "each product projects autonomy onto different surfaces" thesis.

## 1. Approval/autonomy modes and where the control renders

**Codex CLI (TUI)** — three named presets: **Read Only**, **Auto** (default), **Full Access**.
- Auto = read/edit/run inside the working directory, asks for anything outside it or needing network. Read Only = "consultative mode." Full Access = "work across your machine, including network access, without asking."
- Control renders as: startup flags, and mid-session via the **`/permissions` slash command** ("Set what Codex can do without asking first") — a picker inside the session, not a composer dropdown. (Earlier 2025 CLI versions called this `/approvals`; current docs say `/permissions` — verify before quoting the rename date.)
- Underlying config (config.toml / flags), two orthogonal keys — this is the real policy model the presets compile down to:
  - `approval_policy`: `"untrusted"` | `"on-request"` | `"never"` | a **granular object** `{ granular = { sandbox_approval, rules, mcp_elicitations, request_permissions, skill_approval } }` (`"on-failure"` deprecated).
  - `sandbox_mode`: `"read-only"` | `"workspace-write"` | `"danger-full-access"`; plus `--dangerously-bypass-approvals-and-sandbox` (alias `--yolo`).
  - Named `[permissions.<name>]` profiles with filesystem rules (`":read-only"`, `":workspace"`, `":danger-full-access"`) and per-domain network allowlists exist in config only — no UI renders them.
- Sources: [CLI features](https://developers.openai.com/codex/cli/features), [slash commands](https://developers.openai.com/codex/cli/slash-commands), [config reference](https://developers.openai.com/codex/config-reference), [agent approvals & security](https://developers.openai.com/codex/agent-approvals-security), [permissions](https://developers.openai.com/codex/permissions).

**IDE extension (VS Code etc.)** — a *different* three-way vocabulary: **Chat / Agent / Agent (Full Access)**. Docs: "Switch between `Chat`, `Agent`, and `Agent (Full Access)` depending on how much autonomy you want Codex to have." Renders in the sidebar composer as a mode selector. Note the IDE fuses "conversation vs. action" (Chat vs Agent) with "how much sandbox" (Full Access) into one control — the CLI separates them. Source: [IDE docs](https://developers.openai.com/codex/ide) (fetched 2026-07-03).

**Codex app (macOS launched 2026-02-02, Windows 2026-03-04)** — the composer's primary selector is not autonomy but *placement*: **Local / Worktree / Cloud** ("work directly in your current project directory" / "isolate changes in a Git worktree" / "run remotely in a configured cloud environment"). Autonomy shows up as (a) per-action **permission prompts** with scoping options ("approve once" / "approve for this session", and per June 18 2026 changelog, scoping by execution environment), and (b) a **permissions selector** where **"automatic review"** appears as an alternative to human approval ("keeps the same sandbox boundary but routes eligible approval requests through the configured review policy"). Sources: [app features](https://developers.openai.com/codex/app/features), [app overview](https://developers.openai.com/codex/app); launch dates: [TechCrunch 2026-02-02](https://techcrunch.com/2026/02/02/openai-launches-new-macos-app-for-agentic-coding/), [9to5Mac](https://9to5mac.com/2026/02/02/openai-launches-codex-app-for-macos-here-are-the-details/).

**Newer axis (not a mode picker at all):** app-server clients can set **multi-agent delegation** to `disabled` / `explicit-request-only` / `proactive` **at the thread and turn level** ([changelog](https://developers.openai.com/codex/changelog), 2026-06-22). Config-only; no UI ladder.

## 2. Goal mode UI

- Created via the **`/goal <objective>`** slash command (max 4,000 chars); lifecycle via `/goal` (view), `/goal pause`, `/goal resume`, `/goal clear`. The **stopping condition is unstructured prose inside the goal text** — docs tell you to write "a verifiable end state" and what "done" means; there is no structured stop-condition field, budget slider, or iteration-limit control in the UI. Progress reporting is by convention (docs suggest asking for "compact progress reports"). Sources: [follow-goals use case](https://developers.openai.com/codex/use-cases/follow-goals), [slash commands](https://developers.openai.com/codex/cli/slash-commands), [cookbook: Using Goals in Codex](https://developers.openai.com/cookbook/examples/codex/using_goals_in_codex).
- Rollout: gated behind `features.goals = true` / `codex features enable goals` at launch; third-party reporting (multiple independent sources) says **Goal mode hit GA ~2026-05-21 (CLI 0.133.0, goals enabled by default)** — official docs still show the feature-flag instructions, so cite GA cautiously ([techjacksolutions](https://techjacksolutions.com/ai-brief/openai-codex-goal-mode-reaches-general-availability-what-the/), [authorityaitools](https://authorityaitools.com/blog/openai-codex-may-2026-cli-0131-0133-appshots-goal-mode)).
- Recent UI hardening (official changelog): "support for **editing goals directly in the composer**" (CLI 0.142.0, 2026-06-22); iOS "goal workflows with a composer shortcut" (2026-06-15); "allow creating a new goal after completion" (2026-06-18). So the goal is becoming a composer-level object, but official docs never describe a banner/pill/panel rendering — don't claim one.

## 3. Automations and Auto-review — where they live

**Automations** (shipped with the app, 2026-02-02): live in **"the automations pane inside your Codex app sidebar"**; results land in **Triage** ("acts as your inbox," filterable, bulk mark-read/archive added 2026-06-18). Created two ways: natural language in a regular thread (Codex drafts the automation), or a form with schedule + prompt fields; presets or raw **cron syntax**. Three types: thread automations (wake the same thread), standalone, project-scoped. Per-automation choices: **worktree vs. local project** execution, model + reasoning effort. Local-app automations require the machine on and Codex running. Source: [app/automations](https://developers.openai.com/codex/app/automations).

**Auto-review** (distinct from GitHub code review): replaces the human at the sandbox boundary with a **reviewer agent**. Enabled via config — `approvals_reviewer = "auto_review"` (default `"user"`); policy via `[auto_review].policy` in config.toml; enterprises inject `guardian_policy_config` via managed requirements; default policy is a markdown file in the open-source repo (`core/src/guardian/policy.md`). It evaluates escalated shell calls, blocked network requests, out-of-root file edits, MCP/app tool calls, new browser domains. In the app it surfaces as an option **in the permissions selector**; in the CLI, `/approve` retries "a single recent action denied by automatic review." OpenAI's alignment team claims ~**200x fewer human-approval stops** vs. manual mode. Sources: [auto-review concept doc](https://developers.openai.com/codex/concepts/sandboxing/auto-review), [alignment.openai.com/auto-review](https://alignment.openai.com/auto-review/).

**GitHub code review** (separate feature): configured at **chatgpt.com/codex/settings/code-review** — per-repo **"Code review"** toggle, plus an **"Automatic reviews"** toggle (review every new PR without a mention); manual trigger is an `@codex review` PR comment (Codex reacts 👀, focuses "P0 and P1 issues"); steering via a "Review guidelines" section in `AGENTS.md`. Source: [integrations/github](https://developers.openai.com/codex/integrations/github).

## 4. Resolved effective policy / numbered level?

- **No numbered autonomy level exists anywhere in Codex UI.** No L0–L5, no ladder control.
- Closest thing to a resolved-policy rendering: CLI **`/status`** — "Display session configuration and token usage," showing active model, **approval policy, writable roots**, sandbox config, context capacity. It is a read-only textual dump for the current session, not a configurable policy surface, and it exists only in the CLI.
- The effective policy is actually composed from ≥6 layers — CLI flags, `[permissions.<name>]` profiles, `config.toml`, granular `approval_policy` objects, enterprise **managed requirements** (`guardian_policy_config`), per-app overrides (`apps.<id>.approvals_reviewer`), plus hooks (`PermissionRequest` event can intercept approvals) — and **the config reference does not even document the precedence order**, let alone render the merged result. The app renders only the moment-of-truth prompt ("approve once / approve for this session"). Sources: [config-reference](https://developers.openai.com/codex/config-reference), [permissions](https://developers.openai.com/codex/permissions), [slash-commands](https://developers.openai.com/codex/cli/slash-commands).
- Fact-check note for the reply: `/status` is a real, citable partial counterexample ("shows approval policy + writable roots") — phrase the thesis as "no *configurable, cross-surface* rendering of resolved policy," not "nothing shows it."

## 5. Symphony

- **Real.** Open-source **spec** (not a product): [github.com/openai/symphony](https://github.com/openai/symphony), Apache 2.0, announced via [openai.com/index/open-source-codex-orchestration-symphony/](https://openai.com/index/open-source-codex-orchestration-symphony/) (~**2026-04-28**, per [Help Net Security](https://www.helpnetsecurity.com/2026/04/28/openai-symphony-codex-orchestration-linear/)). README (fetched 2026-07-03): "Symphony turns project work into isolated, autonomous implementation runs, allowing teams to manage work instead of supervising coding agents," explicitly labeled "**a low-key engineering preview** for testing in trusted environments."
- **It has no UI of its own — the Linear board *is* the UI.** Symphony polls the board; each Linear issue in an "active" workflow state maps to one agent workspace; it dispatches a Codex agent per issue, tracks progress, restarts crashed/stalled agents. Agents post **"proof of work: CI status, PR review feedback, complexity analysis, and walkthrough videos"** back to the board; accepted work lands as a PR. Two consumption paths in the README: (1) `SPEC.md` in RFC MUST/SHOULD/MAY language — "tell your favorite coding agent to build Symphony"; (2) an **experimental Elixir reference implementation** (a daemon, no GUI). Prerequisite framing: codebases that adopted "harness engineering" (openai.com/index/harness-engineering/).
- OpenAI's claim (relayed in press): landed PRs **+500% in the first three weeks** on some internal teams ([InfoWorld](https://www.infoworld.com/article/4164173/openais-symphony-spec-pushes-coding-agents-from-prompts-to-orchestration.html), [tessl.io](https://tessl.io/blog/openai-open-sources-symphony-a-spec-for-orchestrating-codex-agents/)).
- For the reply's thesis: Symphony is the purest example of autonomy projected onto a *foreign* surface — the control plane is a PM tool's kanban columns; "autonomy level" degenerates into "which column the ticket is in."

## Synthesis-ready observations

1. Codex ships **three incompatible autonomy vocabularies simultaneously**: CLI (Read Only/Auto/Full Access — sandbox-shaped), IDE (Chat/Agent/Agent Full Access — conversation-shaped), app (Local/Worktree/Cloud — placement-shaped, with autonomy demoted to per-action prompts + an auto-review selector). Nothing maps between them, and none is a numbered ladder.
2. Autonomy escalation increasingly happens by **substituting the approver** (Auto-review's reviewer agent, ~200x fewer stops) rather than by moving a mode dial — an axis Addy's ladder doesn't have a rung for.
3. The **stopping condition in Goal mode is prose**, not a rendered control; the effective permission policy is a 6-layer merge with **no rendered resolution and undocumented precedence**; the only counterexample is CLI-only, read-only `/status`.

Sources: [Codex changelog](https://developers.openai.com/codex/changelog) · [CLI features](https://developers.openai.com/codex/cli/features) · [Slash commands](https://developers.openai.com/codex/cli/slash-commands) · [Agent approvals & security](https://developers.openai.com/codex/agent-approvals-security) · [Config reference](https://developers.openai.com/codex/config-reference) · [Permissions](https://developers.openai.com/codex/permissions) · [IDE](https://developers.openai.com/codex/ide) · [App features](https://developers.openai.com/codex/app/features) · [App automations](https://developers.openai.com/codex/app/automations) · [App review](https://developers.openai.com/codex/app/review) · [Auto-review](https://developers.openai.com/codex/concepts/sandboxing/auto-review) · [alignment.openai.com/auto-review](https://alignment.openai.com/auto-review/) · [GitHub integration](https://developers.openai.com/codex/integrations/github) · [Follow goals](https://developers.openai.com/codex/use-cases/follow-goals) · [Goals cookbook](https://developers.openai.com/cookbook/examples/codex/using_goals_in_codex) · [openai/symphony](https://github.com/openai/symphony) · [Symphony announcement](https://openai.com/index/open-source-codex-orchestration-symphony/) · [Help Net Security 2026-04-28](https://www.helpnetsecurity.com/2026/04/28/openai-symphony-codex-orchestration-linear/) · [InfoWorld](https://www.infoworld.com/article/4164173/openais-symphony-spec-pushes-coding-agents-from-prompts-to-orchestration.html) · [TechCrunch 2026-02-02](https://techcrunch.com/2026/02/02/openai-launches-new-macos-app-for-agentic-coding/) · [9to5Mac 2026-02-02](https://9to5mac.com/2026/02/02/openai-launches-codex-app-for-macos-here-are-the-details/) · [techjacksolutions (Goal GA)](https://techjacksolutions.com/ai-brief/openai-codex-goal-mode-reaches-general-availability-what-the/) · [authorityaitools (CLI 0.133)](https://authorityaitools.com/blog/openai-codex-may-2026-cli-0131-0133-appshots-goal-mode)

## cursor

# Cursor 3.x (mid-2026) — autonomy control surfaces: research findings

Scope: Cursor desktop 3.x (3.0 shipped April 2, 2026; latest observed 3.9, June 29, 2026). Evidence gathered July 3, 2026. Confidence flags: [official] = cursor.com docs/changelog/blog; [forum] = forum.cursor.com; [3p] = third-party writeup.

## 1. What became of the old Ask/Agent mode switch

- The old Ask/Agent toggle is now a **four-entry mode picker in the chat composer**: **Agent, Ask, Plan, Debug**. Confirmed by a forum thread listing exactly those four modes in the dropdown, with staff reply confirming "no way to hide or turn off certain modes" (posted Mar 18, 2026; staff reply Mar 22, 2026) — https://forum.cursor.com/t/a-way-to-disable-agent-modes-i-never-use/155156 [forum]
- Shortcuts: `Shift+Tab` cycles modes; `Cmd+.` / `Ctrl+.` opens the mode picker directly. [forum, same thread; also official docs below]
- Official docs (current, undated): the "Agent modes" page (https://cursor.com/docs/agent/modes) foregrounds only **Plan** and **Agent**, switched via "the mode picker dropdown in Agent" and `Shift+Tab`; it also says Cursor auto-suggests Plan Mode on keywords indicating complex tasks. [official]
- **Ask mode still exists** in the IDE: read-only exploration mode, activated via the Agent panel (`Cmd+I`) + mode picker / `Shift+Tab` — https://cursor.com/help/ai-features/ask-mode (current, no deprecation note, no last-updated date shown). [official]
- **Debug mode** shipped in changelog 2.2 ("Debug Mode, Plan Mode Improvements…") — https://cursor.com/changelog/2-2. [official]
- The CLI has parallel modes: Plan and Ask added to Cursor CLI Jan 16, 2026 (`/ask`, `--mode=ask`) — https://cursor.com/changelog/cli-jan-16-2026. [official]
- Caveat for precision: the mode picker (Agent/Ask/Plan/Debug) selects **conversation behavior**, not permissions. Autonomy over execution is a **separate control** ("Run Mode," see #3) that lives in Settings, not in the composer. No source shows mode names carrying permission semantics.

## 2. Agents Window (3.0, April 2, 2026) — per-agent autonomy controls

- Agents Window = separate workspace running many agents in parallel "locally, in worktrees, in the cloud, and on remote SSH"; opened via `Cmd+Shift+P → Agents Window` or File → New Agent Window. Sidebar shows every agent incl. ones started from Slack, GitHub, Linear, mobile, web — https://cursor.com/changelog/3-0 (Apr 2, 2026). [official]
- Per-agent controls documented: **model picker**, **environment picker** (local / worktree / cloud / SSH), move agents between environments, per-agent **diffs view** ("simpler diffs view for faster review," stage/commit/PR from the window), Agent Tabs (side-by-side grids), `/worktree`, `/best-of-n` — changelog 3-0 + https://forum.cursor.com/t/cursor-3-agents-window/156509 (Apr 2–3, 2026). [official/forum]
- **No evidence of a per-agent autonomy/run-mode toggle.** Run Mode (Auto-review / Allowlist / Run Everything) is configured globally at **Settings > Cursor Settings > Agents > Approvals & Execution** (a.k.a. "Run Mode" pane), not per agent in the Agents Window composer. Multiple searches found no per-agent override; one docs summary said run modes "apply to individual agents" only in the sense that they govern each agent's tool calls. Treat "per-agent autonomy control exists" as **unsupported** — don't claim it. [official docs + absence of evidence across forum/3p]
- Forum criticism relevant to the thesis: users complain the Agents Window "operates at a single granularity level" — you can't "quickly shift granularity from micromanaging an agent to letting something run on its own" (Apr 2026) — https://forum.cursor.com/t/cursor-3-agents-window/156509. [forum]
- Later 3.x additions (all Agents-Window-centric, none adding autonomy UI): 3.7 cloud subagents + `/in-cloud` (Jun 17), 3.8 Automations w/ computer use (Jun 18), 3.9 mobile "Remote Control" of agents (Jun 29), customize page for "plugins, skills, MCPs, subagents, rules, commands, and hooks" (Jun 22) — https://cursor.com/changelog. [official]

## 3. Run Modes / permissions UI — raw rules, not resolved policy

- **Run Modes** (Cursor 3.6, May 29, 2026, changelog "Auto-review Run Mode" — https://cursor.com/changelog/auto-review; docs https://cursor.com/docs/agent/security/run-modes):
  - **Auto-review** (recommended; default for new users since blog post of Jun 11, 2026): three-stage filter — allowlisted calls run immediately → sandboxable shell commands run in OS sandbox (macOS Seatbelt/`sandbox-exec`; Linux Landlock+seccomp; Windows via WSL2 per forum) → everything else goes to a **classifier subagent** that allows, redirects, or asks for approval. Applies to Shell, MCP, and Fetch tool calls. [official]
  - **Allowlist**: only allowlisted actions run without approval; sandbox optional. [official]
  - **Run Everything**: every tool call runs automatically, no classifier, no sandbox (successor to the old "Auto-Run"/YOLO toggle). [official]
  - UI path: **Settings > Cursor Settings > Agents > Approvals & Execution / Run Mode**. [official changelog + byteiota, Jun 2026]
- **Rule configuration is raw text/JSON, not a resolved view**:
  - Classifier steering via plain-English `allow_instructions` / `block_instructions` arrays in `~/.cursor/permissions.json` and `<project>/.cursor/permissions.json`; sandbox config in `sandbox.json` (same locations) — run-modes docs + forum thread https://forum.cursor.com/t/auto-review-run-mode/161922. [official/forum]
  - CLI permissions reference (https://cursor.com/docs/cli/reference/permissions): `allow`/`deny` arrays with `Shell(git)`, `Read(src/**/*.ts)`, `Write(package.json)`, `WebFetch(*.github.com)`, `Mcp(datadog:*)`; "Deny rules take precedence over allow rules"; **merging across global vs project files is not documented, and no command/UI displays the final resolved effective policy**. [official]
  - Agent Security docs (https://cursor.com/docs/agent/security): config files (`.git/config`, `.git/hooks`, `.vscode`, `.cursorignore`, Cursor config) are protected/need approval; `.cursorignore` blocks file access; web-fetch domain allowlist (no entry → per-fetch prompt); MCP: connection approval + per-tool-call approval unless pre-approved via MCP allowlist. Explicit: Run Modes are "**best-effort guardrails rather than a hard security boundary**." [official]
- Forum evidence of opacity (all Jun 2026, https://forum.cursor.com/t/auto-review-run-mode/161922): requests for more granular allowlist semantics ("allow all read-only commands, disallow commands that modify files outside the project"); sandbox "never properly works, just confuses the model"; classifier burned quota in overnight loops; CLI only has allowlist/unrestricted — no classifier parity. [forum]

## 4. Numbered autonomy levels rendered anywhere?

- **None.** No numbered level (L0–L5 or otherwise) appears in the composer, Agents Window, Run Mode settings, changelog, or docs. Cursor's own framing is explicitly anti-ladder: Auto-review "makes decisions around agent autonomy behave more like a dial than a switch" — https://cursor.com/blog/agent-autonomy-auto-review ("Governing agent autonomy with Auto-review," **June 11, 2026**). [official]
- Same post, quotable stats: "only about 7% of total chats in Auto-review mode lead to at least one interruption"; classifier "currently blocks around 4% of actions"; trained on "6,122 labeled rows" (deduped from ~12h internal sessions + synthetic risk cases); classifier runs in the same RPC stream as the parent agent and can Read/Grep/Glob the workspace. Auto-review is now default for new users; existing users opt in via Settings > Agents. [official]

## Synthesis notes (thesis fit)

- Supports thesis strongly: Cursor splits autonomy across **three disjoint surfaces** — conversation mode picker in the composer (Agent/Ask/Plan/Debug), global Run Mode in Settings (Auto-review/Allowlist/Run Everything), and file-based rules (`permissions.json`, `sandbox.json`, `.cursorignore`, MCP/domain allowlists). None of these is a ladder, none is per-agent in the Agents Window, and **nothing renders the resolved effective policy** (allowlist ∪ sandbox profile ∪ classifier instructions ∪ protected paths ∪ deny-wins precedence) in one human-readable place — the CLI docs don't even document cross-file merge order.
- Precision traps to avoid in the reply: (a) don't say Ask mode was removed — it survived into 3.x; (b) don't call Run Modes per-agent controls; (c) don't call Auto-review a security boundary (Cursor explicitly disclaims it); (d) "YOLO mode" is stale naming — current name is "Run Everything"; (e) Auto-review's default status applies to **new users only** (as of Jun 11, 2026).

Sources: [cursor.com/changelog/3-0](https://cursor.com/changelog/3-0) (Apr 2, 2026) · [cursor.com/changelog/auto-review](https://cursor.com/changelog/auto-review) (3.6, May 29, 2026) · [cursor.com/blog/agent-autonomy-auto-review](https://cursor.com/blog/agent-autonomy-auto-review) (Jun 11, 2026) · [cursor.com/changelog](https://cursor.com/changelog) (3.7–3.9, Jun 2026) · [cursor.com/changelog/cli-jan-16-2026](https://cursor.com/changelog/cli-jan-16-2026) · [cursor.com/changelog/2-2](https://cursor.com/changelog/2-2) · [cursor.com/docs/agent/modes](https://cursor.com/docs/agent/modes) · [cursor.com/docs/agent/security](https://cursor.com/docs/agent/security) · [cursor.com/docs/agent/security/run-modes](https://cursor.com/docs/agent/security/run-modes) · [cursor.com/docs/cli/reference/permissions](https://cursor.com/docs/cli/reference/permissions) · [cursor.com/help/ai-features/ask-mode](https://cursor.com/help/ai-features/ask-mode) · [forum.cursor.com/t/cursor-3-agents-window/156509](https://forum.cursor.com/t/cursor-3-agents-window/156509) (Apr 2026) · [forum.cursor.com/t/auto-review-run-mode/161922](https://forum.cursor.com/t/auto-review-run-mode/161922) (Jun 2026) · [forum.cursor.com/t/a-way-to-disable-agent-modes-i-never-use/155156](https://forum.cursor.com/t/a-way-to-disable-agent-modes-i-never-use/155156) (Mar 2026) · [byteiota.com/cursor-36-auto-review-run-mode](https://byteiota.com/cursor-36-auto-review-run-mode/) (Jun 2026, 3p corroboration)

## policyCheck

# Adversarial verification — "no shipping agentic product renders the resolved autonomy policy human-readably/configurably, and none ships a numbered autonomy ladder as a control"

Verification run: 2026-07-03. All "accessed" dates = today. Evidence quality flagged per item (OFFICIAL = vendor docs/changelog; PRESS/BLOG = third party).

## Verdict summary

- **Sub-claim A — "none ships a numbered autonomy ladder as a control": HOLDS WITH CAVEAT.** No product found that exposes a digit-indexed ladder (L0–L5, Level 1–5) as a runtime control. **Caveat that must be named: Factory's droid ships a live, four-position, ordered control literally named "Autonomy Level" (Off/Low/Medium/High), and Replit shipped a user-facing "Autonomy Level" (Low/Medium/High) in Sept 2025 and has since removed it.** An unqualified "nobody exposes the ladder as a control" gets corrected with a Factory screenshot within minutes. Safe phrasing: "nobody ships a *numbered* L0–L5 ladder; the closest are Factory's risk-tiered 'Autonomy Level' and Replit's retired one — which actually dialed code-review depth, not permissions."
- **Sub-claim B — "none renders the resolved effective policy": HOLDS WITH CAVEAT.** No product found that renders a computed capability projection ("this run may do X, Y, not Z — derived from your layered settings"). **Caveat that must be named: Claude Code's `/permissions` is a genuine interactive viewer/editor of the *merged* allow/ask/deny rules with per-rule source attribution, and Codex's `/status` prints the session's active sandbox mode + approval policy.** Both are policy-*input* views (rule lists / two enums), not resolved-outcome views — but "nobody renders the policy at all" is refutable; "nobody renders the *resolved effective* policy for a run" holds.

---

## Sub-claim A evidence: graded/labeled autonomy controls that exist (none numbered)

| Product | What it actually ships | Evidence date | Source |
|---|---|---|---|
| **Factory droid** (CLI + Factory App + `droid exec`) | Control named **"Autonomy Level"**: Off → Low → Medium → High, cycled with `Ctrl+L`, default set in `/settings`, `--auto low\|medium\|high` headless. Commands/MCP tools carry a risk tier (low/med/high); droid auto-runs anything at or below the set level, subject to denylist/blocklist/sandbox checks. **The single strongest counterexample — ordered ladder, explicitly named "Autonomy Level," one axis (command risk), no orchestration axis, not numbered.** | accessed 2026-07-03 (OFFICIAL) | https://docs.factory.ai/cli/user-guides/auto-run |
| **Replit Agent 3** | Shipped **"Autonomy Level"** control (Low/Medium/High) with Agent 3, ~Sept 2025 ("Autonomy Level Control arrived" per Replit's 2025 year-in-review). Current docs: renamed to a "Code Optimizations" on/off toggle, then **removed entirely** — "there's nothing to configure." Note: the levels dialed *self code-review frequency*, marketed as autonomy. A product shipped a named autonomy ladder, and it didn't survive — and it wasn't really an autonomy policy. | launch ~2025-09; removal confirmed on docs page accessed 2026-07-03 (OFFICIAL) | https://docs.replit.com/replitai/autonomy-level ; https://blog.replit.com/2025-replit-in-review |
| **OpenAI Codex** | 3 labeled approval modes via `/approvals` (`/permissions` in newer builds): **Read Only / Auto / Full Access**, backed by separate `sandbox_mode` + `approval_policy` config enums. Ordered, labeled, not numbered. | accessed 2026-07-03 (OFFICIAL) | https://developers.openai.com/codex/security |
| **Devin CLI** (Cognition) | 5 labeled permission modes: **Normal / Accept Edits / Bypass / Autonomous / Plan** (Autonomous pairs with `--sandbox`). Note: the "safe mode" phrasing in the task brief did not verify; the shipping terms are these modes. | accessed 2026-07-03 (OFFICIAL) | https://docs.devin.ai/cli/reference/permissions |
| **Goose** (Block) | 4 labeled modes in desktop/CLI settings: **Autonomous / Manual Approval / Smart Approval / Chat Only**; Smart Approval uses an LLM "PermissionJudge." Default is Autonomous (criticized in GH issue #2806). | accessed 2026-07-03 (OFFICIAL docs + GH) | https://goose-docs.ai/docs/guides/goose-permissions/ ; https://github.com/block/goose/issues/2806 |
| **Windsurf** (now "Devin Desktop" post-Cognition) | **Four auto-execution levels** for Cascade terminal commands, topmost = **Turbo** (auto-runs everything not denylisted), plus allow/deny lists (`windsurf.cascadeCommandsAllowList/DenyList`), team + user layers, deny > allow. Turbo announced Feb 2025. | Turbo tweet 2025-02; docs accessed 2026-07-03 (OFFICIAL) | https://docs.windsurf.com/windsurf/terminal ; https://x.com/windsurf_ai/status/1891981446698656142 |
| **Google Antigravity** | Terminal Execution Policy (**Off / Auto / Turbo** per multiple third-party writeups), Review Policy (**"Always Proceed"** / agent-decides), per-project allow/deny lists for paths and URLs inheriting from global settings ("Security Preset", "Agent Behaviour" per Google's own codelab). Third-party blogs also describe **four preconfigured "autonomy profiles"** (Secure / Review-driven / Agent-driven / Custom) — **could not confirm profile names on the official docs page (JS-rendered, unfetchable); verify hands-on before citing profiles as fact.** | codelab accessed 2026-07-03 (OFFICIAL, partial); profiles from BLOG | https://codelabs.developers.google.com/getting-started-google-antigravity ; https://antigravity.google/docs/agent-modes-settings ; https://www.aibuilderclub.com/blog/google-antigravity-complete-guide |
| **Warp** | Docs section literally titled **"Autonomy"**: per-action-category 3-position selector (**Always ask / Agent decides / Always allow**) across apply-diffs, read-files, create-plans, execute-commands, plus allow/denylist (deny > all). All-Always-allow = "YOLO mode." A *matrix*, not a ladder. | accessed 2026-07-03 (OFFICIAL) | https://docs.warp.dev/agents/autonomy ; https://docs.warp.dev/agents/autonomy/agent-permissions |
| **Kiro** (AWS) | Binary **Autopilot / Supervised** toggle in chat UI; docs explicit that both modes have identical capabilities — "the difference is the review workflow, not the underlying permissions." | accessed 2026-07-03 (OFFICIAL) | https://kiro.dev/docs/chat/autopilot/ |
| **GitHub Copilot CLI / VS Code** | **Autopilot** mode (autonomous multi-step sessions, public preview; permission dialog moved to first prompt submission in v0.0.421, 2026-03-03). Binary mode, not a ladder. | changelog 2026-03/04 (OFFICIAL) | https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot ; https://github.com/github/copilot-cli/blob/main/changelog.md |
| **Cline** | Auto-approve **checkbox matrix** (read project/all files, edit, safe commands, browser, MCP) + max-request budget + YOLO mode. Capability matrix, no ladder. | accessed 2026-07-03 (OFFICIAL) | https://docs.cline.bot/features/auto-approve |
| **ServiceNow AI Agents** | Per-agent and per-tool binary **Supervised / Autonomous** execution-mode setting. | accessed 2026-07-03 (OFFICIAL community/KB) | https://www.servicenow.com/community/developer-articles/get-familiar-with-agentic-workflows-amp-ai-agent/ta-p/3326559 |
| **Salesforce Agentforce** | Natural-language "guardrails" per topic + HITL approval flows. No level control. (Salesforce's numbered "Agentic Maturity Model" is content marketing, not UI.) | accessed 2026-07-03 (OFFICIAL Trailhead) | https://trailhead.salesforce.com/content/learn/modules/trusted-agentic-ai/explore-agentforce-guardrails-and-trust-patterns |
| **Lindy / Zapier Agents** | Per-action **"Ask for Confirmation"** toggles on side-effecting actions. | accessed 2026-07-03 (OFFICIAL help docs) | https://www.lindy.ai/academy-lessons/action-configuration ; https://help.zapier.com/hc/en-us/articles/26028298697485 |
| **Manus** | No user-facing autonomy policy control found; one-time "Authorize" grant for Browser Operator takeover; confirmation behavior is prompt-internal. | blog 2025 (OFFICIAL blog) | https://manus.im/blog/manus-browser-operator |
| **Jules** (Google) | Plan approval ("Approve plan"), auto-approves on timeout, optional skip-approval submission. No graded control. | accessed 2026-07-03 (OFFICIAL) | https://jules.google/docs/ |
| **OpenHands** | Confirmation mode + `--always-approve` / `--llm-approve`; SDK `ConfirmRisky` policy with configurable risk threshold. Labeled policies, no ladder. | accessed 2026-07-03 (OFFICIAL) | https://docs.openhands.dev/sdk/guides/security |
| **AWS "Continuum"** (new, 2026) | Press: starts in supervised "learn mode," earns autonomy "category by category" as customers grant it. Graduated *grants*, not a ladder control. Verify before citing specifics. | 2026 (PRESS) | https://www.geekwire.com/2026/amazon-unveils-new-ai-agents-trying-to-thread-the-needle-between-autonomy-and-human-control/ |

**Where numbered ladders DO exist: frameworks and marketing only.** Swarmia "five levels of coding-agent autonomy," Tessl's 5 levels, CSA "Autonomy Levels for Agentic AI" (2026-01-28), Knight Institute L1–L5, asdlc.io L1–L5, SOC-vendor L1/L2/L3 marketing (D3 Security etc.), Anthropic's "Measuring AI agent autonomy in practice" research. None is a product control. This directly supports the reply's thesis.
- https://www.swarmia.com/blog/five-levels-ai-agent-autonomy/ ; https://tessl.io/blog/the-5-levels-of-ai-agent-autonomy-learning-from-self-driving-cars/ ; https://cloudsecurityalliance.org/blog/2026/01/28/levels-of-autonomy ; https://knightcolumbia.org/content/levels-of-autonomy-for-ai-agents-1 ; https://www.anthropic.com/research/measuring-agent-autonomy ; https://d3security.com/blog/l1-ceiling-ai-soc-vendor/

## Sub-claim B evidence: nearest things to a "resolved policy view" (all fall short)

1. **Claude Code `/permissions` — the strongest near-miss.** Interactive in-session manager showing active allow/ask/deny rules **merged from all settings sources** (managed policy, CLI flags, project, local, user), current permission mode, and **which file each rule came from**; rules editable in place. Still a rule-input list: first-match deny→ask→allow precedence and glob semantics must be evaluated in your head; no "this run may do X, not Z" projection; sandbox/hook/MCP-side constraints not unified into one statement. (OFFICIAL, accessed 2026-07-03) https://code.claude.com/docs/en/permissions
2. **Codex `/status`** — prints the session's *active* sandbox mode, approval policy, and workspace roots: a resolved readout of two enums, not capabilities. Bonus for the thesis: open GitHub issues document the readout diverging from enforcement — #6667 (sandbox reported readonly despite `workspace_write` config) and #4152 (read-only mode bypassed by MCP edit tools). Rendered policy ≠ enforced policy even where a readout exists. (OFFICIAL + GH, accessed 2026-07-03) https://developers.openai.com/codex/cli/features ; https://github.com/openai/codex/issues/6667 ; https://github.com/openai/codex/issues/4152
3. **Amazon Q Developer CLI `/tools`** — renders a per-tool trust table (trusted vs per-request; only `fs_read` trusted by default) and lets you `/tools trust <tool>` in session. Flat, session-scoped, tools-only; no layering, no run projection. (OFFICIAL, accessed 2026-07-03) https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/command-line-chat-tools.html
4. **Counter-evidence actively supporting the claim (layered policy with NO resolved view):**
   - **Devin CLI**: 5 precedence layers (org/team → session grants → `.devin/config.local.json` → `.devin/config.json` → user config); org deny/ask rules silently survive even Bypass/Autonomous modes; docs describe **no viewer of the merged result**. (OFFICIAL, accessed 2026-07-03) https://docs.devin.ai/cli/reference/permissions
   - **ServiceNow**: global property `sn_aia.enable_usecase_tool_execution_mode_override` can force supervised tools to run autonomous — and a support KB exists precisely because operators couldn't see the effective mode (executions stuck in "Ongoing" due to supervised-mode config). Best single "nobody renders the resolved policy, and it hurts" citation. (OFFICIAL KB) https://support.servicenow.com/kb?id=kb_article_view&sysparm_article=KB2417915
   - **Cursor**: forum bug "Command Allowlist is silently ignored when 'Auto-Run in Sandbox' is enabled" — two controls composing invisibly. Cursor 3.6 (2026-05-29) added an "Auto-review" run mode (allowlist → sandbox → classifier subagent via `.cursor/permissions.json`), which *automates* resolution rather than rendering it; and CVE-2026-22708 showed shell builtins bypass allowlists entirely. (Forum/OFFICIAL changelog/BLOG) https://forum.cursor.com/t/command-allowlist-is-silently-ignored-when-auto-run-in-sandbox-is-enabled/152136 ; https://cursor.com/changelog/2-5 ; https://cursor.com/docs/agent/security
   - **GitHub Copilot coding agent**: firewall policy is layered — org-level "Enabled / Disabled / Let repositories decide" (changelog 2026-04-03) over repo-level allowlist customization — with no merged effective-policy rendering; and the firewall explicitly does not cover MCP servers or setup steps, so even a hypothetical resolved view would be partial. (OFFICIAL) https://github.blog/changelog/2026-04-03-organization-firewall-settings-for-copilot-cloud-agent/ ; https://docs.github.com/copilot/customizing-copilot/customizing-or-disabling-the-firewall-for-copilot-coding-agent
   - **Factory**: autonomy level × allowlist × denylist × blocklist × sandbox checks compose per-command; docs describe the hierarchy but no effective-policy display. (OFFICIAL, accessed 2026-07-03) https://docs.factory.ai/cli/user-guides/auto-run
   - **OpenHands**: `confirmation_mode` in settings.json documented as not taking effect in CLI (issue #10242) — another settings-vs-behavior gap. https://github.com/All-Hands-AI/OpenHands/issues/10242

## Bonus (feeds the reply's "different surfaces" point, all verified above)

Same abstraction, projected onto different surfaces: Codex → sandbox+approval enums; Claude Code → rule lists + modes; Factory → command risk tiers; Warp → per-action-category matrix; Kiro / Copilot CLI → binary autopilot toggle; Windsurf/Antigravity → terminal-execution policy + review artifacts; Copilot coding agent → network firewall + branch scope; ServiceNow → per-tool supervised flag; Jules → plan approval; Goose → LLM risk judge; Lindy/Zapier → per-action confirmation toggles.

## Precision warnings for the reply (things practitioners will pounce on)

1. Do not say "no one exposes autonomy levels" — Factory's control is *named* "Autonomy Level" (live) and Replit's was too (retired). Say "numbered ladder" or name Factory/Replit as the exceptions-that-prove-it.
2. Do not say "no one shows you the policy" — Claude Code `/permissions` and Codex `/status` exist. Say "no one shows the *resolved effective* policy for a run — the closest are merged rule lists (Claude Code) and mode readouts (Codex), and Codex's readout has documented divergence from enforcement."
3. Replit's ladder governed code-review depth, not permissions — useful nuance, but don't claim Replit "never shipped an autonomy control."
4. Antigravity "autonomy profiles" (Secure/Review-driven/Agent-driven/Custom) are third-party-reported only; official docs page would not render for verification. Verify in-product before citing.
5. Windsurf docs now live under Devin branding (Cognition acquisition) — cite as "Windsurf (now Devin Desktop)" to avoid staleness nitpicks.

## eve

# eve autonomy claim — verification against current version (0.19.0)

**Verified:** 2026-07-03. Sources: npm registry (`eve@0.19.0` tarball, published 2026-07-02T16:08Z), `vercel/eve` GitHub `main` (docs/ at repo root, last push 2026-07-03), shipped `CHANGELOG.md`, plus local pinned `eve@0.8.3` (`/Users/arielconti/workspace/eve-chat/node_modules/eve/`) as baseline.

## Verdict

**The claim holds in substance at 0.19.0, but one term is stale and will get corrected by pedants: `needsApproval` no longer exists.** It was renamed/redesigned to a per-tool `approval` policy in **eve 0.14.0 (published 2026-06-25)**, with *no compat adapter for the old name* ("no AI SDK 6 `needsApproval` adapter remains" — changelog entry `78ef30a`). Everything else in the claim is still true and arguably *stronger* now.

Safe phrasing: **"eve has no autonomy mode or level anywhere — autonomy is emergent from independent per-surface levers: per-tool (and per-connection) `approval` policies, tool availability, sandbox network policy, per-turn `clientContext` steering."**

## Sub-question answers

### (1) Any new mode/autonomy-level API since 0.8? — No.
- `grep -ri "autonomy\|autonomous"` across `docs/`, `src/`, `dist/` in the 0.19.0 tarball: **zero hits**.
- `defineAgent` at 0.19.0 accepts only: `model`, `reasoning`, `modelOptions`, `limits`, `experimental.workflow.world`, `outputSchema`, `build`. No mode/level/preset field. (docs/agent-config.md)
- agent-config.md explicitly keeps autonomy distributed — its "Where adjacent settings live" table routes "Per-tool approval (HITL)" to `agent/tools/*.ts`, network policy to the channel layer, sandbox controls to `agent/sandbox/`.
- Notably 0.14.0 *removed* the one mode-shaped thing that existed: `defineAgent({ experimental: { codeMode } })` and `EVE_EXPERIMENTAL_CODE_MODE` are gone; "Tools are always exposed directly to the model."

### (2) Is approval still per-tool? — Yes, but renamed and richer.
- 0.8.3 (baseline, docs bundled locally): `needsApproval: always() | once() | never() | predicate` on each tool.
- 0.14.0 (2026-06-25), changelog `78ef30a`: "Standardize authored tools and connections on an `approval` function that receives the active session context and returns AI SDK 7 approval statuses... Boolean results remain supported as aliases... and no AI SDK 6 `needsApproval` adapter remains." Schedules no longer accept approval configuration.
- 0.19.0 docs (docs/tools/human-in-the-loop.md, verified identical on GitHub main): "Gate a tool with `approval` and the helpers from `eve/tools/approval`" — `always()` / `once()` / `never()`, or a custom sync/async policy receiving `{ session, toolName, toolInput, approvedTools }` and returning `"user-approval"`, `"not-applicable"`, `"approved"`, `"denied"`, or `{ type, reason }`. Policies can key off `ctx.session.auth.current` vs `auth.initiator` (e.g., auto-approve schedule-dispatched turns, prompt humans).
- Default remains permissive per tool: "By default, omitted `approval` behaves like `never()`, so tool calls may execute without human approval."
- Same `approval` field applies per-connection for MCP and OpenAPI connections (docs/connections/mcp.mdx, docs/connections/openapi.mdx), pairable with `operations.allow` allowlists — i.e., availability and approval stay separate levers.

### (3) Any new approval-policy or permission-preset concept? — No presets; the opposite.
- No "permission", "preset", or global policy object anywhere in 0.19.0 docs. The only exported policy helpers remain per-tool `always`/`once`/`never` (docs/reference/typescript-api).
- New doc **docs/patterns/multi-tenant-approvals.md** explicitly frames `approval` as an async hook into *application-owned* policy: "Tenant policy storage remains yours... Keep those choices in application code rather than encoding a database design into the agent." eve deliberately declines to own a policy model — it never resolves or renders an effective policy.
- New doc **docs/responsible-use.md** (also in README) makes the no-preset stance explicit: "You are responsible for configuring approval policies, tool restrictions, connection scopes, route/session authorization, sandbox controls..." and "Unless you configure stricter controls, eve agents may operate with permissive settings." This is a strong primary-source quote for the thesis: the framework documents that effective autonomy is the composition of independently-configured levers, and shifts resolution of the aggregate to the developer.

### Other levers in the claim — all still present at 0.19.0
- **Sandbox scope/network policy**: `networkPolicy: "allow-all" (default) | "deny-all" | domain-map`, settable at factory, per-session in `onSession`, and mid-turn via `sandbox.setNetworkPolicy(...)`; domain allowlists + credential brokering on `vercel()`/`microsandbox()` backends (docs/sandbox.mdx).
- **Per-turn `clientContext`**: unchanged — ephemeral context riding on `send()`, "for the next model call and nothing more", never persisted (docs/guides/frontend/overview.mdx).
- **Tool availability**: authored tools dir, `disableTool` from `eve/tools`, connection tool filters / `operations.allow`.

## Autonomy-relevant changes 0.8.3 → 0.19.0 (all changelog-dated)

| Version (npm date) | Change |
|---|---|
| 0.11.0 | Denied HITL calls now emit a `rejected` `action.result` stream event (previously invisible to observability). |
| 0.11.2 | Fixed: connection-tool approval gates (`approval: always()`) now actually park for HITL. |
| 0.13.7 (2026-06-25) | Fail-closed replay: if a replayed approval callback can't be recovered, eve "requires approval by default instead of silently running the tool unguarded". |
| 0.14.0 (2026-06-25) | `needsApproval` → `approval` (AI SDK 7 statuses, auto-approve/deny with reasons, session-auth-aware policies); schedules lose approval config; experimental `codeMode` removed. |
| 0.16.1 | Approval resume hardening: unrelated follow-up text no longer synthesizes a denial. |
| by 0.19.0 | New docs: `responsible-use.md`, `patterns/multi-tenant-approvals.md`. |

Net effect: eve moved *further from* a global autonomy dial — richer per-tool/per-connection policies, safer defaults on replay, and explicit documentation that aggregate policy is the application's job.

## URLs
- Repo docs (main): https://github.com/vercel/eve/tree/main/docs — HITL: https://github.com/vercel/eve/blob/main/docs/tools/human-in-the-loop.md ; agent config: https://github.com/vercel/eve/blob/main/docs/agent-config.md ; sandbox: https://github.com/vercel/eve/blob/main/docs/sandbox.mdx ; responsible use: https://github.com/vercel/eve/blob/main/docs/responsible-use.md ; multi-tenant approvals: https://github.com/vercel/eve/blob/main/docs/patterns/multi-tenant-approvals.md
- Changelog: https://github.com/vercel/eve/blob/main/packages/eve/CHANGELOG.md
- npm: https://www.npmjs.com/package/eve (latest 0.19.0, 2026-07-02; version dates from https://registry.npmjs.org/eve)
- Local baseline: /Users/arielconti/workspace/eve-chat/node_modules/eve/ (0.8.3, published 2026-06-15); extracted 0.19.0 tarball at /private/tmp/claude-501/-Users-arielconti-workspace-eve-chat/b50b9dcc-13da-4c7b-b853-57aa6bb4fe0f/scratchpad/eve-0.19.0/package/

## One caution for the reply
Do not say eve "renders no effective policy" *implies nothing exists per-request* — eve does stream approval requests (`input.requested`) and denial events (`rejected` since 0.11.0) that channels render natively (Slack buttons, TUI prompts). What eve does **not** do is resolve or display the *aggregate* standing policy (which tools would prompt, what the sandbox can reach) in any inspectable form — that framing is accurate and supported by responsible-use.md.
