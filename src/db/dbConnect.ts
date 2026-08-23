import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function dbConnect() {
  // If already connected and db is accessible, reuse
  if (cached.conn && mongoose.connection.readyState === 1 && mongoose.connection.db) {
    return cached.conn;
  }

  // If a connection is in progress, wait for it
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI!)
      .then((m) => {
        console.log("Database connected");
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;

    // Ensure db is fully ready (sometimes connect resolves before db is accessible)
    if (!mongoose.connection.db) {
      await new Promise<void>((resolve) => {
        if (mongoose.connection.db) {
          resolve();
        } else {
          mongoose.connection.once("open", () => resolve());
        }
      });
    }
  } catch (error: any) {
    cached.promise = null;
    cached.conn = null;
    console.error("Database connection failed:", error);
    throw new Error(`Database connection failed: ${error.message}`);
  }

  return cached.conn;
}
