import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 40px 20px; text-align: center; }
            .content { padding: 30px; background-color: #ffffff; }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
            .label { font-weight: bold; color: #2563eb; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; margin-bottom: 4px; display: block; }
            .value { font-size: 16px; margin-bottom: 24px; color: #1f2937; }
            .message-box { background-color: #f3f4f6; padding: 20px; border-radius: 8px; font-style: italic; color: #374151; white-space: pre-wrap; }
            .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; display: block; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <span class="logo">Billify</span>
              <h2>New Contact Message</h2>
            </div>
            <div class="content">
              <span class="label">From</span>
              <div class="value">${name} &lt;${email}&gt;</div>
              
              <span class="label">Message</span>
              <div class="message-box">${message}</div>
            </div>
            <div class="footer">
              <p>This message was sent from the Billify contact form.</p>
              <p>&copy; ${new Date().getFullYear()} Billify. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send the email
    await sendEmail(
      process.env.EMAIL_USER!,
      `Contact Form: ${name}`,
      emailHtml
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
