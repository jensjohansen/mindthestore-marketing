import type { Metadata } from 'next'
import { VercelChoiceToggle } from '@/components/onboarding/VercelChoiceToggle'

export const metadata: Metadata = {
  title: 'Set Up Vercel | MindTheStore.ai Business Promotion',
  description: 'Choose whether MTS builds a new site on Vercel, or manages your existing site with a scoped access token.',
  alternates: { canonical: '/business-promotion/vercel' },
}

export default function BusinessPromotionVercelPage({ searchParams }: { searchParams: { email?: string } }) {
  const email = typeof searchParams.email === 'string' ? searchParams.email : ''

  return (
    <main className="setup-page">
      <section className="setup-hero shell">
        <p className="eyebrow">Step 1 of 2 — Business Promotion setup</p>
        <h1>How should we handle hosting?</h1>
        <p className="lede">
          Every gig needs somewhere to live on Vercel — either a brand-new site MTS builds for you, or your
          existing site with a scoped token so MTS can manage a domain and deployment without ever seeing your
          Vercel password.
        </p>
      </section>

      <section className="setup-grid shell">
        <div className="setup-left">
          <p>Pick whichever matches your situation. You can change this later — nothing is final yet.</p>
        </div>
        <div className="setup-right">
          <VercelChoiceToggle email={email} />
        </div>
      </section>
    </main>
  )
}
