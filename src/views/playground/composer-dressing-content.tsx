"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Composer,
  ComposerCard,
  ComposerInput,
  ComposerSend,
  ComposerToolbar,
} from "@/components/ui/composer"
import {
  FIXTURE_ASK,
  parseComposerAsk,
  type AppId,
  type ParsedComposerAsk,
} from "@/views/playground/composer-dressing-data"
import { ComposerDressingModeMenu } from "@/views/playground/composer-dressing-mode-menu"

type DressingLevel = "bare" | "receipt-only" | "receipt-scope" | "fully-dressed"

function ParseEchoRow({ text }: { text: string }) {
  return (
    <div className="border-b border-border/60 px-3 py-2 sm:px-4">
      <p className="text-[11px] leading-4 text-muted-foreground">
        <span className="font-medium text-foreground">Parsed · </span>
        {text}
      </p>
    </div>
  )
}

function ScopeChipsRow({
  parsed,
}: {
  parsed: ParsedComposerAsk
}) {
  return (
    <div className="border-b border-border/60 px-3 py-2 sm:px-4">
      <div className="flex flex-wrap items-center gap-1.5">
        {parsed.includeChips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[11px] text-foreground transition-colors hover:bg-muted/70"
          >
            <span>{chip.label}</span>
            {chip.count ? (
              <span className="text-muted-foreground">({chip.count})</span>
            ) : null}
          </button>
        ))}
        {parsed.exclusionChips.map((chip) => (
          <span
            key={chip.id}
            className="inline-flex items-center rounded-md border border-[color-mix(in_oklch,var(--status-warn)_35%,var(--border))] bg-[color-mix(in_oklch,var(--status-warn)_6%,transparent)] px-2 py-0.5 text-[11px] text-foreground"
          >
            {chip.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function DefaultsDiffRow({ text }: { text: string }) {
  return (
    <div className="border-b border-border/60 px-3 py-2 sm:px-4">
      <button
        type="button"
        className="text-left text-[11px] leading-4 text-muted-foreground transition-colors hover:text-foreground"
      >
        {text}
      </button>
    </div>
  )
}

function ReceiptRow({ text }: { text: string }) {
  return (
    <div className="border-t border-border/60 px-3 py-2 sm:px-4">
      <button
        type="button"
        className="w-full text-left text-[11px] leading-5 text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="font-medium text-foreground">Receipt · </span>
        {text}
      </button>
    </div>
  )
}

function DressingComposer({
  level,
  draft,
  onDraftChange,
  appId,
  onAppIdChange,
  modeIndex,
  onModeIndexChange,
}: {
  level: DressingLevel
  draft: string
  onDraftChange: (value: string) => void
  appId: AppId
  onAppIdChange: (appId: AppId) => void
  modeIndex: number
  onModeIndexChange: (index: number) => void
}) {
  const showParsed = draft.trim().length > 0
  const parsed = React.useMemo(() => parseComposerAsk(draft), [draft])

  return (
    <Composer
      value={draft}
      onValueChange={onDraftChange}
      onSend={() => {}}
    >
      <ComposerCard>
        {level === "fully-dressed" && showParsed ? (
          <ParseEchoRow text={parsed.parseEcho} />
        ) : null}
        {(level === "receipt-scope" || level === "fully-dressed") && showParsed ? (
          <ScopeChipsRow parsed={parsed} />
        ) : null}
        {level === "fully-dressed" && showParsed ? (
          <DefaultsDiffRow text={parsed.defaultsLine} />
        ) : null}

        <ComposerInput
          aria-label="Composer dressing lab prompt"
          placeholder="Describe the task — include how you'll know it's done…"
        />

        {(level === "receipt-only" ||
          level === "receipt-scope" ||
          level === "fully-dressed") &&
        showParsed ? (
          <ReceiptRow text={parsed.receipt} />
        ) : null}

        <ComposerToolbar>
          <ComposerDressingModeMenu
            appId={appId}
            onAppIdChange={onAppIdChange}
            modeIndex={modeIndex}
            onModeIndexChange={onModeIndexChange}
          />
          <div className="min-w-0 flex-1" />
          <ComposerSend />
        </ComposerToolbar>
      </ComposerCard>
    </Composer>
  )
}

function ComposerDressingLabContent() {
  const [draft, setDraft] = React.useState("")
  const [appId, setAppId] = React.useState<AppId>("claude-code")
  const [modeIndex, setModeIndex] = React.useState(1)

  const sharedComposerProps = {
    draft,
    onDraftChange: setDraft,
    appId,
    onAppIdChange: setAppId,
    modeIndex,
    onModeIndexChange: setModeIndex,
  }

  return (
    <article>
      <header className="mb-10">
        <p className="section-label mb-3">Playground · Lab</p>
        <h1 className="font-serif text-4xl leading-[1.15] font-light tracking-tight">
          Composer dressing
        </h1>
        <p className="mt-4 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          Four ways to reflect the run contract in the composer — same ask, same
          mode control, different furniture. Use the ui.sh picker (bottom-right)
          to switch variants after typing the fixture.
        </p>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setDraft(FIXTURE_ASK)}
        >
          Type the ask
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setDraft("")}
        >
          Clear
        </Button>
        <p className="text-xs text-muted-foreground">
          Fixture populates all four variants at once.
        </p>
      </div>

      <div
        data-uidotsh-pick="Composer dressing"
        className="contents"
      >
        <div
          data-uidotsh-option="A — Bare (current)"
          className="contents"
        >
          <section className="page-section">
            <div className="mb-4">
              <h2 className="text-sm font-semibold tracking-tight">
                A — Bare
              </h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Control condition. Your prompt is the contract; the composer
                reflects none of it.
              </p>
            </div>
            <DressingComposer level="bare" {...sharedComposerProps} />
          </section>
        </div>

        <div
          data-uidotsh-option="B — Receipt only"
          className="contents"
          hidden
        >
          <section className="page-section">
            <div className="mb-4">
              <h2 className="text-sm font-semibold tracking-tight">
                B — Receipt only
              </h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                One PR-create line above Send — parsed from what you already
                said, tappable to edit.
              </p>
            </div>
            <DressingComposer level="receipt-only" {...sharedComposerProps} />
          </section>
        </div>

        <div
          data-uidotsh-option="C — Receipt + scope chips"
          className="contents"
          hidden
        >
          <section className="page-section">
            <div className="mb-4">
              <h2 className="text-sm font-semibold tracking-tight">
                C — Receipt + scope chips
              </h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Boundaries get their own row — include chips with counts plus
                lock-badged exclusions.
              </p>
            </div>
            <DressingComposer level="receipt-scope" {...sharedComposerProps} />
          </section>
        </div>

        <div
          data-uidotsh-option="D — Fully dressed"
          className="contents"
          hidden
        >
          <section className="page-section">
            <div className="mb-4">
              <h2 className="text-sm font-semibold tracking-tight">
                D — Fully dressed
              </h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Parse-echo, scope, defaults diff, and receipt — maximum
                legibility, possibly the contract reborn in composer clothing.
              </p>
            </div>
            <DressingComposer level="fully-dressed" {...sharedComposerProps} />
          </section>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-border/60 bg-muted/20 p-4 text-xs leading-5 text-muted-foreground">
        <p className="font-medium text-foreground">What to compare</p>
        <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-4">
          <li>
            B bets the receipt alone carries the contract because it is tappable
            — everything in C and D is one tap deep from B.
          </li>
          <li>
            D bets that seeing the parse builds trust the receipt cannot.
          </li>
          <li>
            Open the mode chip on any variant: ordered scale (option B), top
            detent visible but gated with Enable — Claude Code desktop pattern.
          </li>
          <li>
            Switch app vocabulary to feel one control, four mode sets (CC, Codex,
            Cursor, eve).
          </li>
        </ul>
      </div>
    </article>
  )
}

export { ComposerDressingLabContent }
