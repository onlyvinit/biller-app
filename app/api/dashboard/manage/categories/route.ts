import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clientPromise;
  const db = client.db("billify");
  const categories = await db.collection("categories")
    .find({ userId: session.user.id })
    .toArray();

  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await request.json();

  const client = await clientPromise;
  const db = client.db("billify");
  const result = await db.collection("categories").insertOne({
    name,
    userId: session.user.id,
    createdAt: new Date(),
  });

  return NextResponse.json(result, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, name } = await request.json();
  if (!id || !name) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("billify");
  
  const result = await db.collection("categories").updateOne(
    { _id: new ObjectId(id), userId: session.user.id },
    { $set: { name, updatedAt: new Date() } }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Category updated successfully" });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing category ID" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("billify");

  // Also delete items belonging to this category
  await db.collection("items").deleteMany({ categoryId: id, userId: session.user.id });
  
  const result = await db.collection("categories").deleteOne({
    _id: new ObjectId(id),
    userId: session.user.id,
  });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Category deleted successfully" });
}
