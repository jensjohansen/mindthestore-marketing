/**
 * Stripe Connect OAuth helpers (tech-design.md §9.2 — Tier A, connect-once).
 *
 * A customer's payout destination is their Stripe Connect Account ID
 * (acct_xxx), never a credential and never an email address. This flow lets
 * them either connect an existing Stripe account or create a new one inside
 * Stripe's own hosted UI, and returns only that immutable Account ID to us.
 *
 * Requires two platform-level (one-time, MTS-owned) secrets, not yet
 * provisioned as of 2026-09-19:
 *   STRIPE_CONNECT_CLIENT_ID  - from the Stripe Connect "Platform settings" page.
 *   STRIPE_SECRET_KEY         - MTS's own platform secret key, used only to
 *                               complete the OAuth token exchange server-side.
 */

export class StripeConnectConfigError extends Error {}

export function isStripeConnectConfigured(): boolean {
  return !!(process.env.STRIPE_CONNECT_CLIENT_ID && process.env.STRIPE_SECRET_KEY)
}

export function buildStripeAuthorizeUrl(state: string, redirectUri: string): string {
  const clientId = process.env.STRIPE_CONNECT_CLIENT_ID
  if (!clientId) {
    throw new StripeConnectConfigError('STRIPE_CONNECT_CLIENT_ID is not set — Stripe Connect platform app not registered yet.')
  }
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: 'read_write',
    redirect_uri: redirectUri,
    state,
  })
  return `https://connect.stripe.com/oauth/authorize?${params.toString()}`
}

export async function exchangeStripeCode(code: string): Promise<{ accountId: string }> {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new StripeConnectConfigError('STRIPE_SECRET_KEY is not set — cannot complete the Stripe OAuth token exchange.')
  }

  const res = await fetch('https://connect.stripe.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_secret: secretKey,
      code,
      grant_type: 'authorization_code',
    }),
  })

  const body = (await res.json()) as { stripe_user_id?: string; error_description?: string; error?: string }

  if (!res.ok || !body.stripe_user_id) {
    throw new Error(body.error_description || body.error || `Stripe token exchange failed (${res.status})`)
  }

  return { accountId: body.stripe_user_id }
}
