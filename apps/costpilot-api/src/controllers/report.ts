import { getAuditByPublicId } from "../db/queries";

export async function get(c: any) {
  try {
    const publicId = c.req.param("publicId");
    const audit = await getAuditByPublicId(c.env.costpilot_db, publicId);

    if (!audit) {
      return c.json({ error: "Report not found" }, 404);
    }

    return c.json({
      publicId: audit.public_id,
      tools: JSON.parse(audit.tools_json),
      recommendations: JSON.parse(audit.recommendations_json),
      totalMonthlySavings: audit.monthly_savings,
      totalYearlySavings: audit.yearly_savings,
      summary: audit.summary,
      summarySource: audit.summary_source,
      createdAt: audit.created_at,
    });
  } catch (err) {
    console.error("Report error:", err);
    return c.json({ error: "Failed to fetch report" }, 500);
  }
}
