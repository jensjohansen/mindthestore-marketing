import { NextResponse } from 'next/server'
import {
  NicheFinderConfigError,
  NicheFinderProviderError,
  NicheFinderValidationError,
  parseNicheRequest,
  enqueueNicheRequest,
} from '@/lib/nicheFinder'

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }

  let request
  try {
    request = parseNicheRequest(body)
  } catch (err) {
    if (err instanceof NicheFinderValidationError) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 400 })
    }
    throw err
  }

  try {
    const { id } = await enqueueNicheRequest(request)
    return NextResponse.json({ ok: true, mode: 'queued', id })
  } catch (err) {
    if (err instanceof NicheFinderConfigError) {
      console.warn('[niche-finder] not configured — logging for manual follow-up:', JSON.stringify(request))
      return NextResponse.json({ ok: true, mode: 'manual' })
    }
    if (err instanceof NicheFinderProviderError) {
      console.error('[niche-finder] provider error:', err.message)
      return NextResponse.json({ ok: false, error: 'send_failed' }, { status: 502 })
    }
    console.error('[niche-finder] unexpected error:', err)
    return NextResponse.json({ ok: false, error: 'unexpected' }, { status: 500 })
  }
}
