# Database Schema

## Planned Tables

## ORM

Database access uses:
- Drizzle ORM
- Cloudflare D1

Schema definitions and migrations should remain type-safe and centralized.

### audits

Stores audit results and public report information.

Planned fields:
- id
- public_id
- tools_json
- recommendations_json
- monthly_savings
- yearly_savings
- summary
- created_at

---

### leads

Stores optional lead capture information.

Planned fields:
- id
- email
- company_name
- role
- team_size
- audit_id
- created_at

---

# Important Rules

- Public reports must never expose sensitive lead information
- Separate public report data from lead capture data
- Keep schema minimal and focused