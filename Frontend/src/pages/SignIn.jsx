import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { FcGoogle } from "react-icons/fc";
import { Mail, Lock, Eye, EyeOff, UtensilsCrossed } from "lucide-react";
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
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const result = await axios.post(`${serverUrl}/api/auth/signin`, { email, password }, { withCredentials: true });
      setLoading(false);
      dispatch(setUserData(result.data.user));
    } catch (error) {
      console.log(error.message);
      setLoading(false);
      setErr(error.response?.data?.message || error.message || "Sign In Failed. Please try again.");
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
      const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, { email: user.email }, { withCredentials: true });
      dispatch(setUserData(data.user));
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setErr(error.response?.data?.message || error.message || "Google Sign In Failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 px-3 sm:px-5 lg:px-8 py-4 sm:py-6 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl border border-orange-100 shadow-xl overflow-hidden">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
          <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-500 text-white p-8 xl:p-10">
            <div className="absolute w-64 h-64 rounded-full bg-white/10 -top-24 -right-20" />
            <div className="absolute w-44 h-44 rounded-full bg-white/10 -bottom-20 -left-16" />
            <div className="relative z-10 flex flex-col justify-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-md">
                  <UtensilsCrossed className="text-orange-500" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold">AxionGo</h1>
                  <p className="text-orange-100 text-xs">Hot Meals. Fast Delivery.</p>
                </div>
              </div>
              <h2 className="mt-10 text-3xl xl:text-4xl font-bold leading-tight">Delicious food,<br />delivered to you.</h2>
              <p className="mt-4 text-orange-100 text-sm xl:text-base leading-6 max-w-md">Order from nearby restaurants, track your delivery, and enjoy your favourite meals with AxionGo.</p>
              <div className="mt-8 space-y-3 text-sm">
                <div>🍕 Fresh Food</div>
                <div>⚡ Fast Delivery</div>
                <div>📍 Live Order Tracking</div>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 md:px-8 lg:px-9 py-5 sm:py-7">
            <div className="lg:hidden flex items-center justify-center gap-2.5 mb-5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-orange-500 flex items-center justify-center shadow-sm">
                <UtensilsCrossed className="text-white" size={20} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-orange-500">AxionGo</h1>
            </div>

            <div className="mb-5">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Ready for another delicious meal?</p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-3.5 sm:space-y-4">
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full h-11 sm:h-12 rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition" />
              </div>

              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? "text" : "password"} name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full h-11 sm:h-12 rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-10 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex items-center justify-between gap-3">
                <label className="flex items-start gap-2 min-w-0">
                  <input type="checkbox" className="accent-orange-500 mt-0.5 shrink-0" />
                  <span className="text-[11px] sm:text-xs text-gray-500 leading-4">I agree to the <span className="text-orange-500 font-semibold ml-1">Terms & Conditions</span></span>
                </label>
                <button type="button" onClick={() => navigate("/forgot-password")} className="text-[11px] sm:text-xs font-semibold text-orange-500 hover:text-orange-600 whitespace-nowrap">Forgot Password?</button>
              </div>

              <div className="min-h-4">
                <p className={`text-center text-xs font-medium text-red-500 transition-opacity ${err ? "opacity-100" : "opacity-0"}`}>{err || " "}</p>
              </div>

              <button type="submit" disabled={loading} className="w-full h-11 sm:h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold shadow-md hover:shadow-lg hover:opacity-95 transition disabled:opacity-60 flex items-center justify-center">
                {loading ? <ClipLoader size={19} color="white" /> : "Sign In"}
              </button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                <div className="relative flex justify-center"><span className="bg-white px-3 text-[10px] sm:text-xs text-gray-400">OR</span></div>
              </div>

              <button type="button" onClick={handleGoogleAuth} disabled={loading} className="w-full h-11 sm:h-12 rounded-xl border border-gray-200 bg-white flex items-center justify-center gap-2 hover:bg-orange-50 hover:border-orange-200 transition disabled:opacity-60">
                <FcGoogle className="w-5 h-5" />
                <span className="text-xs sm:text-sm font-semibold text-gray-700">Sign in with Google</span>
              </button>
            </form>

            <p className="text-center mt-5 text-xs sm:text-sm text-gray-500">
              Don't have an account?
              <button type="button" onClick={() => navigate("/signup")} className="ml-1.5 font-bold text-orange-500 hover:text-orange-600">Sign up</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;