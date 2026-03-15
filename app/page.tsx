import type { Metadata } from 'next'
import { DemoContent } from '@/views/demo-content'

export const metadata: Metadata = {
  title: 'Agentic Craft',
  description: 'Interactive design system for agentic AI interfaces',
}

export default function HomePage() {
  return <DemoContent />
}
