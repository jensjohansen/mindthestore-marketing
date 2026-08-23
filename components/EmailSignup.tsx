'use client'

import { FormEvent, useState } from 'react'

type EmailSignupProps = {
  source?: string
  compact?: boolean
}

export function EmailSignup({ source = 'MindTheStore.ai', compact = false }: EmailSignupProps) {
  const [submitted, setSubmitted] = useState(false)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return <p className="form-success" role="status">You&apos;re on the list. Check your inbox for your next step.</p>
  }

  return (
    <form className={compact ? 'email-form compact' : 'email-form'} onSubmit={submit}>
      <input type="hidden" name="funnel_origin" value={source} />
      <label htmlFor={`email-${source}`}>Your email address</label>
      <div className="email-controls">
        <input id={`email-${source}`} name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        <button type="submit">Start free <span aria-hidden="true">→</span></button>
      </div>
      <p className="form-note">One practical idea by email. No payment details required.</p>
    </form>
  )
}
