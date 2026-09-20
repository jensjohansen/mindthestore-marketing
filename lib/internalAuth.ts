/*
 * Bearer-token auth for internal-only endpoints consumed by the Kaigents
 * Supervisor poll loop (outbound call from inside ai-agents.private —
 * never the reverse). Not meant for browser clients.
 */

export class InternalAuthConfigError extends Error {}

export function checkInternalAuth(req: Request): { ok: true } | { ok: false; status: number; error: string } {
  const expected = process.env.INTERNAL_API_TOKEN
  if (!expected) {
    return { ok: false, status: 503, error: 'internal_api_not_configured' }
  }
  const header = req.headers.get('authorization') || ''
  const match = header.match(/^Bearer (.+)$/)
  if (!match || match[1] !== expected) {
    return { ok: false, status: 401, error: 'unauthorized' }
  }
  return { ok: true }
}
