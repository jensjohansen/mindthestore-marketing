import type { Metadata } from 'next'
import { SetupStepLayout } from '@/components/onboarding/SetupStepLayout'
import { PopupWindowButton } from '@/components/onboarding/PopupWindowButton'

export const metadata: Metadata = {
  title: 'Set Up Gig Email | MindTheStore.ai Setup',
  description: 'Set up inbound forwarding and outbound sending for your gig domain.',
  alternates: { canonical: '/onboarding/setup/email' },
}

export default function EmailSetupPage() {
  return (
    <SetupStepLayout
      stepId="email"
      eyebrow="Step 4 of 6 — repeat for every new gig"
      title="Set up email for this gig's domain"
      subtitle="One free tool for receiving mail, one for sending it — each isolated to this gig."
      left={
        <>
          <h3 className="setup-substep-heading">4a. Inbound: ImprovMX (free)</h3>
          <p>ImprovMX forwards anything sent to <code>ops@yourgig.com</code> straight into your personal inbox, so you never miss a customer or affiliate email. Point it at the domain you registered in Step 3.</p>

          <h3 className="setup-substep-heading">4b. Outbound: Resend</h3>
          <p>Resend is this gig&rsquo;s own outbound sender — it sends your newsletter and confirmation emails. A separate Resend account per gig keeps one gig&rsquo;s sending reputation from affecting your others, and gives you headroom on your own plan if that gig suddenly goes viral.</p>
          <ol className="setup-steps">
            <li>Verify this gig&rsquo;s domain in Resend.</li>
            <li>Save the API key it gives you — we&rsquo;ll need it to turn on sign-ups for this gig.</li>
            <li>Once verified, Resend also gives you free SMTP credentials — add those in Gmail under Settings → Accounts → &ldquo;Send mail as&rdquo;, so replies you send go out as <code>ops@yourgig.com</code> instead of your personal address.</li>
          </ol>
        </>
      }
      right={
        <div className="setup-action-block">
          <PopupWindowButton href="https://improvmx.com" label="Open ImprovMX" windowName="mts-improvmx" />
          <PopupWindowButton href="https://resend.com/signup" label="Open Resend sign-up" windowName="mts-resend" />
        </div>
      }
    />
  )
}
