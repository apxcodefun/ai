// lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB;

if (!MONGODB_URI) {
  throw new Error(
    "MongoDB URI tidak ditemukan di environment variables. Pastikan MONGODB sudah diatur."
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Jika sudah terkoneksi, langsung kembalikan koneksi yang ada
  if (cached.conn) {
    return cached.conn;
  }

  // Jika belum ada promise yang menangani koneksi, buat koneksi baru
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("MongoDB connected successfully");
        return mongoose;
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

export default connectDB;
