# Major Decisions

## Purpose

Tracks important architectural and product decisions made during development.

Document:

- why the decision was made
- alternatives considered
- tradeoffs accepted

---

# Decision Log

## Monorepo Architecture

Decision:

- Use PNPM workspace monorepo

Reason:

- Shared types
- Shared business logic
- Better AI context consistency
- Cleaner organization

Tradeoff:

- Slightly more setup complexity

---

## No Authentication For MVP

Decision:

- No login/signup system

Reason:

- Assignment explicitly prioritizes frictionless onboarding
- Faster iteration
- Reduced implementation complexity

Tradeoff:

- No user account persistence

---

## Drizzle ORM Adoption

Decision:

- Use Drizzle ORM with Cloudflare D1

Reason:

- Better type safety
- Cleaner schema management
- Better migration workflow
- Strong AI tooling compatibility
- Easier long-term maintainability

Tradeoff:

- Slightly more setup complexity compared to raw SQL

---

## Switched to Raw SQL

Decision:

- Use raw SQL instead of Drizzle ORM

Reason:

- Simpler setup with D1
- Fewer dependencies
- More transparent query behavior
- Faster iteration for MVP

Tradeoff:

- Lose type-safe query building
- Manual schema management

---

## Configurable Resend Sender

Decision:

- Make the Resend `from` address configurable through environment variables instead of hardcoding it

Reason:

- Transactional email deliverability depends on using a verified sender domain
- Hardcoded sender addresses make it easy to accidentally send from an unverified domain
- Logging Resend API failures makes delivery problems visible instead of silently ignored

Tradeoff:

- Requires `RESEND_FROM_EMAIL` to be set in each environment
