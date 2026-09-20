--
-- Opaque tokens for confirmation-email links (see lib/verificationToken.ts).
-- Confirmation emails link with a token instead of the raw email address in
-- the URL, so the address isn't exposed in a clicked/forwarded/logged link.
-- Currently used by the Business Promotion track (lib/subscribe.ts).

CREATE TABLE IF NOT EXISTS email_verification_tokens (
  token         TEXT PRIMARY KEY,
  email         TEXT NOT NULL,
  funnel_origin TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at    TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS email_verification_tokens_expires_idx ON email_verification_tokens (expires_at);
