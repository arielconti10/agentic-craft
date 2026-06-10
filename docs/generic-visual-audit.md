# Generic-AI Visual Audit (broad pass)

Date: 2026-06-09
Scope: every surface — all pattern sections in every control state (155
captures), all 8 template detail pages, home in both themes, dark-theme deep
pages, open overlays (decision dialog, composer menu), memory CRUD states,
mobile (390px) sweeps — plus scripted analysis of all ~525 prose strings,
icon usage, scaffolding structure, and demo-data coherence. Three
independent review passes; every headline claim verified in source.

Previous passes already fixed the badge system, form dumps, floating pills,
and garbled copy. This pass hunts what still _reads generated_.

## A. Voice & scaffolding (the strongest tells)

### A1 — Every section ends with the same italic wisdom-callout

Census: trust 10 sections / 10 callouts; actions 7/7; feedback 5/5;
memory 5/5; multi-agent 5/5; conversation 4/4; observability 4/4. The
cadence is machine-regular: demo → spec table → "_The [component] is the
[adjective] surface for [purpose] — it ensures [truism]._" After three in a
row the reader stops believing them. A human editor would keep the earned
ones (the kill-switch partial-work note) and cut the restatements ("The
error log provides the diagnostic transparency required by activity
review").
**Direction:** earn-or-delete pass; target ≤2 callouts per page, each
carrying a tradeoff that the demo cannot show.

### A2 — Spec tables that re-narrate the demo

~80% of sections carry a State/Visual/Behavior (or Property/Spec) table, and
many rows describe exactly what is visible an inch above ("View → Default
display → Shows key-value pair with edit and delete icons"). The same
applies to all 8 template pages' "Workflow Guidance" trios (Human Control /
What Can Fail / Recovery Behavior), where rows often restate the page
subtitle.
**Direction:** keep spec tables only where they encode non-visible contract
(thresholds, recovery paths, a11y behavior); fold the rest into one line
under the demo.

### A3 — Sentence-level tells

- Em-dash density: 0.96 per 100 words across UI prose (≈1 per paragraph) —
  a known generated-prose signature; fine in moderation, currently a tic.
- 16% of prose strings contain an "x, y, and z" triad — the triad cadence
  flattens voice. (90 instances.)
- "X is not just Y. It is Z" constructions: "A composer is not just a chat
  box…", "An agent output can be more than a message…".
- "Ask only for missing decisions that would otherwise be invented" appears
  4× verbatim across surfaces.
  **Direction:** copy pass with a budget: one triad per section, vary the
  clarify-pattern phrasing per surface, halve the em-dashes.

## B. Demo-data realism

### B4 — "ACME" and the single-scenario monoculture

"ACME Customer Portal" appears in 5 places across trust, observability, and
feedback — the most recognizable placeholder name in software. Beyond the
name, one fictional project (launch review / export workflow / Launch
Policy v2) carries _every_ demo on the site. Scenario coherence is good;
monoculture + ACME reads auto-seeded.
**Direction:** rename to a boring believable product (e.g. "Northbeam
Customer Portal"), and let two deep pages (observability, multi-agent) run a
second scenario so the patterns visibly generalize.

### B5 — Numbers that read fabricated

- Token usage: budget exactly 100,000; used values 12,400 / 68,000 / 97,200
  (`observability-content.tsx:145`); the displayed per-session averages are
  visibly back-calculated quotients.
- Parallel Execution: all three "parallel" tasks stamp `10:44 AM · 1s`
  (`actions-content.tsx:1056,1066`) — uniform timing that contradicts the
  concurrency the section demonstrates.
- Mode toggles: all three modes claim exactly "4 X-specific tools"
  (`trust-content.tsx:821-843`).
  **Direction:** irregular budget (e.g. 87,500), real quotients, staggered
  parallel timestamps/durations, varied tool counts.

## C. Iconography

### C6 — One brain for two concepts

`Brain01Icon` appears 15× across 8 files meaning **memory** in some places
and **agent identity** in others (agent cards, subagent header, handoff
sender). Brain-as-anything-AI is the icon-level equivalent of slop, and the
double meaning breaks the star-for-favorite-and-rating rule in the repo's
own design-rules skill. The free icon set has `BotIcon` / `Robot01Icon`.
**Direction:** brain = memory only; agents get the bot glyph everywhere
(cards, tables, handoff, kill switch idle).

## D. Generic-UI fingerprints

### D7 — "Was this helpful?" thumbs row on the home demo

The single most recognizable chatbot-survey fingerprint, sitting directly
under the site's own Approve/Deny trust pattern. In dark mode the two
thumbs float unanchored.
**Direction:** remove from the home demo (feedback patterns have their own
page); the approval card already closes the loop.

### D8 — The workbench browser shows a generic SaaS pricing card

The contextual workbench's mock browser renders "Growth $29 / 10 seats
included / Usage dashboard / Email support" with a teal/red/yellow bar
chart — an unrelated pricing-page template in the middle of the
launch-review narrative, in colors foreign to the system.
**Direction:** show the artifact the agent is actually checking (launch
checklist page or support-readiness policy doc) in the narrative's palette.

### D9 — Error log empty state is the universal template

Centered icon + headline + subtitle, straight from the component-library
default. For a diagnostics surface, emptiness is information.
**Direction:** "No anomalies since session start, 11:32 AM" as a single
quiet timeline line instead of the centered tile.

## E. Structure & layout

### E10 — Hand-rolled spec tables silently overflow

The stock Table keeps `whitespace-nowrap`; the shared spec components
override it, but hand-rolled view tables don't. Measured horizontal
overflow with no affordance: /conversation 369px + 67px + 30px hidden,
/memory 129px + 126px + 33px, /multi-agent 17px, /feedback 12px.
**Direction:** `whitespace-normal` on prose columns of every hand-rolled
table (or fix the shared default and opt data tables out).

### E11 — Agent-cards "Operational table" is a static prop

It doesn't change across Active/Idle/Error and sits flush under the card
demo, reading as demo content rather than spec.
**Direction:** sync the table rows with the selected state (idle zeroes,
error retry context) or visually separate it as documentation.

### E12 — Mobile state-coverage stacks lose hierarchy

At 390px the State/User Sees/System Does tables become uniform stacked
cards with repeated sub-labels and equal weight; a blocked row and a
running row read identically.
**Direction:** on mobile show badge + "user sees" line; tuck "system does"
behind a disclosure.

## Verified non-findings

- The "default state identical to first control state" pairs flagged in
  review (parallel, kill-switch, mode-toggles, agent-routing) are an
  artifact of the capture harness re-clicking the already-active control —
  not product issues.
- Vocabulary slop is essentially absent (no "seamless/leverage/robust"
  marketing register anywhere).
- Dark theme holds up across deep pages; overlays (decision dialog,
  composer menu) match the product voice.
- Timestamps elsewhere cohere (11:0x AM cluster, 14:02 audit cluster).
