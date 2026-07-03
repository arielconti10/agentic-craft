# eve-chat playgrounds — reference snapshots

Snapshots from `~/workspace/eve-chat/app/playground/` (2026-07-03).

These files are **not runnable** in agentic-craft as-is — they import eve-chat paths (`@/primitives/composer`, `@/components/ui/*`). Use them as reference when building agentic-craft demos or recovering playground patterns.

| File | eve-chat route | What it exercises |
|------|----------------|-------------------|
| `composer-playground.tsx` | `/playground/composer` | Compound composer: controlled/uncontrolled, attachments, InfoBar, fixture controls, thread fixture |
| `navigation-rail-playground.tsx` | `/playground/navigation-rail` | NavigationRail + MessageScroller visibility hooks |
| `layout.tsx` | `app/playground/layout.tsx` | ui.sh variant picker script (lazyOnload) |

## Running live

In eve-chat:

```bash
cd ~/workspace/eve-chat && pnpm dev
```

Open `http://localhost:3000/playground/composer` and `/playground/navigation-rail`.

## Contract variant rig (Claude session only)

Bare / B / C / D dispatch-contract comparison was built in Claude Code session `dfcc806d` as integrator-side composition (receipt line between `Input` and `Footer`). That variant picker is **not** in this snapshot. See session doc before recovering.
