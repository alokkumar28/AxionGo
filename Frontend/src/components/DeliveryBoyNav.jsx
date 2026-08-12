import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { GiKnifeFork } from "react-icons/gi";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";

function DeliveryBoyNav() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      navigate("/signin");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-orange-100 bg-white/90 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-300">
              <GiKnifeFork className="text-white text-xl" />
            </div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent tracking-tight">
              AxionGo
            </h1>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/my-orders"
              className="font-medium text-gray-700 hover:text-orange-500 transition"
            >
              My Orders
            </Link>
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 group"
              >
                <FaUserCircle className="text-[42px] text-gray-600 group-hover:text-orange-500 transition" />
                <FaChevronDown
                  className={`text-xs text-gray-500 transition-transform duration-300 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
                  <div className="px-5 py-4 bg-orange-50">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="font-semibold text-gray-800 truncate">
                      {userData?.fullName}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block px-5 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition"
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
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden h-11 w-11 rounded-lg bg-orange-100 flex items-center justify-center"
          >
            {menuOpen ? (
              <FaTimes className="text-orange-500 text-xl" />
            ) : (
              <FaBars className="text-orange-500 text-xl" />
            )}
          </button>
        </div>
      </div>
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-[400px]" : "max-h-0"
        }`}
      >
        <div className="px-5 pb-6 border-t border-orange-100 bg-white">
          <Link
            to="/my-orders"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-between py-4 border-b border-orange-100 text-gray-700 font-medium hover:text-orange-500"
          >
            My Orders
          </Link>
          <div className="py-4">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <FaUserCircle className="text-[42px] text-gray-600" />
                <div className="text-left">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="font-semibold text-gray-800">
                    {userData?.fullName}
                  </p>
                </div>
              </div>
              <FaChevronDown
                className={`text-gray-500 transition-transform duration-300 ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                profileOpen ? "max-h-40 mt-4" : "max-h-0"
              }`}
            >
              <div className="rounded-xl border border-orange-100 bg-white shadow-sm">
                <Link
                  to="/profile"
                  onClick={() => {
                    setProfileOpen(false);
                    setMenuOpen(false);
                  }}
                  className="block px-5 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition"
                >
                  My Profile
                </Link>
                <button
                  className="w-full flex items-center gap-2 px-5 py-3 text-red-500 hover:bg-red-50 transition"
                  onClick={() => {
                    handleLogOut();
                    setProfileOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  <IoLogOutOutline className="text-lg" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default DeliveryBoyNav;
