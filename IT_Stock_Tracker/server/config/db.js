import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer = null;

const connectDB = async () => {
  // ── 1. Try connecting to Atlas first ──────────────────────────────
  const mongoURI = process.env.MONGO_URI;

  if (mongoURI) {
    try {
      const conn = await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000, // fail fast (5 s) instead of hanging
        connectTimeoutMS: 10000,
      });
      console.log(`✅ MongoDB Connected (Atlas): ${conn.connection.host}`);
      return;
    } catch (error) {
      console.warn(
        `⚠️  Atlas connection failed (${error.message}). Falling back to in-memory MongoDB…`
      );
    }
  } else {
    console.warn("⚠️  MONGO_URI not set. Using in-memory MongoDB.");
  }

  // ── 2. Start an in-memory MongoDB instance as fallback ─────────────
  // mongodb-memory-server is already in your dependencies — no extra install needed.
  try {
    memoryServer = await MongoMemoryServer.create();
    const memURI = memoryServer.getUri();
    await mongoose.connect(memURI);
    console.log("🟡 MongoDB Connected (In-Memory). Data will NOT persist across restarts.");
    console.log("   Fix: Check your Atlas cluster is active & MONGO_URI is correct in server/.env");
  } catch (fallbackErr) {
    // If even the memory server fails, log clearly and exit — nothing else to do.
    console.error("❌ FATAL: Could not start any MongoDB instance:", fallbackErr.message);
    process.exit(1);
  }
};

export default connectDB;
