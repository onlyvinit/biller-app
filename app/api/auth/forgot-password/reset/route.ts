import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const resetPasswordSchema = z.object({
  email: z.string().email().endsWith("@gmail.com"),
  otp: z.string().length(6),
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

    const { email, otp, password } = body;

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

    // Verify OTP
    const otps = db.collection("otps");
    const otpDoc = await otps.findOne({ email });

    if (!otpDoc) {
      return NextResponse.json(
        { error: "OTP expired or not found. Please request a new one." },
        { status: 400 }
      );
    }

    const isValidOtp = await bcrypt.compare(otp, otpDoc.otp);
    if (!isValidOtp) {
      return NextResponse.json(
        { error: "Invalid OTP provided" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user
    await users.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    // Clean up OTP to prevent reuse
    await otps.deleteOne({ email });

    return NextResponse.json({ success: true, message: "Password updated successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
