# Thread Page Design Audit

Date: 2026-06-16
Surface: `http://localhost:3001/thread`
Mode: combined UX, visual, and accessibility audit

## Evidence

1. `01-first-viewport.png` - desktop first viewport, completed state.
2. `02-installation-section.png` - desktop viewport with installation visible.
3. `03-replay-streaming.png` - desktop replay/streaming state.
4. `04-mobile-full-page.png` - mobile full page at 390 x 844.

## Audit Scope

This audit covers the Thread pattern page as a shadcn-style reference page: first impression, demo legibility, installation placement, interaction states, responsive behavior, and screenshot-visible accessibility risks.

User goal: quickly understand what the Thread pattern does, trust that it is a serious agent UI artifact, and copy the install command.

Accessibility target: readable structure, keyboard-operable controls, visible focus/target sizing, clear state labels, and resilient responsive layout. Screenshot evidence cannot prove full keyboard or screen reader behavior.

## Step List

1. Desktop first viewport - Healthy, but slightly too dense.
   The page communicates the pattern immediately. The title, description, replay button, live demo, and install block are all visible. The risk is that the first viewport now contains two framed surfaces plus page header, which makes the page feel more like a showcase board than a docs article.

2. Desktop installation section - Healthy.
   Moving installation below the preview is the right call. The block now reads like shadcn docs: package-manager tabs, command, copy button. The command is no longer competing with the Thread preview.

3. Replay / streaming state - Strong.
   The streaming state is visibly different without being noisy. The status line, running tool call, expanded search result, and "streaming" badge explain the component better than the completed state alone.

4. Mobile full page - Needs polish before launch.
   The page remains usable, but the top demo is cramped: the user message disappears, several text rows truncate, the bottom-left app mark overlaps the assistant answer, and the install command requires horizontal scroll with no obvious scroll affordance.

## Strengths

- The main demo is now the first meaningful artifact. That matches the reference-guide direction and shadcn docs pattern: preview first, install second.
- The component scenario is credible. "Billing migration review" is concrete enough to imply real agent work without over-explaining.
- The streaming replay is the best state of the page. It gives the component motion and product meaning: status, tool work, partial answer, and final state.
- The install block is structurally close to shadcn's own command block: package-manager tabs, shell command, copy action, restrained border.
- Desktop visual tone is disciplined. The page is monochrome, quiet, and infrastructure-coded rather than marketing-coded.

## UX Risks

1. First viewport density weakens hierarchy.
   The demo card, install card, header, and replay button all fit at once on desktop. That sounds efficient, but it reduces drama. The Thread preview should feel like the hero artifact; installation should feel adjacent but secondary.

2. The preview is too "resolved" by default.
   In the completed state, the top status reads "Ready for review" and the answer is already done. The more persuasive state is the replay/streaming state, where the user can see the unique Thread behavior. The default load should bias toward an in-progress moment or trigger the replay once.

3. The left run packet is helpful but visually competes with Thread.
   On desktop the left sidebar takes substantial attention. It gives context, but it is not the registry component. It should be treated as demo chrome, visually quieter than the Thread surface.

4. The install section lacks a tiny bridge sentence.
   shadcn docs can get away with a bare "Installation" heading because the ecosystem is known. Here, one short line like "Add the styled Thread and optional markdown renderer." would clarify why this command exists without becoming marketing copy.

5. Mobile truncation hides meaning.
   On mobile, "PR #1284 · api/billing · 3 touche..." and "Cache warmup covered, duplicate mutation gu..." make the demo feel squeezed. The mobile layout should select fewer metadata fields rather than truncating many of them.

## Accessibility Risks

1. Mobile content is partly obscured by the bottom-left app mark.
   In the mobile screenshot, the mark overlaps the assistant answer text. This is a concrete readability issue and likely a pointer/focus risk if it floats above content.

2. Install command overflow is not obvious enough on mobile.
   Code overflow is acceptable, but the current mobile screenshot shows a clipped command with no visible scroll cue. Users may think the command is cut off rather than horizontally scrollable.

3. Several controls have small visible hit areas.
   The package-manager tabs and copy button may be expanded invisibly by `data-compact-touch`, but visually they still look small. For a launch page, perceived tappability matters as much as the computed target.

4. Text contrast is mostly restrained but may be low in secondary metadata.
   The page uses a lot of muted text on a near-black surface. This looks tasteful, but the smallest metadata labels should be contrast-checked before launch.

5. Screenshot evidence cannot verify keyboard flow.
   Tabs, copy button, replay, and tool-call toggles need keyboard checks: tab order, focus ring visibility, Enter/Space activation, and state announcement.

## Opportunity Areas

1. Make the first viewport a "component preview", not a whole docs page.
   Keep the Thread card first, but lower the install block slightly or reduce its vertical presence so the demo owns the page.

2. Default to a live moment.
   Consider starting in the streaming state after a brief delay, or loop the replay once per session. This is the strongest proof of the component.

3. Quiet the demo sidebar.
   Reduce opacity/contrast in the left run packet, or collapse it on narrower desktop widths sooner. The Thread content should be the primary object.

4. Add a short usage spine below installation.
   After install, add compact sections for Slots, Streaming, Tool calls, and Scroll anchoring. The current page proves the demo, but not yet the API.

5. Improve mobile by editing content, not only CSS.
   Use shorter mobile labels and fewer side facts. The best mobile page would show the Thread behavior clearly, not every desktop metadata detail.

## Recommendations

1. Set the default demo state to streaming or auto-replay once per session.
2. On mobile, hide the floating app mark inside this page or reserve safe padding so it cannot overlap the answer.
3. Shorten mobile metadata: keep `Billing migration review`, `4.2s`, and one status chip; drop or wrap the rest.
4. Add a one-line install description under `Installation`.
5. Add a subtle horizontal-scroll hint to the command block on mobile, or split the command into an input-like row with copy as the primary action.
6. Run a keyboard pass on replay, package tabs, copy, and tool-call toggles before launch.

## Evidence Limits

This audit is based on screenshots, DOM observations, and visible interaction states captured from the live local page. It does not prove full screen reader output, reduced-motion behavior, actual clipboard success in every browser, or cross-browser rendering.
