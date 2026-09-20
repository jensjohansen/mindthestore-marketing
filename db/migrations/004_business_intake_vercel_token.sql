--
-- Adds the scoped Vercel Access Token field for the "Keep my existing site"
-- path (components/onboarding/VercelChoiceToggle.tsx vercelChoice='token').
-- The customer is instructed to create a token scoped to MTS and paste it
-- during intake, so MTS can manage a domain/deployment without ever seeing
-- their Vercel password. NULL when vercelChoice='new' (no token needed).

ALTER TABLE business_intake_requests
  ADD COLUMN IF NOT EXISTS vercel_access_token TEXT;
