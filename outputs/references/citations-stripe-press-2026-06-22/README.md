# Stripe Press Citation Preview Reference

Source: <https://www.stripe.press/poor-charlies-almanack/chapter-one?progress=5.88%25>

Captured: 2026-06-22

Use this as visual reference for Agentic Craft citation and source-preview
work. These screenshots are source material for design study only; do not ship
them as product assets.

## Files

- `stripe-press-poor-charlies-almanack-citation-save-fig2.png` - full-page
  context showing a highlighted cited phrase, inline citation marker, and a
  large source preview card.
- `stripe-press-poor-charlies-almanack-citation-save-fig3.png` - tighter
  context showing the preview anchored near a citation marker over body text.

## Interaction Notes

- The citation is tied to a highlighted claim in the text, not only to a tiny
  superscript. The preview feels attached to the cited phrase.
- The preview card is large enough to show the cited artifact as an artifact:
  header, divider, figure label, source title, and substantial visual preview.
- The card can overlap the reading column. This works because the source
  relationship is obvious and temporary; it does not try to reserve layout
  space.
- The header uses a compact saved-state affordance (`SAVE [*]`) rather than a
  generic button row.
- The preview styling borrows from the source material: paper texture, muted
  tint, monospaced metadata, dotted rule, and restrained rounded corners.
- The inline highlight and preview surface share a visual language, making the
  source relationship legible before reading the popover content.
- For Agentic Craft, the useful pattern is citation-local provenance: hover or
  focus opens a nearby, artifact-rich preview anchored to the exact claim.

## Design Takeaways

- Anchor the preview at the citation marker, but visually include the claim
  span when the source supports a phrase rather than a whole paragraph.
- Prefer an artifact preview over a generic source card when the cited material
  is visual, tabular, document-like, or otherwise inspectable.
- Keep metadata compact and highly structured: saved state, source number,
  title, location, and action.
- Let source type influence the preview treatment while keeping registry code
  theme-safe.
- The component should still handle viewport clipping, keyboard focus, Escape,
  outside tap, and touch dismissal.
