import { HugeiconsIcon } from "@hugeicons/react"
import {
  Shield01Icon,
  ArrowUp01Icon,
  File01Icon,
} from "@hugeicons/core-free-icons"
import InteractiveComposer from "../components/InteractiveComposer"

const agentProseStyle: React.CSSProperties = {
  lineHeight: "26px",
  letterSpacing: "-0.4px",
  fontVariationSettings: '"opsz" 12',
}

export default function Conversation() {
  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-3">Patterns</p>
        <h1 className="font-serif text-4xl font-light tracking-tight leading-[1.15]">
          Conversation
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Message patterns, prose styling, citations, streaming indicators, thinking
          blocks, and composer patterns for agent dialogue.
        </p>
      </header>

      {/* ─── Messages ─── */}
      <section id="messages" className="page-section">
        <p className="section-label mb-3">Core</p>
        <h2 className="text-xl font-semibold tracking-tight">Messages</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Three message types form the backbone of agent conversation: user, agent, and system.
        </p>

        <div className="mt-10 border border-border/40 rounded-lg p-6">
          <div className="space-y-4">
            {/* System message */}
            <div className="flex justify-center">
              <div className="rounded-md bg-muted px-3 py-1.5 text-xs text-muted-foreground">
                Agent connected to document repository
              </div>
            </div>
            {/* User message */}
            <div className="flex justify-end">
              <div className="max-w-[75%] rounded-lg bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                Can you review the Security Target document for CC evaluation compliance?
              </div>
            </div>
            {/* Agent message */}
            <div className="flex justify-start">
              <div className="max-w-[75%] rounded-lg border border-border bg-muted px-4 py-3">
                <div className="font-serif text-base" style={agentProseStyle}>
                  <p>
                    I've reviewed the Security Target against the Common Criteria v3.1 R5
                    requirements. The document covers the required ASE class components, but
                    I found three areas that need attention.
                  </p>
                  <p className="mt-4">
                    The conformance claims in Section 2 reference PP‑CIMC‑SLv3 but the
                    rationale table in Annex A doesn't map all SFRs back to the PP. The
                    FCS_COP.1 instantiation also references an outdated algorithm suite —
                    this will need updating before the evaluation facility review.
                  </p>
                </div>
              </div>
            </div>
            {/* Follow-up user message */}
            <div className="flex justify-end">
              <div className="max-w-[75%] rounded-lg bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                Can you list the specific SFRs that are missing from the mapping?
              </div>
            </div>
            {/* Agent response with list */}
            <div className="flex justify-start">
              <div className="max-w-[75%] rounded-lg border border-border bg-muted px-4 py-3">
                <div className="font-serif text-base" style={agentProseStyle}>
                  <p>The following SFRs from PP‑CIMC‑SLv3 are not mapped in Annex A:</p>
                  <ul className="mt-3 ml-5 list-disc space-y-1">
                    <li>FCS_CKM.1 — Cryptographic key generation</li>
                    <li>FCS_CKM.4 — Cryptographic key destruction</li>
                    <li>FDP_ACF.1 — Security attribute based access control</li>
                    <li>FMT_MSA.3 — Static attribute initialisation</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* System message */}
            <div className="flex justify-center">
              <div className="rounded-md bg-muted px-3 py-1.5 text-xs text-muted-foreground">
                4 findings added to evaluation tracker
              </div>
            </div>
          </div>
        </div>

        {/* Spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">Type</th>
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">Style</th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Details</th>
            </tr>
          </thead>
          <tbody className="text-sm text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 font-medium text-foreground">User</td>
              <td className="py-3 pr-6">bg-primary, text-primary-foreground</td>
              <td className="py-3">max-width 75%, rounded-lg, right-aligned, font-sans 14px</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 font-medium text-foreground">Agent</td>
              <td className="py-3 pr-6">border border-border bg-muted</td>
              <td className="py-3">max-width 75%, rounded-lg, left-aligned, font-serif 16px (agent prose styling)</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 font-medium text-foreground">System</td>
              <td className="py-3 pr-6">bg-muted, text-muted-foreground</td>
              <td className="py-3">centered, text-xs, rounded-md</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-10 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          <p>User messages are right-aligned to create visual separation of "who said what". Agent messages use serif typography to signal AI‑authored prose. System messages are unobtrusive — they provide context without demanding attention. Max-width 75% prevents messages from spanning the full content width, improving readability. Lists and structured content inside agent messages inherit the serif typography.</p>
        </div>
      </section>

      {/* ─── Agent Prose ─── */}
      <section id="prose" className="page-section">
        <p className="section-label mb-3">Typography</p>
        <h2 className="text-xl font-semibold tracking-tight">Agent Prose</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Long-form agent text uses Source Serif 4 for comfortable reading at extended lengths.
        </p>

        <div className="mt-10 border border-border/40 rounded-lg p-6">
          <div className="font-serif text-base" style={agentProseStyle}>
            <p>
              The Security Target review reveals that the TOE boundary definition in Section 1.4
              is well-structured but incomplete. The physical boundary diagram omits the HSM
              module, which is referenced in FCS_COP.1 as the cryptographic engine. This
              inconsistency will likely trigger an Observation Report (OR) during the evaluation
              facility's independent assessment.
            </p>
            <p className="mt-4">
              More significantly, the security problem definition in Section 3 lists seven
              threats but only five of them trace forward to security objectives in Section 4.
              The unmapped threats — T.MASQUERADE and T.TSF_COMPROMISE — are both addressed in
              the PP but the rationale for their exclusion from the ST objectives is missing.
              Without this rationale, the evaluator cannot confirm that the threat coverage is
              complete, which is a mandatory verdict requirement for ASE_OBJ.2.
            </p>
            <p className="mt-4">
              I recommend addressing these gaps before submitting to the evaluation facility.
              The HSM boundary issue is straightforward to fix, but the threat mapping gap will
              require either adding two new security objectives with corresponding SFR mappings
              or providing explicit justification for why these PP threats do not apply to the
              specific TOE configuration. The latter approach is faster but carries more risk of
              evaluator pushback.
            </p>
          </div>
        </div>

        {/* Typography spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">Property</th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Value</th>
            </tr>
          </thead>
          <tbody className="text-sm text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Font family</td>
              <td className="py-3 font-medium text-foreground">Source Serif 4</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Font size</td>
              <td className="py-3 font-medium text-foreground">16px</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Line height</td>
              <td className="py-3 font-medium text-foreground">26px</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Letter spacing</td>
              <td className="py-3 font-medium text-foreground">-0.4px</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Optical size</td>
              <td className="py-3 font-medium text-foreground">opsz 12</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Antialiasing</td>
              <td className="py-3 font-medium text-foreground">-webkit-font-smoothing: antialiased</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Paragraph spacing</td>
              <td className="py-3 font-medium text-foreground">margin-top 16px (p + p)</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Light-mode color</td>
              <td className="py-3 font-medium text-foreground">oklch(0.2642 0.013 93.9)</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-10">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><span className="font-medium text-foreground">Serif (Source Serif 4)</span> — agent-authored prose, analysis, explanations, long-form answers.</li>
            <li><span className="font-medium text-foreground">Sans (Albert Sans)</span> — UI labels, tool call titles, system messages, metadata, user input.</li>
            <li>The font switch signals authorship: serif = agent‑generated content, sans = interface chrome.</li>
          </ul>
        </div>
      </section>

      {/* ─── Citations ─── */}
      <section id="citations" className="page-section">
        <p className="section-label mb-3">Sourcing</p>
        <h2 className="text-xl font-semibold tracking-tight">Citations</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Citations ground agent responses in verifiable sources. Two patterns: inline superscripts and chip labels.
        </p>

        {/* Inline citations */}
        <div className="mt-14">
          <p className="section-label mb-3">Inline citations</p>

          <div className="mt-10 border border-border/40 rounded-lg p-6">
            <div className="font-serif text-base" style={agentProseStyle}>
              <p>
                The evaluation assurance level has been set to EAL4+, which requires
                independent vulnerability analysis by the ITSEF
                <sup className="ml-0.5 cursor-pointer text-xs font-sans font-medium text-primary hover:underline">[1]</sup>.
                The augmentation with ALC_FLR.2 mandates a documented flaw remediation
                process with explicit timelines for security-relevant fixes
                <sup className="ml-0.5 cursor-pointer text-xs font-sans font-medium text-primary hover:underline">[2]</sup>.
                Notably, the scheme's interpretive guidance requires that all SFR-supporting
                modules be included in the TOE boundary — the current exclusion of the logging
                subsystem may not survive the certification body's review
                <sup className="ml-0.5 cursor-pointer text-xs font-sans font-medium text-primary hover:underline">[3]</sup>.
              </p>
            </div>
          </div>
        </div>

        {/* Citation chips */}
        <div className="mt-14">
          <p className="section-label mb-3">Citation chips</p>

          <div className="mt-10 border border-border/40 rounded-lg p-6">
            <div className="flex flex-wrap gap-2">
              {[
                { icon: Shield01Icon, label: "Security Target §6.1.1" },
                { icon: File01Icon, label: "Evaluation Technical Report §4.2" },
                { icon: File01Icon, label: "PP‑CIMC‑SLv3 §5.1.1" },
              ].map((chip) => (
                <button
                  key={chip.label}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <HugeiconsIcon icon={chip.icon} size={12} strokeWidth={1.5} />
                  {chip.label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Chips are an alternative to superscripts when the citation target has a human-readable label.
              Useful for referencing specific document sections.
            </p>
          </div>
        </div>

        {/* Reference panel */}
        <div className="mt-14">
          <p className="section-label mb-3">Reference panel</p>

          <div className="mt-10 space-y-2">
            {[
              {
                num: 1,
                title: "Common Criteria Part 3: Security Assurance Components",
                source: "ccportal.org/cc/part3/v3.1r5",
                excerpt: "ALC_FLR.2 requires the developer to establish flaw remediation procedures with defined response timelines...",
              },
              {
                num: 2,
                title: "Flaw Remediation Policy — ACME Security Module v3.1",
                source: "docs.internal/acme-sm/flr-policy-v3.1.pdf",
                excerpt: "Critical vulnerabilities: 72-hour acknowledgment, 30-day resolution. High: 7-day ack, 90-day resolution...",
              },
              {
                num: 3,
                title: "Scheme Interpretive Guidance — TOE Boundary Scope",
                source: "ccscheme.gov/guidance/toe-boundary-2024.pdf",
                excerpt: "All subsystems that enforce, support, or contribute to SFR satisfaction must fall within the TOE boundary...",
              },
            ].map((ref) => (
              <div
                key={ref.num}
                className="flex items-start gap-3 rounded-md border border-border/40 p-3"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-medium text-primary-foreground">
                  {ref.num}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{ref.title}</p>
                  <p className="text-xs text-muted-foreground">{ref.source}</p>
                  <p className="mt-1 text-xs text-muted-foreground italic">{ref.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          <p>Inline superscripts are best for flowing prose where interruption should be minimal. Citation chips work better for structured references or when the source label is meaningful. Reference panels should appear at the end of a message or in a collapsible drawer. Always include a source path or URL — citations without provenance undermine trust.</p>
        </div>
      </section>

      {/* ─── Streaming ─── */}
      <section id="streaming" className="page-section">
        <p className="section-label mb-3">Indicators</p>
        <h2 className="text-xl font-semibold tracking-tight">Streaming</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Visual indicators that the agent is generating a response, mid-stream.
        </p>

        {/* Streaming cursor */}
        <div className="mt-14">
          <p className="section-label mb-3">Streaming cursor</p>

          <div className="mt-10 border border-border/40 rounded-lg p-6">
            <div className="max-w-[75%] rounded-lg border border-border bg-muted px-4 py-3">
              <div className="font-serif text-base" style={agentProseStyle}>
                <p>
                  The FDP_IFC.1 component specifies information flow control for the
                  TOE's inter-module communication channel. Based on the security
                  functional policy defined in Section 7.2, the flow control SFP
                  covers all data transfers between
                  <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-foreground align-middle" />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Thinking — collapsed */}
        <div className="mt-14">
          <p className="section-label mb-3">Thinking block (collapsed)</p>

          <div className="mt-10 border border-border/40 rounded-lg p-6">
            <div className="rounded-md border border-dashed border-border bg-muted/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-md bg-muted-foreground" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-md bg-muted-foreground [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-md bg-muted-foreground [animation-delay:0.4s]" />
                </div>
                <span className="text-xs text-muted-foreground">Thinking...</span>
                <span className="ml-auto text-xs text-muted-foreground cursor-pointer hover:text-foreground">expand</span>
              </div>
            </div>
          </div>
        </div>

        {/* Thinking — expanded */}
        <div className="mt-14">
          <p className="section-label mb-3">Thinking block (expanded)</p>

          <div className="mt-10 border border-border/40 rounded-lg p-6">
            <div className="rounded-md border border-dashed border-border bg-muted/50 px-4 py-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-md bg-muted-foreground" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-md bg-muted-foreground [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-md bg-muted-foreground [animation-delay:0.4s]" />
                </div>
                <span className="text-xs text-muted-foreground">Thinking...</span>
                <span className="ml-auto text-xs text-muted-foreground cursor-pointer hover:text-foreground">collapse</span>
              </div>
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                Let me analyze the evaluation findings systematically. The timestamp issue in
                the audit log appears to be a configuration mismatch, not a compliance failure —
                the TOE uses UTC internally but the log viewer displays local time. I need to
                check whether FAU_GEN.1 specifies a format requirement... it specifies "date
                and time" but doesn't mandate UTC. So this might not be a finding after all. But
                wait — the PP interpretation in Annex B does require unambiguous timestamps.
                Let me re-read that section...
              </p>
            </div>
          </div>
        </div>

        {/* Scroll-to-bottom */}
        <div className="mt-14">
          <p className="section-label mb-3">Scroll-to-bottom indicator</p>

          <div className="mt-10 border border-border/40 rounded-lg p-6">
            <div className="relative h-24 rounded-md border border-border">
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                <button className="inline-flex items-center gap-1.5 rounded-md bg-muted/50 px-3 py-1.5 text-xs transition-colors hover:bg-muted">
                  New activity
                  <HugeiconsIcon icon={ArrowUp01Icon} size={12} strokeWidth={1.5} className="rotate-180" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          <p>The streaming cursor uses <code className="rounded bg-muted px-1.5 py-0.5 text-xs not-italic">animate-pulse</code> — subtle, not distracting. Thinking blocks use dashed borders to visually separate internal reasoning from final output. The scroll-to-bottom button uses a subtle rounded shape consistent with the system radius tokens. Expanded thinking content is italic to distinguish it from the agent's final response.</p>
        </div>
      </section>

      {/* ─── Thinking Blocks ─── */}
      <section id="thinking" className="page-section">
        <p className="section-label mb-3">Reasoning</p>
        <h2 className="text-xl font-semibold tracking-tight">Thinking Blocks</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Deeper patterns for displaying agent reasoning and chain-of-thought content.
        </p>

        {/* Collapsed default */}
        <div className="mt-14">
          <p className="section-label mb-3">Collapsed default</p>

          <div className="mt-10 border border-border/40 rounded-lg p-6">
            <div className="rounded-md border border-dashed border-border bg-muted/50 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">◑</span>
                <span className="text-xs text-muted-foreground">Thinking...</span>
                <span className="ml-auto text-xs text-muted-foreground cursor-pointer hover:text-foreground">[expand]</span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Default state while the agent is reasoning. Collapsed to keep the conversation compact.
          </p>
        </div>

        {/* Expanded with reasoning */}
        <div className="mt-14">
          <p className="section-label mb-3">Expanded with reasoning</p>

          <div className="mt-10 border border-border/40 rounded-lg p-6">
            <div className="rounded-md border border-dashed border-border bg-muted/50 px-4 py-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-muted-foreground">◑</span>
                <span className="text-xs text-muted-foreground">Thinking...</span>
                <span className="ml-auto text-xs text-muted-foreground cursor-pointer hover:text-foreground">[collapse]</span>
              </div>
              <div className="space-y-2 text-xs text-muted-foreground italic leading-relaxed">
                <p>
                  OK, I need to check the SFR mapping for completeness. The PP defines 23 SFRs
                  and the ST claims strict conformance, so every single one must be present. Let
                  me count what's in Section 6...
                </p>
                <p>
                  I see 21 SFRs mapped. Missing: FCS_CKM.4 and FDP_ACF.1. Wait — FCS_CKM.4
                  might be covered under the umbrella of FCS_CKM.1 if the ST uses the
                  "combined" instantiation. Let me check the PP's application notes...
                </p>
                <p>
                  No, the PP application note explicitly says CKM.4 must be instantiated
                  separately. So that's definitely a gap. For FDP_ACF.1 — this was present in
                  the previous ST version but seems to have been dropped in the v3.1 rewrite.
                  Possibly an editing error rather than intentional removal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Completed thinking */}
        <div className="mt-14">
          <p className="section-label mb-3">Completed thinking summary</p>

          <div className="mt-10 border border-border/40 rounded-lg p-6">
            <div className="rounded-md border border-dashed border-border bg-muted/50 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">●</span>
                <span className="text-xs text-muted-foreground">Thought for 4.2s</span>
                <span className="ml-auto text-xs text-muted-foreground cursor-pointer hover:text-foreground">[expand]</span>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-border bg-muted px-4 py-3">
              <div className="font-serif text-base" style={agentProseStyle}>
                <p>
                  Two SFRs are missing from the mapping: FCS_CKM.4 (key destruction) and
                  FDP_ACF.1 (attribute-based access control). The CKM.4 omission is a genuine
                  gap, while the ACF.1 absence appears to be an editing error introduced in
                  the v3.1 rewrite — it was present in the previous version.
                </p>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            After the agent finishes, thinking collapses to a duration summary. The user can expand to review reasoning.
          </p>
        </div>

        {/* Do / Don't table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">Do</th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Don't</th>
            </tr>
          </thead>
          <tbody className="text-sm text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Show genuine uncertainty and course corrections</td>
              <td className="py-3">Polish thinking content into formal prose</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Use exploratory, working-through-it language</td>
              <td className="py-3">Over-anthropomorphize ("I feel uncertain...")</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Reference specific evidence being examined</td>
              <td className="py-3">Include thinking that contradicts the final answer</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Allow the user to collapse at any time</td>
              <td className="py-3">Force thinking to remain expanded after completion</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ─── Composer ─── */}
      <section id="composer" className="page-section">
        <p className="section-label mb-3">Input</p>
        <h2 className="text-xl font-semibold tracking-tight">Composer</h2>
        <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          The message input area. Use the controls to explore every variant — type, send,
          toggle features. Everything is interactive.
        </p>

        <div className="mt-14 rounded-xl border border-border/40 bg-background p-6">
          <InteractiveComposer />
        </div>

        {/* Composer spec table */}
        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground">Element</th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Spec</th>
            </tr>
          </thead>
          <tbody className="text-sm text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 font-medium text-foreground">Container</td>
              <td className="py-3">max-w-[720px], rounded-lg, border border-border</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 font-medium text-foreground">Textarea</td>
              <td className="py-3">Auto-expanding, min 36px, max 160px, 14px Albert Sans</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 font-medium text-foreground">Send button</td>
              <td className="py-3">32×32px, bg-primary when active, bg-muted when empty, spring press animation</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 font-medium text-foreground">Focus state</td>
              <td className="py-3">Border transitions to foreground/20, subtle outer shadow</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 font-medium text-foreground">Scope banner</td>
              <td className="py-3">max-w-[690px], bg-muted/50, slides in/out, dismissible × button</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 font-medium text-foreground">Reply banner</td>
              <td className="py-3">↩ icon + truncated quote, no label or border-quote, 12px</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 font-medium text-foreground">Knowledge tabs</td>
              <td className="py-3">Clickable tab row, active = bg-primary, placeholder changes per tab</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 font-medium text-foreground">Suggestions</td>
              <td className="py-3">Click to fill textarea, flash animation on click, flex-wrap below</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6 font-medium text-foreground">Attachments</td>
              <td className="py-3">File preview chips with name/size, dismiss per-file, enables send</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-10 border-l-2 border-muted-foreground/15 pl-4 text-sm italic text-muted-foreground">
          <p>Scope and reply-to are mutually exclusive — enabling one dismisses the other. Knowledge tabs default to "All Sources" and change the placeholder contextually. The send button uses a spring-based press animation (cubic-bezier 0.34, 1.56, 0.64, 1) with an arrow flyout on send. Every banner and chip set slides in with a 250ms ease-out. Suggestion chips fill the textarea on click with a brief color flash to confirm the action.</p>
        </div>
      </section>
    </article>
  )
}
