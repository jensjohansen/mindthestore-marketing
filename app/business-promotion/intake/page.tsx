import type { Metadata } from 'next'
import Link from 'next/link'
import { BusinessIntakeForm } from '@/components/BusinessIntakeForm'
import { resolveVerificationToken } from '@/lib/verificationToken'

export const metadata: Metadata = {
  title: 'Business Intake | MindTheStore.ai Business Promotion',
  description: 'Tell us your mission, vision, and existing site so MTS can start promoting your business.',
  alternates: { canonical: '/business-promotion/intake' },
}

export default async function BusinessPromotionIntakePage({
  searchParams,
}: {
  searchParams: { token?: string; vercelChoice?: string }
}) {
  const token = typeof searchParams.token === 'string' ? searchParams.token : ''
  const resolved = token ? await resolveVerificationToken(token) : null
  const vercelChoice = searchParams.vercelChoice === 'token' ? 'token' : 'new'

  if (!resolved) {
    return (
      <main className="niche-page">
        <div className="shell niche-grid">
          <div className="niche-intro">
            <p className="eyebrow">Business Promotion setup</p>
            <h1>This link has expired</h1>
            <p className="lede">Please sign up again to get a fresh confirmation link.</p>
            <Link href="/business-promotion" className="btn-primary-link">Back to Business Promotion →</Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="niche-page">
      <div className="shell niche-grid">
        <div className="niche-intro">
          <p className="eyebrow">Step 2 of 2 — Business Promotion setup</p>
          <h1>Tell us about<br />your business.</h1>
          <p className="lede">
            Mission, vision, and your existing site (if any). This is what MTS&rsquo;s content, CRO, and
            marketing agents use as the brand context for everything they produce.
          </p>
        </div>
        <div className="niche-card">
          <BusinessIntakeForm prefillEmail={resolved.email} vercelChoice={vercelChoice} token={token} />
        </div>
      </div>
    </main>
  )
}
