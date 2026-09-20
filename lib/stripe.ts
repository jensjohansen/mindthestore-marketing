/**
 * MTS's own Stripe account (Flow 1 — customer -> MTS billing, tech-design.md
 * §2.6.1). Not the customer's own Stripe Connect account (lib/stripeConnect.ts)
 * — that's a different flow entirely (gig-owner payouts).
 *
 * Uses raw fetch against Stripe's REST API, matching the rest of this
 * codebase's convention (lib/stripeConnect.ts, lib/subscribe.ts) rather than
 * adding the `stripe` npm SDK as a dependency.
 *
 * Business Promotion pricing (PRD §3.4.1): a single flat Store-Minder-style
 * subscription, no Build fee (there's nothing to build — the business
 * already exists). Gig Build's Niche/Build one-time products and
 * Single/Triple Store Minder tiers are not built here yet.
 */

import crypto from 'node:crypto'

const STRIPE_API = 'https://api.stripe.com/v1'

export class StripeConfigError extends Error {}

export function isStripeConfigured(): boolean {
  return !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID_BUSINESS_PROMOTION)
}

export async function createBusinessPromotionCheckoutSession(params: {
  businessId: number
  email: string
  successUrl: string
  cancelUrl: string
}): Promise<{ url: string }> {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const priceId = process.env.STRIPE_PRICE_ID_BUSINESS_PROMOTION
  if (!secretKey || !priceId) {
    throw new StripeConfigError(
      'Stripe is not configured yet (missing STRIPE_SECRET_KEY / STRIPE_PRICE_ID_BUSINESS_PROMOTION).'
    )
  }

  const body = new URLSearchParams({
    mode: 'subscription',
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    customer_email: params.email,
    client_reference_id: String(params.businessId),
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  })

  const res = await fetch(`${STRIPE_API}/checkout/sessions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })

  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: { message?: string } }
  if (!res.ok || !data.url) {
    throw new Error(`Stripe checkout session create failed (${res.status}): ${data.error?.message || 'unknown error'}`)
  }
  return { url: data.url }
}

/**
 * Verifies the `Stripe-Signature` header per Stripe's documented scheme:
 * HMAC-SHA256 of "{timestamp}.{raw body}" using the webhook signing secret,
 * compared against the v1 signature(s) in the header. Implemented by hand
 * (no SDK) — this is the one part of Stripe integration where "raw fetch"
 * isn't enough, since skipping verification would mean trusting unsigned
 * POST bodies as if they were real Stripe events.
 */
export function verifyStripeWebhookSignature(payload: string, sigHeader: string | null): boolean {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret || !sigHeader) return false

  const parts: Record<string, string[]> = {}
  for (const kv of sigHeader.split(',')) {
    const [key, value] = kv.split('=')
    if (!key || !value) continue
    if (!parts[key]) parts[key] = []
    parts[key].push(value)
  }

  const timestamp = parts.t?.[0]
  const candidates = parts.v1 || []
  if (!timestamp || candidates.length === 0) return false

  const expected = crypto.createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex')
  const expectedBuf = Buffer.from(expected)

  return candidates.some((candidate) => {
    const candidateBuf = Buffer.from(candidate)
    if (candidateBuf.length !== expectedBuf.length) return false
    return crypto.timingSafeEqual(expectedBuf, candidateBuf)
  })
}
