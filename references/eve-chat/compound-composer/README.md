# compound-composer

Reference snapshot of eve-chat's framework-agnostic **compound Composer primitive**.

- **Source:** `~/workspace/eve-chat/primitives/composer/`
- **Renamed:** `compound-composer` in agentic-craft to avoid collision with registry [`composer`](../../../src/components/ui/composer.tsx)
- **Not wired:** This folder is a read-only reference — not imported by the agentic-craft site build

## Files

| File | Description |
|------|-------------|
| `composer.tsx` | Full compound primitive (~1k lines) |
| `index.ts` | Public exports |
| `types.test.tsx` | Type-level / render tests |

## API summary

```tsx
<Composer.Root<TControls>
  value={draft}
  onChange={setDraft}
  onSubmit={({ message, controls, attachments }) => …}
  onStop={…}
  phase="idle" | "preparing" | "busy"
  controls={controls}
>
  <Composer.Frame>
    <Composer.Input />
    <Composer.Footer>
      <Composer.Controls>{/* integrator slots */}</Composer.Controls>
      <Composer.SubmitSlot>
        <Composer.Submit />
      </Composer.SubmitSlot>
    </Composer.Footer>
  </Composer.Frame>
</Composer.Root>
```

## Dependencies (in eve-chat)

Requires eve-chat shadcn pieces: `@/components/ui/button`, `input-group`, `attachment`, `@/lib/utils` (`cn`).

To port into agentic-craft: align imports with local shadcn paths or promote selected parts into the registry.

## Session context

See [`sessions/2026-07-03-eve-chat-composer-autonomy.md`](../../../sessions/2026-07-03-eve-chat-composer-autonomy.md).
