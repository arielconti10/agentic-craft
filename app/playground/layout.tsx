import Link from "next/link"
import type { ReactNode } from "react"

// Lab surface for comparing composer ideas. URL-only: not in site
// navigation, excluded from robots. Nothing here is a registry primitive.
export default function PlaygroundLayout({
  children,
}: {
  readonly children: ReactNode
}) {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Playground</span> ·
            lab surface — not the registry
          </p>
          <Link
            href="/"
            className="text-xs text-muted-foreground underline underline-offset-3 hover:text-foreground"
          >
            agentic-craft
          </Link>
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-3xl px-4 py-10">
        {children}
      </main>
    </div>
  )
}
