'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'

type EmailSignupProps = {
  source?: string
  compact?: boolean
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export function EmailSignup({ source = 'direct', compact = false }: EmailSignupProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const email = (data.get('email') as string) || ''
    const optIn = data.get('optIn') === 'on'

    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, funnel_origin: source, optIn }),
      })
      const result = await res.json().catch(() => ({}))

      if (res.ok && result.ok) {
        setStatus('success')
        return
      }

      if (result.error === 'not_configured') {
        setErrorMessage("Sign-ups aren't live yet — check back shortly.")
      } else if (result.error === 'invalid_email') {
        setErrorMessage('That email address looks off — please double-check it.')
      } else if (result.error === 'opt_in_required') {
        setErrorMessage('Please check the box to confirm you want to hear from us.')
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
    return <p className="form-success" role="status">You&apos;re on the list. Check your inbox for your next step.</p>
  }

  return (
    <form className={compact ? 'email-form compact' : 'email-form'} onSubmit={submit}>
      <label htmlFor={`email-${source}`}>Your email address</label>
      <div className="email-controls">
        <input id={`email-${source}`} name="email" type="email" autoComplete="email" placeholder="you@example.com" required disabled={status === 'loading'} />
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending…' : 'Start free'} <span aria-hidden="true">→</span>
        </button>
      </div>
      <label className="niche-optin">
        <input type="checkbox" name="optIn" required disabled={status === 'loading'} />
        I&rsquo;d like to receive my free niche idea and occasional emails from MindTheStore.ai. I can unsubscribe
        anytime. See our <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.
      </label>
      {status === 'error' && <p className="form-error" role="alert">{errorMessage}</p>}
      <p className="form-note">One practical idea by email. No payment details required.</p>
    </form>
  )
}
