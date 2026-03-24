import mongoose from "mongoose"
import { ca } from "zod/locales";

const MONGODB_URI=process.env.MONGODB_URI;

if(!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

declare global {
  var mongooseCached: {
    conn: typeof mongoose | null,
    promise: Promise<typeof mongoose> | null,
  }
}

let cached = global.mongooseCached || {
  conn: null,
  promise: null,
}

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      //do not que command if the connection is slow
      bufferCommands: false
    })
  }
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }

  console.info("Connected to MongoDB");
  return cached.conn;
}