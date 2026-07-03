# Session: eve-chat composer & autonomy reframe

**Date:** 2026-07-03  
**Status:** Handoff — continue this thread in **agentic-craft**, not eve-chat  
**Cursor transcript:** `~/.cursor/projects/Users-arielconti-workspace-eve-chat/agent-transcripts/fbdefb41-86d5-487a-9ef9-bde845017672/`  
**Claude Code session (composer lab):** `dfcc806d-f72d-4df2-b344-c726855df930`  
**Claude Code session (broader agentic UX):** `b50b9dcc-13da-4c7b-b853-57aa6bb4fe0f`

---

## Where to work next

| Project | Role |
|---------|------|
| **agentic-craft** | Canonical research, pattern pages, registry, and **this conversation** |
| **eve-chat** | Template / proving ground only — compound composer lives there for eve integration |

eve-chat primitives and playgrounds are snapshotted under [`references/eve-chat/`](../references/eve-chat/README.md).

---

## The reframe (most important)

The Claude Code composer lab **over-weighted one paragraph** from Addy Osmani's July 2026 post — the eight-field "run contract" list under **Risk and Reversibility** — and built four composer variants (Bare / B / C / D) around **contract read-back at Send**.

**Addy's actual spine:**

1. **Two axes** — agency (how far one agent goes) and orchestration (how many agents, how coordinated)
2. **Six levels (L0–L5)** as eras you climb through — assist → bounded task/goal → management-by-exception
3. **Core question** — *what level does this task deserve, and what verification makes that level defensible?*
4. **Contract** — one safeguard among many, not the organizing UI concept

The Claude Code exploration may have been **solving the wrong problem well**: polished contract read-back UI when the open gap is **level selection + verification defensibility + plan→execute transition**.

**Do not pick Bare/B/C/D until the composer problem is reframed.**

---

## Open composer questions (pick one to pursue)

| ID | Question | Research signal |
|----|----------|-----------------|
| **A** | Level selection legibility at Send | No product ships L0–L5 as a numbered control; level works better as behavioral badge |
| **B** | Verification defensibility before dispatch | Strongest gap — nothing answers "is this autonomy level defensible for *this* task?" pre-Send |
| **C** | Plan→execute transition | Strongest pre-dispatch patterns: Claude Code 5-option plan approval, Factory Spec approval, Plan→Implement |

Research points strongest at **B + C**, with level as behavioral badge rather than ladder UI.

---

## Research already in this repo

All under [`audits/`](../audits/):

| File | What it answers |
|------|-----------------|
| [`autonomy-ui-verification-2026-07-03.md`](../audits/autonomy-ui-verification-2026-07-03.md) | How Claude Code, Codex, Cursor, eve surface autonomy in UI |
| [`contract-field-reality-2026-07-03.md`](../audits/contract-field-reality-2026-07-03.md) | Where Addy's eight contract fields live (shredded across products) |
| [`concept-pattern-translation-2026-07-03.md`](../audits/concept-pattern-translation-2026-07-03.md) | Autonomy concepts → familiar UI patterns (wiki-grounded) |
| [`verification-defensibility-web-2026-07-03.md`](../audits/verification-defensibility-web-2026-07-03.md) | Pre/post/during verification; no product does full pre-Send defensibility |
| [`dispatch-moment-ui-web-2026-07-03.md`](../audits/dispatch-moment-ui-web-2026-07-03.md) | Visible vs hidden at Send across six products |
| [`mid-run-autonomy-switching-web-2026-07-03.md`](../audits/mid-run-autonomy-switching-web-2026-07-03.md) | Mid-run switching, dual dials, Replit retired autonomy |
| [`autonomy-levels-product-matrix-web-2026-07-03.md`](../audits/autonomy-levels-product-matrix-web-2026-07-03.md) | **Anchor:** July 2026 agency×orchestration post framing |
| [`autonomy-levels-2019-framework-matrix-web-2026-07-03.md`](../audits/autonomy-levels-2019-framework-matrix-web-2026-07-03.md) | Addy 2019 essay — different L0–L5 definitions |
| [`autonomy-levels-convergent-framework-matrix-web-2026-07-03.md`](../audits/autonomy-levels-convergent-framework-matrix-web-2026-07-03.md) | Dash0/CSA convergent ladder — third variant |

**Framework warning:** Three different L0–L5 definitions exist. Anchor on the **July 2026 Gas Town / agency×orchestration post**, not the contract paragraph alone.

---

## Research consensus (July 3 web subagents)

- No product ships L0–L5 as a numbered control at Send
- At Send: mode/model/placement visible; Run Mode, sandbox, allowlists, stopping conditions often hidden
- Strongest pre-dispatch patterns: **plan gates that also pick execution posture**
- Mid-run switching works (`Shift+Tab`, `Ctrl+L`) but **orthogonal dials** confuse (interaction mode vs permission mode vs Run Mode)
- Factory's split (interaction mode vs autonomy level) is clearest mental model; Cursor's split (chat mode vs Run Mode in Settings) is main failure mode

---

## Two composers in play

| Name | Location | API shape | Purpose |
|------|----------|-----------|---------|
| **Registry composer** | `src/components/ui/composer.tsx` | Provider + islands (`ComposerScope`, `ComposerPlan`, …) | Pattern demos, shadcn registry install |
| **Compound composer** (eve-chat) | [`references/eve-chat/compound-composer/`](../references/eve-chat/compound-composer/) | `Composer.Root` / `Frame` / `Input` / `Footer` / `Controls` / `Submit` | Framework-agnostic dispatch input; slot composition |

These are **different primitives**. The compound composer is snapshotted here as **`compound-composer`** to avoid colliding with the registry `composer` item. Promoting compound parts (`Composer.Receipt`, `Composer.Scope`, …) into the registry — if ever — should stay opt-in compound parts, never boolean props.

---

## eve-chat proving ground (five-surface model)

Guiding architecture from eve-chat `AGENTS.md`:

1. **Agent Thread** — transcript, streaming, turn anchoring
2. **Agent Composer** — pre-dispatch input (compound primitive)
3. **Run Panel** — Plan / Activity / Sources / Summary (during run)
4. **Human Gate** — intervention outside composer
5. **Review Surface** — post-run outcomes

**Composer belongs before authorization; Run Panel belongs after.** Contract read-back was framed as composer-shaped because it's the PR-create moment, not the activity feed.

Full inventory: [`references/eve-chat/README.md`](../references/eve-chat/README.md).

---

## Composer lab: Bare / B / C / D (superseded framing)

Built in Claude Code session `dfcc806d` as **playground-only** integrator composition around compound composer slots — primitive untouched. Variants compared how much **dispatch contract read-back** to show at Send:

| Variant | Bet |
|---------|-----|
| **Bare** | Silent absorption — reflection belongs elsewhere |
| **B** | Tappable receipt alone carries the contract |
| **C** | Only the boundary deserves permanent pixels |
| **D** | Seeing the parse builds trust |

Fixture ask: *"migrate session-chat-page to the shared adapter — don't touch deps, stop when tests pass, keep it under $5"*.

**Note:** Variants were described as live at `/playground/composer` in the Claude session; the committed eve-chat playground (snapshot in `references/eve-chat/playgrounds/`) is the **primitive comparison rig** (controlled/uncontrolled, plus menu, thread fixture) without the Bare/B/C/D picker. Recover variant UI from Claude session `dfcc806d` if needed — but **reframe first**.

---

## User preferences (carry forward)

- Shape content together; don't throw finished drafts
- Long-term goal: public framework for agentic interface design; agentic-craft is proving ground / content mine
- eve-chat is template/proving ground, not the product

---

## Suggested next steps in agentic-craft

1. Choose composer problem **A**, **B**, or **C** (recommend B + C) — **started:** [`/patterns/dispatch-moment`](../app/(reference)/patterns/dispatch-moment/page.tsx) sketches B+C on the registry composer
2. Sketch against registry composer demos and/or compound-composer slots — not contract read-back
3. Cross-check [`docs/research.md`](../docs/research.md) §4 "Autonomy as a contract" — may need revision to match reframe
4. If promoting compound composer into the site, wire a playground route under agentic-craft (don't fork registry composer)
