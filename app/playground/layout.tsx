import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-w-0">
      <div className="mb-8 rounded-lg border border-dashed border-border/60 bg-muted/15 px-4 py-3 text-xs leading-5 text-muted-foreground">
        <p className="font-medium text-foreground">Lab surface</p>
        <p className="mt-1">
          Playground routes are URL-only experiments — not in navigation or the
          registry install surface.
        </p>
      </div>
      {children}
    </div>
  )
}
