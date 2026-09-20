/*
 * Stripe webhook receiver for MTS's own Stripe account (Flow 1 billing,
 * tech-design.md §2.6.1). Keeps businesses.billing_status in sync with the
 * real subscription state so operations gating (lib/business.ts,
 * isOperationsAllowed) reflects reality:
 *   checkout.session.completed -> active (first payment, records Stripe IDs)
 *   invoice.paid               -> active (renewal succeeded, or resumed
 *                                  after a past_due period)
 *   invoice.payment_failed     -> past_due
 *   customer.subscription.deleted -> canceled
 *
 * Signature verification (lib/stripe.ts verifyStripeWebhookSignature) is
 * mandatory — this endpoint is public and otherwise unauthenticated.
 */

import { NextResponse } from 'next/server'
import { query, isDbConfigured } from '@/lib/db'
import { verifyStripeWebhookSignature } from '@/lib/stripe'

export async function POST(req: Request) {
  const payload = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!verifyStripeWebhookSignature(payload, signature)) {
    return NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 400 })
  }

  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, error: 'db_not_configured' }, { status: 503 })
  }

  let event: { type?: string; data?: { object?: Record<string, unknown> } }
  try {
    event = JSON.parse(payload)
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }

  const object = event.data?.object || {}

  switch (event.type) {
    case 'checkout.session.completed': {
      const businessId = object.client_reference_id
      const customerId = object.customer
      const subscriptionId = object.subscription
      if (businessId) {
        await query(
          `UPDATE businesses
             SET billing_status = 'active', stripe_customer_id = $1, stripe_subscription_id = $2, updated_at = now()
           WHERE id = $3`,
          [customerId ?? null, subscriptionId ?? null, businessId]
        )
      }
      break
    }
    case 'invoice.paid': {
      const subscriptionId = object.subscription
      if (subscriptionId) {
        await query(
          `UPDATE businesses SET billing_status = 'active', updated_at = now() WHERE stripe_subscription_id = $1`,
          [subscriptionId]
        )
      }
      break
    }
    case 'invoice.payment_failed': {
      const subscriptionId = object.subscription
      if (subscriptionId) {
        await query(
          `UPDATE businesses SET billing_status = 'past_due', updated_at = now() WHERE stripe_subscription_id = $1`,
          [subscriptionId]
        )
      }
      break
    }
    case 'customer.subscription.deleted': {
      const subscriptionId = object.id
      if (subscriptionId) {
        await query(
          `UPDATE businesses SET billing_status = 'canceled', updated_at = now() WHERE stripe_subscription_id = $1`,
          [subscriptionId]
        )
      }
      break
    }
    default:
      break
  }

  return NextResponse.json({ ok: true })
}
