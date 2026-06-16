# Design And Interaction Work

Use this file for pattern pages, visual polish, frontend interaction quality,
and design-system decisions.

## Sources

- `DESIGN.md` is the product/design/registry rationale.
- `docs/research.md` is the canonical pattern research.
- `src/index.css` contains global tokens, keyframes, and site-only classes.
- `.impeccable/design.json` is the design-token reference.
- `.agents/skills/emil-design-engineering/` applies to component design and
  pattern pages.
- `.agents/skills/make-interfaces-feel-better/` applies to animation, surface
  feel, typography, and performance.
- `.agents/skills/userinterface-wiki/` applies to detailed UI-rule audits.

Load only the skill that matches the task.

## Shadcn-First UI

Shadcn/ui is the default UI system for the app. Design work should compose
installed shadcn primitives before introducing custom component markup.

Start from shadcn for:

- buttons and icon buttons
- tabs, segmented controls, and option sets
- badges, status chips, alerts, and progress
- separators, skeletons, empty states, and loading indicators
- collapsible/disclosure UI
- fields, labels, inputs, textareas, switches, and input groups
- dialogs, sheets, tooltips, dropdowns, and other overlays

Use `className` to arrange layout around shadcn components. Do not rebuild a
component variant with a long custom class string when a shadcn variant or
composition exists.

Custom UI is acceptable when the component is the pattern itself, such as
`Thread`, `ObservableWork`, or another agent-specific primitive. Even then,
compose subcontrols from shadcn primitives wherever possible.

## Product Frame

Agentic Craft is for design engineers building agent products. The surface
should feel like a reference guide, not a marketing site or generic chat demo.

## Interaction Bar

- Nothing looks interactive unless it is interactive.
- Demo controls must change the specimen.
- Show real state, not placeholders.
- Use tabular numerals for changing numbers, durations, costs, and counts.
- Use focus rings based on `--ring`.
- Wrap hover rules in hover-capable media queries.
- Every animation has a reduced-motion branch.
- Mobile layouts need real touch targets and non-overlapping text.

## Before Finishing

Check desktop and mobile for every route you touch. For local app previews, use
the browser and inspect the rendered page, not only the code.
