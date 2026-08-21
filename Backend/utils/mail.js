import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);
export const sendOtpMail = async (to, otp) => {
  const { data, error } = await resend.emails.send({
    from: `AxionGo <${process.env.EMAIL_FROM}>`,
    to: [to],
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h2>Reset Your Password</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      </div>
    `,
  });
  if (error) {
    console.error("Resend Error:", error);
    throw new Error(error.message);
  }
  return data;
};

export const sendDeliveryOtpMail = async (to, otp) => {
  const { data, error } = await resend.emails.send({
    from: `AxionGo <${process.env.EMAIL_FROM}>`,
    to: [to],
    subject: "Your AxionGo Delivery OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h2 style="color: #ff6b00;">AxionGo Delivery Verification</h2>

        <p>Your AxionGo delivery partner has reached your location.</p>

        <p>Please provide this OTP to the delivery partner:</p>

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
          ">
            ${otp}
          </span>
        </div>

        <p>This OTP is valid for <strong>5 minutes</strong>.</p>

        <p>
          <strong>Do not share this OTP with anyone other than your AxionGo delivery partner.</strong>
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend Error:", error);
    throw new Error(error.message);
  }

  return data;
};