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
import { cn } from "@/lib/utils"
import {
  FIXTURE_ASK,
  parseComposerAsk,
  type AppId,
  type ParsedComposerAsk,
} from "@/views/playground/composer-dressing-data"
import { ComposerDressingModeMenu } from "@/views/playground/composer-dressing-mode-menu"

type DressingLevel =
  | "bare"
  | "receipt-only"
  | "receipt-scope"
  | "fully-dressed"
  | "state-aware"

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

function ScopeChipsRow({ parsed }: { parsed: ParsedComposerAsk }) {
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
    <Composer value={draft} onValueChange={onDraftChange} onSend={() => {}}>
      <ComposerCard>
        {level === "fully-dressed" && showParsed ? (
          <ParseEchoRow text={parsed.parseEcho} />
        ) : null}
        {(level === "receipt-scope" || level === "fully-dressed") &&
        showParsed ? (
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

function CollapsibleRow({
  open,
  children,
}: {
  open: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}
      aria-hidden={!open}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  )
}

function StateAwareComposer({
  draft,
  onDraftChange,
  appId,
  onAppIdChange,
  modeIndex,
  onModeIndexChange,
}: {
  draft: string
  onDraftChange: (value: string) => void
  appId: AppId
  onAppIdChange: (appId: AppId) => void
  modeIndex: number
  onModeIndexChange: (index: number) => void
}) {
  const [phase, setPhase] = React.useState<"dispatch" | "running">("dispatch")
  const [runReceipt, setRunReceipt] = React.useState("")

  const isDispatch = phase === "dispatch"
  const showParsed = isDispatch && draft.trim().length > 0
  const parsed = React.useMemo(() => parseComposerAsk(draft), [draft])

  return (
    <div>
      <Composer
        value={draft}
        onValueChange={onDraftChange}
        onSend={(value) => {
          if (isDispatch) {
            setRunReceipt(
              parseComposerAsk(value).receipt.replace(
                /\s*·\s*tap to edit$/i,
                ""
              )
            )
            setPhase("running")
          }
        }}
      >
        <ComposerCard>
          {!isDispatch ? (
            <div className="animate-[route-expand_200ms_ease-out] border-b border-border/60 px-3 py-2 sm:px-4">
              <p className="flex items-center gap-2 text-[11px] leading-4 text-muted-foreground">
                <span
                  className="size-1.5 shrink-0 animate-[route-pulse_1.6s_ease-in-out_infinite] rounded-full bg-[var(--status-warn)]"
                  aria-hidden="true"
                />
                <span className="min-w-0 truncate">
                  <span className="font-medium text-foreground">
                    Run active ·{" "}
                  </span>
                  {runReceipt}
                </span>
              </p>
            </div>
          ) : null}

          <CollapsibleRow open={showParsed}>
            <ScopeChipsRow parsed={parsed} />
          </CollapsibleRow>

          <ComposerInput
            aria-label="State-aware composer prompt"
            placeholder={
              isDispatch
                ? "Describe the task — include how you'll know it's done…"
                : "Steer the run — redirect, narrow, or stop…"
            }
          />

          <CollapsibleRow open={showParsed}>
            <ReceiptRow text={parsed.receipt} />
          </CollapsibleRow>

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

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {isDispatch
            ? "Pre-dispatch — receipt and scope are live chrome."
            : "Running — dispatch chrome collapsed into a pinned run fact. Next send is a steering message."}
        </p>
        {!isDispatch ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setPhase("dispatch")}
          >
            Reset to dispatch
          </Button>
        ) : null}
      </div>
    </div>
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
          Five ways to reflect the run contract in the composer — same ask, same
          mode control, different furniture. Use the ui.sh picker (bottom-right)
          to switch variants after typing the fixture.
        </p>
        <p className="mt-3 max-w-[640px] rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">
            Decided (Jul 6, 2026): A wins.{" "}
          </span>
          Term chrome is rejected — the composer keeps meters, pickers, and
          pointers; the prompt stays prose. B–E are kept below as the record of
          what was tried and why it lost.
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

      <div data-uidotsh-pick="Composer dressing" className="contents">
        <div data-uidotsh-option="A — Bare (current)" className="contents">
          <section className="page-section">
            <div className="mb-4">
              <h2 className="text-sm font-semibold tracking-tight">A — Bare</h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Control condition. Your prompt is the contract; the composer
                reflects none of it.
              </p>
            </div>
            <DressingComposer level="bare" {...sharedComposerProps} />
          </section>
        </div>

        <div data-uidotsh-option="B — Receipt only" className="contents" hidden>
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

        <div data-uidotsh-option="E — State-aware" className="contents" hidden>
          <section className="page-section">
            <div className="mb-4">
              <h2 className="text-sm font-semibold tracking-tight">
                E — State-aware
              </h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Dispatch-only chrome. Receipt and scope mount before the first
                send, then collapse into a pinned run fact once the run starts —
                the transition itself is what&apos;s under evaluation.
              </p>
            </div>
            <StateAwareComposer {...sharedComposerProps} />
          </section>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-border/60 bg-muted/20 p-4 text-xs leading-5 text-muted-foreground">
        <p className="font-medium text-foreground">Verdict — why A won</p>
        <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-4">
          <li>
            Everything B–E adds is term chrome: it renders user-stated
            constraints (scope, stop, budget) as furniture. The harness
            doesn&apos;t enforce those constraints, so rendering them gives
            wishes the visual authority of enforced limits.
          </li>
          <li>
            What shipping products (Cursor, Codex, Claude Code) dress the
            composer with is machinery chrome only: meters (context ring,
            branch, execution locus), pickers (mode, model), pointers
            (@-mentions, attachments). All platform-known fact, none of it a
            term — and all of it stays true in every session state, which is why
            it can be static chrome.
          </li>
          <li>
            The receipt survives, relocated: as the run&apos;s opening
            transcript entry (&quot;here&apos;s what I understood, here&apos;s
            what I&apos;m doing&quot;) — where E&apos;s pinned run fact
            accidentally pointed. Post-dispatch surface, not composer chrome.
          </li>
          <li>
            The five defensibility gaps stay valid as analysis vocabulary — they
            map to real incidents — but their homes are settings (spend),
            in-flight approvals (risk), the prompt itself (stop), and the
            post-run receipt (verification). Only scope touches the composer,
            and mentions already serve it as a pointer.
          </li>
        </ul>
      </div>
    </article>
  )
}

export { ComposerDressingLabContent }
