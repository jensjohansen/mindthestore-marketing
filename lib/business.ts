/**
 * Durable business account record (db/migrations/005_businesses.sql).
 *
 * Every business_intake_requests submission upserts a row here, keyed by
 * email — this is "the current state of the business," not a log of
 * submissions. It's the thing billing and (eventually) operations gating
 * key off of.
 */

import { query, isDbConfigured, DbConfigError } from './db'
import type { BusinessIntakeRequest } from './businessIntake'

export type BillingStatus = 'unbilled' | 'pending_checkout' | 'active' | 'past_due' | 'canceled'

export type Business = {
  id: number
  email: string
  businessName: string
  isRevenue: boolean
  billingStatus: BillingStatus
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
}

export class BusinessConfigError extends Error {}

/**
 * A business is non-revenue (internal/test/dogfood account, never billed)
 * if its intake submission included the coupon code configured in
 * INTERNAL_NONREVENUE_COUPON. This is intentionally the whole mechanism —
 * no admin UI, no separate approval step. Simplest thing that lets us mark
 * MTS, Kaigents, and future internal test signups as unbillable at the
 * point of signup instead of retrofitting it after the fact.
 */
export function isNonRevenueCoupon(couponCode: string): boolean {
  const configured = process.env.INTERNAL_NONREVENUE_COUPON
  if (!configured || !couponCode) return false
  return couponCode.trim().toUpperCase() === configured.trim().toUpperCase()
}

function mapRow(row: {
  id: number
  email: string
  businessName: string
  isRevenue: boolean
  billingStatus: BillingStatus
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
}): Business {
  return row
}

/**
 * Upserts the businesses row for this intake submission. Resubmitting the
 * intake form (e.g. to fix a typo) updates the same business record rather
 * than creating a duplicate — but never resets billing_status away from
 * 'active'/'past_due' if a subscription is already running.
 */
export async function upsertBusinessFromIntake(
  request: BusinessIntakeRequest,
  intakeId: number
): Promise<Business> {
  if (!isDbConfigured()) {
    throw new BusinessConfigError('Business accounts are not configured yet (missing DATABASE_URL).')
  }

  const isRevenue = !isNonRevenueCoupon(request.couponCode)
  const initialBillingStatus: BillingStatus = isRevenue ? 'pending_checkout' : 'unbilled'

  try {
    const rows = await query<{
      id: number
      email: string
      businessName: string
      isRevenue: boolean
      billingStatus: BillingStatus
      stripeCustomerId: string | null
      stripeSubscriptionId: string | null
    }>(
      `INSERT INTO businesses (
         email, business_name, mission, vision, existing_site_url, vercel_choice,
         vercel_access_token, funnel_origin, is_revenue, billing_status, source_intake_id
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (email) DO UPDATE SET
         business_name = EXCLUDED.business_name,
         mission = EXCLUDED.mission,
         vision = EXCLUDED.vision,
         existing_site_url = EXCLUDED.existing_site_url,
         vercel_choice = EXCLUDED.vercel_choice,
         vercel_access_token = EXCLUDED.vercel_access_token,
         funnel_origin = EXCLUDED.funnel_origin,
         is_revenue = EXCLUDED.is_revenue,
         billing_status = CASE
           WHEN businesses.billing_status IN ('active', 'past_due') THEN businesses.billing_status
           ELSE EXCLUDED.billing_status
         END,
         source_intake_id = EXCLUDED.source_intake_id,
         updated_at = now()
       RETURNING
         id, email, business_name AS "businessName", is_revenue AS "isRevenue",
         billing_status AS "billingStatus", stripe_customer_id AS "stripeCustomerId",
         stripe_subscription_id AS "stripeSubscriptionId"`,
      [
        request.email,
        request.businessName,
        request.mission,
        request.vision,
        request.existingSiteUrl || null,
        request.vercelChoice,
        request.vercelAccessToken || null,
        request.funnelOrigin,
        isRevenue,
        initialBillingStatus,
        intakeId,
      ]
    )

    const business = mapRow(rows[0])

    await query(`UPDATE business_intake_requests SET promoted_to_business_id = $1 WHERE id = $2`, [
      business.id,
      intakeId,
    ])

    return business
  } catch (err) {
    if (err instanceof DbConfigError) {
      throw new BusinessConfigError(err.message)
    }
    throw err
  }
}

/**
 * Not wired into any content/publishing pipeline yet (none exists in this
 * repo). Exported now so that pipeline, once built, has one place to check
 * instead of re-deriving this rule.
 */
export function isOperationsAllowed(business: Pick<Business, 'isRevenue' | 'billingStatus'>): boolean {
  return !business.isRevenue || business.billingStatus === 'active'
}
