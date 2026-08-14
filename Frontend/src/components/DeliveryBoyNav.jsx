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
      await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true });
      dispatch(setUserData(null));
      navigate("/signin");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <nav className="sticky top-0 z-[1000] w-full bg-white border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="h-14 sm:h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-sm">
              <GiKnifeFork className="text-white text-base sm:text-lg" />
            </div>
            <span className="text-xl sm:text-2xl font-extrabold text-orange-500 tracking-tight">AxionGo</span>
          </Link>

          <div className="hidden md:flex items-center gap-5 lg:gap-7">
            <Link to="/my-orders" className="text-sm lg:text-base font-semibold text-gray-700 hover:text-orange-500 transition">My Orders</Link>

            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-orange-50 transition">
                <FaUserCircle className="text-[32px] lg:text-[36px] text-gray-500 hover:text-orange-500 transition" />
                <FaChevronDown className={`text-[9px] text-gray-500 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  <div className="px-4 py-3 bg-orange-50 border-b border-orange-100">
                    <p className="text-[10px] text-gray-500">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-800 truncate mt-0.5">{userData?.fullName}</p>
                  </div>

                  <Link to="/profile" onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition">My Profile</Link>

                  <button onClick={handleLogOut} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition">
                    <IoLogOutOutline className="text-base" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          <button onClick={() => { setMenuOpen(!menuOpen); setProfileOpen(false); }} className="md:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center transition hover:bg-orange-100">
            {menuOpen ? <FaTimes className="text-orange-500 text-lg" /> : <FaBars className="text-orange-500 text-lg" />}
          </button>
        </div>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-200 border-t border-orange-100 ${menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0 border-t-0"}`}>
        <div className="px-3 sm:px-4 py-2.5 bg-white">
          <Link to="/my-orders" onClick={() => setMenuOpen(false)} className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition">My Orders</Link>

          <div className="mt-1">
            <button onClick={() => setProfileOpen(!profileOpen)} className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-orange-50 transition">
              <div className="flex items-center gap-2.5">
                <FaUserCircle className="text-[30px] text-gray-500" />
                <div className="text-left min-w-0">
                  <p className="text-[10px] text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-800 truncate max-w-[180px]">{userData?.fullName}</p>
                </div>
              </div>
              <FaChevronDown className={`text-[10px] text-gray-500 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            <div className={`overflow-hidden transition-all duration-200 ${profileOpen ? "max-h-28 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
              <div className="ml-3 border-l-2 border-orange-100 pl-2">
                <Link to="/profile" onClick={() => { setProfileOpen(false); setMenuOpen(false); }} className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition">My Profile</Link>

                <button onClick={() => { handleLogOut(); setProfileOpen(false); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition">
                  <IoLogOutOutline className="text-base" />
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