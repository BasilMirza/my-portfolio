import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter =
  process.env.EMAIL_ADDRESS && process.env.GMAIL_PASSKEY
    ? nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.GMAIL_PASSKEY,
        },
      })
    : null;

const generateEmailTemplate = (name, email, userMessage) => `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #007BFF;">New Message Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left: 4px solid #007BFF; padding-left: 10px; margin-left: 0;">
        ${userMessage}
      </blockquote>
      <p style="font-size: 12px; color: #888;">Click reply to respond to the sender.</p>
    </div>
  </div>
`;

export async function POST(request) {
  try {
    const payload = await request.json();
    const { name, email, message } = payload;

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
        },
        { status: 400 }
      );
    }

    if (!process.env.EMAIL_ADDRESS || !process.env.GMAIL_PASSKEY) {
      return NextResponse.json(
        {
          success: false,
          message: "Email service is not configured.",
        },
        { status: 500 }
      );
    }

    if (!transporter) {
      return NextResponse.json(
        {
          success: false,
          message: "Email transporter is not initialized.",
        },
        { status: 500 }
      );
    }

    const formattedMessage = `New message from ${name}\n\nEmail: ${email}\n\nMessage:\n\n${message}\n`;

    await transporter.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: process.env.EMAIL_ADDRESS,
      subject: `New Message From ${name}`,
      text: formattedMessage,
      html: generateEmailTemplate(name, email, message),
      replyTo: email,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send email.",
      },
      { status: 500 }
    );
  }
}