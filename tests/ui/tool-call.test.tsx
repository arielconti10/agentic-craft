import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { File01Icon } from "@hugeicons/core-free-icons"

import {
  ToolCall,
  ToolCallContent,
  ToolCallError,
  ToolCallLabel,
  ToolCallTrigger,
} from "../../src/components/ui/tool-call"

describe("ToolCall", () => {
  it("expands and collapses details through Collapsible", async () => {
    render(
      <ToolCall icon={File01Icon}>
        <ToolCallTrigger>
          <ToolCallLabel>Read file</ToolCallLabel>
        </ToolCallTrigger>
        <ToolCallContent>Read 4 source files.</ToolCallContent>
      </ToolCall>
    )

    const trigger = screen.getByRole("button", {
      name: /toggle tool call details/i,
    })

    expect(trigger).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByText("Read 4 source files.")).not.toBeInTheDocument()

    await userEvent.click(trigger)

    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("Read 4 source files.")).toBeInTheDocument()
  })

  it("defaults failed calls open", () => {
    render(
      <ToolCall icon={File01Icon} status="failed">
        <ToolCallTrigger>
          <ToolCallLabel>Run tests</ToolCallLabel>
        </ToolCallTrigger>
        <ToolCallError>Vitest failed.</ToolCallError>
      </ToolCall>
    )

    expect(screen.getByText("Vitest failed.")).toBeInTheDocument()
  })

  it("prevents running calls from toggling open", async () => {
    const onExpandedChange = vi.fn()

    render(
      <ToolCall
        icon={File01Icon}
        status="running"
        onExpandedChange={onExpandedChange}
      >
        <ToolCallTrigger>
          <ToolCallLabel>Search workspace</ToolCallLabel>
        </ToolCallTrigger>
        <ToolCallContent>Should stay hidden.</ToolCallContent>
      </ToolCall>
    )

    const trigger = screen.getByRole("button", { name: /tool call/i })
    await userEvent.click(trigger)

    expect(onExpandedChange).not.toHaveBeenCalled()
    expect(screen.queryByText("Should stay hidden.")).not.toBeInTheDocument()
  })
})
