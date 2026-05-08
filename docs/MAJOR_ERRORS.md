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
