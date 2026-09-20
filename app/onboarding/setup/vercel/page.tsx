import type { Metadata } from 'next'
import { SetupStepLayout } from '@/components/onboarding/SetupStepLayout'
import { PopupWindowButton } from '@/components/onboarding/PopupWindowButton'

export const metadata: Metadata = {
  title: 'Create Your Vercel Account | MindTheStore.ai Setup',
  description: 'Create the Vercel account that will host your gig site.',
  alternates: { canonical: '/onboarding/setup/vercel' },
}

export default function VercelSetupPage() {
  return (
    <SetupStepLayout
      stepId="vercel"
      eyebrow="Step 2 of 6 — one-time, shared across all your gigs"
      title="Create your Vercel account"
      subtitle="Vercel hosts your gig's website and manages its domain."
      left={
        <>
          <p>Click <strong>Open Vercel sign-up</strong> on the right. It opens in its own movable window so you can keep these instructions visible while you fill in the form.</p>
          <ol className="setup-steps">
            <li>Sign up with the personal email you used for MTS (not a gig-specific email — this account is shared across every gig you launch).</li>
            <li>Choose the free &ldquo;Hobby&rdquo; plan to start — you can upgrade per-project later if a gig needs it.</li>
            <li>If you already created a Vercel account for an earlier gig, just close the popup and click Next — you&rsquo;ll reuse that same account for this gig too.</li>
          </ol>
          <div className="hiw-callout">
            <strong>Why one shared account</strong>
            <p>Vercel supports many separate projects and domains under one account, so there&rsquo;s no benefit to a second account per gig — it would just be one more login to manage.</p>
          </div>
        </>
      }
      right={<PopupWindowButton href="https://vercel.com/signup" label="Open Vercel sign-up" windowName="mts-vercel-signup" />}
    />
  )
}
