import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clientPromise;
  const db = client.db("billify");
  const items = await db.collection("items")
    .find({ userId: session.user.id })
    .toArray();

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, price, status, categoryId } = await request.json();

  const client = await clientPromise;
  const db = client.db("billify");
  const result = await db.collection("items").insertOne({
    name,
    price,
    status: status || "Available",
    categoryId,
    userId: session.user.id,
    createdAt: new Date(),
  });

  return NextResponse.json(result, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, name, price, status } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing item ID" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("billify");
  
  const result = await db.collection("items").updateOne(
    { _id: new ObjectId(id), userId: session.user.id },
    { $set: { name, price, status, updatedAt: new Date() } }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Item updated successfully" });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing item ID" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("billify");

  const result = await db.collection("items").deleteOne({
    _id: new ObjectId(id),
    userId: session.user.id,
  });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Item deleted successfully" });
}
