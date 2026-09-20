import type { Metadata } from 'next'
import { SetupStepLayout } from '@/components/onboarding/SetupStepLayout'
import { PopupWindowButton } from '@/components/onboarding/PopupWindowButton'

export const metadata: Metadata = {
  title: 'Create Your Gig Social Accounts | MindTheStore.ai Setup',
  description: "Create this gig's X, Facebook, and Instagram accounts.",
  alternates: { canonical: '/onboarding/setup/social' },
}

export default function SocialSetupPage() {
  return (
    <SetupStepLayout
      stepId="social"
      eyebrow="Step 6 of 6 — repeat for every new gig"
      title="Create this gig's social accounts"
      subtitle="Sign up for each using this gig's domain email — not your personal one."
      left={
        <>
          <p>Open each service below in its own window and sign up with this gig&rsquo;s domain email from Step 4 (e.g. <code>ops@yourgig.com</code>):</p>
          <ul className="setup-steps">
            <li><strong>X (Twitter)</strong> — a fresh account for this gig.</li>
            <li><strong>Facebook</strong> — create a Page for the gig, not a personal profile.</li>
            <li><strong>Instagram</strong> — a fresh account for this gig.</li>
          </ul>
          <div className="hiw-callout">
            <strong>Once these exist</strong>
            <p>Tell us in your onboarding session and we take it from there — building your site, publishing your first 10 articles, generating your launch videos, and cross-posting to the accounts you just set up.</p>
          </div>
        </>
      }
      right={
        <div className="setup-action-block">
          <PopupWindowButton href="https://x.com/i/flow/signup" label="Open X sign-up" windowName="mts-x-signup" />
          <PopupWindowButton href="https://www.facebook.com/pages/create" label="Open Facebook Page setup" windowName="mts-facebook-signup" />
          <PopupWindowButton href="https://www.instagram.com/accounts/emailsignup/" label="Open Instagram sign-up" windowName="mts-instagram-signup" />
        </div>
      }
    />
  )
}
