import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'You\u2019re all set | MindTheStore.ai Business Promotion',
  description: 'Your Business Promotion subscription is active.',
  alternates: { canonical: '/business-promotion/checkout-complete' },
}

export default function BusinessPromotionCheckoutCompletePage() {
  return (
    <main className="setup-page">
      <section className="setup-hero shell">
        <p className="eyebrow">Business Promotion setup</p>
        <h1>You&rsquo;re all set.</h1>
        <p className="lede">
          Your subscription is active. We&rsquo;ll be in touch as we start your first content and marketing cycle.
        </p>
        <Link href="/" className="btn-primary-link">Back to MindTheStore.ai →</Link>
      </section>
    </main>
  )
}
