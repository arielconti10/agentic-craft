import type { Metadata } from "next"

import { RunSurfaceLabContent } from "@/views/playground/run-surface-content"

export const metadata: Metadata = {
  title: "Run surface lab",
  description:
    "One run, three autonomy postures — watch the human checkpoint relocate from in-flight approvals to the post-run receipt.",
  robots: { index: false, follow: false },
}

export default function RunSurfaceLabPage() {
  return <RunSurfaceLabContent />
}
