import { nanoid } from "nanoid";
import { insertLead } from "../db/queries";

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

    // Send confirmation email via Resend
    await sendEmail(c.env, body.email);

    return c.json({ success: true, id });
  } catch (err) {
    console.error("Lead error:", err);
    return c.json({ error: "Failed to save lead" }, 500);
  }
}

async function sendEmail(
  env: {
    RESEND_API_KEY?: string;
    RESEND_FROM_EMAIL?: string;
    RESEND_FROM_NAME?: string;
  },
  to: string,
) {
  const apiKey = env.RESEND_API_KEY;
  const fromEmail = env.RESEND_FROM_EMAIL?.trim();
  const fromName = env.RESEND_FROM_NAME?.trim() || "CostPilot";

  if (!apiKey) {
    console.log("RESEND_API_KEY not set, skipping email");
    return;
  }

  if (!fromEmail) {
    console.log("RESEND_FROM_EMAIL not set, skipping email");
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to,
        subject: "Your CostPilot Audit Report",
        html: `<p>Thanks for using CostPilot!</p>
<p>Your AI spend audit has been saved. You can access your report anytime using the unique link.</p>
<p>If you have high savings opportunities, the Credex team will reach out to help you capture those savings.</p>
<p>— CostPilot Team</p>`,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Resend rejected email:", response.status, errorBody);
    }
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}
