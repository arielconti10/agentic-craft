import type { Metadata } from 'next'
import { MemoryContent } from '@/pages/memory-content'

export const metadata: Metadata = {
  title: 'Memory & Knowledge | Agentic Craft',
  description: 'Memory panels, CRUD operations, auto-memory, context rings, and privacy controls',
}

export default function MemoryPage() {
  return <MemoryContent />
}
