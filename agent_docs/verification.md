# Verification

Use this file when deciding what to run or when reporting verification.

## Standard Commands

```bash
npm run lint
npm run typecheck
npm run format:check
node scripts/audit-ui.mjs --fail
node scripts/sync-registry.mjs --check
node scripts/check-registry-deps.mjs
npm run build
npm run registry:build
```

`npm run verify` runs the full chain.

## Scope The Checks

- Docs-only changes: run Prettier on touched Markdown files.
- UI primitive changes: add focused tests, then run registry sync/build checks.
- Pattern page changes: run lint/typecheck and browser QA for the touched route.
- Dependency or config changes: run the full verification chain.

## Reporting

Report exactly what passed and what was skipped. If a command fails, include the
failing command and the first useful error, then fix or stop.
