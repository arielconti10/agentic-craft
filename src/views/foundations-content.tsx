"use client"

import Link from "next/link"

const proseLink =
  "text-foreground underline-offset-4 transition-colors hover:underline"

const buildMap = [
  {
    surface: "Composer",
    items: ["composer"],
  },
  {
    surface: "In-flight",
    items: [
      "decision-surface",
      "action-preview",
      "clarifying-questions",
      "observable-work",
      "run-trace",
      "usage-meter",
      "status-indicator",
    ],
  },
  {
    surface: "Post-run",
    items: ["run-receipt", "run-trace"],
  },
  {
    surface: "Settings",
    items: ["effective-policy-preview"],
  },
] as const

export function FoundationsContent() {
  return (
    <article>
      <header className="mb-12 sm:mb-20">
        <p className="section-label mb-3">Foundations</p>
        <h1 className="font-serif text-4xl leading-[1.15] font-light tracking-tight">
          Designing for agentic interfaces
        </h1>
        <p className="mt-4 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          This site documents how to design interfaces for AI agents that handle
          every autonomy level and feel good to use. These are the foundations —
          eight principles derived from product audits of Cursor, Codex, and
          Claude Code, tested in the site&apos;s labs, and shipped as
          installable primitives.
        </p>
      </header>

      <section className="page-section">
        <h2 className="text-xl font-semibold tracking-tight">
          1. Autonomy is a checkpoint-placement policy, not a dial
        </h2>
        <div className="mt-4 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          <p>
            Most designs treat autonomy as adding or removing safety. Wrong
            frame: total accountability is conserved. What an autonomy level
            actually decides is{" "}
            <span className="text-foreground">
              where the human checkpoint goes
            </span>{" "}
            — in-flight (approvals while it runs) or post-run (review after it
            finishes).
          </p>
          <p className="mt-3">
            &ldquo;Asks first&rdquo; spends your attention during the run;
            &ldquo;On its own&rdquo; defers it to the receipt. The feeling of a
            good agent UI is the feeling that the checkpoint moved, not
            disappeared.
          </p>
          <p className="mt-3">
            Demonstrated in the{" "}
            <Link href="/playground/run-surface" className={proseLink}>
              run surface lab
            </Link>
            : the same nine-step run across three postures — watch the
            checkpoint ledger relocate.
          </p>
        </div>
      </section>

      <section className="page-section">
        <h2 className="text-xl font-semibold tracking-tight">
          2. Four surfaces, one policy
        </h2>
        <div className="mt-4 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          <p>
            An agentic session has four surfaces, each with its own relationship
            to the run:
          </p>
          <ul className="mt-3 list-disc pl-5">
            <li>
              <span className="text-foreground">Settings</span> — rarely
              touched; where binding terms are set (allowlists, caps, rules).
            </li>
            <li>
              <span className="text-foreground">Composer</span> — per message;
              where the ask is stated.
            </li>
            <li>
              <span className="text-foreground">In-flight</span> — while it
              runs; where terms are enforced (approvals, budget limiter,
              steering).
            </li>
            <li>
              <span className="text-foreground">Post-run</span> — after; where
              outcomes are verified (diff review, receipt).
            </li>
          </ul>
          <p className="mt-3">
            Autonomy postures reshape the last two; the first two stay stable.
          </p>
        </div>
      </section>

      <section className="page-section">
        <h2 className="text-xl font-semibold tracking-tight">
          3. The composer keeps machinery chrome only
        </h2>
        <div className="mt-4 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          <p>
            Everything a shipping product renders on its composer is one of
            three kinds: <span className="text-foreground">meters</span>{" "}
            (read-only facts — context usage, branch, execution locus),{" "}
            <span className="text-foreground">pickers</span> (platform enums —
            mode, model), and <span className="text-foreground">pointers</span>{" "}
            (content aids — @-mentions, attachments). None of it is a term.
          </p>
          <p className="mt-3">
            User constraints (&ldquo;don&apos;t touch deps&rdquo;, &ldquo;keep
            it under $5&rdquo;) stay prose in the ask. Rendering wishes as
            chrome gives them the visual authority of enforced limits — the UI
            would be lying.
          </p>
          <p className="mt-3">
            Verdict record: the{" "}
            <Link href="/playground/composer-dressing" className={proseLink}>
              composer dressing lab
            </Link>{" "}
            compares five dressing levels; bare won.
          </p>
        </div>
      </section>

      <section className="page-section">
        <h2 className="text-xl font-semibold tracking-tight">
          4. Never render a promise the harness won&apos;t keep
        </h2>
        <div className="mt-4 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          <p>
            The binding/advisory line: platform-enforced limits (spend caps,
            sandbox boundaries) may appear as fixed chrome; user-stated wishes
            may only be echoed as understanding (&ldquo;here&apos;s what I
            parsed&rdquo;), never as guarantees.
          </p>
          <p className="mt-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs leading-5">
            Trust is calibrated by the UI&apos;s honesty about which is which. A
            spend cap in the toolbar is a promise. A parsed constraint in the
            ask echo is an acknowledgment — not the same thing, and the
            interface must not blur them.
          </p>
        </div>
      </section>

      <section className="page-section">
        <h2 className="text-xl font-semibold tracking-tight">
          5. Risk is orthogonal to autonomy
        </h2>
        <div className="mt-4 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          <p>
            No autonomy grant silently crosses a user-drawn boundary or an
            external side effect. In the{" "}
            <Link href="/playground/run-surface" className={proseLink}>
              run surface lab
            </Link>
            , the boundary escalation (&ldquo;the clean fix needs a dep bump;
            the ask excludes deps&rdquo;) and the push gate fire at every
            posture, including &ldquo;On its own&rdquo;.
          </p>
          <p className="mt-3">
            This is what makes high autonomy grantable: you delegate the
            routine, never the categorical.
          </p>
        </div>
      </section>

      <section className="page-section">
        <h2 className="text-xl font-semibold tracking-tight">
          6. Reversibility is the real autonomy enabler
        </h2>
        <div className="mt-4 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          <p>
            People grant autonomy when mistakes are cheap, not when oversight is
            thorough. Checkpoints, restores, branch isolation,
            revert-and-replan.
          </p>
          <p className="mt-3">
            A design that invests in undo can afford a quiet in-flight surface;
            a design without undo has to nag. Cursor&apos;s plan-mode advice —
            revert, refine the plan, run again — is this principle as product
            doc.
          </p>
        </div>
      </section>

      <section className="page-section">
        <h2 className="text-xl font-semibold tracking-tight">
          7. The run has two bookends with one content model
        </h2>
        <div className="mt-4 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          <p>
            The plan is the prospective account (what I&apos;ll touch, how, when
            I&apos;ll stop); the receipt is the retrospective one (what I
            touched, the evidence, what deviated). The receipt should{" "}
            <span className="text-foreground">diff against the plan</span>:
            deviations are acceptable when traced to a human decision —
            &ldquo;deviation — escalation #1, you approved it&rdquo; — and
            unacceptable when unexplained.
          </p>
          <p className="mt-3">
            A receipt without a plan can only list; it can never reconcile.
            Demonstrated in the{" "}
            <Link href="/playground/plan-receipt" className={proseLink}>
              plan-receipt lab
            </Link>
            . Installable as the{" "}
            <span className="font-mono text-xs text-foreground">
              run-receipt
            </span>{" "}
            primitive.
          </p>
        </div>
      </section>

      <section className="page-section">
        <h2 className="text-xl font-semibold tracking-tight">
          8. The receipt scales with the autonomy granted
        </h2>
        <div className="mt-4 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          <p>
            The more the agent did alone, the better the account it owes. At
            &ldquo;Asks first&rdquo; the receipt is nearly empty — you were
            there. At &ldquo;On its own&rdquo; it carries everything: evidence,
            scope, spend, and the review queue of edits applied without a human
            in the loop.
          </p>
          <p className="mt-3">
            High autonomy with a weak receipt is the worst feeling in the genre:
            neither control nor evidence.
          </p>
        </div>
      </section>

      <section id="build-it-map" className="page-section">
        <p className="section-label mb-3">Registry</p>
        <h2 className="text-xl font-semibold tracking-tight">Build-it map</h2>
        <p className="mt-3 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          Each surface maps to installable primitives. Lab routes are living
          documents of the decisions behind them.
        </p>
        <div className="mt-8 divide-y divide-border/70 border-y border-border/70">
          {buildMap.map((row) => (
            <div
              key={row.surface}
              className="grid gap-3 py-4 sm:grid-cols-[140px_1fr]"
            >
              <p className="text-sm font-medium text-foreground">
                {row.surface}
              </p>
              <ul className="space-y-2">
                {row.items.map((item) => (
                  <li key={item}>
                    <code className="block overflow-x-auto rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                      npx shadcn@latest add arielconti10/agentic-craft/{item}
                    </code>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          Related labs:{" "}
          <Link href="/playground/run-surface" className={proseLink}>
            run surface
          </Link>
          ,{" "}
          <Link href="/playground/composer-dressing" className={proseLink}>
            composer dressing
          </Link>
          ,{" "}
          <Link href="/playground/plan-receipt" className={proseLink}>
            plan-receipt
          </Link>
          .
        </p>
      </section>
    </article>
  )
}
