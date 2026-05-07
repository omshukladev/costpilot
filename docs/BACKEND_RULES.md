# Backend Rules

## Backend Stack

- Cloudflare Workers
- Hono
- D1 (raw SQL)
- Zod
- Vitest
- Resend

---

# Backend Philosophy

Backend should remain:
- lightweight
- organized
- maintainable
- serverless-first

Avoid:
- unnecessary abstractions
- microservice patterns
- premature optimization

---

# Route Structure

Use:

```
routes  →  services  →  database
```

Controllers should remain thin.

---

# Validation Rules

Use Zod for:
- request validation
- response validation
- schema consistency

Never trust frontend validation alone.

---

# Database Rules

Use:
- raw SQL with D1
- prepared statements for user input
- explicit schema via `schema.sql`

Avoid:
- ORM layers
- database logic inside controllers
- untyped queries

---

# Error Handling

- Return consistent API responses
- Avoid leaking internal errors
- Log useful debugging information
- Handle edge cases gracefully

---

# API Rules

- Keep APIs predictable
- Prefer RESTful structure
- Use clear naming
- Validate all input

---

# Security Rules

- Never expose secrets
- Validate all user input
- Implement basic rate limiting
- Sanitize public report data

---

# AI Integration Rules

AI should ONLY generate:
- personalized summaries

AI should NOT:
- generate financial calculations
- decide pricing logic
- replace deterministic audit rules

---

# Important Rule

Business logic should remain explainable and deterministic.