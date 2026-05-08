import { nanoid } from "nanoid";
import { insertLead } from "../db/queries";

const leadSchema = {
  email: { type: "string" },
  companyName: { type: "string", optional: true },
  role: { type: "string", optional: true },
  teamSize: { type: "number", optional: true },
  auditId: { type: "string" },
};

export async function create(c: any) {
  try {
    const body = c.req.valid("json");
    const id = nanoid();

    await insertLead(c.env.costpilot_db, {
      id,
      email: body.email,
      companyName: body.companyName || null,
      role: body.role || null,
      teamSize: body.teamSize || null,
      auditId: body.auditId,
      createdAt: new Date().toISOString(),
    });

    return c.json({ success: true, id });
  } catch (err) {
    console.error("Lead error:", err);
    return c.json({ error: "Failed to save lead" }, 500);
  }
}
