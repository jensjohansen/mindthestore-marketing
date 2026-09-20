import type { Metadata } from 'next'
import Link from 'next/link'
import { VercelChoiceToggle } from '@/components/onboarding/VercelChoiceToggle'
import { resolveVerificationToken } from '@/lib/verificationToken'

export const metadata: Metadata = {
  title: 'Set Up Vercel | MindTheStore.ai Business Promotion',
  description: 'Choose whether MTS builds a new site on Vercel, or manages your existing site with a scoped access token.',
  alternates: { canonical: '/business-promotion/vercel' },
}

export default async function BusinessPromotionVercelPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = typeof searchParams.token === 'string' ? searchParams.token : ''
  const resolved = token ? await resolveVerificationToken(token) : null

  if (!resolved) {
    return (
      <main className="setup-page">
        <section className="setup-hero shell">
          <p className="eyebrow">Business Promotion setup</p>
          <h1>This link has expired</h1>
          <p className="lede">Please sign up again to get a fresh confirmation link.</p>
          <Link href="/business-promotion" className="btn-primary-link">Back to Business Promotion →</Link>
        </section>
      </main>
    )
  }

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
          <VercelChoiceToggle token={token} />
        </div>
      </section>
    </main>
  )
}
