-- Durable per-business account record for the Business Promotion track.
--
-- business_intake_requests (002) is an append-only log of each survey
-- SUBMISSION. It has no concept of "the current state of this business" —
-- billing status, whether it's a revenue account at all, or Stripe IDs.
-- Nothing ever consumed those rows after intake, so submitted data had no
-- path forward. This migration adds the actual account record: one row per
-- business, upserted (not appended) every time that business's intake is
-- submitted or resubmitted, keyed by email.
--
-- is_revenue / billing_status split (see docs/mindthestore/mindthestore-prd.md
-- §3.4.1 Business Promotion pricing — a flat Store-Minder-style subscription,
-- no Build fee):
--   is_revenue = false  -> internal/test account (MTS itself, Kaigents dogfood,
--                          coupon-flagged test signups). billing_status is
--                          always 'unbilled' and operations run regardless.
--   is_revenue = true   -> real customer. billing_status tracks the Stripe
--                          subscription lifecycle: pending_checkout (intake
--                          done, hasn't completed Stripe Checkout yet) ->
--                          active -> past_due (payment failed) -> canceled.
--                          Operations run only while billing_status = 'active'.

CREATE TABLE IF NOT EXISTS businesses (
  id                   BIGSERIAL PRIMARY KEY,
  email                TEXT NOT NULL UNIQUE,
  business_name        TEXT NOT NULL,
  mission              TEXT NOT NULL,
  vision               TEXT NOT NULL,
  existing_site_url    TEXT,
  vercel_choice        TEXT NOT NULL CHECK (vercel_choice IN ('new', 'token')),
  vercel_access_token  TEXT,
  funnel_origin        TEXT NOT NULL DEFAULT 'business-promotion',
  is_revenue           BOOLEAN NOT NULL DEFAULT true,
  billing_status       TEXT NOT NULL DEFAULT 'unbilled'
                         CHECK (billing_status IN ('unbilled', 'pending_checkout', 'active', 'past_due', 'canceled')),
  stripe_customer_id       TEXT,
  stripe_subscription_id  TEXT,
  source_intake_id     BIGINT REFERENCES business_intake_requests (id),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS businesses_billing_status_idx ON businesses (billing_status);
CREATE INDEX IF NOT EXISTS businesses_stripe_subscription_idx ON businesses (stripe_subscription_id);

-- Traceability from the submission log to the account it produced, and the
-- coupon code (if any) that was submitted with it.
ALTER TABLE business_intake_requests ADD COLUMN IF NOT EXISTS coupon_code TEXT;
ALTER TABLE business_intake_requests ADD COLUMN IF NOT EXISTS promoted_to_business_id BIGINT REFERENCES businesses (id);

-- One-time backfill: every business_intake_requests row submitted before this
-- migration existed (there is currently exactly one — MindTheStore.ai's own
-- dogfood submission) is promoted into businesses. These predate the coupon
-- mechanism, so they cannot be identified as non-revenue by coupon code; they
-- are backfilled as is_revenue = false directly, since the only account that
-- exists so far (MTS itself) is explicitly non-revenue. Any future backfill
-- of a real paying customer's stale row would need a manual is_revenue fix.
INSERT INTO businesses (
  email, business_name, mission, vision, existing_site_url, vercel_choice,
  vercel_access_token, funnel_origin, is_revenue, billing_status, source_intake_id
)
SELECT DISTINCT ON (email)
  email, business_name, mission, vision, existing_site_url, vercel_choice,
  vercel_access_token, funnel_origin, false, 'unbilled', id
FROM business_intake_requests
ORDER BY email, created_at DESC
ON CONFLICT (email) DO NOTHING;

UPDATE business_intake_requests
SET promoted_to_business_id = businesses.id
FROM businesses
WHERE business_intake_requests.email = businesses.email
  AND business_intake_requests.promoted_to_business_id IS NULL;
