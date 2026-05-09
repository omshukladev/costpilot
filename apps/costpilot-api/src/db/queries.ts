import type { AuditInput, Recommendation, LeadInput } from "@costpilot/shared";

// --- Audits ---

export interface AuditRow {
  id: string;
  public_id: string;
  tools_json: string;
  recommendations_json: string;
  monthly_savings: number;
  yearly_savings: number;
  summary: string;
  created_at: string;
}

export async function insertAudit(
  db: D1Database,
  audit: {
    id: string;
    publicId: string;
    input: AuditInput;
    recommendations: Recommendation[];
    monthlySavings: number;
    yearlySavings: number;
    summary: string;
    createdAt: string;
  }
) {
  await db
    .prepare(
      `INSERT INTO audits (id, public_id, tools_json, recommendations_json, monthly_savings, yearly_savings, summary, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      audit.id,
      audit.publicId,
      JSON.stringify(audit.input.tools),
      JSON.stringify(audit.recommendations),
      audit.monthlySavings,
      audit.yearlySavings,
      audit.summary,
      audit.createdAt
    )
    .run();
}

export async function getAuditById(
  db: D1Database,
  id: string
): Promise<AuditRow | null> {
  const row = await db
    .prepare("SELECT * FROM audits WHERE id = ?")
    .bind(id)
    .first<AuditRow>();

  return row || null;
}

export async function getAuditByPublicId(
  db: D1Database,
  publicId: string
): Promise<AuditRow | null> {
  const row = await db
    .prepare("SELECT * FROM audits WHERE public_id = ?")
    .bind(publicId)
    .first<AuditRow>();

  return row || null;
}

// --- Leads ---

export async function insertLead(
  db: D1Database,
  lead: LeadInput & { id: string; createdAt: string }
) {
  await db
    .prepare(
      `INSERT INTO leads (id, email, company_name, role, team_size, audit_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      lead.id,
      lead.email,
      lead.companyName || null,
      lead.role || null,
      lead.teamSize || null,
      lead.auditId,
      lead.createdAt
    )
    .run();
}
