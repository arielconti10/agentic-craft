# AGENTS.md - Agentic Craft

Agentic Craft is a reference guide and shadcn registry for agent product UI.
The site teaches patterns; the registry ships installable primitives. Treat
interaction quality, accessibility, and registry portability as product
requirements.

Keep this file short. Read only the task-specific docs you need.

## Always

- Use shadcn primitives before custom markup. If shadcn owns the primitive,
  compose it instead of rebuilding it.
- Edit UI source in `src/components/ui/`. Never edit `registry/base-nova/ui/`
  or `public/r/` directly.
- Registry components inherit the consumer's theme. Do not hardcode site fonts,
  site-only classes, icon family, icon stroke width, or custom color tokens.
- Animation is CSS-only in `src/index.css` or registry item `css`; every
  animation needs a reduced-motion path.
- Preserve the dirty worktree. Do not revert unrelated user changes.
- Run the smallest relevant verification while working; run `pnpm run verify`
  before a PR or handoff that claims the full repo is clean.

## Ask First

- Add or remove a top-level dependency.
- Delete or consolidate top-level docs.
- Change registry item names, URLs, or public install commands.
- Make broad visual-system changes outside the touched route or component.

## Never

- Recreate a shadcn primitive with custom styled markup.
- Edit `registry/base-nova/ui/` or `public/r/` directly.
- Add site-only visual rules to registry components.
- Change `registry.json` without rebuilding `public/r/`.
- Bypass failing verification.

## Read When Relevant

| Task                                               | Read                            |
| -------------------------------------------------- | ------------------------------- |
| Stack, scripts, dependencies, package manager      | `package.json`                  |
| Registry component or `src/components/ui/*` change | `agent_docs/registry.md`        |
| Pattern page, visual polish, or interaction design | `agent_docs/design.md`          |
| Choosing checks or reporting verification          | `agent_docs/verification.md`    |
| Product/design rationale                           | `DESIGN.md`                     |
| Pattern research                                   | `docs/research.md`              |
| Registry install surface                           | `README.md` and `registry.json` |
| Composer/autonomy session handoff (eve-chat)       | `sessions/2026-07-03-eve-chat-composer-autonomy.md` |
| eve-chat compound composer + playgrounds (snapshot)| `references/eve-chat/README.md` |
| July 2026 autonomy/composer web audits             | `audits/` (see session doc index) |

Project-local skills live in `.agents/skills/`. Use only the skills relevant to
the task; do not load them all by default. Skill-local `AGENTS.md` files apply
only while working inside that skill.

## Cursor Cloud specific instructions

- This is a **single static Next.js app** (App Router). There is no backend,
  database, auth, or environment secrets — one dev server is the whole product.
  Start it with `pnpm run dev` (serves `http://localhost:3000`); all demos run
  client-side with baked-in fixture data.
- Node 22 and pnpm 11.7.0 are preinstalled; the startup update script runs
  `pnpm install --frozen-lockfile`. Standard commands live in `package.json`
  (`dev`, `build`, `lint`, `typecheck`, `test`, `verify`, `registry:build`).
- Registry gotcha: `src/components/ui/*` is the source of truth, but CI's
  `pnpm run verify` runs `scripts/sync-registry.mjs --check` and then fails on
  `git diff --exit-code -- public/r registry.json`. After changing a UI
  component, regenerate committed artifacts with
  `node scripts/sync-registry.mjs && pnpm run registry:build` and commit the
  `registry/base-nova/` and `public/r/` output, or verify/CI will fail even
  though the app runs fine.
- `pnpm run build` uses Turbopack and prerenders ~33 static routes; a green
  build does not exercise interaction, so verify UI behavior against the running
  dev server.
