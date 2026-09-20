/*
 * Business Promotion track intake survey submission endpoint
 * (components/BusinessIntakeForm.tsx). Mirrors app/api/niche-finder/route.ts:
 * if the database isn't configured yet, logs the submission for manual
 * follow-up and still tells the customer their answers were received,
 * rather than blocking the onboarding flow on an infra prerequisite.
 */

import { NextResponse } from 'next/server'
import {
  BusinessIntakeConfigError,
  BusinessIntakeProviderError,
  BusinessIntakeValidationError,
  parseBusinessIntake,
  enqueueBusinessIntake,
} from '@/lib/businessIntake'

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

  try {
    const { id } = await enqueueBusinessIntake(request)
    return NextResponse.json({ ok: true, mode: 'queued', id })
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
}
