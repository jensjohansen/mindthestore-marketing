/*
 * Internal, bearer-token-protected endpoint for the Kaigents Supervisor
 * poll loop (mindthestore-skills/mindthestore-niche-team/supervisor-poll.py).
 *
 * GET  ?status=pending&limit=10  -> list rows for the supervisor to claim.
 * PATCH { id, action: 'claim'|'complete'|'fail', ... } -> transition a row.
 *
 * Never called from a browser. The cluster calls this outbound over the
 * public internet (mindthestore.ai is internet-reachable; the cluster is
 * not) — no inbound listener is ever opened on ai-agents.private.
 */

import { NextResponse } from 'next/server'
import { query, isDbConfigured } from '@/lib/db'
import { checkInternalAuth } from '@/lib/internalAuth'

const ALLOWED_STATUSES = ['pending', 'claimed', 'completed', 'failed']

export async function GET(req: Request) {
  const auth = checkInternalAuth(req)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status })
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, error: 'db_not_configured' }, { status: 503 })
  }

  const url = new URL(req.url)
  const status = url.searchParams.get('status') || 'pending'
  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json({ ok: false, error: 'invalid_status' }, { status: 400 })
  }
  const limitParam = parseInt(url.searchParams.get('limit') || '10', 10)
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 10

  const rows = await query(
    `SELECT id, email, interests, skills, time_available, income_goal, funnel_origin, status, created_at
     FROM niche_requests
     WHERE status = $1
     ORDER BY created_at ASC
     LIMIT $2`,
    [status, limit]
  )

  return NextResponse.json({ ok: true, requests: rows })
}

export async function PATCH(req: Request) {
  const auth = checkInternalAuth(req)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status })
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, error: 'db_not_configured' }, { status: 503 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }
  const b = (body ?? {}) as Record<string, unknown>
  const id = typeof b.id === 'number' ? b.id : Number(b.id)
  const action = typeof b.action === 'string' ? b.action : ''

  if (!Number.isFinite(id)) {
    return NextResponse.json({ ok: false, error: 'invalid_id' }, { status: 400 })
  }

  if (action === 'claim') {
    const claimedBy = typeof b.claimedBy === 'string' ? b.claimedBy : 'unknown-supervisor'
    const runName = typeof b.runName === 'string' ? b.runName : null
    const rows = await query(
      `UPDATE niche_requests
       SET status = 'claimed', claimed_by = $2, claimed_at = now(), run_name = $3
       WHERE id = $1 AND status = 'pending'
       RETURNING id`,
      [id, claimedBy, runName]
    )
    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: 'already_claimed_or_not_found' }, { status: 409 })
    }
    return NextResponse.json({ ok: true })
  }

  if (action === 'complete') {
    const rows = await query(
      `UPDATE niche_requests
       SET status = 'completed', completed_at = now()
       WHERE id = $1 AND status = 'claimed'
       RETURNING id`,
      [id]
    )
    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: 'not_claimed_or_not_found' }, { status: 409 })
    }
    return NextResponse.json({ ok: true })
  }

  if (action === 'fail') {
    const reason = typeof b.failureReason === 'string' ? b.failureReason : 'unspecified'
    const rows = await query(
      `UPDATE niche_requests
       SET status = 'failed', failure_reason = $2
       WHERE id = $1 AND status IN ('pending', 'claimed')
       RETURNING id`,
      [id, reason]
    )
    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: 'not_found' }, { status: 409 })
    }
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ ok: false, error: 'invalid_action' }, { status: 400 })
}
