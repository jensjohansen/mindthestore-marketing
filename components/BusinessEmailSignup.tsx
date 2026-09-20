'use client'

import { FormEvent, useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

/**
 * Email capture for the Business Promotion track (PRD §3.4.1, Track B).
 * Reuses the existing /api/subscribe endpoint (Resend Audience + confirmation
 * email). The confirmation email carries an opaque verification token
 * (lib/verificationToken.ts) linking to /business-promotion/vercel, so the
 * customer's email address is never exposed in a clickable link. The
 * customer must open that email to continue — this component does not
 * advance them automatically.
 */
export function BusinessEmailSignup() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

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

      if (res.ok && data.ok) {
        setStatus('success')
        return
      }

      if (data.error === 'invalid_email') {
        setErrorMessage('That email address looks off — please double-check it.')
      } else if (data.error === 'not_configured') {
        setErrorMessage("Sign-ups aren't live yet — check back shortly.")
      } else {
        setErrorMessage('Something went wrong on our end. Please try again in a minute.')
      }
      setStatus('error')
    } catch {
      setErrorMessage('Something went wrong on our end. Please try again in a minute.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="form-success" role="status">
        Check your inbox — we&rsquo;ve sent a link to continue setting up your business.
      </p>
    )
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
      <p className="form-note">We&rsquo;ll email you a link to continue.</p>
    </form>
  )
}
