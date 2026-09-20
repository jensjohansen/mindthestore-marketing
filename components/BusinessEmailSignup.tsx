'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

type Status = 'idle' | 'loading' | 'error'

/**
 * Email capture for the Business Promotion track (PRD §3.4.1, Track B).
 * Reuses the existing /api/subscribe endpoint (Resend Audience + confirmation
 * email), but — unlike the Free Niche flow, which relies on the confirmation
 * email to carry the customer to the next step — this always advances the
 * customer to the Vercel setup step immediately, since RESEND_API_KEY isn't
 * provisioned yet and the confirmation email may not actually send. See
 * docs/mindthestore/mindthestore-onboarding-checklist.md, Track B, cross-cutting
 * prerequisites.
 */
export function BusinessEmailSignup() {
  const router = useRouter()
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [note, setNote] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const email = (new FormData(form).get('email') as string) || ''

    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, funnel_origin: 'business-promotion' }),
      })
      const data = await res.json().catch(() => ({}))

      if (data.error === 'invalid_email') {
        setErrorMessage('That email address looks off — please double-check it.')
        setStatus('error')
        return
      }

      if (!(res.ok && data.ok)) {
        setNote(
          data.error === 'not_configured'
            ? "Heads up: confirmation emails aren't live yet, so you won't get one — but you can keep going right now."
            : 'We could not send a confirmation email right now, but you can keep going.'
        )
      }

      router.push(`/business-promotion/vercel?email=${encodeURIComponent(email)}`)
    } catch {
      setErrorMessage('Something went wrong on our end. Please try again in a minute.')
      setStatus('error')
    }
  }

  return (
    <form className="email-form" onSubmit={submit}>
      <label htmlFor="biz-email">Your email address</label>
      <div className="email-controls">
        <input id="biz-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required disabled={status === 'loading'} />
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending…' : 'Get started'} <span aria-hidden="true">→</span>
        </button>
      </div>
      {status === 'error' && <p className="form-error" role="alert">{errorMessage}</p>}
      {note && <p className="form-note" role="status">{note}</p>}
      <p className="form-note">We&rsquo;ll use this to send you next-step instructions.</p>
    </form>
  )
}
