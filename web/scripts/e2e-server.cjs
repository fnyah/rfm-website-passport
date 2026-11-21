/**
 * Playwright webServer command: starts a seeded in-memory MongoDB (the same
 * fixtures as `npm run dev:seed`), then builds and serves the app in
 * production mode against it. Set E2E_SKIP_BUILD=1 to reuse an existing
 * .next build (CI builds in an earlier step).
 */
const { spawn, spawnSync } = require("child_process");
const path = require("path");
const { startSeededMongo } = require("./seed.cjs");

const port = process.env.E2E_PORT ?? "3210";
const cwd = path.join(__dirname, "..");
const next = path.join(cwd, "node_modules", ".bin", "next");

async function main() {
  const { mongod, uri } = await startSeededMongo();
  const env = {
    ...process.env,
    NODE_ENV: "production",
    MONGO_URI: uri,
    AUTH_SECRET: process.env.AUTH_SECRET ?? "e2e-only-secret-not-used-anywhere-else",
  };

  if (process.env.E2E_SKIP_BUILD !== "1") {
    const build = spawnSync(next, ["build"], { cwd, env, stdio: "inherit" });
    if (build.status !== 0) {
      await mongod.stop();
      process.exit(build.status ?? 1);
    }
  }

  const app = spawn(next, ["start", "-p", port], { cwd, env, stdio: "inherit" });
  const stop = async () => {
    app.kill("SIGTERM");
    await mongod.stop();
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
  app.on("exit", async (code) => {
    await mongod.stop();
    process.exit(code ?? 1);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
