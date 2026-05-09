import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import * as Lead from "../controllers/lead";

const leadSchema = z.object({
  email: z.string().email(),
  companyName: z.string().optional(),
  role: z.string().optional(),
  teamSize: z.number().optional(),
  auditId: z.string().min(1),
  totalMonthlySavings: z.number().optional(),
  publicId: z.string().optional(),
});

const leadRoute = new Hono();

leadRoute.post("/", zValidator("json", leadSchema), Lead.create);

export { leadRoute };
