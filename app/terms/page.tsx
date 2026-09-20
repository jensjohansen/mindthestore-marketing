import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | MindTheStore.ai',
  description: 'Terms of Service for MindTheStore.ai.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <main className="legal-page">
      <div className="shell legal-shell">
        <p className="eyebrow">Draft — last updated 2026-09-20</p>
        <h1>Terms of Service</h1>

        <p>
          This is a draft placeholder. It is not yet reviewed by a lawyer and should not be relied on as final legal
          terms. It exists so customers have somewhere to click during onboarding while the real terms are written.
        </p>

        <h2>1. Who we are</h2>
        <p>
          MindTheStore.ai (&ldquo;MTS,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) provides AI-run operations services
          that help customers build and run online gigs, and that promote existing businesses, as described on this
          site.
        </p>

        <h2>2. What you&rsquo;re agreeing to</h2>
        <p>
          By signing up, submitting an intake form, or otherwise using MindTheStore.ai, you agree to these Terms and
          our <a href="/privacy">Privacy Policy</a>. If you don&rsquo;t agree, please don&rsquo;t use the service.
        </p>

        <h2>3. Your account and content</h2>
        <p>
          You own your gigs, domains, and content. MTS provides an operations service that builds and (optionally)
          runs them on your behalf. You are responsible for the accuracy of information you provide us (mission,
          vision, business details, and any access tokens you share).
        </p>

        <h2>4. Access tokens and third-party accounts</h2>
        <p>
          If you provide MTS a scoped access token (for example, a Vercel Access Token) to manage a domain or
          deployment on your behalf, you are responsible for scoping and expiring that token appropriately. MTS will
          use it only for the purposes you authorize.
        </p>

        <h2>5. Payments</h2>
        <p>
          Any build fees or subscriptions are billed as described on our <a href="/pricing">Pricing</a> page at the
          time of purchase. MTS is an operations service, not an employer — we do not send 1099s or 1098s to
          customers.
        </p>

        <h2>6. Changes</h2>
        <p>We may update these Terms as the product evolves. We&rsquo;ll post the updated version here.</p>

        <h2>7. Contact</h2>
        <p>
          Questions about these Terms? Email <a href="mailto:ops@mindthestore.ai">ops@mindthestore.ai</a>.
        </p>
      </div>
    </main>
  )
}
