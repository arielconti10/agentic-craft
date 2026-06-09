import registry from "../../registry.json"

/* Spec text for template "Pattern Pieces" tables. Local registry items use
   their registry.json description so the table stays in sync with the actual
   source of truth. Pieces that are stock shadcn/ui primitives (not published
   in this registry) get a short factual description instead. */

const registryDescriptions = new Map<string, string>(
  registry.items.map((item) => [item.title, item.description])
)

const stockPieceDescriptions: Record<string, string> = {
  Alert: "Stock shadcn/ui alert used for blocking states and warning callouts.",
  Badge: "Stock shadcn/ui badge used for status, scope, and state labels.",
  Field:
    "Stock shadcn/ui field wrapper pairing a label, control, and description.",
  "Input Group":
    "Stock shadcn/ui input group for inputs with inline addons and actions.",
  Switch: "Stock shadcn/ui switch used for boolean policy toggles.",
  "Toggle Group":
    "Stock shadcn/ui toggle group for selecting one option from a small set.",
}

export function pieceSpec(piece: string): string {
  return (
    registryDescriptions.get(piece) ??
    stockPieceDescriptions[piece] ??
    `Compose ${piece} into the workflow without hard-coding the whole page as one component.`
  )
}
