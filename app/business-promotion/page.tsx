import type { Metadata } from 'next'
import Link from 'next/link'
import { BusinessEmailSignup } from '@/components/BusinessEmailSignup'

export const metadata: Metadata = {
  title: 'Promote Your Existing Business | MindTheStore.ai',
  description:
    'Already running a business? MindTheStore.ai runs the content, marketing, and cross-posting engine around it — no site rebuild required.',
  alternates: { canonical: '/business-promotion' },
  openGraph: {
    title: 'Promote Your Existing Business | MindTheStore.ai',
    description: 'Keep your site and brand. Let MTS run the micro-influencer promotion engine around it.',
    url: 'https://mindthestore.ai/business-promotion',
  },
}

export default function BusinessPromotionPage() {
  return (
    <section className="signup-page">
      <div className="signup-backdrop" aria-hidden="true" />
      <div className="signup-card">
        <p className="eyebrow">Already have a business?</p>
        <h1>We&rsquo;ll run the<br />promotion engine.</h1>
        <p>
          You keep your site and your brand. MindTheStore.ai&rsquo;s AI agents handle content generation,
          conversion-rate optimization, and cross-posting across YouTube, TikTok, Instagram, and more —
          the same micro-influencer engine we built for our own gigs, aimed at your existing business instead.
        </p>
        <BusinessEmailSignup />
        <div className="signup-divider" />
        <p className="signup-alt">
          Starting from scratch instead? <Link href="/signup">Get a free niche idea</Link>
        </p>
      </div>
    </section>
  )
}
