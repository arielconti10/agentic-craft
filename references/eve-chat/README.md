# eve-chat proving ground — reference snapshot

**Source repo:** [`vercel-labs/eve-chat-template`](https://github.com/vercel-labs/eve-chat-template) fork at `~/workspace/eve-chat`  
**Snapshotted:** 2026-07-03  
**Session context:** [`sessions/2026-07-03-eve-chat-composer-autonomy.md`](../../sessions/2026-07-03-eve-chat-composer-autonomy.md)

eve-chat is a **template / integration proving ground** for the eve agent framework. agentic-craft owns the public framework, registry, and research; eve-chat owns live eve wiring.

---

## Five-surface agentic UX model

| Surface | eve-chat location (approx.) | Notes |
|---------|----------------------------|-------|
| Agent Thread | `components/ui/message-scroller.tsx`, `bubble`, `message`, `thread-markdown` | Turn anchoring, scroll behavior |
| Agent Composer | `primitives/composer/` → `ComposerEve` adapter | Pre-dispatch; framework-agnostic primitive |
| Run Panel | (planned / partial) | Plan, Activity, Sources, Summary — during run |
| Human Gate | outside composer | Setup, auth, intervention gates |
| Review Surface | (planned) | Post-run outcomes |

Navigation rail (`components/ui/navigation-rail.tsx`) supports thread wayfinding — jump between turns from a gutter.

---

## Primitives vs registry components

### Compound composer (`compound-composer/`)

**Canonical path in eve-chat:** `primitives/composer/`

Framework-agnostic chat input exposed as a **compound component**:

```
Composer.Root
  Composer.Frame
    Composer.Before          (optional slot)
    Composer.InfoBar         (optional banner)
    Composer.Attachments     (optional)
    Composer.Input
    Composer.Footer
      Composer.Controls      (integrator-owned — mode chips, attach, etc.)
      Composer.SubmitSlot
        Composer.Submit
```

**Design rules (from eve-chat AGENTS.md):**

- Controlled (`value` / `onChange`) and uncontrolled (`defaultValue`; self-clears on submit)
- Submit lifecycle: `phase: "idle" | "preparing" | "busy"` — no composer-level `disabled` / `disabledReason`
- Rich affordances stay opt-in compound parts (`InfoBar`, `Attachments`, `Attach`) — not monolithic props
- Design-system deps OK (shadcn, `cn`); agent-framework imports **not** in the primitive
- eve adapter: `primitives/composer/adapters/eve.tsx` (not snapshotted — eve-specific)

**Renamed here as `compound-composer`** to distinguish from agentic-craft's registry [`composer`](../../src/components/ui/composer.tsx).

### Thread / scroll stack

| Component | Path in eve-chat | Role |
|-----------|------------------|------|
| MessageScroller | `components/ui/message-scroller.tsx` | Wraps `@shadcn/react/message-scroller`; viewport, anchor scroll |
| NavigationRail | `components/ui/navigation-rail.tsx` | Turn gutter; hover preview + jump |
| Bubble / Message | `components/ui/bubble.tsx`, `message.tsx` | Message chrome |
| Marker | `components/ui/marker.tsx` | Turn markers in thread fixture |

### Supporting UI used by composer

| Component | Path | Role |
|-----------|------|------|
| InputGroup | `components/ui/input-group.tsx` | Composer textarea chrome |
| Attachment | `components/ui/attachment.tsx` | File chips in composer |
| Button, DropdownMenu, Tooltip | `components/ui/*` | Controls |

---

## Playgrounds (`playgrounds/`)

Isolated comparison rigs under `app/playground/<name>/` in eve-chat. Uses ui.sh picker script for variant comparison (see `layout.tsx`).

| Route | Snapshot | Purpose |
|-------|----------|---------|
| `/playground/composer` | `playgrounds/composer-playground.tsx` | Compound API, fixture controls payload, home-style + plus menu + uncontrolled + thread fixture |
| `/playground/navigation-rail` | `playgrounds/navigation-rail-playground.tsx` | Rail + MessageScroller integration, hover wave, jump-to-turn |

**Run in eve-chat:** `pnpm dev` → open routes above.

**Bare/B/C/D contract variants:** Explored in Claude Code session `dfcc806d` as integrator-side slots (receipt line, scope rows). Not in the committed playground snapshot — see session doc for intent. Recover from Claude session if revisiting (after reframe).

---

## Integration in eve-chat (not snapshotted)

| Piece | Path |
|-------|------|
| Shared chat session | `app/_components/agent-chat.tsx` |
| Home + session routes | `app/_components/home-chat-page.tsx`, `session-chat-page.tsx` |
| ComposerEve adapter | `primitives/composer/adapters/eve.tsx` |

Both `/` and `/chat/[id]` use one `AgentChatSession` + `ComposerEve` — no per-route composer forks.

---

## Relationship to agentic-craft registry

| agentic-craft | eve-chat compound composer |
|---------------|---------------------------|
| Registry `composer` + islands | Slot-based compound API |
| Demo-first (`InteractiveComposer.tsx`) | Integration-first (eve adapter) |
| Hugeicons, context ring, suggestions | Lucide, phase lifecycle, generic controls generic |
| Published via `public/r/composer.json` | Lives in `primitives/composer/` |

Future work may **merge ideas** (e.g. receipt line, scope chips) into either surface — but they should not be conflated without an explicit promotion step.
