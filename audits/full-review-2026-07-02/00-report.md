# agentic-craft — Final Review Report
**Scope:** all ten areas, checked against shipping agentic products (evidence gathered 2026-07-02). Context: this guide is the destination artifact for your clips-and-essays strategy — so the report ranks fixes by *publishability* and flags which reworked sections feed content first.

**Headline:** The guide's engineering is publishable today; its prose is not. Across nine of ten areas, **zero claims name a product or source** — everything reads at the same confidence level, so your genuinely original ideas (islands-above, payload/context rule, approval re-lock, effective-policy preview, needs-source states) are indistinguishable from claims that are now factually wrong (no-reasoning-traces, opt-in memory as the norm, bordered agent bubbles, the 6-level autonomy ladder). The single exception — `docs/research.md` — survived fact-checking remarkably well, including the claims the audit suspected were fabricated (`ultracode` is real; the Dynamic Workflows block is near-verbatim accurate). The fix is not more writing; it is a labeling pass: **observed convention / argued position / original proposal**, with citations attached — most of which this review has already collected for you.

---

## 1. Scoreboard

Ranked best to worst. "Grounded" = claims with a named product/source in the published text before this review (not what's *groundable* — almost everything is groundable now).

| # | Area | Grounded / Asserted | Contradicted or stale | Verdict | Strongest asset |
|---|---|---|---|---|---|
| 1 | **research-doc** | ~60% cited / 40% asserted | 6 | **SOLID** | The whole epistemic apparatus (evidence tiers, sources policy) — and the Dynamic Workflows §9 block, which checked out against official docs almost line-for-line |
| 2 | **templates** | 0% / 100% | 7 | **NEEDS REWORK (light)** | Approval-invalidation "re-lock" loop — original, and now citable via GitHub stale-review dismissal |
| 3 | **sources** | 0% / 100% | 5 | **NEEDS REWORK (light)** | "needs-source" as a first-class document state + the `source-preview.tsx` focus engineering (APG-correct, cheap to cite) |
| 4 | **trust** | 0% / 100% | 7 | **NEEDS REWORK** | Effective-policy preview (real component, no shipped equivalent — the guide's best single invention) |
| 5 | **actions** | 0% / 100% | 8 | **NEEDS REWORK** | Locked-payload approval that expires on change (TOCTOU protection for agent actions) |
| 6 | **conversation** | 0% / 100% | 6 | **NEEDS REWORK** | Payload-vs-context rule (attachments in the card, plan/scope/reply above it) — original and defensible, but currently framed as observed practice |
| 7 | **multi-agent** | 0% / 100% | 7 | **NEEDS REWORK** | Run-journal contract in `workflow-run-monitor.tsx` (1,611 lines) — cheaply upgradeable to CITED via Inngest/Temporal/LangGraph |
| 8 | **observability** | 0% / 100% | 6 | **NEEDS REWORK** | "Traces record touched objects" half of the Run Trace stance (confirmed by Cursor pills, Devin replay, eve) — currently buried in fixture strings |
| 9 | **memory** | 0% / 100% | 6 | **NEEDS REWORK** | Provenance-bearing memory ledger (`memory-ledger-item.tsx`) — the field is moving *toward* it (ChatGPT Memory Sources, Claude chat citations) |
| 10 | **feedback** | 0% / 100% | 5 | **RETHINK** | Behavioral Consequence (feedback loop visibly closing) — but the area has no reusable components, 2 of 5 promised topics are missing, and its central microcopy prescribes lying to users |

No area rates CUT, but these **sub-sections** should be cut or fully reframed: the 1–5 rating scale with per-value system consequences (feedback), per-source numeric confidence bars (trust), the 6-level autonomy ladder (trust — replace with the lever matrix), and the Live/History/Filtered view taxonomy (observability).

---

## 2. The dangerous list

Every CONTRADICTED/STALE finding, consolidated. Fix all before anything ships publicly.

### Five credibility landmines (fix this week, independent of any rewrite)

1. **`claude-opus-4-6` with implied $15/$70-per-M pricing** (trust/cost-transparency). The model id is now *real* (shipped Feb 2026) at **$5/$25 per M** — the demo overstates a checkable price 3×. Worst possible failure mode: reads as a citation, is verifiably wrong.
2. **"Correction recorded — the agent will apply this in future responses"** (feedback). No product's thumbs feedback changes live behavior; it feeds offline training (OpenAI, Anthropic, Google all say so). The honest shipped version of this promise is a *memory write* ("Memory updated" chip). As written, the guide prescribes deceptive microcopy.
3. **Dangling "foundations" citation + two incompatible autonomy scales** (trust §4 cites a nonexistent foundations page; the sibling autonomy-contract page uses a different 5-level taxonomy; research.md canonizes a third). Any skeptical reader pulls this thread first.
4. **Spec/code mismatches**: composer table says 36px min-height, code says 32px; table says "14px PP Neue Montreal" (your brand font passed off as a general spec), code says 16px/14px responsive; "monochrome icons only" next to `text-destructive` failures; "N of M, not percentage" next to a percentage bar; principles promise an "owner" field the error log never renders.
5. **Registry install URLs** point at `raw.githubusercontent.com/bitcomplete/agentic-craft/main/...` — 404 until public, pinned to `main`.

### Position claims now contradicted by shipping practice

6. **"Do not reveal reasoning traces"** (conversation, observability, actions). Every major lab ships user-expandable *summarized* thinking (ChatGPT thinking trace, Claude extended thinking, Gemini thought summaries); Linear AIG tells builders to expose reasoning steps; eve's own run detail has a first-class "Reasoning" section. The defensible 2026 line — which OpenAI itself states — is **raw CoT no, summarized/auditable yes**. Rewrite everywhere it appears.
7. **"Opt-in by design / never persist memory without consent"** (memory, templates). ChatGPT, Claude, Copilot, Gemini all auto-persist and notify after the fact; ChatGPT Dreaming (June 2026) made capture *more* automatic. The consent spectrum is: auto-persist+notify (consumer) → suggest-then-approve (Cursor Memories, Devin Knowledge) → opt-in (ChatGPT Atlas browser memories only). Reframe as spectrum.
8. **Bordered agent bubbles** (conversation). ChatGPT/Claude/Cursor render agent turns as flat full-width prose; bubbles-for-agent is a named anti-signal. Present as a deliberate minority "ownership surface" choice or align.
9. **"Never auto-select — always wait for explicit choice"** (actions). Devin auto-proceeds after 30s by default; AskUserQuestion has a 60s timeout + "(Recommended)" defaults. The shipped spectrum is hard gate ↔ timed gate ↔ recommended-default.
10. **"Tool labels plain-language, never function signatures"** (actions). Developer agents deliberately show the literal command/diff *for trust* (Claude Code, Codex, Cursor). Rule survives only scoped by audience.
11. **6-level autonomy ladder + per-level confidence slider** (trust). Shipped reality: Claude Code 5 modes, Codex 3, Cursor 3 run modes — capability-defined, never numbered ladders. Also "Human-in-the-Loop" placed *above* "Human-Delegated" inverts universal usage.
12. **Per-source numeric confidence bars (94/87/71%)** (trust). No product ships calibrated per-source confidence; research (MetaFaith) shows verbalized numeric confidence is poorly calibrated. Cut or replace with Gemini double-check's corroborated/disputed coloring.
13. **"Declined actions re-approvable from the activity log"** (trust). No product does this; eve explicitly *forbids* it (stale continuation handles rejected). Cut or propose with rationale.
14. **"Dollar cost is the primary metric for non-technical users"** (observability). Exactly backwards: dollars are the engineer's metric (Claude Code API mode, Cursor); non-technical products use credits/ACUs/message quotas (Manus, Devin, ChatGPT).
15. **Per-agent live dollar columns / determinate % progress bars** (multi-agent, observability). No panel product shows live $ per agent (tokens/ACUs only, often post-hoc); no product shows % bars for LLM agent work (current-file/last-action, step counts, diff stats instead). Cursor *removed* its usage indicator.
16. **"Duration visible on hover only"** (observability). Every product that shows durations shows them persistently — including eve, your own reference framework.
17. **Handoff accept/reject packet presented as convention** (multi-agent, templates). OpenAI handoffs are silent one-way transfers; the lifecycle exists only at the A2A protocol layer and in Claude Code plan approval. Also "handoff" is now a term of art meaning the *opposite* of your usage — naming note required.
18. **Auto-routing with displayed rationale** (multi-agent). Shipped routers hide the decision (GPT-5 router backlash was about exactly this); no product shows "best match" cards.
19. **"Fill, never send" suggestion chips** (conversation). ChatGPT conversation starters and Gemini action chips send immediately; no top product found that fills-with-flash-confirm. Publishable only as explicit counter-position.
20. **Islands-above-the-composer** (conversation). No shipped analogue (closest: LibreChat quote chips); mainstream is chips *inside* the frame. Your strongest composer idea — must be labeled a proposal.
21. **Source strip opens the same anchored preview** (conversation, sources). Perplexity/ChatGPT source rows open sidebars or navigate out. Proposal, not description.
22. **Citation pagination-in-card** (conversation, sources). No product paginates all sources inside one citation card. Proposal.
23. **Per-entry memory expiry ("Expires 90 days")** (memory, templates). Unattested anywhere; Copilot — the most compliance-focused vendor — explicitly has *no* memory retention controls. The "critical for regulated environments" framing is inverted: products *fail* here (no Purview audit logs, no retention policies) — reframe as gap analysis.
24. **Four content-category privacy toggles** (memory). Shipped toggles are by mechanism/tier, never content category. "All Off" is now a *mode* (Temporary Chat, incognito), not a preset.
25. **Key-value ledger as THE memory model** (memory, research-doc). Both category leaders are now summary-shaped (ChatGPT Dreaming, Claude memory summary). Needs an explicit entry-shaped vs summary-shaped fork.
26. **Full consequence preview (impact+cost+rollback) as practice** (actions, templates). Nobody ships rollback plans or cost estimates in approval cards; ChatGPT purchase confirm is the only structured one. Aspirational — say so; the *lock/revoke* half has the GitHub precedent.
27. **Per-action consent modal as THE pattern** (trust, actions). 2025–26 shifted to policy + sandbox-by-default (Claude Code sandboxing cut prompts 84%; Cursor Auto-review). Connect to your own EffectivePolicyPreview.
28. **Kill switch as "most prominent UI element"** (trust). Products make stop *available* (Esc, send-button swap), never dominant. "One click/keypress away" survives.
29. **In-thread parallel trees as the parallelism story** (actions, multi-agent). The dominant shipped pattern is parallel *sessions* (Cursor Agents Window, worktrees, Codex threads, Manus Wide Research). Cross-reference or the section reads pre-2025.
30. **Composer anatomy omitting model picker / mode toggle / voice** (conversation) — stale by omission vs any live 2026 composer.
31. **"Do not color-code agents"** (templates). Linear AIG *requires* visual agent identity marking. Rephrase to "distinguish by identity/role, not arbitrary hue" or it contradicts the field's only published guideline.
32. **"Composer" as generic Cursor-era vocabulary + workbench demo encoding pre-3.0 Cursor layout** (templates, sources). Cursor 3 retired both.
33. **Textarea-only thumbs-down flow** (feedback). Dominant pattern is reason-category chips + optional text (ChatGPT, Gemini, Copilot — Copilot *requires* a reason).
34. **1–5 in-thread rating with per-value backend consequences** (feedback). No panel product ships it; "excluded from training / queued for regeneration" is invented backend behavior. Cut or reframe as labeling-tool pattern.
35. **research-doc specifics**: LukeW 2142 reports cognitive overload, *not* abandonment (Principle 1's key citation is overstated); `streamUI` was never removed (still in AI SDK 7, experimental) and AI SDK 6 is already superseded; the Anthropic Feb 2026 paper argues *against* discrete levels (footnote-cites Feng et al. — don't present as endorsement); Dynamic Workflows is now on all paid plans incl. Pro (not Max/Team/Enterprise); "no per-topic memory controls" needs qualification (ChatGPT project-only memory = container scope); DeepMind is 6×6, not 5×5.

---

## 3. The hands-on worksheet

Grouped by product; one sitting per product. **Estimated total: ~3.5 hours across 10 products.** Items marked ★ decide whether a load-bearing claim lives or dies.

### ChatGPT (~35 min)
- ★ Thumbs-down a response: record exact category chips + free-text step + confirmation copy.
- ★ Settings → Personalization post-Dreaming: does "Memory updated" chip still appear in-thread? Does legacy Manage-memories list coexist with the summary page? Any entry link to its source chat?
- Force GPT-5.5 Thinking on a hard question: does the thinking block auto-collapse with a "Thought for Xs" duration label?
- Deep research: does the activity panel collapse to a duration summary? Are clarifying questions chips or plain text with visible defaults?
- Agent mode: decline a purchase confirmation — does the run continue/end/offer re-approval? Is the activity log retained per-entry after completion? Any filter control or live indicator?
- Select text in a prior message: does the quote chip land inside or above the composer? (Tests islands-above directly.)
- Hover a citation bubble citing multiple sources: paginate or list? Does Tab-focus open it?
- In-product release notes: pin Canvas removal to May 28 vs 30; confirm "writing blocks" is OpenAI's naming.

### Claude Code (~30 min)
- ★ Deny a Bash approval: exact wording the model receives (grounds deny-with-guidance). Then approve command X, have it run X′ — confirm fresh prompt (grounds the locked-payload idea honestly).
- ★ Trigger AskUserQuestion: does single-select auto-submit? Any Skip? Does the answered question collapse to a chip? Is any option "(Recommended)"?
- "Read 4 files in parallel" + "launch 3 subagents": tree connectors, flat list, or interleaved? What does a subagent row show live vs done (time/tokens — persistent duration = another hover-only counterexample)?
- Agent View (`\`) with 3 teammates: per-row fields, any $ anywhere, what a plan-approval request looks like (your one real accept/reject handoff screenshot).
- `/usage` on a subscription vs API account: confirm the plan-bars vs dollars split.
- Type `ultracode:` — record the highlight color (docs never name "violet"); Option+W dismiss.
- `/permissions`: does anything render an effective-policy *digest*, or only raw rules? (Calibrates "most often missing" claim.)

### Cursor 3 (~30 min)
- ★ Agents Window with 3 agents (local + worktree + cloud): per-row anatomy — status, current file/last action, any token/cost/context-% indicator post-3.0, error and completion rendering, behavior at 6+ agents.
- ★ State a durable preference mid-run: does a memory approval prompt still exist post-3.x, and does the saved memory name its originating session? (Decides whether your best Save/Dismiss and provenance precedents are current.)
- Failing terminal command: does the failed tool row auto-expand? Can an in-flight row be opened?
- Approval prompt: screenshot button pair (fill vs outline, keyboard default). Record every colored status element (settles monochrome).
- Stop an agent mid-edit: partial edits kept? Checkpoint restore offered?
- Note current surface-pane contents (diff view, Design Mode) — pins the workbench demo to a version.

### Claude.ai (~15 min)
- Thumbs-down flow: chips, textarea, or both; exact copy.
- Streaming: is there any caret at all, and what shape?
- Home-screen suggested prompts: fill or send? (You need two fill exemplars or the rule stands on argument alone — say which.)
- Settings → Capabilities → memory: is the summary directly editable or edit-via-chat?
- Enable an MCP Apps connector (Canva/Asana): does interactive UI render inline?

### Codex app (~15 min)
- Default-mode approval card anatomy: command, sandbox note, risk text, cost?
- Task spawning subagents: how do subagent rows/status indicators render; per-thread tokens visible?
- Non-git vs git folder: recommended-mode banner + switcher location.
- Review queue rows: any usage figure; does the diff approval preview anything beyond the diff?

### Perplexity (~15 min)
- Hover a numbered marker: card contents; does Tab-focus open it; Escape behavior.
- Click a top source-row chip: preview in place or navigate out? (Settles source-strip claim first-hand.)
- Multi-source claim: does any single citation card paginate?
- Settings → Memory: delete an entry — 30-day recovery copy? Run Model Council — memory reaches all models?
- Generate a Page, strip a citation, publish: confirm no uncited-section block exists.

### Gemini / NotebookLM (~15 min)
- Gemini: double-check button + green/orange highlighting still shipping in this form?
- Gemini: toggle personal context off/on — does derived personalization survive (third disable≠delete datapoint)?
- Gemini streaming cursor shape.
- NotebookLM, 3+ sources, multi-source sentence: one marker = one passage, or any paging? (Final word on pagination-in-card.)
- Spark (needs Ultra): default outbound-email approval level.

### Devin (~15 min)
- Safe mode → `waiting_for_approval`: exactly what the approval card shows.
- Two concurrent sessions: sessions-list columns; live vs on-completion updates; Session Insights ACU placement.
- Knowledge tab: does an auto-suggested entry link to its originating session?

### Copilot / GitHub / Linear (~15 min)
- VS Code Copilot Chat thumbs-down: reason picker contents, required?
- M365 Copilot Settings → Personalization: is memory edit truly inline?
- GitHub Agents tab: exact per-row columns; does "waiting for review" render distinctly?
- GitHub Actions 20+-job matrix run: sidebar grouping/collapse behavior (decides ≤5-row roll-up precedent).
- Linear board with a delegated agent: how the delegate chip + session state render.

### Misc (~15 min)
- Manus: small task — credit consumption visible live, per-task, or settings-only? Wide Research: per-subagent rows or aggregate?
- Vercel Workflow dashboard: how does a resumed run label previously-completed steps? (Is "cached" labeling purely your coinage?)
- eve docs in this repo: `node_modules/eve/dist/docs/public/` was empty at check time — after `pnpm install`, grep for feedback/memory levers.
- ChatGPT/Claude Enterprise admin consoles: any typography policy (expect none → soften "workspace preference"); any shared-workspace cost surface (calibrates that negative claim).

---

## 4. Content opportunities

Ranked by fit with your comparison-frame method and the composer → autonomy → run-panel content priority. Each is essay + clip material *before* the guide ships.

1. **"An autonomy level is a usability lie" — the lever matrix essay.** Your prime asset. Anthropic's own Feb 2026 data (auto-approve grows 20%→40%+ over 750 sessions; 73% of tool calls HITL; 0.8% irreversible) *argues your position for you*, and Anthropic explicitly rejects discrete levels. Frame: Claude Code's 5 modes / Codex's 3 / Cursor's 3 / Devin's 30s soft gate / eve's four levers — all projections over the same matrix — capped by your shipped `effective-policy-preview` as the missing artifact. This is a pure comparison-frame piece with a working component payoff.
2. **"Inside or above? Where composer context lives."** Your islands-above proposal vs the shipped inside-the-frame convention (ChatGPT paste-to-attachment at 10k chars, Claude paste chips, Cursor @-pills — all *evidence for your own payload rule*, currently unused). Honest framing: "every product does X; here's why I built Y; LibreChat is the only cousin." Falsifiable, visual, clip-friendly, built on your actual primitive.
3. **"Approvals should go stale."** The re-lock/locked-payload idea, grounded in GitHub's dismiss-stale-reviews (records the diff at approval; new commits dismiss it) and Claude Code's per-invocation binding, extended to agent actions. Nobody ships it; the precedent is unimpeachable. Perfect Human Gate essay.
4. **"Show the receipts, not the reasoning" — corrected.** A public self-correction: the guide said hide reasoning; 2026 shipped summarized thinking everywhere; the durable line is raw-vs-summarized, plus the confirmed half (traces record touched objects — Cursor context pills, Devin replay, eve tool records). Self-corrections are high-trust content and pre-empt your harshest reader.
5. **"The run journal" — Run Panel material.** Your cached-replay/roll-up/retry semantics are durable-execution semantics (Inngest step memoization, LangGraph time-travel, Temporal event history) applied to agent UI — one citation pass upgrades your most code-invested contribution from invented to grounded, and no design writing articulates it.
6. **The memory consent spectrum.** Auto-persist+notify (ChatGPT/Claude/Copilot/Gemini) → suggest-then-approve (Cursor, Devin — with Devin's edit-before-save as the superior interaction) → opt-in (Atlas). Clean comparison table; positions your review-queue + provenance ledger as the deliberate far end, with ChatGPT Memory Sources as proof the field is drifting your way.
7. **"Parallelism left the thread."** In-thread trees vs parallel sessions: Cursor Agents Window/worktrees, Codex threads, Claude Code agent teams, Manus Wide Research. Directly upgrades your Run Panel → Operations-tier story and screenshots beautifully.
8. **Linear AIG as the field's only published spec** — one crosswalk piece mapping AIG's six states and delegation-vs-assignment rule onto your five surfaces. Cheapest citation fix across the entire guide, and ecosystem-adjacent (Linear audience).
9. **The cost-abstraction spectrum.** Tokens+dollars (Claude Code API) → context % (Cursor) → ACUs+caps (Devin) → credits (Manus) → message quotas (ChatGPT). Kills three wrong claims in the guide and yields a reusable comparison graphic.
10. **Progress surfaces are writable.** GPT-5.5 steerable thinking, deep-research mid-run refinement, Antigravity non-blocking artifact comments — observation-only progress UI is already dated; every shipped feed is an intervention surface.

---

## 5. Taxonomy decision

**Recommendation: adopt the merged architecture. A's five-surface model is the spine; agentic-craft's ten areas dissolve into surfaces, contracts, and patterns beneath it.**

```
PRINCIPLES   B's ten (re-audited) + #11 from A:
             "The primitive owns the slot, not the contents."

SURFACES     Session anatomy (A, verbatim):
               Thread · Composer · Run Panel · Human Gate · Review Surface
               + the routing rule as the canonical decision procedure
             Operations tier (new, from B §7 — containers for MANY sessions):
               Inbox · Board · Manager Surface · Run Monitor · Background Tasks
               (each session, opened, decomposes into the five surfaces)

CONTRACTS    Invariants that render across surfaces:
               Autonomy (lever matrix + effective-policy-preview)
               Provenance (claims / outputs / actions)
               Memory ledger · Cost visibility · Identity/accountability (AIG)

PATTERNS     B's registry re-homed under surfaces, rebuilt under principle 11
             (compound Composer replaces the monolithic composer item;
              decision-surface → human-gate)

METHOD       B's, kept wholesale: evidence tiers · anti-pattern catalog ·
             audit scripts · research→registry mapping
```

**Five sign-offs required:**

1. **Surfaces are the top-level frame; the routing rule is the product.** B's flat ten-area nav goes away; conversation/actions/sources/etc. become pattern documentation under the surface they belong to.
2. **Add the Operations tier *above* the five surfaces, not as a sixth.** This resolves B's unacknowledged contradiction (AIG's "inhabit the platform" vs Manager Surface's "dedicated space"): per-run context docks to the session; fleet orchestration earns its own space.
3. **Demote the 5-level autonomy spectrum to appendix vocabulary; promote the lever matrix.** Cite Feng et al. (Knight, arXiv:2506.12469) for the taxonomy and Anthropic's autonomy-measurement post *separately* — it supports the matrix, not the levels. `effective-policy-preview` becomes the shipped artifact. This also settles the guide's three-taxonomy inconsistency.
4. **Composer doctrine: cut B's monolithic registry composer; ship A's compound primitive** with B's features (attachments, suggestions, usage meter) as opt-in compound parts. Rename `decision-surface` → `human-gate`.
5. **Naming law: "surface" is reserved for places; exactly one list gets to be "five" (the surfaces).** Keep Human Gate, Locked Preview, Memory Ledger, Observable Work, Phase Rail. Fix or drop the L-level pet names (the referent flips mid-scale). Decide deliberately on "Composer" (Cursor collision is fading — probably acceptable).

---

## 6. Suggested review order

Sequenced so each rework produces an essay/clip, not abstract cleanup.

1. **Landmine pass (½ day, no essay).** Fix the five credibility landmines in §2 plus the six research-doc errors. The research-doc is the citation backbone everything else will lean on — it must be clean first, and it's already 90% there.
2. **Trust §4 autonomy + research-doc §4 (week 1).** Replace the ladder with the lever matrix, wire in the Knight/Anthropic/CSA citations, connect consent-modal → EffectivePolicyPreview. **Output: the flagship autonomy essay (#1 above)** — your strongest comparison-frame material and the piece that establishes the voice.
3. **Conversation composer sections (week 2).** Label islands-above and fill-don't-send as proposals with the shipped counter-evidence named; add the model-picker/voice/mode gap; fix the spec/code drift; use paste-to-attachment as evidence for your own payload rule. **Output: the composer essay (#2)** — directly promotes your `primitives/composer/` work.
4. **Actions approval gate + templates re-lock (week 3).** Merge the two locked-payload treatments, ground in GitHub stale-review + Claude Code per-invocation binding + eve's stale-handle rejection, add the missed axes (soft gates, deny-with-guidance, approve-and-remember, reviewer-agent delegation). **Output: the "approvals should go stale" essay (#3).**
5. **Multi-agent workflow-runs + observability run trace (week 4).** Cite durable-execution engines for the journal; promote touched-objects to a stated principle; rewrite the reasoning stance as raw-vs-summarized; fix hover-duration and the $ columns; add the parallel-sessions cross-reference. **Output: run-journal essay (#5) + the reasoning self-correction (#4).**
6. **Memory (week 5).** Consent spectrum reframe; entry-vs-summary fork; cut expiry or mark proposal; position the provenance ledger against ChatGPT Memory Sources. **Output: consent-spectrum comparison piece (#6).**
7. **Templates + sources (week 6, light passes).** Mostly citation attachment — these areas had the highest confirmation rates. Fold the AIG crosswalk in here. **Output: Linear AIG crosswalk piece (#8).**
8. **Feedback (last, and smallest).** Rethink around the modern loop (correction → proposed entry → approve), reason-chips, and Behavioral Consequence as the keeper; cut the rating scale; write the missing error-report section around Claude Code `/bug` and escalation around Linear AIG. Consider folding remnants into memory (feedback-as-memory-write) and Human Gate rather than keeping a standalone area.

Run the hands-on worksheet (§3) in parallel with weeks 1–2 — its ★ items gate the autonomy and composer essays, and the screenshots it produces are your clip inventory.