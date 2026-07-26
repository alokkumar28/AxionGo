import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { FcGoogle } from "react-icons/fc";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UtensilsCrossed,
  Store,
  Bike,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        {
          email,
          password,
        },
        { withCredentials: true },
      );
      setLoading(false);
      dispatch(setUserData(result.data.user))
    } catch (error) {
      console.log(error.message);
      setLoading(false);
      setErr(
        error.response?.data?.message ||
          error.message ||
          "Sign In Failed. Please try again.",
      );
    }
  };

  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          email: user.email,
        },
        { withCredentials: true },
      );
      dispatch(setUserData(data.user))
      if (data.success) {
        console.log("Google Login Success");
        console.log(data.user);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setErr(
        error.response?.data?.message ||
          error.message ||
          "Google Sign In Failed. Please try again.",
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
          {/* LEFT */}

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
                Discover amazing food
                <br />
                delivered to your doorstep.
              </h2>
              <p className="mt-6 text-orange-100 text-lg leading-8">
                Order from nearby restaurants, become a delivery partner, or
                grow your restaurant business with AxionGo.
              </p>
              <div className="mt-12 space-y-4">
                <div className="flex items-center gap-3">🍕 Fresh Food</div>
                <div className="flex items-center gap-3">⚡ Fast Delivery</div>
                <div className="flex items-center gap-3">
                  📍 Live Order Tracking
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="bg-white px-6 md:px-10 lg:px-12 py-10">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="h-14 w-14 rounded-full bg-orange-500 text-white flex items-center justify-center">
                <UtensilsCrossed />
              </div>
              <h1 className="text-3xl font-black text-orange-600">AxionGo</h1>
            </div>
            <h2 className="text-4xl font-black text-gray-900">Welcome Back</h2>
            <p className="text-gray-500 mt-2">
              Ready for another delicious meal?
            </p>
            <form className="mt-8 space-y-5">
              {/* Email */}
              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-4 top-4 text-gray-400"
                />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  placeholder="Email Address"
                  className="w-full border border-gray-300 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock
                  size={20}
                  className="absolute left-4 top-4 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded-xl py-4 pl-12 pr-12 outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute right-4 top-4 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input type="checkbox" className="accent-orange-500 mt-1" />
                <p className="text-sm text-gray-600">
                  I agree to the
                  <span className="text-orange-500 font-semibold cursor-pointer">
                    {" "}
                    Terms & Conditions
                  </span>
                </p>
              </div>

              {/* Forgot Password? */}
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="cursor-pointer text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-200"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Sign In */}
              <button
                type="submit"
                onClick={handleSignIn}
                disabled={loading}
                className="cursor-pointer w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                {loading?<ClipLoader size={20} color='white'/>:"Sign in to your AxionGo account."}
              </button>
              {/* Error Messege */}

              <div className="h-5 mt-2 mb-1">
                <p
                  className={`text-center text-sm font-medium text-red-500 transition-opacity duration-200 ${
                    err ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {err || " "}
                </p>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-gray-500 text-sm">
                    OR
                  </span>
                </div>
              </div>
              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full border border-gray-300 rounded-xl py-4 flex items-center justify-center gap-3 hover:bg-orange-50 transition-all duration-300"
              >
                <FcGoogle className="w-6 h-6" />
                <span className="cursor-pointer font-semibold text-gray-700">
                  Sign in with Google
                </span>
              </button>
            </form>

            <p className="text-center mt-8 text-gray-600">
              Don't have an account?
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="cursor-pointer ml-2 font-bold text-orange-500 hover:text-orange-600"
              >
                Signup
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
