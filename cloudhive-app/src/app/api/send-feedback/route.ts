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
      subject: "New Feedback from CloudHive",
      html: `
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>New Feedback - CloudHive</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            color: #222;
            line-height: 1.5;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 0 15px;
        }
        .header {
            padding: 25px 0;
            border-bottom: 1px solid #e1e4e8;
            margin-bottom: 20px;
        }
        .header h1 {
            font-size: 20px;
            margin: 0;
            color: #2d333b;
        }
        .content {
            background: white;
            padding: 25px;
            border-radius: 6px;
            border: 1px solid #e1e4e8;
            box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .feedback {
            background: #f6f8fa;
            padding: 16px;
            margin: 16px 0;
            border-radius: 6px;
            border-left: 3px solid #4F46E5;
            white-space: pre-line;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 14px;
            line-height: 1.5;
        }
        .meta {
            font-size: 14px;
            color: #57606a;
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid #e1e4e8;
        }
        .meta-item {
            margin-bottom: 8px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e1e4e8;
            font-size: 12px;
            color: #57606a;
            text-align: center;
        }
        
        @media (max-width: 480px) {
            .container {
                padding: 0 12px;
            }
            .content {
                padding: 20px;
            }
            .feedback {
                padding: 14px;
                margin: 14px 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New CloudHive Feedback</h1>
        </div>
        
        <div class="content">
            <p>Hey Dev,</p>
            <p>You've received new user feedback:</p>
            
            <div class="feedback">
                ${sanitizedFeedback}
            </div>
            
            <div class="meta">
                <div class="meta-item"><strong>Email:</strong> ${sanitizedEmail || "Anonymous"}</div>
                <div class="meta-item"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</div>
                <div class="meta-item"><strong>User Agent:</strong> ${req.headers.get("user-agent") || "Unknown"}</div>
            </div>
        </div>
        
        <div class="footer">
            <p>Sent from CloudHive backend • ${new Date().getFullYear()}</p>
        </div>
    </div>
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
