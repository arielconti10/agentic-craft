import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThreadMarkdown } from "../../src/components/ui/thread-markdown"

describe("ThreadMarkdown", () => {
  it("renders markdown syntax into semantic content", () => {
    render(
      <ThreadMarkdown>
        {"The retry path is **safe**.\n\n- Ship it"}
      </ThreadMarkdown>
    )

    expect(screen.getByText("safe").tagName.toLowerCase()).toBe("strong")
    expect(screen.getByText("Ship it").closest("li")).toBeTruthy()
  })

  it("renders incomplete streaming markdown", () => {
    render(
      <ThreadMarkdown streaming>{"```ts\nconst ready = true"}</ThreadMarkdown>
    )

    expect(screen.getByText("const ready = true")).toBeVisible()
  })
})
