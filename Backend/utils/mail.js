import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD, // Gmail App Password
  },
});

export const sendOtpMail = async (to, otp) => {
  await transporter.sendMail({
    from: `"Axiongo" <${process.env.APP_EMAIL}>`,
    to,
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>Hello,</p>
        <p>
          We received a request to reset your password.
          Use the following One-Time Password (OTP) to continue:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 6px; background: #f5f5f5; padding: 12px 24px; border-radius: 6px;">
            ${otp}
          </span>
        </div>
        <p>This OTP is valid for <strong>5 minutes</strong>.</p>
        <p>If you didn't request this password reset, you can safely ignore this email.</p>
        <hr />
        <p style="font-size: 12px; color: #777;">
          This is an automated message from Axiongo. Please do not reply.
        </p>
      </div>
    `,
  });
};