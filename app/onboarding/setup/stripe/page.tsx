import type { Metadata } from 'next'
import { SetupStepLayout } from '@/components/onboarding/SetupStepLayout'
import { StripeConnectButton } from '@/components/onboarding/StripeConnectButton'

export const metadata: Metadata = {
  title: 'Connect Stripe | MindTheStore.ai Setup',
  description: 'Connect or create your Stripe account so your gig can receive payouts.',
  alternates: { canonical: '/onboarding/setup/stripe' },
}

export default function StripeSetupPage() {
  return (
    <SetupStepLayout
      stepId="stripe"
      eyebrow="Step 1 of 6 — one-time, shared across all your gigs"
      title="Create or share your Stripe Connect account"
      subtitle="So your gig can get you paid."
      left={
        <>
          <p>Stripe is how your gig collects payments from customers and how affiliate commissions get paid out to you. This is a one-time step — every gig you launch afterward reuses the same Stripe account.</p>
          <p>Click <strong>Connect with Stripe</strong> on the right. A separate window opens where you can:</p>
          <ol className="setup-steps">
            <li>Sign in with an existing Stripe account, if you already have one — nothing changes about it.</li>
            <li>Or create a brand-new Stripe account, right there in Stripe&rsquo;s own screens.</li>
          </ol>
          <p>Either way, we only ever store your Stripe <strong>Account ID</strong> (looks like <code>acct_xxxxxxxxxx</code>) — never a password, never a card number, never an API key for your account. Payouts always go to that ID, so no one can quietly redirect your money by editing an email address on file.</p>
          <div className="hiw-callout">
            <strong>Why this matters</strong>
            <p>You keep full control of your Stripe account and can move funds to your own bank at any time. We never hold your money — Stripe pays you directly.</p>
          </div>
        </>
      }
      right={<StripeConnectButton />}
    />
  )
}
