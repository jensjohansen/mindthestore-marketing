import { NextResponse } from 'next/server'
import { exchangeStripeCode } from '@/lib/stripeConnect'

function resultPage(payload: { ok: boolean; accountId?: string; reason?: string }) {
  const message = payload.ok
    ? `<h2>Stripe connected</h2><p>Your Stripe account is linked. This window will close automatically.</p>`
    : `<h2>Stripe connect didn&rsquo;t complete</h2><p>${payload.reason || 'Something went wrong.'} You can close this window and try again, or use the direct sign-up link instead.</p>`

  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Stripe Connect</title>
<style>body{font-family:system-ui,sans-serif;padding:32px;max-width:440px;color:#092a3a}</style>
</head><body>
${message}
<script>
  if (window.opener) {
    window.opener.postMessage(${JSON.stringify({ source: 'mts-stripe-connect', ...payload })}, window.location.origin);
  }
  ${payload.ok ? 'setTimeout(function () { window.close(); }, 1800);' : ''}
</script>
</body></html>`
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const errorParam = url.searchParams.get('error_description') || url.searchParams.get('error')

  if (errorParam) {
    return new NextResponse(resultPage({ ok: false, reason: errorParam }), { status: 200, headers: { 'Content-Type': 'text/html' } })
  }

  if (!code) {
    return new NextResponse(resultPage({ ok: false, reason: 'No authorization code was returned by Stripe.' }), {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    })
  }

  try {
    const { accountId } = await exchangeStripeCode(code)
    return new NextResponse(resultPage({ ok: true, accountId }), { status: 200, headers: { 'Content-Type': 'text/html' } })
  } catch (err) {
    const reason = err instanceof Error ? err.message : 'Unexpected error completing Stripe Connect.'
    return new NextResponse(resultPage({ ok: false, reason }), { status: 200, headers: { 'Content-Type': 'text/html' } })
  }
}
