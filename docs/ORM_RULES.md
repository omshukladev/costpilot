# ORM Rules

## ORM Stack

- Drizzle ORM
- Cloudflare D1

---

# ORM Philosophy

Use Drizzle as a lightweight type-safe ORM layer.

Prioritize:
- readable schema definitions
- typed queries
- predictable migrations
- maintainable database access

Avoid:
- unnecessary query abstraction
- deeply nested ORM wrappers
- overengineered repositories

---

# Schema Rules

- Keep schema centralized
- Use descriptive naming
- Keep tables minimal
- Prefer explicit column definitions

---

# Query Rules

- Keep queries readable
- Prefer straightforward database access
- Avoid hiding business logic inside ORM utilities

---

# Migration Rules

- Use migration-based schema updates
- Keep migrations small and descriptive
- Never manually mutate production schema

---

# Important Principle

The ORM should simplify development, not hide database behavior.