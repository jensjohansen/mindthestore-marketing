import type { Metadata } from 'next'
import { BusinessIntakeForm } from '@/components/BusinessIntakeForm'

export const metadata: Metadata = {
  title: 'Business Intake | MindTheStore.ai Business Promotion',
  description: 'Tell us your mission, vision, and existing site so MTS can start promoting your business.',
  alternates: { canonical: '/business-promotion/intake' },
}

export default function BusinessPromotionIntakePage({
  searchParams,
}: {
  searchParams: { email?: string; vercelChoice?: string }
}) {
  const prefillEmail = typeof searchParams.email === 'string' ? searchParams.email : ''
  const vercelChoice = searchParams.vercelChoice === 'token' ? 'token' : 'new'

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
          <BusinessIntakeForm prefillEmail={prefillEmail} vercelChoice={vercelChoice} />
        </div>
      </div>
    </main>
  )
}
