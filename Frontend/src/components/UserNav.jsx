import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { GiKnifeFork } from "react-icons/gi";
import { FaChevronDown } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";

function UserNav({ searchQuery, setSearchQuery, setSearchResults }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const { userData, currentCity, cartItems } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true });
      dispatch(setUserData(null));
      navigate("/signin");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSearch = async (query) => {
    try {
      if (!query?.trim()) {
        setSearchResults([]);
        return;
      }
      const result = await axios.get(`${serverUrl}/api/item/search-items`, {
        params: { query: query.trim(), city: currentCity },
        withCredentials: true,
      });
      setSearchResults(result.data.items || []);
    } catch (error) {
      console.log("SEARCH ERROR:", error.response?.data?.message || error.message);
      setSearchResults([]);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-orange-100 bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 group">
            <div className="h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-all duration-300">
              <GiKnifeFork className="text-white text-base sm:text-lg lg:text-xl" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent tracking-tight">AxionGo</h1>
          </Link>

          <div className="hidden lg:flex items-center gap-2 ml-6 cursor-pointer">
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
              <HiOutlineLocationMarker className="text-orange-500 text-xl" />
            </div>
            <div className="leading-tight">
              <p className="text-xs text-gray-500">Deliver to</p>
              <p className="font-semibold text-gray-800 max-w-[170px] truncate">
                {currentCity?.length > 16 ? `${currentCity.slice(0, 16)}...` : currentCity}
              </p>
            </div>
          </div>

          <div className="hidden md:flex flex-1 mx-5 lg:mx-8">
            <div className="relative w-full">
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-400" />
              <input type="text" value={searchQuery} onChange={(e) => { const query = e.target.value; setSearchQuery(query); handleSearch(query); }} placeholder="Order your delicious food & discover restaurants..." className="w-full h-11 lg:h-12 rounded-full border border-orange-200 bg-orange-50/60 pl-12 lg:pl-14 pr-5 text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all" />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link to="/my-orders" className="font-medium text-gray-700 hover:text-orange-500 transition whitespace-nowrap">My Orders</Link>

            <Link to="/cart" className="relative group">
              <div className="h-10 w-10 lg:h-11 lg:w-11 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-500 transition-all duration-300">
                <FaShoppingCart className="text-lg lg:text-xl text-orange-500 group-hover:text-white" />
              </div>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-md">
                  {cartItems.length > 99 ? "99+" : cartItems.length}
                </span>
              )}
            </Link>

            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-1.5 group">
                <FaUserCircle className="text-[38px] lg:text-[42px] text-gray-600 group-hover:text-orange-500 transition" />
                <FaChevronDown className={`text-[10px] text-gray-500 transition-transform duration-300 ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
                  <div className="px-5 py-4 bg-orange-50">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="font-semibold text-gray-800 truncate">{userData.fullName}</p>
                  </div>

                  <Link to="/profile" onClick={() => setProfileOpen(false)} className="block px-5 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition">My Profile</Link>

                  <button onClick={handleLogOut} className="w-full flex items-center gap-2 px-5 py-3 text-red-500 hover:bg-red-50 transition">
                    <IoLogOutOutline className="text-lg" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
            {menuOpen ? <FaTimes className="text-orange-500 text-lg" /> : <FaBars className="text-orange-500 text-lg" />}
          </button>
        </div>

        <div className="md:hidden pb-2.5 sm:pb-3">
          <div className="relative">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400 text-sm" />
            <input type="text" value={searchQuery} onChange={(e) => { const query = e.target.value; setSearchQuery(query); handleSearch(query); }} placeholder="Order your favourite food..." className="w-full h-9 sm:h-10 rounded-full border border-orange-200 bg-orange-50 pl-10 pr-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
        </div>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-[450px]" : "max-h-0"}`}>
        <div className="px-4 pb-5 border-t border-orange-100 bg-white">
          <div className="flex items-center gap-3 py-4">
            <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center">
              <HiOutlineLocationMarker className="text-orange-500 text-lg" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500">Deliver to</p>
              <p className="text-sm font-semibold text-gray-800">
                {currentCity?.length > 16 ? `${currentCity.slice(0, 16)}...` : currentCity}
              </p>
            </div>
          </div>

          <Link to="/my-orders" onClick={() => setMenuOpen(false)} className="flex items-center justify-between py-3 border-b border-orange-100 text-sm text-gray-700 font-medium hover:text-orange-500">My Orders</Link>

          <Link to="/cart" onClick={() => setMenuOpen(false)} className="flex items-center justify-between py-3 border-b border-orange-100">
            <span className="text-sm font-medium text-gray-700">Cart</span>
            <span className="bg-orange-500 text-white text-[10px] px-2.5 py-1 rounded-full">{cartItems.length} Items</span>
          </Link>

          <div className="py-3">
            <button onClick={() => setProfileOpen(!profileOpen)} className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaUserCircle className="text-[36px] text-gray-600" />
                <div className="text-left">
                  <p className="text-[10px] text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-800">{userData.fullName}</p>
                </div>
              </div>
              <FaChevronDown className={`text-xs text-gray-500 transition-transform duration-300 ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${profileOpen ? "max-h-40 mt-3" : "max-h-0"}`}>
              <div className="rounded-xl border border-orange-100 bg-white shadow-sm">
                <Link to="/profile" onClick={() => { setProfileOpen(false); setMenuOpen(false); }} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition">My Profile</Link>
                <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition" onClick={() => { handleLogOut(); setProfileOpen(false); setMenuOpen(false); }}>
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

export default UserNav;