'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'

type Status = 'idle' | 'loading' | 'success-queued' | 'success-manual' | 'error'

type BusinessIntakeFormProps = {
  prefillEmail: string
  vercelChoice: 'new' | 'token'
  token: string
}

const VERCEL_CHOICE_LABEL: Record<'new' | 'token', string> = {
  new: 'Build a new site on Vercel',
  token: 'Keep my existing site (scoped Vercel token)',
}

export function BusinessIntakeForm({ prefillEmail, vercelChoice, token }: BusinessIntakeFormProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    setStatus('loading')
    try {
      const res = await fetch('/api/business-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.get('email'),
          optIn: data.get('optIn') === 'on',
          businessName: data.get('businessName'),
          mission: data.get('mission'),
          vision: data.get('vision'),
          existingSiteUrl: data.get('existingSiteUrl'),
          vercelChoice,
          funnelOrigin: 'business-promotion',
        }),
      })
      const result = await res.json().catch(() => ({}))

      if (res.ok && result.ok && result.mode === 'queued') {
        setStatus('success-queued')
        return
      }
      if (res.ok && result.ok && result.mode === 'manual') {
        setStatus('success-manual')
        return
      }

      if (result.error === 'opt_in_required') {
        setErrorMessage('Please check the box to confirm you want to work with us.')
      } else if (result.error === 'invalid_email') {
        setErrorMessage('That email address looks off — please double-check it.')
      } else if (result.error === 'missing_fields') {
        setErrorMessage('Please fill in your business name, mission, and vision so we know what we\u2019re promoting.')
      } else {
        setErrorMessage('Something went wrong on our end. Please try again in a minute.')
      }
      setStatus('error')
    } catch {
      setErrorMessage('Something went wrong on our end. Please try again in a minute.')
      setStatus('error')
    }
  }

  if (status === 'success-queued') {
    return (
      <p className="form-success" role="status">
        Got it. Your business profile is saved — we&rsquo;ll be in touch about your first content and marketing cycle.
      </p>
    )
  }

  if (status === 'success-manual') {
    return (
      <p className="form-success" role="status">
        Got it. We&rsquo;ve saved your answers — a person on our team will follow up to kick off your first content and marketing cycle.
      </p>
    )
  }

  return (
    <form className="niche-form" onSubmit={submit}>
      <label htmlFor="biz-intake-email">Your email address</label>
      <input id="biz-intake-email" name="email" type="email" autoComplete="email" defaultValue={prefillEmail} placeholder="you@example.com" required disabled={status === 'loading'} />

      <label htmlFor="biz-intake-name">Business name</label>
      <input id="biz-intake-name" name="businessName" type="text" placeholder="e.g. MindTheStore.ai" required disabled={status === 'loading'} />

      <label htmlFor="biz-intake-site">Existing marketing site URL (leave blank if none)</label>
      <input id="biz-intake-site" name="existingSiteUrl" type="text" placeholder="https://yourbusiness.com" disabled={status === 'loading'} />

      <label htmlFor="biz-intake-mission">What is your business&rsquo;s mission?</label>
      <textarea id="biz-intake-mission" name="mission" rows={2} placeholder="What you do and who you do it for, in a sentence or two" required disabled={status === 'loading'} />

      <label htmlFor="biz-intake-vision">What is your business&rsquo;s vision?</label>
      <textarea id="biz-intake-vision" name="vision" rows={2} placeholder="Where you're trying to take this business" required disabled={status === 'loading'} />

      <div className="setup-status setup-status-ok" style={{ marginBottom: '18px' }}>
        Vercel plan: <strong>{VERCEL_CHOICE_LABEL[vercelChoice]}</strong>.{' '}
        <Link href={`/business-promotion/vercel?token=${encodeURIComponent(token)}`}>Change →</Link>
      </div>

      <label className="niche-optin">
        <input type="checkbox" name="optIn" required disabled={status === 'loading'} />
        I&rsquo;d like MTS to start promoting my business and to receive occasional emails from MindTheStore.ai. I can unsubscribe anytime.
      </label>

      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending…' : 'Complete my business intake'} <span aria-hidden="true">→</span>
      </button>

      {status === 'error' && <p className="form-error" role="alert">{errorMessage}</p>}
    </form>
  )
}
