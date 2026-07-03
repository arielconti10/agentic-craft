// Compile-time check that the generic contracts work across integrations.
// This file is type-checked but never imported at runtime.

import { Composer, type ComposerAttachment, type ComposerSubmit } from "./index"

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

// 2) Claude-Code-style: controls is { mode: Mode }.
type Mode = "plan" | "auto" | "manual"
type CCControls = { mode: Mode }
function _ccStyle() {
  return (
    <Composer.Root<CCControls>
      controls={{ mode: "plan" }}
      onChange={() => {}}
      onSubmit={(submit) => {
        const _mode: Mode = submit.controls.mode
        void _mode
      }}
      onStop={() => {}}
      value=""
    >
      <Composer.Frame>
        <Composer.Input />
      </Composer.Frame>
    </Composer.Root>
  )
}

// 3) No controls — default generic covers it.
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

// 4) Uncontrolled mode — defaultValue, no value/onChange. Self-clears on submit.
function _uncontrolled() {
  return (
    <Composer.Root<CCControls>
      controls={{ mode: "auto" }}
      defaultValue="Hello"
      onSubmit={(submit) => {
        const _mode: Mode = submit.controls.mode
        void _mode
      }}
      onStop={() => {}}
    >
      <Composer.Frame>
        <Composer.InfoBar
          title="Low credits"
          description="Your monthly balance is running out."
        />
        <Composer.Input maxHeight={200} />
        <Composer.Footer>
          <Composer.SubmitSlot>
            <Composer.Submit onStop={() => {}} />
          </Composer.SubmitSlot>
        </Composer.Footer>
      </Composer.Frame>
    </Composer.Root>
  )
}

// 5) Attachments enabled — picker + drag/drop + paste feed the same state.
//    `onSubmit.attachments` is typed as readonly ComposerAttachment[].
function _withAttachments() {
  return (
    <Composer.Root<EveControls>
      accept="image/*"
      controls={{ clientContext: "" }}
      maxAttachments={6}
      onChange={() => {}}
      onSubmit={(submit) => {
        // submit.attachments is readonly ComposerAttachment[]
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
void _ccStyle
void _noControls
void _uncontrolled
void _withAttachments
