import { Hono } from "hono";
import { cors } from "hono/cors";
import { auditRoute } from "./routes/audit";
import { leadRoute } from "./routes/lead";
import { reportRoute } from "./routes/report";

export type Env = {
  costpilot_db: D1Database;
  GEMINI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  RESEND_API_KEY?: string;
  ENVIRONMENT?: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use("/*", cors());

app.get("/message", (c) => c.text("Hello Hono!"));
app.route("/audit", auditRoute);
app.route("/lead", leadRoute);
app.route("/report", reportRoute);

export default app;
