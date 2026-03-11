import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { SignJWT } from "jose";

const verifyOtpSchema = z.object({
  email: z.string().email().endsWith("@gmail.com"),
  otp: z.string().length(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const validation = verifyOtpSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input data", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { email, otp } = body;

    const client = await clientPromise;
    const db = client.db("billify");
    
    // Verify OTP
    const otps = db.collection("reset_otps");
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

    // Clean up OTP so it can't be reused
    await otps.deleteOne({ email });

    // Generate a 15-minute session token for the password reset step
    const secretKey = "secret";
    const key = new TextEncoder().encode(process.env.JWT_SECRET || secretKey);
    const sessionToken = await new SignJWT({ email, intent: "password_reset" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("15m")
      .sign(key);

    return NextResponse.json({ success: true, sessionToken }, { status: 200 });
  } catch (error: any) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
