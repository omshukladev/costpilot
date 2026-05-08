import { Hono } from "hono";
import * as Report from "../controllers/report";

const reportRoute = new Hono();

reportRoute.get("/:publicId", Report.get);

export { reportRoute };
