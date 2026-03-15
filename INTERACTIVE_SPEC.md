# Interactive Page Specification

Every page in this design system must have interactive demos at the level of
InteractiveComposer.tsx. Here's what that means:

## The Standard (set by InteractiveComposer)

1. **Controls panel** — toggle buttons above the demo that activate/deactivate
   features. Active controls show a small dot indicator. Controls use
   `rounded-md border border-border px-2.5 py-1 text-xs transition-colors`.
   Active: `bg-foreground text-background`. Inactive: `hover:bg-muted`.

2. **Real state** — everything uses React `useState`. Inputs type. Buttons
   animate. Toggles toggle. Nothing is static HTML with no behavior.

3. **Animations** — islands slide up (translateY 16→0, 250ms ease-out).
   Press effects (scale 0.97). Fade in/out for appearing/disappearing elements.
   No motion libraries — pure CSS keyframes injected via `<style>`.

4. **Single interactive demo per section** — NOT 5 static screenshots. One
   component, many states controlled by the controls panel.

5. **Everything clickable** — chips, buttons, dismiss ×, expand/collapse,
   tabs. Every interactive element works.

6. **Spec table follows the demo** — bare table, no wrapper card.

7. **Callout at the end** — border-l-2 italic muted text explaining design
   rationale.

## Tech constraints

- React 19 + Vite 7 + Tailwind CSS v4 + shadcn/ui v4 (neutral, inset)
- Icons: `@hugeicons/react` + `@hugeicons/core-free-icons`
  - Usage: `<HugeiconsIcon icon={SomeIcon} size={14} strokeWidth={1.5} />`
  - All icons monochrome, no colors
- No motion/framer-motion — pure CSS animations via injected `<style>` tags
- Import pattern: `import { HugeiconsIcon } from "@hugeicons/react"`
  then `import { IconName } from "@hugeicons/core-free-icons"`
- shadcn components from `@/components/ui/*` (DropdownMenu, Tooltip, etc.)
- Page structure: `<article>` with `<header>` + `<section className="page-section">`
- Section labels: `<p className="section-label mb-3">CATEGORY</p>`
- Headings: `<h2 className="text-xl font-semibold tracking-tight">Title</h2>`
- Demo containers: `<div className="border border-border/40 rounded-lg p-6">`
- Page title: `<h1 className="font-serif text-4xl font-light tracking-tight leading-[1.15]">`
- Description: `<p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">`
- Font for agent prose: `font-serif text-base` with inline style for
  lineHeight: "26px", letterSpacing: "-0.4px", fontVariationSettings: '"opsz" 12'
- Tables: bare, no wrapper. `<th>` uses `text-xs font-medium text-muted-foreground`
- Callouts: `border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground`

## Domain context

This is a design system for an agentic interface used by non-technical
certification professionals (Common Criteria, CRA — EU Cyber Resilience Act).
All example content should use CC/security evaluation terminology:
- Security Targets, Protection Profiles, SFRs, SARs, EAL levels
- TOE (Target of Evaluation), ITSEF (evaluation facility)
- FCS_COP, FDP_ACF, FAU_GEN — CC functional requirement families
- Evaluators, evaluation evidence, conformance claims

## User instructions (CRITICAL)

- NO function signatures in demos (e.g., `analyze_execution_logs("FAU_GEN.1")`)
  — use human-readable labels only
- All icons monochrome — no colors
- No spinners/loaders while tools load
- Tool labels: font-weight 400 (never bold)
- No success/failure icons on tool calls
- No pill shapes — use rounded-md consistently
- Sans font: Albert Sans. Serif font: Source Serif 4
- Agent prose color in light mode: oklch(0.2642 0.013 93.9)
