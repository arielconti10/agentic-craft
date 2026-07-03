# INVENTORY

## Claim inventory — "Sources & Artifacts" (`/Users/arielconti/workspace/agentic-craft/src/views/sources-content.tsx`)

Prose in this view is thin (one intro paragraph per section plus a "Required States" table); most of the substance lives in four working components. Code-backing status is noted per pattern.

## Patterns asserted

1. **Provenance as a product surface (page framing)**
   - Claim: Provenance should be "an inspectable product surface instead of a small citation number at the end of a sentence."
   - Prescription: Treat citations, source lists, output documents, and usage as first-class inspectable UI, not footnote decoration.
   - Code: framing only — realized collectively by the components below.

2. **Inline marker → source preview (`#citations`)**
   - Claim: "Hovering or focusing a citation marker opens the source preview anchored at the marker itself, so verification never leaves the sentence."
   - Prescription: Anchor the preview popover at the citation chip; support hover (300ms delay), keyboard focus, and touch tap as equivalent open triggers; Escape or outside-tap dismisses; paginate across sources inside the card ("N of M" with prev/next).
   - Code-backed: yes — `src/components/ui/source-preview.tsx` (`SourcePreviewCitation`, Base UI popover). Implementation is unusually thorough: `:focus-visible`-only keyboard opening, a one-shot "return-focus guard" so Base UI's programmatic refocus after Escape doesn't reopen the card, `motion-reduce` handling, expanded touch hit-area via `after:` pseudo-element.

3. **Source companion list (`#source-list`)**
   - Claim: "Sources remain inspectable after the answer" — the source list persists as a standing surface below/beside the answer, each row opening the same preview card.
   - Prescription: Render a numbered source list with title, location (page/section), and URI; reuse the identical popover preview so the citation card and the list card are one component.
   - Code-backed: yes — same `SourcePreviewPopover` parts reused in the view.

4. **Side panel work surface / contextual workbench (`#contextual-workbench`)**
   - Claim: implicit only — the section has a heading and a demo but zero explanatory prose.
   - Prescription (inferred from code): chat pane + tabbed surface pane (browser / source / diff), resizable split on desktop, chat/surface toggle on mobile, agent messages linked to a `surfaceId`, "N previous messages" collapse, "1 file changed + Undo" affordance.
   - Code-backed: yes — `src/components/ui/contextual-workbench.tsx` (fully working, Cursor/Devin-style layout).

5. **Document as the output surface (`#artifact-document`)**
   - Claim: "An agent output can be more than a message. A document surface shows which sections are cited, which are draft-only, and what still needs human input."
   - Prescription: Give the artifact a doc-level status (draft/reviewing/ready/blocked), version, linked-source count, and per-section status (draft / cited / needs-source). Notable embedded design rule (code comment): "'Cited' is proven by the visible source link in the body, so only states that need attention get a label."
   - Code-backed: yes — `src/components/ui/artifact-document.tsx`.

6. **Usage meter (`#usage-meter`)**
   - Claim: "Usage is shown near source-backed work so teams can judge whether to continue, pause, or narrow scope."
   - Prescription: Show tokens, cost, and — distinctively — "source coverage" (14/19 verified) as parallel progress meters with limit labels, co-located with the work rather than in a settings page.
   - Code-backed: partially — `src/components/ui/usage-meter.tsx` is a thin wrapper over `Progress`; it has **no threshold-warning state** despite the Required States table demanding one.

7. **Required states table (`#implementation`)**
   - Claim: each pattern has a mandatory state checklist (e.g., inline citation must cover "hover, focus, touch tap, **broken**, escape dismiss"; artifact must cover "cited, draft, needs-source, **blocked, approved**"; usage meter must cover "**threshold warning**").
   - Prescription: treat these as acceptance criteria.
   - Code gap: the shipped components do **not** implement several mandated states — no broken-citation state in `SourcePreviewCitation`, no "approved" section/doc state in `ArtifactDocument` (doc has "ready", sections top out at "cited"), no threshold warning in `UsageMeter`, and `ContextualWorkbench`'s "blocked" status exists in the type but has no distinct rendering.

## Evidence status per claim

| # | Claim | Status |
|---|---|---|
| 1 | Provenance-as-surface framing | **ASSERTED** — a thesis, no grounding offered |
| 2 | Marker-anchored preview; hover/focus/tap parity; Escape dismiss | **ASSERTED** — no product named, no a11y guideline cited (WAI-ARIA tooltip/disclosure patterns would be the natural citation and are absent) |
| 3 | Sources persist after the answer | **ASSERTED** — clearly modeled on real products (Perplexity, ChatGPT search) but none named |
| 4 | Chat + tabbed workbench split | **ASSERTED** — the demo visibly imitates Cursor/Devin-style layouts ("1 file changed", Undo, diff tab) without ever saying so |
| 5 | Per-section cited/draft/needs-source document | **ASSERTED** — the "needs-source" state appears invented; no product cited |
| 6 | Usage co-located with work; "source coverage" as a meter | **ASSERTED** — tokens/cost meters echo Cursor/Claude Code/Devin conventions unnamed; "source coverage" meter is invented |
| 7 | Required-states checklists | **ASSERTED** — author's own acceptance criteria, partially contradicted by his own components |

**Zero PRODUCT-GROUNDED claims and zero CITED claims in this entire section.** No product name, company, guideline, or research reference appears anywhere in the file. This is the weakest evidence profile possible for a "checked against real top-tier interfaces" guide, even though the patterns are recognizably derived from real products.

## Verification list

1. **Hover/focus on an inline citation opens a source preview anchored at the marker.** Check: Perplexity (answer citations), ChatGPT with search (citation pills), Google Gemini / AI Mode, NotebookLM (inline citation click → source passage). Look at: trigger (hover vs click), anchoring position, whether keyboard focus opens it, Escape behavior, touch behavior on mobile.
2. **Numbered chip as the marker style.** The guide uses bare numbered chips; several shipped products moved to favicon/domain pills or stacked-favicon clusters. Check Perplexity and ChatGPT current marker anatomy — if favicons dominate, the numbered-chip prescription needs a caveat.
3. **In-card pagination across sources ("2 of 3" with prev/next).** Check whether any real product paginates inside the preview card (Perplexity groups multiple sources; ChatGPT lists them) — this may be an invention worth labeling as such.
4. **Persistent source list after the answer.** Check: Perplexity's sources row/tab, ChatGPT's sources sidebar, NotebookLM's source panel. Look at: placement (inline list vs side panel), whether rows reuse the same preview card as inline markers (the guide's "one component" claim).
5. **Chat + tabbed surface workbench (browser/source/diff tabs, resizable, mobile toggle).** Check: Devin (plan/browser/shell/editor panes), Manus ("computer" panel), Cursor agent layout, ChatGPT Canvas, Claude artifacts/side panel. Look at: whether messages deep-link to a surface state (the `surfaceId` idea), and the mobile chat↔surface switch.
6. **Per-section citation status on an output document, incl. an explicit "needs-source" flag.** Check: NotebookLM reports, OpenAI/Gemini Deep Research outputs, Perplexity Pages. The "needs-source" gap-flag is the most likely pure invention — verify whether anything ships it before presenting it as a pattern rather than a proposal.
7. **Usage meters co-located with agent work (tokens, cost, and thresholds).** Check: Claude Code context-remaining indicator and cost reporting, Cursor's context-window/usage UI, Devin's ACU meter, Manus credits. Look at: whether real products show raw tokens+dollars in-flow (many abstract to credits/percent), and whether any shows "source coverage" (almost certainly none — flag as proposal).
8. **Escape-dismiss + focus-return behavior.** Cross-check against WAI-ARIA APG disclosure/tooltip patterns — this is the one place an authoritative CITED reference is cheap to add and currently missing.

## Staleness risks

- **Citation marker anatomy** is the fastest-moving surface here: the numbered-chip-only presentation may already read dated if leading products standardized on favicon pills or hybrid pills during 2026. The demo's `sources` are internal-doc URIs, which sidesteps the web-favicon question entirely — worth an explicit note in the guide.
- **The workbench demo encodes a specific Cursor-era layout** (files-changed row with Undo, "Default permissions" hint in the composer, diff tab). If Cursor or Devin have since reorganized their agent panes (e.g., newer Cursor releases), the uncited imitation ages silently because nothing pins it to a version or product.
- **Usage economics framing** (raw token counts + dollar caps per run) may be stale if major agents have moved further toward abstracted credits/effort units; the "session budget" / "review cap" vocabulary matches no named product and can't be checked against one.
- **Dependency note:** `source-preview.tsx` imports `@base-ui/react/popover` and leans on Base UI-specific behaviors (open-reason event details, exit-animation refocus timing). Base UI's API churn around 1.x means the carefully documented return-focus workaround may describe a bug/behavior that no longer exists — the prose claim ("Escape... dismisses") is fine, but the implementation notes could mislead.

## Quality read

This is the rare section where the code is stronger than the prose: the citation popover's focus-management engineering, the "cited is proven by the visible link — only attention-needing states get labels" rule, and the "needs-source" section state are genuinely distinctive, opinionated contributions rather than pattern-catalog filler. But as a *reference guide* it is currently indefensible on evidence — not one product, guideline, or study is named across the whole area, and the Required States table mandates states (broken citation, threshold warning, approved) that the author's own components don't implement. The single strongest idea: making **missing provenance a first-class document state** ("needs-source") so the artifact itself tells the human what still requires verification — that's a real advance over the citation-footnote model, and it deserves to be presented honestly as a proposal alongside product-grounded baselines.

# PRODUCT CHECK

# Fact-check report — "Sources & Artifacts" area (evidence gathered 2026-07-02)

## CONFIRMED

**1. Hover/focus on an inline citation opens a source preview (claim 2, core interaction)**
- **ChatGPT (search/Atlas), answer body**: inline citations render as superscript gray bubbles after the supporting sentence; on desktop, hovering shows a preview mini-card (source names, page title, domain, snippet); on mobile, tapping the bubble shows the same mini-card; clicking goes to the source. Sources: [Typescape, "ChatGPT Citations Explained"](https://typescape.ai/blog/chatgpt-citations-explained/) (pub. 2026-01-24), [AirOps citation-tracking guide](https://www.airops.com/blog/chatgpt-citation-tracking). Hover/tap parity across desktop/mobile is directly confirmed.
- **Perplexity, answer body**: inline numbered markers with hover, click, and expanded-view interactions; hover surfaces metadata (title, site name, favicon). Sources: [Unusual.ai Perplexity platform guide](https://www.unusual.ai/blog/perplexity-platform-guide-design-for-citation-forward-answers), [DataStudios on Perplexity citations](https://www.datastudios.org/post/does-perplexity-always-show-sources-citation-quality-and-transparency) (2026).
- **Google AI Mode, answer body**: hover previews on inline links (site name + page title) **shipped 2026-05-06** as one of five citation surfaces. Sources: [brandcited.ai on the I/O 2026 changes](https://www.brandcited.ai/blog/google-io-2026-ai-mode-brand-citations), [thekeyword.co summary](https://www.thekeyword.co/news/google-adds-more-source-links-in-ai-mode-responses).
- **NotebookLM, answer body**: hover previews the quoted text; click opens the source at that exact passage (deep link into the uploaded doc). Sources: [FSU help article on NotebookLM inline citations](https://servicecenter.fsu.edu/s/article/How-do-NotebookLM-s-inline-citations-work-and-why-are-they-important), [XDA NotebookLM guides](https://www.xda-developers.com/how-to-use-notebooklm/) (2025–2026).
- Verdict: the pattern's core ("verification never leaves the sentence") is well grounded in 4 products. The guide just never names any of them.

**2. Numbered chips are a real, current marker style — but not the only one (claim 2 anatomy)**
- Perplexity and NotebookLM still use numbered markers as of 2026 evidence above; ChatGPT's bubbles show *source names/domains*, not bare numbers, and Google AI Mode uses plain inline text links. So numbered chips are confirmed-alive (Perplexity/NotebookLM lineage) but need a caveat that ChatGPT/Google standardized on name/link-forward markers. Sources: as above; [ShapeofAI citations pattern](https://www.shapeof.ai/patterns/citations) (© 2025) documents "multi-source references: inline citations with metadata (title, favicon)" as a named variation.

**3. Persistent source list after the answer (claim 3 / verification item 4)**
- **Perplexity**: expandable "Reviewed sources" full-list surface alongside numbered inline markers — exactly the two-layer model the guide prescribes. Source: [Unusual.ai guide](https://www.unusual.ai/blog/perplexity-platform-guide-design-for-citation-forward-answers) (2026).
- **ChatGPT**: "Sources" pill button beneath the response opens a side panel listing cited links plus other relevant links (~20–25). "No Sources button? ChatGPT answered from memory." Sources: [Typescape](https://typescape.ai/blog/chatgpt-citations-explained/) (2026-01), [Portland SEO Growth how-to](https://www.portlandseogrowth.com/free-seo-resources/how-to-find-chat-gpt-sources/).
- **NotebookLM**: standing sources panel; Deep Research additionally returns the report plus a list of *all* relevant sources, cited and uncited, selectable for import. Source: [XDA on Deep Research in NotebookLM](https://www.xda-developers.com/making-most-deep-research-notebooklm/) (2026).
- Verdict: claim confirmed across three products. The sub-claim that list rows and inline markers open *the same preview card* is not publicly documented → hands-on.

**4. Chat + tabbed work-surface pane (claim 4 / verification item 5)**
- **Devin, session view**: right-hand panel with tabs (Planner/Progress, Shell, Browser, Editor); a "Following" switch live-switches tabs as Devin uses them — a real product analog of the guide's message↔surface linkage. Sources: [DataCamp Devin tutorial](https://www.datacamp.com/tutorial/devin-ai), [Medium on Devin's sandbox](https://medium.com/@nitinmatani22/devins-cloud-sandbox-explained-shell-browser-and-editor-working-as-one-6e001f8c5d3c), [Devin docs release notes](https://docs.devin.ai/release-notes/2024).
- **Manus, "Manus's Computer" panel**: persistent side panel showing the agent's browser/terminal in real time; user can intervene; sessions are replayable/rollback-able. Sources: [Manus Browser Operator blog](https://manus.im/blog/manus-browser-operator), [WorkOS "Introducing Manus"](https://workos.com/blog/introducing-manus-the-general-ai-agent).
- **ChatGPT Canvas**: opens as right-side panel next to chat; Previous/Next version arrows and "Restore this version." Sources: [OpenAI Help — canvas](https://help.openai.com/en/articles/9930697-what-is-the-canvas-feature-in-chatgpt-and-how-do-i-use-it), [Zapier canvas guide](https://zapier.com/blog/chatgpt-canvas/).
- **Claude.ai artifacts**: dedicated side panel right of chat; version selector bottom-left of the panel. Source: [Claude Help Center — artifacts](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them).
- Verdict: the split-pane workbench is the single best-grounded pattern in the area — but see CONTRADICTED for the Cursor-specific framing.

**5. Usage co-located with work — tokens/context/cost in-flow (claim 6, partially)**
- **Claude Code, statusline + slash commands**: configurable statusline can show `context_window.used_percentage`; built-in "Context left till auto-compact" warning appears near ~95%; `/cost` (API-billed users) shows session dollar spend + token breakdown by model; `/usage` shows plan limits for subscribers. Sources: [Claude Code statusline docs](https://code.claude.com/docs/en/statusline), [Claude Code costs docs](https://code.claude.com/docs/en/costs), [GitHub issue #15247 on always-visible context indicator](https://github.com/anthropics/claude-code/issues/15247) (2026). So "tokens + dollars in-flow" is real — for API-billed users; it's hidden by default on subscriptions.
- **Cursor, composer/chat**: context-used percentage indicator (hover → raw "45,000 / 200,000 tokens"); note forum threads report it disappearing/moving across releases. Sources: [tokenlimits.app Cursor context guide](https://tokenlimits.app/blog/cursor-context-window), [Cursor forum: indicator removed?](https://forum.cursor.com/t/the-consumption-indicator-of-the-context-window-appears-to-have-been-removed/139914) (2026).
- **Devin**: per-session ACU limits can be set; usage billed in ACUs (~15 min work, $2–2.25/ACU); no pre-task quote. Sources: [Devin billing docs](https://docs.devin.ai/admin/billing), [devin.ai/pricing](https://devin.ai/pricing/).
- Verdict: "usage near the work" is confirmed for coding agents (context meters, session caps) — but see CONTRADICTED for the raw-tokens-and-dollars universality and the invented "source coverage" meter.

**6. Escape-dismiss / focus-return has a cheap authoritative citation (verification item 8)**
- [WAI-ARIA APG Tooltip pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/): "Escape: Dismisses the Tooltip"; focus stays on the trigger while shown; dismissed on blur. Crucially, APG says tooltips **must not contain focusable content** — interactive content (like the guide's prev/next pagination) requires a **non-modal dialog** pattern instead. The guide's implementation (focus-visible open, Escape dismiss, return-focus guard) is actually closer to APG's non-modal dialog than to a tooltip — cite it as such, not as a tooltip.

**7. Base UI dependency (staleness-risk check — good news)**
- Package renamed from `@base-ui-components/react` to `@base-ui/react` at **v1.0.0, 2025-12-11**, so the code's `@base-ui/react/popover` import is the *current* post-1.0 name. But v1.0.0 also changed popover focus-trapping/nested-hover behavior and [`onOpenChange` behavior changed post-1.0 (issue #1744)](https://github.com/mui/base-ui/issues/1744) — the return-focus workaround should be re-verified against the installed version. Sources: [v1.0.0 release](https://github.com/mui/base-ui/releases/tag/v1.0.0), [base-ui.com v1.0.0 notes](https://base-ui.com/react/overview/releases/v1-0-0).

## CONTRADICTED / STALE

**1. "Chat + tabbed workbench" presented as the Cursor-shaped default — Cursor no longer looks like that.**
Cursor 3 (shipped **2026-04-02**) replaced the single chat+editor split with the **Agents Window**: a standalone agent-first interface running many agents in parallel, with **Agent Tabs viewable side-by-side or in a grid**, tiled layout (3.1), and a dedicated diffs view where you review word-level changes, stage, commit, and open PRs — including a **unified multi-agent diff color-coded by which agent made each change**. The demo's one-chat/one-surface layout with a "files changed + Undo" row and "Default permissions" composer hint encodes the pre-3.0 Cursor sidebar era. It now reads as Devin/Manus-style, not Cursor-style — fine, but the uncited imitation has already aged exactly as the staleness note predicted. Sources: [cursor.com/changelog/3-0](https://cursor.com/changelog/3-0), [cursor.com/changelog/3-1](https://cursor.com/changelog/3-1), [cursor.com/blog/cursor-3](https://cursor.com/blog/cursor-3), [the-decoder coverage](https://the-decoder.com/new-cursor-3-ditches-the-classic-ide-layout-for-an-agent-first-interface-built-around-parallel-ai-fleets/).

**2. "Tokens + dollars co-located with the work" as the general pattern — the market moved to abstracted units, and one panel product doesn't co-locate at all.**
Devin bills in ACUs, Manus in credits; neither shows tokens or dollars in-flow. Manus specifically shows **credit balance in the UI but consumption history only in Settings > Usage**, and its help center acknowledges real-time in-task consumption visibility as a *requested improvement, not a shipped feature* — the opposite of the guide's prescription. Devin doesn't pre-quote ACU cost; it bills after. Claude Code shows dollars only for API-billed users. Present raw-tokens+dollars as one end of an abstraction spectrum (Claude Code API mode) rather than the norm. Sources: [Manus: where to check credit consumption](https://help.manus.im/en/articles/12520235-where-can-i-check-my-credit-consumption-usage), [Manus: pre-task cost estimate?](https://help.manus.im/en/articles/13185575-is-there-a-way-to-check-how-many-credits-a-task-will-cost-before-i-begin), [Devin billing](https://docs.devin.ai/admin/billing).

**3. "Source coverage (14/19 verified)" meter — no product ships anything like it.**
Nothing in Perplexity, ChatGPT, NotebookLM, Devin, Manus, Cursor, or Claude Code surfaces a verified-sources-over-total progress meter. Label it explicitly as the author's proposal. (The nearest real analog is Gemini's double-check highlighting — see MISSED.)

**4. "needs-source" per-section state — invented, but a real per-claim analog exists and should be cited instead of implied precedent.**
No product ships draft/cited/needs-source *section* labels on an output document. However, **Gemini's "double-check response"** does per-statement verification coloring: green highlight = Search found corroborating content, orange = contradicting/no content found, no highlight = not evaluable — which is "missing provenance as a first-class state" shipped at sentence granularity. The guide's strongest idea has product-grounded cousins; presenting it with zero citations undersells it. Source: [Google support — double-check responses](https://support.google.com/gemini/answer/14143489) (note: verify current availability — some 2025–2026 reports suggest the feature's placement changed; see NEEDS HANDS-ON).

**5. Numbered-chip-only marker anatomy — stale as a universal.**
ChatGPT's inline markers are source-name bubbles, Google AI Mode uses plain inline links with hover previews (May 2026), and Perplexity's numbered markers carry favicon+title metadata in the hover card. The guide's bare numbered chips with internal-doc URIs match the NotebookLM/enterprise-RAG lineage — accurate for that context, misleading as the general web-answer pattern. Add the caveat the inventory anticipated. Sources: as in CONFIRMED 1–2.

## NEEDS HANDS-ON

1. **Keyboard-focus opening of citation previews** (guide's `:focus-visible` behavior): open Perplexity and ChatGPT on desktop, Tab through an answer with citations — note whether markers are focusable at all, whether focus opens the preview, and what Escape does (dismiss? focus return?). No public doc covers keyboard behavior in either product. ~5 min each.
2. **In-card pagination ("2 of 3" + prev/next)**: in Perplexity, find a clustered citation backing one claim with multiple sources; hover/click and record whether the card paginates, lists all sources, or routes to the sources tab. Repeat in ChatGPT (hover a bubble citing multiple sources). Public evidence suggests both *list* rather than paginate — if confirmed, label the guide's pagination as a proposal.
3. **"One component" claim (list row opens same card as inline marker)**: in Perplexity, compare the hover card on an inline marker vs. the source-list/reviewed-sources row; in ChatGPT compare inline hover card vs. Sources-panel row. Note whether the surfaces are visually/behaviorally identical.
4. **Broken-citation state**: in ChatGPT/Perplexity, locate an answer citing a now-dead URL (or use a known 404) — does any UI mark it as unavailable, or does verification silently fail? No public evidence any product ships a broken state; if none, the Required-States "broken" row is a proposal (and currently unimplemented even in the guide's own component).
5. **Cursor 3 Agents Window layout specifics**: `Cmd+Shift+P → Agents Window`, start a local agent run — record what the surface pane actually contains now (diff view? browser via Design Mode? terminal?), whether a "files changed + Undo/Keep" row survives from the sidebar era, and whether the composer still shows a permissions hint. This pins the workbench demo to a version.
6. **Mobile chat↔surface toggle**: open Claude iOS/Android with an artifact and ChatGPT mobile with a canvas — record the exact chat/surface switch affordance (tab bar? swipe? full-screen takeover?) to ground the demo's mobile toggle.
7. **Gemini double-check current status**: open Gemini web, generate a factual answer, look for the double-check/"G" button and the green/orange highlighting — confirm it still ships in this form in July 2026 before citing it.
8. **Cursor context meter presence**: check whether the context-used % indicator exists in current Cursor 3.x chat (forum threads report removal/relocation across releases) before citing it as a live convention.

## MISSED BY THE GUIDE

1. **Per-statement corroboration coloring (Gemini double-check)** — green/corroborated, orange/contradicted-or-missing, unhighlighted/not-evaluable, applied *after* generation on demand. The direct shipped baseline for the guide's "needs-source" thesis, at claim granularity rather than section granularity. [Google support](https://support.google.com/gemini/answer/14143489).
2. **Absence-of-provenance as a signal**: ChatGPT's rule that *no Sources button = answered from memory* makes "this answer has no sources" a legible state — the guide has no pattern for unsourced answers. [Typescape](https://typescape.ai/blog/chatgpt-citations-explained/).
3. **Source triage as an input surface**: NotebookLM Deep Research returns cited *and uncited* candidate sources with select/deselect-to-import — the source list is a working surface for curating the next iteration, not just a provenance record. [XDA](https://www.xda-developers.com/making-most-deep-research-notebooklm/).
4. **Citation-surface plurality (Google AI Mode, May 2026)**: five distinct provenance surfaces from one citation — inline links, hover previews, topic cards, discussion previews, subscription labels. Relevant to the guide's "provenance as a product surface" framing; it's now *surfaces*, plural. [brandcited.ai](https://www.brandcited.ai/blog/google-io-2026-ai-mode-brand-citations).
5. **Change provenance by agent**: Cursor 3's unified diff color-codes which agent produced each change — provenance applied to *edits*, not just facts; a natural sibling pattern for the workbench's diff tab. [cursor.com/blog/cursor-3](https://cursor.com/blog/cursor-3).
6. **Deep-linked citations into owned documents**: NotebookLM's click-to-exact-passage is the strongest match for the demo's internal-doc URIs and is never mentioned; it also exposes the limits (vague highlights in long PDFs, no page numbers for formal citation). [FSU](https://servicecenter.fsu.edu/s/article/How-do-NotebookLM-s-inline-citations-work-and-why-are-they-important), [XDA limitations](https://www.xda-developers.com/notebooklm-limitations/).
7. **Session replay/rollback as provenance of *actions***: Manus sessions are replayable and rollback-able — an audit-trail surface the guide's workbench (which has Undo but no history scrubber) doesn't cover. [Manus blog](https://manus.im/blog/manus-browser-operator).
8. **Standardized artifact/status vocabulary from Linear AIG**: agent sessions expose pending / active / error / awaitingInput / complete / stale — a shipped, guideline-backed status taxonomy the guide's ad-hoc doc statuses (draft/reviewing/ready/blocked) could be compared against or aligned with. [Linear AIG](https://linear.app/developers/aig), [changelog 2025-07-30](https://linear.app/changelog/2025-07-30-agent-interaction-guidelines-and-sdk).
9. **Usage-abstraction spectrum**: tokens+dollars (Claude Code API) → context % (Cursor) → ACUs with per-session caps (Devin) → credits with dashboard-only history (Manus). The guide flattens this into one meter; the spectrum itself is the more defensible pattern. Sources under CONFIRMED 5 / CONTRADICTED 2.
10. **APG-correct pattern classification**: an interactive citation preview card is a non-modal dialog per WAI-ARIA APG, not a tooltip — the guide's engineering already complies; citing [the APG tooltip pattern's interactive-content caveat](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) turns an unstated judgment into a CITED claim for free.