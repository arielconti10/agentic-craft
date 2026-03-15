import type { Metadata } from 'next'
import { MultiAgentContent } from '@/pages/multi-agent-content'

export const metadata: Metadata = {
  title: 'Multi-Agent | Agentic Craft',
  description: 'Agent cards, handoff flows, parallel agents, routing, and agent communication patterns',
}

export default function MultiAgentPage() {
  return <MultiAgentContent />
}
