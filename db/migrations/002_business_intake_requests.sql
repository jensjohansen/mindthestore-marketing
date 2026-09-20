-- Business Promotion track intake survey (PRD §3.4.1, Track B).
--
-- Collected once per Business Promotion client: mission, vision, the
-- business's existing marketing site URL (if any), and which Vercel path
-- they chose (build a new site on Vercel, or keep their existing site and
-- hand MTS a scoped access token to manage a domain/deployment instead).
--
-- No supervisor claim/complete workflow yet — this table only needs to
-- durably capture the survey. Claim columns can be added later when a
-- Kaigents Supervisor is built to consume these rows (mirrors
-- niche_requests, db/migrations/001_niche_requests.sql).

CREATE TABLE IF NOT EXISTS business_intake_requests (
  id                BIGSERIAL PRIMARY KEY,
  email             TEXT NOT NULL,
  business_name     TEXT NOT NULL,
  mission           TEXT NOT NULL,
  vision            TEXT NOT NULL,
  existing_site_url TEXT,
  vercel_choice     TEXT NOT NULL CHECK (vercel_choice IN ('new', 'token')),
  funnel_origin     TEXT NOT NULL DEFAULT 'business-promotion',
  status            TEXT NOT NULL DEFAULT 'submitted'
                      CHECK (status IN ('submitted', 'reviewed')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS business_intake_requests_status_idx ON business_intake_requests (status, created_at);
