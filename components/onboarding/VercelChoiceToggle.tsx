'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PopupWindowButton } from './PopupWindowButton'

type Choice = 'new' | 'token'

const TAB_CLASS = 'flex-1 rounded-md border px-4 py-3 text-sm font-bold transition-colors'
const TAB_ACTIVE = 'border-[var(--ink)] bg-[var(--ink)] text-white'
const TAB_INACTIVE = 'border-[var(--line)] bg-white text-[var(--ink)] hover:border-[var(--teal)]'

/**
 * Vercel setup choice for the Business Promotion track (PRD §3.4.1, Track B).
 * Unlike Track A's onboarding/setup/vercel (which always assumes a brand-new
 * gig site), a Business Promotion customer already has a site somewhere and
 * needs to choose: build a fresh site on Vercel, or keep the existing site
 * and hand MTS a scoped access token to manage a domain/deployment instead.
 */
export function VercelChoiceToggle({ token }: { token: string }) {
  const [choice, setChoice] = useState<Choice>('new')

  const continueHref = `/business-promotion/intake?token=${encodeURIComponent(token)}&vercelChoice=${choice}`

  return (
    <div className="setup-action-block">
      <div className="flex gap-3" role="tablist" aria-label="Vercel setup option">
        <button
          type="button"
          role="tab"
          aria-selected={choice === 'new'}
          className={`${TAB_CLASS} ${choice === 'new' ? TAB_ACTIVE : TAB_INACTIVE}`}
          onClick={() => setChoice('new')}
        >
          Build a new site on Vercel
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={choice === 'token'}
          className={`${TAB_CLASS} ${choice === 'token' ? TAB_ACTIVE : TAB_INACTIVE}`}
          onClick={() => setChoice('token')}
        >
          Keep my existing site
        </button>
      </div>

      {choice === 'new' ? (
        <div className="setup-status setup-status-ok">
          <p>Create a free Vercel account and MTS will deploy a new site on it for your business.</p>
          <PopupWindowButton href="https://vercel.com/signup" label="Open Vercel sign-up" windowName="mts-vercel-signup" />
        </div>
      ) : (
        <div className="setup-status setup-status-ok">
          <p>
            Keep your current site wherever it lives. Instead, create a Vercel <strong>Access Token</strong>{' '}
            scoped just for MTS to manage a domain and deployment on your behalf:
          </p>
          <ol className="setup-steps">
            <li>In Vercel, go to Account Settings → Tokens.</li>
            <li>Click Create Token, name it &ldquo;MindTheStore.ai&rdquo;, and set an expiration you&rsquo;re comfortable with.</li>
            <li>Copy the token — you&rsquo;ll share it with us in the next step. We never see your Vercel password.</li>
          </ol>
          <PopupWindowButton href="https://vercel.com/account/tokens" label="Open Vercel tokens page" windowName="mts-vercel-tokens" />
        </div>
      )}

      <p className="setup-fallback">
        Not sure which to pick? Choose &ldquo;Keep my existing site&rdquo; if you already have a marketing site you don&rsquo;t want to rebuild.
      </p>

      <Link href={continueHref} className="btn-primary-link">Continue to business intake →</Link>
    </div>
  )
}
