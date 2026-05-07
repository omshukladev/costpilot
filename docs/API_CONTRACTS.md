# API Contracts

## Planned API Routes

### POST /audit

Purpose:
- generate audit result

Input:
- tool selections
- pricing information
- team size
- use case

Output:
- recommendations
- savings
- summary data

---

### POST /lead

Purpose:
- capture optional lead information

Input:
- email
- company name
- role
- team size

---

### GET /report/:id

Purpose:
- retrieve public report

Output:
- sanitized audit data
- recommendations
- savings information

---

# API Rules

- Validate all input
- Return consistent response structures
- Never expose sensitive lead data