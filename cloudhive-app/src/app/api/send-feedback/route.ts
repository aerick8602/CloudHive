import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  // Validate request method
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    const { feedback, userEmail } = await req.json();

    // Validate input
    if (!feedback || typeof feedback !== "string") {
      return NextResponse.json(
        { message: "Valid feedback is required" },
        { status: 400 }
      );
    }

    if (userEmail && typeof userEmail !== "string") {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedFeedback = feedback
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const sanitizedEmail = userEmail
      ? userEmail.replace(/</g, "&lt;").replace(/>/g, "&gt;")
      : "Anonymous";

    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Email credentials not configured");
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"CloudHive" <${process.env.EMAIL_USER}>`,
      to: "katiyarayush02@gmail.com",
      replyTo: userEmail || process.env.EMAIL_USER,
      subject: "🌟 New Feedback from CloudHive",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>CloudHive Feedback</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; color: #333;">
            <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto;">
                <tr>
                    <td style="padding: 30px 0 20px; text-align: center;">
                        <h1 style="margin: 0; color: #4F46E5;">CloudHive Feedback</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 0 0 20px;">
                        <div style="background: #f9fafb; border-left: 4px solid #4F46E5; padding: 16px; border-radius: 4px; margin-bottom: 16px;">
                            <p style="font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-line;">${sanitizedFeedback}</p>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px 0 30px; border-top: 1px solid #eee; font-size: 13px; color: #888;">
                        <p style="margin: 0;"><strong>From:</strong> ${sanitizedEmail}</p>
                        <p style="margin: 8px 0 0;"><strong>Received:</strong> ${new Date().toLocaleString()}</p>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px 0; text-align: center; font-size: 12px; color: #999;">
                        <p style="margin: 0;">This is an automated message from CloudHive. Please do not reply directly to this email.</p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
      `,
    });

    return NextResponse.json(
      { message: "Feedback sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending feedback:", error);
    return NextResponse.json(
      { message: "Failed to send feedback. Please try again later." },
      { status: 500 }
    );
  }
}
