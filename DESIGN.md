---
version: alpha
name: Agentic Craft
description: Reference guide and shadcn registry for agent product UI beyond chat.
colors:
  background: "oklch(1 0 0)"
  foreground: "oklch(0.145 0 0)"
  card: "oklch(1 0 0)"
  card-foreground: "oklch(0.145 0 0)"
  popover: "oklch(1 0 0)"
  popover-foreground: "oklch(0.145 0 0)"
  primary: "oklch(0.205 0 0)"
  primary-foreground: "oklch(0.985 0 0)"
  secondary: "oklch(0.97 0 0)"
  secondary-foreground: "oklch(0.205 0 0)"
  muted: "oklch(0.97 0 0)"
  muted-foreground: "oklch(0.556 0 0)"
  accent: "oklch(0.97 0 0)"
  accent-foreground: "oklch(0.205 0 0)"
  border: "oklch(0.922 0 0)"
  input: "oklch(0.922 0 0)"
  ring: "oklch(0.708 0 0)"
  destructive: "oklch(0.577 0.245 27.325)"
  status-ok: "oklch(0.54 0.14 155)"
  status-warn: "oklch(0.72 0.14 85)"
typography:
  display:
    fontFamily: Signifier
    fontSize: 48px
    fontWeight: 300
    lineHeight: 1.12
    letterSpacing: -0.02em
  heading:
    fontFamily: PP Neue Montreal
    fontSize: 20px
    fontWeight: 600
    lineHeight: 28px
    letterSpacing: 0px
  body:
    fontFamily: PP Neue Montreal
    fontSize: 14px
    fontWeight: 400
    lineHeight: 22px
    letterSpacing: 0px
  label:
    fontFamily: PP Neue Montreal
    fontSize: 12px
    fontWeight: 600
    lineHeight: 16px
    letterSpacing: 0.08em
  agent-prose:
    fontFamily: Signifier
    fontSize: 16px
    fontWeight: 400
    lineHeight: 26px
    letterSpacing: -0.025em
  mono:
    fontFamily: monospace
    fontSize: 12px
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: 0px
rounded:
  sm: 0.375rem
  md: 0.5rem
  lg: 0.625rem
  xl: 0.875rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  section: 64px
  touch-target: 44px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    height: 32px
    padding: 10px
  button-secondary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    height: 32px
    padding: 10px
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    height: 40px
    padding: 12px
---

# Agentic Craft

## Overview

Agentic Craft is a reference guide and shadcn registry for design engineers
building product interfaces around agent work. It is not a chat starter, a
marketing site, or a generic component catalog. The site teaches reusable
interaction patterns; the registry ships portable primitives and blocks that
teams can install into their own shadcn applications.

The design problem is the interface around partial autonomy: how a person sees
what an agent is doing, understands what it used, changes the work before it
becomes real, approves or rejects consequences, and recovers when something is
wrong. Agentic Craft should make those contracts visible without turning the
product into a process theater.

The interface should feel like a working reference: compact, inspectable,
precise, and built for repeated reading. It can have editorial judgment, but the
visible experience must always serve the pattern being taught.

## Surfaces

Agentic Craft has three surfaces with different rules.

**Reference site.** The Next.js app teaches the patterns through pages, route
structure, worked examples, and live specimens. Site code lives in `app/`,
`src/views/`, `src/content/`, `src/components/`, and site-only CSS in
`src/index.css` or route-local CSS.

**Registry source.** Installable primitives and blocks are authored in
`src/components/ui/`. This is the source of truth for registry UI work.

**Generated registry output.** `registry/base-nova/*` is synchronized output
from `node scripts/sync-registry.mjs`; `public/r/*` is built output from
`pnpm run registry:build`. Do not edit generated registry output directly.
The `base-nova` directory name records the current shadcn target: Base UI
primitives with the Nova style preset. It is a configured user choice, not an
Agentic Craft brand name.

When a rule differs between the site and installable code, respect the shadcn
target first. The site may demonstrate a stronger visual point of view; the
registry must behave well inside another team's chosen base, style, theme,
radius, font, and icon setup.

## Colors

The default site palette inherits shadcn's semantic token model: background,
foreground, card, popover, primary, secondary, muted, accent, destructive,
border, input, and ring. These tokens are defined in `src/index.css` for light
and dark themes.

Neutral surfaces do most of the work. Chroma appears when it communicates
state, focus, relationship, or a primary action. Do not use decorative color in
pattern specimens if it makes status harder to read.

Registry components should prefer semantic shadcn utilities such as
`bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`,
and `ring-ring`. Hardcoded colors in registry components are migration
candidates unless the component is explicitly modeling a foreign artifact such
as a source preview, screenshot, document, or terminal surface.

## Typography

The site uses PP Neue Montreal for product UI and Signifier for display moments
and authored agent prose. PP Neue Montreal carries navigation, controls,
labels, metadata, forms, tables, and explanatory text. Signifier is reserved
for page-level display and the `.agent-prose` voice.

The registry must not depend on Agentic Craft fonts. Registry components should
inherit the consumer's font stack except for narrow semantic roles such as code,
timestamps, tabular telemetry, or a documented agent-prose slot.

Use tabular numerals for changing numbers, time, cost, counts, progress, and
telemetry. Copy should be short, specific, and operational. Avoid generic AI
copy, marketing superlatives, and labels that hide the object of the action.

## Layout

The site teaches through a small number of strong specimens rather than dense
galleries of disconnected components. A page should make the relationship
between principle, example, implementation, and tradeoff obvious.

Default page rhythm:

- short thesis
- live specimen or worked example
- concise explanation of states and behavior
- tradeoffs or anti-patterns when they affect implementation
- registry links when installable code exists

Mobile layouts are first-class. Composer, citation, clarification, memory, and
run-monitor surfaces must preserve touch targets, readable text, and stable
layout under narrow widths. Use the `44px` touch-target rule unless a compact
control provides an equivalent hit area with `data-compact-touch`.

## Elevation & Depth

Hierarchy should come from layout, type, borders, tonal surfaces, and state
copy before shadows. Use shadows for overlays, popovers, dialogs, menus, and
intentional artifact previews where depth communicates stacking or modality.

Do not use depth to make weak structure look designed. If a page needs many
floating cards, the underlying information architecture is probably unclear.

## Shapes

Use the shadcn radius family exposed from `--radius`. Everyday buttons,
inputs, cards, tabs, and tool surfaces should stay tight and predictable.
Reserve full pills for badges, compact status labels, avatars, and circular
icon controls.

Do not mix sharp, pill, and large-rounded treatments in one specimen unless the
contrast maps to a real semantic difference.

## Components

Use shadcn primitives before custom markup. If shadcn owns the primitive,
compose it instead of rebuilding it:

- actions use `Button`
- status chips and inline labels use `Badge`
- disclosure uses `Collapsible`, except for the documented `observable-work`
  native-details pattern
- option sets use `Tabs` or `ToggleGroup`
- forms use `Field`, `InputGroup`, `Input`, `Textarea`, and `Switch`
- overlays use `Dialog`, `Sheet`, `Tooltip`, `DropdownMenu`, or `Popover`

This repository currently uses shadcn's Base UI target, so trigger and slot
composition should follow the Base UI API (`render`, plus `nativeButton={false}`
when rendering a non-button element). Do not write Radix-only `asChild` examples
inside local source unless the project configuration changes.

Custom UI is appropriate when the component is the agent-specific pattern:
`ObservableWork`, `ReferenceItem`, `DecisionSurface`, `SourcePreview`,
`Composer`, `RunTrace`, `HandoffPacket`, or a composed workflow block.

Pattern controls must actually change the specimen. Nothing should look
interactive unless it is interactive.

## Registry Contract

Registry components are installable shadcn code, not Agentic Craft-branded
widgets. They must preserve the shadcn choices made by the project that installs
them: primitive base, style preset, theme, radius, fonts, dark mode, motion
preferences, and icon conventions.

For this repository, `components.json` currently resolves to `base-nova`:
Base UI primitives, Nova style, Tailwind v4, Hugeicons, neutral theme, and
`@/components/ui` as the UI alias. Use `pnpm exec shadcn info --json` when this
needs to be refreshed, because those fields are the contract for local work.

For new registry work:

- author source in `src/components/ui/`
- wrap shadcn primitives instead of recreating them
- use the configured primitive API (`render` for Base UI, `asChild` for Radix)
- add required shadcn primitives to `registryDependencies`
- use semantic shadcn tokens and utilities
- avoid site-only classes, route-local CSS, and site layout assumptions
- use the configured icon library for local source, and prefer icon slots, text
  labels, CSS indicators, or shadcn-provided icon behavior when portability
  matters
- define every empty, loading, running, blocked, error, and complete state
- include reduced-motion behavior for every animation

Existing registry components that do not meet these rules should be treated as
audit targets, not precedent.

## Do's and Don'ts

- Do show agent work as structured state, not raw chain-of-thought.
- Do use progressive disclosure for traces and tool details.
- Do lock consequence previews before consequential actions.
- Do attach provenance to the claim, artifact, or action it supports.
- Do distinguish working context, session memory, and durable memory.
- Do show cost, elapsed time, and confidence only where they help users steer.
- Do make autonomous behavior interruptible.
- Do keep examples plausible: odd counts, believable paths, real timings, and
  specific object names.
- Don't expose internal craft rules as public page content.
- Don't use spinners as a substitute for observable work.
- Don't create dead hover states, fake disclosure rows, or controls that do
  nothing.
- Don't make registry components depend on Agentic Craft fonts, routes, or
  site-only classes.
- Don't use color as the only state signal.
- Don't add ornamental AI chrome: sparkle icons, glowing gradients, fake
  thinking animations, or decorative trust badges.

## Verification

Use the smallest check that matches the change while working. Before claiming a
full handoff or PR is clean, run `pnpm run verify`.

For registry changes, also run:

```bash
node scripts/sync-registry.mjs --check
node scripts/check-registry-deps.mjs
pnpm run registry:build
```

For visual work, inspect desktop and mobile routes in the browser. The code
review bar is not just whether the page compiles; the specimen must teach the
pattern, remain accessible, and avoid misleading interaction.
