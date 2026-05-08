import { Hono } from "hono";
import { cors } from "hono/cors";
import { rateLimit } from "./middleware/rate-limit";
import { auditRoute } from "./routes/audit";
import { leadRoute } from "./routes/lead";
import { reportRoute } from "./routes/report";

export type Env = {
  costpilot_db: D1Database;
  GEMINI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  RESEND_FROM_NAME?: string;
  ENVIRONMENT?: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use("/*", cors());

// Rate limit POST endpoints: 10 requests per 60 seconds per IP
app.use("/audit", rateLimit(10, 60000));
app.use("/lead", rateLimit(10, 60000));

app.get("/message", (c) => c.text("Hello Hono!"));
app.route("/audit", auditRoute);
app.route("/lead", leadRoute);
app.route("/report", reportRoute);

export default app;
