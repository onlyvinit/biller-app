import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clientPromise;
  const db = client.db("billify");
  const invoices = await db.collection("invoices")
    .find({ userId: session.user.id })
    .sort({ date: -1 })
    .toArray();

  return NextResponse.json(invoices);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { clientName, amount, status, date } = await request.json();

  const client = await clientPromise;
  const db = client.db("billify");
  const result = await db.collection("invoices").insertOne({
    invoiceId: `INV-${Date.now().toString().slice(-6)}`,
    clientName,
    amount,
    status,
    date: date || new Date().toISOString(),
    userId: session.user.id,
    createdAt: new Date(),
  });

  return NextResponse.json(result, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, clientName, amount, status, date } = await request.json();

  const client = await clientPromise;
  const db = client.db("billify");
  const result = await db.collection("invoices").updateOne(
    { _id: new ObjectId(id), userId: session.user.id },
    {
      $set: {
        clientName,
        amount,
        status,
        date,
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
  const result = await db.collection("invoices").deleteOne({
    _id: new ObjectId(id),
    userId: session.user.id
  });

  return NextResponse.json(result);
}
