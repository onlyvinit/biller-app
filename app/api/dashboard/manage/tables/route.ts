import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clientPromise;
  const db = client.db("billify");
  const tables = await db.collection("tables")
    .find({ userId: session.user.id })
    .toArray();

  return NextResponse.json(tables);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { tableNumber, capacity, status, location } = await request.json();

  const client = await clientPromise;
  const db = client.db("billify");
  const result = await db.collection("tables").insertOne({
    tableNumber,
    capacity,
    status: status || "Available",
    location,
    userId: session.user.id,
    createdAt: new Date(),
  });

  return NextResponse.json(result, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, tableNumber, capacity, status, location } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing table ID" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("billify");
  
  const result = await db.collection("tables").updateOne(
    { _id: new ObjectId(id), userId: session.user.id },
    { $set: { tableNumber, capacity: parseInt(capacity), status, location, updatedAt: new Date() } }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "Table not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Table updated successfully" });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing table ID" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("billify");

  const result = await db.collection("tables").deleteOne({
    _id: new ObjectId(id),
    userId: session.user.id,
  });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Table not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Table deleted successfully" });
}
