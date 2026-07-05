"use client"

import * as React from "react"

import { DispatchMomentDemo } from "@/components/DispatchMomentDemo"
import { PatternDemo } from "@/components/reference/pattern-demo"
import { PatternPage } from "@/components/reference/pattern-page"
import { PatternSection } from "@/components/reference/pattern-section"
import { PatternSpecTable } from "@/components/reference/pattern-spec-table"
import {
  AUTONOMY_POSTURES,
  DEFENSIBILITY_GAPS,
} from "@/views/patterns/dispatch-moment-data"

const PRINCIPLES = [
  {
    title: "Behavioral badge, not a ladder",
    description: `Ship posture as language users recognize — ${AUTONOMY_POSTURES.map(
      (posture) => posture.label.toLowerCase()
    ).join(", ")} — not L0–L5 numbers.`,
  },
  {
    title: "Verification before posture",
    description:
      "Surface what's missing to defend the chosen autonomy level before Send, not after failure.",
  },
  {
    title: "Plan approval picks execution",
    description:
      "Complex tasks gate on plan review, then explicitly select how much autonomy the run gets.",
  },
] as const

const COMPONENTS_USED = [
  {
    element: "composer + islands",
    spec: "ComposerPlan, ComposerDoneWhen, ComposerReceipt above the card",
  },
  {
    element: "Badge",
    spec: "Behavioral autonomy posture — cyclable, not numbered",
  },
  {
    element: "human-gate",
    spec: "Plan→execute approval with execution posture radio group",
  },
] as const

function DispatchMomentContent() {
  const componentRows = React.useMemo(
    () =>
      COMPONENTS_USED.map((item) => ({
        element: item.element,
        spec: item.spec,
      })),
    []
  )

  return (
    <PatternPage
      eyebrow="Pattern Card · Session continuation"
      title="Dispatch Moment"
      description="What happens at Send when the question is not 'read back the contract' but 'is this autonomy level defensible for this task — and what execution posture follows plan approval?'"
    >
      <section
        id="dispatch-moment"
        className="mb-10 grid scroll-mt-20 gap-4 border-y border-border/60 py-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
      >
        <div>
          <p className="section-label mb-2">Direction — ratified 2026-07-05</p>
          <p className="font-serif text-2xl font-light tracking-tight text-balance">
            Verification defensibility + plan→execute — not contract read-back.
          </p>
        </div>
        <div className="min-w-0">
          <p className="section-label mb-2">Questions chosen</p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md border border-border/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
              B · Verification defensibility
            </span>
            <span className="rounded-md border border-border/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
              C · Plan→execute transition
            </span>
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Decision recorded in{" "}
            <code className="text-xs">
              sessions/2026-07-03-eve-chat-composer-autonomy.md
            </code>
            . Question A resolves as behavioral badge, not ladder UI; the
            Bare/B/C/D contract-variant framing is retired unless B+C work
            surfaces a concrete need for it.
          </p>
        </div>
      </section>

      <PatternDemo
        title="Dispatch moment specimen"
        description="Load the fixture ask, review parsed stopping conditions and verification gaps, then Send to open the plan→execute gate."
      >
        <DispatchMomentDemo />
      </PatternDemo>

      <PatternSection
        id="why-not-contract"
        eyebrow="Why not contract read-back"
        title="The contract is shredded across products"
        description="Addy's eight-field run contract is one safeguard among many — not the organizing UI concept. Shipping products surface mode, model, and placement at Send; stopping conditions and verification often stay implicit."
      >
        <div className="mt-6 grid gap-4 text-sm leading-6 text-muted-foreground md:grid-cols-2">
          <p>
            The July 2026 research in{" "}
            <code className="text-xs">
              audits/verification-defensibility-web-2026-07-03.md
            </code>{" "}
            finds the strongest gap at pre-Send: nothing explains why a posture
            is appropriate or what proof will close the task.
          </p>
          <p>
            Claude Code's plan approval dialog is the reference for problem C:
            after plan review, the user explicitly picks execution posture. This
            demo sketches both patterns on the registry composer — not the
            superseded eight-field receipt variants.
          </p>
        </div>
      </PatternSection>

      <PatternSection
        id="vocabulary"
        eyebrow="Canonical vocabulary"
        title="Three postures, five gaps"
        description="The posture badge labels and the pre-Send defensibility checklist are defined once, in dispatch-moment-data.ts, and shared by every surface that renders them."
      >
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <p className="section-label mb-3">Posture badge</p>
            <ul className="flex flex-col gap-2" role="list">
              {AUTONOMY_POSTURES.map((posture) => (
                <li
                  key={posture.id}
                  className="border-l border-border/70 bg-muted/20 py-2 pl-4"
                >
                  <span className="text-sm font-medium text-foreground">
                    {posture.label}
                  </span>
                  <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                    {posture.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="section-label mb-3">Defensibility checklist</p>
            <ul className="flex flex-col gap-2" role="list">
              {DEFENSIBILITY_GAPS.map((gap) => (
                <li
                  key={gap.id}
                  className="border-l border-border/70 bg-muted/20 py-2 pl-4"
                >
                  <span className="text-sm font-medium text-foreground">
                    {gap.label}
                  </span>
                  <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                    {gap.hint}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PatternSection>

      <PatternSection
        id="principles"
        eyebrow="Principles"
        title="What this specimen defends"
      >
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {PRINCIPLES.map((principle) => (
            <div
              key={principle.title}
              className="border-l border-border/70 bg-muted/20 py-3 pl-4"
            >
              <h3 className="text-sm font-medium text-foreground">
                {principle.title}
              </h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </PatternSection>

      <PatternSection
        id="components-used"
        eyebrow="Components used"
        title="Registry pieces in this composition"
      >
        <div className="mt-8">
          <PatternSpecTable rows={componentRows} />
        </div>
      </PatternSection>

      <PatternSection
        id="next"
        eyebrow="Next"
        title="Where this thread goes"
        description="This is a sketch, not a shipped registry block. Likely follow-ups:"
      >
        <ul className="mt-6 flex flex-col gap-2 text-sm leading-6 text-muted-foreground">
          <li>
            <code className="text-xs">docs/research.md</code> §4.5 now carries
            the reframe: levels are analysis vocabulary; Send shows a behavioral
            badge plus defensibility gaps.
          </li>
          <li>
            Compound-composer lab at{" "}
            <code className="text-xs">/playground/compound-composer</code> —
            slot compositions, fixture controls, and the same B+C ideas on the
            eve-chat compound API for comparison against this registry-composer
            sketch.
          </li>
          <li>
            Promotion of compound parts into the registry stays a separate,
            explicit decision — the comparison writeup is the output for now.
          </li>
        </ul>
      </PatternSection>
    </PatternPage>
  )
}

export { DispatchMomentContent }
