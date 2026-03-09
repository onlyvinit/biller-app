import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clientPromise;
  const db = client.db("billify");
  const userId = session.user.id;

  // Aggregate stats
  const totalRevenue = await db.collection("invoices")
    .aggregate([
      { $match: { userId, status: "Paid" } },
      { $group: { _id: null, total: { $sum: { $toDouble: { $replaceAll: { input: { $replaceAll: { input: "$amount", find: "$", replacement: "" } }, find: ",", replacement: "" } } } } } }
    ]).toArray();

  const invoiceCount = await db.collection("invoices").countDocuments({ userId });
  const billerCount = await db.collection("billers").countDocuments({ userId });

  // Recent transactions
  const recentInvoices = await db.collection("invoices")
    .find({ userId })
    .sort({ date: -1 })
    .limit(5)
    .toArray();

  return NextResponse.json({
    totalRevenue: totalRevenue[0]?.total || 0,
    invoiceCount,
    billerCount,
    recentInvoices
  });
}
