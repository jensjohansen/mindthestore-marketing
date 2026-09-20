-- Free Niche questionnaire queue (PRD §3.5.1, Use Case 1).
--
-- Pull architecture: MTS writes rows here on submission. A Kaigents
-- Supervisor Agent Team running inside the private ai-agents.private
-- cluster polls GET /api/internal/niche-requests?status=pending on a
-- schedule (outbound-only call, matches the existing egress-proxy
-- pattern) and claims/completes rows via the same internal API — MTS
-- never pushes into the cluster, and the cluster never exposes an
-- inbound listener to the internet.

CREATE TABLE IF NOT EXISTS niche_requests (
  id              BIGSERIAL PRIMARY KEY,
  email           TEXT NOT NULL,
  interests       TEXT NOT NULL,
  skills          TEXT NOT NULL,
  time_available  TEXT NOT NULL,
  income_goal     TEXT NOT NULL,
  funnel_origin   TEXT NOT NULL DEFAULT 'direct',
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'claimed', 'completed', 'failed')),
  claimed_by      TEXT,
  claimed_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  failure_reason  TEXT,
  run_name        TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS niche_requests_status_idx ON niche_requests (status, created_at);
