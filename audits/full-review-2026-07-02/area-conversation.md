# INVENTORY

## Patterns asserted

Scope: `src/views/conversation/messages-progress-section.tsx`, `citations-section.tsx`, `composer-section.tsx`, assembled by `src/views/conversation-content.tsx`.

| # | Pattern / section | Core claim | Prescription |
|---|---|---|---|
| 1 | **Messages & Prose** (`#messages`) | Three message types — user, agent, system — form the backbone of agent conversation, and agent messages need a clear "ownership surface." | Right-align user bubbles (max `min(75%,58ch)`), left-align bordered agent bubbles (max 65ch), center system chips; signal authorship via alignment + sender role + surface + citations + tool state, never via font family alone; make prose typography a user/workspace preference (serif / sans / compact). |
| 2 | **Prose typography spec** (sub-pattern of 1) | Agent prose has a correct typographic range. | 14–16px text, 22–26px line height, 0 letter spacing, optical sizing only when the font supports it, `-webkit-font-smoothing: antialiased`, 16px paragraph spacing, `var(--foreground)` color. |
| 3 | **Streaming message** (sub-pattern of 1) | Mid-stream output should show an explicit caret that disappears when streaming ends. | Inline block caret (`h-4 w-0.5`) at the stream head; auto-hide (demo hides after 3s timer). |
| 4 | **Progress Steps / Observable work** (`#progress-steps`) | Progress UI should disclose *observable work* (operations, sources, status) rather than expose hidden reasoning. | Three states: collapsed one-liner with live status; expanded step list with per-step source, meta, and expandable detail; completed state that collapses to a duration summary ("Completed 4 source checks in 4.2s") plus prose result. Do/don't: no private reasoning traces or "speculative narration," no stale spinners, pending steps visible but de-emphasized, user can collapse anytime, steps with nothing to reveal must not look expandable. |
| 5 | **Citations** (`#citations`) | Verification should never leave the sentence — the source preview anchors at the citation marker itself. | Inline numbered token opens a preview card on hover, keyboard focus, or tap; card contains title, quoted excerpt, location chip, view-source affordance, and pagination across sources; anchored with a caret arrow, flipping sides at viewport edges; Escape/outside-tap dismisses; a "source strip" chip row below the prose is the readable fallback and opens the same preview. |
| 6 | **Composer** (`#composer`) | "A composer is not just a chat box" — it is where the user reviews context, edits intent, and commits the next agent action. | Four-region anatomy: context islands (connected 95%-width stack above the input for plan/reply/scope), quiet auto-growing primary input, low-contrast action chrome (menu, context-budget ring, send), suggestion row outside the input. Four trust checks (visible scope, explicit next commitment, provisional suggestions, reversible additions). Rules: separate authored text from proposed context; expose what will be sent before commit; keep generated affordances reversible. |
| 7 | **Composer payload-vs-context rule** (sub-pattern of 6) | What is part of the *message payload* lives inside the composer card; what *conditions the run* lives above it. | Attachments render inside the card ("files belong to the message being drafted"); plan, scope, and reply-to render as connected islands above; scope and reply-to are mutually exclusive — enabling one dismisses the other. |
| 8 | **Composer micro-spec** (sub-pattern of 6) | Precise interaction specs make the composer feel trustworthy. | Textarea auto-expand min 36px / max 160px, "14px PP Neue Montreal"; send button 32×32 hit area with 24px inner icon, spring press `cubic-bezier(0.34, 1.56, 0.64, 1)` with arrow flyout; suggestion chips fill the textarea on click with a confirmation flash (never auto-send); context-budget ring ("21k / 75k tokens"). |

**Code-backed vs prose-only** (`src/components/ui/`):

- **Backed by real components:** Progress steps → `observable-work.tsx` (semantic `<details>/<summary>`, non-expandable-step rule enforced in code) + `status-indicator.tsx` (shape-per-state, sr-only labels — "never color alone" implemented). Citations → `source-preview.tsx` (Base UI popover; hover `delay=300`, `:focus-visible`-only keyboard open, Escape/outside dismiss, collision flipping, pagination, and a genuinely sophisticated return-focus guard). Composer → `composer.tsx`, `composer-islands.tsx` (`w-[95%]` confirmed), `composer-toolbar.tsx` (`size-8`/`size-6` send confirmed), `composer-suggestions.tsx` (flash confirmed), `composer.css` (`cubic-bezier(0.34,1.56,0.64,1)` confirmed), `composer-attachments.tsx`, `file-lifecycle.tsx`, driven by `src/components/InteractiveComposer.tsx` (scope/reply mutual exclusion implemented there, in demo logic only).
- **Prose-only / demo-only:** message-type taxonomy and ownership-signal list; the typography spec table (partially backed by `.agent-prose` in `src/index.css`: 16px serif, `opsz 12`, antialiased — the 14–16px/22–26px *range* is asserted); streaming caret (a `setTimeout` demo, no real streaming); "Do/Don't" tables; the italic guidance blocks.
- **Spec/code mismatches found:** composer table says textarea "min 36px" but `composer-input.tsx` has `min-h-8` (32px); table says "14px PP Neue Montreal" but code is `text-base md:text-sm` (16px mobile / 14px desktop) — and PP Neue Montreal is the reference site's own brand font (`--font-neue-montreal` in `src/index.css`) presented as if it were part of a general spec.

## Evidence status per claim

Zero product names and zero external references appear anywhere in the three conversation files (grep for ChatGPT/Claude/Cursor/Perplexity/Copilot/Devin/NN-g/WCAG/HIG etc. returns nothing; other areas of the site do name products, e.g. `views/trust/cost-transparency-section.tsx` uses `claude-opus-4-6`). Verdicts:

| Claim | Status | Notes |
|---|---|---|
| Three message types (user/agent/system) as backbone | **ASSERTED** | Conventional and true-ish, but no product named. |
| Ownership signals list; "don't rely on font family alone" | **ASSERTED** | Reads like an accessibility argument (WCAG 1.4.1-adjacent) but cites nothing. |
| Prose typography spec table (ranges, antialiasing, paragraph spacing) | **ASSERTED** | Numbers are the author's own site CSS generalized into a "spec." |
| Prose style as a user/workspace preference | **ASSERTED** | Testable against real products; none named. |
| Streaming caret that hides on completion | **ASSERTED** | Demo-only implementation. |
| Progress steps disclose observable work, not hidden reasoning | **ASSERTED** | This is a strong normative position with no grounding — and it is contestable (see staleness). |
| Collapse completed work to a duration summary | **ASSERTED** | Matches real behavior (ChatGPT deep research, Perplexity Pro) but never says so. |
| "No stale spinners / pending de-emphasized / user can collapse anytime" | **ASSERTED** | Plausible craft rules, invented. |
| Citation preview anchored at the marker; "verification never leaves the sentence" | **ASSERTED** | Closest real analogue (NotebookLM / Perplexity hover cards) never named. |
| Preview card contents + pagination across sources in one card | **ASSERTED** | Pagination-in-card is an invention; unverified against any product. |
| Source strip as readable fallback opening the same preview | **ASSERTED** | Real products' source rows mostly link out instead. |
| "A composer is not just a chat box" + 4-region anatomy | **ASSERTED** | |
| Islands-above / attachments-inside payload rule | **ASSERTED** | Original design opinion; diverges from mainstream (most products put reply-quotes and context pills *inside* the composer frame). |
| Scope/reply mutual exclusivity | **ASSERTED** | Invented interaction rule; no rationale given. |
| Suggestions fill (never send) with flash confirm | **ASSERTED** | Directly contradicts several real products that send on suggestion click. |
| Context-budget ring in composer chrome | **ASSERTED** | Analogue exists (Cursor context %, Claude Code context indicator) but unnamed. |
| Composer micro-spec numbers | **ASSERTED** (and partly self-inconsistent) | 36px-vs-32px and font-size mismatches noted above. |

**PRODUCT-GROUNDED: 0. CITED: 0. ASSERTED: all (~17).** The entire area is first-principles prose plus working demos.

## Verification list

1. **Prose typography as user preference.** Products: Claude.ai (Settings → Appearance has font choices incl. dyslexia-friendly), ChatGPT (no prose font setting), Perplexity, Notion AI. Look at: whether any top product offers serif/sans/compact reader modes for agent output, or whether serif-vs-sans is a fixed brand choice (Claude serif-ish, ChatGPT sans). The "workspace admin" framing needs at least one enterprise example or should be softened.
2. **Agent messages in bordered bubbles.** ChatGPT, Claude, Gemini all render agent turns as full-width unboxed prose; only user turns get bubbles. The demo's bordered agent bubble is a minority pattern — check whether the guide means to prescribe it or just illustrate ownership.
3. **Progress steps: collapsed → expanded → completed-with-duration.** Products: ChatGPT deep research activity panel, Perplexity Pro search steps, Claude research mode, Cursor agent tool timeline, Manus/Devin step lists. Look at: whether completed work auto-collapses, whether duration is shown ("Thought for 2m 14s" style), whether per-step sources are listed.
4. **"Never reveal reasoning" stance.** Products: ChatGPT (o-series/GPT-5 show summarized chain-of-thought), Claude (extended thinking visible and expandable), Gemini (thinking panel). Look at: all three now *do* show (summarized) reasoning traces users can expand — the guide's hard "don't" needs reconciling with mainstream practice or reframing as "summarized, auditable narration only."
5. **Citation marker → anchored hover preview.** Products: NotebookLM (inline chips → source passage card — closest match), Perplexity (numbered markers → hover card), ChatGPT search (pill → sources sidebar), Claude with web search. Look at: anchor position (at marker vs side panel), open triggers (hover/focus/tap), whether keyboard focus opens the card, and whether any product paginates *all* sources inside one citation's card (likely none — this is the guide's invention and should be flagged as such or defended).
6. **Source strip behavior.** Perplexity's source row and ChatGPT's Sources list: do entries open previews in place (guide's claim) or navigate out? Likely refutes the "same anchored preview" spec.
7. **Islands above the composer vs chips inside.** Products: ChatGPT (attachments, quoted reply, and canvas/plan chips are *inside* the composer frame), Claude (content chips inside), Cursor (@-context pills inside), Slack/Linear reply affordances. Look at: whether any real product uses a connected above-the-card island stack; if none, this is a proposal and should be labeled as one.
8. **Suggestion chips: fill vs send.** ChatGPT starter prompts and Gemini suggestion chips (send immediately) vs products that fill the input. This is a falsifiable divergence — verify at least two products each way before publishing "never impersonate user text."
9. **Context/token budget in composer chrome.** Cursor (context window %), Claude Code (context remaining), ChatGPT (none user-facing). Look at: whether exposing raw token counts ("21k / 75k") matches any shipped consumer UI or is a pro-tool-only pattern.
10. **Streaming cursor shape.** ChatGPT uses a filled circle; check Claude/Gemini caret styles before implying a block caret is standard.

## Staleness risks

- **The anti-reasoning-trace stance (biggest risk).** Written Mar–Jun 2026, when every major lab had already shipped visible summarized thinking (OpenAI, Anthropic extended thinking, Gemini). "Do not reveal private reasoning traces" reads as pre-2025 orthodoxy unless carefully scoped to *raw* traces vs summarized ones — the text's "speculative internal narration" phrasing gestures at this but never makes the distinction explicit.
- **Context-budget figure "21k / 75k tokens."** Window sizes and whether products expose them at all churn quickly; the number will date the page. Frame as a placeholder.
- **Composer anatomy omits 2026-standard chrome:** model/mode pickers, voice input, and agent/autonomy toggles are absent from the "4 regions"; a reader comparing against current ChatGPT/Cursor composers will notice the gap.
- **"PP Neue Montreal" in a spec table** ties a general recommendation to the author's own brand font, and it half-contradicts the code (`text-base md:text-sm`, `min-h-8`). Any code/spec drift is an easy credibility hit for a craft guide.
- **Citation pagination-in-card** may be quietly obsoleted or validated by NotebookLM/Perplexity updates after mid-2026 — check current behavior before publishing.

## Quality read

This is better than pattern-catalog filler: the composer section carries a genuinely original, defensible thesis — the payload-vs-context rule (attachments live *inside* the card because they ship with the message; plan/scope/reply live in a connected island stack *above* it because they condition the run), enforced with unusual precision by real, well-crafted components (the Base UI focus-return guard in `source-preview.tsx` alone signals serious implementation depth). The weakness is uniform: not one claim in the whole area names a product or a source, so the strong opinions (islands-above, fill-don't-send suggestions, no-reasoning-traces) are indistinguishable from the safe ones, and the reasoning-trace prescription is arguably already wrong for 2026. Strongest single idea: the payload/context separation rule — it is specific, testable, and no mainstream product states it as a principle.

# PRODUCT CHECK

# Fact-check: "Conversation" area claims vs. real agentic products (July 2026)

Method note: evidence gathered via web search July 2026. Confidence marked where sources are secondary. All URLs verified live at search time.

## CONFIRMED

**1. Prose typography as a user preference (claim 1/verif. 1) — CONFIRMED for user-level, NOT for workspace-level.**
- Claude.ai / Claude Desktop — Settings → Appearance → "Chat font" with options **Default / Match System / Dyslexic Friendly**. Source: https://support.claude.com/en/articles/8887527-customizing-your-appearance-settings (help center, current July 2026); corroborated by https://github.com/anthropics/claude-code/issues/40469 (Claude Desktop, 2026).
- Caveat for the author: Claude's options are accessibility-framed (dyslexic-friendly), not the guide's aesthetic serif/sans/compact triad. ChatGPT has **no** native prose font/typography setting — the gap is filled by Chrome extensions (StylerGPT, FontGPT: https://stylergpt.com/blog/custom-fonts-vs-default-fonts-in-chatgpt), and a May 2026 macOS-app font-size complaint confirms limited native control (https://community.openai.com/t/increasing-font-size-of-chatgpt-app-1-2026-118-on-macos-doesnt-work/1380703). **No evidence found for any workspace/admin-controlled prose preference in any panel product — soften that framing.**

**2. Progress UI: collapsed live status → expandable step list with per-step sources (claim 4/verif. 3) — CONFIRMED as mainstream.**
- ChatGPT deep research — side panel with live progress; user toggles between **source list** and an **activity log** ("I'm gathering a range of sources…" → source examined → brief summary → next). Sources: https://openai.com/index/introducing-deep-research/ ; https://help.openai.com/en/articles/10500283-deep-research-in-chatgpt (current 2026).
- Perplexity Pro Search — visible plan; steps executed sequentially with "Searching for…" status; Perplexity's own case study states users wait longer when intermediate progress is displayed. Sources: https://www.perplexity.ai/hub/blog/pro-search-upgraded-for-more-advanced-problem-solving ; https://www.langchain.com/breakoutagents/perplexity
- Devin integrates a live to-do plan directly into its UI; Manus tracks via a `todo.md` checklist surfaced to the user. Source: https://impa.ventures/writings/comparing-manus-and-devin ; https://gist.github.com/renschni/4fbc70b31bad8dd57f3370239dccd58f
- Linear AIG formalizes this as **Agent Session + Agent Activity** primitives (states: pending/active/error/awaitingInput/complete/stale) — an industry-published framework the guide should cite. https://linear.app/developers/aig ; changelog July 30 2025: https://linear.app/changelog/2025-07-30-agent-interaction-guidelines-and-sdk

**3. Duration label on completed reasoning (claim 4, "Completed … in 4.2s") — CONFIRMED as an existing convention, with churn.**
- ChatGPT — reasoning surfaced as a **collapsible thinking block** users could expand (o3/o4-mini era), and GPT-5.5 still shows a "Thinking trace" at Medium/High effort. Sources: https://www.inkeybit.com/blog/openai-reasoning-models-guide ; https://help.openai.com/en/articles/11909943-gpt-55-in-chatgpt (2026). Exact current "Thought for Xs" wording: verify hands-on (see below).
- Claude.ai — "Thinking…" box above the response, clickable to expand. https://support.claude.com/en/articles/10574485-using-extended-thinking

**4. Citation marker → anchored preview at the marker (claim 5/verif. 5) — CONFIRMED as a real pattern (NotebookLM is the strongest match).**
- NotebookLM — inline numbered chips ("little numbers in grey ovals"); **hover previews the quoted text**; click opens the source at that passage with the location highlighted in the source panel. Sources: https://servicecenter.fsu.edu/s/article/How-do-NotebookLM-s-inline-citations-work-and-why-are-they-important ; https://www.datacamp.com/tutorial/notebooklm
- ChatGPT search — inline citations: **hover "to learn more," click to see the source** (desktop web); separate Sources button opens a sidebar with title/domain/snippet. https://help.openai.com/en/articles/9237897-chatgpt-search (current 2026)
- Perplexity — numbered inline citations; hover/click/expanded views; layered "quick verification vs. full inspection." https://www.shapeof.ai/patterns/citations (pattern survey naming Perplexity, Granola hover-transcript-peeks, Sana citation popovers) — general "hover for a short preview or click through" is documented across ~9 products.
- **Not confirmed anywhere: pagination across all sources inside one citation's card.** No product evidence found. Treat as the guide's invention and label it as a proposal.

**5. Context/token budget indicator in composer chrome (claims 6/8, verif. 9) — CONFIRMED, but pro-tool-only and volatile.**
- Cursor — percentage indicator in Composer ("72% context used"); hover reveals raw counts "45,000 / 200,000 tokens". Source: https://tokenlimits.app/blog/cursor-context-window (2026). **But**: forum reports the token-counter circle was removed in v2.2.44 with active "bring it back" requests (Dec 2025) — https://forum.cursor.com/t/bring-back-context-usage-indicator-token-counter-circle/147515 . The affordance churns; verify current Cursor 3 state hands-on.
- Claude Code — statusline "Context left until auto-compact: X%"; custom statuslines receive `context_window.remaining_percentage`. Sources: https://israynotarray.com/en/ai/2026/03/26/claude-code-status-line-setup-guide/ (Mar 2026); https://github.com/anthropics/claude-code/issues/44794
- ChatGPT — no user-facing token budget. The "21k / 75k" ring is a **pro-tool pattern**, absent from consumer chat; say so.

**6. Suggestion chips exist in both fill and send flavors — the send side is CONFIRMED (verif. 8).**
- ChatGPT custom-GPT **conversation starters send immediately on click** ("clickable buttons that initiate a chat"). Sources: https://zapier.com/blog/custom-chatgpt/ ; https://help.openai.com/en/articles/8554397-creating-and-editing-gpts
- Gemini — mixed: general suggestion chips "may ask for more info before sending"; **screen-action chips auto-submit** on tap. https://support.google.com/gemini/answer/15850607
- The guide's "fill, never send" rule therefore **contradicts the dominant ChatGPT behavior** — publishable only as an explicit counter-position, and I found no top product that fills-with-flash-confirm (see hands-on list).

**7. Payload-inside-composer half of the payload/context rule (claim 7) — CONFIRMED descriptively.**
- ChatGPT auto-converts long pastes (>10k chars) into an attachment **inside the composer** (https://community.openai.com/t/chatgpt-converts-pasted-text-to-file-attachment/1369430, 2026); Claude.ai does the same with pasted-content chips in the composer (https://greasyfork.org/en/scripts/567635-claude-chunked-paste-bypass-attachment-detection ; https://chromewebstore.google.com/detail/claude-paste-manager/aabkbdobijkibcebjjighiecihgcjpmc); Cursor renders @-context pills inside the input (community docs, widely documented). Attachments-in-the-card matches all mainstream products.

## CONTRADICTED / STALE

**1. "Do not reveal reasoning traces" (claim 4) — STALE AS WRITTEN; the biggest liability, as the inventory suspected.**
Every major lab ships user-expandable (summarized) reasoning in July 2026:
- ChatGPT: collapsible thinking block; GPT-5.5 shows a Thinking trace at Medium/High effort **and lets users steer while it thinks** ("you can add instructions while the model is still thinking"). https://help.openai.com/en/articles/11909943-gpt-55-in-chatgpt
- Claude.ai: expandable "Thinking…" block; **summarized by default since Opus 4.6/Sonnet 4.6**. https://support.claude.com/en/articles/10574485-using-extended-thinking ; https://platform.claude.com/docs/en/build-with-claude/extended-thinking
- Gemini: thought summaries visible in the app/API (`includeThoughts`). https://ai.google.dev/gemini-api/docs/thinking
- Linear AIG explicitly tells agent builders to expose "reasoning steps, tool usage, prompts for clarification" as activities. https://linear.app/developers/aig
The defensible 2026 version — which OpenAI itself states — is **raw vs. summarized**: raw CoT "should not be shown to the end user" but a reasoning summary can be (https://cookbook.openai.com/articles/gpt-oss/handle-raw-cot). Rewrite the do/don't as "summarized, auditable reasoning yes; raw traces no." Bonus nuance: visibility is now effort-dependent — ChatGPT's default Instant model often shows **no** thinking phase at all (default-model swap to GPT-5.5 Instant, May 5 2026: https://lumichats.com/blog/gpt-5-5-instant-chatgpt-new-default-what-changed-comparison-2026).

**2. Bordered agent bubbles (claim 1) — CONTRADICTED as a description of practice.**
ChatGPT, Claude.ai, and Cursor all render agent turns as **flat, full-width, unboxed markdown**; only user turns get a distinct right-aligned bubble. Bubbles-for-agent is explicitly called out as a "messenger" anti-signal for serious AI tools. Sources: https://www.setproduct.com/blog/ai-chat-interface-ui-design (2025–26 design survey naming all three); user request thread confirming ChatGPT lacks left/right bubbles: https://community.openai.com/t/request-app-make-the-chat-in-chatgpt-have-chat-bubbles-on-left-and-right/784057 . The guide should either present the bordered agent bubble as a deliberate minority choice (ownership surface argument) or align with full-width prose. The right-aligned user bubble half is fine.

**3. Source strip opens the same anchored preview (claim 5) — CONTRADICTED.**
- Perplexity's source row: clicking a source/"View More" opens a **sidebar list** or navigates to the cited webpage — not an anchored preview card. https://catalog.bensbites.com/tutorial/how-to-research-the-web-with-perplexity-ai ; https://airespo.com/resources/how-to-use-perplexity-ai-powered-search-for-beginners/
- ChatGPT's Sources button opens a **sidebar** (source name, title, domain, snippet) whose entries link out. https://help.openai.com/en/articles/9237897-chatgpt-search
Keep the same-preview strip as a proposal, not a description.

**4. Streaming caret as a thin block bar (claim 3) — CONTRADICTED as an implied standard.**
ChatGPT's stream head is a **filled circle** (evolved from a solid square). Sources: https://blog.scottlogic.com/2025/02/21/ais-biggest-flaw-the-blinking-cursor-problem.html ; https://github.com/cyfyifanchen/gpt-style-blink-cursor ; https://www.33rdsquare.com/users-reported-chatgpt-cursor-blinking-issue-heres-some-fixes/ . A `h-4 w-0.5` bar is a legitimate choice but not "the" pattern; and the demo's 3s-timer hide is scaffolding, not a spec.

**5. Islands-above-the-composer (claims 6–7) — no shipped analogue found; publish as an original proposal or it reads as false description.**
Mainstream placement is **inside the composer frame**: ChatGPT attachments/paste-chips in-frame, Claude content chips in-frame, Cursor @-pills in-frame (sources in CONFIRMED #7). I found no top product using a connected 95%-width island stack above the input card. (LibreChat — open-source, not panel-tier — puts removable quote chips "above the composer": https://github.com/danny-avila/LibreChat/pull/13868 , the closest real implementation found.) The inventory's read is right: this is the guide's strongest original idea, but it must be labeled as such.

**6. Composer 4-region anatomy omits 2026-standard chrome — STALE by omission.**
ChatGPT's model/effort picker now sits **directly in the message composer** on web (Instant/Medium/High tiers), agent mode is invoked from the composer's tools menu or `/agent`, and voice dictation shipped to all plans. Sources: https://releasebot.io/updates/openai/chatgpt (June 2026); https://help.openai.com/en/articles/11752874-chatgpt-agent . Cursor 3 (Apr 2, 2026) makes the composer target multiple environments (local/worktree/cloud/SSH): https://cursor.com/changelog/3-0 . An anatomy with no model picker, no mode/autonomy toggle, and no voice affordance will read as dated to anyone comparing against a live 2026 composer.

## NEEDS HANDS-ON

1. **ChatGPT "Thought for Xs" exact label + auto-collapse.** Open chatgpt.com, force GPT-5.5 Thinking (effort High), send a hard question; watch whether the thinking block auto-collapses on completion and whether the collapsed label shows a duration ("Thought for 2m 14s" style). Repeat with deep research: check whether the activity panel collapses to a summary line with duration when the report lands.
2. **Perplexity citation hover-card contents.** Run any Pro Search on perplexity.ai desktop; hover a numbered marker; record card contents (title? snippet/quote? favicon? location?) and whether **keyboard focus** (Tab to marker) opens it. Then click a chip in the top source row — preview in place or navigate out?
3. **NotebookLM current behavior + the pagination question.** In a notebook with 3+ sources, ask a question that cites multiple sources in one sentence; hover/click citations; confirm whether any single citation card lets you page across multiple sources (the guide's invention) or whether each marker maps to exactly one passage.
4. **Claude.ai and Gemini streaming cursor.** Start a response in each; screenshot the stream head. Is there any caret at all (Claude historically streams bare text), and what shape? Two minutes.
5. **Fill-don't-send exemplars.** The guide needs two real products that fill the input on suggestion click. Check: Claude.ai's starter/suggested prompts on the home screen; Cursor's suggested follow-ups; GitHub Copilot Chat's suggestion sparkles; Linear agent suggested replies. If none fill, the "never impersonate user text" rule stands purely on argument — say so in the text.
6. **Cursor 3 Agents Window composer + progress surface.** Cmd+Shift+P → Agents Window; start a run. Record: (a) whether a context-usage % still appears anywhere in the composer (it was removed in v2.2.44, Dec 2025); (b) how tool steps render (timeline? collapsible per-tool rows? durations?); (c) what chrome the composer carries (model picker, environment target, autonomy toggle).
7. **Codex desktop app conversation surface.** Open the Codex app (macOS); start a task; note how agent turns, tool activity, and diffs interleave in the thread, and whether completed work collapses with a duration. Docs to prime: https://developers.openai.com/codex/app
8. **Reply-quote placement in ChatGPT/Claude.** Select text in a prior message in each product; if a quote/"ask about this" affordance exists, note whether the resulting chip lands inside or above the composer frame — this directly tests the islands-above thesis against shipping UIs.
9. **Workspace-level typography control.** Check ChatGPT Enterprise and Claude Enterprise admin consoles for any appearance/typography policy. Expect none → soften the "workspace preference" clause to "user preference."

## MISSED BY THE GUIDE

1. **Steerable thinking / interruptible runs.** GPT-5.5 accepts added instructions *while the model is still thinking*; deep research lets users interrupt and refine focus mid-run. The guide's progress section treats disclosure as read-only; 2026 progress surfaces are **writable**. (https://help.openai.com/en/articles/11909943-gpt-55-in-chatgpt ; https://help.openai.com/en/articles/10500283-deep-research-in-chatgpt)
2. **Reasoning preambles.** GPT-5.5 opens reasoning with "a short preamble explaining what it plans to do" — sanctioned narration that sits exactly where the guide's "no speculative narration" rule forbids anything. Worth a nuanced paragraph. (same GPT-5.5 help URL)
3. **Linear's Agent Interaction Guidelines as citable prior art.** Published framework (July 30, 2025) covering agent identity ("never mistaken for a person" — directly supports the guide's ownership-surface claim), immediate unobtrusive feedback, and a six-state session lifecycle. The guide's zero-citation problem is cheapest to fix here. (https://linear.app/developers/aig)
4. **Session states beyond streaming.** pending / active / error / awaitingInput / complete / **stale** (Linear) and Codex/Cursor parallel-agent lists mean a "conversation" in 2026 is often one of N concurrent threads with lifecycle badges. The guide's single-thread frame misses agent tabs (Cursor 3 side-by-side/grid: https://cursor.com/changelog/3-0) and multi-window review queues (Codex app: https://developers.openai.com/codex/app).
5. **Paste-to-attachment thresholds as a payload-rule proof point.** ChatGPT's 10k-char auto-attachment and Claude's paste chips are shipped evidence *for* the guide's own attachments-are-payload argument — currently unused. (URLs in CONFIRMED #7)
6. **Document/report viewers for long agent prose.** ChatGPT deep research gained a fullscreen document viewer (Feb 11, 2026 — https://www.macrumors.com/2026/02/11/chatgpt-deep-research-mode-document-viewer/); long-form agent output increasingly escapes the message column entirely (artifacts/canvas). The Messages & Prose section caps prose at 65ch and never addresses the escape hatch.
7. **Accessibility precedent for the typography-preference claim.** Claude's Dyslexic Friendly font is the strongest real-world justification for prose-as-preference and reframes it from aesthetics to accessibility — a stronger argument than the guide currently makes. (https://support.claude.com/en/articles/8887527-customizing-your-appearance-settings)
8. **Plan-as-file vs plan-as-UI split.** Manus (todo.md as working memory) vs Devin (plan integrated in UI) is a live architectural fork in how "observable work" is surfaced — good comparative material for the progress section. (https://gist.github.com/renschni/4fbc70b31bad8dd57f3370239dccd58f ; https://impa.ventures/writings/comparing-manus-and-devin)

**Bottom line:** 7 claims confirmed (mostly the safe ones), 6 contradicted or stale — including the two the guide leans on hardest (no-reasoning-traces, bordered agent bubbles) — and the three genuinely original ideas (islands-above, fill-don't-send, pagination-in-card) have zero shipped analogues, so they must be explicitly labeled proposals, not patterns.