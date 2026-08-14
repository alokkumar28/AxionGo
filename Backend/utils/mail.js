import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD,
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

export const sendDeliveryOtpMail = async (to, otp) => {
  await transporter.sendMail({
    from: `"AxionGo" <${process.env.APP_EMAIL}>`,
    to,
    subject: "Your AxionGo Delivery OTP",
    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 12px;
        background-color: #ffffff;
      ">
        <h2 style="color: #ff6b00;">
          AxionGo Delivery Verification
        </h2>
        <p>Hello,</p>
        <p>
          Your AxionGo delivery partner has reached your delivery location.
          Please provide the following OTP to the delivery partner to confirm
          your order delivery.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="
            display: inline-block;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 6px;
            color: #172b4d;
            background: #fff4e8;
            padding: 14px 28px;
            border-radius: 8px;
            border: 1px solid #ffd8b5;
          ">
            ${otp}
          </span>
        </div>
        <p>
          This OTP is valid for <strong>5 minutes</strong>.
        </p>
        <p>
          <strong>Do not share this OTP with anyone other than your
          AxionGo delivery partner.</strong>
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;" />
        <p style="font-size: 12px; color: #777;">
          This is an automated message from AxionGo. Please do not reply
          to this email.
        </p>
      </div>
    `,
  });
};
