import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  Composer,
  type ComposerAttachment,
  type ComposerSubmit,
} from "../../src/components/playground/compound-composer"

// Ported from references/eve-chat/compound-composer/types.test.tsx and
// extended with runtime smoke tests for the playground port.

describe("compound Composer (playground port)", () => {
  it("submits the trimmed message with typed controls and self-clears when uncontrolled", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <Composer.Root<{ mode: string }>
        autoFocus={false}
        controls={{ mode: "plan" }}
        defaultValue="  Hello there  "
        onSubmit={onSubmit}
        onStop={() => {}}
      >
        <Composer.Frame>
          <Composer.Input />
          <Composer.Footer>
            <Composer.Controls />
            <Composer.SubmitSlot>
              <Composer.Submit onStop={() => {}} />
            </Composer.SubmitSlot>
          </Composer.Footer>
        </Composer.Frame>
      </Composer.Root>
    )

    await user.click(screen.getByRole("button", { name: "Send message" }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith({
      message: "Hello there",
      controls: { mode: "plan" },
      attachments: [],
    })
    expect(screen.getByRole("textbox", { name: "Message" })).toHaveValue("")
  })

  it("disarms submit when there is no text and no attachments", () => {
    render(
      <Composer.Root autoFocus={false} onSubmit={() => {}} onStop={() => {}}>
        <Composer.Frame>
          <Composer.Input />
          <Composer.Footer>
            <Composer.SubmitSlot>
              <Composer.Submit onStop={() => {}} />
            </Composer.SubmitSlot>
          </Composer.Footer>
        </Composer.Frame>
      </Composer.Root>
    )

    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled()
  })

  it("locks the input and swaps submit for Stop when busy", async () => {
    const user = userEvent.setup()
    const onStop = vi.fn()

    render(
      <Composer.Root
        autoFocus={false}
        defaultValue="Working…"
        onSubmit={() => {}}
        onStop={onStop}
        phase="busy"
      >
        <Composer.Frame>
          <Composer.Input />
          <Composer.Footer>
            <Composer.SubmitSlot>
              <Composer.Submit onStop={onStop} />
            </Composer.SubmitSlot>
          </Composer.Footer>
        </Composer.Frame>
      </Composer.Root>
    )

    expect(screen.getByRole("textbox", { name: "Message" })).toBeDisabled()

    await user.click(screen.getByRole("button", { name: "Stop" }))
    expect(onStop).toHaveBeenCalledTimes(1)
  })
})

// ---------------------------------------------------------------------------
// Compile-time checks that the generic contracts work across integrations.
// These functions are type-checked but never executed.
// ---------------------------------------------------------------------------

// 1) eve-style: controls is a string clientContext.
type EveControls = { clientContext: string }
function _eveStyle() {
  return (
    <Composer.Root<EveControls>
      controls={{ clientContext: "enabled: linear" }}
      onChange={() => {}}
      onSubmit={(submit) => {
        // submit.controls is typed as { clientContext: string }
        const _cc: string = submit.controls.clientContext
        void _cc
      }}
      onStop={() => {}}
      phase="idle"
      value=""
    >
      <Composer.Frame>
        <Composer.Input />
        <Composer.Footer>
          <Composer.Controls />
          <Composer.SubmitSlot>
            <Composer.Submit onStop={() => {}} />
          </Composer.SubmitSlot>
        </Composer.Footer>
      </Composer.Frame>
    </Composer.Root>
  )
}

// 2) No controls — default generic covers it.
function _noControls() {
  return (
    <Composer.Root
      onChange={() => {}}
      onSubmit={(submit: ComposerSubmit<unknown>) => {
        void submit.message
        void submit.controls
      }}
      onStop={() => {}}
      value=""
    >
      <Composer.Frame>
        <Composer.Input />
        <span />
      </Composer.Frame>
    </Composer.Root>
  )
}

// 3) Attachments enabled — `onSubmit.attachments` is typed.
function _withAttachments() {
  return (
    <Composer.Root<EveControls>
      accept="image/*"
      controls={{ clientContext: "" }}
      maxAttachments={6}
      onChange={() => {}}
      onSubmit={(submit) => {
        const _first: ComposerAttachment | undefined = submit.attachments[0]
        void _first
      }}
      onStop={() => {}}
      value=""
    >
      <Composer.Frame>
        <Composer.Attachments />
        <Composer.Input />
        <Composer.Footer>
          <Composer.Controls>
            <Composer.Attach />
          </Composer.Controls>
          <Composer.SubmitSlot>
            <Composer.Submit onStop={() => {}} />
          </Composer.SubmitSlot>
        </Composer.Footer>
      </Composer.Frame>
    </Composer.Root>
  )
}

void _eveStyle
void _noControls
void _withAttachments
