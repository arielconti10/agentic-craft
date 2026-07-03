import Script from "next/script"
import type { ReactNode } from "react"

// ui.sh picker toolbar for comparing variant options in the playgrounds.
// Picker-only scaffolding — remove once a variant is selected and finalized.
export default function PlaygroundLayout({
  children,
}: {
  readonly children: ReactNode
}) {
  return (
    <>
      {children}
      {/* lazyOnload: the picker mutates option wrappers (display:none) and must
          not touch the DOM before React hydrates them. */}
      <Script src="https://ui.sh/ui-picker.js" strategy="lazyOnload" />
    </>
  )
}
