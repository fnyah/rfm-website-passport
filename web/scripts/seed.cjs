/**
 * Local-only smoke-test helper: spins up an in-memory MongoDB, seeds it with
 * fixture documents matching the real collection names/shapes, writes the
 * connection string to .env.local, and stays running so `next dev` can use
 * it. NOT part of the app or the deploy — dev tooling only, safe to delete.
 */
const { MongoMemoryServer } = require("mongodb-memory-server");
const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

async function main() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri("rfm_dev");

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("rfm_dev");

  const now = new Date();

  await db.collection("homes").insertMany([
    {
      title: "Public History Field School",
      description:
        "<p>A hands-on course exploring <strong>archives, museums, and community history</strong> across Toronto.</p>",
      createdAt: now,
    },
    {
      title: "Curriculum & Teaching Methods",
      description:
        "<p>Graduate coursework on teaching history in secondary classrooms, with an emphasis on primary sources.</p>",
      createdAt: now,
    },
  ]);

  await db.collection("photolinks").insertMany([
    {
      filename: "https://picsum.photos/seed/rfm1/600/600",
      link: "https://example.com/project-one",
      description: "Student exhibit: Toronto in the 1920s",
      createdAt: now,
    },
    {
      filename: "https://picsum.photos/seed/rfm2/600/600",
      description: "Archives visit, Fall 2024",
      createdAt: now,
    },
    {
      filename: "https://picsum.photos/seed/rfm3/600/600",
      link: "https://example.com/project-two",
      createdAt: now,
    },
    {
      filename: "https://picsum.photos/seed/rfm4/600/600",
      createdAt: now,
    },
  ]);

  await db.collection("standings").insertMany([
    { information: "<p>President, Ontario History and Social Sciences Teachers&rsquo; Association</p>", createdAt: now },
    { information: "<p>Editorial Board, <em>Canadian Journal of History Education</em></p>", createdAt: now },
  ]);

  await db.collection("events").insertMany([
    { eventDate: "March 2026", information: "Keynote at the Ontario History Educators Conference", createdAt: now },
  ]);

  await db.collection("projects").insertMany([
    {
      title: "Mapping Kensington Market",
      author: "J. Alvarez & R. Chen",
      description: "<p>An oral-history mapping project documenting <strong>Kensington Market</strong> through resident interviews.</p>",
      filename: ["https://picsum.photos/seed/proj1/500/500", "https://picsum.photos/seed/proj2/500/500"],
      videoLink: [],
      createdAt: now,
    },
    {
      title: "Redlining in Toronto",
      author: "S. Okafor",
      description: "<p>A public history exhibit on housing discrimination and its lasting effects.</p>",
      filename: [],
      videoLink: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
      createdAt: now,
    },
  ]);

  await db.collection("blogs").insertMany([
    {
      title: "Teaching with Primary Sources",
      description: "<p>A short guide to bringing archival documents into the secondary classroom.</p>",
      filename: ["https://picsum.photos/seed/blog1/500/500"],
      links: ["https://www.archives.gov/education", "https://example.com/lesson-plan"],
      createdAt: now,
    },
  ]);

  // Password is "devpassword123" — pbkdf2 hash generated with the app's own
  // src/lib/password.ts algorithm so Auth.js sign-in can be smoke-tested too.
  const crypto = require("crypto");
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto.pbkdf2Sync("devpassword123", salt, 10000, 64, "sha512").toString("hex");
  await db.collection("users").insertOne({ username: "admin", hash, salt, admin: true });

  await client.close();

  const envPath = path.join(__dirname, "..", ".env.local");
  const existing = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  const withoutMongo = existing
    .split("\n")
    .filter((line) => !line.startsWith("MONGO_URI="))
    .join("\n");
  fs.writeFileSync(envPath, `${withoutMongo}\nMONGO_URI=${uri}\n`.trimStart() + "\n");

  console.log("Seeded in-memory MongoDB at", uri);
  console.log("Wrote MONGO_URI to .env.local");
  console.log("Dev login: username=admin password=devpassword123");
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
