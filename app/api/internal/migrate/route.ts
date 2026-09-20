/*
 * Internal-only endpoint to apply pending SQL files from db/migrations
 * against DATABASE_URL. Needed because Vercel marks Neon-injected
 * connection strings as "sensitive" env vars, which are write-only and
 * cannot be read back via the dashboard or API — so migrations can't be
 * run from a local shell with a copy-pasted connection string. This route
 * runs inside the same Vercel deployment that already holds the real
 * DATABASE_URL, applies any migration not yet recorded in
 * schema_migrations, and reports what it did.
 *
 * Auth: same Bearer INTERNAL_API_TOKEN used by
 * app/api/internal/niche-requests/route.ts. Not meant for browser clients.
 */

import { NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'
import { checkInternalAuth } from '@/lib/internalAuth'
import { query, isDbConfigured } from '@/lib/db'

const MIGRATIONS_DIR = path.join(process.cwd(), 'db', 'migrations')

export async function POST(req: Request) {
  const auth = checkInternalAuth(req)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status })
  }

  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, error: 'db_not_configured' }, { status: 503 })
  }

  await query(
    `CREATE TABLE IF NOT EXISTS schema_migrations (
       filename    TEXT PRIMARY KEY,
       applied_at  TIMESTAMPTZ NOT NULL DEFAULT now()
     )`
  )

  const applied = (await query<{ filename: string }>('SELECT filename FROM schema_migrations')).map(
    (r) => r.filename
  )

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort()

  const results: { filename: string; status: string }[] = []

  for (const filename of files) {
    if (applied.includes(filename)) {
      results.push({ filename, status: 'already_applied' })
      continue
    }
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, filename), 'utf8')
    try {
      await query(sql)
      await query('INSERT INTO schema_migrations (filename) VALUES ($1)', [filename])
      results.push({ filename, status: 'applied' })
    } catch (err) {
      results.push({ filename, status: `error: ${err instanceof Error ? err.message : 'unknown'}` })
      break
    }
  }

  return NextResponse.json({ ok: true, results })
}
