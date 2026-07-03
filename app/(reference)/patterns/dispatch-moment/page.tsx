import type { Metadata } from "next"

import { DispatchMomentContent } from "@/views/patterns/dispatch-moment-content"

export const metadata: Metadata = {
  title: "Dispatch Moment",
  description:
    "Pre-Send verification defensibility and plan→execute posture selection on the composer",
}

export default function DispatchMomentPage() {
  return <DispatchMomentContent />
}
