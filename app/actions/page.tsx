import type { Metadata } from 'next'
import { ActionsContent } from '@/views/actions-content'

export const metadata: Metadata = {
  title: 'Agent Actions | Agentic Craft',
  description: 'Tool calls, subagent cards, parallel execution, plan cards, and decision patterns',
}

export default function ActionsPage() {
  return <ActionsContent />
}
