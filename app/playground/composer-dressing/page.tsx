import type { Metadata } from "next"
import Script from "next/script"

import { ComposerDressingLabContent } from "@/views/playground/composer-dressing-content"

export const metadata: Metadata = {
  title: "Composer dressing lab",
  description:
    "Compare four composer dressing levels — bare, receipt, scope chips, fully dressed.",
  robots: { index: false, follow: false },
}

export default function ComposerDressingLabPage() {
  return (
    <>
      <ComposerDressingLabContent />
      <Script src="https://ui.sh/ui-picker.js" strategy="afterInteractive" />
    </>
  )
}
