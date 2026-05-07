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
