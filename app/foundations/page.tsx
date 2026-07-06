import type { Metadata } from "next"

import { FoundationsContent } from "@/views/foundations-content"

export const metadata: Metadata = {
  title: "Foundations",
  description:
    "Eight design principles for agentic interfaces — autonomy as checkpoint placement, four surfaces, honest chrome, and receipts that scale with trust.",
}

export default function FoundationsPage() {
  return <FoundationsContent />
}
