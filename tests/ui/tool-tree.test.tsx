import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { File01Icon } from "@hugeicons/core-free-icons"

import {
  ToolTree,
  ToolTreeContent,
  ToolTreeTrigger,
} from "../../src/components/ui/tool-tree"

describe("ToolTree", () => {
  it("uses collapsible state for default-open content", async () => {
    render(
      <ToolTree>
        <ToolTreeTrigger icon={File01Icon}>Parallel tools</ToolTreeTrigger>
        <ToolTreeContent>
          <div>Fetch sources</div>
          <div>Audit findings</div>
        </ToolTreeContent>
      </ToolTree>
    )

    expect(screen.getByText("Fetch sources")).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole("button", { name: /collapse tool group/i })
    )

    expect(
      screen.getByRole("button", { name: /expand tool group/i })
    ).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByText("Fetch sources")).not.toBeInTheDocument()
  })

  it("preserves controlled open and onOpenChange behavior", async () => {
    const onOpenChange = vi.fn()

    render(
      <ToolTree open={false} onOpenChange={onOpenChange}>
        <ToolTreeTrigger>Parallel tools</ToolTreeTrigger>
        <ToolTreeContent>
          <div>Hidden while controlled closed</div>
        </ToolTreeContent>
      </ToolTree>
    )

    await userEvent.click(
      screen.getByRole("button", { name: /expand tool group/i })
    )

    expect(onOpenChange).toHaveBeenCalledWith(true, expect.any(Object))
    expect(
      screen.queryByText("Hidden while controlled closed")
    ).not.toBeInTheDocument()
  })
})
