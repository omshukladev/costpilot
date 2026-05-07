import {
  defineWorkersConfig,
} from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig({
  test: {
    pool: "@cloudflare/vitest-pool-workers",
    wrangler: { configPath: "./wrangler.jsonc" },
    globals: true,
  },
});

