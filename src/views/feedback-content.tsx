"use client"

import { ThumbsFeedbackSection } from "./feedback/thumbs-feedback-section"
import { InlineCorrectionSection } from "./feedback/inline-correction-section"
import { RatingScaleSection } from "./feedback/rating-scale-section"
import { BehavioralConsequenceSection } from "./feedback/behavioral-consequence-section"
import { FeedbackHistorySection } from "./feedback/feedback-history-section"

export function FeedbackContent() {
  return (
    <article>
      <header className="mb-12 sm:mb-16">
        <p className="section-label mb-4">Patterns</p>
        <h1 className="font-serif text-4xl leading-[1.15] font-light tracking-tight">
          Feedback &amp; Correction
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Patterns for collecting reviewer feedback on agent responses — thumbs
          rating, inline corrections, numeric scales, behavioral consequences,
          and feedback history.
        </p>
      </header>

      <ThumbsFeedbackSection />
      <InlineCorrectionSection />
      <RatingScaleSection />
      <BehavioralConsequenceSection />
      <FeedbackHistorySection />
    </article>
  )
}
