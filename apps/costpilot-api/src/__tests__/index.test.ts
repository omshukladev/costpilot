/// <reference types="@cloudflare/vitest-pool-workers" />
/// <reference types="vitest/globals" />
import { env } from "cloudflare:workers";
import app from "../index";

it("GET /message returns Hello Hono!", async () => {
  const res = await app.request("/message", {}, env);
  expect(res.status).toBe(200);
  expect(await res.text()).toBe("Hello Hono!");
});

it("GET /unknown returns 404", async () => {
  const res = await app.request("/unknown", {}, env);
  expect(res.status).toBe(404);
});
