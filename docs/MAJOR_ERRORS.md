# Major Errors

## Purpose

Tracks significant errors encountered during development and their resolutions.

---

## Vercel Deployment Failed — `ERR_PNPM_OUTDATED_LOCKFILE`

### Error

Vercel deployments failed with:
```
ERR_PNPM_OUTDATED_LOCKFILE: Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with package.json
  Failure reason: specifiers in the lockfile don't match specifiers in package.json:
  * 2 dependencies were added: @cloudflare/vitest-pool-workers@^0.12.4, vitest@~3.2.0
```

### Root Cause

Added `@cloudflare/vitest-pool-workers` and `vitest` to `apps/costpilot-api/package.json`, but `pnpm-lock.yaml` was not regenerated. Vercel uses `--frozen-lockfile` by default (CI mode), which rejects installs when the lockfile doesn't match package.json.

### Fix

Ran `pnpm install --no-frozen-lockfile` to force-regenerate `pnpm-lock.yaml` to match the updated `package.json`. Committed and pushed the updated lockfile to `main`.



---

## Vitest D1 Migration Setup — `applyD1Migrations` Binding Mismatch

### Error

Failed to set up D1 migrations in Vitest test environment:
```
TypeError: Failed to execute 'applyD1Migrations': parameter 1 is not of type 'D1Database'.
```

### Root Cause

The `@cloudflare/vitest-pool-workers` test environment creates a D1 instance but the binding name (`costpilot_db`) didn't match what `applyD1Migrations()` expected. The function strictly requires a `D1Database` type. Our `wrangler.jsonc` uses `costpilot_db` as the binding, but the vitest pool exposes it differently.

### Fix

Reverted the test migration setup for now. Audit engine tests are pure logic (no DB needed), so they don't require D1. DB query tests will be added later with proper D1 test infrastructure.

### Lesson

Keep tests that don't need the database completely separate from DB integration tests. The audit engine is pure logic — test it without any Workers runtime setup.

---

## CI: Vitest Remote D1 Connection Fails

### Error

GitHub Actions CI failed with:
```
Error: Failed to start the remote proxy session...
You must be logged in to use wrangler dev in remote mode.
```

### Root Cause

The D1 binding in `wrangler.jsonc` had `"remote": true`, which tells the vitest pool to connect to the remote Cloudflare D1 database. In CI, there's no Cloudflare authentication, so the connection fails.

### Fix

Added `remoteBindings: false` to `vitest.config.ts` under `poolOptions.workers`. This tells the vitest pool to use local storage instead of trying to connect to remote resources.

---

## Audit Engine: Alternative-Tool Suggestions Looked "Manufactured"

### Error

Alternative-tool recommendations were being generated too aggressively (fixed percentage savings and broad suggestions), which could produce weak or non-defensible savings claims for low-spend or already-optimized setups.

### Root Cause

- Alternative recommendations used percent-based savings instead of modeled plan-price comparisons.
- No strict guardrails for minimum spend, minimum absolute savings, or minimum savings percentage.
- Alternative suggestions could be added even when an existing downgrade recommendation was already stronger.

### Fix

Implemented stricter, finance-defensible gating for `alternative-tool` recommendations in `audit-engine.ts`:

- Added hard thresholds:
  - minimum current spend: `$40/month`
  - minimum alternative savings: `$25/month`
  - minimum relative savings: `20%`
- Switched to modeled alternative spend (`modeled plan price × seats`) instead of flat percentage assumptions.
- Suppressed weaker alternatives when an existing recommendation already saves more (requires alternative to beat existing savings by a margin).
- Added tests to ensure:
  - low-spend setups do not get alternative recommendations
  - weaker alternatives are suppressed when downgrade is stronger

### Lesson

For financial recommendation systems, "possible savings" is not enough. Suggestions should only appear when assumptions are explicit and savings clear enough to be defensible to a finance-literate reviewer.

---

## Vercel 404 on Page Reload (React Router SPA)

### Error

All routes (homepage, `/audit`, `/report/:id`) return 404 on page refresh, but work if navigated to from within the app. Loading succeeds after multiple retries.

### Root Cause

Vercel serves files statically. When you reload `/audit`, it looks for a file at that path, which doesn't exist — it's a React Router route. Vercel needs to serve `index.html` for all paths and let React handle the routing.

### Fix

Added `apps/costpilot-web/vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

This tells Vercel to serve `index.html` for every URL path, so React Router can handle the routing client-side.

---

## Gemini Free Tier Quota Exceeded

### Error

```
429 Too Many Requests — Quota exceeded for Gemini free tier
```

### Root Cause

The free Gemini API key has strict per-minute and per-day limits. During testing, these limits were hit.

### Fix

The summary controller already handles this gracefully — `generateSummary()` catches API errors and returns a templated fallback. Users see the pre-written summary with their savings numbers instead of an AI-generated one.

For a fresh key, create a new Google account and generate a key at aistudio.google.com.

---

## Email Not Including Report Link

### Error

Lead capture emails were sent without the report URL and mentioned Credex for all users regardless of savings amount.

### Root Cause

The lead controller wasn't looking up the audit data — it relied on the frontend to send `publicId` and `totalMonthlySavings`, but the frontend wasn't sending them.

### Fix

Updated `controllers/lead.ts` to look up the audit from D1 using `auditId`:
- Gets `public_id` from DB to include the report link
- Gets `monthly_savings` from DB — only mentions Credex if savings > $500/mo
- Added `getAuditById()` to `db/queries.ts`
