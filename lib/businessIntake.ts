/*
 * Business Promotion track intake survey (PRD §3.4.1, Track B).
 *
 * Collects the profile MTS needs to run an existing business's promotion
 * engine: mission, vision, the business's existing marketing site URL (if
 * any), and which Vercel path the owner chose (build a new site on Vercel,
 * or keep their existing site and hand MTS a scoped access token instead).
 *
 * Same honest-error pattern as lib/nicheFinder.ts: if the database isn't
 * configured, throws BusinessIntakeConfigError instead of pretending the
 * submission was saved.
 */

import { query, isDbConfigured, DbConfigError } from './db'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const VERCEL_CHOICES = ['new', 'token'] as const

export type VercelChoice = (typeof VERCEL_CHOICES)[number]

export type BusinessIntakeRequest = {
  email: string
  optIn: boolean
  businessName: string
  mission: string
  vision: string
  existingSiteUrl: string
  vercelChoice: VercelChoice
  funnelOrigin: string
}

export class BusinessIntakeValidationError extends Error {}
export class BusinessIntakeConfigError extends Error {}
export class BusinessIntakeProviderError extends Error {}

export function isBusinessIntakeConfigured(): boolean {
  return isDbConfigured()
}

export function parseBusinessIntake(body: unknown): BusinessIntakeRequest {
  const b = (body ?? {}) as Record<string, unknown>

  const email = typeof b.email === 'string' ? b.email.trim() : ''
  if (!EMAIL_RE.test(email) || email.length > 254) {
    throw new BusinessIntakeValidationError('invalid_email')
  }

  if (b.optIn !== true) {
    throw new BusinessIntakeValidationError('opt_in_required')
  }

  const businessName = typeof b.businessName === 'string' ? b.businessName.trim() : ''
  const mission = typeof b.mission === 'string' ? b.mission.trim() : ''
  const vision = typeof b.vision === 'string' ? b.vision.trim() : ''

  if (!businessName || !mission || !vision) {
    throw new BusinessIntakeValidationError('missing_fields')
  }

  const existingSiteUrl = typeof b.existingSiteUrl === 'string' ? b.existingSiteUrl.trim() : ''

  const vercelChoice = typeof b.vercelChoice === 'string' ? b.vercelChoice : ''
  if (!VERCEL_CHOICES.includes(vercelChoice as VercelChoice)) {
    throw new BusinessIntakeValidationError('invalid_vercel_choice')
  }

  const funnelOrigin =
    typeof b.funnelOrigin === 'string' && b.funnelOrigin.length > 0 ? b.funnelOrigin : 'business-promotion'

  return {
    email,
    optIn: true,
    businessName,
    mission,
    vision,
    existingSiteUrl,
    vercelChoice: vercelChoice as VercelChoice,
    funnelOrigin,
  }
}

/**
 * Inserts the completed business intake survey into the
 * business_intake_requests queue. Throws BusinessIntakeConfigError if the
 * database isn't provisioned yet — callers must not report success to the
 * customer in that case.
 */
export async function enqueueBusinessIntake(request: BusinessIntakeRequest): Promise<{ id: number }> {
  if (!isDbConfigured()) {
    throw new BusinessIntakeConfigError(
      'Business Promotion intake is not wired up yet (missing DATABASE_URL — the business_intake_requests queue has not been provisioned).'
    )
  }

  try {
    const rows = await query<{ id: number }>(
      `INSERT INTO business_intake_requests
         (email, business_name, mission, vision, existing_site_url, vercel_choice, funnel_origin)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        request.email,
        request.businessName,
        request.mission,
        request.vision,
        request.existingSiteUrl || null,
        request.vercelChoice,
        request.funnelOrigin,
      ]
    )
    return { id: rows[0].id }
  } catch (err) {
    if (err instanceof DbConfigError) {
      throw new BusinessIntakeConfigError(err.message)
    }
    throw new BusinessIntakeProviderError(err instanceof Error ? err.message : 'insert failed')
  }
}
