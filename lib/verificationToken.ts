/*
 * Opaque email-verification tokens (db/migrations/003_email_verification_tokens.sql).
 *
 * Confirmation-email links carry one of these tokens instead of the raw
 * email address, so the address isn't exposed in a URL that could be
 * clicked, forwarded, or logged. lib/subscribe.ts creates a token per
 * signup; the Business Promotion setup pages (app/business-promotion/vercel,
 * app/business-promotion/intake) resolve it back to an email server-side.
 */

import crypto from 'node:crypto'
import { query } from './db'

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

export async function createVerificationToken(email: string, funnelOrigin: string): Promise<string> {
  const token = crypto.randomBytes(24).toString('hex')
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS)
  await query(
    `INSERT INTO email_verification_tokens (token, email, funnel_origin, expires_at)
     VALUES ($1, $2, $3, $4)`,
    [token, email, funnelOrigin, expiresAt]
  )
  return token
}

export async function resolveVerificationToken(
  token: string
): Promise<{ email: string; funnelOrigin: string } | null> {
  if (!token) return null
  const rows = await query<{ email: string; funnel_origin: string }>(
    `SELECT email, funnel_origin FROM email_verification_tokens
     WHERE token = $1 AND expires_at > now()`,
    [token]
  )
  if (rows.length === 0) return null
  return { email: rows[0].email, funnelOrigin: rows[0].funnel_origin }
}
