import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { jwtVerify } from "jose";

const resetPasswordSchema = z.object({
  sessionToken: z.string(),
  password: z.string()
    .min(8)
    .regex(/[0-9]/)
    .regex(/[^a-zA-Z0-9]/),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input data", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { sessionToken, password } = body;

    // Verify session token
    let payload;
    try {
      const secretKey = "secret";
      const key = new TextEncoder().encode(process.env.JWT_SECRET || secretKey);
      const result = await jwtVerify(sessionToken, key, { algorithms: ["HS256"] });
      payload = result.payload;
    } catch (err) {
      return NextResponse.json(
        { error: "Session expired or invalid. Please request a new OTP." },
        { status: 401 }
      );
    }

    if (payload.intent !== "password_reset" || !payload.email) {
      return NextResponse.json(
        { error: "Invalid token type" },
        { status: 400 }
      );
    }

    const email = payload.email as string;

    const client = await clientPromise;
    const db = client.db("billify");
    const users = db.collection("users");
    
    // Check if user exists
    const existingUser = await users.findOne({ email });
    if (!existingUser) {
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user
    await users.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    return NextResponse.json({ success: true, message: "Password updated successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
