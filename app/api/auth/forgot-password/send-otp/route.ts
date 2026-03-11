import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { sendEmail } from "@/lib/email";

const emailSchema = z.string().email().endsWith("@gmail.com");

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Only valid @gmail.com addresses are allowed" },
        { status: 400 }
      );
    }

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

    const otps = db.collection("otps");
    
    // Ensure TTL Index exists
    console.log("Setting up TTL index for OTPs collection...");
    await otps.createIndex({ createdAt: 1 }, { expireAfterSeconds: 60 }); // 60 seconds validity

    // Generate 6 digit OTP
    const rawOtp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = await bcrypt.hash(rawOtp, 10);

    // Upsert OTP
    await otps.updateOne(
      { email },
      { 
        $set: { 
          email, 
          otp: hashedOtp, 
          createdAt: new Date() 
        } 
      },
      { upsert: true }
    );

    // Send email using nodemailer via existing lib
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px; text-align: center;">
        <h2 style="color: #111827; margin-bottom: 8px;">Reset your password</h2>
        <p style="color: #6b7280; font-size: 16px; margin-bottom: 24px;">Your Billify password reset code is:</p>
        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; display: inline-block;">
          <h1 style="font-size: 32px; letter-spacing: 8px; color: #2563eb; margin: 0;">${rawOtp}</h1>
        </div>
        <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">This code will expire in 60 seconds.</p>
      </div>
    `;

    await sendEmail(email, "Your Billify Password Reset Code", html);

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error: any) {
    console.error("Forgot password OTP error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
