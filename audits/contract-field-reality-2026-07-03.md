# The run contract, mapped to reality (2026-07-03)

Where each of the eight contract fields (Osmani, "Agentic Autonomy Levels") actually lives in Claude Code, Codex, Cursor, eve, Devin.

---

# Where the run contract actually lives — Claude Code / Codex / Cursor (+ eve/Devin contrast)

Synthesized 2026-07-03 from live-doc field maps (all sources fetched 2026-07-03 unless noted).

---

## 1. The matrix

| Field | Claude Code | Codex | Cursor | eve 0.19 / Devin (contrast) |
|---|---|---|---|---|
| **GOAL** | **AUTHORED** (fused w/ stop) — `/goal <condition>` (session-scoped, 4k chars, [docs](https://code.claude.com/docs/en/goal)); plan mode plan (Claude-authored, `Ctrl+G` editable); `SPEC.md` (convention only) | **AUTHORED** in Goal mode only — `/goal` (4k chars, composer-editable since CLI 0.142.0, [docs](https://developers.openai.com/codex/use-cases/follow-goals)); elsewhere = first prompt | **IMPLICIT** — composer prompt; nearest: Plan Mode Markdown plan (a plan, not a goal, [docs](https://cursor.com/docs/agent/plan-mode)); Automations prompt field | eve: partial — `outputSchema` types the shape, not the outcome. Devin: **named field** — Playbook "Specifications" |
| **SCOPE** | **AUTHORED, shredded ≥5** — `--add-dir`/`additionalDirectories`; `permissions.allow/ask/deny`; `--tools`; subagent `tools:`/`disallowedTools:`; `.claude/rules/*.md` `paths:` frontmatter | **SPLIT** — `config.toml` `sandbox_mode`/`writable_roots`/`network_access`; Local/Worktree/Cloud picker; cloud env settings; technique scope = AGENTS.md prose (implicit) | **AUTHORED, shredded ≥4** — `.cursor/rules/*.mdc` `globs`; nested `AGENTS.md`; `.cursorignore`; `permissions.json`; env/worktree picker | eve: first-class, distributed (`operations.allow`, `networkPolicy`). Devin: Knowledge items w/ trigger + repo pinning |
| **NON-GOALS** | **MISSING** — docs instruct smuggling into `/goal` prose ("no other test file is modified") or CLAUDE.md ("Never push directly to main"); auto-mode boundaries lost to compaction | **CONVENTION** (Goal mode only) — docs carve out "constraints and non-goals" inside the goal blob; never a field, never rendered | **MISSING** — fragments: "Never…" rules lines; `block_instructions` (action-level, not objective-level); plan-todo deletion | eve: absent. Devin: **the exception** — Playbook "Forbidden Actions" named field (prose, unenforced) |
| **TOOLS & PERMISSIONS** | **AUTHORED — the one full field** — `permissions.allow/ask/deny` in 5 settings layers; `/permissions` w/ per-file source attribution; 6 modes; sandbox; subagent `permissionMode` ([docs](https://code.claude.com/docs/en/permissions)) | **AUTHORED, ≥6 layers, undocumented precedence** — `approval_policy` (incl. `granular`), `sandbox_mode`, `[permissions.<name>]` profiles, `/permissions` picker, IDE mode selector, `--yolo` | **AUTHORED, 3 disjoint planes** — Run Mode (Settings); `permissions.json`/`sandbox.json`; hooks deny; per-Automation tool grants | eve: first-class approval API (`always/once/never`/custom policy). Devin: org-plane, outside the Playbook |
| **STOPPING CONDITION** | **AUTHORED, 3 mechanisms** — `/goal` (Haiku-evaluated); Stop hook (`{"decision":"block"}`, system-overridden after 8 blocks); `maxTurns`/`--max-turns` (print-only) ([hooks](https://code.claude.com/docs/en/hooks)) | **PROSE ONLY** — "without stopping until [verifiable end state]" inside `/goal` text; no structured field, no iteration limit anywhere | **MISSING (DIY)** — `stop` hook + `followup_message` + `MAX_ITERATIONS = 5` pattern ([hooks](https://cursor.com/docs/hooks)); Stop button; prose "quality bar" in Automations | eve: absent — only `SESSION_TOKEN_LIMIT_REACHED`. Devin: only enforced stop = ACU limit (budget, not goal) |
| **EVIDENCE** | **IMPLICIT convention** — "show evidence rather than asserting success" ([best-practices](https://code.claude.com/docs/en/best-practices)); one enforcement: Stop hook; `/verify`, `/run`, `/code-review` as generators | **SPLIT** — requirement: goal prose + `## Review guidelines` in AGENTS.md (only named carve-out); artifacts: cloud task logs/diffs/screenshots, review pane, Bugbot-style PR reviews — after only | **IMPLICIT** — `Cursor Bugbot` CI check (`success/neutral/failure`); `.cursor/BUGBOT.md` standards; Review → Find Issues; browser screenshots — never demanded before | eve: dev-time `defineEval` only. Devin: Playbook Procedure convention; "double-check responses" |
| **ESCALATION** | **SPLIT** — WHEN authored (`permissions.ask`, `PermissionRequest` hook, `Notification` matchers); WHO hardcoded = terminal owner; AskUserQuestion auto-resolves at 60s | **SPLIT** — triggers richly authored (`granular` categories, `[auto_review].policy` markdown, `/approve` override); recipient hardcoded (you/reviewer-agent/org) | **IMPLICIT** — Auto-review classifier (~7% interruption); iOS push "needs input"; only authored route = admin spend alerts to Slack/email | eve: mechanism first-class (`input.requested`), target = whoever's on the channel. Devin: "Required from User" named upfront; mid-run informal chat |
| **BUDGET** | **AUTHORED where you aren't** — `--max-budget-usd`/`--max-turns` print-mode ONLY; subagent `maxTurns`; `/usage-credits` monthly; Console org limits; interactive = `/usage` readout, no cap | **AUTHORED, buried** — `features.rollout_budget.limit_tokens` (config, no UI — most contract-like budget anywhere); `agents.max_threads`/`job_max_runtime_seconds`; `--attempts 1–4`; platform credits | **AUTHORED, wrong granularity** — Dashboard Spending tab monthly limits + member overrides; nothing per-run; DIY `MAX_ITERATIONS` hook is the docs' own workaround | eve: `limits.maxInputTokensPerSession`/`maxSubagentDepth` first-class. Devin: **strongest anywhere** — ACU priced unit, per-session limits, invocation caps |

---

## 2. The shredded-contract narrative

**One field is real; the rest are prose.** Across all three products, TOOLS & PERMISSIONS is the only Osmani field with dedicated syntax, dedicated files, and dedicated UI — Claude Code's `permissions.allow/ask/deny` across five settings layers with a `/permissions` dialog that even attributes each rule to its source file; Codex's `approval_policy` with granular categories; Cursor's Run Modes plus `permissions.json`. The industry has built the capability clause of the contract to production quality and left the other seven as writing advice. Even here there's rot: none of the three renders the *resolved* policy, Claude Code silently drops broad allow rules on entering auto mode, and Codex's `/status` is documented to diverge from actual enforcement (GH #6667/#4152).

**Goal, non-goals, and stopping condition live undifferentiated in one text blob.** Both Claude Code and Codex ship a `/goal` command with an identical 4,000-char free-text limit, and both products' docs coach users to pack GOAL + STOPPING CONDITION + NON-GOALS + even a prose BUDGET ("or stop after 20 turns") into that single string. Codex's cookbook makes it explicit: its six-component goal-writing framework (outcome, verification surface, constraints, boundaries, iteration policy, blocked stop conditions) is Osmani's contract restated as prompt-engineering tips for one text field. Cursor doesn't even have the blob — its goal is the first composer message, which scrolls away. Below the blob sits the standing-prose layer: CLAUDE.md / AGENTS.md / `.cursor/rules`, where scope conventions and "never do X" lines live as advisory context that the products themselves say is not enforced ("CLAUDE.md instructions… are not a hard enforcement layer").

**Non-goals is missing everywhere that ships to developers.** No file, field, flag, or pane in Claude Code, Codex, or Cursor holds "explicitly not part of the objective." Claude Code's docs actively instruct smuggling it into the goal string or CLAUDE.md, and its auto-mode conversational boundaries ("don't push") can be silently lost to context compaction — the product garbage-collects your non-goals. The two damning details: Anthropic writes a non-goals clause *for its own* `/loop` automation prompt ("Claude does not start new initiatives outside that scope") while giving users no equivalent slot; and the only shipping product with non-goals as a literal named field is Devin's Playbook "Forbidden Actions" — which is unenforced prompt text. Evidence-required is the same story one notch better: heavily documented as convention ("show evidence rather than asserting success"), abundant *artifacts after the fact* (Bugbot CI checks, Codex cloud-task screenshots, review panes), but zero pre-run "this run must produce proof X" surface anywhere. Escalation is half-built in all three: triggers are authorable (ask rules, `[auto_review].policy`, classifier steering), but the recipient is hardcoded to "whoever owns this session" — you cannot write "if X, page Y" in any of them.

**Budget is inversely available to supervision.** Claude Code's only hard caps (`--max-budget-usd`, `--max-turns`) exist exclusively in print mode — where no human is watching — while interactive sessions get after-the-fact `/usage` readouts. Codex's one genuine token budget (`features.rollout_budget`) is a feature-flagged config key with no UI. Cursor's budgets are real but live at account-month granularity in a SaaS dashboard, a different app from where runs dispatch; its docs' own per-run workaround is a hand-written `MAX_ITERATIONS = 5` stop hook. Nobody lets you attach a budget to a run at the moment you dispatch it.

**The punchline is visibility, and the trend is backwards.** Cursor's eight fields live in at least seven containers (composer message, home-dir plan file, repo dotfiles, IDE Settings, `hooks.json`, SaaS dashboard, GitHub PR check) with three owners (dev, repo, org admin); Claude Code's scope alone is shredded across five artifacts with no composed view; Codex's permissions span six layers with undocumented precedence. No product renders the assembled contract before a run starts — and Claude Code is actively removing UI (the `/agents` wizard was deleted in v2.1.198 in favor of editing markdown; `/hooks` is read-only). Meanwhile the platforms hold a meta-contract above yours: Stop hooks force-released after 8 blocks, escalation dialogs auto-resolving at 60 seconds, `/loop` tasks expiring at 7 days. The contract exists — authored in N files, judged by a Haiku evaluator, rendered nowhere.

---

## 3. UI annotation strings (chips for the contract panel)

Format per cell: `status` — chip text (≤9 words).

### GOAL
- **Claude Code:** `authored` — `/goal` condition string; live `◎` status indicator
- **Codex:** `authored` — `/goal` objective, Goal mode only; else prompt
- **Cursor:** `implicit` — composer prompt; Plan Mode plan is nearest
- eve: `implicit` — `outputSchema` types shape only · Devin: `authored` — Playbook "Specifications"

### SCOPE
- **Claude Code:** `authored` — `--add-dir`, permission rules, rules-file `paths:` frontmatter
- **Codex:** `authored` — `config.toml` sandbox keys; Local/Worktree/Cloud picker
- **Cursor:** `authored` — `.mdc` globs, `.cursorignore`, `permissions.json`, worktree picker
- eve: `authored` — `operations.allow` + `networkPolicy` · Devin: `authored` — Knowledge triggers + pinning

### NON-GOALS
- **Claude Code:** `missing` — prose smuggled into `/goal` or CLAUDE.md
- **Codex:** `implicit` — "constraints and non-goals" inside goal blob
- **Cursor:** `missing` — "Never…" rules lines; `block_instructions` fragments
- eve: `missing` · Devin: `authored` — Playbook "Forbidden Actions" (unenforced)

### TOOLS & PERMISSIONS
- **Claude Code:** `authored` — `settings.json` allow/ask/deny; `/permissions` dialog
- **Codex:** `authored` — `config.toml approval_policy`; three incompatible pickers
- **Cursor:** `authored` — Run Mode + `permissions.json` + `sandbox.json`
- eve: `authored` — per-tool `approval` policy API · Devin: `implicit` — org plane, not per-run

### STOPPING CONDITION
- **Claude Code:** `authored` — `/goal` (Haiku-judged); Stop hook; `--max-turns`
- **Codex:** `implicit` — "until [verifiable end state]" prose in goal
- **Cursor:** `missing` — DIY `stop` hook with `MAX_ITERATIONS`
- eve: `missing` — token limit is the only stop · Devin: `implicit` — ACU cap stops, spec doesn't

### EVIDENCE
- **Claude Code:** `implicit` — convention + Stop hook; `/verify`, `/run` generators
- **Codex:** `implicit` — `## Review guidelines`; artifacts after, on task page
- **Cursor:** `implicit` — Bugbot CI check; `BUGBOT.md` sets standards
- eve: `implicit` — `defineEval` dev-time only · Devin: `implicit` — Procedure delivery steps

### ESCALATION
- **Claude Code:** `implicit` — ask rules + Notification hooks; target hardcoded
- **Codex:** `implicit` — `[auto_review].policy` markdown; `/approve` override
- **Cursor:** `implicit` — Auto-review interrupts; iOS push; spend alerts only
- eve: `implicit` — `input.requested` to channel · Devin: `authored` — "Required from User" section

### BUDGET
- **Claude Code:** `authored` — `--max-budget-usd`, headless only; `/usage` readout
- **Codex:** `authored` — `rollout_budget.limit_tokens` config key, no UI
- **Cursor:** `authored` — dashboard monthly spend limits; never per-run
- eve: `authored` — `limits.maxInputTokensPerSession` · Devin: `authored` — ACU metered, priced, capped

### Status grid (one word per cell)

| Field | Claude Code | Codex | Cursor | eve | Devin |
|---|---|---|---|---|---|
| Goal | authored | authored | implicit | implicit | authored |
| Scope | authored | authored | authored | authored | authored |
| Non-goals | missing | implicit | missing | missing | authored |
| Tools & permissions | authored | authored | authored | authored | implicit |
| Stopping condition | authored | implicit | missing | missing | implicit |
| Evidence | implicit | implicit | implicit | implicit | implicit |
| Escalation | implicit | implicit | implicit | implicit | authored |
| Budget | authored | authored | authored | authored | authored |

---

## 4. Surprises for the visualizer's design

1. **One product does render a contract-like pre-run preview — Cursor Plan Mode.** The plan is a user-editable Markdown artifact reviewed *before* execution (edit, add/remove to-dos, then "build from your plan") — the closest shipping thing to Osmani's "contract preceding the run" ([plan-mode](https://cursor.com/docs/agent/plan-mode)). But it's a *plan* (activity steps), not a *contract* (outcome/bounds), and deleting a to-do is the only way to express a non-goal — by unlabeled subtraction. The visualizer can position itself as "Plan Mode for the contract, not the steps."

2. **Convergent evolution on the blob: both `/goal` commands cap at exactly 4,000 characters.** Claude Code and Codex independently landed on one free-text field with the same limit as the container for four contract fields. The visualizer's structured panel is literally decomposing this blob.

3. **Claude Code's `/goal` status view is the richest during-run contract rendering that exists** — condition, duration, turns evaluated, token spend, and the evaluator's most recent reason ([goal docs](https://code.claude.com/docs/en/goal)). No product renders anything *before* the run; nothing renders scope/permissions/budget *composed*. If the visualizer shows a live contract panel during a run, it has exactly one partial precedent.

4. **The platform meta-contract is a design consideration the panel probably doesn't show:** the system caps *your* stopping condition (Stop hooks force-released after 8 blocks), expires your escalations (AskUserQuestion auto-resolves at 60s; permission prompts never do), and expires your automations (`/loop` 7-day cap). A truthful contract panel may need a "system overrides" row.

5. **Budget inversion is universal and worth visualizing:** hard caps exist only where no human watches (Claude Code print-mode flags, Codex config keys, Cursor's admin dashboard); interactive dispatch surfaces offer zero budget authoring in all three products. A per-run budget field in the composer would be genuinely novel in this cohort.

6. **Vendors author for themselves the fields they deny users:** Anthropic writes non-goals into its own `/loop` maintenance prompt; Codex ships a default auto-review escalation policy as editable markdown (`core/src/guardian/policy.md`). The concepts are implemented — just not exposed as user-facing contract fields.

7. **Direction of travel is away from UI, toward files:** Claude Code removed its `/agents` wizard (v2.1.198) and keeps `/hooks` read-only; Codex's permission profiles and rollout budget are config-only; Cursor's contract fragments span seven containers and three owners. The visualizer's "gather and render" thesis runs *against* the current product trend — which is the argument for it.

8. **Two extremes bracket the design space** (eve/Devin): eve enforces only what a framework can check (tokens, approvals, depth) and refuses to represent the semantic fields; Devin's Playbook names five of eight fields as prose sections but enforces only the meter (ACU). Contract-as-ungathered-code vs. contract-as-unenforced-form — the visualizer's target is the empty quadrant: gathered *and* checked, per run.

---

# Appendix: per-product field maps

## cc

# Claude Code — where the eight run-contract fields actually live (verified 2026-07-03)

All doc pages fetched live from code.claude.com on 2026-07-03 (docs current as of v2.1.199). Permission-mode and resolved-policy findings inherited from `/Users/arielconti/workspace/agentic-craft/audits/autonomy-ui-verification-2026-07-03.md` and not re-established here. Strictness rule applied: AUTHORED only where the product carves out a surface for *that specific concern*.

**Headline for the visualizer**: Claude Code has all eight fields, but only TOOLS & PERMISSIONS gets a dedicated, structured, inspectable surface. GOAL and STOPPING CONDITION are fused into one prose string (`/goal`). BUDGET is authorable only in headless mode or admin consoles — never in an interactive session. NON-GOALS has no surface at all; the docs tell you to smuggle it into other fields as prose. EVIDENCE is a documented *convention* with exactly one enforcement mechanism (Stop hook), which the system itself overrides after 8 blocks.

---

## 1. GOAL

- **STATUS: AUTHORED — but fused with the stopping condition.** The only surface where a user deliberately writes "the outcome being pursued" is the `/goal` command, and the product calls what you write there a **"completion condition"**, not a goal. Everywhere else the goal is IMPLICIT: it's the prompt, which scrolls away.
- **WHERE:** `/goal <condition>` slash command (session-scoped, one per session, max 4,000 chars). Docs: "The `/goal` command sets a completion condition and Claude keeps working toward it without you prompting each step." Under the hood it is "a wrapper around a session-scoped prompt-based Stop hook." Secondary surface: plan mode — the plan is a goal articulation, but it's *Claude-authored*, user-approved; the user can edit it directly (`Ctrl+G` "opens the plan in your text editor"). Convention-only surface: docs recommend interviewing via AskUserQuestion and writing "a complete spec to SPEC.md" — a file the product neither names nor tracks.
- **WHEN VISIBLE:** During — a live `◎ /goal active` indicator "shows how long the goal has been running"; bare `/goal` shows the condition, duration, turns evaluated, token spend, and "The evaluator's most recent reason." After — "If no goal is active but one was achieved earlier in the session, the status shows the achieved condition along with its duration, turn count, and token spend." Before — never; there is no pre-run goal review step (setting a goal "starts a turn immediately, with the condition itself as the directive"). Goals survive `--resume` but counters reset.
- **Example:** `/goal all tests in test/auth pass and the lint step is clean` — or headless: `claude -p "/goal CHANGELOG.md has an entry for every PR merged this week"`
- **Evidence:** https://code.claude.com/docs/en/goal (fetched 2026-07-03); https://code.claude.com/docs/en/best-practices (SPEC.md interview pattern, fetched 2026-07-03)

## 2. SCOPE

- **STATUS: AUTHORED — but shredded across ≥5 artifacts with no unifying object.** Each half of Osmani's definition lands on a different surface: *domain* scope (where we operate) is directory grants; *technique* scope (what's allowed) is tool/permission rules. No artifact holds both.
- **WHERE:**
  - Filesystem domain: `--add-dir` flag / `permissions.additionalDirectories` in `settings.json` ("Add additional working directories for Claude to read and edit files"); sandbox settings (`sandbox.enabled`, per audit).
  - Technique/tool scope: `permissions.allow`/`ask`/`deny` rule arrays; `--tools "Bash,Edit,Read"` ("Restrict which built-in tools Claude can use"); `--allowedTools` / `--disallowedTools`.
  - Per-worker scope: subagent frontmatter in `.claude/agents/*.md` — `tools:` ("allowlist"), `disallowedTools:` ("denylist"), with documented merge order ("`disallowedTools` is applied first, then `tools` is resolved against the remaining pool").
  - Instruction scope: `.claude/rules/*.md` with `paths:` YAML frontmatter ("These conditional rules only apply when Claude is working with files matching the specified patterns") — scope authored *for instructions*, a genuinely carved-out field.
  - Soft/prose scope: CLAUDE.md conventions ("Use plan mode for changes under `src/billing/`") — IMPLICIT; docs are explicit that CLAUDE.md is "context, not enforced configuration."
- **WHEN VISIBLE:** Before (config files); during via `/permissions` (merged rule list with per-file source attribution, per audit) and `/memory` (lists loaded rules files). No surface shows the *composed* scope (dirs ∩ tools ∩ sandbox ∩ rules).
- **Example:** `.claude/rules/api.md` beginning `---\npaths:\n  - "src/api/**/*.ts"\n---`; subagent with `tools: Read, Grep, Glob, Bash`.
- **Evidence:** https://code.claude.com/docs/en/cli-reference; https://code.claude.com/docs/en/sub-agents#supported-frontmatter-fields; https://code.claude.com/docs/en/memory (all fetched 2026-07-03)

## 3. NON-GOALS

- **STATUS: MISSING as a surface.** No file, field, flag, or UI pane exists for "explicitly not part of the objective." The concept survives only as prose smuggled into *other* fields, and the docs actively instruct users to do the smuggling:
  - Into the goal string: the `/goal` doc says an effective condition includes "**Constraints that matter**: anything that must not change on the way there, such as 'no other test file is modified'."
  - Into a spec file (convention): best-practices says useful specs "state what is out of scope."
  - Into CLAUDE.md / managed `claudeMd`: docs' own example is `"Never push directly to main."` — advisory context, not a contract field.
  - Repurposed permission rules: `permissions.deny` / `--disallowedTools` express "may not," which is capability, not objective — a deny rule can't say "don't refactor adjacent code."
  - The sharpest evidence it's missing: per the audit, conversational boundaries in auto mode ("don't push") "are not stored as rules" and "can be silently lost to context compaction" — the product literally garbage-collects your non-goals.
  - One *product-authored* non-goals clause exists: the built-in `/loop` maintenance prompt promises "Claude does not start new initiatives outside that scope, and irreversible actions such as pushing or deleting only proceed when they continue something the transcript already authorized." Anthropic writes non-goals for its own automation; users get no equivalent slot.
- **WHEN VISIBLE:** Never as a distinct item; visible only if you re-read your own prose in CLAUDE.md or the goal status view.
- **Example:** `/goal migrate src/auth to the new API; npm test exits 0; no other test file is modified` — the non-goal is the trailing clause, judged by a Haiku evaluator from the transcript, not enforced.
- **Evidence:** https://code.claude.com/docs/en/goal; https://code.claude.com/docs/en/best-practices; https://code.claude.com/docs/en/scheduled-tasks (all fetched 2026-07-03); audit file §claudeCode item 3 (compaction loss)

## 4. TOOLS & PERMISSIONS

- **STATUS: AUTHORED — the one fully-realized contract field.** Dedicated syntax, dedicated files, dedicated UI, dedicated modes. (Deep coverage already in the audit; summary only.)
- **WHERE:** `permissions.allow`/`ask`/`deny` rules in five settings layers (managed > CLI args > `.claude/settings.local.json` > `.claude/settings.json` > `~/.claude/settings.json`); `/permissions` interactive dialog ("lists all permission rules and the `settings.json` file each rule comes from"); six permission modes surfaced per-platform (status bar + Shift+Tab in CLI); sandboxing; per-subagent `permissionMode` frontmatter; MCP server config.
- **WHEN VISIBLE:** Before (files/flags), during (status-bar mode, per-action prompts, `/permissions`, denial toasts). Caveat from audit: the *effective* policy is never rendered, and entering auto mode silently drops broad allow rules — the one authored field still mutates invisibly.
- **Example:** `{"permissions": {"allow": ["Bash(npm run lint)"], "ask": ["Bash(git push *)"], "deny": ["Read(.env)"]}}`
- **Evidence:** https://code.claude.com/docs/en/permissions; https://code.claude.com/docs/en/permission-modes (fetched 2026-07-03, per audit)

## 5. STOPPING CONDITION

- **STATUS: AUTHORED — via three different mechanisms in three different places, none called a "stopping condition."** This is the second-best-served field, and Osmani's "ideally a measurable variable" is literally what the docs coach: a condition should have "**One measurable end state**: a test result, a build exit code, a file count, an empty queue" and "**A stated check**: how Claude should prove it, such as '`npm test` exits 0'."
- **WHERE:**
  1. `/goal <condition>` — model-evaluated ("a small fast model checks whether the condition holds," default Haiku; "completion is decided by a fresh model rather than the one doing the work"). Turn/time bounds go in as prose: "include a turn or time clause in the condition, such as `or stop after 20 turns`."
  2. **Stop hook** in `settings.json` — deterministic: a script returning `{"decision": "block", "reason": "..."}` "Prevents Claude from stopping, continues the conversation." Applies to every session in its scope. Critical system override: "Claude Code overrides the hook and ends the turn after 8 consecutive blocks" — the platform caps your stopping condition. Related events: `SubagentStop`, `TaskCompleted` ("Prevents the task from being marked as completed"), `TeammateIdle` ("Prevents the teammate from going idle").
  3. Hard turn caps: subagent frontmatter `maxTurns` ("Maximum number of agentic turns before the subagent stops"); CLI `--max-turns` — "Limit the number of agentic turns **(print mode only)**. Exits with an error when the limit is reached. No limit by default." Interactive sessions cannot set a turn cap.
  - Plus system-imposed stops the user doesn't author: `/loop` "Recurring tasks automatically expire 7 days after creation"; self-paced loops end "by not scheduling the next wakeup once the task is provably complete."
- **WHEN VISIBLE:** `/goal` — during, via the `◎` indicator and status view. Stop hooks — before/during only in the read-only `/hooks` browser; the condition itself renders nowhere at runtime. `maxTurns`/`--max-turns` — never visible during a run.
- **Example:** `/goal npm test exits 0 and git status is clean, or stop after 20 turns` vs. `"Stop": [{"hooks": [{"type": "command", "command": ".claude/hooks/require-tests-before-stop.sh"}]}]`
- **Evidence:** https://code.claude.com/docs/en/goal; https://code.claude.com/docs/en/hooks; https://code.claude.com/docs/en/cli-reference; https://code.claude.com/docs/en/sub-agents; https://code.claude.com/docs/en/best-practices ("8 consecutive blocks") — all fetched 2026-07-03

## 6. EVIDENCE

- **STATUS: IMPLICIT — a heavily-documented convention with no structured field.** The best-practices doc has an entire section, "Give Claude a way to verify its work," and even names the escalating ladder: "**In one prompt** … **Across a session**: set the check as a `/goal` condition … **As a deterministic gate**: a Stop hook runs your check as a script … **By a second opinion**: a verification subagent." And the key line for the thesis: "**Have Claude show evidence rather than asserting success**: the test output, the command it ran and what it returned, or a screenshot of the result… it works for sessions you weren't watching." But no run carries an evidence attachment; nothing in the product stores, renders, or requires it. "If you can't verify it, don't ship it" is advice, not enforcement.
- **WHERE:**
  - Convention: verification criteria written into the prompt / goal condition ("run the tests after implementing"; "`npm test` exits 0").
  - Enforcement (the only real one): a **Stop hook** script that runs the check and blocks — authored as a shell script in `settings.json`, never labeled "evidence."
  - Bundled skills as evidence *generators*: `/verify` — "Confirm a code change does what it should by building your project's app, running it, and observing the result, rather than relying on tests or type checks" (v2.1.145+); `/run` — "Launch and drive your project's app to see a change working, not only passing tests"; `/code-review` (fresh-subagent diff review); `/security-review`. `/batch` bakes it into the product's own flow: "Each subagent implements its unit, runs tests, and opens a pull request."
  - Independence requirement (Osmani's "independent of the agent") appears only as the subagent pattern: a reviewer "sees only the diff and the criteria you give it, not the reasoning that produced the change."
- **WHEN VISIBLE:** During/after — as ordinary transcript output (test results, screenshots) with no dedicated pane; evaluated by the `/goal` evaluator only "against what Claude has surfaced in the conversation. It doesn't run commands or read files independently."
- **Example:** Prompt-level: "take a screenshot of the result and compare it to the original. list differences and fix them" (verbatim docs example). Hook-level: a Stop hook running `npm test` that emits `{"decision":"block","reason":"Tests failed…"}`.
- **Evidence:** https://code.claude.com/docs/en/best-practices; https://code.claude.com/docs/en/commands (`/verify`, `/run` rows); https://code.claude.com/docs/en/hooks — all fetched 2026-07-03

## 7. ESCALATION

- **STATUS: split — the WHEN is AUTHORED, the WHO is hardcoded.** Users author escalation *triggers* (ask rules, hook matchers); the escalation *target* is always "whoever owns this terminal/session." No concept of escalating to a different person, a reviewer, or a role.
- **WHERE:**
  - Trigger authoring: `permissions.ask` rules — literally "under what circumstances" a human gets pulled in; `PermissionRequest` hook can programmatically resolve what would have escalated (`"decision": {"behavior": "allow"}`) — an authored *delegated approver*, the same substitute-the-approver move as Codex Auto-review.
  - Model-initiated escalation: the **AskUserQuestion** tool — "Asks multiple-choice questions to gather requirements or clarify ambiguity." Notable decay behavior (v2.1.198+): "if you don't respond within 60 seconds the dialog closes on its own… Claude proceeds on its own judgment and can re-ask later," tunable via `CLAUDE_AFK_TIMEOUT_MS`; but "permission prompts, including plan approval, never auto-resolve on idle." Escalations *expire*; approvals don't.
  - Reach-the-human plumbing: `Notification` hook with matchers `permission_prompt`, `idle_prompt`, `agent_needs_input`, `agent_completed` (authored routing of escalation events to `notify-send`/ntfy/sounds); `preferredNotifChannel: "terminal_bell"` setting; `PushNotification` tool — "Sends a desktop notification, and a phone push when Remote Control is connected."
  - Multi-agent chain: Agent View groups sessions under "**Needs input**" (per audit); in agent teams, teammate permission prompts "bubble up to the lead session" and "The lead makes approval decisions autonomously" — escalation to another *agent*, with the human one hop further away.
- **WHEN VISIBLE:** During only — a prompt, dialog, bell, or push at the moment of escalation. The escalation *policy* (which ask rules exist, which hooks route where) is visible before only by reading settings files / the read-only `/hooks` browser.
- **Example:** `"Notification": [{"matcher": "permission_prompt", "hooks": [{"type": "command", "command": "notify-send 'Claude Code' 'Permission required'"}]}]`
- **Evidence:** https://code.claude.com/docs/en/hooks; https://code.claude.com/docs/en/tools-reference (AskUserQuestion, PushNotification rows); https://code.claude.com/docs/en/terminal-config; https://code.claude.com/docs/en/agent-teams (per audit) — all fetched 2026-07-03

## 8. BUDGET

- **STATUS: AUTHORED — but only where you aren't: headless flags and admin consoles. Interactive sessions get visibility without caps.** The starkest fragmentation of the eight.
- **WHERE:**
  - Per-run, headless only: `--max-budget-usd` — "Maximum dollar amount to spend on API calls before stopping **(print mode only)**" (`claude -p --max-budget-usd 5.00 "query"`); `--max-turns` (also print-only). No interactive equivalent exists.
  - Per-subagent: `maxTurns` frontmatter in `.claude/agents/*.md`.
  - Per-account: `/usage-credits` — "On Pro and Max plans, you can set a monthly spend limit on usage credits"; when hit, "Claude Code prompts you to raise or remove the limit… without leaving the CLI."
  - Per-org (admin plane, not in the product): Console **workspace spend limits** on the auto-created "Claude Code" workspace, plus a **workspace rate limit** "to cap Claude Code's share and protect other production workloads"; per-user spend limits via a self-hosted Claude apps gateway on Bedrock/Vertex/Foundry.
  - Thinking-token budget: `MAX_THINKING_TOKENS=8000` env var (fixed-budget models only); `/effort` slider as an ordinal cost dial.
  - Prose pseudo-budget: a `/goal` clause like "or stop after 20 turns" — model-judged from the transcript, not metered.
  - Parallelism: no user-set limit anywhere; only system caps (50 scheduled tasks/session, `/batch`'s 5–30 units) and cost *advice* ("Agent teams use approximately 7x more tokens… Keep teams small").
  - Time: no per-run wall-clock budget; only scheduler-level bounds (`/loop` 7-day expiry, `claude ultrareview --timeout <minutes>`).
- **WHEN VISIBLE:** During/after — `/usage` (session tokens, "Total cost: $0.55", plan-limit bars, per-skill/subagent/MCP attribution over 24h/7d), `/goal` status token spend, optional statusline context meter. Before — never: no surface previews a run's expected cost, and interactive runs cannot be capped at all.
- **Example:** `claude -p --max-turns 3 --max-budget-usd 5.00 "migrate this file"` — a budgeted contract that is only expressible when no human is watching.
- **Evidence:** https://code.claude.com/docs/en/cli-reference; https://code.claude.com/docs/en/costs; https://code.claude.com/docs/en/sub-agents; https://code.claude.com/docs/en/scheduled-tasks — all fetched 2026-07-03

---

## Cross-cutting observations for the synthesis

1. **Field fusion:** `/goal` fuses GOAL + STOPPING CONDITION + (optionally) NON-GOALS + (prose) BUDGET into one 4,000-char string judged by Haiku — four contract fields, one text box, zero structure.
2. **The authored/enforced split is explicit product doctrine:** the memory doc ships a table contrasting "Managed settings: `permissions.deny`" (enforced) vs "Managed CLAUDE.md" (advisory) — "Settings rules are enforced by the client regardless of what Claude decides… CLAUDE.md instructions shape Claude's behavior but are not a hard enforcement layer." The contract's soft fields (goal, non-goals, evidence) all live on the advisory side.
3. **Budgets are inversely available to supervision:** the only hard dollar/turn caps (`--max-budget-usd`, `--max-turns`) exist exclusively in print mode — the mode with no human present — while interactive sessions, where a human could act on a budget, offer only after-the-fact `/usage` readouts.
4. **User-authored stopping conditions are themselves bounded by the system:** Stop hooks are force-released after 8 consecutive blocks; `/loop` tasks hard-expire at 7 days; AskUserQuestion escalations auto-resolve at 60s. The platform holds a meta-contract above yours.
5. **Direction of travel is away from UI:** `/agents` config wizard removed in v2.1.198 in favor of editing markdown; `/hooks` is a read-only browser ("edit the settings JSON directly"). Contract fields are increasingly authored in files, rendered nowhere.

Sources: [/goal](https://code.claude.com/docs/en/goal) · [hooks](https://code.claude.com/docs/en/hooks) · [CLI reference](https://code.claude.com/docs/en/cli-reference) · [costs](https://code.claude.com/docs/en/costs) · [memory/CLAUDE.md](https://code.claude.com/docs/en/memory) · [sub-agents](https://code.claude.com/docs/en/sub-agents) · [scheduled-tasks](https://code.claude.com/docs/en/scheduled-tasks) · [tools-reference](https://code.claude.com/docs/en/tools-reference) · [terminal-config](https://code.claude.com/docs/en/terminal-config) · [commands](https://code.claude.com/docs/en/commands) · [best-practices](https://code.claude.com/docs/en/best-practices) · [permissions](https://code.claude.com/docs/en/permissions) (via audit) · [permission-modes](https://code.claude.com/docs/en/permission-modes) (via audit) — all fetched 2026-07-03. Prior verified base: /Users/arielconti/workspace/agentic-craft/audits/autonomy-ui-verification-2026-07-03.md

## codex

# OPENAI CODEX — run-contract field map (verified 2026-07-03)

Baseline inherited from `/Users/arielconti/workspace/agentic-craft/audits/autonomy-ui-verification-2026-07-03.md` (permission presets, three-vocabulary problem, `/status` divergence, Automations/Auto-review basics — not re-researched). Everything below newly verified against developers.openai.com fetches on 2026-07-03 unless marked otherwise.

---

## 1. GOAL

- **STATUS: AUTHORED — but only in Goal mode; everywhere else the goal is just the first prompt (IMPLICIT).**
- **WHERE:** The **`/goal`** slash command in the CLI TUI: "Set, pause, resume, view, or clear a task goal." Objective is free text, "non-empty and at most 4,000 characters." Lifecycle: `/goal pause` / `resume` / `clear`. Since CLI 0.142.0 (changelog 2026-06-22) goals are editable "directly in the composer"; iOS got "goal workflows with a composer shortcut" (2026-06-15). In cloud tasks / IDE / non-goal sessions there is no goal object at all — the task prompt is the goal.
- **WHEN VISIBLE:** Before (authored via `/goal`); during (`/goal` with no args inspects status — docs say "use `/goal` to inspect status while it runs" but describe **no banner/pill/panel rendering**; do not claim one); after ("allow creating a new goal after completion," changelog 2026-06-18).
- **EXAMPLE (official starter template, verbatim):** `/goal Complete [objective] without stopping until [verifiable end state].`
- **EVIDENCE:** https://developers.openai.com/codex/cli/slash-commands ; https://developers.openai.com/codex/use-cases/follow-goals ; https://developers.openai.com/codex/changelog (all fetched 2026-07-03). Goal-mode GA ~2026-05-21 is third-party-only; docs still show `codex features enable goals` — cite cautiously.

## 2. SCOPE

- **STATUS: SPLIT. Filesystem/network scope AUTHORED (config); run placement AUTHORED (per-run picker); technique/domain scope IMPLICIT (prose in AGENTS.md or prompt).**
- **WHERE:** Three disjoint surfaces:
  1. `config.toml`: `sandbox_mode = "read-only" | "workspace-write" | "danger-full-access"`; `sandbox_workspace_write.writable_roots` (array); `sandbox_workspace_write.network_access` (bool); named `[permissions.<name>]` profiles + `default_permissions` (`:read-only` / `:workspace` / `:danger-full-access`) — config-only, no UI renders profiles.
  2. Codex app composer: the **Local / Worktree / Cloud** placement selector (worktree = "isolate changes in a Git worktree") — per-run, chosen before send.
  3. Cloud environment settings: choose "the repo, setup steps, and tools Codex should use" and "decide whether Codex can reach the public internet from cloud environments."
  4. Technique scope ("refactor, don't rewrite"; allowed approaches): only freeform prose — AGENTS.md is "just standard Markdown. Use any headings you like" (agents.md spec) → IMPLICIT.
- **WHEN VISIBLE:** Config before (file only); placement before each run (composer); during, `/status` prints "approval policy, writable roots" — CLI-only, read-only, with documented divergence from enforcement (GH #6667, #4152, per baseline file).
- **EXAMPLE:** `sandbox_mode = "workspace-write"` + `[sandbox_workspace_write] writable_roots = ["/extra/path"]`.
- **EVIDENCE:** https://developers.openai.com/codex/config-reference ; https://developers.openai.com/codex/cloud ; https://agents.md/ (fetched 2026-07-03); app placement per baseline file (app/features, fetched 2026-07-03).

## 3. NON-GOALS

- **STATUS: AUTHORED-BY-CONVENTION in Goal mode only, as unstructured prose; MISSING everywhere else.** This passes the strictness bar narrowly: the official Goal docs explicitly carve the concern out — a goal should include "constraints and non-goals — what should not be changed or attempted," and the cookbook's six-component framework names "constraints" and "boundaries" as components the user writes. But there is **no dedicated field**: non-goals live inside the same 4,000-char goal blob, and no UI ever renders them separately.
- **WHERE:** Inside the `/goal` objective text (convention from docs); optionally freeform "do not" prose in `AGENTS.md` (freeform → IMPLICIT, no named section in the spec or examples).
- **WHEN VISIBLE:** Before, only as words inside the goal text; never extracted, never rendered as its own artifact during or after.
- **EXAMPLE:** Cookbook pattern (verbatim): `"<desired end state> verified by <specific evidence> while preserving <constraints>"` — e.g. "Reduce p95 checkout latency below 120 ms, verified by the checkout benchmark, while keeping the correctness suite green."
- **EVIDENCE:** https://developers.openai.com/codex/use-cases/follow-goals ; https://developers.openai.com/cookbook/examples/codex/using_goals_in_codex (fetched 2026-07-03).

## 4. TOOLS & PERMISSIONS

- **STATUS: AUTHORED — the most-authored field in the product, but shredded across ≥6 layers with undocumented precedence** (baseline file; not re-researched).
- **WHERE:** `config.toml` `approval_policy` (`untrusted | on-request | never | { granular = { sandbox_approval, rules, mcp_elicitations, request_permissions, skill_approval } }`); `sandbox_mode`; `[permissions.<name>]` profiles; CLI `/permissions` picker ("Set what Codex can do without asking first" — Read Only / Auto / Full Access); IDE mode selector (Chat / Agent / Agent (Full Access)); app per-action prompts ("approve once / approve for this session") + permissions selector; enterprise managed requirements; `--dangerously-bypass-approvals-and-sandbox` (`--yolo`).
- **WHEN VISIBLE:** Before (config/flags); during (`/permissions` mid-session, per-action prompts, `/status` read-only dump); no resolved cross-surface rendering (baseline).
- **EXAMPLE:** `approval_policy = { granular = { sandbox_approval = true, mcp_elicitations = false } }`.
- **EVIDENCE:** https://developers.openai.com/codex/config-reference ; https://developers.openai.com/codex/permissions ; baseline file section "codex" (all 2026-07-03).

## 5. STOPPING CONDITION

- **STATUS: AUTHORED in Goal mode — but as prose inside the goal text, not a measurable variable; IMPLICIT/absent outside Goal mode** (a normal turn stops when the model decides or an approval blocks).
- **WHERE:** Inside `/goal` text. Docs require "one objective and one stopping condition" and "what 'done' means before Codex starts"; template: "without stopping until [verifiable end state]." Cookbook adds a sixth component, "blocked stop conditions" — stop and report when "the benchmark cannot run," "no valid paths remain under current limits," or "missing source material blocks exact replay." **No structured stop-condition field, no iteration-limit control, no measurable-variable input in any UI** (confirmed both today and in baseline).
- **WHEN VISIBLE:** Before (words in the goal); during only via `/goal` status inspection; the condition itself is never rendered as a separate tracked variable. (Contrast: Claude Code's `/goal` shows condition + turns evaluated + evaluator reason — Codex docs describe nothing equivalent.)
- **EXAMPLE:** "Reduce p95 latency below 120 ms without regressing correctness tests" (cookbook, verbatim — a measurable threshold, but stored as prose).
- **EVIDENCE:** https://developers.openai.com/codex/use-cases/follow-goals ; https://developers.openai.com/cookbook/examples/codex/using_goals_in_codex ; https://developers.openai.com/codex/cli/slash-commands (fetched 2026-07-03).

## 6. EVIDENCE

- **STATUS: SPLIT. The evidence *requirement* is AUTHORED-by-convention in two places (goal prose + one genuinely named AGENTS.md section); the evidence *artifacts* are system-produced and only visible AFTER.**
- **WHERE (requirement, before):**
  1. Goal prose: docs say "define the commands or artifacts that prove progress"; cookbook: "A Goal should be complete only after the objective is checked against the relevant files, tests, logs, benchmark output, generated artifacts, or other concrete evidence."
  2. **`## Review guidelines`** — a verbatim, officially named AGENTS.md heading steering GitHub code review (the one place Codex's conventions carve a contract field into AGENTS.md). Example (verbatim): "- Don't log PII. / - Verify that authentication middleware wraps every route." Severity steering too: "Treat typos in docs as P1."
  3. Freeform "Testing instructions" AGENTS.md section — popular convention per agents.md, not required → IMPLICIT.
- **WHERE (artifacts, after):** Cloud task page shows **logs, diffs, terminal-output citations, screenshots, test results**; best-of-N runs surface "preview screenshots"; app **review pane** shows git-state diffs (scopes: "uncommitted changes / all branch changes / last turn changes"), `/review` findings as inline diff comments ("focusing on behavior changes and missing tests"); GitHub reviews post "only P0 and P1 issues" as standard PR reviews. Settings toggles: **"Code review"** and **"Automatic reviews"** at chatgpt.com/codex/settings/code-review.
- **WHEN VISIBLE:** Requirement before (prose); artifacts after (task page, review pane, PR review). No pre-run "evidence contract" surface exists.
- **EVIDENCE:** https://developers.openai.com/codex/integrations/github ; https://developers.openai.com/codex/cloud ; https://developers.openai.com/codex/app/review ; https://developers.openai.com/blog/codex-at-devday ; cookbook (all fetched 2026-07-03).

## 7. ESCALATION

- **STATUS: circumstances AUTHORED (buried in config); the "who" is IMPLICIT and fixed — it is always you, a reviewer agent, or org policy; no concept of routing to another person.**
- **WHERE:**
  - Circumstances: `approval_policy` granular categories are literally an escalation-trigger list (`sandbox_approval`, `rules`, `mcp_elicitations`, `request_permissions`, `skill_approval`); `approvals_reviewer = "user" | "auto_review"` chooses the approver; `[auto_review].policy` is an **authored markdown escalation policy** (default at `core/src/guardian/policy.md` in the open-source repo; docs: "copy the whole default policy wording first, then iterate"); enterprise `guardian_policy_config` "takes precedence." Auto-review evaluates exactly: escalated shell/exec calls, blocked network requests, "file edits outside the allowed writable roots," MCP/app tool calls needing approval, "Browser Use access to a new website or domain."
  - Human-override path: **`/approve`** — "Approve one retry of a recent auto review denial," opens the "Auto-review Denials picker"; "the reviewer then sees that explicit user override as context" and may still deny.
  - Notification routing: config `notify` (array<string>) — "Command invoked for notifications; receives a JSON payload from Codex"; `tui.notifications`, `tui.notification_condition` (`unfocused | always`). Automations escalate results into the **Triage** pane ("acts as your inbox"; no-finding runs auto-archived).
- **WHEN VISIBLE:** During, as moment-of-truth prompts / denial rationales; after, in Triage. The escalation *policy* is never rendered — config files + a markdown policy doc.
- **EXAMPLE:** `approvals_reviewer = "auto_review"` + `[auto_review] policy = "..."` in config.toml; then `/approve` in the TUI to override a denial once.
- **EVIDENCE:** https://developers.openai.com/codex/concepts/sandboxing/auto-review ; https://developers.openai.com/codex/config-reference ; https://developers.openai.com/codex/cli/slash-commands ; https://developers.openai.com/codex/app/automations (all fetched 2026-07-03).

## 8. BUDGET

- **STATUS: AUTHORED — but split between buried config keys, a per-run CLI flag, and platform-imposed credits; nothing budget-shaped in the composer.**
- **WHERE:**
  - **Explicit token budget (config.toml, feature-flagged):** `features.rollout_budget.enabled` + `features.rollout_budget.limit_tokens` ("Positive token limit for rollout budget tracking") + `reminder_interval_tokens` (defaults to 10% of limit) — the single most contract-like budget artifact in any product surveyed, and it lives in a config file with no UI.
  - **Parallelism/time (config.toml):** `agents.max_threads` (concurrent agent threads, default 6); `agents.max_depth` (nesting, default 1); `agents.job_max_runtime_seconds` (default 1800s/worker); `tool_output_token_limit`; `model_auto_compact_token_limit`.
  - **Attempts (per-run flag):** `codex cloud exec --env ENV_ID --attempts 3 "..."` — best-of-N, 1–4 attempts per cloud task.
  - **Effort:** `model_reasoning_effort` (`minimal | low | medium | high | xhigh`) + `plan_mode_reasoning_effort`; also a per-automation "model and reasoning effort" choice in the Automations form.
  - **Platform-imposed:** credit system priced per million tokens ("A typical Codex task using GPT-5.5 may consume between 5–45 credits per task"), 5-hour + weekly plan limits, purchasable credits; visible via `/usage` ("view account usage"), `/status` ("current token usage"), and the Codex usage dashboard.
  - **In Goal mode: prose only.** Cookbook: at budget, Codex should "stop substantive work, summarize progress and blockers, and identify the next useful step. Reaching a budget limit is not the same as completing the objective" — but "the guide does not specify token limits, turn counts, or checkpoint frequencies," and no goal-level budget field exists.
- **WHEN VISIBLE:** Before (config file only); during (`/status`, `/usage`, rollout-budget reminders); after (usage dashboard, credit balance). Never attached to a specific run as a contract.
- **EXAMPLE:** `[features.rollout_budget] enabled = true, limit_tokens = 500000` ; `--attempts 3`.
- **EVIDENCE:** https://developers.openai.com/codex/config-reference ; https://developers.openai.com/codex/cli/reference (attempts flag) ; https://developers.openai.com/codex/pricing ; https://help.openai.com/en/articles/20001106-codex-rate-card ; https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan ; cookbook (all fetched/searched 2026-07-03).

---

## Synthesis notes (fragmentation tally)

- Fields with a **dedicated authored artifact**: TOOLS & PERMISSIONS (config + 3 incompatible pickers), BUDGET (config keys + flag + credits — never per-run), GOAL (Goal mode only), plus one named carve-out for EVIDENCE steering (`## Review guidelines` in AGENTS.md — the only contract field with its own named AGENTS.md heading).
- Fields that exist **only as prose conventions inside the goal blob**: NON-GOALS, STOPPING CONDITION, evidence-requirement, goal-level budget semantics — the cookbook's six-component pattern (outcome, verification surface, constraints, boundaries, iteration policy, blocked stop conditions) is effectively the eight-field contract restated as writing advice for one 4,000-char text field.
- ESCALATION is the inverted field: the *policy* is richly authorable (`granular` categories, `[auto_review].policy` markdown, `guardian_policy_config`) but the *recipient* is hardcoded (you / reviewer agent / org), and none of it renders.
- Per-field surface count (for the visualizer): GOAL 2, SCOPE 4, NON-GOALS 1 (shared blob), TOOLS 6+, STOPPING 1 (shared blob), EVIDENCE 5 (2 before + 3 after), ESCALATION 4, BUDGET 5. No two fields share a primary surface except the three living inside the `/goal` text.
- Traps carried over from the baseline file: don't claim a goal banner/pill; Goal GA date is third-party-only; `/status` diverges from enforcement (GH #6667/#4152); Local/Worktree/Cloud is placement, not permissions.

## cursor

# CURSOR — run-contract field map (evidence gathered 2026-07-03)

Baseline inherited from `/Users/arielconti/workspace/agentic-craft/audits/autonomy-ui-verification-2026-07-03.md` (Run Modes, permissions.json/sandbox.json, mode picker, no resolved-policy view, protected files). Everything below is the new research on the six under-covered fields, plus contract-framing of the two covered ones. Product version context: Cursor 3.9 (Jun 29, 2026).

---

## 1. GOAL

- **STATUS: IMPLICIT** (two near-authored hosts, neither a dedicated goal field)
- **WHERE:**
  - Default: the free-text prompt in the **Agent composer** — the goal is whatever the first message said, buried in chat history.
  - Nearest authored surface #1: **Plan Mode** (`Shift+Tab`) — agent "asks clarifying questions," then "creates a Markdown file with file paths and code references"; user can "edit the plan directly, including adding or removing to-dos," then "build directly from your plan when ready." The plan file is co-authored *activity* (implementation steps), not an outcome statement — a plan, not a goal. Plans are "saved by default in your home directory"; forum evidence calls the artifact `.plan.md` (official docs don't name the extension — don't hard-claim it).
  - Nearest authored surface #2: **Automations prompt field** (cursor.com/automations) — a persistent free-text prompt per recurring run. Docs push goal-shaped content by convention only: "Be specific about what the agent should check, change, or produce."
- **WHEN VISIBLE:** Plan — before the run (that's its whole point); composer prompt — before, then scrolls away; automation prompt — before, persisted in the automation config.
- **Example:** Plan Mode flow: prompt → clarifying questions → editable Markdown plan opens in preview pane → click to build.
- **Evidence:** https://cursor.com/docs/agent/plan-mode (fetched 2026-07-03); https://cursor.com/blog/plan-mode (Oct 7, 2025); https://cursor.com/docs/cloud-agent/automations (fetched 2026-07-03).

## 2. SCOPE

- **STATUS: AUTHORED — but shredded across ≥4 artifacts with no unified view**
- **WHERE:**
  1. **`.cursor/rules/*.mdc`** — frontmatter `globs` + `alwaysApply` deliberately scope which instructions apply to which files ("Apply to Specific Files"); nested **`AGENTS.md`** per subdirectory, "more specific instructions taking precedence"; Team Rules → Project Rules → User Rules precedence via dashboard.
  2. **`.cursorignore`** — authored file-access exclusion (agent cannot read/touch listed paths).
  3. **`permissions.json`** (`~/.cursor/` and `<project>/.cursor/`) — `allow`/`deny` arrays (`Shell(git)`, `Read(src/**/*.ts)`, `Write(package.json)`, `WebFetch(*.github.com)`, `Mcp(datadog:*)`) = technique allowlist. (Audit-established.)
  4. **Environment picker in the Agents Window** — local / worktree / cloud / SSH per agent; `/worktree` isolates blast radius per run (3.0, Apr 2, 2026). Placement-as-scope, chosen in the composer.
- **WHEN VISIBLE:** Before the run (files + settings + picker); never rendered as one merged scope — cross-file merge order undocumented (audit-established).
- **Example:** `.cursor/rules/no-dist.mdc` with `globs: ["dist/**"]` and body "Never modify generated files in the dist/ or build/ directories" (docs' own example).
- **Evidence:** https://cursor.com/docs/context/rules (fetched 2026-07-03); https://cursor.com/docs/cli/reference/permissions, https://cursor.com/docs/agent/security, https://cursor.com/changelog/3-0 (all per audit, 2026-07-03).

## 3. NON-GOALS

- **STATUS: MISSING** (no first-class "not part of the objective" concept; fragments live as negations inside scope artifacts)
- **WHERE (fragments only):**
  - Free-text "Never…" lines in rules/`AGENTS.md` — objective-level don'ts are possible but the file is a generic instruction bucket → IMPLICIT by the strict test.
  - **`block_instructions`** array in `permissions.json` — plain-English steering of the Auto-review classifier, but *action*-level ("don't run migrations"), not *objective*-level ("dark mode is out of scope"). (Audit-established.)
  - Plan Mode: deleting to-dos from the plan file before clicking build = expressing non-goals by subtraction, unlabeled and unpersisted as such.
  - Automations prompt guidance gestures at it: "Include decision rules for what to do in different cases… or do nothing" — non-goals as prose convention.
- **WHEN VISIBLE:** Never as a distinct surface; the fragments are visible only where their host files are.
- **Example:** There is no place where "do NOT touch billing code this run" survives as a run-scoped, named non-goal; it dissolves into a rules file that applies to every run forever.
- **Evidence:** https://cursor.com/docs/context/rules (fetched 2026-07-03); https://cursor.com/docs/agent/security/run-modes + https://forum.cursor.com/t/auto-review-run-mode/161922 (audit, 2026-07-03).

## 4. TOOLS & PERMISSIONS

- **STATUS: AUTHORED — the most built-out field, across three disjoint planes** (audit-covered; contract framing only)
- **WHERE:** Global **Run Mode** — Auto-review / Allowlist / Run Everything at **Settings > Cursor Settings > Agents > Approvals & Execution** (3.6, May 29, 2026; not per-agent); **`permissions.json`** allow/deny + `allow_instructions`/`block_instructions`; **`sandbox.json`**; MCP connection + per-tool allowlists; web-fetch domain allowlist; hooks returning `permission: "deny"` (`preToolUse`, `beforeShellExecution`, `beforeMCPExecution`, `beforeReadFile`, `beforeSubmitPrompt`) in `hooks.json`; **Automations setup step 3: "Choose optional tools the agent is able to use"** — a genuinely per-run-template authored tool grant, the closest thing Cursor has to a per-run contract clause.
- **WHEN VISIBLE:** Before (settings/files), during (approval prompts, classifier interruptions ~7% of Auto-review chats). Resolved merge: never (audit-established).
- **Example:** `{"permissions": {"deny": ["Shell(rm)"], "allow": ["Shell(git)"]}}`; "Deny rules take precedence over allow rules."
- **Evidence:** https://cursor.com/docs/agent/security/run-modes, https://cursor.com/docs/cli/reference/permissions, https://cursor.com/blog/agent-autonomy-auto-review (Jun 11, 2026) (audit, 2026-07-03); https://cursor.com/docs/hooks (fetched 2026-07-03); https://cursor.com/docs/cloud-agent/automations (fetched 2026-07-03).

## 5. STOPPING CONDITION

- **STATUS: MISSING** as a structured, measurable field — DIY-able via hooks; prose-only in prompts
- **WHERE (fragments):**
  - **`stop` hook** in `.cursor/hooks.json` — fires "when the agent loop ends," receives a status field, and can return `followup_message` "that automatically submits as the next user message." Note the inversion: the user scripts *continuation*, not stopping — the stop decision itself stays the model's. Cursor's own best-practices post ships a DIY iteration cap: a stop hook with `const MAX_ITERATIONS = 5;`.
  - Plan Mode to-dos: implicit terminal state = all plan to-dos done; not enforced, not measurable.
  - Automations docs convention: "Set a quality bar for when the agent should open a pull request, comment, or do nothing" — stopping condition as prompt prose.
  - Manual: the **Stop** button ("click **Stop** to cancel and redirect") — during-run only.
  - Backstop of last resort: monthly spend limit ("AI features stop working for that specific user") — account-month granularity, not run.
- **WHEN VISIBLE:** Hook config before (file only, no UI); during only as the Stop button; the condition itself is never rendered.
- **Example:** `.cursor/hooks.json` stop hook that runs `pnpm lint && pnpm build` and returns a `followup_message` with failures until clean — a user-built stopping condition living entirely outside the product's UI.
- **Evidence:** https://cursor.com/docs/hooks (fetched 2026-07-03); https://cursor.com/blog/agent-best-practices (Jan 9, 2026); https://cursor.com/docs/cloud-agent/automations (fetched 2026-07-03); https://cursor.com/docs/account/billing/spend-limits (fetched 2026-07-03).

## 6. EVIDENCE

- **STATUS: IMPLICIT** for the requirement (nothing says "this run must produce evidence X"); the *artifacts* exist after the run, and standards are AUTHORED only via `BUGBOT.md`/hooks
- **WHERE:**
  - **Bugbot** — agent-independent review of PR diffs; on GitHub it "publishes a CI check status named `Cursor Bugbot`" with `success` / `neutral` / `failure`; findings as inline PR comments with severity. Triggers: automatic "on every PR update," or `bugbot run` / `cursor review` PR comment; in-editor `/review-bugbot` skill pre-push. Authored evidence *standards*: **`.cursor/BUGBOT.md`** files + `@cursor remember [fact]` learned rules — the one place a user deliberately writes what acceptable work must look like.
  - In-editor: **Review → Find Issues** ("the agent analyzes proposed edits line-by-line and flags potential problems") and the live **diff view** in the Agents Window.
  - **Browser tool** — agent-captured screenshots ("Screenshots are integrated directly with the file reading tool") for visual verification; ad hoc, agent-initiated, not required.
  - DIY gates: `afterFileEdit` / stop hooks running formatters, lint, build, k8s-manifest validation (docs' own examples).
- **WHEN VISIBLE:** After the run (Bugbot check on the PR, review pass, diffs); during (diff view, screenshots in transcript). Never demanded before the run.
- **Example:** A PR opened by a cloud agent carries the `Cursor Bugbot` check; `.cursor/BUGBOT.md` in the repo tells it what to enforce.
- **Evidence:** https://cursor.com/docs/bugbot (fetched 2026-07-03); https://cursor.com/blog/agent-best-practices (Jan 9, 2026); https://cursor.com/docs/agent/tools/browser (fetched 2026-07-03).

## 7. ESCALATION

- **STATUS: IMPLICIT** — trigger and route are system-defined ("interrupt the initiating user"); the sole authored escalation routing is spend alerts
- **WHERE:**
  - **Auto-review classifier** — escalates a tool call to human approval when it won't allow/redirect ("only about 7% of total chats in Auto-review mode lead to at least one interruption"). User steers it only indirectly via `allow_instructions`/`block_instructions`. (Audit-established.)
  - **iOS app (3.9, Jun 29, 2026):** "Get push notifications when an agent finishes, needs input, or is ready for review" + Live Activities on lock screen; **Remote Control** (`/remote-control`) hands a local agent to your phone — on Teams/Enterprise "admins must enable Remote Control from the Cursor Dashboard."
  - **Slack:** completion "notification in Slack and an option to view the created PR"; no needs-attention/approval-request routing documented, and no settings controlling when the agent pings a human.
  - **Spend alerts (the one authored route):** "Admins can configure smart alerts based on dollar thresholds and have them delivered to the right people through Slack or email" (Teams pricing post, Jun 1, 2026) — who + under what circumstance, but only for money.
- **WHEN VISIBLE:** During (interruption prompts, push notifications) and after (completion pings); never declared before a run — you cannot write "if X happens, page Y."
- **Example:** Agent hits a non-allowlisted destructive command under Auto-review → classifier interrupts → push notification "needs input" on the phone → approve from the iOS app.
- **Evidence:** https://cursor.com/blog/agent-autonomy-auto-review (Jun 11, 2026, audit); https://cursor.com/changelog/ios-mobile-app (3.9, Jun 29, 2026, fetched 2026-07-03); https://cursor.com/docs/integrations/slack (fetched 2026-07-03); https://cursor.com/blog/teams-pricing-june-2026 (Jun 1, 2026).

## 8. BUDGET

- **STATUS: AUTHORED — at the wrong granularity (account-month, never per-run)**
- **WHERE:** Dashboard **Spending** tab (cursor.com/dashboard/spending): "monthly spend limit for your on-demand usage" (Pro/Pro+/Ultra); team-level limit (Teams); Enterprise adds member overrides via **Members** tab / **Groups** tab / Admin API `set-user-spend-limit`. Dashboard **Usage** section shows real-time usage "split between Auto + Composer and 3rd party API models." When hit: "AI features stop working for that specific user… Usage resumes automatically at the start of the next billing cycle." Indirect per-run cost dials: model picker + Bugbot "Effort levels: Default, High, or Custom." Per-run token/time/attempt/parallelism limits: none — the docs' own workaround is the DIY `MAX_ITERATIONS = 5` stop hook; Automations have "no maximum run counts or spend limits… billed based on cloud agent usage."
- **WHEN VISIBLE:** Before/after in the dashboard (a different app from where runs happen); never in the composer at dispatch time; mid-run only as the terminal event of everything shutting off.
- **Example:** Enterprise admin sets a $50/month member override on the Members tab; the dev's agent dies mid-refactor when it's crossed, with no per-run meter ever shown in the Agents Window.
- **Evidence:** https://cursor.com/docs/account/billing/spend-limits (fetched 2026-07-03); https://cursor.com/blog/teams-pricing-june-2026 (Jun 1, 2026); https://cursor.com/blog/agent-best-practices (Jan 9, 2026); https://cursor.com/docs/cloud-agent/automations (fetched 2026-07-03).

---

## Synthesis-ready summary (one line per field)

| Field | Status | Primary surface | Visible |
|---|---|---|---|
| Goal | IMPLICIT | composer prompt; nearest: Plan Mode plan file (co-authored), Automations prompt | before (plan), then buried |
| Scope | AUTHORED, shredded | `.cursor/rules/*.mdc` globs, `AGENTS.md`, `.cursorignore`, `permissions.json`, env/worktree picker | before; never merged |
| Non-goals | MISSING | fragments as negations in rules / `block_instructions` / plan-todo deletion | never as such |
| Tools & permissions | AUTHORED, 3 disjoint planes | Run Mode (Settings), `permissions.json`/`sandbox.json`, hooks deny, per-automation tool grants | before + during prompts; no resolved view |
| Stopping condition | MISSING (DIY) | `stop` hook `followup_message` + `MAX_ITERATIONS` pattern; prose "quality bar" in automation prompts; Stop button | condition never rendered |
| Evidence | IMPLICIT (standards authorable via `BUGBOT.md`) | `Cursor Bugbot` CI check, Review → Find Issues, diff view, browser screenshots | after (and during diffs); never demanded before |
| Escalation | IMPLICIT (except spend alerts) | Auto-review interruptions; iOS push "finishes / needs input / ready for review"; Slack completion; admin spend alerts to Slack/email | during/after; not declarable per run |
| Budget | AUTHORED, wrong granularity | Dashboard Spending tab monthly limits + member overrides + spend alerts; no per-run budget | dashboard only, never at dispatch |

Cross-cutting angle for the visualizer: Cursor has every field *somewhere*, but the eight concerns live in at least seven different containers (composer message, home-directory plan file, repo dotfiles, IDE Settings pane, `hooks.json`, a SaaS dashboard, and a PR check on GitHub), with three different owners (the dev, the repo, the org admin) and no surface that assembles them for a given run before it starts.

## contrast

# Contract mapping — two extremes (verified 2026-07-03)

Sources: eve 0.19.0 docs (npm tarball, published 2026-07-02, identical to github.com/vercel/eve main `docs/`); docs.devin.ai (fetched 2026-07-03: creating-playbooks, knowledge, automations, slack). Builds on `/Users/arielconti/workspace/agentic-craft/audits/autonomy-ui-verification-2026-07-03.md` (eve + Devin CLI sections already verified there).

---

## (a) vercel/eve 0.19 — framework: the contract is code you author, or it doesn't exist

| Field | Where it lives | Status |
|---|---|---|
| **GOAL** | No field. Per-run goal is the inbound message, a schedule's `markdown` prompt, or a subagent task. Standing identity is `agent/instructions.md` (always-on system prompt). Closest first-class thing: `defineAgent({ outputSchema })` — a typed *shape* of the outcome for task-mode runs (subagent/schedule/remote job), not the outcome itself. | **Partial** — outcome shape typed, outcome prose |
| **SCOPE** | First-class but scattered across surfaces: which tools exist (`agent/tools/`, `disableTool`), connection allowlists (`operations.allow` on MCP/OpenAPI), sandbox `networkPolicy` (`"allow-all"` default / `"deny-all"` / domain map, settable per-session in `onSession` or mid-turn). | **First-class, distributed** |
| **NON-GOALS** | Nothing. Prose in instructions.md if you write it. `responsible-use.md` explicitly hands aggregate policy to the developer ("Unless you configure stricter controls, eve agents may operate with permissive settings"). | **Absent** |
| **TOOLS & PERMISSIONS** | The richest field: per-tool and per-connection `approval` — `always()`/`once()`/`never()` or a custom async policy receiving `{ session, toolName, toolInput, approvedTools }` returning approval statuses; policies can key off `auth.current` vs `auth.initiator`. Default is permissive (`omitted approval` = `never()`). | **First-class API** |
| **STOPPING CONDITION** | No goal predicate anywhere; task-mode sessions "run to completion or fail." The only hard stop is budget-shaped: token limits throw `SESSION_TOKEN_LIMIT_REACHED`. Nothing like Claude Code's `/goal`. | **Absent (budget-as-stop only)** |
| **EVIDENCE** | Dev-time only: `defineEval` framework (`t.succeeded()`, `t.calledTool()`, `t.check`, LLM-judge, Braintrust reporters) drives the real HTTP surface. Runtime has stream events + `agent/instrumentation.ts` telemetry, but no per-run proof-of-work requirement. | **Dev-time yes, per-run no** |
| **ESCALATION** | Approval *is* escalation: a gated tool parks the run, emits `input.requested` to whatever channel the session lives in (Slack buttons, TUI prompt); denials emit `rejected`; replay fails closed since 0.13.7. But "who gets involved" is just "whoever is on the channel" — no escalation-target config. | **Mechanism first-class, target implicit** |
| **BUDGET** | `defineAgent({ limits })`: `maxInputTokensPerSession` (default 40M root / 5M subagent), `maxOutputTokensPerSession` (unset by default), `maxSubagentDepth` (default 3). No time, attempt, or cost budget at the agent level. | **Tokens + depth first-class; time/attempts absent** |

**Shape:** eve gives first-class API to exactly the fields a framework can enforce — permissions, budget, escalation mechanics — and deliberately declines the semantic fields (goal, non-goals, stopping, evidence), documenting in `responsible-use.md` that composing them is the developer's job. The contract exists only if the developer writes it, spread across five files.

## (b) Devin — product: the contract is a named-sections form, enforced only at the meter

| Field | Where it lives | Status |
|---|---|---|
| **GOAL** | Session prompt + Playbook **"Specifications"** section — literally "postconditions describing the desired end state." Named field, prose, unenforced. | **Named field (prose)** |
| **SCOPE** | Repo selection per session + **Knowledge**: standing context items with a required **trigger description** (semantic retrieval cue) and **pinning** (all repos / one repo). Docs draw the line explicitly: recurring workflow → Playbook; standing convention → Knowledge. | **Named artifacts (prose, retrieval-based)** |
| **NON-GOALS** | Playbook **"Forbidden Actions"** — "actions Devin should absolutely avoid." The only shipping product with non-goals as a literal named field. Prompt-level, not policy-enforced. | **Named field — rare** |
| **TOOLS & PERMISSIONS** | Org plane, not per-run: integrations granted at org level, secrets manager; Devin CLI has 5 permission modes (Normal/Accept Edits/Bypass/Autonomous/Plan) over 5 config precedence layers, org deny/ask rules surviving even Bypass, no merged-policy viewer (per prior audit). Playbooks carry none of this. | **Org-managed, outside the contract artifact** |
| **STOPPING CONDITION** | Prose Specifications, plus one measurable stop: Automations' **"ACU limit per session"** — "If Devin hits the limit, the session stops." The only enforced stop is the budget, not the postcondition. User-side: `sleep` / `archive` in Slack. | **Enforced stop = budget, not goal** |
| **EVIDENCE** | Convention: Playbook Procedure's delivery steps (tests, lint, PR); deliverable is a PR with CI. No required evidence field; docs warn "Devin may make mistakes. Please double-check responses." | **Convention only** |
| **ESCALATION** | Upfront half is named: Playbook **"Required from User."** Mid-run escalation is emergent chat — Devin asks in-thread in Slack (@Devin sessions), notifications optional; docs specify no formal blocked/permission escalation workflow. | **Upfront named; mid-run informal** |
| **BUDGET** | Strongest field in any product examined: **ACU** is a literal priced unit; per-session ACU limits on automations, **invocation limits** per time window ("at most 10 invocations per hour"), org usage budgets in Settings > Usage and Limits, and product nudges to keep sessions under ~10 ACUs. | **First-class, metered, priced** |

**Shape:** Devin's Playbook is the most contract-shaped artifact shipping — five of Osmani's eight fields appear as named prose sections (goal/Specifications, non-goals/Forbidden Actions, escalation-input/Required from User, plus Procedure and Advice). But every semantic field is unenforced prompt text; the only fields with teeth are the ones tied to billing (ACU/invocation limits) and org admin (permissions).

## Contrast punchline

The two extremes fail in opposite directions. eve enforces what it can't understand (tokens, approvals, depth) and refuses to represent what it can't enforce — the contract is real but exists only as code scattered across `agent.ts`, `tools/*.ts`, `sandbox/`, and channel config, with no single artifact. Devin represents nearly the whole contract in one artifact — the Playbook even has Forbidden Actions as a field — but enforces none of it except the meter. Framework: contract as ungathered code. Product: contract as unenforced form. Osmani's "every run preceded by a contract" exists at neither extreme as a checked, gathered, per-run object.
