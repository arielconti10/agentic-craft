# Pre-dispatch autonomy UX — research snapshot (July 3, 2026)

Focus: what the user **sees at Send/dispatch** vs what **governs the run but is not surfaced** in the composer. Sources are official docs/changelogs unless noted.

---

## Cross-product comparison (Send moment)

| Product | Visible at/adjacent to Send | Hidden but governing | Pre-dispatch “receipt” |
|---|---|---|---|
| **Claude Code** | Permission mode, model, effort (Desktop); status bar mode (CLI); dispatch footer defaults (Agent View) | Allow/deny rules, sandbox, hooks, org policy, completion conditions, budget/usage | Desktop: 4 pre-send config fields; CLI: status bar shows mode; Agent View: footer shows dispatch defaults |
| **Cursor** | Mode picker, model picker, `@` context | **Run Mode** (Settings), sandbox.json, permissions.json, rules, Cloud has no Run Modes | Voice: review transcription; no autonomy summary card |
| **OpenAI Codex** | Permissions selector (IDE/App), model/reasoning switcher (IDE), Local/Worktree/Cloud (App) | config.toml profiles, rules, org requirements.toml, classifier/reviewer | Up-arrow recovers prompt; no explicit autonomy read-back |
| **Factory Droid** | Interaction mode (Auto/Spec/Mission), Autonomy Level (Off–High), model, reasoning effort | Allow/deny/blocklists, org max autonomy, sandbox, MCP policy | Spec Mode: plan approval dialog before implementation |
| **GitHub Copilot CLI** | Mode in status bar (Shift+Tab), `@` files | Tool/path/URL permissions (flags or mid-session), `--max-autopilot-continues`, org policies | Plan mode: structured plan before code; Autopilot: permission choice on first entry |
| **Windsurf/Devin Desktop** | Mode toggle (Code/Plan/Ask), agent selector (Cascade vs Devin Local) | Auto-execution level in **Settings panel** (Cascade); permissions files (Devin Local); team policies | Plan mode: plan file + “Implement”; Devin Local: permission level in input border |

---

## 1. Claude Code

Surfaces: **CLI**, **VS Code extension**, **Desktop app**, **Web** (claude.ai/code), plus **Agent View** (`claude agents`).

### 1.1 Controls at/adjacent to composer at Send

| Surface | Visible controls | Placement |
|---|---|---|
| **CLI (interactive)** | Permission mode (status bar, `Shift+Tab`); model (`Option+P` / `/model`); effort via model picker; `@` files, `+` attachments | Mode in **status bar** below prompt; custom via `/statusline` |
| **VS Code extension** | Mode indicator at **bottom of prompt box** (“Ask before edits”, “Edit automatically”, “Plan mode”, “Auto”, “Bypass permissions”) | Bottom of prompt box |
| **Desktop (Code tab)** | **Environment** (Local / Remote / SSH), **project folder**, **model dropdown**, **permission mode selector** — all before first message | Adjacent to send button; `+` for files/skills/connectors |
| **Web / mobile** | Mode dropdown next to prompt | Next to prompt box |
| **Agent View** | Dispatch input; **header** = dispatch model; **footer** = active `--permission-mode`, `--model`, `--effort` defaults | Footer below dispatch input |

Sources:
- [Choose a permission mode](https://code.claude.com/docs/en/permission-modes)
- [Desktop application](https://code.claude.com/docs/en/desktop)
- [Interactive mode](https://code.claude.com/docs/en/interactive-mode)
- [Manage multiple agents with agent view](https://code.claude.com/docs/en/agent-view)

### 1.2 Hidden but affects the run

- **Permission rules** (`permissions.allow` / `deny` / `ask`) in `.claude/settings.json` — apply in every mode; deny/ask still fire in `bypassPermissions` ([Configure permissions](https://code.claude.com/docs/en/permissions))
- **Sandbox** (Bash-only OS enforcement; `autoAllowBashIfSandboxed`) — not shown at Send ([Configure permissions](https://code.claude.com/docs/en/permissions))
- **Org/managed settings**: `disableBypassPermissionsMode`, `disableAutoMode`, restricted mode lists
- **Completion conditions** (keep-working-until-met) — configured outside composer, not read back at dispatch ([Week 20 changelog](https://code.claude.com/docs/en/whats-new/2026-w20))
- **Subagent frontmatter** (`permissionMode`, model) when dispatching named agents
- **Budget/quota**: usage ring next to model picker (Desktop) shows context % + plan usage — adjacent but not a dispatch receipt ([Desktop docs](https://code.claude.com/docs/en/desktop))

### 1.3 Receipt / read-back before dispatch

- **Desktop**: docs explicitly say configure **Environment, Project folder, Model, Permission mode** before first message — this is the closest official “read-back” ([Desktop quickstart](https://code.claude.com/docs/en/desktop-quickstart))
- **CLI**: status bar shows current mode (e.g. `⏵⏵ accept edits on`); customizable status line JSON includes model, context %, permission mode ([Status line](https://code.claude.com/docs/en/statusline))
- **Agent View**: footer shows active dispatch defaults; header shows model ([Agent view](https://code.claude.com/docs/en/agent-view))
- **No** official “You are about to run in X with sandbox Y and rules Z” confirmation card

### 1.4 Surface contradictions

| Topic | Contradiction |
|---|---|
| **Mode labels (Web cloud)** | Cloud sessions show **“Accept edits”** instead of “Ask permissions” because cloud pre-approves file edits; same `default` key, different label ([Permission modes](https://code.claude.com/docs/en/permission-modes)) |
| **Bypass on Web** | `defaultMode: "bypassPermissions"` in repo settings is **silently ignored** for cloud sessions ([Permission modes](https://code.claude.com/docs/en/permission-modes)) |
| **Agent View per-dispatch override** | Footer shows session defaults from CLI flags, but **no per-message mode override** in dispatch input (only via `claude agents --permission-mode …` at launch) ([GitHub #58380](https://github.com/anthropics/claude-code/issues/58380)) |
| **`dontAsk` mode** | CLI-only; not in Desktop mode selector ([Desktop docs](https://code.claude.com/docs/en/desktop)) |

---

## 2. Cursor

Surfaces: **Composer / Agent panel (IDE)**, **Agents Window (Cursor 3)**, **CLI**.

### 2.1 Controls at/adjacent to composer at Send

| Control | Placement | Notes |
|---|---|---|
| **Mode picker** (Agent / Ask / Plan / Debug) | Agent panel; `Shift+Tab` | Each mode = fresh context ([Agent mode help](https://cursor.com/help/ai-features/agent.md)) |
| **Model picker** | Top of chat input; `Cmd+/` | Composer 2 = single entry + **Fast** toggle in model editor ([Forum](https://forum.cursor.com/t/i-no-longer-have-certain-agents-available-for-selection/158946)) |
| **`@` context** | In input | Files, folders, docs, terminals, past chats ([Prompting agents](https://cursor.com/docs/agent/prompting)) |
| **Voice** | Mic icon | Transcription shown before send ([Prompting agents](https://cursor.com/docs/agent/prompting)) |
| **Cloud handoff** | Prefix `&` | Sends to Cloud Agent ([CLI using docs](https://cursor.com/docs/cli/using)) |
| **Agents Window** | Same chat primitives; multi-workspace sidebar | Context % moved to **hover on conversation title** ([Forum](https://forum.cursor.com/t/i-cant-see-the-agent-thinking-mode-and-context-size-in-the-agents-window/156906)) |

Sources:
- [Prompting agents](https://cursor.com/docs/agent/prompting)
- [Agents Window](https://cursor.com/docs/agent/agents-window)
- [Cursor 3.0 changelog](https://cursor.com/changelog/3-0)

### 2.2 Hidden but affects the run

- **Run Mode** (Auto-review / Allowlist / Run Everything) — configured in **Settings → Agents → Approvals & Execution**, **not in composer** ([Run Modes](https://cursor.com/docs/agent/security/run-modes))
- **sandbox.json** — network paths, extra RW paths; merged user + project ([sandbox.json reference](https://cursor.com/docs/reference/sandbox))
- **permissions.json** — terminal/MCP allowlists + `autoRun` classifier instructions ([Permissions reference](https://cursor.com/docs/reference/permissions))
- **Rules** (.cursor/rules, AGENTS.md) — injected every turn, invisible at Send
- **Cloud Agents**: Run Modes **do not apply**; no approval prompts ([Run Modes](https://cursor.com/docs/agent/security/run-modes))
- **Legacy Terminal Tool**: if enabled, old “Use Allowlist” UI reappears ([Forum](https://forum.cursor.com/t/composer-2-fast-prompting-to-approve-most-if-not-all-of-its-internal-workings/155382))

### 2.3 Receipt / read-back

- **No** autonomy summary at Send
- Voice dictation = only explicit “review before send”
- Agents Window: hover title for model + context % (partial)

### 2.4 Surface contradictions

| Topic | Contradiction |
|---|---|
| **IDE vs CLI Run Mode** | IDE has **Auto-review** classifier; CLI `cli-config.json` exposes `allowlist` / `unrestricted` only — **no Auto-review parity** ([Forum](https://forum.cursor.com/t/auto-review-run-mode/161922)) |
| **Agents Window vs Editor** | Brain icons for thinking models and inline context % **missing** in Agents Window layout ([Forum](https://forum.cursor.com/t/i-cant-see-the-agent-thinking-mode-and-context-size-in-the-agents-window/156906)) |
| **Deprecated “Ask Every Time”** | Replaced by Allowlist + empty allowlist (Cursor 3.5+); users on legacy terminal may still see old UI ([Run Modes changelog](https://cursor.com/docs/agent/security/run-modes)) |

---

## 3. OpenAI Codex

Surfaces: **CLI TUI**, **IDE extension**, **macOS/Windows app**, **Cloud**.

### 3.1 Controls at/adjacent to composer at Send

| Surface | Visible at Send |
|---|---|
| **CLI TUI** | Prompt composer; `/model`, `/permissions`; image attach; **statusline** customizable ([CLI overview](https://developers.openai.com/codex/cli)) |
| **IDE extension** | **Approval mode switcher** under input: **Chat / Agent / Agent (Full Access)**; model switcher + reasoning effort (`low`/`medium`/`high`) ([IDE features](https://developers.openai.com/codex/ide/features)) |
| **Desktop app** | **Permissions selector** under composer (Default / Full access / Custom profile); **thread target**: Local / Worktree / Cloud; branch picker for Worktree; model; IDE context toggle when synced ([App features](https://developers.openai.com/codex/app/features), [Sandboxing](https://developers.openai.com/codex/concepts/sandboxing)) |

### 3.2 Hidden but affects the run

- **`~/.codex/config.toml`**: `approval_policy`, `sandbox_mode`, `default_permissions` profiles, `approvals_reviewer`, writable roots ([Config basics](https://developers.openai.com/codex/config-basic))
- **Named permission profiles** (`:read-only`, `:workspace`, custom) — enterprise can restrict via `requirements.toml` ([Permissions](https://developers.openai.com/codex/permissions))
- **Rules** (command prefix allow/prompt/forbid outside sandbox)
- **Web search mode** (cached vs live) — depends on sandbox config, not shown in composer ([IDE features](https://developers.openai.com/codex/ide/features))
- **Stopping condition**: none explicit at Send; thread automations are post-hoc

### 3.3 Receipt / read-back

- **No** “dispatch receipt” summarizing approval + sandbox
- **Prompt recovery**: up-arrow in composer after wrong Local/Worktree/Cloud target ([App troubleshooting](https://developers.openai.com/codex/app/features))
- **Plan mode** (`/plan` in CLI): review steps before execution (mid-session, not strictly pre-first-send)

### 3.4 Surface contradictions

| Topic | Contradiction |
|---|---|
| **IDE vs CLI granularity** | IDE exposes **3 coarse modes**; CLI `/permissions` exposes full **approval_policy × sandbox_mode** matrix ([Sandboxing](https://developers.openai.com/codex/concepts/sandboxing)) |
| **“Agent (Full Access)” vs config** | IDE label maps to `danger-full-access` + `never` approvals — stronger than IDE copy suggests ([Sandboxing](https://developers.openai.com/codex/concepts/sandboxing)) |
| **App vs CLI version skew** | App and CLI may run different agent versions; experimental features land CLI-first ([App FAQ](https://developers.openai.com/codex/app/features)) |
| **Windows sandbox** | App docs: set **Default permissions** in composer before send on Windows ([App features](https://developers.openai.com/codex/app/features)) |

---

## 4. Factory Droid

Surfaces: **Interactive CLI (`droid`)**, **Factory App**, **headless (`droid exec`)**.

### 4.1 Controls at/adjacent to composer at Send

| Control | How to set | Visible? |
|---|---|---|
| **Interaction mode** (Auto / Spec / Mission) | `Shift+Tab` | Mode affects whether agent executes vs plans |
| **Autonomy Level** (Off / Low / Medium / High) | `Ctrl+L` (current docs) | Risk threshold for auto-approval |
| **Model** | `Ctrl+N` or `-m` flag | Cycled while typing |
| **Reasoning effort** | `Tab` | low → medium → high → off |
| **`@` file attach**, images (`Ctrl+V`) | In input | ([Power user guide](https://docs.factory.ai/cli/user-guides/become-a-power-user)) |

Sources:
- [Autonomy Level](https://docs.factory.ai/cli/user-guides/auto-run)
- [CLI Reference](https://docs.factory.ai/reference/cli-reference)

**Note:** Older [video walkthrough](https://docs.factory.ai/cli/getting-started/video-walkthrough) says `Shift+Tab` cycles autonomy levels; current docs assign **`Ctrl+L`** to autonomy and **`Shift+Tab`** to interaction mode — treat as doc drift.

### 4.2 Hidden but affects the run

- **commandAllowlist / commandDenylist / commandBlocklist** in settings — blocklist cannot be bypassed at any autonomy level ([Autonomy Level](https://docs.factory.ai/cli/user-guides/auto-run))
- **Org `maxAutonomyLevel`** — caps High/Medium in UI ([Settings](https://docs.factory.ai/cli/configuration/settings))
- **Sandbox checks** — can prompt separately from autonomy level
- **MCP tool policy** — default autonomy auto-approves most tools; MCP may still prompt ([SDK docs](https://github.com/Factory-AI/droid-sdk-typescript))
- **`droid exec`**: read-only by default; `--auto low|medium|high` required for writes ([Droid Exec](https://docs.factory.ai/cli/droid-exec/overview))

### 4.3 Receipt / read-back

- **Spec Mode**: after planning, approval dialog offers **Proceed with implementation** and optional autonomy level for implementation phase — clearest pre-execution receipt in this product ([Autonomy Level](https://docs.factory.ai/cli/user-guides/auto-run))
- **No** composer summary of effective allow/deny lists at Send

### 4.4 Factory App

Docs state Factory App sessions use **same Auto/Spec + Autonomy Level controls as CLI** ([Autonomy Level](https://docs.factory.ai/cli/user-guides/auto-run)) — no separate public UI spec found.

---

## 5. GitHub Copilot CLI — Autopilot mode

Surface: **interactive TUI** (primary); programmatic `-p`; **remote** (web/mobile steering).

### 5.1 Controls at/adjacent to composer at Send

| Control | At Send? | How |
|---|---|---|
| **Mode** (interactive / plan / autopilot) | **Status bar** via `Shift+Tab` | Must enable `/experimental on` for Autopilot to appear in cycle ([Autopilot docs](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot)) |
| **Model** | `/model` slash command | Not a persistent composer dropdown in getting-started flow |
| **`@` file mentions** | In input | ([Getting started](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-getting-started)) |
| **Shell mode** | `!` prefix | Bypasses Copilot ([Command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)) |

### 5.2 Hidden but affects the run

- **Permissions bundle**: `--allow-all` / `--yolo` = all tools + paths + URLs ([Configure Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli))
- **Per-tool flags**: `--allow-tool`, `--deny-tool`, `--allow-all-tools`, etc.
- **`--max-autopilot-continues`** — stopping budget; default unlimited ([Autopilot docs](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot))
- **Trust folder prompt** on first run — one-time, not repeated at each Send
- **Remote sessions**: same permission settings apply on web ([Changelog](https://github.blog/changelog/2026-04-13-remote-control-cli-sessions-on-web-and-mobile-in-public-preview/))

### 5.3 Receipt / read-back

- **Entering Autopilot without `--allow-all`**: message prompts **three-way permission choice** (full vs limited) — only on mode entry, not every Send ([Autopilot docs](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot))
- **Plan mode**: structured plan before implementation ([About Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli))
- **`/statusline` / `/footer`**: configurable status items ([Command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference))
- **No** read-back of effective tool/path/URL allowlists at Send

### 5.4 Autopilot vs `/delegate`

- **Autopilot** = local, continuous, needs `--allow-all` for best results
- **`/delegate` or `&`** = cloud agent, separate surface ([Delegate tasks](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/delegate-tasks-to-cca))

---

## 6. Windsurf / Devin Desktop — Cascade & Devin Local

**As of July 3, 2026:** Cascade is **EOL** (hard cutoff July 1, 2026 per [Devin blog](https://devin.ai/blog/windsurf-is-now-devin-desktop)); Devin Local is the successor. Docs still describe Cascade for migration context.

### 6.1 Controls at/adjacent to composer at Send

#### Cascade (legacy)

| Control | Placement |
|---|---|
| **Mode toggle**: Code / Plan / Ask (formerly Write/Chat) | **Below Cascade input**; `Cmd/Ctrl+.` ([Cascade Modes](https://docs.windsurf.com/windsurf/cascade/modes)) |
| **Auto-execution level** (Disabled / Allowlist / Auto / Turbo) | **Windsurf Settings panel, bottom-right of editor** — **not in composer** ([Terminal docs](https://docs.windsurf.com/windsurf/terminal)) |
| **`@` mentions**, queued messages | In input |

#### Devin Local (current)

| Control | Placement |
|---|---|
| **Unified mode selector**: Code, Ask, Plan, Accept Edits, Bypass Permissions | Consolidated picker in Windsurf/Devin Desktop ([Changelog](https://docs.devin.ai/cli/changelog/stable)) |
| **Agent selector**: Cascade vs Devin Local | Bottom-right when starting conversation ([Devin Local](https://docs.devin.ai/desktop/devin-local)) |
| **Active permission level** | **Top border of input box** ([Changelog](https://docs.devin.ai/cli/changelog/stable)) |
| **`Shift+Tab`** | Cycles permission modes (Devin CLI parity) ([Keyboard shortcuts](https://docs.devin.ai/cli/reference/keyboard-shortcuts)) |

### 6.2 Hidden but affects the run

**Cascade:**
- Terminal allow/deny lists (user + team) ([Terminal](https://docs.windsurf.com/windsurf/terminal))
- Team max auto-execution level
- Premium-model requirement for “Auto” execution level

**Devin Local:**
- `.devin/config.json` permission rules (allow/deny/ask by Read/Write/Exec/Fetch/MCP) ([Permissions](https://docs.devin.ai/cli/reference/permissions))
- **Autonomous mode** only with `--sandbox`; file edits via `edit`/`write` still prompt even in Autonomous ([Permissions](https://docs.devin.ai/cli/reference/permissions))
- Enterprise: sandbox enforcement, domain filtering, org deny rules override user config ([Team settings](https://docs.devin.ai/cli/enterprise/team-settings))
- Legacy “Auto Run Terminal Commands” team setting still enforced as fallback ([Devin Local](https://docs.devin.ai/desktop/devin-local))

### 6.3 Receipt / read-back

- **Plan mode**: plan artifact + **“Implement”** button before Code mode execution ([Cascade Modes](https://docs.windsurf.com/windsurf/cascade/modes))
- **Devin Local**: permission level in input top border (passive indicator, not a confirmation)
- **No** summary of effective permission rules or sandbox domains at Send

### 6.4 Surface contradictions

| Topic | Contradiction |
|---|---|
| **Cascade vs Devin Local autonomy model** | Cascade = **4-level auto-execution in Settings**; Devin Local = **permission modes + rules files** — different mental models ([Terminal](https://docs.windsurf.com/windsurf/terminal) vs [Devin Local](https://docs.devin.ai/desktop/devin-local)) |
| **JetBrains Cascade** | Docs list **3** auto-execution levels (Off/Auto/Turbo), desktop docs list **4** (adds Allowlist Only) ([Cascade overview plugins](https://docs.windsurf.com/plugins/cascade/cascade-overview) vs [Terminal](https://docs.windsurf.com/windsurf/terminal)) |
| **Agent Command Center vs composer** | Devin Desktop pivots to **Kanban dispatch** for multi-agent management — pre-dispatch controls may live outside the inline composer ([Devin blog](https://devin.ai/blog/windsurf-is-now-devin-desktop)) |
| **Devin CLI vs Desktop** | Shared harness but Desktop changelog notes **unified mode selector** in Windsurf while CLI documents separate agent profile + permission mode ([Changelog](https://docs.devin.ai/cli/changelog/stable)) |

---

## Design patterns observed

### What tends to be **visible** at Send
1. **Coarse autonomy preset** (permission mode, approval mode, interaction mode)
2. **Model** (+ sometimes reasoning effort)
3. **Placement** (local / cloud / worktree / environment) — strongest in Claude Desktop & Codex App
4. **Agent/task mode** (Code vs Plan vs Ask)

### What tends to be **hidden** at Send
1. **Run Mode / approval policy** (often in Settings: Cursor, Cascade auto-execution)
2. **Allow/deny/blocklists** and org policy overlays
3. **Sandbox boundaries** (network, writable roots) — configured in files, not composer
4. **Stopping conditions** (autopilot continues, completion conditions, max continues)
5. **Rules / AGENTS.md / skills** injection
6. **Budget/rate limits** (rarely surfaced at dispatch)

### Receipt patterns
- **Strongest**: Factory Spec approval, Windsurf/Copilot/Devin **Plan → Implement**, Claude Desktop **four-field pre-session config**
- **Weakest**: Cursor, Codex CLI, Copilot Autopilot (status bar only)
- **None** product shows a unified “effective policy card” merging mode + sandbox + lists + org caps at Send

---

## Key source index

| Product | Primary docs |
|---|---|
| Claude Code | [Permission modes](https://code.claude.com/docs/en/permission-modes), [Desktop](https://code.claude.com/docs/en/desktop), [Permissions](https://code.claude.com/docs/en/permissions), [Agent view](https://code.claude.com/docs/en/agent-view) |
| Cursor | [Run Modes](https://cursor.com/docs/agent/security/run-modes), [Prompting](https://cursor.com/docs/agent/prompting), [Permissions.json](https://cursor.com/docs/reference/permissions), [Agents Window](https://cursor.com/docs/agent/agents-window) |
| Codex | [IDE features](https://developers.openai.com/codex/ide/features), [App features](https://developers.openai.com/codex/app/features), [Sandboxing](https://developers.openai.com/codex/concepts/sandboxing), [Agent approvals](https://developers.openai.com/codex/agent-approvals-security) |
| Factory Droid | [Autonomy Level](https://docs.factory.ai/cli/user-guides/auto-run), [CLI Reference](https://docs.factory.ai/reference/cli-reference), [Settings](https://docs.factory.ai/cli/configuration/settings) |
| Copilot CLI | [Autopilot](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot), [Configure CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli), [Command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| Devin Desktop | [Cascade modes](https://docs.windsurf.com/windsurf/cascade/modes), [Terminal/auto-exec](https://docs.windsurf.com/windsurf/terminal), [Devin Local](https://docs.devin.ai/desktop/devin-local), [Permissions](https://docs.devin.ai/cli/reference/permissions), [Rebrand blog](https://devin.ai/blog/windsurf-is-now-devin-desktop) |

---

**Research gap:** Official screenshot assets were not consistently available in fetched docs; descriptions above are from doc text and changelogs. For UX audit mockups, recommend capturing live composer states per product — especially Cursor Run Mode (Settings-only) vs composer mode picker, and Codex IDE 3-mode switcher vs CLI `/permissions` granularity.

[REDACTED]