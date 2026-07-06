import { render, within } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { RunReceipt } from "../../src/components/ui/run-receipt"

describe("RunReceipt", () => {
  it("renders compound parts with visible text and data-slot attributes", () => {
    const { container } = render(
      <RunReceipt.Root aria-label="Run receipt">
        <RunReceipt.Header
          title="Run complete"
          tag="Receipt"
          summary="All steps finished."
        />
        <RunReceipt.Section label="Scope touched">
          <p>src/pages/session-chat-page.tsx</p>
        </RunReceipt.Section>
        <RunReceipt.Section label="Checkpoint ledger">
          <RunReceipt.Row
            trailing={
              <RunReceipt.Chip variant="muted">review pending</RunReceipt.Chip>
            }
          >
            <span>Fix failing test</span>
          </RunReceipt.Row>
        </RunReceipt.Section>
        <RunReceipt.Footer>
          <button type="button">Dismiss</button>
        </RunReceipt.Footer>
      </RunReceipt.Root>
    )

    expect(within(container).getByText("Run complete")).toBeTruthy()
    expect(within(container).getByText("Receipt")).toBeTruthy()
    expect(within(container).getByText("Scope touched")).toBeTruthy()
    expect(within(container).getByText("review pending")).toBeTruthy()

    expect(container.querySelector('[data-slot="run-receipt"]')).not.toBeNull()
    expect(
      container.querySelector('[data-slot="run-receipt-header"]')
    ).not.toBeNull()
    expect(
      container.querySelector('[data-slot="run-receipt-section"]')
    ).not.toBeNull()
    expect(
      container.querySelector('[data-slot="run-receipt-row"]')
    ).not.toBeNull()
    expect(
      container.querySelector('[data-slot="run-receipt-chip"]')
    ).not.toBeNull()
    expect(
      container.querySelector('[data-slot="run-receipt-footer"]')
    ).not.toBeNull()
  })
})
