import type { Metadata } from 'next'
import Link from 'next/link'
import { EmailSignup } from '@/components/EmailSignup'

export const metadata: Metadata = {
  title: 'Start Free | MindTheStore.ai',
  description: 'Get one free, focused niche idea by email. No credit card, no long form. Just your email and a practical starting point.',
  alternates: { canonical: '/signup' },
  openGraph: {
    title: 'Start Free | MindTheStore.ai',
    description: 'Get one free niche idea by email. No payment required.',
    url: 'https://mindthestore.ai/signup',
  },
}

export default function SignupPage() {
  return <section className="signup-page"><div className="signup-backdrop" aria-hidden="true" /><div className="signup-card"><p className="eyebrow">Freemium entry</p><h1>One small idea<br />can be enough.</h1><p>Tell us where to send your free, focused starting point. No credit card. No long form. Just an email.</p><EmailSignup source="signup" /><div className="signup-divider" /><p className="signup-alt">Already know you need more support? <Link href="/pricing">View pricing</Link></p></div></section>
}
