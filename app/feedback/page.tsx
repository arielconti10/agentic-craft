import type { Metadata } from 'next'
import { FeedbackContent } from '@/views/feedback-content'

export const metadata: Metadata = {
  title: 'Feedback | Agentic Craft',
  description: 'Thumbs feedback, inline correction, rating scales, and behavioral consequence patterns',
}

export default function FeedbackPage() {
  return <FeedbackContent />
}
