/*
 * Free Niche onboarding questionnaire (PRD §3.5.1, Use Case 1).
 *
 * Pull architecture (docs/mindthestore/mindthestore-tech-design.md §2.7 /
 * niche_requests queue): submitting the questionnaire writes a row into
 * Postgres (Neon in production). MTS never pushes into the private
 * ai-agents.private cluster and never exposes a trigger endpoint to the
 * internet. Instead, a Kaigents Supervisor polls GET
 * /api/internal/niche-requests?status=pending on a schedule and claims
 * work from there — see mindthestore-skills/mindthestore-niche-team/
 * supervisor-poll.py.
 *
 * If the database isn't configured, this throws NicheFinderConfigError
 * instead of pretending the request is queued — callers must tell the
 * customer a person will follow up, not that automation is already
 * running.
 */

import { query, isDbConfigured, DbConfigError } from './db'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type NicheRequest = {
  email: string
  optIn: boolean
  interests: string
  skills: string
  timeAvailable: string
  incomeGoal: string
  funnelOrigin: string
}

export class NicheFinderValidationError extends Error {}
export class NicheFinderConfigError extends Error {}
export class NicheFinderProviderError extends Error {}

export function isNicheFinderConfigured(): boolean {
  return isDbConfigured()
}

export function parseNicheRequest(body: unknown): NicheRequest {
  const b = (body ?? {}) as Record<string, unknown>

  const email = typeof b.email === 'string' ? b.email.trim() : ''
  if (!EMAIL_RE.test(email) || email.length > 254) {
    throw new NicheFinderValidationError('invalid_email')
  }

  if (b.optIn !== true) {
    throw new NicheFinderValidationError('opt_in_required')
  }

  const interests = typeof b.interests === 'string' ? b.interests.trim() : ''
  const skills = typeof b.skills === 'string' ? b.skills.trim() : ''
  const timeAvailable = typeof b.timeAvailable === 'string' ? b.timeAvailable.trim() : ''
  const incomeGoal = typeof b.incomeGoal === 'string' ? b.incomeGoal.trim() : ''

  if (!interests || !skills || !timeAvailable || !incomeGoal) {
    throw new NicheFinderValidationError('missing_fields')
  }

  const funnelOrigin = typeof b.funnelOrigin === 'string' && b.funnelOrigin.length > 0 ? b.funnelOrigin : 'direct'

  return { email, optIn: true, interests, skills, timeAvailable, incomeGoal, funnelOrigin }
}

/**
 * Inserts the completed questionnaire into the niche_requests queue for a
 * Kaigents Supervisor to pick up. Throws NicheFinderConfigError if the
 * database isn't provisioned yet — callers must not report success to the
 * customer in that case.
 */
export async function enqueueNicheRequest(request: NicheRequest): Promise<{ id: number }> {
  if (!isDbConfigured()) {
    throw new NicheFinderConfigError(
      'Free Niche automation is not wired up yet (missing DATABASE_URL — the niche_requests queue has not been provisioned).'
    )
  }

  try {
    const rows = await query<{ id: number }>(
      `INSERT INTO niche_requests (email, interests, skills, time_available, income_goal, funnel_origin)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [request.email, request.interests, request.skills, request.timeAvailable, request.incomeGoal, request.funnelOrigin]
    )
    return { id: rows[0].id }
  } catch (err) {
    if (err instanceof DbConfigError) {
      throw new NicheFinderConfigError(err.message)
    }
    throw new NicheFinderProviderError(err instanceof Error ? err.message : 'insert failed')
  }
}
