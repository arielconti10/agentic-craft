import type { Metadata } from 'next'
import { TrustContent } from '@/views/trust-content'

export const metadata: Metadata = {
  title: 'Trust & Governance | Agentic Craft',
  description: 'Autonomy levels, consent flows, confidence display, kill switch, and audit trail patterns',
}

export default function TrustPage() {
  return <TrustContent />
}
