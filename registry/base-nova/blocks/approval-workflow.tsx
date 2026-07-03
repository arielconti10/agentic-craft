"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ActionPreview } from "@/components/ui/action-preview"
import { HumanGate } from "@/components/ui/human-gate"
import { ObservableWork } from "@/components/ui/observable-work"

function ApprovalWorkflowBlock() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <div className="flex flex-col gap-3 border-l border-border/70 bg-muted/20 px-3 py-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">
            Approval workflow
          </p>
          <p className="mt-1 max-w-2xl text-sm leading-5 text-muted-foreground">
            Pause before external, costly, irreversible, or permissioned agent
            work. Show the locked payload before any side effect happens.
          </p>
        </div>
        <Badge variant="outline">Registry block</Badge>
      </div>

      <ObservableWork.Root>
        <ObservableWork.Step
          status="complete"
          title="Prepared exact action payload"
          description="The agent collected audience, message body, source links, and delivery target."
          source="Launch review draft"
          meta="locked"
        />
        <ObservableWork.Step
          status="active"
          title="Waiting for approval"
          description="Execution is paused until the user approves, edits, or denies the preview."
          source="Review channel"
          meta="human gate"
          defaultOpen
        >
          <ObservableWork.Detail>
            Approval state should survive refresh and resume the same run with
            the exact payload the user reviewed.
          </ObservableWork.Detail>
        </ObservableWork.Step>
      </ObservableWork.Root>

      <ActionPreview
        title="Send findings summary"
        description="The agent will send a cited launch-readiness summary to the project review channel."
        status="locked"
        items={[
          { label: "Affected object", value: "Project review channel" },
          { label: "Permission level", value: "External communication" },
          { label: "Cost / time", value: "$0.09 estimated / under 1 minute" },
          { label: "Rollback", value: "Post correction and revoke draft link" },
          { label: "Expires", value: "Approval invalidates after 15 minutes" },
          { label: "Policy reason", value: "External send requires review" },
        ]}
      >
        <HumanGate.Root>
          <HumanGate.Trigger render={<Button type="button" size="sm" />}>
            Review approval
          </HumanGate.Trigger>
          <HumanGate.Content>
            <HumanGate.Header>
              <HumanGate.Title>
                Send the locked findings summary?
              </HumanGate.Title>
              <HumanGate.Description>
                The agent can only execute the payload shown in the preview. Any
                edit requires a new approval.
              </HumanGate.Description>
            </HumanGate.Header>
            <HumanGate.Body>
              <HumanGate.ImpactList>
                <HumanGate.ImpactItem label="Audience">
                  Project reviewers
                </HumanGate.ImpactItem>
                <HumanGate.ImpactItem label="Reversibility">
                  Correction can be posted after send
                </HumanGate.ImpactItem>
                <HumanGate.ImpactItem label="Source basis">
                  Project brief v3 and launch checklist
                </HumanGate.ImpactItem>
              </HumanGate.ImpactList>
            </HumanGate.Body>
            <HumanGate.Footer>
              <HumanGate.Cancel>Deny</HumanGate.Cancel>
              <HumanGate.Confirm>Approve</HumanGate.Confirm>
            </HumanGate.Footer>
          </HumanGate.Content>
        </HumanGate.Root>
      </ActionPreview>
    </div>
  )
}

export { ApprovalWorkflowBlock }
