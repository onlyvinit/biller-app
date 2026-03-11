import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import bcrypt from "bcryptjs";
import { login } from "@/lib/auth";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().endsWith("@gmail.com"),
  password: z.string()
    .min(8)
    .regex(/[0-9]/)
    .regex(/[^a-zA-Z0-9]/),
  otp: z.string().length(6),
  restaurantName: z.string().min(2),
  restaurantAddress: z.string().min(5),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Final check for all data using Zod
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input data", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password, otp, restaurantName, restaurantAddress } = body;

    const client = await clientPromise;
    const db = client.db("billify");
    
    // Check if user already exists
    const users = db.collection("users");
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      restaurantName,
      restaurantAddress,
      createdAt: new Date(),
    });

    const user = {
      id: result.insertedId.toString(),
      name,
      email,
    };

    // Clean up OTP to prevent reuse
    await otps.deleteOne({ email });

    // Log the user in
    await login(user);

    return NextResponse.json({ user }, { status: 201 });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
