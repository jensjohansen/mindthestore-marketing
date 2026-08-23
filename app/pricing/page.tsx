import type { Metadata } from 'next'
import { PricingTable } from '@/components/PricingTable'

export const metadata: Metadata = {
  title: 'Pricing | MindTheStore.ai',
  description: 'Start free with one niche idea. Launch your first gig for $97/month. Go for the $100/day income goal with three gigs for $197/month.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Pricing | MindTheStore.ai',
    description: 'Start free, then $97/month for one gig or $197/month for three. You keep the site if you cancel.',
    url: 'https://mindthestore.ai/pricing',
  },
}

export default function PricingPage() {
  return (
    <section className="pricing-page">
      <div className="shell">
        <p className="eyebrow">Three tiers. No surprise charges.</p>
        <h1>Start free.<br />Grow only when <em>you</em> do.</h1>
        <p className="lede pricing-lede">The free niche report shows you the opportunity. The monthly plans build and operate the business. Cancel any time — you keep everything we built.</p>
        <PricingTable />
        <div className="pricing-note">
          <span aria-hidden="true">✦</span>
          <p><strong>The tax reality, stated plainly.</strong> Side income gets taxed — federal, self-employment, and state. To keep $100/day, most people need to earn $200–$280/day gross. Triple Gig is priced and structured to reach that target with three separate income streams, not one fragile one. <a href="/how-it-works">See how the math works →</a></p>
        </div>
      </div>
    </section>
  )
}
