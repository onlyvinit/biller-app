import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clientPromise;
  const db = client.db("billify");
  const collection = db.collection("biller_keys");

  // Ensure TTL index exists
  await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

  // Check if a valid (unexpired) key already exists for this user
  const existingKey = await collection.findOne({
    userId: session.user.id,
    expiresAt: { $gt: new Date() }
  });

  if (existingKey) {
    return NextResponse.json({ 
      key: existingKey.key, 
      expiresAt: existingKey.expiresAt,
      message: "An active key already exists." 
    }, { status: 200 });
  }

  // Generate a unique secure key: mixed small, capital, num and sign
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let key = "";
  for (let i = 0; i < 12; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes from now

  const result = await collection.insertOne({
    key,
    userId: session.user.id,
    createdAt: new Date(),
    expiresAt,
  });

  return NextResponse.json({ key, expiresAt, result }, { status: 201 });
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clientPromise;
  const db = client.db("billify");
  
  // Find the latest unexpired key for the user
  const activeKey = await db.collection("biller_keys")
    .findOne({ 
      userId: session.user.id,
      expiresAt: { $gt: new Date() }
    }, {
      sort: { expiresAt: -1 }
    });

  return NextResponse.json(activeKey);
}
