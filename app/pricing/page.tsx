import type { Metadata } from 'next'
import { PricingTable } from '@/components/PricingTable'

export const metadata: Metadata = {
  title: 'Pricing | MindTheStore.ai',
  description: 'Start free with one niche idea. Add niches for $20-$50, build a gig for $100, or let AI operate your business for $99/month.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Pricing | MindTheStore.ai',
    description: 'Start free with one niche idea. Add niches, build a gig, or let AI operate your business.',
    url: 'https://mindthestore.ai/pricing',
  },
}

export default function PricingPage() {
  return <section className="pricing-page"><div className="shell"><p className="eyebrow">Pricing built for a sensible start</p><h1>Support that grows<br />only when <em>you</em> do.</h1><p className="lede pricing-lede">Start with one clear idea at no cost. Move forward only when the next layer of support is useful.</p><PricingTable /><div className="pricing-note"><span aria-hidden="true">✦</span><p><strong>No surprise charges.</strong> Freemium is an email-only entry point. You will always know what your next step costs before you take it.</p></div></div></section>
}
