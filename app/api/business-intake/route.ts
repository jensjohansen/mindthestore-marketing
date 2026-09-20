/*
 * Business Promotion track intake survey submission endpoint
 * (components/BusinessIntakeForm.tsx). Mirrors app/api/niche-finder/route.ts:
 * if the database isn't configured yet, logs the submission for manual
 * follow-up and still tells the customer their answers were received,
 * rather than blocking the onboarding flow on an infra prerequisite.
 *
 * After logging the submission, upserts the durable businesses record
 * (lib/business.ts) and, for revenue accounts, creates a Stripe Checkout
 * session for the Business Promotion subscription — the customer is
 * redirected there next. Non-revenue accounts (coupon-flagged internal/test
 * signups) skip Stripe entirely.
 */

import { NextResponse } from 'next/server'
import {
  BusinessIntakeConfigError,
  BusinessIntakeProviderError,
  BusinessIntakeValidationError,
  parseBusinessIntake,
  enqueueBusinessIntake,
} from '@/lib/businessIntake'
import { BusinessConfigError, upsertBusinessFromIntake } from '@/lib/business'
import { StripeConfigError, createBusinessPromotionCheckoutSession } from '@/lib/stripe'

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }

  let request
  try {
    request = parseBusinessIntake(body)
  } catch (err) {
    if (err instanceof BusinessIntakeValidationError) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 400 })
    }
    throw err
  }

  let intakeId: number
  try {
    const result = await enqueueBusinessIntake(request)
    intakeId = result.id
  } catch (err) {
    if (err instanceof BusinessIntakeConfigError) {
      console.warn('[business-intake] not configured — logging for manual follow-up:', JSON.stringify(request))
      return NextResponse.json({ ok: true, mode: 'manual' })
    }
    if (err instanceof BusinessIntakeProviderError) {
      console.error('[business-intake] provider error:', err.message)
      return NextResponse.json({ ok: false, error: 'send_failed' }, { status: 502 })
    }
    console.error('[business-intake] unexpected error:', err)
    return NextResponse.json({ ok: false, error: 'unexpected' }, { status: 500 })
  }

  let business
  try {
    business = await upsertBusinessFromIntake(request, intakeId)
  } catch (err) {
    if (err instanceof BusinessConfigError) {
      console.warn('[business-intake] businesses table not configured yet:', err.message)
      return NextResponse.json({ ok: true, mode: 'queued', id: intakeId })
    }
    console.error('[business-intake] business upsert failed:', err)
    return NextResponse.json({ ok: false, error: 'unexpected' }, { status: 500 })
  }

  if (!business.isRevenue || business.billingStatus !== 'pending_checkout') {
    return NextResponse.json({ ok: true, mode: 'queued', id: intakeId })
  }

  try {
    const { url } = await createBusinessPromotionCheckoutSession({
      businessId: business.id,
      email: business.email,
      successUrl: 'https://mindthestore.ai/business-promotion/checkout-complete',
      cancelUrl: 'https://mindthestore.ai/business-promotion/intake',
    })
    return NextResponse.json({ ok: true, mode: 'queued', id: intakeId, checkoutUrl: url })
  } catch (err) {
    if (err instanceof StripeConfigError) {
      console.warn('[business-intake] Stripe not configured yet — will follow up manually for billing:', err.message)
      return NextResponse.json({ ok: true, mode: 'manual_billing', id: intakeId })
    }
    console.error('[business-intake] checkout session create failed:', err)
    return NextResponse.json({ ok: true, mode: 'manual_billing', id: intakeId })
  }
}
