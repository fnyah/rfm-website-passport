import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this directory — the old Express app's
  // package-lock.json one level up would otherwise make Next.js guess.
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      // Vercel Blob serves uploaded photos from a per-store subdomain of this host.
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // picsum.photos is only used by scripts/dev-seed.cjs for local smoke
      // testing with placeholder images — never reachable in production.
      ...(process.env.NODE_ENV !== "production"
        ? [{ protocol: "https" as const, hostname: "picsum.photos" }]
        : []),
    ],
  },
};

export default nextConfig;
