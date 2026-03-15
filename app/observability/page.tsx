import type { Metadata } from 'next'
import { ObservabilityContent } from '@/pages/observability-content'

export const metadata: Metadata = {
  title: 'Observability | Agentic Craft',
  description: 'Activity timelines, token usage, session timelines, and error log patterns',
}

export default function ObservabilityPage() {
  return <ObservabilityContent />
}
