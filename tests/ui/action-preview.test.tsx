import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ActionPreview } from "../../src/components/ui/action-preview"

describe("ActionPreview", () => {
  it("renders emphasis items in a tonal block, not a foreground accent rule", () => {
    const { container } = render(
      <ActionPreview
        title="Update release checklist"
        description="Preview the locked payload before approval."
        items={[
          { label: "Target", value: "Launch Checklist" },
          {
            label: "Consequence",
            value: "Adds enterprise support owner.",
            emphasis: true,
          },
        ]}
      />
    )

    const consequence = screen.getByText("Consequence")
    const emphasisBlock = consequence.closest("div")

    expect(emphasisBlock).not.toBeNull()
    expect(emphasisBlock?.className).toContain("bg-muted/30")
    expect(emphasisBlock?.className).toContain("border-border/70")
    expect(emphasisBlock?.className).not.toContain("border-l-2")
    expect(container.innerHTML).not.toContain("border-foreground/30")
  })
})
