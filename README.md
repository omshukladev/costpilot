# CostPilot

Audit your AI tooling spend. Find savings. Switch to better plans.

CostPilot is a free web app that analyzes your AI subscriptions (Cursor, Copilot, Claude, ChatGPT, and more) and tells you where you're overpaying — with defensible savings recommendations and an AI-generated summary.

Built for the Credex Round 1 assignment.

## Quick Start

```bash
# Install dependencies
pnpm install

# Run backend (requires Cloudflare D1)
cd apps/costpilot-api
pnpm dev

# Run frontend
cd apps/costpilot-web
pnpm dev

# Run tests
pnpm test
```

## Deployed URLs

- **Frontend**: https://costpilot-costpilot-web.vercel.app/
- **Backend**: https://costpilot-api.omshuklalko3.workers.dev/

## Decisions

1. **Raw SQL over ORM**: D1 + raw SQL is simpler than Drizzle for an MVP. Fewer dependencies, transparent queries.
2. **Gemini first, Anthropic later**: Gemini API key was instant; Anthropic credits take 1-2 days. Building with Gemini fallback now, swapping to Anthropic if credits arrive.
3. **Backend-first**: Built the audit engine and API before touching the frontend. Core logic is pure and testable without UI.
4. **No auth**: The assignment requires frictionless onboarding. Email is captured after value is shown, not before.
5. **Controller-route separation**: Routes handle HTTP (validation, status codes). Controllers handle business logic. DB queries are separate.
