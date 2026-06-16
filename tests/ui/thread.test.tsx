import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Thread, type ThreadStreamChunk } from "../../src/components/ui/thread"

async function* streamChunks(chunks: ThreadStreamChunk[]) {
  for (const chunk of chunks) {
    yield chunk
  }
}

describe("Thread", () => {
  it("streams async iterable chunks into an assistant message", async () => {
    const onStreamComplete = vi.fn()

    render(
      <Thread
        stream={streamChunks(["The retry path ", { content: "is safe." }])}
        onStreamComplete={onStreamComplete}
      />
    )

    expect(await screen.findByText("The retry path is safe.")).toBeVisible()

    await waitFor(() => {
      expect(onStreamComplete).toHaveBeenCalledWith("The retry path is safe.")
    })
  })

  it("supports replace chunks for model APIs that send snapshots", async () => {
    render(
      <Thread
        stream={streamChunks([
          "The retry path is unsafe.",
          { content: "The retry path is safe.", replace: true },
        ])}
      />
    )

    expect(await screen.findByText("The retry path is safe.")).toBeVisible()
    expect(
      screen.queryByText("The retry path is unsafe.")
    ).not.toBeInTheDocument()
  })

  it("supports stream factories for strict-mode-safe previews", async () => {
    render(<Thread stream={() => streamChunks(["Factory stream"])} />)

    expect(await screen.findByText("Factory stream")).toBeVisible()
  })

  it("allows streamed content to be rendered through a custom slot", async () => {
    render(
      <Thread
        stream={streamChunks(["The retry path is safe."])}
        renderStream={(content, state) => (
          <Thread.Message name={state.label} streaming={state.streaming}>
            <span data-testid="stream-render">{content.toUpperCase()}</span>
          </Thread.Message>
        )}
      />
    )

    expect(await screen.findByTestId("stream-render")).toHaveTextContent(
      "THE RETRY PATH IS SAFE."
    )
  })

  it("expands and collapses tool call details", async () => {
    render(
      <Thread>
        <Thread.ToolCall title="Search workspace" state="done" duration="1.1s">
          Found 3 matches across 12 files.
        </Thread.ToolCall>
      </Thread>
    )

    const trigger = screen.getByRole("button", {
      name: "Toggle Search workspace details",
    })

    expect(trigger).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByText(/found 3 matches/i)).not.toBeInTheDocument()

    await userEvent.click(trigger)

    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText(/found 3 matches/i)).toBeVisible()
  })

  it("supports keyboard toggling for tool call details", async () => {
    const user = userEvent.setup()

    render(
      <Thread>
        <Thread.ToolCall title="Search workspace" state="done" duration="1.1s">
          Found 3 matches across 12 files.
        </Thread.ToolCall>
      </Thread>
    )

    const trigger = screen.getByRole("button", {
      name: "Toggle Search workspace details",
    })

    trigger.focus()
    await user.keyboard("{Enter}")

    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText(/found 3 matches/i)).toBeVisible()
  })

  it("makes the scroll viewport keyboard focusable", () => {
    render(<Thread aria-label="Thread preview" />)

    expect(screen.getByLabelText("Thread messages")).toHaveAttribute(
      "tabindex",
      "0"
    )
  })

  it("renders no-detail tool call rows without a disabled trigger", () => {
    render(
      <Thread>
        <Thread.ToolCall
          title="Synthesize answer"
          state="done"
          summary="Final recommendation ready"
          duration="4.2s"
        />
      </Thread>
    )

    expect(screen.getByText("Synthesize answer")).toBeVisible()
    expect(screen.getByText("Final recommendation ready")).toBeVisible()
    expect(
      screen.queryByRole("button", { name: /Synthesize answer/i })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Tool call" })
    ).not.toBeInTheDocument()
  })

  it("does not auto-scroll the viewport when tool call details toggle", async () => {
    const originalScrollTo = HTMLElement.prototype.scrollTo
    const scrollTo = vi.fn()
    const resizeCallbacks: ResizeObserverCallback[] = []

    Object.defineProperty(HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: scrollTo,
    })

    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: ResizeObserverCallback) {
          resizeCallbacks.push(callback)
        }

        observe() {}
        unobserve() {}
        disconnect() {}
      }
    )

    try {
      render(
        <Thread>
          <Thread.ToolCall
            title="Search workspace"
            state="done"
            duration="1.1s"
          >
            Found 3 matches across 12 files.
          </Thread.ToolCall>
        </Thread>
      )

      await waitFor(() => {
        expect(scrollTo).toHaveBeenCalledTimes(1)
      })

      scrollTo.mockClear()

      await userEvent.click(
        screen.getByRole("button", {
          name: "Toggle Search workspace details",
        })
      )

      for (const callback of resizeCallbacks) {
        callback([], {} as ResizeObserver)
      }

      expect(scrollTo).not.toHaveBeenCalled()
    } finally {
      vi.unstubAllGlobals()

      if (originalScrollTo) {
        Object.defineProperty(HTMLElement.prototype, "scrollTo", {
          configurable: true,
          value: originalScrollTo,
        })
      } else {
        Reflect.deleteProperty(HTMLElement.prototype, "scrollTo")
      }
    }
  })
})
