/*
 * Internal, bearer-token-protected read endpoint for the durable
 * businesses account record (db/migrations/005_businesses.sql,
 * lib/business.ts). Lists accounts for verification/ops use — no writes
 * here; billing_status transitions happen via app/api/webhooks/stripe.
 *
 * Never called from a browser.
 */

import { NextResponse } from 'next/server'
import { query, isDbConfigured } from '@/lib/db'
import { checkInternalAuth } from '@/lib/internalAuth'

export async function GET(req: Request) {
  const auth = checkInternalAuth(req)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status })
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, error: 'db_not_configured' }, { status: 503 })
  }

  const rows = await query(
    `SELECT id, email, business_name, is_revenue, billing_status,
            stripe_customer_id, stripe_subscription_id, created_at, updated_at
     FROM businesses
     ORDER BY created_at ASC`
  )

  return NextResponse.json({ ok: true, businesses: rows })
}
