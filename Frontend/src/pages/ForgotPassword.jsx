import React, { useState } from "react";
import axios from "axios";
import {
  UtensilsCrossed,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners"

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading , setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true)
    setErr("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        { email },
        { withCredentials: true },
      );
      setStep(2);
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
      setErr(
        error.response?.data?.message ||
          error.message ||
          "Failed to send OTP. Please try again.",
      );
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true)
    setErr("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true },
      );
      setStep(3);
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
      setErr(
        error.response?.data?.message ||
          error.message ||
          "OTP verification failed. Please try again.",
      );
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true)
    setErr("");
    if (!newPassword || !confirmPassword) {
      setErr("Please fill in all fields.");
      setLoading(false)
      return;
    }

    if (newPassword !== confirmPassword) {
      setErr("Passwords do not match.");
      setLoading(false)
      return;
    }
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        { email, newPassword },
        { withCredentials: true },
      );
      setLoading(false)
      navigate("/signin");
      
    } catch (error) {
      console.error(error);
      setLoading(false)
      setErr(
        error.response?.data?.message ||
          error.message ||
          "Failed to reset password. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50 relative flex items-center justify-center px-5 py-10">
      {/* Background Blur */}

      <div className="absolute w-96 h-96 bg-orange-300 rounded-full blur-[150px] opacity-40 -top-24 -left-24"></div>
      <div className="absolute w-80 h-80 bg-red-300 rounded-full blur-[150px] opacity-30 bottom-0 right-0"></div>
      <div className="absolute w-72 h-72 bg-yellow-300 rounded-full blur-[130px] opacity-20 top-1/2 left-1/2"></div>

      {/* Card */}

      <div className="relative w-full max-w-6xl bg-white/70 backdrop-blur-2xl rounded-[35px] shadow-2xl overflow-hidden border border-white">
        <div className="grid lg:grid-cols-2">
          {/* LEFT SECTION */}

          <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-orange-500 to-red-500 text-white p-14 relative overflow-hidden">
            <div className="absolute w-72 h-72 bg-white/10 rounded-full -top-24 -right-24"></div>
            <div className="absolute w-44 h-44 bg-white/10 rounded-full bottom-0 left-0"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-white text-orange-500 flex items-center justify-center shadow-lg">
                  <UtensilsCrossed size={32} />
                </div>
                <div>
                  <h1 className="text-5xl font-black">AxionGo</h1>
                  <p className="text-orange-100 mt-1">
                    Hot Meals. Fast Delivery.
                  </p>
                </div>
              </div>
              <h2 className="mt-14 text-4xl font-bold leading-tight">
                Recover your account
                <br />
                in just a few steps.
              </h2>
              <p className="mt-6 text-orange-100 text-lg leading-8">
                Verify your identity using your registered email and securely
                create a new password to continue enjoying AxionGo.
              </p>
              <div className="mt-12 space-y-4">
                <div className="flex items-center gap-3">
                  🔒 Secure Verification
                </div>
                <div className="flex items-center gap-3">✉️ Email OTP</div>
                <div className="flex items-center gap-3">
                  🔑 Create New Password
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}

          <div className="bg-white px-6 md:px-10 lg:px-12 py-10">
            {/* Mobile Logo */}

            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="h-14 w-14 rounded-full bg-orange-500 text-white flex items-center justify-center">
                <UtensilsCrossed />
              </div>

              <h1 className="text-3xl font-black text-orange-600">AxionGo</h1>
            </div>

            {/* Back Button */}

            <button
              type="button"
              onClick={() => navigate("/signin")}
              className=" cursor-pointer flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold transition-colors duration-300 mb-8"
            >
              <ArrowLeft size={20} />
              Back to Sign In
            </button>

            {/* Heading */}

            <h2 className="text-4xl font-black text-gray-900">
              Forgot Password
            </h2>

            <p className="text-gray-500 mt-2">
              Recover your account in three simple steps.
            </p>

            {/* Step Indicator */}

            <div className="flex items-center justify-between mt-10 mb-10">
              {/* Step 1 */}

              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all
                  ${
                    step >= 1
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  1
                </div>

                <p className="text-xs mt-2 text-gray-600">Email</p>
              </div>

              <div
                className={`h-1 flex-1 mx-2 rounded-full ${
                  step >= 2 ? "bg-orange-500" : "bg-gray-200"
                }`}
              ></div>

              {/* Step 2 */}

              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all
                  ${
                    step >= 2
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>

                <p className="text-xs mt-2 text-gray-600">OTP</p>
              </div>

              <div
                className={`h-1 flex-1 mx-2 rounded-full ${
                  step >= 3 ? "bg-orange-500" : "bg-gray-200"
                }`}
              ></div>

              {/* Step 3 */}

              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all
                  ${
                    step >= 3
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  3
                </div>

                <p className="text-xs mt-2 text-gray-600">Password</p>
              </div>
            </div>

            {/* ========================= STEP 1 ========================= */}

            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Verify Email
                  </h3>
                  <p className="text-gray-500 mt-1">
                    Enter your registered email address to receive an OTP.
                  </p>
                </div>
                <div className="relative">
                  <Mail
                    size={20}
                    className="absolute left-4 top-4 text-gray-400"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full border border-gray-300 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
                  />
                </div>
                <button
                  type="submit"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Send OTP */}
                  {loading?<ClipLoader size={20} color='white' />:"Send OTP"}
                </button>

                {/* Error Message */}
                <div className="h-5 mt-2 mb-1">
                  <p
                    className={`text-center text-sm font-medium text-red-500 transition-opacity duration-200 ${
                      err ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {err || " "}
                  </p>
                </div>
              </form>
            )}

            {/* ========================= STEP 2 ========================= */}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Verify OTP
                  </h3>

                  <p className="text-gray-500 mt-1">
                    Enter the 6-digit verification code sent to your email.
                  </p>
                </div>

                <div className="relative">
                  <Mail
                    size={20}
                    className="absolute left-4 top-4 text-gray-400"
                  />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    maxLength={6}
                    className="w-full border border-gray-300 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition tracking-[0.4em] text-center text-lg font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Verify OTP */}
                  {loading?<ClipLoader size={20} color='white' />:"Verify OTP"}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
                  >
                    Resend OTP
                  </button>

                  {/* Error Message */}
                  <div className="h-5 mt-2 mb-1">
                    <p
                      className={`text-center text-sm font-medium text-red-500 transition-opacity duration-200 ${
                        err ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {err || " "}
                    </p>
                  </div>
                </div>
              </form>
            )}

            {/* ========================= STEP 3 ========================= */}

            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Create New Password
                  </h3>

                  <p className="text-gray-500 mt-1">
                    Choose a strong password for your account.
                  </p>
                </div>

                {/* Password */}

                <div className="relative">
                  <Lock
                    size={20}
                    className="absolute left-4 top-4 text-gray-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full border border-gray-300 rounded-xl py-4 pl-12 pr-12 outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-orange-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Confirm Password */}

                <div className="relative">
                  <Lock
                    size={20}
                    className="absolute left-4 top-4 text-gray-400"
                  />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="w-full border border-gray-300 rounded-xl py-4 pl-12 pr-12 outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-orange-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>

                {/* Error Message */}
                <div className="h-5 mt-2 mb-1">
                  <p
                    className={`text-center text-sm font-medium text-red-500 transition-opacity duration-200 ${
                      err ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {err || " "}
                  </p>
                </div>

                <button
                  type="submit"
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Reset Password */}
                  {loading?<ClipLoader size={20} color='white'/>:"Reset Password"}
                </button>

                <div className="text-center text-sm text-gray-500">
                  Remember your password?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/signin")}
                    className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
