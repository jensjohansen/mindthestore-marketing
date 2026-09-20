'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'

type Status = 'idle' | 'loading' | 'success-queued' | 'success-manual' | 'error'

export function NicheQuestionnaireForm({ prefillEmail, funnelOrigin }: { prefillEmail: string; funnelOrigin: string }) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    setStatus('loading')
    try {
      const res = await fetch('/api/niche-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.get('email'),
          optIn: data.get('optIn') === 'on',
          interests: data.get('interests'),
          skills: data.get('skills'),
          timeAvailable: data.get('timeAvailable'),
          incomeGoal: data.get('incomeGoal'),
          funnelOrigin,
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
        setErrorMessage('Please check the box to confirm you want to receive emails from us.')
      } else if (result.error === 'invalid_email') {
        setErrorMessage('That email address looks off — please double-check it.')
      } else if (result.error === 'missing_fields') {
        setErrorMessage('Please fill in all four questions so we can research a real niche for you.')
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
        Got it. Your answers are queued for research — check your inbox within the next hour or so.
      </p>
    )
  }

  if (status === 'success-manual') {
    return (
      <p className="form-success" role="status">
        Got it. We&rsquo;ve saved your answers — a person on our team will finish researching your free niche and email it to you within one business day.
      </p>
    )
  }

  return (
    <form className="niche-form" onSubmit={submit}>
      <label htmlFor="niche-email">Your email address</label>
      <input id="niche-email" name="email" type="email" autoComplete="email" defaultValue={prefillEmail} placeholder="you@example.com" required disabled={status === 'loading'} />

      <label htmlFor="niche-interests">What are you interested in or curious about?</label>
      <textarea id="niche-interests" name="interests" rows={2} placeholder="e.g. gardening, personal finance, home organization" required disabled={status === 'loading'} />

      <label htmlFor="niche-skills">What skills or experience do you already have?</label>
      <textarea id="niche-skills" name="skills" rows={2} placeholder="e.g. 20 years as a teacher, good at writing, decent with a camera" required disabled={status === 'loading'} />

      <label htmlFor="niche-time">How much time can you give this each week?</label>
      <select id="niche-time" name="timeAvailable" required disabled={status === 'loading'} defaultValue="">
        <option value="" disabled>Choose one</option>
        <option value="1-3 hours/week">1–3 hours a week</option>
        <option value="4-8 hours/week">4–8 hours a week</option>
        <option value="9-15 hours/week">9–15 hours a week</option>
        <option value="16+ hours/week">16+ hours a week</option>
      </select>

      <label htmlFor="niche-income">What&rsquo;s a realistic income goal for this side gig?</label>
      <select id="niche-income" name="incomeGoal" required disabled={status === 'loading'} defaultValue="">
        <option value="" disabled>Choose one</option>
        <option value="$100-300/month">$100–$300 a month</option>
        <option value="$300-1000/month">$300–$1,000 a month</option>
        <option value="$1000-3000/month">$1,000–$3,000 a month</option>
        <option value="$3000+/month">$3,000+ a month</option>
      </select>

      <label className="niche-optin">
        <input type="checkbox" name="optIn" required disabled={status === 'loading'} />
        I&rsquo;d like to receive my free niche report and occasional emails from MindTheStore.ai. I can unsubscribe
        anytime. See our <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.
      </label>

      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending…' : 'Get my free niche report'} <span aria-hidden="true">→</span>
      </button>

      {status === 'error' && <p className="form-error" role="alert">{errorMessage}</p>}
    </form>
  )
}
