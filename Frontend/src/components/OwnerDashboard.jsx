import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaStore, FaMapMarkerAlt, FaUtensils, FaBoxOpen, FaStar, FaPlus } from "react-icons/fa";
import OwnerNav from "./OwnerNav";
import RegisterShopCard from "./RegisterShopCard";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import axios from "axios";
import ItemCard from "./ItemCard";

function OwnerDashboard() {
  const navigate = useNavigate();
  const { myShopData } = useSelector((state) => state.owner);
  const dispatch = useDispatch();

  useEffect(() => {
    if (myShopData !== undefined) return;
    const fetchMyShop = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/shop/get-my-shop`, { withCredentials: true });
        dispatch(setMyShopData(res.data.shop));
      } catch (error) {
        if (error.response?.status === 404) dispatch(setMyShopData(null));
        else console.error(error);
      }
    };
    fetchMyShop();
  }, [dispatch, myShopData]);

  const handleUIAfterDelete = (updatedShop) => {
    dispatch(setMyShopData(updatedShop));
  };

  return (
    <div className="min-h-screen bg-[#fffaf5]">
      <OwnerNav />
      {myShopData === undefined && (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin" />
            <p className="mt-3 text-sm text-gray-500">Loading your dashboard...</p>
          </div>
        </div>
      )}
      {myShopData === null && (
        <main className="max-w-6xl mx-auto px-3 sm:px-5 lg:px-6 py-5 sm:py-7">
          <RegisterShopCard />
        </main>
      )}
      {myShopData && (
        <main className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-4 sm:py-6 lg:py-7">
          <section className="relative bg-white border border-orange-100 rounded-2xl shadow-sm overflow-hidden">
            <button onClick={() => navigate("/create-edit-shop")} aria-label="Edit shop" className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-md transition">
              <FaEdit className="text-sm sm:text-base" />
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative h-52 sm:h-64 lg:h-[330px]">
                <img src={myShopData.image} alt={myShopData.name} className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 sm:px-5 py-4">
                  <h1 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">{myShopData.name}</h1>
                </div>
              </div>
              <div className="p-4 sm:p-5 lg:p-7 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 w-fit bg-orange-50 border border-orange-100 text-orange-600 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold">
                  <FaStore />
                  Registered Shop
                </div>
                <h2 className="mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-[#172b4d] leading-tight">Welcome Back!</h2>
                <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-500 leading-6 sm:leading-7 max-w-xl">Your restaurant is now visible on AxionGo. Customers can discover your shop and browse your menu.</p>
                <div className="mt-4 sm:mt-5 flex items-start gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                    <FaMapMarkerAlt className="text-orange-500 text-sm sm:text-base" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-[#172b4d]">Shop Address</h3>
                    <p className="mt-1 text-xs sm:text-sm text-gray-500 leading-5">{myShopData.address}<br />{myShopData.city}, {myShopData.state}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-3 gap-2.5 sm:gap-4 mt-4 sm:mt-5">
            <div className="bg-white border border-orange-100 rounded-xl shadow-sm p-3 sm:p-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <FaUtensils className="text-orange-500 text-sm sm:text-base" />
              </div>
              <p className="mt-2 text-[10px] sm:text-xs text-gray-500 font-medium">Food Items</p>
              <p className="mt-0.5 text-xl sm:text-2xl lg:text-3xl font-bold text-orange-500">{myShopData.items.length}</p>
            </div>
            <div className="bg-white border border-orange-100 rounded-xl shadow-sm p-3 sm:p-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <FaBoxOpen className="text-orange-500 text-sm sm:text-base" />
              </div>
              <p className="mt-2 text-[10px] sm:text-xs text-gray-500 font-medium">Orders</p>
              <p className="mt-0.5 text-xl sm:text-2xl lg:text-3xl font-bold text-orange-500">0</p>
            </div>
            <div className="bg-white border border-orange-100 rounded-xl shadow-sm p-3 sm:p-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <FaStar className="text-orange-500 text-sm sm:text-base" />
              </div>
              <p className="mt-2 text-[10px] sm:text-xs text-gray-500 font-medium">Rating</p>
              <p className="mt-0.5 text-xl sm:text-2xl lg:text-3xl font-bold text-orange-500">0.0</p>
            </div>
          </section>

          {myShopData?.items?.length === 0 && (
            <section className="mt-5 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 shadow-sm">
              <div className="px-4 sm:px-7 lg:px-10 py-7 sm:py-9 text-center text-white">
                <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/15 flex items-center justify-center">
                  <FaUtensils className="text-xl sm:text-2xl" />
                </div>
                <h2 className="mt-3 sm:mt-4 text-xl sm:text-2xl lg:text-3xl font-bold">Start Building Your Menu</h2>
                <p className="mt-2 max-w-2xl mx-auto text-xs sm:text-sm text-orange-100 leading-5 sm:leading-6">Your shop is now live on AxionGo. Add delicious food items with attractive images and pricing so customers can discover your menu.</p>
                <button onClick={() => navigate("/add-item")} className="mt-5 inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:bg-orange-50 transition">
                  <FaPlus />
                  Add Food Item
                </button>
              </div>
            </section>
          )}

          {myShopData?.items?.length > 0 && (
            <section className="mt-6 sm:mt-7">
              <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#172b4d]">Your Menu</h2>
                  <p className="mt-0.5 text-[11px] sm:text-xs text-gray-500">Manage your restaurant food items</p>
                </div>
                <span className="shrink-0 bg-orange-50 border border-orange-100 text-orange-600 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold">{myShopData.items.length} {myShopData.items.length === 1 ? "Item" : "Items"}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {myShopData.items.map((item) => (
                  <ItemCard key={item._id} item={item} onDelete={handleUIAfterDelete} />
                ))}
              </div>
            </section>
          )}
        </main>
      )}
    </div>
  );
}

export default OwnerDashboard;