# ORM / Database Rules

## Database Stack

- Cloudflare D1
- Raw SQL

---

## Database Philosophy

Use raw SQL for database access. No ORM layer.

Prioritize:
- readable SQL queries
- explicit schema management
- straightforward database access

Avoid:
- ORM abstraction layers
- hidden query generation
- unnecessary complexity

---

## Schema Rules

- Keep DDL in a single `schema.sql` file
- Use descriptive table and column names
- Keep tables minimal
- Run schema against D1 via `wrangler d1 execute`

---

## Query Rules

- Write explicit SQL queries
- Use prepared statements for user input
- Keep queries readable
- Avoid hiding business logic inside query helpers

---

## Migration Rules

- Use `wrangler d1 migrations` for schema changes
- Keep migrations small and descriptive
- Never manually mutate production schema

---

## Important Principle

Raw SQL keeps database behavior visible and predictable.