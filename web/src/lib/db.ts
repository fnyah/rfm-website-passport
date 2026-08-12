import mongoose from "mongoose";

function getMongoUri(): string {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error(
      "MONGO_URI is not set. Add it to web/.env.local (see .env.example)."
    );
  }
  return uri;
}

const MONGO_URI = getMongoUri();

/**
 * Next.js reuses modules across hot reloads in dev and across invocations in
 * serverless, so we cache the connection promise on the global object to
 * avoid opening a new MongoDB connection on every request.
 */
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global._mongooseCache ?? {
  conn: null,
  promise: null,
};
global._mongooseCache = cache;

export async function connectToDatabase() {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
