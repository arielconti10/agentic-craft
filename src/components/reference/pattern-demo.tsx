import type * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

function PatternDemo({
  title = "Interactive Demo",
  description,
  className,
  children,
}: {
  title?: React.ReactNode
  description?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <Card
      className={cn(
        // Override Card defaults (rounded-xl, bg-card, ring, outer py, header gap)
        // to preserve the PatternDemo specimen look exactly.
        "mt-8 gap-0 rounded-lg border border-border bg-background py-0 ring-0",
        className
      )}
    >
      <CardHeader className="gap-0 border-b border-border/60 px-4 py-3">
        <CardTitle className="text-sm font-medium text-foreground">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="mt-1 hidden text-xs leading-relaxed sm:block">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  )
}

export { PatternDemo }
