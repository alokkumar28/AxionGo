import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { FcGoogle } from "react-icons/fc";
import { User,Mail,Phone,Lock,Eye,EyeOff,UtensilsCrossed,Store,Bike,UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { ClipLoader } from "react-spinners"
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [err , setErr] = useState("")
  const [loading , setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const roles = [
    {
      name: "User",
      icon: <UserRound size={24} />,
      description: "Order delicious food",
    },
    {
      name: "Owner",
      icon: <Store size={24} />,
      description: "Manage your restaurant",
    },
    {
      name: "Delivery Boy",
      icon: <Bike size={24} />,
      description: "Deliver with AxionGo",
    },
  ];

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true)
    setErr("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          fullName, email, password, mobile,role
        },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data.user))
      setLoading(false)
    } 
    catch (error) {
      setLoading(false)
      setErr( error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

 
  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    setErr("");
    if (!mobile) {
      return alert("Please enter your mobile number.");
    }
    if (!role) {
      return alert("Please select your role.");
    }
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          fullName: user.displayName,
          email: user.email,
          mobile,
          role,
        }, {withCredentials: true}
      );
      dispatch(setUserData(data.user))
    } catch (error) {
        console.error(error);
        setErr(
          error.response?.data?.message ||
          error.message ||
          "Google Sign Up Failed. Please try again."
        );
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50 relative flex items-center justify-center px-5 py-10">
      <div className="absolute w-96 h-96 bg-orange-300 rounded-full blur-[150px] opacity-40 -top-24 -left-24"></div>
      <div className="absolute w-80 h-80 bg-red-300 rounded-full blur-[150px] opacity-30 bottom-0 right-0"></div>
      <div className="absolute w-72 h-72 bg-yellow-300 rounded-full blur-[130px] opacity-20 top-1/2 left-1/2"></div>
      <div className="relative w-full max-w-6xl bg-white/70 backdrop-blur-2xl rounded-[35px] shadow-2xl overflow-hidden border border-white">
        <div className="grid lg:grid-cols-2">
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
          <div className="bg-white px-6 md:px-10 lg:px-12 py-10">
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="h-14 w-14 rounded-full bg-orange-500 text-white flex items-center justify-center">
                <UtensilsCrossed />
              </div>
              <h1 className="text-3xl font-black text-orange-600">AxionGo</h1>
            </div>
            <h2 className="text-4xl font-black text-gray-900">
              Create Account
            </h2>
            <p className="text-gray-500 mt-2">Join AxionGo today.</p>
            <form className="mt-8 space-y-5">

              {/* Full Name */}
              <div className="relative">
                <User
                  size={20}
                  className="absolute left-4 top-4 text-gray-400"
                />
                <input
                  type="text"
                  name="fullname"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                  }}
                  placeholder="Full Name"
                  required
                  className="w-full border border-gray-300 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
                />
              </div>
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
                  required
                  className="w-full border border-gray-300 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
                />
              </div>
              {/* Mobile */}
              <div className="relative">
                <Phone
                  size={20}
                  className="absolute left-4 top-4 text-gray-400"
                />
                <input
                  type="tel"
                  name="mobile"
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value);
                  }}
                  placeholder="Mobile Number"
                  required
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
                  required
                  className="w-full border border-gray-300 rounded-xl py-4 pl-12 pr-12 outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Your Role
                </label>

                <div className=" grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {roles.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setRole(item.name)}
                      className={`cursor-pointer rounded-2xl border-2 p-4 transition-all duration-300
                                            ${
                                              role === item.name
                                                ? "border-orange-500 bg-orange-50 shadow-lg scale-105"
                                                : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-md"
                                            }`}
                    >
                      <div
                        className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3
                                                ${
                                                  role === item.name
                                                    ? "bg-orange-500 text-white"
                                                    : "bg-orange-100 text-orange-500"
                                                }`}
                      >
                        {item.icon}
                      </div>

                      <h3 className="font-bold text-gray-800">{item.name}</h3>

                      <p className="text-xs text-gray-500 mt-1">
                        {item.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input type="checkbox" required className="accent-orange-500 mt-1" />
                <p className="text-sm text-gray-600">
                  I agree to the
                  <span className="text-orange-500 font-semibold cursor-pointer">
                    {" "}
                    Terms & Conditions
                  </span>
                </p>
              </div>

              {/* Sign Up */}
              <button
                type="submit"
                onClick={handleSignUp}
                disabled={loading}
                className="cursor-pointer w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                {loading?<ClipLoader size={20} color='white'/>:"Create Account"}
              </button>
              {/* Error Message */}
              <div className="h-5 mt-2 mb-1">
                <p className={`text-center text-sm font-medium text-red-500 transition-opacity duration-200 ${
                    err ? "opacity-100" : "opacity-0" }`}
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
                  Continue with Google
                </span>
              </button>
            </form>
            <p className="text-center mt-8 text-gray-600">
              Already have an account?
              <button
                type="button"
                onClick={() => navigate("/signin")}
                className="cursor-pointer ml-2 font-bold text-orange-500 hover:text-orange-600"
              >
                Signin
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
