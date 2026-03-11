import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2, "First Name must be at least 2 characters"),
  email: z.string().email("Invalid email").endsWith("@gmail.com", "Only @gmail.com emails are allowed"),
  restaurantName: z.string().min(2, "Restaurant Name must be at least 2 characters"),
  restaurantCompany: z.string().optional(),
  restaurantAddress: z.string().min(5, "Restaurant Address must be at least 5 characters").optional(),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("billify");
    const users = db.collection("users");

    const user = await users.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the safe user data
    return NextResponse.json({
      name: user.name,
      email: user.email,
      restaurantName: user.restaurantName || "",
      restaurantCompany: user.restaurantCompany || user.restaurantName || "",
      restaurantAddress: user.restaurantAddress || "",
    }, { status: 200 });
  } catch (error: any) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = updateProfileSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input data", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { name, email, restaurantName, restaurantCompany, restaurantAddress } = validation.data;

    const client = await clientPromise;
    const db = client.db("billify");
    const users = db.collection("users");

    // Do not allow email updates securely unless we do email verification (for now keep it simple or allow if unique)
    if (email !== session.user.email) {
      const existingUser = await users.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 });
      }
    }

    await users.updateOne(
      { email: session.user.email },
      {
        $set: {
          name,
          email,
          restaurantName,
          restaurantCompany,
          restaurantAddress,
        }
      }
    );

    // Note: If email is updated, the session will be desynced. We should ideally update session too,
    // but in this initial pass, we update the DB.

    return NextResponse.json({ success: true, message: "Profile updated successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
