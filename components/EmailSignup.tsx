'use client'

import { FormEvent, useState } from 'react'

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
    const email = (new FormData(form).get('email') as string) || ''

    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, funnel_origin: source }),
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok && data.ok) {
        setStatus('success')
        return
      }

      if (data.error === 'not_configured') {
        setErrorMessage("Sign-ups aren't live yet — check back shortly.")
      } else if (data.error === 'invalid_email') {
        setErrorMessage('That email address looks off — please double-check it.')
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
      {status === 'error' && <p className="form-error" role="alert">{errorMessage}</p>}
      <p className="form-note">One practical idea by email. No payment details required.</p>
    </form>
  )
}
