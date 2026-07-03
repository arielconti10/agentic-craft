# Mid-Run Autonomy Level Switching: Product UX Research

**Research date:** July 3, 2026  
**Framing context:** Addy Osmani’s “several rungs” idea aligns with his published [8-level autonomy ladder](https://talks.addy.ie/oreilly-codecon-march-2026/) (Steve Yegge framing) and his conductor ↔ orchestrator split in [The New SDLC With Vibe Coding](https://addyosmani.com/blog/new-sdlc-vibe-coding/) — engineers move between low-trust (approve every diff) and high-trust (async agent runs) within a single task. Products that support this well expose **instant, visible, reversible** switches; products that fail often collapse multiple dimensions into one opaque toggle.

---

## Executive Summary

| Product | Primary switch | Instant mid-run? | Visual feedback | Main risk |
|---|---|---|---|---|
| **Claude Code** | `Shift+Tab` permission cycle | Yes | Status bar (`⏵⏵ accept edits on`, `⏸ plan mode on`) | Unavailable modes still in cycle; plan→execute handoff must be explicit |
| **Cursor** | `Shift+Tab` mode + Settings Run Mode | Mode: yes; Run Mode: yes (global) | Mode picker; Run Mode in Settings | Mode state bugs; file edits bypass Run Mode; Agents Window loses per-change granularity |
| **Codex** | `/permissions`, composer selector, `/goal` | Yes (slash commands queue during runs) | Policy announcement; status line | Permission state lost on compaction/resume |
| **Factory Droid** | `Ctrl+L` autonomy; `Shift+Tab` interaction mode | Yes | Cycle indicators; approval details (`Ctrl+E`) | Two orthogonal dials confuse users; outdated video docs |
| **Replit Agent** | Was Autonomy Level → Code Optimizations → removed | Toggle mid-conversation (when it existed) | Settings dropdown | Product moved from user-tunable autonomy to always-on self-review |

**Cross-cutting pattern:** The industry converged on **`Shift+Tab` as a “gearshift”** for permission/interaction modes (Claude Code, Cursor, Qwen Code, pi-permission-modes). **True quasimodes (hold-to-supervise)** are rare in shipping coding agents; safety is handled via classifiers, sandboxes, and JIT approval instead.

---

## 1. Claude Code

**Sources:** [Permission modes docs](https://code.claude.com/docs/en/permission-modes), [Permissions config](https://code.claude.com/docs/en/permissions), [Auto mode blog](https://claude.com/blog/auto-mode), [Shift+Tab unavailable modes issue #48363](https://github.com/anthropics/claude-code/issues/48363)

### Switching mechanism

| Control | What it switches | When |
|---|---|---|
| **`Shift+Tab`** | Cycles `default` → `acceptEdits` → `plan` (+ optional `bypassPermissions`, `auto`) | Anytime mid-session |
| **Mode indicator** (VS Code / Desktop / web dropdown) | Same modes, click-to-select | Mid-session |
| **`/plan` prefix** | Single-turn plan behavior | Per prompt |
| **`--permission-mode`** | Startup default | Session start |
| **Plan approval dialog** | Exits plan → chosen execution mode | After plan completes |

**Default cycle:** `default → acceptEdits → plan`. Optional modes slot **after** `plan`: `bypassPermissions` first, `auto` last.

### Instant vs restart

- **Instant.** Docs explicitly: “You can switch modes mid-session.”
- **No restart** for `Shift+Tab`, dropdown, or plan approval.
- **`auto` entering:** Requires account/plan eligibility; first cycle to auto may show one-time opt-in (third-party docs); org can disable via `permissions.disableAutoMode`.
- **`auto` exiting:** Press `Shift+Tab` again — instant return to prior cycle position.
- **Subagent sessions:** Since v2.1.143, attached agent sessions also cycle with `Shift+Tab` (per [Developers Digest](https://www.developersdigest.tech/blog/claude-code-auto-mode-explained)).

### Visual feedback

- CLI **status bar** labels: e.g. `⏵⏵ accept edits on`, `⏸ plan mode on`.
- VS Code bottom-of-prompt **mode indicator** with human labels (“Ask before edits”, “Edit automatically”, “Plan mode”, “Auto mode”).
- Plan completion shows **explicit approve options** — not implicit mode change via chat.

### Plan approval → mode change (distinct pattern)

When a plan is ready, approval is a **mode transition gate**:

1. Approve and start in **auto mode**
2. Approve and **accept edits**
3. Approve and **review each edit manually** (→ `default`)
4. Keep planning / refine (Ultraplan)

> “Approving a plan **exits plan mode** and switches the session to the permission mode each approve option describes.” — [Claude Code docs](https://code.claude.com/docs/en/permission-modes)

This is one of the clearest **mid-task rung changes**: read-only exploration → user-selected execution autonomy in one deliberate gesture.

### Auto mode specifics

- **Middle path** between default (prompt fatigue) and bypass (dangerous).
- **Classifier** reviews each tool call before execution; blocks destructive patterns; escalates to user if repeatedly blocked.
- **Not in base cycle** until enabled/eligible; cycling to it is intended to be frictionless once enabled.
- Research preview; admins can lock off.

### Risks

| Risk | Evidence |
|---|---|
| **Mode confusion** | GitHub #48363: cycle shows `auto` on plans where it’s unavailable → error toast |
| **Approval fatigue** | Default mode prompts per tool; auto reduces but doesn’t eliminate high-stakes prompts |
| **False sense of safety** | Auto mode docs warn it “reduces permission prompts but does not guarantee safety” |
| **Chat ≠ mode** | Modes are **not** set by asking Claude in chat — reduces LLM “I’m in plan mode” lies, but users may still assume chat controls permissions |

---

## 2. Cursor

**Sources:** [Agent mode help](https://cursor.com/help/ai-features/agent.md), [Plan mode docs](https://cursor.com/docs/agent/plan-mode), [Auto-review changelog](https://cursor.com/changelog/auto-review), [permissions.json reference](https://cursor.com/docs/reference/permissions), [Mode isolation bug #151572](https://forum.cursor.com/t/critical-state-isolation-failure-ask-plan-agent-resulting-in-unintended-executions-and-cost/151572), [Agents Window criticism #156509](https://forum.cursor.com/t/cursor-3-agents-window/156509)

### Two orthogonal control planes

Cursor separates concerns more than Claude Code:

1. **Interaction mode** (Agent / Ask / Plan / Debug) — what the agent *does*
2. **Run Mode** (Auto-review / Allowlist / Run Everything) — how **Shell, MCP, Fetch** are approved

File edits are largely **outside Run Mode** — they apply directly with inline diff review in Editor mode.

### Interaction mode switching

| Control | Behavior |
|---|---|
| **`Shift+Tab`** | Cycle Agent → Ask → Plan → Debug |
| **Mode picker dropdown** | Direct selection |
| **CLI:** `/ask`, `/plan`, `--mode=` | Mid-session slash commands |

**Instant?** Yes, UI-wise.  
**Catch:** Docs state “Each mode uses its own context, so switching modes starts a fresh context window.”

### Run Mode switching

| Setting location | Modes | Scope |
|---|---|---|
| **Settings → Agents → Approvals & Execution / Run Mode** | Auto-review, Allowlist, Run Everything | **Global** until changed |
| **`.cursor/permissions.json`** | `terminalAllowlist`, `mcpAllowlist`, `autoRun` classifier instructions | Overrides IDE allowlists when Run Mode enabled |

**Instant mid-run?** Changing Run Mode in Settings applies to **subsequent tool calls** in active and future chats — no restart required. Forum guidance: Auto-run settings persist globally across chats.

**Auto-review (Cursor 3.6+, May 2026):** Three-stage pipeline for Shell/MCP/Fetch:
1. Allowlist → immediate
2. Sandbox → restricted execution
3. Classifier subagent → allow / retry / prompt

Parallel to Claude Code auto mode and OpenAI Codex auto-review.

### Visual feedback

- **Mode picker** in Agent panel (persistent)
- Run Mode only visible in **Settings** (not in chat chrome) — weaker in-session visibility
- Auto-review classifier decisions surface in agent panel (forum/changelog)
- Plan mode: saved plan files, “Build” button after review

### Known failures (mode confusion)

**Ask/Plan/Agent state isolation bug** ([#151572](https://forum.cursor.com/t/critical-state-isolation-failure-ask-plan-agent-resulting-in-unintended-executions-and-cost/151572)):
- User switches to Agent; agent responds “I’m in Ask mode”
- Workaround: **start new chat** when switching modes
- Team acknowledged as known bug

This is a textbook **Gulf of Evaluation** failure: UI shows one mode, runtime behaves as another.

### Agents Window & granularity criticism

**Core complaint** ([#156509](https://forum.cursor.com/t/cursor-3-agents-window/156509)):  
> “Cursor was good precisely because it allowed you to quickly shift granularity from ‘micromanaging an agent’ to ‘letting something run on its own’… I can only sit at one granularity level.”

| Editor Window (classic) | Agents Window (Cursor 3) |
|---|---|
| Per-turn inline diffs, Accept/Reject per hunk | Session-level **git diff** (working tree vs HEAD) |
| Plan mode full workflow | Plan mode **incomplete parity** (forum) |
| IntelliSense, extensions | Reduced IDE affordances |

Staff response ([#157588](https://forum.cursor.com/t/diff-iculty-seeing-whats-changing-agent-window/157588)): granular per-turn review “isn’t available in Agent Window yet”; internal request tracked.

**Suggested workarounds** (forum):
- Run **Editor Window in parallel** with Agents Window
- **Plan mode** before execution
- Turn off auto behaviors; use checkpoints for rollback

### Risks

| Risk | Detail |
|---|---|
| **Split mental model** | “Auto-Run” name implies all actions; actually gates **terminal/MCP only** ([#157627](https://forum.cursor.com/t/cursor-keeps-forcing-auto-accept-when-in-agent-mode/157627)) |
| **Approval fatigue ↔ over-trust pendulum** | Auto-review reduces prompts; Run Everything removes them entirely |
| **Mode vs granularity conflation** | Switching Ask→Agent doesn’t restore per-change review in Agents Window |

---

## 3. OpenAI Codex

**Sources:** [Slash commands](https://developers.openai.com/codex/cli/slash-commands), [Sandboxing](https://developers.openai.com/codex/concepts/sandboxing), [Agent approvals & security](https://developers.openai.com/codex/agent-approvals-security), [Goal pause on resume PR #20790](https://github.com/openai/codex/pull/20790), [approvals_reviewer compaction bug #23875](https://github.com/openai/codex/issues/23875)

### Switching mechanism

| Control | What it switches |
|---|---|
| **`/permissions`** | Approval preset (Auto, Read Only, custom profiles) |
| **Composer permissions selector** (app/IDE) | Default / full access / custom |
| **`/plan`** | Plan mode (implementation deferred) |
| **`/goal`, `/goal pause`, `/goal resume`, `/goal clear`** | Persistent task goal state |
| **`/approve`** | One-shot retry after auto-review denial |
| **`config.toml`** | Default `sandbox_mode`, `approval_policy`, `approvals_reviewer` |

**Mid-run:** Slash commands can be **queued** during active turns (`Tab` to queue); `/permissions` and `/goal` work mid-session.

### Instant vs restart

- **Permissions:** Instant — “Codex announces the updated policy. Future actions respect the updated approval mode.”
- **`/plan`:** Unavailable while task running (must queue).
- **Resume thread:** Paused goals **stay paused** (PR #20790, May 2026) — user prompted: “Resume goal” or “Leave paused.”
- **Compaction/resume bug:** `approvals_reviewer=auto_review` may drop after context compaction ([#23875](https://github.com/openai/codex/issues/23875)) → silent downgrade to manual approval.

### Visual feedback

- Policy change **announcement** in transcript
- **`/status`** shows model, approval policy, writable roots, token budget
- Status line configurable via `/statusline`
- Goal state viewable with `/goal`

### Goal pause/resume (autonomy *intent*, not permissions)

Goals are a **separate axis** from permissions:
- `/goal` sets persistent target for multi-step work
- `/goal pause` stops agent from pursuing goal without ending session
- On thread resume, paused goals remain paused unless user explicitly resumes

This supports **mid-run de-automation**: pause the “north star” while keeping read-only or supervised permissions.

### Risks

| Risk | Detail |
|---|---|
| **State loss on compaction** | Auto-review reviewer setting not persisted → surprise manual prompts (or opposite) |
| **Non-deterministic classifier** | Same as Cursor/Claude auto modes |
| **Two config surfaces** | CLI `/permissions` vs `config.toml` defaults — user may not know which is active |

---

## 4. Factory (Droid CLI)

**Sources:** [Autonomy Level guide](https://docs.factory.ai/cli/user-guides/auto-run), [CLI reference](https://docs.factory.ai/reference/cli-reference), [Power user shortcuts](https://docs.factory.ai/cli/user-guides/become-a-power-user)

### Two dials (explicitly documented)

Factory is the clearest product articulation of **orthogonal controls**:

| Dial | Shortcut | Values | Controls |
|---|---|---|---|
| **Autonomy Level** | **`Ctrl+L`** | Off → Low → Medium → High → Off | Risk tier of auto-approved Execute/MCP commands |
| **Interaction mode** | **`Shift+Tab`** | Auto → Spec → Mission | Plan-first vs execute vs orchestration |

**Also:** `Tab` cycles reasoning effort; `Ctrl+E` toggles approval details.

### Switching mechanism

- **`Ctrl+L` in chat input:** cycle autonomy — instant, mid-session
- **From Spec Mode approval dialog:** can set autonomy before implementation
- **`/settings`:** default autonomy for future sessions
- **`droid exec --auto {low|medium|high}`:** non-interactive only (set at start)

### Instant vs restart

- **Interactive session:** instant via `Ctrl+L` and `Shift+Tab`
- **Droid Exec:** autonomy fixed at invocation (`--auto` flag); default read-only

### Visual feedback

- Autonomy level visible in cycle (docs reference risk-tier table)
- **`Ctrl+E`:** approval details overlay
- Spec vs Auto distinction called out in docs: “Autonomy Level is **separate from** interaction mode”

### Risks

| Risk | Detail |
|---|---|
| **Two-dial confusion** | Users may think `Shift+Tab` changes autonomy (older [video walkthrough](https://docs.factory.ai/cli/getting-started/video-walkthrough) incorrectly maps `Shift+Tab` to autonomy — superseded by current docs) |
| **Blocklist vs level** | Blocklisted commands **never run** at any level — no override prompt |
| **Org caps** | Enterprise policy can cap max autonomy tier |

---

## 5. Replit Agent — Autonomy Level history

**Sources:** [Agent Modes (current)](https://docs.replit.com/references/agent/agent-modes), [Code Optimizations](https://docs.replit.com/references/agent/code-optimizations), [Feb 20, 2026 changelog](https://docs.replit.com/updates/2026/02/20/changelog), [Agent 3 updates forum](https://replit.discourse.group/t/replit-is-listening-agent-3-updates/7228), [Pro plan blog](https://replit.com/blog/pro-plan)

### Timeline

| Era | Control | User-facing levels |
|---|---|---|
| **Agent 3 launch (~2025)** | **Autonomy Selector** | Low / Medium / High / Max — “too autonomous” complaints |
| **Feb 20, 2026** | Renamed → **Code Optimizations** | On/off (formerly Low–High spectrum collapsed) |
| **Current (agent-modes doc)** | **Removed entirely** | “Agent reviews and improves its own code… no longer a setting you turn on or off” |

### Why reduced/removed?

1. **Agent 3 over-autonomy:** Forum: users said Agent “does more work than they want”; Autonomy Selector let them dial down to near-Agent-v2 behavior ([forum](https://replit.discourse.group/t/replit-is-listening-agent-3-updates/7228)).
2. **Cost/quality tradeoff:** Higher autonomy = longer runs = higher cost; Low recommended for legacy v1/v2 projects.
3. **Product simplification (2026):** Replit **removed the toggle** rather than maintain mid-session autonomy switching — self-review is now **always on**, decoupled from High effort / Turbo toggles.

### Mid-run switching (when toggle existed)

- Code Optimizations doc: setting “applies to your current conversation, affects how Agent approaches **subsequent tasks**” — mid-conversation, not mid-tool-call.
- Mode selector (Lite/Economy/Power) still switchable anytime via dropdown or `⌘+Shift+I`.

### Implication for “several rungs” UX

Replit moved **opposite** to Claude Code/Cursor/Factory: from **user-tunable autonomy ladder** → **fixed internal review**. Users who wanted hands-on control lost a rung; users who wanted reliability got less configuration burden.

---

## 6. Quasimodes & hold-to-supervise patterns

**Sources:** [Raskin Center — Quasimodes](https://raskincenter.org/rchi/core-principles/), [Smashing Magazine agentic UX patterns](https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/), [UX Collective — Autonomy Dial](https://uxdesign.cc/the-autonomy-dial-a-pattern-toolkit-for-designing-human-control-over-ai-12bfbe23ca70)

### Tog / Raskin quasimode (canonical HCI)

> “A state that can only be maintained through **continuous user action**… The shift key is the canonical quasimode.” — [Raskin Center](https://raskincenter.org/rchi/core-principles/)

- **Caps Lock = bad mode** (persistent, forgettable)
- **Shift = good quasimode** (self-evident while held)
- RCHI guideline: **eliminate modes; if not possible, convert to quasimode**

### In shipping coding agents

**No major product uses a literal hold-to-supervise quasimode** for autonomy (no “hold Shift for YOLO” in Claude Code, Cursor, Codex, Factory).

**Closest analogues:**

| Pattern | Product | Behavior |
|---|---|---|
| **Temporary elevation / JIT** | Security architecture (Permit.io, etc.) | Approve once → short-lived credential → auto-revoke |
| **`/approve` one-shot retry** | Codex | Single retry after denial — not hold, but time-bounded |
| **Plan gate** | Claude Code, Cursor, Codex | Deliberate friction before execution |
| **Spec Mode approval dialog** | Factory | Choose autonomy at plan→execute boundary |
| **Stop button** | Cursor Agent | Interrupt mid-run — termination, not quasimode |

**Design opportunity:** A quasimode (“hold to auto-approve for 30s”) would address Addy’s rung-switching without Caps-Lock-style **sticky YOLO** risk — but no leader has shipped it at scale.

---

## 7. Forum/user complaints — inability to switch granularity mid-task

### Cursor Agents Window (primary case study)

| Thread | Complaint | Product response |
|---|---|---|
| [#156509](https://forum.cursor.com/t/cursor-3-agents-window/156509) | Lost ability to shift between micromanagement and hands-off | Agents Window early; Editor still available |
| [#157226](https://forum.cursor.com/t/agents-window-is-not-good/157226) | No per-change accept/reject; Plan mode gaps | Workaround: parallel Editor Window |
| [#160856](https://forum.cursor.com/t/bring-back-per-change-apply-inline-diff-review-you-re-throwing-away-your-best-ux-advantage/160856) | Session-level Review (+1181 −413) vs per-feature Apply | Plan mode + inline diff settings suggested |
| [#157588](https://forum.cursor.com/t/diff-iculty-seeing-whats-changing-agent-window/157588) | Git-diff abstraction vs per-turn review | Internal request to port Editor Agent Review |

**User metaphor** ([#156509](https://forum.cursor.com/t/cursor-3-agents-window/156509)):  
> “A pilot who couldn’t ever take manual control in an emergency.”

This maps directly to **mode confusion + monostable gearshift** (see §8): UI doesn’t reflect which “gear” you’re in, and you can’t feel the state change.

### Claude Code

- [#48363](https://github.com/anthropics/claude-code/issues/48363): cycling into unavailable `auto` → error (false gear positions)

### Codex

- [#23875](https://github.com/openai/codex/issues/23875): auto-review silently dropped after compaction

---

## 8. HCI patterns for agentic autonomy UIs

### Mode confusion

**Definition (Leveson via Thimbleby):** “A set of mutually exclusive system behaviours” where user and system mental models diverge.

**Classic failure — monostable gearshift** ([Bolton et al., Fuzzy Mental Models](https://www.drbolton.org/publications/Fuzzy%20Mental%20Models%20%20A%20Formalism%20for%20Reasoning%20About%20Vagueness%20and%20Confusion%20in%20Human%20Machine%20Interaction.pdf)):
- Lever returns to center; driver loses tactile confirmation of drive mode
- **1.1M vehicle recall** — direct parallel to agent UIs where mode indicator doesn’t match runtime behavior (Cursor #151572)

**Norman’s Gulfs** ([Design of Everyday Things](https://dl.icdst.org/pdfs/files4/4bb8d08a9b309df7d86e62ec4056ceef.pdf)):
- **Gulf of Execution:** user can’t tell *how* to switch rungs
- **Gulf of Evaluation:** user can’t tell *which* rung is active

Agent products widen both gulfs when: (a) mode is in Settings not chrome, (b) LLM claims wrong mode, (c) review granularity changes without changing mode label.

### Gearshift / autonomy dial metaphors

| Source | Metaphor | Key idea |
|---|---|---|
| **[UX Collective — Autonomy Dial](https://uxdesign.cc/the-autonomy-dial-a-pattern-toolkit-for-designing-human-control-over-ai-12bfbe23ca70)** | Flight-deck mode selector + Copilot “Global Auto Approve” cautionary tale | Shneiderman: **two dials** — high autonomy + high human control simultaneously |
| **[Smashing Magazine](https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/)** | Autonomy Dial spectrum | Observe → Plan & Propose → Act with Confirmation → Act Autonomously |
| **Sheridan & Verplank (1978)** | 10 automation levels | Every AI feature lands somewhere on scale whether designed or not |
| **Addy / Yegge 8 levels** | [L1–L8 ladder](https://talks.addy.ie/oreilly-codecon-march-2026/) | L2 approve every change → L3 YOLO → L5 agent-first → L8 orchestration layer |

### Design patterns that support mid-rung switching

From Smashing / UX Collective lifecycle:

| Phase | Pattern | Mid-rung utility |
|---|---|---|
| Pre-action | **Intent Preview / Plan approval** | Step up autonomy only after plan accepted |
| In-action | **Explainable rationale + confidence** | Stay high-autonomy while maintaining evaluation |
| Post-action | **Action audit + undo** | Safe to drop down to lower supervision next turn |
| Anytime | **User-grantable dial** | “Grant trust, withhold it, take it back” |

---

## 9. Comparative pattern matrix

| Pattern | Claude Code | Cursor | Codex | Factory |
|---|---|---|---|---|
| **Keyboard cycle** | `Shift+Tab` permissions | `Shift+Tab` modes | `/permissions` menu | `Ctrl+L` + `Shift+Tab` |
| **Plan → execute mode pick** | ✅ Explicit approve options | ✅ Build plan | ✅ `/plan` | ✅ Spec approval dialog |
| **Classifier auto-run** | `auto` mode | Auto-review Run Mode | `approvals_reviewer=auto_review` | Risk-tier at High |
| **Pause autonomy without stop** | → `plan` or `default` | Stop + Ask mode | `/goal pause` | → Off/Low or Spec |
| **Persistent sticky YOLO** | `bypassPermissions` (gated) | Run Everything | `danger-full-access` + `never` | `--skip-permissions-unsafe` |
| **Mid-run state bugs** | Unavailable mode in cycle | Ask/Plan/Agent isolation | Reviewer dropped on compact | Video/docs drift |

---

## 10. Design recommendations (for eve / agentic UX project)

1. **Expose autonomy as a first-class, always-visible control** — status bar or composer chrome, not buried in Settings (Cursor Run Mode weakness).

2. **Separate dimensions explicitly** — Factory’s split (interaction mode vs autonomy level) matches user mental models; don’t overload one `Shift+Tab`.

3. **Plan approval as rung elevator** — Claude Code’s “approve into auto / acceptEdits / manual” is the best mid-task transition pattern observed.

4. **Per-turn review ≠ permission mode** — Cursor’s Agents Window shows you can change *execution approval* without restoring *change review granularity*; treat these as two rungs.

5. **Avoid monostable gearshifts** — if the lever returns to center (ambiguous indicator), users will not know their autonomy level; persistent labeled state + diff in evaluation channel.

6. **Consider quasimodes for emergency takeover** — “Hold to supervise” for 30–60s elevated approval satisfies Raskin, Addy’s pilot metaphor, and JIT security — largely **unclaimed whitespace**.

7. **Persist mode across compaction/resume** — Codex #23875 class of bugs destroys trust in mid-run switching.

8. **Skip unavailable rungs** — Claude #48363: never show gears the user can’t engage.

---

## Source index

| Topic | URL |
|---|---|
| Claude Code permission modes | https://code.claude.com/docs/en/permission-modes |
| Claude auto mode | https://claude.com/blog/auto-mode |
| Cursor Agent / modes | https://cursor.com/help/ai-features/agent.md |
| Cursor Plan mode | https://cursor.com/docs/agent/plan-mode |
| Cursor Auto-review | https://cursor.com/changelog/auto-review |
| Cursor permissions.json | https://cursor.com/docs/reference/permissions |
| Codex slash commands | https://developers.openai.com/codex/cli/slash-commands |
| Codex sandboxing | https://developers.openai.com/codex/concepts/sandboxing |
| Factory autonomy | https://docs.factory.ai/cli/user-guides/auto-run |
| Replit agent modes | https://docs.replit.com/references/agent/agent-modes |
| Replit Agent 3 autonomy forum | https://replit.discourse.group/t/replit-is-listening-agent-3-updates/7228 |
| Addy 8-level ladder | https://talks.addy.ie/oreilly-codecon-march-2026/ |
| Addy conductor/orchestrator | https://addyosmani.com/blog/new-sdlc-vibe-coding/ |
| Raskin quasimodes | https://raskincenter.org/rchi/core-principles/ |
| Smashing agentic UX | https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/ |
| UX Collective autonomy dial | https://uxdesign.cc/the-autonomy-dial-a-pattern-toolkit-for-designing-human-control-over-ai-12bfbe23ca70 |
| Gearshift mode confusion (PDF) | https://www.drbolton.org/publications/Fuzzy%20Mental%20Models%20%20A%20Formalism%20for%20Reasoning%20About%20Vagueness%20and%20Confusion%20in%20Human%20Machine%20Interaction.pdf |
| Cursor Agents Window criticism | https://forum.cursor.com/t/cursor-3-agents-window/156509 |
| Cursor mode isolation bug | https://forum.cursor.com/t/critical-state-isolation-failure-ask-plan-agent-resulting-in-unintended-executions-and-cost/151572 |

[REDACTED]