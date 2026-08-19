import React,{useEffect} from "react";
import {Link,useNavigate} from "react-router-dom";
import {FaUserCircle,FaBars,FaTimes,FaChevronDown,FaPlus,FaClipboardList} from "react-icons/fa";
import {GiKnifeFork} from "react-icons/gi";
import {IoLogOutOutline} from "react-icons/io5";
import {useDispatch,useSelector} from "react-redux";
import axios from "axios";
import {serverUrl} from "../App";
import {setUserData} from "../redux/userSlice";

function OwnerNav(){
  const navigate=useNavigate();
  const [menuOpen,setMenuOpen]=React.useState(false);
  const [profileOpen,setProfileOpen]=React.useState(false);
  const {userData}=useSelector(state=>state.user);
  const {myShopData}=useSelector(state=>state.owner);
  const dispatch=useDispatch();
  const [orderCount,setOrderCount]=React.useState(0);
  const profileRef=React.useRef(null);

  useEffect(()=>{
    const handleOutside=e=>{if(profileRef.current&&!profileRef.current.contains(e.target))setProfileOpen(false);};
    document.addEventListener("mousedown",handleOutside);
    return()=>document.removeEventListener("mousedown",handleOutside);
  },[]);

  const handleLogOut=async()=>{
    try{
      await axios.get(`${serverUrl}/api/auth/signout`,{withCredentials:true});
      dispatch(setUserData(null));
      navigate("/signin");
    }catch(error){console.log(error.message);}
  };

  React.useEffect(()=>{
    const fetchPendingOrderCount=async()=>{
      try{
        const response=await axios.get(`${serverUrl}/api/order/my-orders`,{withCredentials:true});
        console.log("OWNER ORDERS:",response.data);
        const orders=response.data?.orders||[];
        const pendingCount=orders.filter(order=>{
          const status=String(order.shopOrder?.status||"").trim().toLowerCase();
          return status==="pending";
        }).length;
        setOrderCount(pendingCount);
        console.log("PENDING ORDER COUNT:",pendingCount);
      }catch(error){
        console.error("FAILED TO FETCH PENDING ORDER COUNT:",error.response?.data||error.message);
        setOrderCount(0);
      }
    };
    fetchPendingOrderCount();
  },[]);

  return(
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">
        <div className="h-14 sm:h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-sm"><GiKnifeFork className="text-white text-base sm:text-lg"/></div>
            <h1 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">AxionGo</h1>
          </Link>

          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            {myShopData&&<button onClick={()=>navigate("/add-item")} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3.5 lg:px-4 py-2 rounded-lg text-sm font-semibold transition"><FaPlus className="text-xs"/><span>Add Food Item</span></button>}

            <Link to="/my-orders" className={`group flex items-center gap-3 px-3.5 py-2 rounded-xl border transition-all ${orderCount>0?"bg-orange-50 border-orange-200 hover:bg-orange-100":"bg-white border-orange-100 hover:bg-orange-50"}`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${orderCount>0?"bg-orange-500 text-white":"bg-orange-50 text-orange-500"}`}><FaClipboardList className="text-sm"/></div>
              <div className="flex flex-col leading-tight"><span className="text-[10px] text-gray-500 font-medium">Restaurant</span><span className="text-sm font-bold text-gray-800 whitespace-nowrap">Pending Orders</span></div>
              <span className={`min-w-[26px] h-6 px-1.5 rounded-full flex items-center justify-center text-xs font-bold ${orderCount>0?"bg-orange-500 text-white":"bg-gray-200 text-gray-500"}`}>{orderCount>99?"99+":orderCount}</span>
            </Link>

            <div className="relative" ref={profileRef}>
              <button onClick={()=>setProfileOpen(!profileOpen)} className="flex items-center gap-1.5 px-1.5 py-1 rounded-lg hover:bg-orange-50 transition">
                <FaUserCircle className={`text-3xl lg:text-[36px] transition ${profileOpen?"text-orange-500":"text-gray-600"}`}/>
                <FaChevronDown className={`text-[9px] transition-transform duration-200 ${profileOpen?"rotate-180 text-orange-500":"text-gray-400"}`}/>
              </button>
              {profileOpen&&<div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-orange-100 shadow-lg overflow-hidden">
                <div className="px-4 py-3 bg-orange-50"><p className="text-[10px] text-gray-500">Signed in as</p><p className="text-sm font-semibold text-gray-800 truncate">{userData?.fullName}</p></div>
                <Link to="/profile" onClick={()=>setProfileOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition">My Profile</Link>
                <button onClick={handleLogOut} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"><IoLogOutOutline className="text-base"/>Logout</button>
              </div>}
            </div>
          </div>

          <button onClick={()=>setMenuOpen(!menuOpen)} className="md:hidden w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center border border-orange-100">{menuOpen?<FaTimes className="text-orange-500 text-base"/>:<FaBars className="text-orange-500 text-base"/>}</button>
        </div>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen?"max-h-[360px]":"max-h-0"}`}>
        <div className="border-t border-orange-100 bg-white px-3 sm:px-5 py-3 space-y-2">
          {myShopData&&<Link to="/add-item" onClick={()=>setMenuOpen(false)} className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg text-sm font-semibold transition"><FaPlus className="text-xs"/>Add Food Item</Link>}

          <Link to="/my-orders" onClick={()=>setMenuOpen(false)} className={`flex items-center justify-between px-3 py-3 rounded-xl border transition ${orderCount>0?"bg-orange-50 border-orange-200":"bg-white border-orange-100"}`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${orderCount>0?"bg-orange-500 text-white":"bg-orange-50 text-orange-500"}`}><FaClipboardList className="text-sm"/></div>
              <div><p className="text-[10px] text-gray-500 font-medium">Restaurant</p><p className="text-sm font-bold text-gray-800">Pending Orders</p></div>
            </div>
            <span className={`min-w-[28px] h-7 px-2 rounded-full flex items-center justify-center text-xs font-bold ${orderCount>0?"bg-orange-500 text-white":"bg-gray-200 text-gray-500"}`}>{orderCount>99?"99+":orderCount}</span>
          </Link>

          <div className="rounded-lg border border-gray-100 overflow-hidden">
            <button onClick={()=>setProfileOpen(!profileOpen)} className="w-full flex items-center justify-between px-3 py-2.5">
              <div className="flex items-center gap-2.5"><FaUserCircle className="text-3xl text-gray-600"/><div className="text-left min-w-0"><p className="text-[10px] text-gray-500">Signed in as</p><p className="text-sm font-semibold text-gray-800 truncate max-w-[190px]">{userData?.fullName}</p></div></div>
              <FaChevronDown className={`text-xs text-gray-400 transition-transform duration-200 ${profileOpen?"rotate-180 text-orange-500":""}`}/>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${profileOpen?"max-h-24":"max-h-0"}`}>
              <Link to="/profile" onClick={()=>{setMenuOpen(false);setProfileOpen(false);}} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition">My Profile</Link>
              <button onClick={()=>{handleLogOut();setMenuOpen(false);setProfileOpen(false);}} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"><IoLogOutOutline className="text-base"/>Logout</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default OwnerNav;