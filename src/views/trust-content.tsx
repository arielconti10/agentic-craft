"use client"

import { SettingsAutonomySection } from "./trust/settings-autonomy-section"
import { ModeTogglesSection } from "./trust/mode-toggles-section"
import { ContextScopeSection } from "./trust/context-scope-section"
import { ConsentFlowSection } from "./trust/consent-flow-section"
import { ConfidenceDisplaySection } from "./trust/confidence-display-section"
import { KillSwitchSection } from "./trust/kill-switch-section"
import { CostTransparencySection } from "./trust/cost-transparency-section"
import { DataProvenanceSection } from "./trust/data-provenance-section"
import { AuditTrailSection } from "./trust/audit-trail-section"

export function TrustContent() {
  return (
    <article>
      <header className="mb-20">
        <p className="section-label mb-4">Patterns</p>
        <h1 className="font-serif text-4xl leading-[1.15] font-light tracking-tight">
          Trust &amp; Control Plane
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
          Autonomy governance, operational configuration, transparency, and
          guardrail patterns that establish and maintain user trust in agentic
          experiences.
        </p>
      </header>

      <SettingsAutonomySection />
      <ModeTogglesSection />
      <ContextScopeSection />
      <ConsentFlowSection />
      <ConfidenceDisplaySection />
      <KillSwitchSection />
      <CostTransparencySection />
      <DataProvenanceSection />
      <AuditTrailSection />
    </article>
  )
}
