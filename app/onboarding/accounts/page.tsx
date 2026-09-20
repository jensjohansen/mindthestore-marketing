import type { Metadata } from 'next'
import Link from 'next/link'
import { ChecklistItem } from './ChecklistItem'

export const metadata: Metadata = {
  title: 'Set Up Your Gig Accounts | MindTheStore.ai',
  description: 'The exact account setup checklist for launching a gig — domain, email, YouTube, and social — one step at a time.',
  alternates: { canonical: '/onboarding/accounts' },
  openGraph: {
    title: 'Set Up Your Gig Accounts | MindTheStore.ai',
    description: 'Step-by-step account setup for your new gig: domain, email, YouTube, and social — done once, correctly.',
    url: 'https://mindthestore.ai/onboarding/accounts',
  },
}

export default function OnboardingAccountsPage() {
  return (
    <main className="hiw-page">

      <section className="hiw-hero shell">
        <p className="eyebrow">Gig setup, step by step</p>
        <h1>Set up your gig&rsquo;s accounts</h1>
        <p className="lede">A few accounts have to exist before we can build and run your gig. Some you only do once, ever. Some you do for every gig you launch. Check items off as you go — your progress is saved on this device.</p>
        <p><Link href="/onboarding/setup/stripe" className="btn-primary-link">Walk me through it step by step →</Link></p>
      </section>

      <section className="hiw-section shell">
        <div className="hiw-number">01</div>
        <div className="hiw-body">
          <h2>One-time accounts (shared across all your gigs)</h2>
          <p>These two accounts belong to you personally. You set them up once, and every gig you launch afterward reuses them — no need to repeat this step for a second or third gig.</p>
          <ol className="checklist-list">
            <ChecklistItem id="stripe-account" title="Create or connect your Stripe account">
              <p>Stripe processes any payments your gig collects (courses, digital products, memberships) and pays affiliate commissions out to you. One Stripe account covers every gig you run — Stripe supports multiple businesses under a single login.</p>
              <p><Link href="/onboarding/setup/stripe">Guided setup with connect button →</Link></p>
            </ChecklistItem>
            <ChecklistItem id="vercel-account" title="Create your Vercel account">
              <p>Vercel hosts your gig&rsquo;s website and registers its domain. Sign up with the personal email you used for MTS. If you already did this for an earlier gig, skip ahead — you&rsquo;ll reuse that same account.</p>
              <p><Link href="/onboarding/setup/vercel">Guided setup →</Link></p>
            </ChecklistItem>
          </ol>
        </div>
      </section>

      <section className="hiw-section shell hiw-alt">
        <div className="hiw-number">02</div>
        <div className="hiw-body">
          <h2>Per-gig accounts (repeat for every new gig)</h2>
          <p>Each gig is its own brand with its own domain, so each gig needs its own email and its own social accounts. This keeps one gig&rsquo;s reputation — good or bad — from affecting any of your others.</p>
          <ol className="checklist-list">
            <ChecklistItem id="domain-registered" title="Register this gig's domain">
              <p>Done as part of site setup, through your Vercel account from Step 1. Confirm the domain is showing as active in your Vercel dashboard before continuing.</p>
              <p><Link href="/onboarding/setup/domain">Guided setup →</Link></p>
            </ChecklistItem>
            <ChecklistItem id="improvmx-inbound" title="Set up inbound email forwarding (ImprovMX, free)">
              <p>ImprovMX forwards mail sent to your gig&rsquo;s domain (e.g. <code>ops@yourgig.com</code>) into your personal inbox, free, so you never miss a customer or affiliate email.</p>
              <p><Link href="/onboarding/setup/email">Guided setup (ImprovMX + Resend) →</Link></p>
            </ChecklistItem>
            <ChecklistItem id="resend-account" title="Create a Resend account for this gig">
              <p>Resend is this gig&rsquo;s own outbound email service — it sends your newsletter and confirmation emails, and keeps one gig&rsquo;s sending reputation isolated from your others. Verify your gig&rsquo;s domain in Resend and save the API key; we&rsquo;ll need it to turn on sign-ups.</p>
              <p><Link href="/onboarding/setup/email">Guided setup (ImprovMX + Resend) →</Link></p>
            </ChecklistItem>
            <ChecklistItem id="gmail-send-as" title="Set up 'send mail as' your gig domain">
              <p>Once your Resend domain is verified, Resend gives you free SMTP credentials. Add those in Gmail under Settings → Accounts → &ldquo;Send mail as&rdquo;, so replies to forwarded mail go out as <code>ops@yourgig.com</code> instead of your personal address.</p>
            </ChecklistItem>
            <ChecklistItem id="google-account-domain" title="Create a Google Account using this gig's email">
              <p>At the Google sign-up screen, choose &ldquo;Use my current email address&rdquo; instead of creating a new Gmail address, and enter your gig&rsquo;s domain email (e.g. <code>ops@yourgig.com</code>). This becomes the login for your gig&rsquo;s YouTube channel.</p>
              <p><Link href="/onboarding/setup/youtube">Guided setup (Google + YouTube) →</Link></p>
            </ChecklistItem>
            <ChecklistItem id="youtube-brand-channel" title="Create the YouTube Brand Channel">
              <p>From the Google Account you just made, create a YouTube Brand Account named for your gig. This keeps the channel as its own entity, transferable later if you ever sell the gig.</p>
              <p><Link href="/onboarding/setup/youtube">Guided setup (Google + YouTube) →</Link></p>
            </ChecklistItem>
            <ChecklistItem id="social-x" title="Create the gig's X (Twitter) account">
              <p>Sign up using this gig&rsquo;s domain email, not your personal one.</p>
              <p><Link href="/onboarding/setup/social">Guided setup (X, Facebook, Instagram) →</Link></p>
            </ChecklistItem>
            <ChecklistItem id="social-facebook" title="Create the gig's Facebook Page">
              <p>A Facebook Page (not a personal profile) for the gig, using the gig&rsquo;s domain email for the account that manages it.</p>
              <p><Link href="/onboarding/setup/social">Guided setup (X, Facebook, Instagram) →</Link></p>
            </ChecklistItem>
            <ChecklistItem id="social-instagram" title="Create the gig's Instagram account">
              <p>Sign up using this gig&rsquo;s domain email, not your personal one.</p>
              <p><Link href="/onboarding/setup/social">Guided setup (X, Facebook, Instagram) →</Link></p>
            </ChecklistItem>
          </ol>
        </div>
      </section>

      <section className="hiw-section shell">
        <div className="hiw-number">03</div>
        <div className="hiw-body">
          <h2>What happens after this checklist</h2>
          <p>Once these accounts exist, tell us in your onboarding session and we take it from there — building your site, publishing your first 10 articles, generating your launch videos, and cross-posting to the social accounts you just set up.</p>
        </div>
      </section>

      <section className="hiw-cta shell">
        <h2>Questions about any step?</h2>
        <p>None of this needs to be perfect on the first try. If a step doesn&rsquo;t make sense, reply to any MTS email and we&rsquo;ll walk you through it.</p>
        <div className="hiw-cta-buttons">
          <Link href="/how-it-works" className="btn-secondary-link">Back to how it works →</Link>
        </div>
      </section>

    </main>
  )
}
