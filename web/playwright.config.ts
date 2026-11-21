import { defineConfig, devices } from "@playwright/test";

const port = process.env.E2E_PORT ?? "3210";
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./e2e",
  // The tests share one seeded database, and the admin test changes it.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "node scripts/e2e-server.cjs",
    url: baseURL,
    // Builds first unless E2E_SKIP_BUILD=1, so allow time for that.
    timeout: 240_000,
    reuseExistingServer: false,
    stdout: "pipe",
    env: { E2E_PORT: port },
  },
});
