# Dr. Rose Fine-Meyer — website (Next.js rework)

This is the Next.js rebuild of the site, replacing the old Express/EJS app in the
parent directory. It keeps the same MongoDB database and admin login, but has a
new public-facing design and a redesigned admin panel built for someone without
a technical background to use confidently.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **MongoDB / Mongoose** — same database as the old app; collections are
  unchanged (see "Data model" below)
- **Auth.js (NextAuth v5)** — credentials login against the existing `User`
  collection; the current admin password keeps working
- **Vercel Blob** — photo storage (replaces the old GridFS-in-MongoDB approach)
- **Tailwind CSS + shadcn/ui** (Base UI primitives) — design system for both
  the public site and the admin panel
- **Tiptap** — the admin panel's rich-text editor (bold/italic/links/lists only)

## Local development

1. Copy `.env.example` to `.env.local` and fill in:
   - `MONGO_URI` — same connection string the old app uses
   - `AUTH_SECRET` — generate with `npx auth secret`
   - `BLOB_READ_WRITE_TOKEN` — from the Vercel dashboard (Storage → Blob),
     only needed to test photo uploads

   Don't have real credentials handy? Run `npm run dev:seed` instead — it
   spins up a temporary in-memory MongoDB with sample content, writes
   `MONGO_URI` into `.env.local` for you, and prints a dev admin login
   (`admin` / `devpassword123`). Leave that process running in one terminal
   and start the app in another.

2. Install dependencies and start the dev server:

   ```bash
   npm install
   npm run dev
   ```

3. Visit `http://localhost:3000` for the public site, or `/login` to sign
   into the admin panel.

## Data model

The Mongo collections are unchanged from the old app (`homes`, `photolinks`,
`standings`, `events`, `projects`, `blogs`, `users`) — see `src/models/` for
the TypeScript schemas, each with a comment noting the exact collection name
it must keep pointing at. The one dropped collection is `uploadfiles`, which
was written by old code (`models/Files.js`) that no route ever actually used.

Two fields changed meaning, not shape:
- Long-text fields (`description`, `information`) now hold sanitized HTML
  from the admin panel's rich-text editor instead of plain text.
- Photo fields (`filename` on `photolinks`/`projects`/`blogs`) hold full
  Vercel Blob URLs instead of GridFS filenames, once the migration script
  below has been run.

## Migrating photos out of GridFS

The old app stored uploaded photos inside MongoDB via GridFS. This app
uploads new photos straight to Vercel Blob instead, so **existing** photos
need a one-time migration:

```bash
# 1. Dry run first — reports what it would do, makes no changes.
MONGO_URI=... npm run migrate:blob:dry-run

# 2. Then run for real.
MONGO_URI=... BLOB_READ_WRITE_TOKEN=... npm run migrate:blob
```

This is **non-destructive**: it never deletes anything from GridFS, and it
saves each document's original filename under `_legacyFilename` before
overwriting `filename` with the new Blob URL, so the change can be
cross-checked or reversed by hand if needed. See
`scripts/migrate-gridfs-to-blob.cjs` for the full logic.

## Deploying (Vercel)

1. Push this repo to GitHub (if not already) and import it into Vercel,
   setting the **project root directory to `web/`**.
2. Add the three environment variables from `.env.example` in the Vercel
   project settings (Production **and** Preview).
3. Create a Blob store under Storage → Blob if one doesn't exist yet, and
   copy its `BLOB_READ_WRITE_TOKEN` into the env vars above.
4. Deploy. Check the preview URL: click through every public page and every
   admin section (see the QA checklist below) before pointing the real
   domain at it.
5. Run the Blob migration script (above) against production data — do this
   **before** cutting over DNS, so the freshly deployed site already shows
   the migrated photo URLs on first load. Old GridFS data stays intact in
   MongoDB either way, so this step is safe to redo if needed.
6. Point `drrosefinemeyer.com`'s DNS at the new Vercel deployment. Keep the
   old Express deployment running for a little while as an instant rollback
   option.

## Pre-cutover QA checklist

- [ ] Every public page loads with real content: Home, About, Projects, For
      Educators
- [ ] Photo banner on Home, project photos, and blog photos all display
      (confirms the Blob migration worked)
- [ ] Admin sign-in works with the real admin password
- [ ] Add / edit / delete works in all four admin sections (Home text,
      Home photos, About standings, About events, Projects, For Educators)
- [ ] A newly-uploaded photo appears correctly on the public page
- [ ] Video links on a project still embed correctly
- [ ] Mobile view: public nav menu and admin sidebar both work on a phone
      width
- [ ] Signing out and visiting `/admin/home` redirects to `/login`

## Notable differences from the old app

- Admin panel is one dashboard (`/admin`) with a sidebar, instead of four
  separate "control panel" pages — see `src/components/admin/`.
- Delete actions use a real confirmation dialog instead of the browser's
  `confirm()`, and every save/delete shows a toast instead of a raw response.
- Long-text fields support basic rich text (bold, italic, links, lists).
- `middleware/prepVideoLink.js` and `middleware/addhttp.js` are ported as-is
  to `src/lib/video.ts` and `src/lib/links.ts`.
