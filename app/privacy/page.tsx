import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | MindTheStore.ai',
  description: 'Privacy Policy for MindTheStore.ai.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <div className="shell legal-shell">
        <p className="eyebrow">Draft — last updated 2026-09-20</p>
        <h1>Privacy Policy</h1>

        <p>
          This is a draft placeholder. It is not yet reviewed by a lawyer and should not be relied on as final legal
          terms. It exists so customers have somewhere to click during onboarding while the real policy is written.
        </p>

        <h2>1. What we collect</h2>
        <p>
          When you sign up or submit an intake form, we collect the information you provide directly: your email
          address, and — depending on which track you choose — your interests/skills/time/income goals (Free Niche),
          or your business name, mission, vision, existing site URL, and Vercel setup choice (Business Promotion). If
          you choose to keep your existing site, we also collect the scoped access token you create for us.
        </p>

        <h2>2. How we use it</h2>
        <p>
          We use this information to research and deliver the niche report or business promotion plan you requested,
          to build and run the resulting gig or promotion engine, to send you related emails (including a
          confirmation email when you sign up), and to provide customer support.
        </p>

        <h2>3. How we store it</h2>
        <p>
          Signups and intake submissions are stored in our database (Neon Postgres). Confirmation emails are sent via
          Resend. We don&rsquo;t sell your information.
        </p>

        <h2>4. Access tokens</h2>
        <p>
          If you provide a scoped access token (for example, a Vercel Access Token) for us to manage a domain or
          deployment, we store it in order to perform that specific task and use it only for the purpose you
          authorized.
        </p>

        <h2>5. Your choices</h2>
        <p>You can unsubscribe from emails at any time using the link in any email we send, or by contacting us.</p>

        <h2>6. Contact</h2>
        <p>
          Questions about this policy? Email <a href="mailto:ops@mindthestore.ai">ops@mindthestore.ai</a>.
        </p>
      </div>
    </main>
  )
}
