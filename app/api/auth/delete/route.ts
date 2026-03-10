import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { getSession, logout } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function DELETE() {
  try {
    const session = await getSession();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const client = await clientPromise;
    const db = client.db("billify");
    
    // Attempt to delete related data - billers and invoices.
    const billers = db.collection("billers");
    const invoices = db.collection("invoices");

    await billers.deleteMany({ userId });
    await invoices.deleteMany({ userId });

    // Delete the user
    const users = db.collection("users");
    const result = await users.deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Destroy session cookie
    await logout();

    return NextResponse.json({ success: true, message: "Account deleted successfully" });
  } catch (error: any) {
    console.error("Delete account error:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
