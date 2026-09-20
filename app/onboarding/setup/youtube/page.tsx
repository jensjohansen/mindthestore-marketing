import type { Metadata } from 'next'
import { SetupStepLayout } from '@/components/onboarding/SetupStepLayout'
import { PopupWindowButton } from '@/components/onboarding/PopupWindowButton'

export const metadata: Metadata = {
  title: 'Create Your Gig YouTube Channel | MindTheStore.ai Setup',
  description: "Create a Google account and YouTube Brand Channel using this gig's domain email.",
  alternates: { canonical: '/onboarding/setup/youtube' },
}

export default function YoutubeSetupPage() {
  return (
    <SetupStepLayout
      stepId="youtube"
      eyebrow="Step 5 of 6 — repeat for every new gig"
      title="Create this gig's YouTube channel"
      subtitle="A Google account tied to this gig's own domain email, then a Brand Channel on top of it."
      left={
        <>
          <h3 className="setup-substep-heading">5a. Google account</h3>
          <p>Click <strong>Open Google sign-up</strong> and choose &ldquo;Use my current email address instead&rdquo; rather than creating a new Gmail address. Enter this gig&rsquo;s domain email from Step 4 (e.g. <code>ops@yourgig.com</code>).</p>

          <h3 className="setup-substep-heading">5b. YouTube Brand Channel</h3>
          <p>From that Google account, click <strong>Open YouTube</strong> and create a <strong>Brand Account</strong> named for your gig — not your personal channel. A Brand Account keeps the channel as its own entity, so it&rsquo;s transferable later if you ever sell the gig.</p>
          <div className="hiw-callout">
            <strong>Why a gig-specific Google account</strong>
            <p>Signing up with the gig&rsquo;s own domain email — not your personal Gmail — keeps ownership and management of the channel cleanly attached to that one gig.</p>
          </div>
        </>
      }
      right={
        <div className="setup-action-block">
          <PopupWindowButton href="https://accounts.google.com/signup" label="Open Google sign-up" windowName="mts-google-signup" />
          <PopupWindowButton href="https://www.youtube.com/account" label="Open YouTube" windowName="mts-youtube" />
        </div>
      }
    />
  )
}
