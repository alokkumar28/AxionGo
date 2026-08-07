import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaPlus,
  FaClipboardList,
} from "react-icons/fa";
import { GiKnifeFork } from "react-icons/gi";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";

function OwnerNav() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const { userData } = useSelector((state) => state.user);
  const { myShopData } = useSelector((state) => state.owner);
  const dispatch = useDispatch();
  let orderCount = 0;
  const profileRef = React.useRef(null);

  React.useEffect(() => {
    const handleOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);
  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });

      dispatch(setUserData(null));
      navigate("/signin")
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-orange-100 bg-white/90 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* ================= NAVBAR ================= */}
        <div className="flex h-20 items-center justify-between">
          {/* ================= LOGO ================= */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-md group-hover:scale-105 transition">
              <GiKnifeFork className="text-white text-xl" />
            </div>

            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              AxionGo
            </h1>
          </Link>
          {/* ================= DESKTOP MENU ================= */}
          <div className="hidden md:flex items-center gap-5">
            {/* Add Food */}
            {myShopData && (
              <Link
                to="/add-item"
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-3 font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition duration-300"
              >
                <FaPlus />
                Add Food Item
              </Link>
            )}
            {/* Orders */}
            <Link
              to="/my-orders"
              className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-orange-50 transition"
            >
              <FaClipboardList className="text-orange-500 text-xl" />
              <span className="font-semibold text-gray-700">
                Pending Orders
              </span>
              <span
                className={`min-w-[24px] h-6 rounded-full text-xs font-bold flex items-center justify-center text-white ${
                  orderCount > 0 ? "bg-red-500" : "bg-gray-400"
                }`}
              >
                {orderCount > 99 ? "99+" : orderCount}
              </span>
            </Link>
            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 group"
              >
                <FaUserCircle className="text-[42px] text-gray-600 group-hover:text-orange-500 transition" />

                <FaChevronDown
                  className={`text-xs transition duration-300 ${
                    profileOpen ? "rotate-180 text-orange-500" : "text-gray-500"
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-60 rounded-2xl bg-white border border-orange-100 shadow-2xl overflow-hidden animate-in zoom-in fade-in duration-200">
                  <div className="bg-orange-50 px-5 py-4">
                    <p className="text-xs text-gray-500">Signed in as</p>

                    <p className="font-semibold text-gray-800 truncate">
                      {userData?.fullName}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block px-5 py-3 hover:bg-orange-50 hover:text-orange-500 transition"
                  >
                    My Profile
                  </Link>

                  <button
                    onClick={handleLogOut}
                    className="w-full flex items-center gap-2 px-5 py-3 text-red-500 hover:bg-red-50 transition"
                  >
                    <IoLogOutOutline className="text-lg" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* ================= MOBILE MENU BUTTON ================= */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden h-11 w-11 rounded-xl bg-orange-100 flex items-center justify-center"
          >
            {menuOpen ? (
              <FaTimes className="text-orange-500 text-xl" />
            ) : (
              <FaBars className="text-orange-500 text-xl" />
            )}
          </button>
        </div>
      </div>
      {/* ================= MOBILE MENU ================= */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-[450px]" : "max-h-0"
        }`}
      >
        <div className="bg-white border-t border-orange-100 px-5 py-5 space-y-4">
          {/* Add Food */}
          {myShopData && (
            <Link
              to="/add-item"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 shadow-md"
            >
              <FaPlus />
              Add Food Item
            </Link>
          )}
          {/* Orders */}
          <Link
            to="/my-orders"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-between rounded-xl border border-orange-100 px-4 py-3 hover:bg-orange-50 transition"
          >
            <div className="flex items-center gap-3">
              <FaClipboardList className="text-orange-500" />
              <span className="font-medium text-gray-700">Pending Orders</span>
            </div>
            <span
              className={`min-w-[26px] h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                orderCount > 0 ? "bg-red-500" : "bg-gray-400"
              }`}
            >
              {orderCount}
            </span>
          </Link>
          {/* Profile */}
          <div className="rounded-xl border border-orange-100 overflow-hidden">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-full flex items-center justify-between px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <FaUserCircle className="text-4xl text-gray-600" />
                <div className="text-left">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="font-semibold text-gray-800">
                    {userData?.fullName}
                  </p>
                </div>
              </div>
              <FaChevronDown
                className={`transition duration-300 ${
                  profileOpen && "rotate-180"
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                profileOpen ? "max-h-40" : "max-h-0"
              }`}
            >
              <Link
                to="/profile"
                onClick={() => {
                  setMenuOpen(false);
                  setProfileOpen(false);
                }}
                className="block px-5 py-3 hover:bg-orange-50 hover:text-orange-500 transition"
              >
                My Profile
              </Link>
              <button
                onClick={() => {
                  handleLogOut();
                  setMenuOpen(false);
                  setProfileOpen(false);
                }}
                className="w-full flex items-center gap-2 px-5 py-3 text-red-500 hover:bg-red-50 transition"
              >
                <IoLogOutOutline className="text-lg" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default OwnerNav;
