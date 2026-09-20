import { NextResponse } from 'next/server'
import { buildStripeAuthorizeUrl, isStripeConnectConfigured, StripeConnectConfigError } from '@/lib/stripeConnect'

export const dynamic = 'force-dynamic'

const NOT_CONFIGURED_HTML = `<!doctype html>
<html><head><meta charset="utf-8"><title>Stripe Connect — not yet available</title>
<style>body{font-family:system-ui,sans-serif;padding:32px;max-width:440px;color:#092a3a}
a.btn{display:inline-block;margin-top:18px;background:#092a3a;color:#fff;text-decoration:none;padding:12px 20px;border-radius:5px;font-weight:700}</style>
</head><body>
<h2>One-click Stripe Connect isn&rsquo;t live yet</h2>
<p>We haven&rsquo;t finished registering MTS as a Stripe platform app, so the one-click connect button can&rsquo;t run yet. You can still create or share your Stripe account the direct way — nothing here is blocking you.</p>
<a class="btn" href="https://dashboard.stripe.com/register" target="_blank" rel="noopener noreferrer">Sign up at stripe.com →</a>
<script>
  if (window.opener) {
    window.opener.postMessage({ source: 'mts-stripe-connect', ok: false, reason: 'not_configured' }, window.location.origin);
  }
</script>
</body></html>`

export async function GET(req: Request) {
  if (!isStripeConnectConfigured()) {
    return new NextResponse(NOT_CONFIGURED_HTML, { status: 200, headers: { 'Content-Type': 'text/html' } })
  }

  const origin = new URL(req.url).origin
  const redirectUri = `${origin}/api/onboarding/stripe/callback`
  const state = crypto.randomUUID()

  try {
    const authorizeUrl = buildStripeAuthorizeUrl(state, redirectUri)
    return NextResponse.redirect(authorizeUrl)
  } catch (err) {
    if (err instanceof StripeConnectConfigError) {
      return new NextResponse(NOT_CONFIGURED_HTML, { status: 200, headers: { 'Content-Type': 'text/html' } })
    }
    throw err
  }
}
