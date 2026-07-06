import type { Metadata } from "next"

import { PlanReceiptLabContent } from "@/views/playground/plan-receipt-content"

export const metadata: Metadata = {
  title: "Plan ↔ receipt lab",
  description:
    "The run's two bookends — plan the prospective account, receipt the retrospective one, diffed against each other.",
  robots: { index: false, follow: false },
}

export default function PlanReceiptLabPage() {
  return <PlanReceiptLabContent />
}
