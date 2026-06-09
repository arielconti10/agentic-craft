# Deep Visual-Break Audit

> **Status update (2026-06-09):** every break and "looks bad" item below has
> been fixed and visually re-verified (light + dark, 390/768/1024/1440px,
> zero console errors, zero horizontal overflow). Deliberately left as-is:
> the cream workbench pane in dark mode (reads as a light webpage inside a
> browser frame), and the app-wide muted-text opacity scale
> beyond the specific spots called out (footer, empty-state hints, handoff
> stepper) — a full contrast retune deserves its own design pass.
> The "Pattern Pieces" boilerplate was subsequently fixed too: spec text now
> comes from each item's registry.json description, with short factual
> descriptions for stock shadcn primitives.

Date: 2026-06-09
Scope: every route (10 pattern/index pages + 8 template pages), light and dark
themes, every demo-control state (~180 section-state captures), tablet widths
(768/1024px), plus targeted interaction probes (popovers, toggles, dialogs,
animation end-states). This report focuses only on what is broken or looks
bad. Strengths are covered in `visual-ux-audit.md`.

## Breaks

### 1. Shimmer label renders as a solid gray rectangle with invisible text

Home demo: the "Reviewing sources" thinking indicator paints as an opaque
gray gradient box; the label text itself is invisible. Affects every modern
browser.

Root cause: `.conv-shimmer-text, .demo-shimmer-text` (`src/index.css:515`)
sets the gradient via the `background:` **shorthand** with an `oklch()` color
stop. Lightning CSS emits a `@supports (color: lab(0% 0 0))` fallback block
that re-declares the `background` shorthand — which resets
`background-clip` to `border-box`. That block wins in any browser supporting
`lab()`, so the clip-to-text is lost while `-webkit-text-fill-color:
transparent` keeps the glyphs invisible. Verified live: computed
`background-clip` is `border-box`.

Fix: declare the gradient with `background-image:` (longhand) instead of the
shorthand, or replace the `oklch()` stop with a hex so no fallback is
generated.

### 2. "Content density" CSS silently empties whole sections

`src/index.css:238-251` globally hides section explainer paragraphs, spec
tables, and callouts with brittle structural selectors such as:

```css
.page-section > div.mt-8:has(> [data-slot="table-container"] > table.w-full.text-sm)
```

Confirmed visible damage:

- **`/sources` → "Implementation / Required states"**: the desktop table
  (`hidden md:block`, `sources-content.tsx:336`) is beaten by the `:has()`
  rule above, and the mobile fallback is `md:hidden` — so **both** variants
  compute `display:none` at desktop widths. The page ends with an orphaned
  kicker + heading and dead space.
- **`/templates` → "Monitor / Run Monitor"**: the entire section body is
  hidden; an empty section (kicker + heading + nothing) sits between two
  dashed dividers mid-page.

These selectors also hide every `h2 + p.text-muted-foreground` section
description that the page sources clearly intend to render. Any future
`div.mt-8` containing a table will silently vanish too. If the density
behavior is wanted, gate it on an explicit opt-out class instead of
structural `:has()` matching; and never leave a heading whose content is
hidden.

### 3. Memory Panel cards: word-per-line titles with per-line ellipses

`/memory` "Memory Panel": titles render as `ent… / rele…`,
`Launch / Policy / v2`, `self– / serve / onboar… / flow` — at **every**
viewport tested (1440, 1024, 768, 390 px). At **1024px it degenerates
completely**: titles collapse to single truncated characters per line
(`L… / r… / t…`), the first card's title disappears entirely, and the black
popover becomes a ~1300px-tall mostly-empty column.

Two stacked causes:

- `ReferenceItem.Title` applies `truncate`
  (`reference-item.tsx:75`); `memory-ledger-item.tsx:54` overrides only
  `whitespace-normal`, so `text-overflow: ellipsis` + `overflow: hidden`
  now apply to every wrapped line box → an ellipsis on each line.
- The header row keeps the scope badge and the Inspect/Edit/Remove actions
  inline at all widths, starving the title to ~100px even when the card has
  free space.

Same demo: the black source-preview popover is stretched to the full height
of the six-card list (~1150px) with roughly the bottom two-thirds empty —
a large dead black slab. Size it to its content.

### 4. Dead control: "Expand All" on Tool Calls does nothing

`/actions` → Tool Calls. Toggling "Expand All" produces zero change (rows
stay collapsed in every combination with Error State/Grouped — verified by
state-by-state captures). The state is stored at `actions-content.tsx:329`
and rendered as a control at `:576` but never consumed by the render path.
Either wire it to the `ToolCall` open state or remove the control.

### 5. Light-theme flash when dark mode is active (carried from prior audit)

The theme class is applied by a `next/script` in `<body>`
(`app/layout.tsx:75`), so the first painted frame of a hard load is light
even when dark is stored. Move the initializer to an inline `<head>` script.

## Looks bad (not strictly broken)

### 6. Demo state drifts from its selected control

`/actions` → Subagent Orchestration: with **Running** selected, the progress
animation finishes after ~5s and the card permanently shows a **complete**
badge while the "Running" control stays pressed. The demo should loop, hold
a mid-progress state, or reset. Also: badge casing is inconsistent —
lowercase `complete` here vs `Complete`/`Active`/`Pending` badges elsewhere.

### 7. Uneven agent-card grid

`/multi-agent` → Agent Cards: "Map requirements to controls" wraps to two
lines while sibling subtitles fit on one, so the three cards have different
internal rhythm and heights in every state (worst in Error, where titles
wrap too). Reserve two lines or shorten the copy.

### 8. `/templates` → Approval Workflow section is a lone button

The section renders only a "Review proposed action" button (it does open a
working dialog). Next to sibling sections that show full specimens, it reads
as missing content — especially right above the fully-empty Run Monitor
section (break #2).

### 9. Dark mode: inactive stepper steps near-invisible

`/multi-agent` → Handoff Flow: Step 2 / Step 3 dots and labels use heavily
muted color that drops to roughly 2:1 against the dark background —
de-emphasis reads as disabled/absent. The same muted-opacity scale also makes
several progress-bar tracks hard to discern in dark mode (`/sources` Run
budget, `/multi-agent` Parallel Agents).

### 10. Theme switcher truncates ("Syste…")

Sidebar footer at the default 220px width (`app-sidebar.tsx:63`). Icon-only
buttons with tooltips, or a shorter label, would fix it.

### 11. Template index cards: every title ellipsized mid-word at 768px

`/templates` template index grid at 768px: "Clarifyin…", "Source-b…",
"Memory r…", "Run moni…", "Multi-ag…", "Agent se…" — six of eight card
titles truncate while the "Template" badge keeps its full width. Same
title-vs-badge flex pattern as the memory cards; let the title wrap to two
lines or drop the badge below it at narrow widths.

### 12. Workflow map crams five columns at 768px

`/templates` "Review to delivery" map keeps its 5-column layout at 768px,
leaving ~110px per stage; the stage descriptions wrap one word per line.
Collapse to 2–3 columns (or vertical steps) below ~900px.

### 13. Spec-table cells silently truncate prose at full desktop width

On all 8 template detail pages, the "State Coverage" table ellipsizes its
cell text even at 1440px in both themes ("Action summary, affected objects,
and…", "Locks the preview payload used for…", "Archives intermediate work
behind a useful…"). The truncated text is the actual contract content of the
page — let cells wrap instead of `truncate`.

## Nits

- **Repeated boilerplate**: template detail pages, "Pattern Pieces" table —
  the same sentence "Compose X into the workflow without hard-coding the
  whole page as one…" repeats (ellipsized) for all four rows
  (e.g. `/templates/run-monitor`).
- **Copy**: "…across 5 classes. implementation notes summarize…" —
  lowercase sentence start (`feedback-content.tsx:51`, visible in two
  Feedback demos).
- **Dark workbench seam**: the mock-browser pane keeps its hardcoded cream
  palette (`contextual-workbench.tsx:312`) inside an otherwise dark page —
  defensible as "a light webpage in a browser," but the hard seam against
  the dark transcript pane is jarring.
- **Progress step subtitle truncation at 768px**: "Launch checklist, issue
  triage policy, source sco…" (`/conversation` Progress Steps) — single line
  truncate in a narrow container; acceptable for tool rows, marginal for a
  three-item summary.
- Low-contrast muted text (~49 `text-muted-foreground/30–/60` usages) and
  sub-24px touch targets (citation markers 34×18, composer chips) — detailed
  in `visual-ux-audit.md`.

## Verified non-issues (so they don't get re-chased)

- The "N" avatar / red "1 Issue" pill overlapping the sidebar footer is the
  Next.js dev-tools indicator, dev-only.
- "Black serif text on dark pages" in some automated captures is a
  headless-Chromium _element-screenshot_ artifact; full-viewport renders and
  computed styles are correct in the real DOM.
- Composer "Suggestions" showing an empty composer in one capture was the
  capture toggling the (default-on) control off — the default state renders
  chips correctly.
- The contextual workbench extending past the content column is an
  intentional full-bleed breakout (`md:-mx-14 lg:-mx-28`).
- No horizontal overflow at 390/768/1024/1440 on any route; zero console
  errors across all routes and states tested.
