import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";
import { sendOtpMail } from "../utils/mail.js";

export const signUp = async (req, res) => {
  try {
    const { password, role } = req.body;
    const fullName = req.body.fullName.trim();
    const email = req.body.email.trim().toLowerCase();
    const mobile = req.body.mobile.trim();
    if (!fullName || !email || !password || !mobile || !role) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters.",
      });
    }
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({
        message: "Mobile number must contain exactly 10 digits.",
      });
    }
    if (mobile.length !== 10) {
      return res.status(400).json({
        message: "Mobile number must be exactly 10 digits.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      mobile,
      role,
      password: hashedPassword,
    });

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userData = user.toObject();
    delete userData.password;
    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: userData,
    });
  } catch (error) {
    console.log(error.response?.data);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    let existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({
        message: "User does not exist.",
      });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect password.",
      });
    }

    const token = await genToken(existingUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userData = existingUser.toObject();
    delete userData.password;

    return res.status(200).json({
      success: true,
      message: "Signin successful.",
      user: userData,
    });
  } catch (error) {
    console.log(error.response?.data);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email.",
      });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User does not exist.",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    existingUser.resetOtp = otp;
    existingUser.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    existingUser.isOtpVerified = false;
    await existingUser.save();
    await sendOtpMail(email, otp);
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }
    const existingUser = await User.findOne({
      email: email.trim().toLowerCase(),
    });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User does not exist.",
      });
    }
    if (existingUser.resetOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }
    if (existingUser.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
    }
    existingUser.isOtpVerified = true;
    existingUser.resetOtp = null;
    existingUser.otpExpires = null;
    await existingUser.save();
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required.",
      });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }
    const existingUser = await User.findOne({
      email: email.trim().toLowerCase(),
    });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User does not exist.",
      });
    }
    if (!existingUser.isOtpVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your OTP first.",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    existingUser.password = hashedPassword;
    existingUser.isOtpVerified = false;
    existingUser.resetOtp = null;
    existingUser.otpExpires = null;
    await existingUser.save();
    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { fullName, email, mobile, role } = req.body;
    if (!fullName || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "Full Name, Email and Role are required.",
      });
    }
    const allowedRoles = ["User", "Owner", "Delivery Boy"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role selected.",
      });
    }
    let user = await User.findOne({
      email: email.trim().toLowerCase(),
    });
    if (!user) {
      user = await User.create({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        mobile: mobile?.trim() || "",
        role,
      });
    }
    const token = genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const userData = user.toObject();
    delete userData.password;
    return res.status(200).json({
      success: true,
      message: "Google login successful.",
      user: userData,
    });
  } catch (error) {
    console.log("Google Auth Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};