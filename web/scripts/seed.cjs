/**
 * Shared test fixtures: starts an in-memory MongoDB and seeds it with
 * documents matching the real collection names/shapes. Used by
 * scripts/dev-seed.cjs (local smoke testing) and scripts/e2e-server.cjs
 * (Playwright). Dev tooling only — not part of the app or the deploy.
 */
const crypto = require("crypto");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { MongoClient } = require("mongodb");

const DB_NAME = "rfm_dev";
const ADMIN = { username: "admin", password: "devpassword123" };

async function seed(db) {
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
    {
      // Legacy content from the old Express app: plain text with "\n" breaks.
      title: "Legacy Oral History Seminar",
      description:
        "Students record interviews with long-time residents.\nRecordings are archived with the city.\n\nThe seminar ends with a public listening night & discussion.",
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

  // pbkdf2 hash generated with the app's own src/lib/password.ts algorithm
  // so Auth.js sign-in can be tested too.
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto.pbkdf2Sync(ADMIN.password, salt, 10000, 64, "sha512").toString("hex");
  await db.collection("users").insertOne({ username: ADMIN.username, hash, salt, admin: true });
}

/** Starts an in-memory MongoDB, seeds it, and returns its URI and server. */
async function startSeededMongo() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri(DB_NAME);
  const client = new MongoClient(uri);
  await client.connect();
  try {
    await seed(client.db(DB_NAME));
  } finally {
    await client.close();
  }
  return { mongod, uri };
}

module.exports = { startSeededMongo, ADMIN };
