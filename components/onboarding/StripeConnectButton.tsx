'use client'

import { useEffect, useState } from 'react'

type StripeMessage = {
  source: 'mts-stripe-connect'
  ok: boolean
  accountId?: string
  reason?: string
}

export function StripeConnectButton() {
  const [status, setStatus] = useState<'idle' | 'connected' | 'not_configured' | 'failed'>('idle')
  const [accountId, setAccountId] = useState<string | null>(null)
  const [reason, setReason] = useState<string | null>(null)

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return
      const data = event.data as StripeMessage
      if (!data || data.source !== 'mts-stripe-connect') return

      if (data.ok && data.accountId) {
        setStatus('connected')
        setAccountId(data.accountId)
      } else if (data.reason === 'not_configured') {
        setStatus('not_configured')
      } else {
        setStatus('failed')
        setReason(data.reason || null)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  function openStripeConnect() {
    const width = 480
    const height = 720
    const left = Math.max(0, Math.round((window.screen.width - width) / 2))
    const top = Math.max(0, Math.round((window.screen.height - height) / 2))
    window.open(
      '/api/onboarding/stripe/connect',
      'mts-stripe-connect',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,toolbar=yes,location=yes`
    )
  }

  return (
    <div className="setup-action-block">
      <button type="button" className="setup-window-btn setup-window-btn-primary" onClick={openStripeConnect}>
        Connect with Stripe <span aria-hidden="true">↗</span>
      </button>

      {status === 'connected' && accountId && (
        <div className="setup-status setup-status-ok">
          <strong>Connected.</strong> Your Stripe account ID is <code>{accountId}</code>. Copy this into your onboarding reply email so we can finish linking it to your gig.
        </div>
      )}
      {status === 'not_configured' && (
        <div className="setup-status setup-status-warn">
          One-click connect isn&rsquo;t live yet. Use the direct sign-up link in the popup window instead — you can still finish this step today.
        </div>
      )}
      {status === 'failed' && (
        <div className="setup-status setup-status-warn">
          Connect didn&rsquo;t complete{reason ? `: ${reason}` : '.'} Try again, or use the direct sign-up link.
        </div>
      )}

      <p className="setup-fallback">
        Prefer to do it yourself? <a href="https://dashboard.stripe.com/register" target="_blank" rel="noopener noreferrer">Open dashboard.stripe.com directly →</a>
      </p>
    </div>
  )
}
