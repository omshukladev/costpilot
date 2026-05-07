# Database Schema

## Stack

- Cloudflare D1
- Raw SQL

---

## Tables

### audits

Stores audit results and public report information.

| Column | Type | Notes |
|--------|------|-------|
| id | TEXT | Primary key, generated via nanoid |
| public_id | TEXT | Unique, short ID for shareable URLs |
| tools_json | TEXT | JSON array of tool entries |
| recommendations_json | TEXT | JSON array of recommendations |
| monthly_savings | REAL | Total monthly savings |
| yearly_savings | REAL | Total yearly savings |
| summary | TEXT | AI-generated summary paragraph |
| created_at | TEXT | ISO 8601 timestamp |

### leads

Stores optional lead capture information.

| Column | Type | Notes |
|--------|------|-------|
| id | TEXT | Primary key, generated via nanoid |
| email | TEXT | User email (required) |
| company_name | TEXT | Optional |
| role | TEXT | Optional |
| team_size | INTEGER | Optional |
| audit_id | TEXT | Foreign key to audits.id |
| created_at | TEXT | ISO 8601 timestamp |

---

# Important Rules

- Public reports must never expose sensitive lead information
- Separate public report data from lead capture data
- Keep schema minimal and focused
- Use raw SQL — no ORM