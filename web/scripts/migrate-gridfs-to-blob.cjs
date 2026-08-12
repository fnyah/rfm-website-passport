#!/usr/bin/env node
/**
 * One-time migration: copies every file out of the old Express app's GridFS
 * buckets into Vercel Blob, then rewrites the referencing documents'
 * `filename` field(s) from GridFS filenames to the new Blob URLs.
 *
 * Non-destructive: GridFS files are never deleted, and each document's
 * original filename value is preserved under `_legacyFilename` (or
 * `_legacyFilename` array) before being overwritten, so this can be
 * cross-checked or rolled back by hand if needed.
 *
 * Usage:
 *   MONGO_URI=... BLOB_READ_WRITE_TOKEN=... node scripts/migrate-gridfs-to-blob.cjs --dry-run
 *   MONGO_URI=... BLOB_READ_WRITE_TOKEN=... node scripts/migrate-gridfs-to-blob.cjs
 *
 * Always run with --dry-run first and check the report before running for real.
 */
const { MongoClient, GridFSBucket } = require("mongodb");
const { put } = require("@vercel/blob");

const DRY_RUN = process.argv.includes("--dry-run");

// bucket name -> { collection, field, kind: "single" | "array" }
const MIGRATIONS = [
  { bucket: "uploads", collection: "photolinks", field: "filename", kind: "single" },
  { bucket: "projectphotos", collection: "projects", field: "filename", kind: "array" },
  { bucket: "blogphotos", collection: "blogs", field: "filename", kind: "array" },
];

function assertEnv() {
  const required = DRY_RUN ? ["MONGO_URI"] : ["MONGO_URI", "BLOB_READ_WRITE_TOKEN"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error(`Missing required environment variable(s): ${missing.join(", ")}`);
    process.exit(1);
  }
}

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function migrateBucket(db, bucketName) {
  const bucket = new GridFSBucket(db, { bucketName });
  const files = await bucket.find().toArray();
  console.log(`\n[${bucketName}] ${files.length} file(s) found`);

  /** @type {Map<string, string>} old GridFS filename -> new Blob URL */
  const urlByFilename = new Map();

  for (const file of files) {
    if (DRY_RUN) {
      console.log(`  (dry run) would upload ${file.filename} (${file.length} bytes)`);
      urlByFilename.set(file.filename, `https://example-dry-run.public.blob.vercel-storage.com/${file.filename}`);
      continue;
    }

    const buffer = await streamToBuffer(bucket.openDownloadStreamByName(file.filename));
    const blob = await put(file.filename, buffer, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.contentType,
    });
    urlByFilename.set(file.filename, blob.url);
    console.log(`  uploaded ${file.filename} -> ${blob.url}`);
  }

  return urlByFilename;
}

async function migrateCollection(db, { collection, field, kind }, urlByFilename) {
  const coll = db.collection(collection);
  const docs = await coll.find({ [field]: { $exists: true, $ne: kind === "array" ? [] : null } }).toArray();

  let updated = 0;
  let skipped = 0;

  for (const doc of docs) {
    if (kind === "single") {
      const oldValue = doc[field];
      const newUrl = urlByFilename.get(oldValue);
      if (!newUrl) {
        skipped++;
        continue;
      }
      console.log(`  ${collection}/${doc._id}: ${oldValue} -> ${newUrl}`);
      if (!DRY_RUN) {
        await coll.updateOne(
          { _id: doc._id },
          { $set: { [field]: newUrl, _legacyFilename: oldValue } }
        );
      }
      updated++;
    } else {
      const oldValues = Array.isArray(doc[field]) ? doc[field] : [];
      const newValues = oldValues.map((v) => urlByFilename.get(v) ?? v);
      const anyMigrated = oldValues.some((v) => urlByFilename.has(v));
      if (!anyMigrated) {
        skipped++;
        continue;
      }
      console.log(`  ${collection}/${doc._id}: [${oldValues.join(", ")}] -> [${newValues.join(", ")}]`);
      if (!DRY_RUN) {
        await coll.updateOne(
          { _id: doc._id },
          { $set: { [field]: newValues, _legacyFilename: oldValues } }
        );
      }
      updated++;
    }
  }

  console.log(`  ${collection}: ${updated} document(s) updated, ${skipped} skipped (no matching files)`);
}

async function main() {
  assertEnv();
  if (DRY_RUN) console.log("Running in --dry-run mode: no uploads or writes will happen.\n");

  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db();

  try {
    for (const migration of MIGRATIONS) {
      const urlByFilename = await migrateBucket(db, migration.bucket);
      await migrateCollection(db, migration, urlByFilename);
    }
  } finally {
    await client.close();
  }

  console.log(DRY_RUN ? "\nDry run complete. Re-run without --dry-run to migrate for real." : "\nMigration complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
