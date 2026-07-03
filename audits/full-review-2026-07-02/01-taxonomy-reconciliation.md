# Reconciliation: the five-surface model (A) vs agentic-craft (B)

Sources read: Model A — `/private/tmp/claude-501/-Users-arielconti-workspace-eve-chat/b50b9dcc-13da-4c7b-b853-57aa6bb4fe0f/scratchpad/content-inventory.md` (the full June-2026 exploration write-up; the orchestrator's "undefined" path resolves to this file), `/Users/arielconti/workspace/eve-chat/AGENTS.md`, `primitives/composer/`. Model B — `/Users/arielconti/workspace/agentic-craft/docs/research.md` (999 lines, read fully), `src/content/patterns.ts`, `src/content/navigation.ts`, `src/views/principles-data.ts`, `src/views/principles-content.tsx`, `src/views/operational-surfaces-data.ts`, `agent_docs/design.md`, `agent_docs/verification.md`.

---

## 1. The collision map

Where the two models describe the same territory with different names or different carvings.

| Model A concept | Model B counterpart | Relationship |
|---|---|---|
| **Agent Thread** (content-inventory §1.1) | "Conversation" pattern category (`patterns.ts` observable-work); §3.1 "Visible work" (research.md); citations (§5.1 claims layer) | Same surface. B has no name for the container, only for its contents (tool-call, tool-tree, observable-work, citations). A names the container; B names the furniture. |
| **Agent Composer** (§1.2: "instruction-and-control surface," context attachment, steering, stop/submit lifecycle) | `composer` registry item (research.md §13.1: "chat input with islands, attachments, suggestions, context-usage"); File Lifecycle pattern (`patterns.ts`, category "Composer"); "Composer with file context chips" (§10.7) | Same surface, opposite construction philosophy — see Contradiction 3. |
| **Run Panel** (§1.3: per-run "stateful metadata" — environment, status, sources, changes, subagents) | **Not** one of the five operational layouts. Closest match: `run-trace` + `usage-meter` (§7.3) and the "Run Monitor Rollup" surface (`operational-surfaces-data.ts` id `run-monitor-rollup`), scoped down to a single run; partially `contextual-workbench` (§13.1) | Different altitude. B's §7.1 five layouts (kanban / dashboard / inbox / task list / calendar) organize **many** runs/agents; A's Run Panel is the operational view of **one** run, docked beside its thread. B's "Manager Surface" (§7.2) is the fleet-scale generalization of what A's Run Panel does for a session. The two models literally do not overlap here — they tile. |
| **Human Gate** (§1.4: approval, missing input, choose-from-options, permission/connection) | `decision-surface` (`patterns.ts`: "Pause before external, costly, or irreversible actions") + `action-preview` / locked consequence preview (§3.2) + `clarifying-questions` (§13.1) + risk-tiered gates (§3.2). At fleet scale: the **Inbox** surface (`operational-surfaces-data.ts`: "where autonomous work asks for review instead of interrupting the thread") | Near-exact content match, different ontological status: A says the Gate is a **surface** (a place with its own interruption semantics — "questionBar validates a lightweight Human Gate near the composer but it's its own surface," content-inventory §4); B says it is a **pattern family** rendered wherever needed. B's Inbox = Human Gate queued at scale. |
| **Review Surface** (§1.5: inspect output before accepting — diff, draft, report, created issue/PR) | `artifact-document` / `source-backed-artifact` (§5.1 outputs layer), `contextual-workbench` diff mode (§13.1), inline-diff approvals (§10.7), Antigravity "Artifacts as tangible deliverables" with comment-style feedback (§10.6) | B scatters this across provenance and IDE-agent sections and partially conflates it with the pre-action gate (its `decision-surface` covers "approval/clarification/**rollback**"). A's clean pre/post split — Human Gate = decide **before** continuation, Review Surface = inspect an **output** — is a carving B never states. |
| **Routing rule** ("conversation → Thread; execution context → Run Panel; decide-before-continuing → Human Gate; inspect/accept output → Review Surface") | No equivalent. B's nearest selector mechanisms: per-pattern `userAnxiety` (`patterns.ts`) and per-surface `userJob` (`operational-surfaces-data.ts`) | A-only asset. B tells you which pattern soothes which anxiety; A tells you which surface a given piece of information/decision belongs on. |
| **"The primitive owns the slot, not the contents"** (§3; opaque `TControls`) | §8.4 "Slot architecture" + "Constraint surfaces" — but only for **agent-authored UI** (designer defines slots, agent fills them) | Same doctrine discovered at two different layers: A applies it at the primitive/integrator seam; B applies it at the runtime/agent seam. B never applies it to its own registry API design — see Contradiction 2. |
| **Cross-harness autonomy comparison** (§2: Claude Code / Codex / Cursor / eve; eve = four levers, no mode) | §4.1 5-level canonical spectrum; §4.2 autonomy matrix ("a single autonomy level setting is a usability lie"); §4.4 disposition dial; Appendix A variant taxonomies; §12.9 open question on default level | The prime collision — see Contradiction 1. Note B's §4.2 matrix (per-action-type, per-confidence, per-cost, per-rate) is structurally the same decomposition as A's eve levers (per-tool approval predicates, tool availability, sandbox scope, clientContext steering). B half-discovered A's finding without noticing it undermines §4.1's "canonical" claim. |
| **Linear AIG mapping** (§5: AIG ≈ 1:1 onto the five surfaces) | §2.7: AIG as "conduct baseline," sharpening provenance (§5), handoff (§12.6), status (§13) | Convergent external validation — both models independently anchor on AIG. Merge candidate: one AIG crosswalk table serving both. |
| **Evidence tiers** ([Convention] / [Convention-forming] / [Emerging] / [Speculative], research.md "How to read") | No equivalent in A | B-only asset. A's cross-harness teardown is raw evidence; B's tiers are the epistemic labeling system A's claims should be run through. |
| **Naming hazard: two "fives."** | A's "five surfaces" (session anatomy) vs B's "five operational layouts" (§7.1, fleet containers) and B's "5-level spectrum" (§4.1) | Not a conceptual collision but a branding one: three different five-item lists will be conflated by any reader. The merged framework can afford at most one "five." |

---

## 2. Contradictions

### 2.1 Autonomy: canonical spectrum vs harness-specific projection (the prime suspect)

- **B's position** (research.md §4.1): "Multiple frameworks converged on a 5–6 level structure… We adopt the 5-level model as canonical for agentic-craft," complete with a **UI-surface column per level** (L3 → "Locked consequence preview; decision surface"; L4 → "Run monitor; kill switch"). Plus a normative default: "Ship at L2 by default. Earn the right to L3."
- **A's position** (content-inventory §2–3): autonomy semantics differ per harness; eve has **no** global mode, only four independent levers; Claude Code's "mode" is a product-level projection over such levers; therefore "a reusable primitive must not encode any one product's autonomy model" — no `type AutonomyLevel = "manual" | "plan" | "auto"` anywhere in the API.

**Which survives contact with reality: A's — at the layer that matters, with B's spectrum demoted, not deleted.** Four pieces of evidence, three of them from B's own document:

1. B's §4.2 already concedes the core of A's point: "A single 'autonomy level' setting is a usability lie. Real autonomy is a matrix." A matrix of per-action/per-cost/per-rate policies **is** a lever decomposition; the eve finding is the same fact observed in a shipping framework.
2. B's own Appendix A shows the "convergence" is soft: CSA has 6 levels, DeepMind has a 5×5 grid, Emergent Mind has 6 modes, Apple has 5 orthogonal role dimensions. The field converged on *having levels*, not on *which levels* — exactly the "projection each harness builds differently" claim.
3. B's §12.9 admits the L2-default position "is genuinely unsettled" against shipping counter-evidence (Devin L4-default, Spark ambient, Cursor Background L3–L4). A "canonical" model whose default prescription is an open question is a lens, not a canon.
4. A's evidence is a working artifact: the eve adapter (`primitives/composer/adapters/eve.tsx`) types the opaque payload `{ clientContext }` while a CC-style app would type `{ mode }` — the seam demonstrably works without any level enum.

**The reconciliation:** the 5-level spectrum survives as **descriptive field vocabulary** — a way to *talk about and compare* products in research prose (evidence tier: [Convention-forming] at best, per B's own tiering rules) — while A's rule governs **anything with an API**: primitives, registry items, type signatures. B's §4.2 matrix + `effective-policy-preview` is the bridge artifact: it renders whatever contract the harness's levers produce, without hard-coding the levers. That component is the best single thing in either model on autonomy.

### 2.2 B violates A's slot doctrine in its own registry

B's `decision-surface` is justified by §4.1 (registry mapping §13.1), and B's "autonomy contract" pattern card "changes visibility by autonomy level" (`principles-data.ts`, progressive-disclosure link). That bakes the 5-level model's semantics into component behavior — precisely the `AutonomyLevel`-enum leak A's doctrine forbids. Meanwhile B preaches the identical doctrine at the agent-authored-UI layer (§8.4 slot architecture, component allow-lists). B is internally inconsistent; A's rule resolves it.

### 2.3 Composer construction: monolithic feature-set vs compound slots

B's `composer` registry item is a feature-rich input ("islands, attachments, suggestions, and context-usage visualization," §13.1). A's competitive teardown (content-inventory §4) concluded exactly this shape loses: "compound components beat monolithic ~15-prop input bars (boolean-prop proliferation)," and the opaque `controls` generic is the strategic differentiator no existing library has. Direct conflict in component doctrine; A has the working counter-implementation (`primitives/composer/composer.tsx`, Root/Frame/Before/Input/Footer/Controls/SubmitSlot/Submit + opt-in InfoBar/Attachments/Attach).

### 2.4 Where opinions live: product guidance vs primitive neutrality

B's "Ship at L2 by default" (§4.1) and A's "the primitive must not encode any autonomy model" *look* contradictory but are reconcilable by layer: B's is product guidance (what an integrator should configure), A's is primitive law (what the shared code may assume). The merged framework must state this layering explicitly, because as currently written B's guidance reads as if the framework itself should default-gate — which A's architecture cannot and should not express.

### 2.5 Dedicated agent space vs inhabit-the-platform

B simultaneously endorses Linear AIG's "status, trace, and approval components belong inside existing work surfaces, not in a detached 'AI console'" (§2.7) and the Manager Surface posture — "agents have their own dedicated space, not a sidebar" (§7.2, tagged [Convention-forming]). B never reconciles these. A's altitude split dissolves the tension: per-session operational context lives docked to the session (Run Panel — inhabits the work); fleet-scale orchestration earns a dedicated space (Manager Surface). The merged model should say so.

### 2.6 Gate as pattern vs gate as surface

B treats approval/clarification as components droppable anywhere (`decision-surface` is "composable"); A insists the Human Gate is its own surface with its own interruption semantics, even when rendered lightweight near the composer (content-inventory §4). This matters for focus management, notification routing, and the Inbox-at-scale story. A's carving is stronger: the *pattern* (locked preview, clarifying questions) is B's; the *surface contract* (what may interrupt, where it queues, what blocks continuation) is A's — keep both, at their respective layers.

---

## 3. Complementary strengths

**A has, B lacks:**
- **Surface anatomy with a routing rule.** B names ~30 patterns but has no answer to "where does this go?" for a single session. A's routing rule is the only decision procedure in either model.
- **The component doctrine + proof.** "Primitive owns the slot, not the contents," made concrete as an opaque `TControls` generic, with a working framework-agnostic Composer and a single-file eve adapter proving the seam. B's registry has no comparable integration story (its items are shadcn-styled but semantically hard-coded).
- **Cross-harness empiricism.** The Claude Code / Codex / Cursor / eve comparison is primary-source fieldwork B doesn't have (B inventories products from published materials, §10; A dissected the actual control planes).
- **The pre/post decision split.** Human Gate (before continuation) vs Review Surface (after output) — a distinction B blurs.

**B has, A lacks:**
- **Breadth.** Memory-as-ledger (§6), provenance's three layers (§5), multi-agent operations and handoff (§7, §12.4–12.6), feedback, observability-as-product-surface (§7.3), trust/cost (§4.2, principle 9), agent-authored UI and the protocol stack (§8), workflows-as-product (§9). A's model covers one session of one agent; B covers everything around it.
- **The operational layer.** Five layouts (§7.1), Manager Surface (§7.2), background tasks (§7.4), Inbox/Kanban/Run Monitor Rollup with `userJob` framing (`operational-surfaces-data.ts`). A has no fleet story at all.
- **Epistemology.** Evidence tiers, primary-vs-secondary source flagging, position-vs-field-map document structure, "open questions" section (§12) that names what is unknown. This is the credibility apparatus A's claims need.
- **Anti-pattern catalog** (§11: agentic sludge, fake streaming, honest-affordance violations, AI-demo chrome) and **enforcement tooling** (`scripts/audit-ui.mjs`, `agent_docs/verification.md`'s check chain, `agent_docs/design.md`'s interaction bar).
- **Ten defended principles** (§14 / `principles-data.ts`) — a citable editorial spine.
- **The research→registry contract** (§13's mapping table + coverage check + roadmap-by-gap). A methodology worth keeping regardless of content.

---

## 4. Recommended merged architecture

One framework, three altitudes, with contracts cutting across. Working shape:

```
PRINCIPLES  (the rules — B's ten + one from A)
  └─ 01–10 from principles-data.ts, re-audited
  └─ 11 (new, from A): "The primitive owns the slot, not the contents."
       Framework code carries interaction patterns; integrations carry semantics.
       (Absorbs B §8.4 slot architecture as the same rule at the runtime layer.)

SURFACES  (the where — A's model, extended one level up)
  ├─ Session anatomy (A's five, verbatim):
  │    Thread · Composer · Run Panel · Human Gate · Review Surface
  │    + A's routing rule as the canonical decision procedure
  └─ Operations layer (new tier, from B §7):
       Inbox · Board (kanban) · Manager Surface · Run Monitor · Background Tasks
       — containers for MANY sessions; each session, opened, decomposes
         into the five surfaces.
       Routing rule extended: "many runs → Operations; this run's context
         → Run Panel; …"

CONTRACTS  (the what-must-hold-everywhere — B's deep chapters, reframed)
  ├─ Autonomy contract: lever matrix (§4.2) + effective-policy-preview +
  │    A's cross-harness lever comparison. The 5-level spectrum moves to a
  │    research appendix as descriptive vocabulary, stripped of "canonical."
  ├─ Provenance (claims / outputs / actions, §5) — renders in Thread,
  │    Review Surface, and Memory alike
  ├─ Memory ledger (§6) — its review queue is a Human Gate instance;
  │    its panel is an Operations-adjacent surface
  ├─ Cost visibility (§4.2, §7.3) — renders in Run Panel + Operations
  └─ Identity/accountability (AIG, §2.7, §12.6) — renders everywhere agents
       share surfaces with humans

PATTERNS & PRIMITIVES  (the how — B's registry re-homed under surfaces,
                        rebuilt under principle 11)
  ├─ Thread ← tool-call, tool-tree, observable-work, citations, status-indicator
  ├─ Composer ← A's compound Composer (replaces B's monolithic composer item),
  │    absorbing B's file-lifecycle, wayfinder/suggestion, context-usage meter
  │    as opt-in compound parts
  ├─ Run Panel ← run-trace, usage-meter, source list (single-run scope)
  ├─ Human Gate ← action-preview (locked preview), clarifying-questions,
  │    approval-gate (née decision-surface), risk-tier logic
  ├─ Review Surface ← artifact-document, source-backed-artifact,
  │    contextual-workbench (diff/browser mode)
  └─ Operations ← agent-status-table, workflow-phases, workflow-run-monitor,
       handoff-packet, run-monitor, background-task panel

METHOD  (the quality system — B's, applied to everything)
  evidence tiers · anti-pattern catalog (§11) · audit scripts ·
  research→registry mapping table (§13-style contract) ·
  agent_docs/design.md interaction bar · verification chain
```

**Rationale per structural decision:**

- **Surfaces as the top-level organizing frame (A wins the spine).** A framework for *designing interfaces* should be organized by *places in the interface*, not by pattern taxonomy — the routing rule only works if surfaces are primary. B's ten reference areas (conversation, actions, memory, multi-agent, feedback, observability, sources, trust, templates, registry — the `src/views/` set) mix surfaces, contracts, and site chrome at one flat level; that flatness is plausibly part of why agentic-craft didn't land.
- **Operations layer added above the five, not as a sixth surface.** The five layouts and the five surfaces are at different altitudes (Contradiction/Collision analysis, §1). Nesting them resolves B's internal AIG-vs-Manager-Surface tension (2.5) and keeps A's model intact rather than diluted.
- **Autonomy, memory, provenance, cost, identity become "contracts," not surfaces or patterns.** They are invariants that render onto multiple surfaces (a memory review is a Human Gate; a citation is Thread furniture; cost shows in Run Panel and Operations). This is the only frame in which B's breadth and A's anatomy don't fight.
- **The 5-level spectrum is demoted, the matrix promoted.** Per Contradiction 2.1. Cut the word "canonical"; keep the table in an appendix as a field-communication lens tagged with an honest evidence tier; make `effective-policy-preview` + the lever matrix the shipped artifact; make A's harness comparison the empirical backing.
- **B's `composer` registry item is cut and replaced by A's compound Composer.** A's teardown already adjudicated this (2.3); B's feature list (attachments, suggestions, usage meter) survives as opt-in compound parts, which is exactly A's `Composer.InfoBar` / `Attachments` / `Attach` pattern.
- **`decision-surface` is renamed and re-homed under the Human Gate.** The pattern content is B's best material; the surface contract is A's. One name should own the concept (see §5).
- **B's methodology is kept wholesale.** Evidence tiers, audit-ui enforcement, the §13 research→registry contract, and the verification chain are the parts of agentic-craft with zero overlap and zero conflict — pure keep.
- **Cut:** "Use Cases" as a nav concept (`navigation.ts`) — its contents (Thread, Context Blocks, Side Panel) are surface documentation and move under Surfaces. Also cut duplicate framings: B §2's seven-framework literature review compresses to an appendix; the merged doc's spine is the new model, with B's citations attached where they defend it.

---

## 5. Naming audit

**Strong — keep:**
- **Human Gate** (A) — memorable, names both the actor and the function; strictly better than "decision surface." The single best name in either model.
- **"The primitive owns the slot, not the contents"** (A) — quotable doctrine; a title-grade line.
- **Locked Preview / "the preview is the contract"** (B §3.2) — precise and sticky.
- **Memory Ledger** (B §6) — instantly conveys the visible/auditable position.
- **Effective Policy Preview** (B §4.2) — a mouthful but exact; the concept sells the name.
- **Manager Surface** (B via Google) — good, and already field-adopted; keep as the Operations-layer anchor.
- **Observable Work** (B) — better than "visible work"; keep as the Thread pattern name.
- **Phase Rail** (B §9.3) — vivid, concrete.
- **Agentic Sludge** (B via Yocco) — borrowed but the anti-pattern catalog is stronger for using it.
- **Routing rule** (A) — the *content* is strong; consider branding it (e.g., "the surface routing rule") since it's the framework's most teachable artifact.

**Weak — rename or retire:**
- **"Decision Surface"** (B) — doubly bad: "surface" now means something specific in the merged model (a place, not a component), and every surface hosts decisions. Rename → `human-gate` or `approval-gate`.
- **"Agent Thread" / "Agent Composer"** (A) — the "Agent" prefix is redundant inside an agentic framework, and **Composer collides with Cursor's Composer**, which names a multi-file editing mode, not an input. In a framework whose evidence base is a cross-harness comparison *including Cursor*, that collision is a real cost. Candidates: keep Thread; consider whether Composer's collision is acceptable (it may be — the term is trending generic) but decide deliberately.
- **"Run Panel"** (A) — "panel" is implementation (a dock position), not function, and it blurs into B's run-monitor/run-trace family. If kept, fix the hierarchy explicitly: Run Panel (surface) ⊃ RunTrace (primitive); Run Monitor stays fleet-level.
- **"Review Surface"** (A) — functional but generic; also the "surface" suffix is now doing double duty. Acceptable if "surface" is reserved for the five + operations layouts and banned from component names.
- **The three fives** — "five surfaces," "five operational layouts" (§7.1), "5-level spectrum" (§4.1). Keep at most one "five" in the branding (the surfaces); refer to the others by content, never by count.
- **L1–L5 level names** (B §4.1: Operator, Collaborator, Consultant, Approver, Observer) — the referent flips mid-scale: Operator/Collaborator/Consultant describe the *agent's* role, Approver/Observer describe the *user's*. "Observer" for the maximum-autonomy level reads inverted at a glance. If the spectrum survives in an appendix, fix the referent consistency or drop the pet names for HITL/HOTL/etc.
- **"Reference Item," "Contextual Workbench"** (B) — colorless (the first) and doubly abstract (the second). Contextual Workbench's *concept* (chat shrinks beside an operable artifact) is valuable and is essentially the Review Surface's layout mechanic; rename accordingly.
- **"Operational Surfaces"** (B nav) — bureaucratic; "Operations layer" or "the Operations tier" reads better and clarifies the altitude relationship to the session surfaces.

**Net naming verdict:** A names places and doctrines well; B names patterns and anti-patterns well. The merged framework should take its surface vocabulary from A, its pattern/anti-pattern vocabulary from B, reserve the word "surface" exclusively for places, and let exactly one list be "five."