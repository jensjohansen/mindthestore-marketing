import type { Metadata } from 'next'
import { SetupStepLayout } from '@/components/onboarding/SetupStepLayout'
import { PopupWindowButton } from '@/components/onboarding/PopupWindowButton'

export const metadata: Metadata = {
  title: 'Register Your Gig Domain | MindTheStore.ai Setup',
  description: "Register this gig's own domain through Vercel.",
  alternates: { canonical: '/onboarding/setup/domain' },
}

export default function DomainSetupPage() {
  return (
    <SetupStepLayout
      stepId="domain"
      eyebrow="Step 3 of 6 — repeat for every new gig"
      title="Register this gig's domain"
      subtitle="Each gig is its own brand, so it needs its own domain — done through the Vercel account from Step 2."
      left={
        <>
          <p>Click <strong>Open Vercel domains</strong> on the right, then:</p>
          <ol className="setup-steps">
            <li>Search for a domain that matches your gig&rsquo;s name or niche.</li>
            <li>Choose a <code>.site</code> or <code>.website</code> ending — both are inexpensive to register and renew through Vercel, and either reads fine to visitors. Pick whichever sounds better for your gig.</li>
            <li>Complete the purchase — Vercel registers and manages DNS for it automatically, so there&rsquo;s no separate registrar login to keep track of.</li>
          </ol>
          <div className="hiw-callout">
            <strong>Why not a shared domain</strong>
            <p>Keeping each gig on its own domain means one gig&rsquo;s reputation — good or bad — never spills over onto your others, and you can hand off or sell a single gig later without untangling it from the rest.</p>
          </div>
        </>
      }
      right={<PopupWindowButton href="https://vercel.com/domains" label="Open Vercel domains" windowName="mts-vercel-domains" />}
    />
  )
}
