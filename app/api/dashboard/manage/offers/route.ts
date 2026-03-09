import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clientPromise;
  const db = client.db("billify");
  const offers = await db.collection("offers")
    .find({ userId: session.user.id })
    .toArray();

  return NextResponse.json(offers);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, code, value, type, status } = await request.json();

  const client = await clientPromise;
  const db = client.db("billify");
  const result = await db.collection("offers").insertOne({
    title,
    code,
    value: parseFloat(value),
    type: type || "percentage",
    status: status || "Active",
    userId: session.user.id,
    createdAt: new Date(),
  });

  return NextResponse.json(result, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, title, code, value, type, status } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing offer ID" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("billify");
  
  const result = await db.collection("offers").updateOne(
    { _id: new ObjectId(id), userId: session.user.id },
    { $set: { title, code, value: parseFloat(value), type, status, updatedAt: new Date() } }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "Offer not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Offer updated successfully" });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing offer ID" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("billify");

  const result = await db.collection("offers").deleteOne({
    _id: new ObjectId(id),
    userId: session.user.id,
  });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Offer not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Offer deleted successfully" });
}
