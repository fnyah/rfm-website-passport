/**
 * Local-only smoke-test helper: spins up a seeded in-memory MongoDB (see
 * scripts/seed.cjs), writes the connection string to .env.local, and stays
 * running so `next dev` can use it. NOT part of the app or the deploy — dev
 * tooling only, safe to delete.
 */
const fs = require("fs");
const path = require("path");
const { startSeededMongo, ADMIN } = require("./seed.cjs");

async function main() {
  const { mongod, uri } = await startSeededMongo();

  const envPath = path.join(__dirname, "..", ".env.local");
  const existing = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  const withoutMongo = existing
    .split("\n")
    .filter((line) => !line.startsWith("MONGO_URI="))
    .join("\n");
  fs.writeFileSync(envPath, `${withoutMongo}\nMONGO_URI=${uri}\n`.trimStart() + "\n");

  console.log("Seeded in-memory MongoDB at", uri);
  console.log("Wrote MONGO_URI to .env.local");
  console.log(`Dev login: username=${ADMIN.username} password=${ADMIN.password}`);
  console.log("Press Ctrl+C to stop.");

  // Keep process alive so the mongod child process keeps running.
  process.stdin.resume();
  process.on("SIGINT", async () => {
    await mongod.stop();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
