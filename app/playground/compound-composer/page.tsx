import type { Metadata } from "next"

import { CompoundComposerPlayground } from "@/views/playground/compound-composer-content"

export const metadata: Metadata = {
  title: "Compound Composer Playground",
  description:
    "Lab rig for the eve-chat compound composer: slot compositions, submit lifecycle, attachments, and controls payloads.",
  robots: { index: false, follow: false },
}

export default function CompoundComposerPlaygroundPage() {
  return <CompoundComposerPlayground />
}
