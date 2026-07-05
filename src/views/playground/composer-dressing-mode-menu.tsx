"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Tick02Icon } from "@hugeicons/core-free-icons"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  APP_MODE_SETS,
  type AppId,
  type ModeDetent,
} from "@/views/playground/composer-dressing-data"

function ModeScaleTrack({
  detents,
  activeIndex,
}: {
  detents: readonly ModeDetent[]
  activeIndex: number
}) {
  return (
    <div
      className="relative mx-1 mb-3 mt-1 h-1.5 rounded-full bg-linear-to-r from-emerald-500/70 via-amber-400/70 to-red-500/70"
      aria-hidden="true"
    >
      {detents.map((detent, index) => {
        const left = detents.length === 1 ? 50 : (index / (detents.length - 1)) * 100
        const active = index === activeIndex
        return (
          <span
            key={detent.id}
            className={cn(
              "absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background",
              active ? "bg-foreground" : "bg-muted"
            )}
            style={{ left: `${left}%` }}
          />
        )
      })}
    </div>
  )
}

function ComposerDressingModeMenu({
  appId,
  onAppIdChange,
  modeIndex,
  onModeIndexChange,
}: {
  appId: AppId
  onAppIdChange: (appId: AppId) => void
  modeIndex: number
  onModeIndexChange: (index: number) => void
}) {
  const app = APP_MODE_SETS[appId]
  const activeDetent = app.detents[modeIndex] ?? app.detents[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        data-compact-touch
        aria-label={`Mode: ${activeDetent.label}. Open mode menu.`}
        className="rounded-lg focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <Badge variant="outline">{activeDetent.label}</Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="top"
        sideOffset={8}
        className="w-[min(100vw-2rem,320px)] p-0"
      >
        <div className="border-b border-border/60 px-3 py-2.5">
          <p className="text-[11px] font-medium text-foreground">App vocabulary</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(Object.keys(APP_MODE_SETS) as AppId[]).map((id) => {
              const selected = id === appId
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    onAppIdChange(id)
                    onModeIndexChange(0)
                  }}
                  className={cn(
                    "rounded-md border px-2 py-1 text-[11px] transition-colors",
                    selected
                      ? "border-foreground/25 bg-muted text-foreground"
                      : "border-border/60 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  )}
                >
                  {APP_MODE_SETS[id].label}
                </button>
              )
            })}
          </div>
          {app.note ? (
            <p className="mt-2 text-[11px] leading-4 text-muted-foreground">
              {app.note}
            </p>
          ) : null}
        </div>

        <div className="px-3 py-3">
          <p className="text-[11px] font-medium text-foreground">
            Ordered detents
          </p>
          <ModeScaleTrack detents={app.detents} activeIndex={modeIndex} />

          <ul className="grid gap-1" role="list">
            {app.detents.map((detent, index) => {
              const selected = index === modeIndex
              const gated = Boolean(detent.gated)

              return (
                <li key={detent.id}>
                  {gated ? (
                    <div className="flex items-start justify-between gap-3 rounded-lg border border-dashed border-border/80 px-3 py-2.5">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-muted-foreground">
                          {detent.shortcut ? `${detent.shortcut}. ` : ""}
                          {detent.label}
                        </p>
                        {detent.description ? (
                          <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
                            {detent.description}
                          </p>
                        ) : null}
                      </div>
                      <Button type="button" variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onModeIndexChange(index)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors",
                        selected
                          ? "border-foreground/25 bg-muted text-foreground"
                          : "border-border/60 hover:bg-muted/40"
                      )}
                    >
                      <span className="min-w-0 flex-1 text-sm">
                        {detent.shortcut ? (
                          <span className="text-muted-foreground">
                            {detent.shortcut}.{" "}
                          </span>
                        ) : null}
                        {detent.label}
                      </span>
                      {selected ? (
                        <HugeiconsIcon
                          icon={Tick02Icon}
                          size={14}
                          strokeWidth={1.5}
                          className="shrink-0"
                        />
                      ) : null}
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ComposerDressingModeMenu }
