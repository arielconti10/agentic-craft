# Concept-to-pattern translation (2026-07-03)

Autonomy-ladder concepts translated into familiar interaction patterns; grounded in the design wiki (~/wiki) and shipping products. Input for the autonomy-instruments visualizer v4.

---

# Autonomy Instruments v4 — Concept→Pattern Synthesis

Governing law, restated from the evidence: **the ladder, quadrant, contract, policy block, meters, and shelf are all *coordinates or documents* — constant renderings of occasionally-relevant abstractions. Every successful shipped analog renders the actor's observable state instead, inside a schema the user's hands already know.** The wiki gives the mechanism: recognition over recall (UX-014), task-domain vocabulary (UX-462), salience/habituation (always-visible = learned-invisible), and change-blindness marking (UX-196) jointly predict that any glance requiring taxonomy-decoding fails, and any glance reusing badge/gear/dot/receipt/check schemas succeeds.

Path prefix used below: `WIKI = /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live`

---

## 1. The Translation Table

| Concept | The user's job (plain words) | The familiar pattern (strongest wiki citation) | Shipping embodiment | v4 directive |
|---|---|---|---|---|
| **Levels L0–L5** | Know at a glance what this run will do *without asking me first* | Status badge / entity-state indicator — `WIKI/Design Systems & Tokens/Status Badge and State Indicator System.md` (UX-128); vocabulary per `WIKI/Cognitive Load/Mental Model Alignment Bridge the Gap Between User Expectations and System Behavior.md` (UX-462) | Camera mode dial (Auto/P/A/S/M); Claude Code `⏵⏵ accept edits on`; Factory Off/Low/Med/High | One behavioral badge ("Asks first" / "Edits freely" / "On its own until done") in a fixed status position; the six levels exist only as named detents inside that one control — never as a rendered ladder. |
| **Level switching mid-task** | Tighten or loosen the leash in one motion, mid-run, and never be wrong about which leash applies next | Immediate-effect toggle — `WIKI/Component Patterns/Toggle Switch Immediate-Effect Binary Settings.md` (UX-052); marked transitions per `WIKI/Feedback & Error Handling/Change Blindness Mark State Changes Explicitly.md` (UX-196) | Car gearshift/PRND; Shift+Tab cycling (Claude Code, Cursor); Claude Code plan-approval gear choices | One cyclable composer control, effective instantly, flashing on change and leaving a standing marker; plus a hold-to-supervise quasimode ("grab the wheel" for one action); gear changes also offered as named options at natural transitions (plan approval, first failure). |
| **Agency×orchestration position** | Sense whether the agent is beside me, nearby and grabbable, or far away and coming back with results | Presence indicators — `WIKI/Interaction Patterns/Presence Indicators for Collaborative Editing.md` (UX-254); indicator-type-as-distance per `WIKI/Loading & Performance Perception/Match Loading Indicator to Operation Type and Duration.md` (UX-269) | Slack presence dot + status line; GM Super Cruise light bar; Uber/delivery tracking; Codex Local/Worktree/Cloud picker | One presence row per run: dot (waiting-on-you / working-will-ask / on-its-own / done-needs-review) + place token (here/worktree/cloud/×3) + next-contact clause + takeover control on the row; every state crossing gets a transient highlight. |
| **Goal + stopping condition** | Tell it what I want and when to stop, as fast as messaging a colleague | Postel's-Law parse-echo — `WIKI/Forms & Input/Postel's Law Accept Varied Input, Output Consistent Data.md` (UX-207); agent-proposed per `WIKI/Interaction Patterns/Mixed-Initiative Design Patterns for AI Agents.md` | Calendar quick-add (prose in, editable structure out); CI required checks as "done"; Claude Code `/goal` ◎ | One prompt box; the system parses and echoes a quiet "Done when: tests in test/auth pass · or 20 turns" line of inline-editable tokens; if no stop is inferable, the agent proposes one. Never a form. |
| **Scope + non-goals** | Point at what it may touch, flag what it must leave alone, without enumerating the world | Faceted-filter chips — `WIKI/Search Filter & Sort/Faceted Search Show Filters and Results Simultaneously.md` (UX-325); locked-exclusion rendering per `WIKI/Workflow & Multi-Step Processes/Eligibility Transparency in Bulk Actions.md` (UX-347) | Email To/Cc chips; iOS "Select Photos…" vs "All Photos"; `.gitignore`; Cursor @-mentions | One chips row on the composer: include-chips (via @-mention, live resolve counts) and lock-badged exclusion chips in the same row, instant-apply, savable as named scope views. |
| **Layered defaults (assembly)** | Trust the standing setup; see only what's different about *this* run | Hierarchical settings + modified indicators — `WIKI/Enterprise & B2B Patterns/Hierarchical Settings Architecture.md` (UX-178); pre-assembly per `WIKI/Behavioral Psychology/Status Quo Bias and Strategic Default Settings.md` (UX-365) | VS Code "Modified in: Workspace" + `@modified`; Figma override dots; Claude Code `/permissions` source attribution | Never render the assembled contract; render the diff: "Using **eve-chat** defaults · 2 changed for this run," each override with a modified-dot, source badge, and reset; the full stack lives behind one disclosure. |
| **The seal / commitment** | Glance at what I'm setting loose, feel its weight, send — without being interrogated | Calibrated friction + undo-over-confirm — `WIKI/Interaction Patterns/Appropriate Friction for AI-Powered Actions.md` (UX-250); `WIKI/Usability Heuristics/User Control and Freedom Undo Over Confirmation.md` (UX-335) | GitHub PR-create dialog; checkout order review; Gmail Undo Send; banking hold-to-transfer | The send button *is* the seal: one-line receipt above it in PR-create grammar (`Fix auth flake · scope: src/auth (−billing 🔒) · done when tests pass · ~$5`), click-to-edit fragments; instant dispatch + 10s undo toast for reversible runs; real confirmation only for irreversible grants (push-to-main, spend-over-threshold). |
| **Tools & permissions** | What can this thing touch right now — and is it touching anything sensitive this second? | OS permission sheet / least-privilege rendering — `WIKI/Enterprise & B2B Patterns/Permission-Based UI Rendering (Least Privilege).md`; no silent denials per `WIKI/Enterprise & B2B Patterns/Graceful Permission Denial.md` | iOS/Android permission sheets; macOS camera/mic orange dot; OAuth scope screens; Claude Code `/permissions` | Replace MAY/MUST-NOT with 5–7 capability rows (Read files / Edit / Run / Network / Git push / MCP), tri-state badge (runs freely / asks first / blocked), live "in use" dot while exercised; denials render inline in-thread as "Blocked: git push — Allow once?" which *is* the policy editor. |
| **Budget** | Don't get surprised: rough runway if I look, reliable alert when it matters | Threshold-based alerting — `WIKI/Dashboard Design/Alert and Threshold-Based Notifications.md`; meter-blindness per `WIKI/Cognitive Load/Inattentional Blindness Mitigation Don't Rely on Peripheral Visibility.md` | Fuel gauge + low-fuel light; carrier data SMS at 80%/100%; prepaid credit; Codex `reminder_interval_tokens` | Delete the gauges: a cap field at dispatch ("up to $5 / 30 min"), one battery-percent-style remaining figure in the status row, and exactly two in-thread threshold events — amber at 80%, a decision point at 100% ("Add $2 / Wrap up / Stop"), never a silent death. |
| **Escalation (who/when)** | Trust it will reach the right person at the right urgency, and nothing gets lost — so I can stop watching | Conditional routing announced upfront + severity tiers — `WIKI/Workflow & Multi-Step Processes/Conditional Approval Routing.md`; `WIKI/Feedback & Error Handling/Habituation Calibrate Alert Frequency to Maintain Urgency.md` | PagerDuty severity→channel + timed escalation; GitHub review-requested queue; iOS Focus "Time Sensitive"; Claude Code "Needs input" grouping | A "Needs you" inbox of question cards (what/which/why, oldest first, amber past SLA); only the top severity tier may interrupt via toast/push; the policy is one printed sentence on the run header ("Interrupts you for: git push, spending, anything outside the repo — everything else logged"); recipient is a routable field with on-behalf-of trail. |
| **Approval gates & tiering** | Approve the handful that genuinely need me, fast, without being trained to click OK | Friction matrix (consequence × reversibility) — `WIKI/Interaction Patterns/Appropriate Friction for AI-Powered Actions.md` (UX-250); severity-matched presentation per `WIKI/Feedback & Error Handling/Error Severity Categorization Match Presentation to Impact.md` | Gmail Undo Send; PR batched review + CI gate; GitHub type-the-repo-name; sudo; Cursor Auto-review's ~7% interrupt rate | Three fixed tiers with distinct, learnable renderings: reversible → act + undo toast + checkpoint; reviewable → accumulate into a PR-style checkpoint ("14 edits ready"); irreversible/external → real interrupt with blast-radius copy, Cancel focused, type/hold-to-confirm only for catastrophe class. A gate firing more than a handful of times per run is mis-tiered by definition. |
| **Evidence** | Decide "can I accept this without redoing it myself?" at the moment it claims done | Proportional success confirmation — `WIKI/Feedback & Error Handling/Success State Confirmation.md` (UX-198); review-path parity per `WIKI/Human Biases in Interfaces/Automation Bias (Algorithm Aversion Complement Automation Complacency).md` (UX-553) | CI checks block on a PR; order confirmations; Codex task-page artifacts; Symphony proof-of-work posts | A CI-style checks block *inside the completion message*: one plain line per claim, pass/fail glyph, expanding to the raw artifact, accumulating as steps finish, sitting directly above accept/reject. |
| **Calibration** | Decide occasionally: should I watch the next run less (or more) closely? | Override-rate as the metric + moment-of-decision nudges — `WIKI/Human Biases in Interfaces/Automation Bias (Algorithm Aversion Complement Automation Complacency).md` (UX-553); `WIKI/Interaction Patterns/Progressive Autonomy Levels for AI Agents.md` | Gmail spam ("report spam" at the error moment); Screen Time weekly digest; Tesla safety *reports*, not gauges | Delete the meters: (1) inline nudge at the decision moment ("Accepted the last 12 unchanged — auto-approve file edits?") and automatic announced *scoped* downgrade on error; (2) a weekly digest row in the run history. The trust number never gets a permanent pixel. |
| **Subagents / delegated work** | Know delegated work exists and whether it needs me, without reading it until I choose | Expandable row detail inside a job queue — `WIKI/Data Display & Tables/Expandable Row Detail (Inline Master-Detail).md` (UX-089); line anatomy per `WIKI/Workflow & Multi-Step Processes/Asynchronous Bulk Processing with Job Monitoring.md` (UX-353) | Cursor's one-line subagent; package-tracking rows; airport departures board; Claude Code Agent View | One line in-thread at the point of delegation (name · status · one metric) → inline card with exactly two artifacts (the prompt given, the report returned) → panel only when *state* earns it (needs input, reviewable diff); parallelism = adjacent lines, hierarchy ≤ 1 indent, no topology diagram. |
| **Run journal / replay** | Reconstruct what happened after the fact — on anomaly, question, or undo; never when things went fine | Filterable plain-language activity log + version history — `WIKI/Enterprise & B2B Patterns/Activity Log UI with Filterable Timeline.md` (UX-176); `WIKI/Interaction Patterns/Version History for Collaborative Content.md` (UX-246) | Bank statement (entered via the suspicious charge); Docs "last edit was…"; Claude Code `/rewind` prompts-as-checkpoints | A place users *land*, not live: three entry points only — chevron on a run's completion summary, a bank-statement list of runs (date · goal · outcome · cost), and deep links from anomaly moments; checkpoints indexed by human decisions; every mutating entry carries its before/after diff so restore is one preview away. |

---

## 2. The v4 Redesign Brief

Each failed v3 element and its explicit replacement, **ranked by how much the swap clarifies the demo**:

**1. The contract document → the composer receipt system.** (Biggest clarity win — the demo *opens* here, and it's the fullest before/after.) The contract is never shown as a document. It exists as four ephemeral composer elements — the "Done when:" parse-echo, the scope chips row, the "Using defaults · 2 changed" line, and the one-line receipt above Send — and **only the receipt persists**, becoming the run's header in the thread, which every during-run and post-run surface anchors to. Gmail-compose crossed with the GitHub PR dialog. This also occupies the empty quadrant the contract audit found ("gathered *and* checked, per run") while shipping zero literal instruments.

**2. The agency×orchestration quadrant → the presence row + the badge.** (Most emblematic failure; the swap is instantly legible on screen.) Agency collapses into a status dot's color; orchestration collapses into a place token (here / worktree / cloud / ×3); the level collapses into one behavioral badge; "how far away is it" becomes a next-contact clause. Reads as Slack-member-row × delivery-tracker. Takeover control lives on the row itself (distance display and grab-handle are one design, per UX-553).

**3. The evidence shelf → the checks block in the completion message.** (Peak-end: the ending is what the clip's viewers remember, per `WIKI/Human Biases in Interfaces/Peak-End Rule (Evaluative Memory Heuristic).md`, UX-570.) Evidence is not a place; it's the run's success state, scaled to significance — CI-grammar lines that appear as steps finish and terminate in accept/reject.

**4. The resolved-policy MAY/MUST-NOT block → the OS permission sheet + camera dot.** Tri-state capability rows, live in-use dot, and denials-as-inline-teachable-moments ("Blocked: git push — Allow once?"). Glanced rarely; demo shows it once, on demand.

**5. The calibration meters → nothing visible.** (Lowest demo screen-time but the purest proof of the thesis: the best calibration UI ever shipped — spam filtering — is invisible.) Nudges at decision moments, scoped auto-downgrades on error, a weekly digest row. In the demo this is one moment: the "You've accepted the last 12 unchanged — loosen?" nudge.

### Progressive-disclosure decisions (what is NOT visible by default)

- **Default-visible (the entire standing UI):** the behavioral badge, the presence row per run, the composer's receipt line, the "Needs you" queue badge count, the budget-remaining figure. That's it — five glanceable items, all actor-state, none conceptual.
- **One click away:** permission sheet, defaults-diff disclosure, run's checks-block artifacts, subagent cards, scope-view management.
- **Landed on only by trigger, never resident:** the journal (anomaly deep links, completion chevron, statement list), calibration digest, the full inherited-defaults stack.
- **Never rendered anywhere:** the L0–L5 numbers, the quadrant coordinates, the assembled contract, the trust score, orchestration topology.

### What earns a line vs a card vs a page (the Cursor rule, generalized)

- **A line** — earned by *existence*. Any delegated unit, any check, any journal entry: name · status · one metric (UX-353 anatomy).
- **A card (inline expand)** — earned by *a click*, containing exactly two artifacts: the order (prompt/claim) and the deliverable (report/log/diff). Compact-detail criterion per UX-089.
- **A page/panel** — earned by *state*, never by existence: needs-input, or a reviewable artifact set (diff + checks). Master-detail territory (UX-137).
- **Hard cap:** disclosure depth ≤ 3 levels (`WIKI/Cognitive Load/Progressive Disclosure Reveal Complexity on Demand.md`, UX-448). Line → card → panel. Orchestration topology dies at this cap, on purpose.

---

## 3. Tensions & Judgment Calls

Framed as questions for the designer, not prescriptions:

1. **Cheap switching vs. dangerous detents.** UX-052 demands the gear change execute instantly with zero friction; UX-250/UX-562 demand that bypass/full-access never be cheap or resting. Claude Code resolves this by excluding `bypassPermissions` from the Shift+Tab cycle. *Question: does v4's cyclable control skip the top gear entirely (requiring a deliberate separate gesture), and does that asymmetry strengthen or break the gearshift schema you're selling?*

2. **Behavioral badge vs. perceptible order.** "Asks first" is recognized on sight (UX-014) but hides the ladder's ordering — a camera dial shows *all* detents and your position among them; a badge shows one state. The ordered-set idea is part of the client's conceptual contribution. *Question: does the control-open state (the moment of cycling) show the full detent row so the order is learnable, or is order genuinely irrelevant to operation?*

3. **Zero permanent pixels vs. visibility of system status.** The salience notes say always-visible elements go learned-invisible; UX-188 says status must be visible where actions happen. v4 still ships five standing items (badge, dot, place, budget %, queue count). *Question: which of these five survive real-usage habituation testing — and is the budget figure the first to demote to expand-on-click?*

4. **Parse-echo vs. form creep.** Postel's Law says echo the parse; form-shortness (UX-208) says every standing element is a field you're asking about face-to-face. "Done when" line + chips row + defaults line + receipt = four rows under a prompt box — arguably the contract document reborn in composer clothing. *Question: which of the four collapse into the receipt line alone until touched, and does the demo show the empty-composer state or the fully-decorated one?*

5. **Manufactured reversibility vs. the world.** The gate tiering rests on the system classifying reversibility, but checkpoints reverse *files*, not side effects (a sent email, a network call, a spend). Misclassification in tier 1 is the catastrophic failure mode of the whole design. *Question: is the tier assignment itself user-visible and editable (a row on the permission sheet?), and does anything external-facing ever get tier 1 even with a delay window?*

6. **Familiarity vs. the framework's visibility.** The deepest tension: v4's success criterion is that the agency×orchestration model, the six levels, and the contract *disappear from the pixels entirely* — yet the demo clip exists to promote that very framework. The concepts live in the writing; the UI shows only their shadows (badge, dot, receipt). *Question: is the clip's narrative "here is the framework" with the UI as proof it can vanish, or does the demo need one deliberate x-ray moment (a debug overlay?) where the shadows are mapped back to the concepts — and can that moment avoid becoming v3 again?*

7. **Routable escalation vs. single-user reality.** The delegation/routing patterns (Conditional Approval Routing, Delegation and Backup Approvers) fix a real gap the audit found — every product hardcodes "whoever owns this terminal" — but the demo is one person at one machine. *Question: build the recipient field for real, or print the routing sentence and defer the field to the multi-player story?*

---

## 4. The One-Sentence Design Thesis

**Autonomy isn't a diagram you read — it's a set of controls you already know how to drive: a gear you shift, a dot you glance, a receipt you scan, a light that comes on when fuel runs low, and a row of checks that turns green.**

---

# Appendix: cluster translations

## levels

# Cluster: THE LEVELS THEMSELVES — translated into patterns humans already operate

Grounding: product reality verified in `/Users/arielconti/workspace/agentic-craft/audits/autonomy-ui-verification-2026-07-03.md` (no shipping product renders a numbered ladder; Replit shipped one and retired it; Factory's "Autonomy Level" is the lone named-dial exception and it tiers command risk only) and `/Users/arielconti/workspace/agentic-craft/audits/contract-field-reality-2026-07-03.md` (autonomy is factored across mode + placement + continuation dials, never one axis).

---

## a) The six levels L0–L5 as user-facing state

**User's job:** At a glance, before looking away, know what this run will do *without asking me first*.

**Wiki patterns that carry this job:**

- **Status Badge and State Indicator System** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Design Systems & Tokens/Status Badge and State Indicator System.md`, UX-128) — a run's level is an *entity state*, not a scale position. Render it the way every enterprise app renders workflow state: a badge with a 1–2 word label + semantic color, same vocabulary everywhere, "never color alone." Users already parse "Active / Pending / Draft" badges across every list at a glance; they will parse "Asks first / Edits freely / On its own" the same way.
- **Mental Model Alignment** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Cognitive Load/Mental Model Alignment Bridge the Gap Between User Expectations and System Behavior.md`, UX-462) — "use naming that reflects the user's task domain vocabulary, not the system's internal data model: 'Your Invoices,' not 'Transactions'." L0–L5 is the system's internal data model. The user's task vocabulary is behavioral: what it does before it asks. This is exactly why every shipping product (Claude Code "Ask before edits", Codex "Read Only / Auto / Full Access", Kiro "Supervised / Autopilot") converged on behavior-phrases and why Replit's labeled ladder died.
- **Recognition Rather Than Recall** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Cognitive Psychology/Recognition Rather Than Recall.md`, UX-014) — a numbered level forces recall of a taxonomy ("what did L3 mean again?"); a behavioral label is recognized on sight. The number is a lookup key to a table the user doesn't have; the phrase *is* the table row.
- **Active State Visibility in Navigation** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Navigation & Information Architecture/Active State Visibility in Navigation.md`, UX-283) — the current level should pass the same test as an active nav item: identifiable in ~1 second, in a fixed location, distinct by weight/shape as well as color. The level is "where you are," so render it as location, not as a datum.
- **Visibility of System Status** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Feedback & Error Handling/Visibility of System Status.md`, UX-188) — the level is a *promise about future feedback frequency*; it must live where actions happen (composer/status bar), not in a rail-mounted instrument.

**Shipping embodiments:**

- **Camera mode dial (Auto / P / A / S / M)** — the everyday proof that an ordered autonomy ladder ships as *named detents with a physical position*, not numbers. "Auto" means the camera decides; "M" means you do. Nobody has ever needed a quadrant to know which mode their camera is in.
- **Washing machine cycles ("Delicates", "Quick wash")** — behavior-named presets over parameter exposure; the level names what will happen to your stuff, not the agitation index.
- **iPhone Focus modes** — a named mode ("Do Not Disturb") with a glyph pinned in the status bar; the OS-level convention for "a standing behavioral state you set and glance at."
- **Claude Code status bar** — `⏵⏵ accept edits on` in a fixed status position, and **Factory's Autonomy Level (Off/Low/Medium/High)**: even the one product that ships an ordered dial uses words, not numbers (audit, verified 2026-07-03).

**REDESIGN DIRECTIVE:** Kill the ladder as a rendered artifact. Show one badge in a fixed status position per run — a 1–2 word behavioral promise ("Asks first" / "Edits freely" / "Runs everything" / "On its own until done") with semantic color and identical vocabulary across every surface; the six levels exist only as the ordered set of options in that one control, like detents on a camera dial.

---

## b) Level switching mid-task ("a good day touches several rungs")

**User's job:** Tighten or loosen the leash in one motion, mid-run, and never be wrong about which leash length applies to the *next* action.

**Wiki patterns that carry this job:**

- **Toggle / Switch — Immediate-Effect Binary Settings** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Component Patterns/Toggle Switch Immediate-Effect Binary Settings.md`, UX-052) — the gearshift contract: the change executes *the moment it is flipped*, no save step, instantly reversible, which makes experimentation cognitively cheap ("flip, observe, flip back"). A level switch that requires a settings page or a confirm dialog breaks the light-switch mental model and makes switching expensive — which is precisely Cursor's documented failure ("Run Mode buried in Settings"; forum users complain they can't "quickly shift granularity from micromanaging an agent to letting something run on its own," audit §cursor).
- **Change Blindness — Mark State Changes Explicitly** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Feedback & Error Handling/Change Blindness Mark State Changes Explicitly.md`, UX-196) — mode confusion *is* change blindness applied to modes: the state changed outside the locus of attention and the user acts on the stale model. The cure the note prescribes: a 1–2s highlight animation at the moment of change plus a *persistent* indicator for out-of-normal states. Every mode switch must both flash (transition) and stay marked (state).
- **Dirty State Indicators** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Interaction Patterns/Dirty State Indicators and Unsaved Change Warnings.md`, UX-236) — the "recording light" pattern: a persistent, non-intrusive marker for any standing condition that changes what your next action means. An elevated autonomy level is a dirty state of the session.
- **Default Effect (Status Quo Bias)** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Human Biases in Interfaces/Default Effect (Status Quo Bias).md`, UX-562) — "80% of users never change defaults… the default is the product." Cheap switching only works against a safe, labeled home position ("Recommended") the user can always snap back to; and the note's rule that irreversible territory should *remove* defaults maps directly to "bypass/full-access must never be the resting state" (matches shipped reality: Claude Code excludes `bypassPermissions` from the default cycle; repos can't grant themselves auto mode).
- **Schema Exploitation** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Cognitive Load/Schema Exploitation Leverage Familiar Patterns to Reduce Learning Overhead.md`, UX-451) — reuse the dominant switching idiom in the category rather than inventing one: the category has already standardized on Shift+Tab cycling (Claude Code and Cursor both) and Ctrl+L (Factory).

**Shipping embodiments:**

- **Car gearshift / PRND** — the client's own metaphor is already the right one: ordered positions, one motion, always visible, operated mid-drive without looking. Also its failure lesson: park-by-wire cars that hid the lever's position caused rollaway accidents — position must be legible, not just settable.
- **Push-to-talk / holding Shift (the quasimode)** — a mode that exists only while physically held cannot be forgotten. The known HCI cure for mode confusion is making temporary modes *muscle-held* rather than latched.
- **Caps Lock + its light** — the canonical mode-confusion failure and its canonical fix bundled in one key: a latched mode is tolerable only with a dedicated always-on indicator.
- **Claude Code's plan-approval dialog** — the best shipped "gearshift moment": approving a plan *is* choosing the next gear ("Approve and start in auto mode / Approve and accept edits / review each edit manually"), i.e., level changes offered as named options exactly at the natural transition point, not in settings (audit §claudeCode).

**REDESIGN DIRECTIVE:** One persistent cyclable control at the composer (click or Shift+Tab), effective instantly, that flashes on change and leaves a standing marker — plus a hold-to-supervise quasimode ("grab the wheel" for the next action only, without changing the resting gear), and offer gear changes as named options at natural transition moments (plan approval, first failure, escalation prompt) instead of anywhere else.

---

## c) The agency×orchestration "position" — sensing how far the thing is from you

**User's job:** Sense, without reading a chart, whether the agent is right beside you waiting, working nearby where you can grab it, or far away and coming back only with results.

**Wiki patterns that carry this job:**

- **Presence Indicators for Collaborative Editing** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Interaction Patterns/Presence Indicators for Collaborative Editing.md`, UX-254) — CSCW's finding: *awareness* (who is present, what they're working on, where their attention is) is the foundational requirement for working alongside another actor, and it's delivered by "ambient peripheral information: colored avatars, named cursor positions, activity signals" — not instruments. "How far is this agent from me" is the exact question Slack presence dots, Google Docs cursors, and "last seen" already answer for human collaborators. The quadrant failed because it plots the abstraction; presence renders the *actor*.
- **Match Loading Indicator to Operation Type and Duration** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Loading & Performance Perception/Match Loading Indicator to Operation Type and Duration.md`, UX-269) — the indicator *type* already encodes distance in every app: inline spinner = right here, blocking; persistent header progress = background but within reach; queued task row = far away, come back later. Choosing the signal by temporal distance is a convention users already operate.
- **Automation Bias** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Human Biases in Interfaces/Automation Bias (Algorithm Aversion Complement Automation Complacency).md`, UX-553) — calibrated trust: the farther the agent, the more the interface must keep the human's grab-handle prominent ("make the override path as prominent as the accept path"; "an override button that's visually buried is the same as no override button"). Distance display and takeover affordance are one design, not two.
- **Change Blindness — Mark State Changes Explicitly** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Feedback & Error Handling/Change Blindness Mark State Changes Explicitly.md`, UX-196) — distance *transitions* (asked→autonomous, local→cloud, working→needs-you) are the events that matter; they must be animated/marked at the moment of crossing or they're missed.
- **Visibility of System Status** (UX-188, path above) — the presence line is only honest if it updates whenever latency exists between the agent's action and the user's awareness.

**Shipping embodiments:**

- **GM Super Cruise steering-wheel light bar** — the automotive answer to "how far is the machine from me right now" is *not* "SAE Level 2" on the dash; it's an annunciator: green = it's driving, blue = you're driving, red flash = take over now. Color-coded possession of the wheel, at the wheel.
- **Slack/Teams presence** — green dot / away / DND + a status line ("in a meeting, back at 3"). The universally-operated grammar for "can I interrupt this actor, and when will they respond."
- **Delivery/Uber tracking** — distance rendered as stage + ETA ("preparing → on the way → 5 min away"), the consumer pattern for "an autonomous actor is doing my task elsewhere and here is when it next concerns me."
- **Cursor's compact run panel & Claude Code Agent View** — already presence-shaped: "On eve-chat · Changes +41 · Browser · 2 Terminals" is *placement + footprint*, and Agent View's grouping "Needs input / Working / Completed" is presence buckets (audit §claudeCode/§cursor). Codex's Local/Worktree/Cloud picker shows that the orchestration axis users actually understand is *where it runs*, not an abstract coordinate.

**REDESIGN DIRECTIVE:** Replace the quadrant with a one-line presence row per run — status dot with 3–4 presence states ("waiting on you" / "working, will ask" / "working on its own" / "done, needs review"), a place token (here / worktree / cloud / ×3 agents), and a next-contact clause ("next check-in: after tests" or an ETA) — so agency collapses into the dot's color, orchestration into the place token, and the whole reads like a Slack member row crossed with a delivery tracker; mark every crossing between presence states with a transient highlight and keep a takeover control on the row itself.

---

**Cross-cutting note for synthesis:** all three concepts resolve to the same substitution — the ladder/quadrant are *coordinates*, and every successful shipped analog renders *the actor's observable state* instead (badge, gear position, presence dot). The wiki's mechanism for why: recognition over recall (UX-014), mental-model vocabulary (UX-462), and change-blindness marking (UX-196) jointly predict that any representation requiring the user to decode a taxonomy at a glance will fail, and any representation reusing status-badge/presence/gearshift schemas (UX-128, UX-254, UX-052, UX-451) will feel instantly operable.

## authoring

# Pre-run authoring — re-translating the "run contract" into patterns humans already operate

Cluster: GOAL+STOP · SCOPE+NON-GOALS · ASSEMBLY · SEAL. Grounding: `/Users/arielconti/workspace/agentic-craft/audits/autonomy-ui-verification-2026-07-03.md`, `/Users/arielconti/workspace/agentic-craft/audits/contract-field-reality-2026-07-03.md`. Governing finding from the audits: no shipping product renders an assembled contract before a run; Claude Code and Codex both pack goal + stop + non-goals + budget into one 4,000-char `/goal` blob, and Cursor's only pre-run artifact is Plan Mode's editable markdown plan. The failure of v3 was rendering the contract as a *document to be read* instead of a *conversation with a receipt*.

---

## a) GOAL + STOPPING CONDITION

**User's job:** Tell the agent what outcome I want and when to stop — as fast as writing a message to a colleague, not as slow as filling in a legal form.

**Wiki patterns:**

- **Postel's Law — Accept Varied Input, Output Consistent Data** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Forms & Input/Postel's Law Accept Varied Input, Output Consistent Data.md`, UX-207). "Be liberal in what you accept, conservative in what you send." Accept natural language ("next Friday", "Q3 2025") and normalize; critically, for imports: "show what was parsed before committing." This is the pattern the contract form violated: it made the *user* do the structuring. The system should parse the prose prompt into goal/stop and show its parse back.
- **Keep Forms as Short as Possible** (`.../Forms & Input/Keep Forms as Short as Possible Eliminate Unnecessary Fields.md`, UX-208). "Treat every form field as a question you're asking face-to-face. If you wouldn't ask it at this point in the conversation, remove it." An 8-field contract fails this test instantly — most fields can be "derived, defaulted, or collected later." Also Parkinson's Law: optional fields invite over-deliberation.
- **Mixed-Initiative: Intent Preview** (`.../Interaction Patterns/Mixed-Initiative Design Patterns for AI Agents.md`). Before acting, the agent shows "what it plans to do, why, and what assumptions it's making," with approve/adjust/reject. The structured goal+stop should be *agent-proposed from the prompt*, user-corrected — not user-authored from blank fields.
- **Recognition Rather Than Recall** (`.../Cognitive Psychology/Recognition Rather Than Recall.md`, UX-014). "Re-display key prior selections at decision points." The audits show Cursor's goal "is the first composer message, which scrolls away" — the stop condition must persist as a visible object, not memory.

**Shipping embodiments:**

- **Calendar quick-add (Google Calendar, Fantastical)** — the everyday gold standard: you type "Lunch with Sam Friday noon," the parser echoes back structured fields (date, time, title) that you can correct inline. Prose in, editable structure out, zero form-feeling.
- **Flight/hotel search boxes (Google Flights, Airbnb)** — one text box plus 2–3 scoped chips (dates, travelers) with smart defaults; nobody calls it a form.
- **PR "definition of done": CI required checks + PR-template checklists (GitHub)** — the stopping condition as a short verifiable checklist ("tests pass, lint clean") that a machine evaluates, exactly what Claude Code's `/goal` docs coach in prose ("npm test exits 0… or stop after 20 turns") without ever rendering.
- **Claude Code `/goal`** — the richest agentic precedent per the audit: a live `◎` indicator plus a status view (condition, duration, turns, evaluator's latest reason) — but authored as an unstructured 4k blob.

**REDESIGN DIRECTIVE:** Keep one prompt box. As the user types (or on send), parse and echo back a single quiet "Done when:" line under the composer — calendar-quick-add style, e.g. `Done when: tests in test/auth pass · or 20 turns` — each fragment an inline-editable token, never a separate form. If no stop condition is inferable, the agent proposes one (Intent Preview), the user corrects it in place.

---

## b) SCOPE + NON-GOALS

**User's job:** Point at what the agent may touch, and flag the few things it must leave alone — without enumerating the world from memory.

**Wiki patterns:**

- **Faceted Search — Show Filters and Results Simultaneously** (`.../Search Filter & Sort/Faceted Search Show Filters and Results Simultaneously.md`, UX-325). "Show active filters as removable chips above the results set"; "avoid Apply buttons — apply filters immediately"; update counts dynamically. Scope is a filter over the workspace and should behave like one: chips + instant feedback about what falls inside.
- **Eligibility Transparency in Bulk Actions** (`.../Workflow & Multi-Step Processes/Eligibility Transparency in Bulk Actions.md`, UX-347). "The user's mental model of the action scope must match what the system actually processes"; visually differentiate ineligible items "with reduced opacity or a lock badge." This is exactly the non-goals rendering: excluded things shown as locked, not listed in a MUST-NOT clause.
- **Recognition Rather Than Recall** (UX-014, path above). "Offer autocomplete in all search and lookup fields" — @-mention pickers over free-text path typing; recall-free boundary drawing.
- **Saved Filters and Search Views** (`.../Search Filter & Sort/Saved Filters and Search Views.md`, UX-330). Name and reuse filter combinations ("My Open High-Priority Tickets"). Scopes recur per project ("frontend only," "docs + tests") — they should be savable, pinnable views, not re-authored per run.

**Shipping embodiments:**

- **Email To/Cc/Bcc chips + Google Drive share dialog** — the most practiced boundary-drawing UI on earth: type-ahead, chip appears, x removes it. Nobody has ever read a manual for it.
- **iOS permission scoping** — "Select Photos…" vs "Allow Access to All Photos," and Screen Time's "Always Allowed" apps list: include/exclude as a picker plus an exception list, one screen, OS-grade familiarity.
- **Cursor @-mentions / `.cursorignore`, Claude Code `--add-dir`** — the agentic half already exists (audit: scope is "authored but shredded ≥5 artifacts with no composed view"); `.gitignore` is the developer-native exclusion idiom.
- **Out-of-office / Do-Not-Disturb exceptions** — everyday proof that people can operate "everything except…" rules when they're phrased as a short allow/except pair.

**REDESIGN DIRECTIVE:** One chips row attached to the composer: included scopes as plain chips (added via @-mention/picker, showing a live count of files/tools they resolve to), exclusions as lock-badged chips in the same row ("`src/billing/` 🔒 don't touch"), removable with one click and applied instantly — no quadrant, no resolved MAY/MUST-NOT list, no separate panel. Offer "save this scope as a view" for reuse.

---

## c) ASSEMBLY — project defaults + standing rules + this run's overrides

**User's job:** Trust the standing setup and see, at a glance, only what's different about *this* run.

**Wiki patterns:**

- **Hierarchical Settings Architecture** (`.../Enterprise & B2B Patterns/Hierarchical Settings Architecture.md`, UX-178). Global → Organization → Personal, each level labeled with its blast radius ("affects all users"), plus "show the current value and last-modified-by metadata." Layered policy is a solved settings problem — what's missing (per the audits: Codex's ≥6 undocumented layers, Claude Code's 5-layer precedence computed "mentally") is rendering *provenance*.
- **Status Quo Bias and Strategic Default Settings** (`.../Behavioral Psychology/Status Quo Bias and Strategic Default Settings.md`, UX-365). Users accept whatever is pre-selected; "the default state of every setting… is a design decision," and opting out must stay "easy and visible." Implication: the run should ship pre-assembled from defaults, with overrides as visible deviations — never a blank contract.
- **Smart Defaults in Forms and Configuration** (`.../Forms & Input/Smart Defaults in Forms and Configuration.md`, UX-212). "Pre-complete wizard steps that can be inferred from account context"; "remember and re-apply user's last-used configuration."
- **Progressive Disclosure for Complex Feature Sets** (`.../Navigation & Information Architecture/Progressive Disclosure for Complex Feature Sets.md`, UX-286). 80/20: surface only what's changed; the full inherited stack lives behind one "advanced" disclosure.

**Shipping embodiments:**

- **VS Code Settings "Modified" indicators** — the canonical layered-defaults UI: a colored bar on every changed setting, a "Modified in: Workspace" badge, an `@modified` filter, and per-setting "Reset to default." Deltas legible, inheritance one click away.
- **Figma/CSS style overrides** — the blue "changed" dot on an overridden property with reset-to-style; designers operate three-layer inheritance daily without thinking about it.
- **Claude Code `/permissions`** — the best agentic precedent per the audit: merged rule list *with per-file source attribution* ("lists all permission rules and the settings.json file each rule comes from") — provenance exists, composition doesn't.
- **Flight booking fare summary** — "your fare includes" assembled from airline defaults + fare class + your add-ons, rendered as one short list with the add-ons visually distinct. Laypeople parse layered policy every time they buy a ticket.

**REDESIGN DIRECTIVE:** Never render the assembled contract; render the *diff against defaults*: one line reading "Using **eve-chat** defaults · 2 changed for this run," with each override carrying a modified-dot, its source badge ("project rule" / "this run"), and a reset affordance — VS Code-settings grammar exactly; the full inherited stack is a single disclosure away, not a standing panel.

---

## d) The SEAL — commitment before dispatch

**User's job:** Glance at what I'm about to set loose, feel its weight, and send it — without being interrogated.

**Wiki patterns:**

- **Appropriate Friction for AI-Powered Actions** (`.../Interaction Patterns/Appropriate Friction for AI-Powered Actions.md`, UX-250). Friction matrix on two axes — consequence × reversibility. "Low consequence + reversible: apply immediately with undo. High consequence or irreversible: require preview and explicit confirmation." The seal must be *calibrated*, not constant.
- **User Control and Freedom — Undo Over Confirmation** (`.../Usability Heuristics/User Control and Freedom Undo Over Confirmation.md`, UX-335). "Confirmations treat users as incapable of knowing what they want" — reserve them for the architecturally irreversible; otherwise proceed + undo. Most agent runs are sandboxed/checkpointed, i.e., reversible: dispatch should feel like *send*, not *sign*.
- **Confirmation Dialogs for Destructive Actions** + **Opt-Out Confirmation** (`.../Feedback & Error Handling/Confirmation Dialogs for Destructive Actions.md`, UX-202; `.../Feedback & Error Handling/Opt-Out Confirmation for High-Consequence Actions.md`, UX-192). When a confirmation *is* warranted, it must be specific ("Permanently delete 47 records" not "Are you sure?"), with the safe option focused — the run analog: name the concrete grants ("can push to main, ~$5 budget"), never restate the whole contract.
- **Commitment and Consistency Bias** (`.../Human Biases in Interfaces/Commitment and Consistency Bias (Foot-in-the-Door Behavioral Consistency Principle).md`, UX-558). Direct hit: "This confirmation step that asks 'Are you sure?' before completing a commitment flow is counterproductive… Reserve skepticism-inducing friction for genuinely irreversible actions." And: "Show users what they've already done before asking them to do more" — the seal is a *receipt of accumulated choices*, not a new decision.
- **Staged Disclosure** + **Bulk Import Five-Stage Workflow** (`.../Workflow & Multi-Step Processes/Staged Disclosure for Linear Multi-Step Processes.md`, UX-338; `.../Workflow & Multi-Step Processes/Bulk Import Five-Stage Workflow.md`, UX-349). "Always offer a way to review and edit previous steps before final submission"; final step = "summary count with a 24-hour rollback option" — commit with a parachute, not a padlock.

**Shipping embodiments:**

- **Checkout order-review page (Amazon, any store)** — items, address, total, "Place order": a receipt you *scan*, with every line linking back to edit. The most rehearsed consequential-submission pattern in existence.
- **Banking transfer review** — payee, amount, arrival date, then a proportionate gesture (swipe/hold/Face ID) whose *weight scales with the amount* — friction calibration made physical.
- **GitHub PR create dialog** — title, base ← compare, diff stats, reviewers, one green button; the dialog's summary *becomes the durable record of the run* (matches the client's Cursor reference: subagent = one line that expands to prompt + report).
- **Gmail Undo Send** — commitment with a grace window instead of a gate; the correct seal for reversible runs.

**REDESIGN DIRECTIVE:** The send button *is* the seal. Directly above it, render a one-line receipt in PR-create grammar — `Fix auth flake · scope: src/auth (−billing 🔒) · done when tests pass · ~$5` — where each fragment click-edits its section; dispatch reversible runs instantly with a 10s "Undo" toast, and reserve an actual confirmation (specific-consequence copy, safe default focused) solely for runs granted an irreversible capability like push-to-main or spend-above-threshold.

---

## Cross-cutting synthesis note

All four concepts collapse into one interface sentence the everyday web already teaches: **prompt box (a) + chips row (b) + "defaults · N changed" line (c) + receipt-above-send (d)** — a composer that looks like Gmail-compose crossed with the GitHub PR dialog. The "contract" is never shown as a document; it exists as the parse-echo, the chips, the diff line, and the receipt — and only the receipt persists into the thread as the run's header (which is also what the during-run and post-run surfaces should anchor to). This directly occupies the empty quadrant the contract audit identified ("gathered *and* checked, per run") while deleting every literal instrument v3 shipped.

## guardrails

# Guardrails During the Run — wiki-grounded re-translation (cluster report)

Grounding: /Users/arielconti/workspace/agentic-craft/audits/autonomy-ui-verification-2026-07-03.md and /Users/arielconti/workspace/agentic-craft/audits/contract-field-reality-2026-07-03.md (read, not re-researched). All wiki paths below were read in full.

Cross-cutting finding first, because it explains why all four instruments failed: the wiki's alert-system notes converge on one law — **presentation must be matched to consequence, and anything rendered constantly gets filtered out by the brain**. A quadrant, a policy list, and a set of meters are all *constant* renderings of *occasionally relevant* facts. Humans operate these facts through four familiar vessels instead: the permission sheet (granted once, glanced rarely), the gauge-plus-warning-light (glance on demand, interrupt on threshold), the inbox/pager (severity routes the channel), and the confirm/undo pair (friction proportional to reversibility). Every redesign below is one of those four.

---

## a) TOOLS & PERMISSIONS — replacing the "resolved policy" MAY/MUST-NOT list

**The user's job at that moment:** glance over and answer "what can this thing touch right now, and is it touching anything sensitive at this second?" — without reading a document.

**Wiki patterns that carry this job:**

- **Three disclosure patterns for capabilities** — hide / disable-with-tooltip ("Available to Admin users") / show-with-Request-Access. Capability disclosure is a per-item choice, rendered on the item, not a separate policy artifact. The note is explicit that the list exists to "prevent accidental unauthorized actions" and reduce cognitive overload, and that showing a *disabled* capability with the reason builds trust. → /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Enterprise & B2B Patterns/Permission-Based UI Rendering (Least Privilege).md
- **Never let a denial be discovered by failing** — permissions get evaluated up front and the unavailable thing renders muted with a lock icon and one-line reason; a bare 403 is "a UX failure — the navigation was misleading." Applied to agents: the *agent's* denials are moments the user learns the policy, so each one should render as "blocked by rule X — allow once?" not as a silent classifier event. → /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Enterprise & B2B Patterns/Permission-Aware Navigation Design.md and /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Enterprise & B2B Patterns/Graceful Permission Denial.md
- **Visibility of system status** — the user must know what the system is doing *now*, not what it is allowed to do in the abstract; "silent systems create confusion and loss of confidence." This is the case for an in-use indicator (which capability is being exercised this second) rather than a static policy rendering. → /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Feedback & Error Handling/Visibility of System Status.md
- **Jakob's Law / external consistency** — "users spend most of their time in other products"; the permission mental model people already own is the OS app-permission sheet, so violating that convention (with a MAY/MUST-NOT legal document) imposes a re-learning burden for zero benefit. → /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Design Systems & Tokens/Consistency and Standards.md

**Shipping embodiments:**

- *Everyday (the model to copy):* **iOS/Android app permission sheets** — one row per capability, icon + plain noun, tri-state (Allow / Ask / Never), grouped under the app; **macOS/iOS camera-mic orange dot** — a live "in use right now" indicator that appears only while the capability is exercised; **Google/GitHub OAuth scope screens** — capabilities as plain verb sentences ("Read access to code. Write access to pull requests."), shown at grant time; **Screen Time / parental controls** — allowed apps as a checklist, not a rulebook.
- *Agentic:* Claude Code's `/permissions` (merged allow/ask/deny rules with per-file source attribution — the industry's best, and still a rule list, not a capability sheet) and its status-bar mode string (`⏵⏵ accept edits on` — one line, glanceable); Codex `/status` printing "approval policy, writable roots" (right content, wrong form: a text dump); Cursor's run-mode label. Per the audit, nobody renders resolved policy as anything a human recognizes.

**REDESIGN DIRECTIVE:** Replace the MAY/MUST-NOT list with an OS-style permission sheet: 5–7 capability rows (Read files / Edit files / Run commands / Network / Git push / MCP tools), each with icon, plain-verb label, and a tri-state badge (runs freely / asks first / blocked), and put a live "in use" dot on a row while the agent is exercising it — the camera-dot move. Denials never happen silently: each renders inline in the thread as "Blocked: git push (asks first) — Allow once?", which is also how the user edits the policy.

---

## b) BUDGET — replacing the calibration meters

**The user's job at that moment:** not get surprised — know roughly how much runway is left if they happen to look, and be reliably told when it actually matters.

**Wiki patterns that carry this job:**

- **Threshold-based alerts turn a passive display into a decision-support system** — the canonical config is metric → condition → threshold → channel, with snooze; without thresholds "either the team must constantly monitor dashboards or they discover issues reactively after impact." That sentence is the exact indictment of a budget *meter*: it demands constant monitoring. → /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Dashboard Design/Alert and Threshold-Based Notifications.md
- **Always-on indicators are learned-invisible** — "never rely on persistent always-visible elements for critical alerts — they will eventually be ignored"; a single flash on change beats a constantly present gauge. → /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Cognitive Psychology/Attention is Selective Design for Salience.md
- **Inattentional blindness** — elements that are "always there but intermittently become critical" (a meter crossing 90%) are reliably missed when attention is on the primary task (the thread). A right-rail meter is the textbook case. → /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Cognitive Load/Inattentional Blindness Mitigation Don't Rely on Peripheral Visibility.md
- **Progress-bar discipline for the foreground case** — determinate when remaining work is computable, always paired with a number/ETA ("1,247 of 5,000 — ~2 min"), persistent-but-small in the status bar for background tasks, completion notification for long ops. This tells you when a meter *is* right: while the user is actively watching a bounded run. → /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Component Patterns/Progress Bar Determinate and Indeterminate Patterns.md

**Shipping embodiments:**

- *Everyday:* **fuel gauge + low-fuel light** — the division of labor in one object: gauge for on-demand glancing, light for the one threshold that changes behavior; **carrier data-usage bar + the 80%/100% SMS** — nobody watches the bar, everybody acts on the text; **bank spending caps with threshold pushes** ("$450 of your $500 dining budget"); **Screen Time's "5 minutes left"** — an interrupt at the limit, not a persistent meter; **prepaid credit** — spend-down from a committed cap set up front.
- *Agentic:* Claude Code `/usage` ("Total cost: $0.55", plan-limit bars) and `/goal` status token spend — on-demand readouts, the right instinct; Codex `rollout_budget.limit_tokens` with `reminder_interval_tokens` defaulting to 10% of limit — literally the threshold-alert pattern, shipped but buried in config with no UI. Per the audit, no product lets you set a budget at dispatch in an interactive surface — the composer cap is genuinely novel.

**When is a meter right vs an alert:** meter when the user is foreground-watching a bounded run (then it's a progress bar with numbers); alert when the run is backgrounded (then only threshold crossings surface, as events in the thread/inbox). A meter shown to an unwatching user is wallpaper; an alert fired at a watching user is noise.

**REDESIGN DIRECTIVE:** Delete the gauges. Budget becomes: (1) a cap field on the composer at dispatch ("up to $5 / 30 min" — prepaid-credit mental model), (2) one compact remaining figure in the run's status row, styled like battery percent, visible on glance and expandable on click, and (3) exactly two threshold events rendered inline in the thread — an amber "80% of budget used, still working" line and a hard stop at 100% that arrives as a decision point ("Out of budget. Add $2 / Wrap up / Stop"), never as a silent death.

---

## c) ESCALATION — who gets woken, when

**The user's job at that moment:** trust that if the agent needs a human it will reach the right person at the right urgency, and that nothing it asked for gets lost — so they can stop watching.

**Wiki patterns that carry this job:**

- **Interruption cost is the budget being spent** — task-switching costs ~23 minutes of recovery per interruption (Czerwinski et al., 2004); non-critical events must be pull, not push; aggregate rather than deliver in real time. Every unnecessary agent interrupt spends half an hour of the human. → /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Feedback & Error Handling/Notification Center with Categorization.md and /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Cognitive Psychology/People Can't Multitask Minimize Interruptions.md
- **Habituation / severity tiers** — reserve the top visual/interruption tier for genuinely critical events; anything firing >10×/day is miscalibrated; route medium priority to an aggregated inbox. This is what makes interruptions feel *governed*: the channel is a function of severity, and the function is stable. → /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Feedback & Error Handling/Habituation Calibrate Alert Frequency to Maintain Urgency.md
- **Sufficient context in every notification** — what happened, which entity *by name*, what action is needed, direct link ("Invoice #4821 approved by Sarah Chen," not "An invoice was approved"). An agent's "needs your input" ping with no question preview fails this. → /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Feedback & Error Handling/Provide Sufficient Context in Notifications.md
- **Conditional routing, announced upfront** — route by value/risk ("expenses under $500 auto-approve with logging; above $5,000 requires VP sign-off") and *notify the requester of the full approval path when the submission is created*. The escalation policy is one readable sentence attached to the item, not a diagram. → /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Workflow & Multi-Step Processes/Conditional Approval Routing.md
- **The WHO is delegable** — "Delegate My Approvals" with date range, "Reviewing on behalf of [Name]", audit-logged. Per the audit, every agentic product hardcodes the recipient to "whoever owns this terminal" — delegation is the everyday pattern that fixes it. → /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Workflow & Multi-Step Processes/Delegation and Backup Approvers.md
- **Queue with age/SLA visibility** — needs-input items sorted oldest/highest first, amber approaching SLA, red breached, summary count on top; "the interface should make the next action obvious." → /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Workflow & Multi-Step Processes/Prioritized Work Queue with Status Visibility.md

**Shipping embodiments:**

- *Everyday:* **on-call paging (PagerDuty/Opsgenie)** — severity picks the channel (page vs app-push vs email) and unacknowledged items escalate to the next person on a timer; **iOS Focus / quiet hours** with "Time Sensitive" breakthrough — user-owned rules about what may interrupt; **inbox badge + review-requested queue (GitHub)** — non-urgent asks accumulate visibly instead of interrupting; **Slack's @mention vs channel-message tiering**.
- *Agentic:* Claude Code Agent View grouping sessions under "Needs input" (the queue, shipped); Codex Triage pane ("acts as your inbox," no-finding runs auto-archived — good governed-notification hygiene); Cursor iOS "needs input" push. Anti-pattern from the audit: AskUserQuestion auto-resolving at 60 seconds — an escalation that silently expires teaches the user they cannot stop watching, the exact opposite of governed.

**REDESIGN DIRECTIVE:** Render escalation as a "Needs you" inbox plus one routing sentence, not a routing diagram: a queue of question cards (one-line what/which/why each, oldest first, amber after N minutes waiting) with only the top severity tier allowed to interrupt via toast/push — everything else badges the queue. Print the policy as a single human sentence on the run header ("Interrupts you for: git push, spending, anything outside the repo. Everything else: logged."), and make the recipient a field ("route approvals to…") with an on-behalf-of trail, PagerDuty-style.

---

## d) APPROVAL GATES + TIERING — curing approval fatigue

**The user's job at that moment:** approve the handful of actions that genuinely need them, fast, without being trained into reflexively clicking OK on everything.

**Wiki patterns that carry this job:**

- **Severity-matched presentation is the anti-fatigue mechanism** — "mismatching presentation to severity trains users to dismiss all alerts — including critical ones"; modals only for workflow-blocking criticality, never for the routine. Approval fatigue is this note's "error fatigue" wearing an agent costume. → /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Feedback & Error Handling/Error Severity Categorization Match Presentation to Impact.md
- **Undo over confirmation** — "undo respects the user's intent; confirmations treat users as incapable"; confirm only when undo is architecturally impossible. For an agent with checkpointing, most file edits are undoable, so most gates should be retroactive (undo/rewind) rather than prospective (dialog). → /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Usability Heuristics/User Control and Freedom Undo Over Confirmation.md, with the mechanics in /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Feedback & Error Handling/Undo Feedback Toast.md (5–8s soft-commit toast) and /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Interaction Patterns/Soft Delete Trash Pattern for Recoverable Deletion.md (the trash pattern "removes the need for destructive confirmation dialogs on first delete" — a grace period replaces a gate).
- **When you do confirm, be specific and calibrated** — dialog names the blast radius ("Permanently delete 14 records… all associated comments will also be deleted"), destructive button never the Enter default, and **type-to-confirm reserved for the top severity only** (the note credits AWS/GitHub/Vercel for establishing it): "calibrate confirmation friction to severity — soft undo toast for reversible actions, typed confirmation for permanent ones." → /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Feedback & Error Handling/Confirmation Dialogs for Destructive Actions.md and /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Feedback & Error Handling/Opt-Out Confirmation for High-Consequence Actions.md
- **The friction matrix for AI actions** — two axes, consequence × reversibility: low/reversible → apply immediately with undo; high/irreversible → preview (diff view) + explicit confirmation. This is the tiering rule already written for agents. → /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Interaction Patterns/Appropriate Friction for AI-Powered Actions.md (same calibration logic for direct manipulation in /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Data Display & Tables/Inline Editing with Friction Calibration.md)
- **Interrupt vs queue is a routing decision** — auto-approve below threshold *with full audit logging*, heavyweight chain only above; log auto-approvals separately for later review. Batch-review is a first-class disposition, not a failure to gate. → /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Workflow & Multi-Step Processes/Conditional Approval Routing.md, rendered as a pipeline per /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Workflow & Multi-Step Processes/Approval Status Visualization.md
- **Defaults are the policy most users run** — status quo bias means whatever gate tiering ships pre-selected is what 90% will live with; defaults must serve the user's interest and be visibly changeable. → /Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Behavioral Psychology/Status Quo Bias and Strategic Default Settings.md

**Shipping embodiments:**

- *Everyday:* **Gmail Undo Send** — the canonical undo-instead-of-confirm for an external, "irreversible" act (a delay window manufactures reversibility); **GitHub Danger Zone + type-the-repo-name** — top-tier friction used exactly once per catastrophe-class action; **Apple Pay's hold-side-button / double-click** — physical friction for money; **bank step-up confirmation only above amount thresholds**; **PR review + required CI checks** — the queue tier: work proceeds, judgment is batched at a merge gate; **sudo** — re-auth for privileged commands only, everything else flows.
- *Agentic:* Cursor Auto-review (classifier gate; only ~7% of chats see an interruption, ~4% of actions blocked — engineered scarcity of interrupts); Codex Auto-review with `/approve` one-shot override plus "approve once / approve for this session" scoping; Claude Code checkpointing/`/rewind` (the undo infrastructure that makes tier-1 possible) and its plan-approval dialog (one good interrupt that sets the mode for the whole run).

**When should a gate interrupt vs queue:** interrupt only when the action is imminent AND irreversible-or-external (push, deploy, spend, send); queue when the output is reviewable later (edits, refactors, drafts) — batch them at a checkpoint the way a PR batches commits; and demote to undo whenever the system can make the action reversible (checkpoints, worktrees, delay windows). Fatigue is the product of gates that interrupt for queue-able or undo-able things.

**REDESIGN DIRECTIVE:** Ship three gate tiers keyed to reversibility, each with a fixed, distinct rendering so the user's body learns them: Tier 1 (reversible) — act immediately, undo toast + checkpoint, no dialog ever; Tier 2 (reviewable) — accumulate silently into a PR-style review checkpoint ("14 edits ready for review"), never blocking the run; Tier 3 (irreversible/external) — a real interrupt with blast-radius copy ("Push 3 commits to main — cannot be recalled") and Cancel as the default focus, escalating to type-to-confirm or hold-to-confirm only for catastrophe-class ops. If a gate would fire more than a handful of times per run, it is mis-tiered by definition — demote it, don't train the click.

---

**Synthesis hook (one line per concept):** permissions = phone permission sheet + camera dot; budget = fuel gauge glance + low-fuel light + prepaid cap at dispatch; escalation = pager severity rules + a "Needs you" inbox with SLA aging; gates = undo > queue > confirm, with friction bought only by irreversibility.

## verification

All research is complete. Here is the synthesis.

# Cluster: Verification & Trust — after/during work

Grounding read: `/Users/arielconti/workspace/agentic-craft/audits/autonomy-ui-verification-2026-07-03.md`, `/Users/arielconti/workspace/agentic-craft/audits/contract-field-reality-2026-07-03.md`. All wiki notes below were read in full.

---

## a) EVIDENCE — replacing the "evidence shelf"

**The user's job:** Decide "can I accept this work without redoing it myself?" at the moment the run claims to be done.

**Wiki patterns that carry this job:**

- **Success State Confirmation** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Feedback & Error Handling/Success State Confirmation.md`, UX-198) — the core rule: feedback must be *proportional to the action's significance* (toast for small, dedicated success screen for high-stakes) and must say **what was affected**, not just "done" ("3 items deleted"), plus offer the next useful action ("View report"). Evidence is a scaled-up success state, not a separate organ.
- **Automation Bias / calibrated trust** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Human Biases in Interfaces/Automation Bias (Algorithm Aversion Complement Automation Complacency).md`, UX-553) — why evidence must exist at all: users rubber-stamp reliable automation; the fix is "make the review path as easy as the accept path" and show reasoning/receipts *at the decision point*, not in a side gallery.
- **Event-Driven Agent Run Lifecycle** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Interaction Patterns/Event-Driven Agent Run Lifecycle and Observability.md`) — "pair event observability with approval gates, not just logging. A timeline is most useful when it leads into a decision surface." Evidence artifacts are events in the run, and they terminate in an accept/reject moment.
- **NNG Agentic UX 2.1** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Interaction Patterns/NNG Agentic UX Principles Trust Oversight and Adjustability.md`) — "display step-level intermediate results": evidence accumulates *during* the run as steps complete, it is not assembled at the end.
- **Peak-End Rule** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Human Biases in Interfaces/Peak-End Rule (Evaluative Memory Heuristic).md`, UX-570) — the completion summary is the single most powerful memory signal of the run; evidence belongs in the ending, which "deserves more design attention than any step that precedes it."

**Shipping embodiments:** CI checks on a GitHub PR (one line per claim, red/green glyph, click-through to raw logs — the canonical form); PR "Files changed" tab (the diff *is* the evidence, attached to the claim); e-commerce order confirmations and bank transfer receipts (line items + reference number + "view order," attached to the transaction, never a separate "receipts shelf" you visit); Codex cloud task pages (logs, diffs, terminal-output citations, screenshots, test results — per the audit, artifacts appear *after*, on the task page itself); OpenAI Symphony agents posting "proof of work: CI status, PR review feedback, complexity analysis, and walkthrough videos" onto the Linear issue — evidence attached to the work item, in a foreign but familiar surface.

**REDESIGN DIRECTIVE:** Kill the shelf. Evidence is a CI-style checks block **inside the run's completion message in the thread** — one plain line per claim ("`npm test` exits 0" · "lint clean" · "screenshot matches"), pass/fail glyph, each expanding to the raw artifact (log, diff, image); checks appear one at a time as steps finish, and the block sits directly above the accept/reject affordance so review is one glance, not a navigation.

---

## b) CALIBRATION — replacing the meters

**The user's job:** Decide "should I watch the next run less (or more) closely than this one?" — a decision made occasionally, not monitored continuously.

**Wiki patterns:**

- **Automation Bias** (path above, UX-553) — the load-bearing finding: **override rate is the calibration metric** ("a 0% override rate indicates automation bias at work; a 100% override rate indicates undertrust — both are calibration failures"). Calibration is a *derived statistic over interventions*, which is exactly the data the product already has.
- **Progressive Autonomy Levels** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Interaction Patterns/Progressive Autonomy Levels for AI Agents.md`) — prescribes the exact loop, and it is *not* a gauge: "Track user approval patterns — if a user approves 20 agent proposals in a row without editing, **suggest** increasing autonomy"; "On any agent error, temporarily downgrade autonomy **for that action type** and inform the user." Calibration surfaces as moment-of-decision nudges plus automatic scoped downgrades — never as an ambient instrument.
- **Peak-End Rule** (UX-570) — humans judge past experience by peaks and ends, not averages. A live meter fights human memory; a periodic digest that narrates the week's peaks ("2 runs needed you, 1 rolled back") *works with* how trust is actually formed.
- **Streak Mechanics** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Gamification/Streak Mechanics and Loss Aversion for Daily Retention.md`, UX-390, practicality 3) — the cautionary note: "Poorly designed gamification backfires — it feels patronizing to professionals... would I resent this element if I were the user?" A trust-score/streak visual for an agent is exactly the resentment case. Borrow only the milestone idea ("20 clean runs in a row") as the *trigger text* of a nudge.

**Shipping embodiments:** Tesla autopilot disengagement/safety **reports** — periodic documents, not dashboard gauges; Screen Time's **weekly digest** push notification (calibration data arrives on a schedule, one tap to detail); credit scores (a number you consult at decision moments — applying for a loan — moved by discrete events, with "why it changed" line items); Gmail spam filtering (the most successful calibration UI ever shipped is *invisible* — it simply asks less over time and offers "report spam / not spam" at the moment of error); Cursor Auto-review's published stats ("~7% of chats hit an interruption") — vendor-level calibration reporting, notably *not* rendered per-user in-product.

**REDESIGN DIRECTIVE:** Delete the meters entirely. Calibration becomes (1) an inline nudge at the exact decision moment — after N approvals without edits: "You've accepted the last 12 without changes. Auto-approve file edits from now on?"; after an intervention: an automatic, announced, scoped downgrade — and (2) a weekly-digest entry in the run history ("14 runs · 2 needed you · 1 rolled back · you loosened file-edit approvals on Tuesday"), Screen-Time style. The trust number itself never gets a permanent pixel.

---

## c) SUBAGENT / DELEGATED WORK — generalizing Cursor's one-liner

**The user's job:** Know that delegated work exists and whether it needs them, without reading any of it until they choose to.

**Wiki patterns (the pattern has a compound name):** Cursor's one-line-expandable is **progressive disclosure applied to an inline master-detail row inside a job queue**:

- **Expandable Row Detail (Inline Master-Detail)** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Data Display & Tables/Expandable Row Detail (Inline Master-Detail).md`, UX-089) — expanding in place "preserves table context"; use inline expansion (not a page) "when detail content is compact"; multiple rows expandable at once; lazy-load detail on first expand. The thread is the table; the subagent is the row.
- **Master-Detail Side-by-Side** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Desktop-Specific Patterns/Master-Detail Side-by-Side Layout.md`, UX-137) — the escalation form when detail is *not* compact: list stays visible, detail panel updates, "empty selection" state defined. This is Claude Code Agent View's shape (list grouped Needs input / Working / Completed, `Space` = peek panel).
- **Asynchronous Bulk Processing with Job Monitoring** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Workflow & Multi-Step Processes/Asynchronous Bulk Processing with Job Monitoring.md`, UX-353) — the canonical line anatomy: "name, initiator, start time, progress, status (Queued/Running/Complete/Failed), and a link to results or error details," plus retry and a completion notification. This is the entire vocabulary a subagent line needs.
- **Progressive Disclosure** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Cognitive Load/Progressive Disclosure Reveal Complexity on Demand.md`, UX-448) — the hard rule: "Limit disclosure depth to 2–3 levels maximum; beyond 3 levels, users lose their mental model." Line → card → panel. Never deeper. Orchestration topology dies here.

**The rules (what earns what):**
- **A line** — any delegated unit, by default. Anatomy per UX-353: name · status · one metric. (Cursor: "Review navigation rail · Composer 2.5 Fast → Completed"; a CI check line; a package-tracking row; a flight on a departures board.)
- **A card (inline expand)** — on click, exactly two artifacts: the **order** (prompt it was given) and the **deliverable** (its report). This matches Cursor's expansion and UX-089's "compact detail" criterion.
- **A panel/page** — only earned by state, not by existence: the unit *needs input*, or has a reviewable artifact set (diff + checks). That's master-detail (UX-137) / Claude Code Agent View territory.

**Shipping embodiments:** Cursor's inline subagent line (the reference); Claude Code Agent View's grouped table + peek panel and desktop's per-agent Tokens/Tools/Time table (from the client's screenshots — a list and a table, no instruments); everyday: package tracking (one row per shipment → tap for event timeline), email threads (subject line collapses an entire conversation), CI checks list on a PR, airport departure boards (name · status is enough for a room full of strangers).

**REDESIGN DIRECTIVE:** One subagent = one line **in the thread at the point of delegation** (name · status · one cost metric), expanding inline to a two-part card — the prompt it was given and the report it returned — with retry on failure; only "needs input" or a reviewable diff promotes it to the run panel. No orchestration diagram anywhere: parallelism is just multiple adjacent lines, hierarchy is at most one indent level.

---

## d) THE RUN JOURNAL / replay

**The user's job:** Reconstruct what happened after the fact — triggered by an anomaly, a question from someone else, or the need to undo; almost never consulted when things went fine.

**Wiki patterns:**

- **Activity Log UI with Filterable Timeline** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Enterprise & B2B Patterns/Activity Log UI with Filterable Timeline.md`, UX-176) — the entry grammar: plain-language `[Actor] [Action in bold] [Resource as link] [relative timestamp, absolute on hover]`, grouped by day, filterable by actor/action/resource, exportable. "Alex archived 3 invoices" — never system codes.
- **Comprehensive Audit Trail Architecture** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Enterprise & B2B Patterns/Comprehensive Audit Trail Architecture.md`, UX-167) — append-only, **before/after values for updates** (the thing that makes undo trustworthy), designed upfront not retrofitted, "the UI for audit data is as important as the data itself."
- **Version History for Collaborative Content** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Interaction Patterns/Version History for Collaborative Content.md`, UX-246) — the replay half: view/**compare**/restore, diff view, "show a preview before committing to a restore," named milestones, attribution. This is the journal's action layer, not just its record layer.
- **Help Users Track Actions and Thought Processes** (`/Users/arielconti/Documents/Obsidian Vault/Product Design Best Practices (RAG) - Live/Desktop-Specific Patterns/Help Users Track Actions and Thought Processes Audit Logs and Notes.md`, UX-144) — the journal must record *why*, not only *what*: "the reasoning behind a decision is as important as the decision itself"; completion notifications carry a result summary. For agents: log the stated reason alongside each consequential action.
- **Event-Driven Agent Run Lifecycle** (path above) — the live event stream and the journal are one data structure viewed at two times: "this shifts observability from a post-hoc audit log into a live coordination surface." Don't build a separate journal; persist the run's own events.

**When people actually consult it, and the entry point they expect:** Bank statements — on an unrecognized charge (entry point: the *transaction row* itself, or the fraud alert deep-linking to it), at reconciliation intervals (a chronological statements list), or to prove something to a third party (export). Google Docs version history — via "last edit was…" on the document, never via a global history app. Claude Code's own `/rewind` menu (per the audit: a list of *user prompts* as restore points, with restore code/conversation options) proves the agentic form: checkpoints indexed by human decisions, not by system events. Codex Triage: "acts as your inbox," no-finding runs auto-archived — the journal defaults to silence.

**REDESIGN DIRECTIVE:** The journal is a place users *land*, not a place they *live*: no standing rail. Three entry points only — (1) a chevron on each run's completion summary opening that run's plain-language timeline ("Agent edited `composer.tsx` (+41 −7)" with before/after diff and the agent's stated reason), (2) a global bank-statement-style list of runs (one row per run: date · goal · outcome · cost), (3) deep links from anomaly moments (a denial, an intervention, a rollback toast). Checkpoint entries are indexed by user prompts and approvals — the moments a human decided — and every mutating entry carries its diff so "restore" is always one preview away.

---

## Cross-cutting note for the synthesis step

All four concepts collapse into one law the reference products already obey: **the thread is the master surface; everything else is a disclosure level of it.** Evidence = checks block in the run's closing message; calibration = nudges at decision moments + a digest row in the journal; subagents = expandable lines in the thread; the journal = the thread's own events, re-sorted and made filterable after the fact. The failed v3 rail treated these as four standing instruments; the shipping pattern (Claude Code's list-and-table, Cursor's line-and-expand, Codex's inbox) gives each concept zero permanent pixels and one familiar container: check, receipt, row, statement.
