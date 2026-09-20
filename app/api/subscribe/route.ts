import { NextResponse } from 'next/server'
import { addSubscriber, isValidEmail, SubscribeConfigError, SubscribeProviderError } from '@/lib/subscribe'

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }

  const { email, funnel_origin } = (body ?? {}) as { email?: unknown; funnel_origin?: unknown }

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 })
  }

  const source = typeof funnel_origin === 'string' && funnel_origin.length > 0 ? funnel_origin : 'direct'

  try {
    await addSubscriber(email, source)
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof SubscribeConfigError) {
      console.error('[subscribe] not configured:', err.message)
      return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 })
    }
    if (err instanceof SubscribeProviderError) {
      console.error('[subscribe] provider error:', err.message)
      return NextResponse.json({ ok: false, error: 'send_failed' }, { status: 502 })
    }
    console.error('[subscribe] unexpected error:', err)
    return NextResponse.json({ ok: false, error: 'unexpected' }, { status: 500 })
  }
}
