import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clientPromise;
  const db = client.db("billify");
  const billers = await db.collection("billers")
    .find({ userId: session.user.id })
    .toArray();

  return NextResponse.json(billers);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, password, email, phone, initial } = await request.json();

  const client = await clientPromise;
  const db = client.db("billify");
  const result = await db.collection("billers").insertOne({
    name,
    password,
    email,
    phone,
    initial: initial || name.charAt(0).toUpperCase(),
    userId: session.user.id,
    createdAt: new Date(),
  });

  return NextResponse.json(result, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, name, password, email, phone } = await request.json();

  const client = await clientPromise;
  const db = client.db("billify");
  const result = await db.collection("billers").updateOne(
    { _id: new ObjectId(id), userId: session.user.id },
    {
      $set: {
        name,
        password,
        email,
        phone,
        updatedAt: new Date(),
      }
    }
  );

  return NextResponse.json(result);
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("billify");
  const result = await db.collection("billers").deleteOne({
    _id: new ObjectId(id),
    userId: session.user.id
  });

  return NextResponse.json(result);
}
