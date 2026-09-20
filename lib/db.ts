/*
 * Postgres pool (Neon in production, any wire-compatible Postgres in dev —
 * see docs/mindthestore/mindthestore-tech-design.md §2.7, CRM platform).
 *
 * Uses the plain `pg` driver (not @neondatabase/serverless) so the exact
 * same code path can be tested locally against a throwaway Postgres
 * container before a real Neon project exists. Neon is wire-compatible
 * Postgres, so no code changes are needed when DATABASE_URL points at Neon
 * instead of localhost.
 *
 * Requires DATABASE_URL. If missing, throws DbConfigError rather than
 * pretending to be connected — matches the honest-error pattern used by
 * lib/subscribe.ts and lib/stripeConnect.ts.
 */

import { Pool, type QueryResultRow } from 'pg'

export class DbConfigError extends Error {}

let pool: Pool | null = null

export function isDbConfigured(): boolean {
  return !!process.env.DATABASE_URL
}

function getPool(): Pool {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new DbConfigError('Database is not configured yet (missing DATABASE_URL).')
  }
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1')
        ? false
        : { rejectUnauthorized: false },
      max: 5,
    })
  }
  return pool
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const p = getPool()
  const res = await p.query<T>(text, params)
  return res.rows
}
