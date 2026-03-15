import type { Metadata } from 'next'
import { ConversationContent } from '@/pages/conversation-content'

export const metadata: Metadata = {
  title: 'Conversation | Agentic Craft',
  description: 'Messages, citations, thinking blocks, and composer patterns for agentic conversation interfaces',
}

export default function ConversationPage() {
  return <ConversationContent />
}
